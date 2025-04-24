import api from './baseApi';

export const getRoles = async () => {
  try {
    const response = await api.get('/api/admin/roles');
    return response.data || [];
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch roles");
  }
};
export const getRolesListing = async (page = 1, perPage = 10) => {
  try {
    const response = await api.get(`/roles?page=${page}&perPage=${perPage}`);
    return {
      roles: response.data?.data?.data || [],
      meta: response.data?.data?.meta || {},
    };
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch roles");
  }
};

export const getRoleById = async (id) => {
  try {
    const response = await api.get(`/roles/${id}`);
    return response.data?.data || null;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch role");
  }
};

export const deleteRole = async (id) => {
  try {
    const response = await api.post(`/roles/${id}/delete`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    return response.data?.message || "Role deleted successfully";
  } catch (error) {

    console.error("Error deleting role:", error);
    throw new Error(error.response?.data?.message || "Failed to delete role");
  }
};


export const createRole = async (data) => {
  try {
    const response = await api.post('/roles', data);
    return response.data.message || 'Role created successfully!';
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create role');
  }
};


export const updateRole = async (id, data) => {
  try {
    const response = await api.post(`/roles/${id}/update`, data);
    return {
      message: response.data?.message || "Role updated successfully",
      role: response.data?.data?.role || null,
    };
  } catch (error) {
    console.error("Error updating role:", error);
    throw new Error(error.response?.data?.message || "Failed to update role");
  }
};
