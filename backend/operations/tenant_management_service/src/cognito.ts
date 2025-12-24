import express from 'express'
import type { Router, Request, Response } from 'express'
import { CognitoIdentityProviderClient, CreateUserPoolCommand } from '@aws-sdk/client-cognito-identity-provider'
import z from 'zod'
import logger from '@commons/logger'
import {
  createCognitoSchema,
  CreateCognitoInput
} from './schemas/cognitoSchemas'
import { validate } from './middlewares/validate'
import { getCloudformationOutputs } from './commons/cloudformation'

const router:Router = express.Router()
const region = process.env.OPERATIONS_REGION
const hostedZoneId = process.env.HOSTED_ZONE_ID
const baseDomein = process.env.BASE_DOMEIN
const CLOUDFRONT_ZONE_ID = "Z2FDTNDATAQYW2" // CloudFront用 固定
const cognito = new CognitoIdentityProviderClient({ region:region })

router.post('/create', 
  validate(z.object({ body: createCognitoSchema })),
  async (req: Request<{}, {}, CreateCognitoInput>, res: Response) => {
    try{
      const { name } = req.body
      const changeRes = await cognito.send(new CreateUserPoolCommand({
        PoolName: name + '-user-pool',
        UsernameAttributes: ['email'], // 必要に応じてユーザー名として使う属性
        Schema: [
          {
            Name: 'email',
            AttributeDataType: 'String',
            Required: false,
            Mutable: true,
          },
          {
            Name: 'tenantId',
            AttributeDataType: 'String',
            Required: false,
            Mutable: true,
          },
          {
            Name: 'userRole',
            AttributeDataType: 'String',
            Required: false,
            Mutable: true,
          },
        ],
        AutoVerifiedAttributes: ['email'], // メールアドレスの自動検証
        MfaConfiguration: 'OFF', // MFAの設定（例：OFF, OPTIONAL, ON）
        Policies: {
          PasswordPolicy: {
            MinimumLength: 8,
            RequireUppercase: true,
            RequireLowercase: true,
            RequireNumbers: true,
            RequireSymbols: true,
          },
        },
      }))
      res.status(202).json({ result: true, changeId: changeRes.UserPool?.Id })
    }
    catch(error){
      logger.error('error:' + error)
      res.status(500).json({ error: "Failed to create Route53" })
    }
  }
)

export default router