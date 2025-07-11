const Product = require('../models/Product');
const mongoose = require('mongoose');

const sampleProducts = [
  // T-Shirts
  {
    name: 'Premium Street T-Shirt',
    price: 1299,
    originalPrice: 1599,
    image: '/images/1.png',
    images: ['/images/1.png', '/images/2.png', '/images/3.png', '/images/4.png'],
    category: 'T-shirts',
    subCategory: 'Regular',
    collection: 'Beaten Exclusive Collection',
    gender: 'MEN',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'White', 'Navy'],
    fit: 'Regular',
    description: 'Premium quality streetwear t-shirt crafted with exceptional materials and attention to detail. Perfect for urban style enthusiasts who demand both comfort and style.',
    features: [
      'Premium cotton blend',
      'Comfortable fit',
      'Durable construction',
      'Easy to maintain'
    ],
    specifications: {
      'Material': '100% Cotton',
      'Fit': 'Regular',
      'Care': 'Machine wash cold',
      'Origin': 'India'
    },
    inStock: true,
    rating: 4.5,
    reviews: 128,
    tags: ['premium', 'streetwear', 'urban'],
    discount: 19,
    isFeatured: true,
    stockQuantity: 50,
    sku: 'TS-PREM-001'
  },
  {
    name: 'Oversized Graphic T-Shirt',
    price: 1499,
    originalPrice: 1799,
    image: '/images/2.png',
    images: ['/images/2.png', '/images/3.png', '/images/4.png', '/images/5.png'],
    category: 'T-shirts',
    subCategory: 'Oversized',
    collection: 'Beaten Launch Sale Vol 1',
    gender: 'MEN',
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'White'],
    fit: 'Oversized',
    description: 'Trendy oversized t-shirt with unique graphic design. Perfect for street style and casual wear.',
    features: [
      'Oversized fit',
      'Graphic design',
      'Comfortable fabric',
      'Street style'
    ],
    specifications: {
      'Material': '100% Cotton',
      'Fit': 'Oversized',
      'Care': 'Machine wash cold',
      'Origin': 'India'
    },
    inStock: true,
    rating: 4.3,
    reviews: 95,
    tags: ['oversized', 'graphic', 'street'],
    discount: 17,
    isNewArrival: true,
    stockQuantity: 35,
    sku: 'TS-OVER-002'
  },
  {
    name: 'Classic Crew Neck T-Shirt',
    price: 999,
    originalPrice: 1199,
    image: '/images/3.png',
    images: ['/images/3.png', '/images/4.png', '/images/5.png', '/images/6.png'],
    category: 'T-shirts',
    subCategory: 'Regular',
    collection: 'Beaten Signature Collection',
    gender: 'MEN',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White', 'Black', 'Grey'],
    fit: 'Regular',
    description: 'Classic crew neck t-shirt with perfect fit and comfort. Essential for every wardrobe.',
    features: [
      'Classic design',
      'Perfect fit',
      'Comfortable',
      'Versatile'
    ],
    specifications: {
      'Material': '100% Cotton',
      'Fit': 'Regular',
      'Care': 'Machine wash cold',
      'Origin': 'India'
    },
    inStock: true,
    rating: 4.7,
    reviews: 156,
    tags: ['classic', 'crew', 'essential'],
    discount: 17,
    isBestSeller: true,
    stockQuantity: 75,
    sku: 'TS-CLASSIC-003'
  },

  // Shirts
  {
    name: 'Casual Linen Shirt',
    price: 1899,
    originalPrice: 2299,
    image: '/images/4.png',
    images: ['/images/4.png', '/images/5.png', '/images/6.png', '/images/7.png'],
    category: 'Shirts',
    subCategory: 'Casual wear',
    collection: 'Beaten Exclusive Collection',
    gender: 'MEN',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White', 'Blue', 'Pink'],
    fit: 'Regular',
    description: 'Comfortable linen shirt perfect for casual occasions. Breathable fabric keeps you cool.',
    features: [
      'Linen fabric',
      'Breathable',
      'Casual style',
      'Comfortable fit'
    ],
    specifications: {
      'Material': '100% Linen',
      'Fit': 'Regular',
      'Care': 'Dry clean recommended',
      'Origin': 'India'
    },
    inStock: true,
    rating: 4.4,
    reviews: 89,
    tags: ['linen', 'casual', 'breathable'],
    discount: 17,
    stockQuantity: 30,
    sku: 'SH-LINEN-004'
  },
  {
    name: 'Formal Cotton Shirt',
    price: 2199,
    originalPrice: 2599,
    image: '/images/5.png',
    images: ['/images/5.png', '/images/6.png', '/images/7.png', '/images/8.png'],
    category: 'Shirts',
    subCategory: 'Formal wear',
    collection: 'Beaten Signature Collection',
    gender: 'MEN',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White', 'Light Blue', 'Pink'],
    fit: 'Regular',
    description: 'Professional formal shirt suitable for office and business meetings.',
    features: [
      'Formal design',
      'Professional look',
      'Comfortable fit',
      'Easy iron'
    ],
    specifications: {
      'Material': '100% Cotton',
      'Fit': 'Regular',
      'Care': 'Machine wash cold',
      'Origin': 'India'
    },
    inStock: true,
    rating: 4.6,
    reviews: 112,
    tags: ['formal', 'professional', 'office'],
    discount: 15,
    stockQuantity: 40,
    sku: 'SH-FORMAL-005'
  },

  // Bottom Wear
  {
    name: 'Urban Cargo Pants',
    price: 2499,
    originalPrice: 2999,
    image: '/images/cargo-pants.png',
    images: ['/images/cargo-pants.png', '/images/bottom-wear.png', '/images/co-ord-sets.png'],
    category: 'Bottom Wear',
    subCategory: 'Cargo Pants',
    collection: 'Beaten Launch Sale Vol 1',
    gender: 'MEN',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Olive', 'Khaki'],
    fit: 'Regular',
    description: 'Comfortable urban cargo pants with multiple pockets. Perfect for street style.',
    features: [
      'Multiple pockets',
      'Comfortable fit',
      'Durable fabric',
      'Street style'
    ],
    specifications: {
      'Material': 'Cotton Blend',
      'Fit': 'Regular',
      'Care': 'Machine wash cold',
      'Origin': 'India'
    },
    inStock: true,
    rating: 4.5,
    reviews: 134,
    tags: ['cargo', 'urban', 'pockets'],
    discount: 17,
    isFeatured: true,
    stockQuantity: 25,
    sku: 'BW-CARGO-006'
  },
  {
    name: 'Slim Fit Jeans',
    price: 1899,
    originalPrice: 2299,
    image: '/images/bottom-wear.png',
    images: ['/images/bottom-wear.png', '/images/cargo-pants.png', '/images/co-ord-sets.png'],
    category: 'Bottom Wear',
    subCategory: 'Jeans',
    collection: 'Beaten Exclusive Collection',
    gender: 'MEN',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Blue', 'Black', 'Grey'],
    fit: 'Slim',
    description: 'Modern slim fit jeans with stretch comfort. Perfect for casual and semi-formal occasions.',
    features: [
      'Slim fit',
      'Stretch comfort',
      'Modern design',
      'Versatile'
    ],
    specifications: {
      'Material': 'Denim with Stretch',
      'Fit': 'Slim',
      'Care': 'Machine wash cold',
      'Origin': 'India'
    },
    inStock: true,
    rating: 4.3,
    reviews: 98,
    tags: ['jeans', 'slim', 'stretch'],
    discount: 17,
    stockQuantity: 45,
    sku: 'BW-JEANS-007'
  },

  // Hoodies
  {
    name: 'Signature Hoodie',
    price: 1899,
    originalPrice: 2299,
    image: '/images/hoodies.png',
    images: ['/images/hoodies.png', '/images/jackets.png', '/images/shirts.png'],
    category: 'Hoodies',
    subCategory: 'Regular',
    collection: 'Beaten Signature Collection',
    gender: 'MEN',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Grey', 'Navy'],
    fit: 'Regular',
    description: 'Signature collection hoodie with premium quality and comfort.',
    features: [
      'Premium fabric',
      'Comfortable fit',
      'Signature design',
      'Warm and cozy'
    ],
    specifications: {
      'Material': 'Cotton Blend',
      'Fit': 'Regular',
      'Care': 'Machine wash cold',
      'Origin': 'India'
    },
    inStock: true,
    rating: 4.7,
    reviews: 167,
    tags: ['hoodie', 'signature', 'premium'],
    discount: 17,
    isBestSeller: true,
    stockQuantity: 60,
    sku: 'HD-SIG-008'
  },
  {
    name: 'Oversized Zipper Hoodie',
    price: 2199,
    originalPrice: 2599,
    image: '/images/jackets.png',
    images: ['/images/jackets.png', '/images/hoodies.png', '/images/oversized-tshirts.png'],
    category: 'Hoodies',
    subCategory: 'Zipper',
    collection: 'Beaten Launch Sale Vol 1',
    gender: 'MEN',
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Grey'],
    fit: 'Oversized',
    description: 'Trendy oversized zipper hoodie perfect for street style.',
    features: [
      'Oversized fit',
      'Zipper design',
      'Street style',
      'Comfortable'
    ],
    specifications: {
      'Material': 'Cotton Blend',
      'Fit': 'Oversized',
      'Care': 'Machine wash cold',
      'Origin': 'India'
    },
    inStock: true,
    rating: 4.4,
    reviews: 76,
    tags: ['oversized', 'zipper', 'street'],
    discount: 15,
    isNewArrival: true,
    stockQuantity: 30,
    sku: 'HD-ZIP-009'
  },

  // Jackets
  {
    name: 'Casual Bomber Jacket',
    price: 3499,
    originalPrice: 3999,
    image: '/images/shirts.png',
    images: ['/images/shirts.png', '/images/hoodies.png', '/images/jackets.png'],
    category: 'Jackets',
    subCategory: 'Casual',
    collection: 'Beaten Exclusive Collection',
    gender: 'MEN',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Brown'],
    fit: 'Regular',
    description: 'Classic bomber jacket with modern styling. Perfect for casual and street wear.',
    features: [
      'Bomber style',
      'Comfortable fit',
      'Durable fabric',
      'Versatile design'
    ],
    specifications: {
      'Material': 'Polyester Blend',
      'Fit': 'Regular',
      'Care': 'Dry clean recommended',
      'Origin': 'India'
    },
    inStock: true,
    rating: 4.6,
    reviews: 89,
    tags: ['bomber', 'casual', 'jacket'],
    discount: 13,
    stockQuantity: 20,
    sku: 'JK-BOMBER-010'
  },

  // Co-ord Sets
  {
    name: 'Urban Co-Ord Set',
    price: 3999,
    originalPrice: 4499,
    image: '/images/co-ord-sets.png',
    images: ['/images/co-ord-sets.png', '/images/shirts.png', '/images/hoodies.png'],
    category: 'Co-ord Sets',
    subCategory: 'Casual',
    collection: 'Beaten Signature Collection',
    gender: 'MEN',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Navy'],
    fit: 'Regular',
    description: 'Complete co-ord set with matching top and bottom. Perfect for coordinated looks.',
    features: [
      'Matching set',
      'Coordinated look',
      'Comfortable fit',
      'Versatile pieces'
    ],
    specifications: {
      'Material': 'Cotton Blend',
      'Fit': 'Regular',
      'Care': 'Machine wash cold',
      'Origin': 'India'
    },
    inStock: true,
    rating: 4.8,
    reviews: 45,
    tags: ['co-ord', 'matching', 'set'],
    discount: 11,
    stockQuantity: 15,
    sku: 'CS-URBAN-011'
  }
];

const seedProducts = async () => {
  try {
    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert sample products
    const products = await Product.insertMany(sampleProducts);
    console.log(`Seeded ${products.length} products successfully`);

    return products;
  } catch (error) {
    console.error('Error seeding products:', error);
    throw error;
  }
};

// Export for use in other files
module.exports = { seedProducts, sampleProducts };

// Run seeding if this file is executed directly
if (require.main === module) {
  // Connect to database
  const connectDB = require('../config/db');
  
  connectDB()
    .then(() => {
      console.log('Connected to database');
      return seedProducts();
    })
    .then(() => {
      console.log('Database seeded successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error:', error);
      process.exit(1);
    });
} 