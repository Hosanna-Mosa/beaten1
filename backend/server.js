const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
// ✅ Removed: const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const productsRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const ordersRoutes = require('./routes/orders');
const uploadRoutes = require('./routes/upload');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

// ✅ Removed: Rate limiting
// const limiter = rateLimit({ ... });
// app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use(morgan('dev'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'BEATEN API is running',
    timestamp: new Date().toISOString(),
    environment: 'development'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/upload', uploadRoutes);

// Serve uploads directory as static
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

// MongoDB connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    
    app.listen(PORT, () => {
      console.log(`🚀 BEATEN API Server running on port ${PORT}`);
      console.log(`📊 Environment: development`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
      console.log(`📚 API Documentation: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('Server startup error:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log(`Error: ${err.message}`);
  console.log('Shutting down the server due to uncaught exception');
  process.exit(1);
});

startServer();

module.exports = app;
 