import api from './axios'

export const createOrder = (data) => api.post('/orders', data).then(r => r.data)
export const getMyOrders = () => api.get('/orders/my').then(r => r.data)
export const getOrder = (id) => api.get(`/orders/${id}`).then(r => r.data)
export const getAllOrders = (params) => api.get('/orders', { params }).then(r => r.data)
export const updateOrderStatus = (id, status) => api.put(`/orders/${id}/status`, { status }).then(r => r.data)
export const cancelOrder = (id) => api.put(`/orders/${id}/cancel`).then(r => r.data)
