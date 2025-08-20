import api from './api.js'

export const savingsAPI = {
    getAll: () => api.get('/savings'),
    create: (data) => api.post('/savings', data),
    update: (id, data) => api.put(`/savings/${id}`, data),
    delete: (id) => api.delete(`/savings/${id}`),
    getYearlyProfit: () => api.get('/yearly-profit'),
}