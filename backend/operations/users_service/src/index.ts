import express, { Request, Response }  from 'express'
import serverlessExpress, { getCurrentInvoke } from '@codegenie/serverless-express'
import logger from '@commons/logger'

const app = express()

app.use(express.json())

interface UserProfile {
  id: string
  name: string
  email: string
  createdAt: string
}

app.get('/api/users/profile', (req: Request, res: Response) => {
  const { event } = getCurrentInvoke()
  const authz = event?.requestContext?.authorizer
  logger.info('GET /api/users/profile called')
  logger.info(`Authorizer context: ${JSON.stringify(authz)}`)
  const users: UserProfile[] = [
    {
      id: '1',
      name: 'Alice Johnson',
      email: 'alice.johnson@example.com',
      createdAt: '2023-01-15T10:00:00Z',
    },
    {
      id: '2',
      name: 'Bob Smith',
      email: 'bob.smith@example.com',
      createdAt: '2023-02-20T14:30:00Z',
    },
  ]
  res.json(users)
})

app.put('/api/users/profile', (req: Request, res: Response) => {
  logger.info('PUT /api/users/profile called')
  const users: UserProfile[] = [
    {
      id: '3',
      name: 'Alice Johnson',
      email: 'alice.johnson@example.com',
      createdAt: '2023-01-15T10:00:00Z',
    },
    {
      id: '4',
      name: 'Bob Smith',
      email: 'bob.smith@example.com',
      createdAt: '2023-02-20T14:30:00Z',
    },
  ]
  res.json(users)
})

export const handler = serverlessExpress({ app })