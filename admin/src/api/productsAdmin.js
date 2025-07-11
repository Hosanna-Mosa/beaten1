// Dummy Products API - Replaces backend calls with dummy data
import { dummyDataAPI } from "./dummyData";

// Get all products
export const getProducts = (params) =>
  dummyDataAPI.products.getProducts(params);

// Get a single product by ID
export const getProductById = (id) => dummyDataAPI.products.getProductById(id);

// Create a new product
export const createProduct = (productData) =>
  dummyDataAPI.products.createProduct(productData);

// Update a product by ID
export const updateProduct = (id, productData) =>
  dummyDataAPI.products.updateProduct(id, productData);

// Delete a product by ID
export const deleteProduct = (id) => dummyDataAPI.products.deleteProduct(id);

// Bulk delete products
export const bulkDeleteProducts = (ids) =>
  dummyDataAPI.products.bulkDeleteProducts(ids);
