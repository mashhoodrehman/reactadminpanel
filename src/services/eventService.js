import api from './baseApi';

// ✅ GET all events with pagination and optional search
export const getEventsAPI = async (page = 1, pageSize = 10, search = '') => {
  try {
    const response = await api.get(`/api/admin/events-list?page=${page}&pageSize=${pageSize}&search=${encodeURIComponent(search)}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch events');
  }
};

// ✅ GET single event by ID
export const getEventByIdAPI = async (id) => {
  try {
    const response = await api.get(`/api/admin/events/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch event');
  }
};

// ✅ CREATE new event
export const createEventAPI = async (data) => {
  try {
    const response = await api.post('/api/admin/events', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create event');
  }
};

// ✅ UPDATE existing event
export const updateEventAPI = async (id, data) => {
  try {
    const response = await api.put(`/api/admin/events/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update event');
  }
};

// ✅ DELETE event by ID
export const deleteEvent = async (id) => {
  try {
    const response = await api.delete(`/api/admin/events/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete event');
  }
};
