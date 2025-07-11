const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getAllOrders, getOrderById, updateOrderStatus } = require('../controllers/orderController');
const { protect, protectAdmin } = require('../middleware/auth');

// @route   POST /api/orders
// @desc    Create a new order
// @access  Private
router.post('/', protect, createOrder);

// @route   GET /api/orders/my-orders
// @desc    Get all orders for the logged-in user
// @access  Private
router.get('/my-orders', protect, getMyOrders);

// Admin: Get all orders
router.get('/', protect, protectAdmin, getAllOrders);
// Admin: Get order by ID
router.get('/:id', protect, protectAdmin, getOrderById);
// Admin: Update order status
router.patch('/:id/status', protect, protectAdmin, updateOrderStatus);

module.exports = router; 