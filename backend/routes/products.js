const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  getProductsByGender,
  getProductsByCollection,
  searchProducts,
  getFeaturedProducts,
  getNewArrivals,
  getBestSellers,
  getCategories,
  bulkUpdateProducts,
  getProductStats
} = require('../controllers/productController');

// Import middleware
const { protect, authorize } = require('../middleware/auth');
const {
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
} = require('../middleware/productValidation');

// Public routes
router.get('/', productQueryValidation, handleValidationErrors, getProducts);
router.get('/search', searchValidation, handleValidationErrors, searchProducts);
router.get('/featured', getFeaturedProducts);
router.get('/new-arrivals', getNewArrivals);
router.get('/best-sellers', getBestSellers);
router.get('/categories', getCategories);
router.get('/category/:category', categoryValidation, handleValidationErrors, getProductsByCategory);
router.get('/gender/:gender', genderValidation, handleValidationErrors, getProductsByGender);
router.get('/collection/:collection', collectionValidation, handleValidationErrors, getProductsByCollection);
router.get('/:id', productIdValidation, handleValidationErrors, getProductById);

// Protected routes (Admin only)
router.post('/', protect, authorize('admin'), createProductValidation, handleValidationErrors, createProduct);
router.put('/:id', protect, authorize('admin'), updateProductValidation, handleValidationErrors, updateProduct);
router.delete('/:id', protect, authorize('admin'), productIdValidation, handleValidationErrors, deleteProduct);
router.put('/bulk-update', protect, authorize('admin'), bulkUpdateValidation, handleValidationErrors, bulkUpdateProducts);
router.get('/stats', protect, authorize('admin'), getProductStats);

module.exports = router; 