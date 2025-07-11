import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

const productsApi = {
  getProducts: async (params = {}) => {
    const response = await apiClient.get('/products', { params });
    return response.data;
  },
  getProductById: async (id) => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },
  searchProducts: async (query, params = {}) => {
    const response = await apiClient.get('/products/search', { params: { q: query, ...params } });
    return response.data;
  },
  getFeaturedProducts: async (limit = 8) => {
    const response = await apiClient.get('/products/featured', { params: { limit } });
    return response.data;
  },
  getNewArrivals: async (limit = 8) => {
    const response = await apiClient.get('/products/new-arrivals', { params: { limit } });
    return response.data;
  },
  getBestSellers: async (limit = 8) => {
    const response = await apiClient.get('/products/best-sellers', { params: { limit } });
    return response.data;
  },
  getProductsByCategory: async (category, params = {}) => {
    const response = await apiClient.get(`/products/category/${category}`, { params });
    return response.data;
  },
  getProductsByGender: async (gender, params = {}) => {
    const response = await apiClient.get(`/products/gender/${gender}`, { params });
    return response.data;
  },
  getProductsByCollection: async (collection, params = {}) => {
    const response = await apiClient.get(`/products/collection/${collection}`, { params });
    return response.data;
  },
  getCategories: async () => {
    const response = await apiClient.get('/products/categories');
    return response.data;
  },
  // Admin
  createProduct: async (productData) => {
    const response = await apiClient.post('/products', productData);
    return response.data;
  },
  updateProduct: async (id, productData) => {
    const response = await apiClient.put(`/products/${id}`, productData);
    return response.data;
  },
  deleteProduct: async (id) => {
    const response = await apiClient.delete(`/products/${id}`);
    return response.data;
  },
  bulkUpdateProducts: async (products) => {
    const response = await apiClient.put('/products/bulk-update', { products });
    return response.data;
  },
  getProductStats: async () => {
    const response = await apiClient.get('/products/stats');
    return response.data;
  }
};

export default productsApi; 