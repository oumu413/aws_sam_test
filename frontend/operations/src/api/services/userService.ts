import apiClient from '../apiClient'
import type { UserProfile } from '@/types/user'

const endpoint = '/users'

export const userService = {
  async getProfile(): Promise<UserProfile> {
    const response = await apiClient.get(`${endpoint}/profile`)
    return response.data
  },

  async updateProfile(data: Partial<UserProfile>): Promise<UserProfile> {
    const response = await apiClient.put(`${endpoint}/profile`, data)
    return response.data
  },

  async listUsers(): Promise<UserProfile[]> {
    const response = await apiClient.get(`${endpoint}`)
    return response.data
  }
}
