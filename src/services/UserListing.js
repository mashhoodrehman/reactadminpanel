import api from './baseApi'

export const getUsersListAPI = async (page = 1, perPage = 10) => {
  try {
    const response = await api.get(`/api/admin/users?page=${page}&perPage=${perPage}`)
    return response?.data || []
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network Error')
  }
}
export const updateUserStatusAPI = async (customerData) => {
  try {
    const response = await api.post('/api/admin/update/customer/status', customerData)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Network Error')
  }
}

export const deleteUserAPI = async (id) => {
  try {
    const response = await api.delete(`/api/admin/users/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Network Error");
  }
};

