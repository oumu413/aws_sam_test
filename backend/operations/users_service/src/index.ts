import express from 'express'
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

app.get('/profile', (req, res) => {
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

app.put('/profile', (req, res) => {
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