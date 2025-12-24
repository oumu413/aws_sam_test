import express from 'express'
import type { Router, Request, Response } from 'express'
import { Route53Client, ChangeResourceRecordSetsCommand, GetChangeCommand } from '@aws-sdk/client-route-53'
import z from 'zod'
import logger from '@commons/logger'
import {
  createRoute53Schema,
  CreateRoute53Input
} from './schemas/route53Schemas'
import { validate } from './middlewares/validate'
import { getCloudformationOutputs } from './commons/cloudformation'

const router:Router = express.Router()
const hostedZoneId = process.env.HOSTED_ZONE_ID
const baseDomein = process.env.BASE_DOMEIN
const CLOUDFRONT_ZONE_ID = "Z2FDTNDATAQYW2" // CloudFront用 固定
const route53 = new Route53Client({})

router.post('/create', 
  //alidate(z.object({ body: createRoute53Schema })),
  async (req: Request<{}, {}, CreateRoute53Input>, res: Response) => {
    try{
      
logger.info(`Request Info: ${JSON.stringify({
  method: req.method,
  path: req.path,
  headers: req.headers,
  query: req.query,
  params: req.params,
  body: req.body,
})}`);

      const { name } = req.body
      const cloudFrontDomainName= await getCloudformationOutputs('Tenants-Site-CloudFrontDomainName')

      const changeRes = await route53.send(new ChangeResourceRecordSetsCommand({
        HostedZoneId: hostedZoneId,
        ChangeBatch: {
          Comment: "UPSERT ALIAS A ${name} -> ${cloudFrontDomainName}",
          Changes: [
            {
              Action: "UPSERT", // 更新、なければ作成
              ResourceRecordSet: {
                Name: name + "." + baseDomein,
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

      res.status(202).json({ result: true, changeId: changeRes.ChangeInfo?.Id })
    }
    catch(error) {
      logger.error('error:' + error)
      res.status(500).json({ error: "Failed to create Route53" })
    }
  }
)



export default router