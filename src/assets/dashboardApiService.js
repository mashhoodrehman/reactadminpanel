import api from './baseApi'

export const getDashboardBalance = async (page = 1, perPage = 10) => {
  try {
    const response = await api.get(
      `/api/admin/get/admintransaction/detail?page=${page}&perPage=${perPage}`,
    )
    return response?.data || null
  } catch (error) {
    throw error.response?.data || new Error('Network Error')
  }
}
