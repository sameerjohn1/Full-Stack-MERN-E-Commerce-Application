import api from './axios'

export const loginUser = (data) => api.post('/auth/login', data).then(r => r.data)
export const registerUser = (data) => api.post('/auth/register', data).then(r => r.data)
export const getMe = () => api.get('/auth/me').then(r => r.data)
export const updateProfile = (data) => api.put('/auth/profile', data).then(r => r.data)
export const changePassword = (data) => api.put('/auth/password', data).then(r => r.data)
export const forgotPassword = (data) => api.post('/auth/forgot-password', data).then(r => r.data)
export const getAdminUser = () => api.get('/auth/admin').then(r => r.data)
