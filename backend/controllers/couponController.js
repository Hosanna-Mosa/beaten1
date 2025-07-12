const Coupon = require('../models/Coupon');
const User = require('../models/User');

// Create a new coupon
exports.createCoupon = async (req, res) => {
  try {
    const coupon = new Coupon({ ...req.body, createdBy: req.admin._id });
    await coupon.save();
    res.status(201).json({ success: true, data: coupon });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Get/list/search coupons
exports.getCoupons = async (req, res) => {
  try {
    const { search, type, status } = req.query;
    const filter = {};
    if (search) filter.code = { $regex: search, $options: 'i' };
    if (type) filter.type = type;
    if (status) filter.status = status;
    const coupons = await Coupon.find(filter).populate('recipient', 'email').sort({ createdAt: -1 });
    res.json({ success: true, data: coupons });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update coupon
exports.updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });
    res.json({ success: true, data: coupon });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Delete coupon
exports.deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });
    res.json({ success: true, message: 'Coupon deleted' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Validate/apply coupon (user side)
exports.applyCoupon = async (req, res) => {
  try {
    const { code, userId, cartTotal } = req.body;
    const coupon = await Coupon.findOne({ code });
    if (!coupon) return res.status(404).json({ success: false, message: 'Invalid coupon code' });
    const now = new Date();
    if (coupon.status !== 'active' || now < coupon.validFrom || now > coupon.validUntil) {
      return res.status(400).json({ success: false, message: 'Coupon is not valid at this time' });
    }
    if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ success: false, message: 'Coupon usage limit reached' });
    }
    if (cartTotal < coupon.minPurchase) {
      return res.status(400).json({ success: false, message: `Minimum purchase is $${coupon.minPurchase}` });
    }
    if (coupon.type === 'personal' && (!coupon.recipient || coupon.recipient.toString() !== userId)) {
      return res.status(400).json({ success: false, message: 'Coupon not valid for this user' });
    }
    // Optionally increment usedCount here if you want to lock usage immediately
    res.json({ success: true, data: coupon });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}; 