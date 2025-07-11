const { body, param, query, validationResult } = require('express-validator');

// Validation rules for creating a product
const createProductValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Product name must be between 2 and 100 characters'),
  
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  
  body('originalPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Original price must be a positive number'),
  
  body('image')
    .trim()
    .notEmpty()
    .withMessage('Product image is required'),
  
  body('images')
    .optional()
    .isArray()
    .withMessage('Images must be an array'),
  
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
    .isIn(['T-shirts', 'Shirts', 'Bottom Wear', 'Hoodies', 'Jackets', 'Co-ord Sets', 'Dresses'])
    .withMessage('Invalid category'),
  
  body('subCategory')
    .trim()
    .notEmpty()
    .withMessage('Sub-category is required'),
  
  body('collection')
    .trim()
    .notEmpty()
    .withMessage('Collection is required')
    .isIn([
      'Beaten Exclusive Collection',
      'Beaten Launch Sale Vol 1',
      'Beaten Signature Collection',
      'New Arrivals',
      'Best Sellers',
      'Summer Collection',
      'Winter Collection'
    ])
    .withMessage('Invalid collection'),
  
  body('gender')
    .trim()
    .notEmpty()
    .withMessage('Gender is required')
    .isIn(['MEN', 'WOMEN'])
    .withMessage('Gender must be either MEN or WOMEN'),
  
  body('sizes')
    .isArray({ min: 1 })
    .withMessage('At least one size is required'),
  
  body('sizes.*')
    .isIn(['S', 'M', 'L', 'XL', 'XXL'])
    .withMessage('Invalid size'),
  
  body('colors')
    .optional()
    .isArray()
    .withMessage('Colors must be an array'),
  
  body('fit')
    .optional()
    .isIn(['Slim', 'Oversized', 'Regular'])
    .withMessage('Invalid fit'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  
  body('features')
    .optional()
    .isArray()
    .withMessage('Features must be an array'),
  
  body('specifications')
    .optional()
    .isObject()
    .withMessage('Specifications must be an object'),
  
  body('inStock')
    .optional()
    .isBoolean()
    .withMessage('inStock must be a boolean'),
  
  body('rating')
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage('Rating must be between 0 and 5'),
  
  body('reviews')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Reviews must be a non-negative integer'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  
  body('discount')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Discount must be between 0 and 100'),
  
  body('isFeatured')
    .optional()
    .isBoolean()
    .withMessage('isFeatured must be a boolean'),
  
  body('isNewArrival')
    .optional()
    .isBoolean()
    .withMessage('isNewArrival must be a boolean'),
  
  body('isBestSeller')
    .optional()
    .isBoolean()
    .withMessage('isBestSeller must be a boolean'),
  
  body('stockQuantity')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock quantity must be a non-negative integer'),
  
  body('sku')
    .optional()
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('SKU must be between 3 and 20 characters')
];

// Validation rules for updating a product
const updateProductValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid product ID'),
  
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Product name must be between 2 and 100 characters'),
  
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  
  body('originalPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Original price must be a positive number'),
  
  body('category')
    .optional()
    .isIn(['T-shirts', 'Shirts', 'Bottom Wear', 'Hoodies', 'Jackets', 'Co-ord Sets', 'Dresses'])
    .withMessage('Invalid category'),
  
  body('collection')
    .optional()
    .isIn([
      'Beaten Exclusive Collection',
      'Beaten Launch Sale Vol 1',
      'Beaten Signature Collection',
      'New Arrivals',
      'Best Sellers',
      'Summer Collection',
      'Winter Collection'
    ])
    .withMessage('Invalid collection'),
  
  body('gender')
    .optional()
    .isIn(['MEN', 'WOMEN'])
    .withMessage('Gender must be either MEN or WOMEN'),
  
  body('sizes')
    .optional()
    .isArray({ min: 1 })
    .withMessage('At least one size is required'),
  
  body('sizes.*')
    .optional()
    .isIn(['S', 'M', 'L', 'XL', 'XXL'])
    .withMessage('Invalid size'),
  
  body('fit')
    .optional()
    .isIn(['Slim', 'Oversized', 'Regular'])
    .withMessage('Invalid fit'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  
  body('rating')
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage('Rating must be between 0 and 5'),
  
  body('reviews')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Reviews must be a non-negative integer'),
  
  body('discount')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Discount must be between 0 and 100'),
  
  body('stockQuantity')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock quantity must be a non-negative integer')
];

// Validation rules for query parameters
const productQueryValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Min price must be a positive number'),
  
  query('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Max price must be a positive number'),
  
  query('sort')
    .optional()
    .isIn(['newest', 'price_asc', 'price_desc', 'rating', 'popular'])
    .withMessage('Invalid sort option'),
  
  query('category')
    .optional()
    .isIn(['T-shirts', 'Shirts', 'Bottom Wear', 'Hoodies', 'Jackets', 'Co-ord Sets', 'Dresses'])
    .withMessage('Invalid category'),
  
  query('gender')
    .optional()
    .isIn(['MEN', 'WOMEN'])
    .withMessage('Invalid gender'),
  
  query('isFeatured')
    .optional()
    .isBoolean()
    .withMessage('isFeatured must be a boolean'),
  
  query('isNewArrival')
    .optional()
    .isBoolean()
    .withMessage('isNewArrival must be a boolean'),
  
  query('isBestSeller')
    .optional()
    .isBoolean()
    .withMessage('isBestSeller must be a boolean'),
  
  query('inStock')
    .optional()
    .isBoolean()
    .withMessage('inStock must be a boolean')
];

// Validation rules for product ID parameter
const productIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid product ID')
];

// Validation rules for category parameter
const categoryValidation = [
  param('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
    .isIn(['T-shirts', 'Shirts', 'Bottom Wear', 'Hoodies', 'Jackets', 'Co-ord Sets', 'Dresses'])
    .withMessage('Invalid category')
];

// Validation rules for gender parameter
const genderValidation = [
  param('gender')
    .trim()
    .notEmpty()
    .withMessage('Gender is required')
    .isIn(['MEN', 'WOMEN'])
    .withMessage('Invalid gender')
];

// Validation rules for collection parameter
const collectionValidation = [
  param('collection')
    .trim()
    .notEmpty()
    .withMessage('Collection is required')
    .isIn([
      'Beaten Exclusive Collection',
      'Beaten Launch Sale Vol 1',
      'Beaten Signature Collection',
      'New Arrivals',
      'Best Sellers',
      'Summer Collection',
      'Winter Collection'
    ])
    .withMessage('Invalid collection')
];

// Validation rules for search query
const searchValidation = [
  query('q')
    .trim()
    .notEmpty()
    .withMessage('Search query is required')
    .isLength({ min: 2 })
    .withMessage('Search query must be at least 2 characters long')
];

// Validation rules for bulk update
const bulkUpdateValidation = [
  body('products')
    .isArray({ min: 1 })
    .withMessage('Products must be a non-empty array'),
  
  body('products.*._id')
    .isMongoId()
    .withMessage('Invalid product ID in bulk update')
];

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
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
  handleValidationErrors
}; 