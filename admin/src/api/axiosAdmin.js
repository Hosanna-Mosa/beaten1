import axios from 'axios';

// Always use backend server on port 5000 for API calls
const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('admin_token') || localStorage.getItem('token');
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

export const adminAuthAPI = {
  // Register (User or Admin)
  register: (data) => axios.post(`${API_BASE_URL}/auth/register`, data),
  // Login (User or Admin)
  login: (data) => axios.post(`${API_BASE_URL}/auth/login`, data),
};

// Dashboard APIs
export const dashboardAPI = {
  // Get dashboard statistics
  getStats: () => axios.get(`${API_BASE_URL}/dashboard/stats`, { headers: getAuthHeaders() }),
  
  // Get sales trend data
  getSalesTrend: () => axios.get(`${API_BASE_URL}/dashboard/sales-trend`, { headers: getAuthHeaders() }),
  
  // Get category distribution
  getCategoryDistribution: () => axios.get(`${API_BASE_URL}/dashboard/category-distribution`, { headers: getAuthHeaders() }),
  
  // Get recent activities
  getRecentActivities: () => axios.get(`${API_BASE_URL}/dashboard/recent-activities`, { headers: getAuthHeaders() }),
  
  // Get top products
  getTopProducts: () => axios.get(`${API_BASE_URL}/dashboard/top-products`, { headers: getAuthHeaders() })
};
