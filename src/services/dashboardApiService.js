import api from './baseApi'

export const getDashboardStats = async (page = 1, perPage = 10) => {
  try {
    const response = await api.get(
      `/api/admin/dashboard-stats`,
    )
    return response?.data || null
  } catch (error) {
    throw error.response?.data || new Error('Network Error')
  }
}
