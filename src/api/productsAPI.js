import api, { guestApi } from '../config/axios';

// Products API (guest access for viewing, admin access for CRUD)
export const productsAPI = {
  getAll: (params = {}) => guestApi.get('/products', { params }),
  getById: (id) => guestApi.get(`/products/${id}`),
  getByCategory: (category, params = {}) =>
    guestApi.get(`/products/category/${category}`, { params }),
  getCategories: () => guestApi.get('/products/categories'),
  search: (query, params = {}) =>
    guestApi.get('/products/search', { params: { q: query, ...params } }),
  create: (productData) => api.post('/products', productData),
  update: (id, productData) => api.put(`/products/${id}`, productData),
  delete: (id) => api.delete(`/products/${id}`),
  uploadImage: (formData) =>
    api.post('/product-images/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

export default productsAPI;