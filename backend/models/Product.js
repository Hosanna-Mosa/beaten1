const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0,
    default: function() {
      return this.price;
    }
  },
  image: {
    type: String,
    required: true
  },
  images: [{
    type: String
  }],
  category: {
    type: String,
    required: true,
    enum: ['T-shirts', 'Shirts', 'Bottom Wear', 'Hoodies', 'Jackets', 'Co-ord Sets', 'Dresses']
  },
  subCategory: {
    type: String,
    required: true
  },
  collection: {
    type: String,
    required: true,
    enum: [
      'Beaten Exclusive Collection',
      'Beaten Launch Sale Vol 1',
      'Beaten Signature Collection',
      'New Arrivals',
      'Best Sellers',
      'Summer Collection',
      'Winter Collection'
    ]
  },
  gender: {
    type: String,
    required: true,
    enum: ['MEN', 'WOMEN']
  },
  sizes: [{
    type: String,
    enum: ['S', 'M', 'L', 'XL', 'XXL']
  }],
  colors: [{
    type: String
  }],
  fit: {
    type: String,
    enum: ['Slim', 'Oversized', 'Regular']
  },
  description: {
    type: String,
    required: true
  },
  features: [{
    type: String
  }],
  specifications: {
    Material: String,
    Fit: String,
    Care: String,
    Origin: String
  },
  inStock: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviews: {
    type: Number,
    min: 0,
    default: 0
  },
  tags: [{
    type: String
  }],
  discount: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isNewArrival: {
    type: Boolean,
    default: false
  },
  isBestSeller: {
    type: Boolean,
    default: false
  },
  stockQuantity: {
    type: Number,
    min: 0,
    default: 0
  },
  sku: {
    type: String,
    unique: true,
    sparse: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
productSchema.index({ category: 1, gender: 1 });
productSchema.index({ collection: 1 });
productSchema.index({ gender: 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ isNewArrival: 1 });
productSchema.index({ isBestSeller: 1 });
productSchema.index({ name: 'text', description: 'text' });

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
});

// Method to check if product is on sale
productSchema.methods.isOnSale = function() {
  return this.originalPrice > this.price;
};

// Static method to get products by category
productSchema.statics.getByCategory = function(category) {
  return this.find({ category: category });
};

// Static method to get products by gender
productSchema.statics.getByGender = function(gender) {
  return this.find({ gender: gender });
};

// Static method to get products by collection
productSchema.statics.getByCollection = function(collection) {
  return this.find({ collection: collection });
};

// Static method to get featured products
productSchema.statics.getFeatured = function() {
  return this.find({ isFeatured: true });
};

// Static method to get new arrivals
productSchema.statics.getNewArrivals = function() {
  return this.find({ isNewArrival: true });
};

// Static method to get best sellers
productSchema.statics.getBestSellers = function() {
  return this.find({ isBestSeller: true });
};

// Static method to search products
productSchema.statics.search = function(query) {
  return this.find({
    $text: { $search: query }
  });
};

module.exports = mongoose.model('Product', productSchema); 