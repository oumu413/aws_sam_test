import express, { Router, Request, Response, NextFunction }  from 'express'
import serverlessExpress, { getCurrentInvoke } from '@codegenie/serverless-express'
import logger from '@commons/logger'

const baseDomein = process.env.BASE_DOMEIN

const app = express()
const router = Router()

app.use(express.json())

app.use('/api/tenant',
  withAuthzLog(),
  withCognitoFromSubdomain(baseDomein),
  router
)

type CognitoConfig = {
  userPoolId: string,
  userPoolClientId: string,
}

const COGNITO_BY_SUBDOMAIN: Record<string, CognitoConfig> = {
  'test': {
    userPoolId: 'ap-northeast-3_MZgLMknuQ',
    userPoolClientId: '4tfv7a892isat8sjt06v74ijhb',
  },
  'tenant-b': {
    userPoolId: 'xxxxxxxxxxxxxxxxxxxxxxxx',
    userPoolClientId: 'yyyyyyyyyyyyyyyyyyyyyyyyyy',
  },
}


function withAuthzLog() {
  return (req: Request, res: Response, next: NextFunction) => {
    const { event } = getCurrentInvoke()
    const authz = event?.requestContext?.authorizer
    logger.info(`${req.method} ${req.originalUrl} called`)
    logger.info(`Authorizer context: ${JSON.stringify(authz)}`)
    next()
  }
}


router.get('/init', (req: Request, res: Response) => {
  const info: CognitoConfig = res.locals.cognito
  return res.json(info)
})

export const handler = serverlessExpress({ app })


function extractSubdomain(hostOrDomain?: string, baseDomain?: string): string {
  if (!hostOrDomain) return ''

  const host = hostOrDomain.split(':')[0].toLowerCase()

  // ローカル／IP の場合は不可
  if (host === 'localhost' || /^\d{1,3}(\.\d{1,3}){3}$/.test(host)) return ''

  const parts = host.split('.')

  // example.com / co.jp などのアペックスは不可
  if (parts.length <= 2) return ''

  // baseDomain が指定されていれば、それを基準にサブドメインを切り出す
  if (baseDomain) {
    const idx = host.indexOf(baseDomain.toLowerCase())
    if (idx > 0) {
      const left = host.substring(0, idx - 1) // 直前のドットまで
      const leftParts = left.split('.')
      return leftParts[0] || ''
    }
  }

  // baseDomain 不明なら、最上位のサブドメイン（先頭）を返す
  return parts[0]
}

function withCognitoFromSubdomain(baseDomain?: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { event } = getCurrentInvoke()
    const domainFromEvent = event?.requestContext?.domainName // HTTP API の実行ドメイン
    const hostFromHeader = req.headers.host

    // event優先、なければヘッダ
    const host = (domainFromEvent || hostFromHeader || '').toString()
    const sub = extractSubdomain(host, baseDomain)

    logger.info(`Host=${host}, extracted subdomain=${sub}`)

    const cognito = COGNITO_BY_SUBDOMAIN[sub]
    if (!cognito) {
      logger.error(`Unknown subdomain: ${sub}`)
      return res.status(404).json({ message: 'unknown' })
    }

    res.locals.cognito = cognito
    next()
  }
}