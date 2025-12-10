import express, { Request, Response }  from 'express'
import serverlessExpress from '@codegenie/serverless-express'
import logger from './logger.ts'

const app = express()

app.use(express.json())

interface UserProfile {
  id: string
  name: string
  email: string
  createdAt: string
}


import { EventEmitter } from 'events'

app.use((req, res, next) => {
  console.log('req.constructor:', req?.constructor?.name)   // 期待: IncomingMessage
  console.log('res.constructor:', res?.constructor?.name)   // 期待: ServerResponse
  console.log('req instanceof EventEmitter?', req instanceof EventEmitter) // 期待: true
  console.log('res instanceof EventEmitter?', res instanceof EventEmitter) // 期待: true
  console.log('req.socket instanceof EventEmitter?', req.socket instanceof EventEmitter) // 期待: true
  next()
})


app.get('/profile', (req: Request, res: Response) => {
  logger.info('GET /profile called')
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

app.put('/profile', (req: Request, res: Response) => {
  logger.info('PUT /profile called')
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

export const handler = serverlessExpress.configure({ app })

//export const handler = () => {
//  console.log("This is a placeholder handler.");
//}