import apiClient from '@/api/apiClient'

export function useApi<T>() {
  const loading = ref(false)
  const err = ref<string | null>(null)

  const request = async (url: string, options: object = {}): Promise<T> => {
    loading.value = true
    err.value = null
    try {
      const response = await apiClient(url, options)
      return response.data as T
    } catch (error: any) {
      err.value = error.response?.data?.message || error.message
      throw error
    } finally {
      loading.value = false
    }
  }

  return { loading, err, request }
}
