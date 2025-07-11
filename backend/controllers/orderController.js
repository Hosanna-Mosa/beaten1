const Order = require("../models/Order");
const { STATUS_CODES } = require("../utils/constants");
const {
  sendOrderStatusEmail,
  sendOrderConfirmedEmail,
} = require("../utils/emailService");

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    console.log("camed to here");
    console.log("req.body", req.body);
    const { orderItems, shippingAddress, paymentInfo, totalPrice } = req.body;
    if (!orderItems || orderItems.length === 0) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: "No order items",
      });
    }
    if (!shippingAddress) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: "Shipping address required",
      });
    }
    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentInfo,
      totalPrice,
    });
    const createdOrder = await order.save();
    // Send order confirmation email
    const user = await order.populate("user", "name email");
    if (user.user && user.user.email) {
      await sendOrderConfirmedEmail(
        user.user.email,
        order._id,
        user.user.name
      );
    }
    res.status(STATUS_CODES.CREATED).json({
      success: true,
      message: "Order placed successfully",
      data: createdOrder,
    });
  } catch (error) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Failed to place order",
    });
  }
};

// @desc    Get all orders for the logged-in user
// @route   GET /api/orders/my-orders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("shippingAddress")
      .sort({ createdAt: -1 });
    res.status(STATUS_CODES.OK).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Failed to fetch orders",
    });
  }
};

// @desc    Get all orders (admin only)
// @route   GET /api/orders
// @access  Admin
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("shippingAddress")
      .sort({ createdAt: -1 });
    res.status(STATUS_CODES.OK).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Failed to fetch all orders",
    });
  }
};

// @desc    Get order by ID (admin only)
// @route   GET /api/orders/:id
// @access  Admin
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("shippingAddress");
    if (!order) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: "Order not found",
      });
    }
    res.status(STATUS_CODES.OK).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Failed to fetch order",
    });
  }
};

// @desc    Update order status (admin only)
// @route   PATCH /api/orders/:id/status
// @access  Admin
const updateOrderStatus = async (req, res) => {
  try {
    console.log("camed to");

    const { status } = req.body;
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!order) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: "Order not found",
      });
    }

    order.status = status;

    await order.save();
    // Send email notification to user
    if (order.user && order.user.email) {
      await sendOrderStatusEmail(
        order.user.email,
        status,
        order._id,
        order.user.name
      );
    }

    res.status(STATUS_CODES.OK).json({
      success: true,
      message: "Order status updated",
      data: order,
    });
  } catch (error) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Failed to update order status",
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
};
