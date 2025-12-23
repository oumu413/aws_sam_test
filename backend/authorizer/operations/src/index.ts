import { APIGatewayRequestAuthorizerEventV2, APIGatewaySimpleAuthorizerWithContextResult } from 'aws-lambda'
import { jwtVerify, createRemoteJWKSet, JWTPayload } from "jose"
import  logger  from "@commons/logger"
import authManager, { UserGroups } from "@commons/auth_manager"

type AuthContext = {
  userName?: string
  userGroup?: string
  reason?: string
}


// 環境変数からCognito設定を取得
const region = process.env.OPERATIONS_REGION
const operationsUsersUserPoolId = process.env.OPERATIONS_USERS_USER_POOL
const operationsUsersAppClientId = process.env.OPERATIONS_USERS_APP_CLIENT

// 実行時チェック
if (!region || !operationsUsersUserPoolId || !operationsUsersAppClientId) {
  throw new Error('Missing required environment variables for Cognito configuration.')
}

export const handler = async (
  event: APIGatewayRequestAuthorizerEventV2
): Promise<APIGatewaySimpleAuthorizerWithContextResult<AuthContext>> => {

  const authHeader = event.headers?.authorization || event.headers?.Authorization
  const authResponse:APIGatewaySimpleAuthorizerWithContextResult<AuthContext> = {
    isAuthorized: false,  
    context: {}
  }

  // トークン形式チェック
  if (!authHeader?.startsWith("Bearer ")) {
    authResponse.context = { reason: "missing/invalid token" }
    logger.error("missing/invalid token")
    return authResponse
  }

  const token = authHeader.slice("Bearer ".length)

  // JWT検証
  const claims = await validateJWT(token)
  if (!claims) {
    authResponse.context = { reason: "Unauthorized" }
    return authResponse
  }

  logger.info(`JWT verified successfully: ${JSON.stringify(claims)}`)

  const userName = claims["cognito:username"] as string
  const userGroups = claims["cognito:groups"] as UserGroups[]

  const rawPath = event.rawPath // 例: "/tenants/12345"
  const method = event.requestContext.http.method // 例: "GET"

  if(!userGroups || userGroups.length != 1) {
    // グループが無い、または複数ある場合は不許可
    authResponse.context = { reason: 'User has no groups assigned' }
    logger.error(`User has no groups assigned: ${userName}`)
    return  authResponse
  }

  const userGroup = userGroups[0] as UserGroups

  // methodとrowPath,userRoleからアクセス権限を判定
  if (authManager.isAuthorizedRoute(method, rawPath, userGroup)) {
    authResponse.isAuthorized = true
    authResponse.context = { userName, userGroup }
    logger.info(`Authorization granted for ${method} ${rawPath}, group=${userGroup}`)
  } else {
    authResponse.context = { reason: 'User is not authorized to access this resource' }
    logger.error(`Authorization denied for ${method} ${rawPath}, group=${userGroup}`)
  }

  logger.info(`Authorization result: ${authResponse.isAuthorized}, reason: ${authResponse.context.reason || 'OK'}`)
  return authResponse
}

// JWTを検証する関数
async function validateJWT(token: string): Promise<JWTPayload | false> {
  const issuer = `https://cognito-idp.${region}.amazonaws.com/${operationsUsersUserPoolId}`
  const jwksUrl = `${issuer}/.well-known/jwks.json`
  const JWKS = createRemoteJWKSet(new URL(jwksUrl))

  try {
    const { payload } = await jwtVerify(token, JWKS, {
      algorithms: ["RS256"],
      audience: operationsUsersAppClientId,
      issuer: issuer,
      clockTolerance: 5
    })
    return payload;
  } catch (error) {
    logger.error("JWT validation failed:" + error)
    return false
  }
}
