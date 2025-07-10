const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testAPIEndpoints() {
  console.log('Testing API endpoints...\n');

  const endpoints = [
    '/products/best-sellers',
    '/products/t-shirts',
    '/products/shirts',
    '/products/oversized-t-shirts',
    '/products/bottom-wear',
    '/products/cargo-pants',
    '/products/jackets',
    '/products/hoodies',
    '/products/co-ord-sets'
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await axios.get(`${BASE_URL}${endpoint}`);
      console.log(`✅ ${endpoint}: ${response.data.length} products`);
    } catch (error) {
      console.log(`❌ ${endpoint}: ${error.response?.status || error.message}`);
    }
  }
}

testAPIEndpoints(); 