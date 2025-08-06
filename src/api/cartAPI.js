import api from '../config/axios';

// Cart API (based on actual Swagger endpoints)
export const cartAPI = {
  create: () => api.post('/carts'),
  getMyCart: () => api.get('/carts/my-cart'),
  addItem: (productId, quantity = 1) =>
    api.post('/cart-items', { productId, quantity }),
  updateItem: (itemId, updateData) =>
    api.put(`/cart-items/${itemId}`, updateData),
  removeItem: (itemId) => api.delete(`/cart-items/${itemId}`),
  clearCart: (cartId) => api.delete(`/cart-items/cart/${cartId}/clear`),
  // Legacy methods for backward compatibility
  get: () => api.get('/carts/my-cart'),
  add: (productId, quantity = 1) =>
    api.post('/cart-items', { productId, quantity }),
  update: (itemId, quantity) => api.put(`/cart-items/${itemId}`, { quantity }),
  remove: (itemId) => api.delete(`/cart-items/${itemId}`),
  clear: () =>
    api.get('/carts/my-cart').then((response) => {
      const cartId = response.data?.id;
      if (cartId) return api.delete(`/cart-items/cart/${cartId}/clear`);
      throw new Error('Cart ID not found');
    }),
};

export default cartAPI;