import axios from 'axios'
import { fetchAuthSession } from 'aws-amplify/auth'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_OPERATIONS_APP_BASE_URL + '/api',
})

apiClient.interceptors.request.use(async (config) => {
  try {
    const session = await fetchAuthSession()
    const token = session.tokens?.accessToken.toString()
    config.headers.Authorization = `Bearer ${token}`
  } catch (error) {
    console.error('Failed to get Cognito token', error)
  }
  return config
})

export default apiClient
