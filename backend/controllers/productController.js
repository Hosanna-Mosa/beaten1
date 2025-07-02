const Product = require('../models/Product');
const mongoose = require('mongoose');

// GET all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    console.log('Found products:', products.map(p => ({ id: p._id, name: p.name })));
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// GET single product
const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

// CREATE new product
const createProduct = async (req, res) => {
  const product = new Product(req.body);
  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
};

// UPDATE product
const updateProduct = async (req, res) => {
  const { name, price, description } = req.body;
  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

// DELETE product
const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await product.remove();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

// BULK DELETE products
const bulkDeleteProducts = async (req, res) => {
  const { ids } = req.body;

  console.log('Received bulk delete request with IDs:', ids);

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ 
      status: 'error', 
      message: 'Invalid or empty "ids" array',
      receivedData: req.body
    });
  }

  try {
    // Log all received IDs for debugging
    console.log('All received IDs:', ids);
    console.log('ID types:', ids.map(id => ({ id, type: typeof id, isValid: mongoose.Types.ObjectId.isValid(id) })));

    // Filter out invalid ObjectIds
    const validIds = ids.filter(id => {
      if (typeof id !== 'string') {
        console.log(`Skipping non-string ID: ${id} (type: ${typeof id})`);
        return false;
      }
      const isValid = mongoose.Types.ObjectId.isValid(id);
      if (!isValid) {
        console.log(`Skipping invalid ObjectId: ${id}`);
      }
      return isValid;
    });

    console.log('Valid IDs:', validIds);

    if (validIds.length === 0) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'No valid ObjectIds provided. All IDs must be valid MongoDB ObjectIds.',
        receivedIds: ids,
        validIds: validIds,
        exampleValidId: '507f1f77bcf86cd799439011',
        help: 'Make sure you are sending actual MongoDB ObjectIds from the database, not placeholder values like "id1", "id2"'
      });
    }

    // Convert string IDs to ObjectIds
    const objectIds = validIds.map(id => new mongoose.Types.ObjectId(id));

    const result = await Product.deleteMany({ _id: { $in: objectIds } });
    
    console.log(`Bulk delete result: ${result.deletedCount} products deleted`);
    
    res.json({
      status: 'success',
      message: `${result.deletedCount} product(s) deleted`,
      totalRequested: ids.length,
      validIds: validIds.length,
      invalidIds: ids.length - validIds.length,
      receivedIds: ids,
      validIds: validIds
    });
  } catch (error) {
    console.error('Bulk delete error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: error.message,
      receivedIds: ids
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkDeleteProducts // ✅ Export it
};
