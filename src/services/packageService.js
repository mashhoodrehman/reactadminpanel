import api from './baseApi'

export const getPackageByIdAPI = async (id) => {
  try {
    const response = await api.get(`/api/admin/packages/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch package');
  }
};
export const getPackagesAPI = async () => {
  try {
    const response = await api.get('/api/admin/packages')
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch packages')
  }
}

export const getSinglePackageAPI = async (id) => {
  try {
    const response = await api.get(`/api/admin/packages/${id}`)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch package')
  }
}

export const createPackageAPI = async (data) => {
  try {
    const response = await api.post('/api/admin/packages', data)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create package')
  }
}

export const updatePackageAPI = async (id, data) => {
  try {
    const response = await api.put(`/api/admin/packages/${id}`, data)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update package')
  }
}

export const deletePackageAPI = async (id) => {
  try {
    const response = await api.delete(`/api/admin/packages/${id}`)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete package')
  }
}
