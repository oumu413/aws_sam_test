export enum HttpVerb {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  HEAD = "HEAD",
  DELETE = "DELETE",
  OPTIONS = "OPTIONS",
  ALL = "*"
}

interface MethodEntry {
  resourceArn: string
  conditions: Record<string, any> | null
}

export class AuthPolicy {
  awsAccountId: string
  principalId: string
  version: string = "2012-10-17"
  pathRegex: RegExp = /^[/.a-zA-Z0-9-\*]+$/
  allowMethods: MethodEntry[] = []
  denyMethods: MethodEntry[] = []
  restApiId: string = "*"
  region: string = "*"
  stage: string = "*"

  constructor(principal: string, awsAccountId: string) {
    this.awsAccountId = awsAccountId
    this.principalId = principal
  }

  private _addMethod(effect: "Allow" | "Deny", verb: string, resource: string, conditions: Record<string, any> | null) {
    if (verb !== "*" && !(Object.values(HttpVerb).includes(verb as HttpVerb))) {
      throw new Error(`Invalid HTTP verb ${verb}. Allowed verbs in HttpVerb enum`)
    }

    if (!this.pathRegex.test(resource)) {
      throw new Error(`Invalid resource path: ${resource}. Path should match ${this.pathRegex}`)
    }

    if (resource.startsWith("/")) {
      resource = resource.slice(1)
    }

    const resourceArn = `arn:aws:execute-api:${this.region}:${this.awsAccountId}:${this.restApiId}/${this.stage}/${verb}/${resource}`

    const entry: MethodEntry = { resourceArn, conditions }

    if (effect === "Allow") {
      this.allowMethods.push(entry)
    } else {
      this.denyMethods.push(entry)
    }
  }

  private _getEmptyStatement(effect: string) {
    return {
      Action: "execute-api:Invoke",
      Effect: effect.charAt(0).toUpperCase() + effect.slice(1).toLowerCase(),
      Resource: [] as string[],
      Condition: undefined as Record<string, any> | undefined
    }
  }

  private _getStatementForEffect(effect: string, methods: MethodEntry[]) {
    const statements: any[] = []

    if (methods.length > 0) {
      const statement = this._getEmptyStatement(effect)

      for (const curMethod of methods) {
        if (!curMethod.conditions || Object.keys(curMethod.conditions).length === 0) {
          statement.Resource.push(curMethod.resourceArn)
        } else {
          const conditionalStatement = this._getEmptyStatement(effect)
          conditionalStatement.Resource.push(curMethod.resourceArn)
          conditionalStatement["Condition"] = curMethod.conditions
          statements.push(conditionalStatement)
        }
      }

      statements.push(statement)
    }

    return statements
  }

  allowAllMethods() {
    this._addMethod("Allow", HttpVerb.ALL, "*", null)
  }
  denyAllMethods() {
    this._addMethod("Deny", HttpVerb.ALL, "*", null)
  }
  allowMethod(verb: HttpVerb, resource: string) {
    this._addMethod("Allow", verb, resource, null)
  }
  denyMethod(verb: HttpVerb, resource: string) {
    this._addMethod("Deny", verb, resource, null)
  }
  allowMethodWithConditions(verb: HttpVerb, resource: string, conditions: Record<string, any>) {
    this._addMethod("Allow", verb, resource, conditions)
  }
  denyMethodWithConditions(verb: HttpVerb, resource: string, conditions: Record<string, any>) {
    this._addMethod("Deny", verb, resource, conditions)
  }

  build() {
    if (this.allowMethods.length === 0 && this.denyMethods.length === 0) {
      throw new Error("No statements defined for the policy")
    }

    const policy = {
      principalId: this.principalId,
      policyDocument: {
        Version: this.version,
        Statement: [] as any[]
      }
    }

    policy.policyDocument.Statement.push(...this._getStatementForEffect("Allow", this.allowMethods))
    policy.policyDocument.Statement.push(...this._getStatementForEffect("Deny", this.denyMethods))

    return policy
  }
}