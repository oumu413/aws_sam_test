import { Logger } from '@aws-lambda-powertools/logger'
import { APIGatewayProxyEvent } from 'aws-lambda'

const logger = new Logger({
  logLevel: 'INFO',
})

function info(logMessage: string): void {
  logger.info(logMessage)
}

function error(logMessage: string): void {
  logger.error(logMessage)
}

function logWithTenantContext(event: APIGatewayProxyEvent, logMessage: string): void {
  const tenantId = event.requestContext?.authorizer?.tenantId
  logger.appendKeys({ tenant_id: tenantId })
  logger.info(logMessage)
}

export default {
  info,
  error,
  logWithTenantContext,
}