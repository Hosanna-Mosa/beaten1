const Promotion = require('../models/Promotion');

// @desc    Create multiple promotion codes
// @route   POST /api/promotions/create
// @access  Private/Admin
const createPromotions = async (req, res) => {
  const { codes } = req.body;
  
  try {
    // Validate required fields
    if (!codes || !Array.isArray(codes) || codes.length === 0) {
      return res.status(400).json({ 
        message: 'Codes array is required and must not be empty' 
      });
    }

    // Process and validate each code
    const processedCodes = codes.map(code => {
      // Convert string dates to Date objects
      const processedCode = {
        ...code,
        type: 'coupon', // Always set type to 'coupon'
        validFrom: new Date(code.validFrom),
        validUntil: new Date(code.validUntil),
        discount: parseInt(code.discount),
        minPurchase: parseInt(code.minPurchase),
        usageLimit: parseInt(code.usageLimit),
        usedCount: 0,
        status: 'active',
        category: code.category || 'public',
        isPersonal: code.category === 'personal'
      };

      // Validate required fields
      if (!processedCode.code || !processedCode.discount || !processedCode.validFrom || !processedCode.validUntil || !processedCode.usageLimit) {
        throw new Error('All codes must have code, discount, validFrom, validUntil, and usageLimit fields');
      }

      // Validate date ranges
      if (processedCode.validFrom >= processedCode.validUntil) {
        throw new Error('ValidFrom date must be before ValidUntil date');
      }

      // Validate discount range
      if (processedCode.discount < 1 || processedCode.discount > 100) {
        throw new Error('Discount must be between 1 and 100');
      }

      return processedCode;
    });

    const saved = await Promotion.insertMany(processedCodes);
    res.status(201).json({ 
      message: 'Codes saved successfully', 
      saved,
      count: saved.length 
    });
  } catch (err) {
    console.error('Error creating promotions:', err);
    
    // Handle duplicate code error
    if (err.code === 11000) {
      return res.status(400).json({ 
        message: 'One or more codes already exist. Please try again.' 
      });
    }
    
    // Handle validation errors
    if (err.message.includes('All codes must have') || err.message.includes('ValidFrom date') || err.message.includes('Discount must be')) {
      return res.status(400).json({ 
        message: err.message 
      });
    }
    
    res.status(500).json({ 
      message: 'Server Error',
      error: err.message 
    });
  }
};

// @desc    Update existing coupons with valid dates
// @route   POST /api/promotions/update-dates
// @access  Private/Admin
const updateCouponDates = async (req, res) => {
  try {
    const now = new Date();
    const validFrom = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 1 day ago
    const validUntil = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000); // 1 year from now

    const result = await Promotion.updateMany(
      { status: 'active' },
      { 
        validFrom: validFrom,
        validUntil: validUntil
      }
    );

    res.status(200).json({
      message: 'Coupon dates updated successfully',
      updatedCount: result.modifiedCount
    });
  } catch (err) {
    console.error('Error updating coupon dates:', err);
    res.status(500).json({ 
      message: 'Server Error',
      error: err.message 
    });
  }
};

// @desc    Validate coupon code
// @route   POST /api/promotions/validate
// @access  Public
const validateCoupon = async (req, res) => {
  const { code, orderTotal = 0 } = req.body;

  try {
    if (!code) {
      return res.status(400).json({ 
        message: 'Coupon code is required' 
      });
    }

    // Find the coupon
    const coupon = await Promotion.findOne({ 
      code: code.toUpperCase(),
      status: 'active'
    });

    if (!coupon) {
      return res.status(404).json({ 
        message: 'Invalid coupon code' 
      });
    }

    // Check if coupon is expired (with more detailed error messages)
    const now = new Date();
    if (now < coupon.validFrom) {
      return res.status(400).json({ 
        message: `Coupon is not yet valid. Valid from: ${coupon.validFrom.toDateString()}` 
      });
    }
    
    if (now > coupon.validUntil) {
      return res.status(400).json({ 
        message: `Coupon has expired. Expired on: ${coupon.validUntil.toDateString()}` 
      });
    }

    // Check usage limit
    if (coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ 
        message: 'Coupon usage limit exceeded' 
      });
    }

    // Check minimum purchase amount
    if (orderTotal < coupon.minPurchase) {
      return res.status(400).json({ 
        message: `Minimum purchase amount of ₹${coupon.minPurchase} required` 
      });
    }

    // Calculate discount amount
    const discountAmount = (orderTotal * coupon.discount) / 100;

    res.status(200).json({
      valid: true,
      coupon: {
        code: coupon.code,
        discount: coupon.discount,
        discountAmount: discountAmount,
        minPurchase: coupon.minPurchase,
        category: coupon.category,
        isPersonal: coupon.isPersonal,
        recipientName: coupon.recipientName,
        recipientEmail: coupon.recipientEmail,
        description: coupon.description
      }
    });

  } catch (err) {
    console.error('Error validating coupon:', err);
    res.status(500).json({ 
      message: 'Server Error',
      error: err.message 
    });
  }
};

// @desc    Get all promotion codes
// @route   GET /api/promotions
// @access  Public
const getAllPromotions = async (req, res) => {
  try {
    const promotions = await Promotion.find().sort({ createdAt: -1 });
    res.status(200).json(promotions);
  } catch (err) {
    console.error('Error fetching promotions:', err);
    res.status(500).json({ 
      message: 'Server Error',
      error: err.message 
    });
  }
};

// @desc    Mark coupon as used
// @route   POST /api/promotions/use
// @access  Public
const useCoupon = async (req, res) => {
  const { code } = req.body;

  try {
    if (!code) {
      return res.status(400).json({ 
        message: 'Coupon code is required' 
      });
    }

    // Find and update the coupon usage count
    const coupon = await Promotion.findOneAndUpdate(
      { 
        code: code.toUpperCase(),
        status: 'active'
      },
      { 
        $inc: { usedCount: 1 } 
      },
      { new: true }
    );

    if (!coupon) {
      return res.status(404).json({ 
        message: 'Coupon not found or inactive' 
      });
    }

    res.status(200).json({
      message: 'Coupon marked as used',
      coupon: {
        code: coupon.code,
        usedCount: coupon.usedCount,
        usageLimit: coupon.usageLimit
      }
    });

  } catch (err) {
    console.error('Error using coupon:', err);
    res.status(500).json({ 
      message: 'Server Error',
      error: err.message 
    });
  }
};

// @desc    Fix coupon dates for testing (Public endpoint)
// @route   POST /api/promotions/fix-dates
// @access  Public
const fixCouponDates = async (req, res) => {
  try {
    const now = new Date();
    const validFrom = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 1 day ago
    const validUntil = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000); // 1 year from now

    const result = await Promotion.updateMany(
      { status: 'active' },
      { 
        validFrom: validFrom,
        validUntil: validUntil
      }
    );

    res.status(200).json({
      message: 'Coupon dates fixed successfully',
      updatedCount: result.modifiedCount,
      validFrom: validFrom,
      validUntil: validUntil
    });
  } catch (err) {
    console.error('Error fixing coupon dates:', err);
    res.status(500).json({ 
      message: 'Server Error',
      error: err.message 
    });
  }
};

// Export all handlers
module.exports = {
  createPromotions,
  getAllPromotions,
  validateCoupon,
  useCoupon,
  updateCouponDates,
  fixCouponDates
};
