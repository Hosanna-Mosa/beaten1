const express = require("express");
const router = express.Router();

// Import route modules
const authRoutes = require("./auth");

// Route definitions
router.use("/auth", authRoutes);

// Health check route
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Beaten API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

module.exports = router;
