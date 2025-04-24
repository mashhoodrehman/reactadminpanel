import api from './baseApi'

// GET all roles with permissions
export const getAdminRolesApi = async () => {
  try {
    const response = await api.get('/api/admin/roles')
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch roles')
  }
}

// GET single role by ID
export const getSingleAdminRolesApi = async (id) => {
  try {
    const response = await api.get(`/api/admin/roles/${id}`)
    return response?.data?.data || null // or response?.data depending on structure
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch role')
  }
}


// POST create new role
export const createRolePermissionAPI = async (roleData) => {
  try {
    const response = await api.post('/api/admin/roles', roleData)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create role')
  }
}

// PUT update existing role
export const updateAdminRoleAPI = async (id, roleData) => {
  try {
    const response = await api.put(`/api/admin/roles/${id}`, roleData)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update role')
  }
}

// DELETE a role
export const deleteAdminRoleAPI = async (id) => {
  try {
    const response = await api.delete(`/api/admin/roles/${id}`)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete role')
  }
}
