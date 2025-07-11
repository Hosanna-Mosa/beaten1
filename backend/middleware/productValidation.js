const { body, param, query, validationResult } = require("express-validator");

// Validation rules for creating a product (new schema)
const createProductValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Product name must be between 2 and 100 characters"),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),

  body("brand").optional().isString().withMessage("Brand must be a string"),

  body("categories")
    .isArray({ min: 1 })
    .withMessage("At least one category is required"),
  body("categories.*").isString().withMessage("Each category must be a string"),

  body("tags").optional().isArray().withMessage("Tags must be an array"),
  body("tags.*").optional().isString().withMessage("Each tag must be a string"),

  body("mainImage")
    .notEmpty()
    .withMessage("Main image is required")
    .isString()
    .withMessage("Main image must be a string"),

  body("images").optional().isArray().withMessage("Images must be an array"),
  body("images.*")
    .optional()
    .isString()
    .withMessage("Each image must be a string"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),
  body("isFeatured")
    .optional()
    .isBoolean()
    .withMessage("isFeatured must be a boolean"),

  body("rating")
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage("Rating must be between 0 and 5"),
  body("reviews")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Reviews must be a non-negative integer"),

  body("variants")
    .isArray({ min: 1 })
    .withMessage("At least one variant is required"),
  body("variants.*.sku")
    .notEmpty()
    .withMessage("SKU is required for each variant")
    .isString()
    .withMessage("SKU must be a string"),
  body("variants.*.color")
    .optional()
    .isString()
    .withMessage("Color must be a string"),
  body("variants.*.size")
    .optional()
    .isString()
    .withMessage("Size must be a string"),
  body("variants.*.price")
    .notEmpty()
    .withMessage("Price is required for each variant")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("variants.*.stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),
  body("variants.*.images")
    .optional()
    .isArray()
    .withMessage("Variant images must be an array"),
  body("variants.*.images.*")
    .optional()
    .isString()
    .withMessage("Each variant image must be a string"),
];

// Validation rules for updating a product (new schema)
const updateProductValidation = [
  param("id").isMongoId().withMessage("Invalid product ID"),

  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Product name must be between 2 and 100 characters"),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),

  body("brand").optional().isString().withMessage("Brand must be a string"),

  body("categories")
    .optional()
    .isArray({ min: 1 })
    .withMessage("At least one category is required"),
  body("categories.*")
    .optional()
    .isString()
    .withMessage("Each category must be a string"),

  body("tags").optional().isArray().withMessage("Tags must be an array"),
  body("tags.*").optional().isString().withMessage("Each tag must be a string"),

  body("mainImage")
    .optional()
    .isString()
    .withMessage("Main image must be a string"),

  body("images").optional().isArray().withMessage("Images must be an array"),
  body("images.*")
    .optional()
    .isString()
    .withMessage("Each image must be a string"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),
  body("isFeatured")
    .optional()
    .isBoolean()
    .withMessage("isFeatured must be a boolean"),

  body("rating")
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage("Rating must be between 0 and 5"),
  body("reviews")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Reviews must be a non-negative integer"),

  body("variants")
    .optional()
    .isArray({ min: 1 })
    .withMessage("At least one variant is required"),
  body("variants.*.sku")
    .optional()
    .isString()
    .withMessage("SKU must be a string"),
  body("variants.*.color")
    .optional()
    .isString()
    .withMessage("Color must be a string"),
  body("variants.*.size")
    .optional()
    .isString()
    .withMessage("Size must be a string"),
  body("variants.*.price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("variants.*.stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),
  body("variants.*.images")
    .optional()
    .isArray()
    .withMessage("Variant images must be an array"),
  body("variants.*.images.*")
    .optional()
    .isString()
    .withMessage("Each variant image must be a string"),
];

// Validation rules for query parameters
const productQueryValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  query("minPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Min price must be a positive number"),

  query("maxPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Max price must be a positive number"),

  query("sort")
    .optional()
    .isIn(["newest", "price_asc", "price_desc", "rating", "popular"])
    .withMessage("Invalid sort option"),

  query("category")
    .optional()
    .isIn([
      "T-shirts",
      "Shirts",
      "Bottom Wear",
      "Hoodies",
      "Jackets",
      "Co-ord Sets",
      "Dresses",
    ])
    .withMessage("Invalid category"),

  query("gender")
    .optional()
    .isIn(["MEN", "WOMEN"])
    .withMessage("Invalid gender"),

  query("isFeatured")
    .optional()
    .isBoolean()
    .withMessage("isFeatured must be a boolean"),

  query("isNewArrival")
    .optional()
    .isBoolean()
    .withMessage("isNewArrival must be a boolean"),

  query("isBestSeller")
    .optional()
    .isBoolean()
    .withMessage("isBestSeller must be a boolean"),

  query("inStock")
    .optional()
    .isBoolean()
    .withMessage("inStock must be a boolean"),
];

// Validation rules for product ID parameter
const productIdValidation = [
  param("id").isMongoId().withMessage("Invalid product ID"),
];

// Validation rules for category parameter
const categoryValidation = [
  param("category")
    .trim()
    .notEmpty()
    .withMessage("Category is required")
    .isIn([
      "T-shirts",
      "Shirts",
      "Bottom Wear",
      "Hoodies",
      "Jackets",
      "Co-ord Sets",
      "Dresses",
    ])
    .withMessage("Invalid category"),
];

// Validation rules for gender parameter
const genderValidation = [
  param("gender")
    .trim()
    .notEmpty()
    .withMessage("Gender is required")
    .isIn(["MEN", "WOMEN"])
    .withMessage("Invalid gender"),
];

// Validation rules for collection parameter
const collectionValidation = [
  param("collection")
    .trim()
    .notEmpty()
    .withMessage("Collection is required")
    .isIn([
      "Beaten Exclusive Collection",
      "Beaten Launch Sale Vol 1",
      "Beaten Signature Collection",
      "New Arrivals",
      "Best Sellers",
      "Summer Collection",
      "Winter Collection",
    ])
    .withMessage("Invalid collection"),
];

// Validation rules for search query
const searchValidation = [
  query("q")
    .trim()
    .notEmpty()
    .withMessage("Search query is required")
    .isLength({ min: 2 })
    .withMessage("Search query must be at least 2 characters long"),
];

// Validation rules for bulk update
const bulkUpdateValidation = [
  body("products")
    .isArray({ min: 1 })
    .withMessage("Products must be a non-empty array"),

  body("products.*._id")
    .isMongoId()
    .withMessage("Invalid product ID in bulk update"),
];

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
        value: error.value,
      })),
    });
  }
  next();
};

module.exports = {
  createProductValidation,
  updateProductValidation,
  productQueryValidation,
  productIdValidation,
  categoryValidation,
  genderValidation,
  collectionValidation,
  searchValidation,
  bulkUpdateValidation,
  handleValidationErrors,
};
