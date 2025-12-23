import { CloudFormationClient, ListExportsCommand, type ListExportsCommandOutput } from '@aws-sdk/client-cloudformation'
import logger from '@commons/logger'

const region = process.env.OPERATIONS_REGION
const cloudformation = new CloudFormationClient({ region: region })

export async function getCloudformationOutputs(exportName:string){
  let nextToken
  let found
  try {
    do {
      const res:ListExportsCommandOutput = await cloudformation.send(new ListExportsCommand({ NextToken: nextToken }))
      found = res.Exports?.find((e) => e.Name === exportName)
      nextToken = res.NextToken
    } while (!found && nextToken)

    if (!found || !found.Value) {
      logger.warn(`[Cloudformation Export Not Found] exportName="${exportName}" region="${region}"`)
      return ''
    }

    return found.Value

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : `Unknown error: ${String(error)}`
    logger.error(`[Cloudformation ListExports Error] exportName="${exportName}" region="${region}" message="${message}"`)
    throw error
  }
} 