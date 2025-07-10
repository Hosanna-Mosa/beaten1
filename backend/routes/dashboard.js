const express = require('express');
const {
  getDashboardStats,
  getSalesTrend,
  getCategoryDistribution,
  getRecentActivities,
  getTopProducts
} = require('../controllers/dashboardController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all dashboard routes
router.use(protect, admin);

// Dashboard routes
router.get('/stats', getDashboardStats);
router.get('/sales-trend', getSalesTrend);
router.get('/category-distribution', getCategoryDistribution);
router.get('/recent-activities', getRecentActivities);
router.get('/top-products', getTopProducts);

module.exports = router; 