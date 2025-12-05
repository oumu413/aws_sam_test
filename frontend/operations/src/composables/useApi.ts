import apiClient from '@/api/apiClient'

export function useApi<T>() {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const request = async (url: string, options: object = {}): Promise<T> => {
    loading.value = true
    error.value = null
    try {
      const response = await apiClient(url, options)
      return response.data as T
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return { loading, error, request }
}
