const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  logout,
} = require("../controllers/adminController");
const { protectAdmin } = require("../middleware/auth");
const {
  adminRegisterValidation,
  adminLoginValidation,
  adminProfileUpdateValidation,
  adminPasswordChangeValidation,
} = require("../middleware/validation");

// Public routes
router.post("/register", adminRegisterValidation, register);
router.post("/login", adminLoginValidation, login);

// Protected routes (Admin only)
router.get("/profile", protectAdmin, getProfile);
router.put(
  "/profile",
  protectAdmin,
  adminProfileUpdateValidation,
  updateProfile
);
router.put(
  "/change-password",
  protectAdmin,
  adminPasswordChangeValidation,
  changePassword
);
router.post("/logout", protectAdmin, logout);

module.exports = router;
