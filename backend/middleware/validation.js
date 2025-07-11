const { body, validationResult } = require("express-validator");
const { STATUS_CODES } = require("../utils/constants");

// Validation result handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(STATUS_CODES.BAD_REQUEST).json({
      success: false,
      message: "Validation error",
      errors: errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
      })),
    });
  }
  next();
};

// Register validation rules
const registerValidation = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please enter a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("phone")
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Please enter a valid 10-digit phone number starting with 6-9"),
  body("dob")
    .isISO8601()
    .withMessage("Date of birth must be a valid date")
    .custom((value) => {
      if (new Date(value) > new Date()) {
        throw new Error("Date of birth cannot be in the future");
      }
      return true;
    }),
  body("gender")
    .isIn(["male", "female", "other"])
    .withMessage("Gender must be one of: male, female, other"),
  handleValidationErrors,
];

// Login validation rules
const loginValidation = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please enter a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
  handleValidationErrors,
];

// Profile update validation rules
const profileUpdateValidation = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),
  body("email")
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage("Please enter a valid email"),
  handleValidationErrors,
];

module.exports = {
  registerValidation,
  loginValidation,
  profileUpdateValidation,
  handleValidationErrors,
};
