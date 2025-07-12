const express = require("express");
const router = express.Router();
const {
  createSubscription,
  verifyPayment,
  getSubscriptionStatus,
  cancelSubscription,
  manualSubscribe,
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

// Manual subscription saving
router.post("/manual-subscribe", manualSubscribe);

module.exports = router; 