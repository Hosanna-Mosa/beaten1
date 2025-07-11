const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema(
  {
    sku: { type: String, required: true, unique: true },
    color: String,
    size: String,
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    images: [String],
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: String,
    brand: String,
    categories: [{ type: String, index: true }],
    tags: [String],
    mainImage: String,
    images: [String],
    variants: [variantSchema],
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    reviews: { type: Number, min: 0, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
