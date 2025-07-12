const express = require("express");
const router = express.Router();
const {
  createSubscription,
  verifyPayment,
  getSubscriptionStatus,
  cancelSubscription,
} = require("../controllers/premiumController");
const { protect } = require("../middleware/auth");

// All routes require authentication
router.use(protect);

// Create subscription order
router.post("/subscribe", createSubscription);

// Verify payment and activate subscription
router.post("/verify", verifyPayment);

// Get subscription status
router.get("/status", getSubscriptionStatus);

// Cancel subscription
router.post("/cancel", cancelSubscription);

module.exports = router; 