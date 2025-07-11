const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { STATUS_CODES, MESSAGES } = require("../utils/constants");

// Protect routes
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(STATUS_CODES.UNAUTHORIZED).json({
          success: false,
          message: MESSAGES.USER_NOT_FOUND,
        });
      }

      if (!req.user.isActive) {
        return res.status(STATUS_CODES.UNAUTHORIZED).json({
          success: false,
          message: "User account is deactivated",
        });
      }

      next();
    } catch (error) {
      console.error("Auth middleware error:", error);
      return res.status(STATUS_CODES.UNAUTHORIZED).json({
        success: false,
        message: MESSAGES.TOKEN_INVALID,
      });
    }
  }

  if (!token) {
    return res.status(STATUS_CODES.UNAUTHORIZED).json({
      success: false,
      message: MESSAGES.UNAUTHORIZED_ACCESS,
    });
  }
};

// Grant access to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(STATUS_CODES.FORBIDDEN).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
