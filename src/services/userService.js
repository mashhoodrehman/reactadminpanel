import api from "./baseApi";

// export const getUsers = async () => {
//   try {
//     const response = await api.get("/users");
//     return response.data?.data?.data || [];
//   } catch (error) {
//     throw new Error(error.response?.data?.message || "Failed to fetch users");
//   }
// };

export const getUsers = async (page = 1) => {
  try {
    const response = await api.get(`/users?page=${page}`);
    const { data } = response.data;
    return {
      users: data.data || [],
      meta: data.meta || {}
    };
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch users");
  }
};





export const deleteUser = async (id) => {
  try {
    const response = await api.post(`/users/${id}/delete`);
    const { result, message, data } = response.data;

    if (result === "success") {
      return { result, message, data };
    } else {
      throw new Error(message || "An unexpected error occurred");
    }
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete user");
  }
};


  export const createUser = async (userData) => {
    try {
      const response = await api.post("/api/admin/users", userData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return {
        message: response.data?.message || "User created successfully",
        user: response.data?.data?.user || null,
      };
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to create user");
    }
  };



  export const getUserById = async (id) => {
    try {
      const response = await api.get(`/api/admin/users/${id}`);
      return response.data?.data;

      if (result === "success") {
        return data;
      } else {
        throw new Error(message || "Failed to fetch user details");
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch user details");
    }
  };



  export const updateUser = async (id, userData) => {
    try {
      const response = await api.post(`/api/admin/users/${id}/update`, userData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data?.data
      const { result, message, data } = response.data;
      if (result === "success") {
        return { message, data };
      } else {
        throw new Error(message || "Failed to update user");
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to update user");
    }
  };
