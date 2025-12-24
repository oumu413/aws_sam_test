import express from 'express'
import type { Router, Request, Response } from 'express'
import { 
  CognitoIdentityProviderClient,
  CreateUserPoolCommand,
  CreateGroupCommand,
  DeleteUserPoolCommand
} from '@aws-sdk/client-cognito-identity-provider'
import z from 'zod'
import logger from '@commons/logger'
import {
  createCognitoSchema,
  CreateCognitoInput,
  DeleteCognitoInput
} from './schemas/cognitoSchemas'
import { validate } from './middlewares/validate'

const router:Router = express.Router()
const region = process.env.OPERATIONS_REGION
const cognito = new CognitoIdentityProviderClient({ region:region })

router.post('/create', 
  validate(z.object({ body: createCognitoSchema })),
  async (req: Request<{}, {}, CreateCognitoInput>, res: Response) => {
    try{
      const { name } = req.body
      const changeRes = await cognito.send(makeCreateUserPoolCommand(name))

      if(!changeRes.UserPool || !changeRes.UserPool.Id){
        res.status(500).json({ error: "Failed to create Cognito" })
        return
      }

      await cognito.send(makeCreateGroupCommand(
        changeRes.UserPool.Id,
        "TenantAdmin",
        "Tenant Admin group",
        0
      ))
      await cognito.send(makeCreateGroupCommand(
        changeRes.UserPool.Id,
        "TenantSubAdmin",
        "Tenant SubAdmin group",
        1
      ))
      await cognito.send(makeCreateGroupCommand(
        changeRes.UserPool.Id,
        "TenantTeacher",
        "Tenant Teacher group",
        2
      ))
      await cognito.send(makeCreateGroupCommand(
        changeRes.UserPool.Id,
        "TenantStudent",
        "Tenant Student group",
        3
      ))

      res.status(202).json({ result: true, changeId: changeRes.UserPool?.Id })
    }
    catch(error){
      logger.error('error:' + error)
      res.status(500).json({ error: "Failed to create Cognito" })
    }
  }
)

router.delete('/delete',
  //validate(z.object({ body: createCognitoSchema })),
  async (req: Request<{}, {}, {}, DeleteCognitoInput>, res: Response) => {
    try{
      const { id } = req.query
      await cognito.send(new DeleteUserPoolCommand({ UserPoolId: id }))
      res.status(202).json({ result: true })
    }
    catch(error){
      logger.error('error:' + error)
      res.status(500).json({ error: "Failed to create Cognito" })
    }
  }
)


function makeCreateUserPoolCommand(name:string){
  return new CreateUserPoolCommand({
    PoolName: name + '-user-pool',
    UsernameConfiguration: {
      CaseSensitive: true, // ユーザー名の大文字小文字を区別
    },
    AccountRecoverySetting: {
      RecoveryMechanisms: [
        {
          Name: "admin_only",
          Priority: 1,
        },
      ],
    },
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
    MfaConfiguration: 'OFF',
    Policies: {
      PasswordPolicy: {
        MinimumLength: 8,
        RequireUppercase: true,
        RequireLowercase: true,
        RequireNumbers: true,
        RequireSymbols: true,
      },
    },
  })
}


function makeCreateGroupCommand(
  userPoolId: string,
  groupName: string,
  description: string,
  precedence: number, // 小さいほど優先度高
) {
  return new CreateGroupCommand({
    UserPoolId: userPoolId,
    GroupName: groupName,
    Description: description,
    Precedence: precedence,
  })
}


export default router