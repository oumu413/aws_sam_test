import { jwtVerify, createRemoteJWKSet, JWTPayload } from "jose"
import  logger  from "@commons/logger"
import authManager, { UserRoles } from "@commons/auth_manager"
import { AuthPolicy, HttpVerb } from "./authPolicy.js"

interface APIGatewayAuthorizerEvent {
  authorizationToken: string
  methodArn: string
}

interface AuthResponse {
  principalId: string
  policyDocument: {
    Version: string
    Statement: Array<{
      Action: string
      Effect: string
      Resource: string[]
      Condition?: Record<string, any>
    }>
  }
  context?: Record<string, any>
  usageIdentifierKey?: string
}

const region = process.env.AWS_REGION

const operationsUsersUserPoolId = process.env.OPERATIONS_USERS_USER_POOL!
const operationsUsersAppClientId = process.env.OPERATIONS_USERS_APP_CLIENT!


export const handler = async (event: APIGatewayAuthorizerEvent): Promise<AuthResponse> => {
  const tokenParts = event.authorizationToken.split(" ")
  if (tokenParts[0] !== "Bearer") {
    throw new Error("Authorization header should have format Bearer <JWT>")
  }
  const jwtBearerToken = tokenParts[1]

  logger.info("Method ARN:" + event.methodArn)

  const unverifiedClaims = JSON.parse(Buffer.from(jwtBearerToken.split(".")[1], "base64").toString())
  logger.info(unverifiedClaims)

  if (!authManager.isSaaSProvider(unverifiedClaims["custom:userRole"])) {
    logger.error("JWT userRole is invalid")
    throw new Error("JWT userRole is invalid")
  }

  const claims = await validateJWT(jwtBearerToken, operationsUsersAppClientId, operationsUsersUserPoolId)
  if (!claims) {
    logger.error("Unauthorized")
    throw new Error("Unauthorized")
  }
  logger.info(claims.toString())
  const principalId = claims.sub!
  const userName = claims["cognito:userName"] as string
  const userRole = claims["custom:userRole"] as UserRoles

  const tmp = event.methodArn.split(":")
  const apiGatewayArnTmp = tmp[5].split("/")
  const awsAccountId = tmp[4]

  const policy = new AuthPolicy(principalId, awsAccountId)
  policy.restApiId = apiGatewayArnTmp[0]
  policy.region = tmp[3]
  policy.stage = apiGatewayArnTmp[1]

  if (authManager.isSaaSProvider(userRole)) {
    policy.allowAllMethods()
    if (authManager.isTenantAdmin(userRole)) {
      policy.denyMethod(HttpVerb.POST, "tenant-activation")
      policy.denyMethod(HttpVerb.GET, "tenants")
    }
  } else {
    logger.error("Userpool userRole is invalid")
    throw new Error("Userpool userRole is invalid")
  }

  const authResponse:AuthResponse = policy.build()
  authResponse.context = {
    userName,
    operationsUsersUserPoolId,
    userRole
  }

  return authResponse
}


async function validateJWT(token: string, appClientId?: string, userPoolId?: string): Promise<JWTPayload | false> {
  const jwksUrl = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`
  const JWKS = createRemoteJWKSet(new URL(jwksUrl))

  try {
    const { payload } = await jwtVerify(token, JWKS, {
      algorithms: ["RS256"],
      audience: appClientId
    })
    return payload;
  } catch (err) {
    logger.info("JWT validation failed:" + err)
    return false
  }
}