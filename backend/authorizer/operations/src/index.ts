import { APIGatewayRequestAuthorizerEventV2, APIGatewaySimpleAuthorizerWithContextResult } from 'aws-lambda'
import { jwtVerify, createRemoteJWKSet, JWTPayload } from "jose"
import  logger  from "@commons/logger"
import authManager, { UserRoles } from "@commons/auth_manager"

type AuthContext = {
  userName?: string
  userRole?: string
  reason?: string
}


// 環境変数からCognito設定を取得
const region = process.env.OPERATIONS_USERS_USER_POOL_REGION
const operationsUsersUserPoolId = process.env.OPERATIONS_USERS_USER_POOL
const operationsUsersAppClientId = process.env.OPERATIONS_USERS_APP_CLIENT

// 実行時チェック
if (!region || !operationsUsersUserPoolId || !operationsUsersAppClientId) {
  throw new Error('Missing required environment variables for Cognito configuration.')
}

export const handler = async (
  event: APIGatewayRequestAuthorizerEventV2
): Promise<APIGatewaySimpleAuthorizerWithContextResult<AuthContext>> => {
  const routeKey = event.routeKey // 例: "POST /tenant"
  logger.info(`Route Key: ${routeKey}`)

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
    logger.error('JWT validation failed')
    return authResponse
  }

  logger.info(`JWT verified successfully: ${JSON.stringify(claims)}`)

  const userName = claims["cognito:username"] as string
  const userRole = claims["custom:userRole"] as UserRoles

  const rawPath = event.rawPath // 例: "/tenants/12345"
  const method = event.requestContext.http.method // 例: "GET"

  // methodとrowPath,userRoleからアクセス権限を判定
  if (authManager.isAuthorizedRoute(method, rawPath, userRole)) {
    authResponse.isAuthorized = true
    authResponse.context = { userName, userRole }
    logger.info(`Authorization granted for ${method} ${rawPath}, role=${userRole}`)
  } else {
    authResponse.context = { reason: 'User is not authorized to access this resource' }
    logger.error(`Authorization denied for ${method} ${rawPath}, role=${userRole}`)
  }

  logger.info(`Authorization result: ${authResponse.isAuthorized}, reason: ${authResponse.context.reason || 'OK'}`)
  return authResponse
}

// JWTを検証する関数
async function validateJWT(token: string): Promise<JWTPayload | false> {
  const jwksUrl = `https://cognito-idp.${region}.amazonaws.com/${operationsUsersUserPoolId}/.well-known/jwks.json`
  const JWKS = createRemoteJWKSet(new URL(jwksUrl))

  try {
    const { payload } = await jwtVerify(token, JWKS, {
      algorithms: ["RS256"],
      issuer: `https://cognito-idp.${region}.amazonaws.com/${operationsUsersUserPoolId}`
    })
    return payload;
  } catch (err) {
    logger.info("JWT validation failed:" + err)
    return false
  }
}
