import api from './axios'

export const getProducts = (params) => api.get('/products', { params }).then(r => r.data)
export const getProduct = (id) => api.get(`/products/${id}`).then(r => r.data)
export const getCategories = () => api.get('/products/categories').then(r => r.data)
export const getFeaturedProducts = () => api.get('/products/featured').then(r => r.data)
export const createProduct = (data) => api.post('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data)
export const updateProduct = (id, data) => api.put(`/products/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data)
export const deleteProduct = (id) => api.delete(`/products/${id}`).then(r => r.data)
export const addReview = (id, data) => api.post(`/products/${id}/reviews`, data).then(r => r.data)
export const getReviews = (id) => api.get(`/products/${id}/reviews`).then(r => r.data)
