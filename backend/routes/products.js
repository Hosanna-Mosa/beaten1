const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkDeleteProducts,
  getBestSellers,
  getTShirts,
  getShirts,
  getOversizedTShirts,
  getBottomWear,
  getCargoPants,
  getJackets,
  getHoodies,
  getCoOrdSets,
  getShopByCategory
} = require('../controllers/productController');

// GET /api/products
router.get('/', getProducts);

// POST /api/products
router.post('/', createProduct);

// POST /api/products/bulk-delete
router.post('/bulk-delete', bulkDeleteProducts);

// Category section routes (must come before /:id routes)
// GET /api/products/best-sellers
router.get('/best-sellers', getBestSellers);

// GET /api/products/t-shirts
router.get('/t-shirts', getTShirts);

// GET /api/products/shirts
router.get('/shirts', getShirts);

// GET /api/products/oversized-t-shirts
router.get('/oversized-t-shirts', getOversizedTShirts);

// GET /api/products/bottom-wear
router.get('/bottom-wear', getBottomWear);

// GET /api/products/cargo-pants
router.get('/cargo-pants', getCargoPants);

// GET /api/products/jackets
router.get('/jackets', getJackets);

// GET /api/products/hoodies
router.get('/hoodies', getHoodies);

// GET /api/products/co-ord-sets
router.get('/co-ord-sets', getCoOrdSets);

// GET /api/products/shop-by-category
router.get('/shop-by-category', getShopByCategory);

// GET /api/products/:id
router.get('/:id', getProductById);

// DELETE /api/products/:id
router.delete('/:id', deleteProduct);

// PUT /api/products/:id
router.put('/:id', updateProduct);

module.exports = router;
 