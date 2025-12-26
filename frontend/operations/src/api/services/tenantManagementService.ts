import apiClient from '../apiClient'
import type { ResultResponse } from '@/types/response'

const endpoint = '/operation/management'

export const tenantManagementService = {
  // Route53
  async createRoute53(name:string): Promise<ResultResponse> {
    const response = await apiClient.post(`${endpoint}/route53/create`, {
      name: name,
    })
    return response.data
  },
  async deleteRoute53(name:string): Promise<ResultResponse> {
    const response = await apiClient.delete(`${endpoint}/route53/delete`, {
      params: { name },
    })
    return response.data
  },

  // Cognito
  async createCognito(name:string): Promise<ResultResponse> {
    const response = await apiClient.post(`${endpoint}/cognito/create`,{
      name: name,
    })
    return response.data
  },
  async deleteCognito(id:string): Promise<ResultResponse> {
    const response = await apiClient.delete(`${endpoint}/cognito/delete`, {
      params: { id },
    })
    return response.data
  }


}
