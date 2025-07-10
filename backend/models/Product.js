const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  image: String, // ✅ stores uploaded image filename
  category: String,
  subCategory: String,
  collection: String,
  inStock: Boolean,
  colors: [String],
  gender: {
    type: String,
    enum: ['Men', 'Women', 'Unisex'],
    required: false,
  },
  sizes: [String],
  discount: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  sku: String,
  stock: Number,
  status: String,
  rating: Number,
  reviews: Number,
  isBestSeller: {
    type: Boolean,
    default: false
  },
  isShopByCategory: {
    type: Boolean,
    default: false,
  },
  // Category section flags
  isTShirts: {
    type: Boolean,
    default: false
  },
  isShirts: {
    type: Boolean,
    default: false
  },
  isOversizedTShirts: {
    type: Boolean,
    default: false
  },
  isBottomWear: {
    type: Boolean,
    default: false
  },
  isCargoPants: {
    type: Boolean,
    default: false
  },
  isJackets: {
    type: Boolean,
    default: false
  },
  isHoodies: {
    type: Boolean,
    default: false
  },
  isCoOrdSets: {
    type: Boolean,
    default: false
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Product', productSchema);
