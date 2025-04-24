import api from './baseApi';

export const getEventsAPI = async (page = 1, pageSize = 10, search = '') => {
  try {
    const response = await api.get(`/api/admin/events-list?page=${page}&pageSize=${pageSize}&search=${encodeURIComponent(search)}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch events');
  }
};

