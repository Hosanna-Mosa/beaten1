const Product = require('../models/Product');

// @desc    Get all products with filtering and pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      subCategory,
      gender,
      collection,
      minPrice,
      maxPrice,
      size,
      color,
      fit,
      sort = 'newest',
      search,
      isFeatured,
      isNewArrival,
      isBestSeller,
      inStock
    } = req.query;

    // Build filter object
    const filter = {};

    if (category) {
      filter.category = { $in: Array.isArray(category) ? category : [category] };
    }

    if (subCategory) {
      filter.subCategory = { $in: Array.isArray(subCategory) ? subCategory : [subCategory] };
    }

    if (gender) {
      filter.gender = { $in: Array.isArray(gender) ? gender : [gender] };
    }

    if (collection) {
      filter.collection = { $in: Array.isArray(collection) ? collection : [collection] };
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (size) {
      filter.sizes = { $in: Array.isArray(size) ? size : [size] };
    }

    if (color) {
      filter.colors = { $in: Array.isArray(color) ? color : [color] };
    }

    if (fit) {
      filter.fit = { $in: Array.isArray(fit) ? fit : [fit] };
    }

    if (isFeatured !== undefined) {
      filter.isFeatured = isFeatured === 'true';
    }

    if (isNewArrival !== undefined) {
      filter.isNewArrival = isNewArrival === 'true';
    }

    if (isBestSeller !== undefined) {
      filter.isBestSeller = isBestSeller === 'true';
    }

    if (inStock !== undefined) {
      filter.inStock = inStock === 'true';
    }

    // Search functionality
    if (search) {
      filter.$text = { $search: search };
    }

    // Build sort object
    let sortObj = {};
    switch (sort) {
      case 'price_asc':
        sortObj = { price: 1 };
        break;
      case 'price_desc':
        sortObj = { price: -1 };
        break;
      case 'rating':
        sortObj = { rating: -1 };
        break;
      case 'popular':
        sortObj = { reviews: -1 };
        break;
      case 'newest':
      default:
        sortObj = { createdAt: -1 };
        break;
    }

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Execute query
    const products = await Product.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(Number(limit))
      .lean();

    // Get total count for pagination
    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      data: products,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalProducts: total,
        hasNextPage: skip + products.length < total,
        hasPrevPage: Number(page) > 1
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private (Admin only)
const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    
    res.status(201).json({
      success: true,
      data: product,
      message: 'Product created successfully'
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating product',
      error: error.message
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Admin only)
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product,
      message: 'Product updated successfully'
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating product',
      error: error.message
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Admin only)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message
    });
  }
};

// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Public
const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 12 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const products = await Product.find({ category })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await Product.countDocuments({ category });

    res.json({
      success: true,
      data: products,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalProducts: total
      }
    });
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products by category',
      error: error.message
    });
  }
};

// @desc    Get products by gender
// @route   GET /api/products/gender/:gender
// @access  Public
const getProductsByGender = async (req, res) => {
  try {
    const { gender } = req.params;
    const { page = 1, limit = 12 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const products = await Product.find({ gender })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await Product.countDocuments({ gender });

    res.json({
      success: true,
      data: products,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalProducts: total
      }
    });
  } catch (error) {
    console.error('Error fetching products by gender:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products by gender',
      error: error.message
    });
  }
};

// @desc    Get products by collection
// @route   GET /api/products/collection/:collection
// @access  Public
const getProductsByCollection = async (req, res) => {
  try {
    const { collection } = req.params;
    const { page = 1, limit = 12 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const products = await Product.find({ collection })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await Product.countDocuments({ collection });

    res.json({
      success: true,
      data: products,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalProducts: total
      }
    });
  } catch (error) {
    console.error('Error fetching products by collection:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products by collection',
      error: error.message
    });
  }
};

// @desc    Search products
// @route   GET /api/products/search
// @access  Public
const searchProducts = async (req, res) => {
  try {
    const { q, page = 1, limit = 12 } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const skip = (Number(page) - 1) * Number(limit);

    const products = await Product.find({
      $text: { $search: q }
    })
      .sort({ score: { $meta: 'textScore' } })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await Product.countDocuments({
      $text: { $search: q }
    });

    res.json({
      success: true,
      data: products,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalProducts: total
      }
    });
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching products',
      error: error.message
    });
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = async (req, res) => {
  try {
    const { limit = 8 } = req.query;

    const products = await Product.find({ isFeatured: true })
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .lean();

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Error fetching featured products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching featured products',
      error: error.message
    });
  }
};

// @desc    Get new arrivals
// @route   GET /api/products/new-arrivals
// @access  Public
const getNewArrivals = async (req, res) => {
  try {
    const { limit = 8 } = req.query;

    const products = await Product.find({ isNewArrival: true })
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .lean();

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Error fetching new arrivals:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching new arrivals',
      error: error.message
    });
  }
};

// @desc    Get best sellers
// @route   GET /api/products/best-sellers
// @access  Public
const getBestSellers = async (req, res) => {
  try {
    const { limit = 8 } = req.query;

    const products = await Product.find({ isBestSeller: true })
      .sort({ rating: -1, reviews: -1 })
      .limit(Number(limit))
      .lean();

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Error fetching best sellers:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching best sellers',
      error: error.message
    });
  }
};

// @desc    Get product categories
// @route   GET /api/products/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    const subCategories = await Product.distinct('subCategory');
    const collections = await Product.distinct('collection');

    res.json({
      success: true,
      data: {
        categories,
        subCategories,
        collections
      }
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    });
  }
};

// @desc    Bulk update products
// @route   PUT /api/products/bulk-update
// @access  Private (Admin only)
const bulkUpdateProducts = async (req, res) => {
  try {
    const { products } = req.body;

    if (!Array.isArray(products)) {
      return res.status(400).json({
        success: false,
        message: 'Products must be an array'
      });
    }

    const updatePromises = products.map(product => 
      Product.findByIdAndUpdate(product._id, product, { new: true })
    );

    const updatedProducts = await Promise.all(updatePromises);

    res.json({
      success: true,
      data: updatedProducts,
      message: `${updatedProducts.length} products updated successfully`
    });
  } catch (error) {
    console.error('Error bulk updating products:', error);
    res.status(500).json({
      success: false,
      message: 'Error bulk updating products',
      error: error.message
    });
  }
};

// @desc    Get product statistics
// @route   GET /api/products/stats
// @access  Private (Admin only)
const getProductStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const inStockProducts = await Product.countDocuments({ inStock: true });
    const outOfStockProducts = await Product.countDocuments({ inStock: false });
    const featuredProducts = await Product.countDocuments({ isFeatured: true });
    const newArrivals = await Product.countDocuments({ isNewArrival: true });
    const bestSellers = await Product.countDocuments({ isBestSeller: true });

    // Get category distribution
    const categoryStats = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get gender distribution
    const genderStats = await Product.aggregate([
      {
        $group: {
          _id: '$gender',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        totalProducts,
        inStockProducts,
        outOfStockProducts,
        featuredProducts,
        newArrivals,
        bestSellers,
        categoryStats,
        genderStats
      }
    });
  } catch (error) {
    console.error('Error fetching product stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product stats',
      error: error.message
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  getProductsByGender,
  getProductsByCollection,
  searchProducts,
  getFeaturedProducts,
  getNewArrivals,
  getBestSellers,
  getCategories,
  bulkUpdateProducts,
  getProductStats
}; 