import api from './baseApi';

export const getCustomersAPI = async () => {
  try {
    const response = await api.get('/api/admin/customers-list');
    console.log(response , 'sdfsdfds')
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch customers');
  }
};
