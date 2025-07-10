const express = require('express');
const router = express.Router();
const { createPromotions, getAllPromotions, validateCoupon, useCoupon, updateCouponDates, fixCouponDates } = require('../controllers/promotionController');
const { protect, admin } = require('../middleware/auth');

// POST /api/promotions/create - Protected, Admin only
router.post('/create', protect, admin, createPromotions);

// POST /api/promotions/update-dates - Protected, Admin only (to fix existing coupons)
router.post('/update-dates', protect, admin, updateCouponDates);

// POST /api/promotions/fix-dates - Public (to fix coupon dates for testing)
router.post('/fix-dates', fixCouponDates);

// POST /api/promotions/validate - Public (for users to validate coupons)
router.post('/validate', validateCoupon);

// POST /api/promotions/use - Public (for marking coupons as used)
router.post('/use', useCoupon);

// GET /api/promotions - Public (for users to check valid coupons)
router.get('/', getAllPromotions);

module.exports = router;
