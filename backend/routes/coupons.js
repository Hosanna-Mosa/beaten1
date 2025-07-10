const express = require('express');
const router = express.Router();
const CouponCode = require('../models/Promotion');

// Create a new coupon
router.post('/', async (req, res) => {
  try {
    const coupon = new CouponCode(req.body);
    await coupon.save();
    res.status(201).json({ success: true, data: coupon });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Get all coupons
router.get('/', async (req, res) => {
  try {
    const coupons = await CouponCode.find();
    res.status(200).json({ success: true, data: coupons });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get available (public) coupons
router.get('/available', async (req, res) => {
  try {
    const now = new Date();
    const coupons = await CouponCode.find({
      category: 'public',
      isPersonal: false,
      status: 'active',
      validFrom: { $lte: now },
      validUntil: { $gte: now }
    });
    res.status(200).json({ success: true, data: coupons });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Validate a coupon code
router.post('/validate', async (req, res) => {
  const { code, orderTotal } = req.body;

  try {
    const coupon = await CouponCode.findOne({ code });

    if (!coupon) {
      return res.status(404).json({ valid: false, message: 'Coupon not found' });
    }

    const now = new Date();

    if (coupon.status !== 'active' || now < coupon.validFrom || now > coupon.validUntil) {
      return res.status(400).json({ valid: false, message: 'Coupon is expired or inactive' });
    }

    if (coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ valid: false, message: 'Coupon usage limit reached' });
    }

    if (orderTotal < coupon.minPurchase) {
      return res.status(400).json({ valid: false, message: `Minimum purchase is ₹${coupon.minPurchase}` });
    }

    return res.status(200).json({ valid: true, discount: coupon.discount });
  } catch (err) {
    res.status(500).json({ valid: false, error: err.message });
  }
});

module.exports = router;
