import api from './axios';

export const restaurantAPI = {
  getAll: (params) => api.get('/restaurants', { params }),
  getAllAdmin: () => api.get('/restaurants/admin/all'),
  getById: (id) => api.get(`/restaurants/${id}`),
  create: (data) => api.post('/restaurants', data),
  update: (id, data) => api.put(`/restaurants/${id}`, data),
  delete: (id) => api.delete(`/restaurants/${id}`),
  addMenuItem: (id, data) => api.post(`/restaurants/${id}/menu`, data),
  updateMenuItem: (id, data) => api.put(`/restaurants/menu/${id}`, data),
  deleteMenuItem: (id) => api.delete(`/restaurants/menu/${id}`)
};
