import express from 'express'
import type { Router, Request, Response } from 'express'
import { Route53Client, ChangeResourceRecordSetsCommand, GetChangeCommand } from '@aws-sdk/client-route-53'
import z from 'zod'
import logger from '@commons/logger'
import { route53Schema, Route53Input } from './schemas/route53Schemas'
import { validate } from './middlewares/validate'
import { getCloudformationOutputs } from './commons/cloudformation'

const router:Router = express.Router()
const hostedZoneId = process.env.HOSTED_ZONE_ID
const baseDomain = process.env.BASE_DOMEIN
const CLOUDFRONT_ZONE_ID = "Z2FDTNDATAQYW2" // CloudFront用 固定
const route53 = new Route53Client({})

router.post('/create', 
  validate(z.object({ body: route53Schema })),
  async (req: Request<{}, {}, Route53Input>, res: Response) => {
    try{
      const { name } = req.body
      const fqdn = `${name}.${baseDomain}`
      const cloudFrontDomainName= await getCloudformationOutputs('Tenants-Site-CloudFrontDomainName')
      const changeRes = await route53.send(new ChangeResourceRecordSetsCommand({
        HostedZoneId: hostedZoneId,
        ChangeBatch: {
          Comment: `"UPSERT ALIAS A "${fqdn}" -> "${cloudFrontDomainName}"`,
          Changes: [
            {
              Action: "UPSERT", // 更新、なければ作成
              ResourceRecordSet: {
                Name: fqdn,
                Type: 'A',
                AliasTarget: {
                  DNSName: cloudFrontDomainName,
                  HostedZoneId: CLOUDFRONT_ZONE_ID,
                  EvaluateTargetHealth: false, // ターゲットのヘルス状態を確認するか
                },
              }
            }
          ]
        }
      }))
      res.status(202).json({ result: true })
    }
    catch(error) {
      logger.error('error:' + error)
      res.status(500).json({ error: "Failed to create Route53" })
    }
  }
)

router.delete('/delete', 
  validate(z.object({ query: route53Schema })),
  async (req: Request<{}, {}, {}, Route53Input>, res: Response) => {
    try{
      const { name } = req.query
      const fqdn = `${name}.${baseDomain}`
      const cloudFrontDomainName= await getCloudformationOutputs('Tenants-Site-CloudFrontDomainName')
      const changeRes = await route53.send(new ChangeResourceRecordSetsCommand({
        HostedZoneId: hostedZoneId,
        ChangeBatch: {
          Comment: `DELETE ALIAS A ${fqdn}`,
          Changes: [
            {
              Action: "DELETE", // 削除
              ResourceRecordSet: {
                Name: fqdn,
                Type: 'A',
                AliasTarget: {
                  DNSName: cloudFrontDomainName,
                  HostedZoneId: CLOUDFRONT_ZONE_ID,
                  EvaluateTargetHealth: false, // ターゲットのヘルス状態を確認するか
                },
              }
            }
          ]
        }
      }))
      res.status(202).json({ result: true })
    }
    catch(error) {
      logger.error('error:' + error)
      res.status(500).json({ error: "Failed to create Route53" })
    }
  }
)



export default router