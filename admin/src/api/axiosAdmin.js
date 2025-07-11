// Dummy API Service - Replaces backend calls with dummy data
import { dummyDataAPI } from "./dummyData";

// Auth APIs
export const adminAuthAPI = {
  // Register (User or Admin)
  register: (data) => dummyDataAPI.auth.register(data),
  // Login (User or Admin)
  login: (data) => dummyDataAPI.auth.login(data),
};

// Dashboard APIs
export const dashboardAPI = {
  // Get dashboard statistics
  getStats: () => dummyDataAPI.dashboard.getStats(),

  // Get sales trend data
  getSalesTrend: () => dummyDataAPI.dashboard.getSalesTrend(),

  // Get category distribution
  getCategoryDistribution: () =>
    dummyDataAPI.dashboard.getCategoryDistribution(),

  // Get recent activities
  getRecentActivities: () => dummyDataAPI.dashboard.getRecentActivities(),

  // Get top products
  getTopProducts: () => dummyDataAPI.dashboard.getTopProducts(),
};
