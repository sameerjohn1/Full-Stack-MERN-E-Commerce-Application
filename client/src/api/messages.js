import api from './axios'

export const getConversations = () => api.get('/messages/conversations').then(r => r.data)
export const getMessages = (userId) => api.get(`/messages/${userId}`).then(r => r.data)
export const sendMessage = (data) => api.post('/messages', data).then(r => r.data)
export const markAsRead = (userId) => api.put(`/messages/${userId}/read`).then(r => r.data)
export const getAdminMessages = () => api.get('/messages/admin/all').then(r => r.data)
