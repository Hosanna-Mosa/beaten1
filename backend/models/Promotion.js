const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  type: { type: String, enum: ['coupon', 'scratch'], required: true },
  category: { 
    type: String, 
    enum: ['personal', 'public'], 
    default: 'public',
    required: true 
  },
  discount: { type: Number, required: true },
  minPurchase: { type: Number },
  validFrom: { type: Date, required: true },
  validUntil: { type: Date, required: true },
  usageLimit: { type: Number, required: true },
  usedCount: { type: Number, default: 0 },
  status: { type: String, default: 'active' },
  // Personal coupon fields
  recipientName: { type: String },
  recipientEmail: { type: String },
  description: { type: String },
  isPersonal: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Promotion', promotionSchema);
