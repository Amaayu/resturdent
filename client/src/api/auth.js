import api from './axios';

export const authAPI = {
  register: (data) => api.post('/auth', { ...data, action: 'register' }),
  login: (data) => api.post('/auth', { ...data, action: 'login' }),
  logout: () => api.post('/auth', { action: 'logout' }),
  getMe: () => api.get('/auth', { params: { action: 'me' } })
};
