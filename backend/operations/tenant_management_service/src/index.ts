import express, { Router, Request, Response, NextFunction }  from 'express'
import serverlessExpress, { getCurrentInvoke } from '@codegenie/serverless-express'
import logger from '@commons/logger'
import route53 from './route53'

const app = express()
const router = Router()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/operation/management',
  withAuthzLog(),
  router
)

function withAuthzLog() {
  return (req: Request, res: Response, next: NextFunction) => {
    const { event } = getCurrentInvoke()
    const authz = event?.requestContext?.authorizer
    logger.info(`${req.method} ${req.originalUrl} called`)
    logger.info(`Authorizer context: ${JSON.stringify(authz)}`)
    next()
  }
}

// 環境変数
const region = process.env.OPERATIONS_REGION
const hostedZoneId = process.env.HOSTED_ZONE_ID
const baseDomein = process.env.BASE_DOMEIN

if (!region || !hostedZoneId || !baseDomein) {
  throw new Error('Missing required environment variables.')
}


router.use('/route53', route53)


export const handler = serverlessExpress({ app })