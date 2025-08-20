import api from './api.js'

export const settlementsAPI = {
  getAll: () => api.get('/settlements'),
  create: (data) => api.post('/settlements', data),
  approve: (id) => api.post(`/settlements/${id}/approve`),
  reject: (id) => api.post(`/settlements/${id}/reject`),
}