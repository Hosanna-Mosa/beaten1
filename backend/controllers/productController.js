const Product = require('../models/Product');
const mongoose = require('mongoose');

// ✅ GET all products
const getProducts = async (req, res) => {
  try {
    const filter = {};
    if (req.query.gender) {
      filter.gender = req.query.gender;
    }
    // Add other filters as needed
    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
};

// ✅ GET single product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ CREATE new product with image
const createProduct = async (req, res) => {
  console.log("at startttttttttttttttttttttttt")
  try {
    const { 
      name, 
      price, 
      description, 
      isBestSeller,
      isTShirts,
      isShirts,
      isOversizedTShirts,
      isBottomWear,
      isCargoPants,
      isJackets,
      isHoodies,
      isCoOrdSets,
    } = req.body;

console.log(name, 
  price, 
  description, 
  isBestSeller,
  isTShirts,
  isShirts,
  isOversizedTShirts,
  isBottomWear,
  isCargoPants,
  isJackets,
  isHoodies,
  isCoOrdSets)
    console.log("request body", req.body)

    // ✅ Image filename from multer
    const image = req.file ? req.file.filename : '';
  
    const product = new Product({
      name,
      price,
      description,
      image, // Save image filename in MongoDB
      isBestSeller: typeof isBestSeller !== 'undefined' ? isBestSeller : false,
      isTShirts: typeof isTShirts !== 'undefined' ? isTShirts : false,
      isShirts: typeof isShirts !== 'undefined' ? isShirts : false,
      isOversizedTShirts: typeof isOversizedTShirts !== 'undefined' ? isOversizedTShirts : false,
      isBottomWear: typeof isBottomWear !== 'undefined' ? isBottomWear : false,
      isCargoPants: typeof isCargoPants !== 'undefined' ? isCargoPants : false,
      isJackets: typeof isJackets !== 'undefined' ? isJackets : false,
      isHoodies: typeof isHoodies !== 'undefined' ? isHoodies : false,
      isCoOrdSets: typeof isCoOrdSets !== 'undefined' ? isCoOrdSets : false,
    });

    const createdProduct = await product.save();
    console.log("the saved product", createdProduct)
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// ✅ UPDATE product (excluding image)
const updateProduct = async (req, res) => {
  try {
    const { 
      name, 
      price, 
      description, 
      stock, 
      isBestSeller,
      isTShirts,
      isShirts,
      isOversizedTShirts,
      isBottomWear,
      isCargoPants,
      isJackets,
      isHoodies,
      isCoOrdSets
    } = req.body;
    // Get image filename from multer if present
    const image = req.file ? req.file.filename : undefined;
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.price = price || product.price;
      product.description = description || product.description;
      if (typeof stock !== 'undefined') {
        if (stock < 0) {
          return res.status(400).json({ message: 'Stock cannot be negative' });
        }
        product.stock = stock;
      }
      if (typeof isBestSeller !== 'undefined') {
        product.isBestSeller = isBestSeller;
      }
      if (typeof isTShirts !== 'undefined') {
        product.isTShirts = isTShirts;
      }
      if (typeof isShirts !== 'undefined') {
        product.isShirts = isShirts;
      }
      if (typeof isOversizedTShirts !== 'undefined') {
        product.isOversizedTShirts = isOversizedTShirts;
      }
      if (typeof isBottomWear !== 'undefined') {
        product.isBottomWear = isBottomWear;
      }
      if (typeof isCargoPants !== 'undefined') {
        product.isCargoPants = isCargoPants;
      }
      if (typeof isJackets !== 'undefined') {
        product.isJackets = isJackets;
      }
      if (typeof isHoodies !== 'undefined') {
        product.isHoodies = isHoodies;
      }
      if (typeof isCoOrdSets !== 'undefined') {
        product.isCoOrdSets = isCoOrdSets;
      }
      if (image) product.image = image;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// ✅ DELETE product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// ✅ BULK DELETE products
const bulkDeleteProducts = async (req, res) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid or empty "ids" array',
    });
  }

  try {
    const validIds = ids.filter(id =>
      mongoose.Types.ObjectId.isValid(id)
    );

    if (validIds.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'No valid ObjectIds provided.',
      });
    }

    const objectIds = validIds.map(id => new mongoose.Types.ObjectId(id));
    const result = await Product.deleteMany({ _id: { $in: objectIds } });

    res.json({
      status: 'success',
      message: `${result.deletedCount} product(s) deleted`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error('Bulk delete error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

const getBestSellers = async (req, res) => {
  try {
    const bestSellers = await Product.find({ isBestSeller: true });
    res.json(bestSellers);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch best sellers', error: error.message });
  }
};

// Get T-Shirts section products
const getTShirts = async (req, res) => {
  try {
    const tShirts = await Product.find({ isTShirts: true });
    res.json(tShirts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch T-Shirts', error: error.message });
  }
};

// Get Shirts section products
const getShirts = async (req, res) => {
  try {
    const shirts = await Product.find({ isShirts: true });
    res.json(shirts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch Shirts', error: error.message });
  }
};

// Get Oversized T-Shirts section products
const getOversizedTShirts = async (req, res) => {
  try {
    const oversizedTShirts = await Product.find({ isOversizedTShirts: true });
    res.json(oversizedTShirts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch Oversized T-Shirts', error: error.message });
  }
};

// Get Bottom Wear section products
const getBottomWear = async (req, res) => {
  try {
    const bottomWear = await Product.find({ isBottomWear: true });
    res.json(bottomWear);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch Bottom Wear', error: error.message });
  }
};

// Get Cargo Pants section products
const getCargoPants = async (req, res) => {
  try {
    const cargoPants = await Product.find({ isCargoPants: true });
    res.json(cargoPants);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch Cargo Pants', error: error.message });
  }
};

// Get Jackets section products
const getJackets = async (req, res) => {
  try {
    const jackets = await Product.find({ isJackets: true });
    res.json(jackets);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch Jackets', error: error.message });
  }
};

// Get Hoodies section products
const getHoodies = async (req, res) => {
  try {
    const hoodies = await Product.find({ isHoodies: true });
    res.json(hoodies);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch Hoodies', error: error.message });
  }
};

// Get Co-Ord Sets section products
const getCoOrdSets = async (req, res) => {
  try {
    const coOrdSets = await Product.find({ isCoOrdSets: true });
    res.json(coOrdSets);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch Co-Ord Sets', error: error.message });
  }
};

// Get Shop By Category section products
const getShopByCategory = async (req, res) => {
  try {
    const shopByCategory = await Product.find({ isShopByCategory: true });
    res.json(shopByCategory);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch Shop By Category', error: error.message });
  }
};

module.exports = {
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
  getShopByCategory,
};
 