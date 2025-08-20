import api from './api.js'

export const loansAPI = {
    getAll: () => api.get('/loans'),
    create: (data) => api.post('/loans', data),
    approve: (id) => api.post(`/loans/${id}/approve`),
    reject: (id) => api.post(`/loans/${id}/reject`),
}