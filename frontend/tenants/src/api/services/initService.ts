import apiClient from '../apiClient'
import type { CognitoConfig } from '@/types/cognitoConfig'

const endpoint = '/tenant'

export const initService = {
  async getCognitoConfig(): Promise<CognitoConfig> {
    const response = await apiClient.get(`${endpoint}/init`)
    return response.data
  },
}
