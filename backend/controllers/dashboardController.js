const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    // Get total counts
    const totalCustomers = await User.countDocuments({ role: 'user' });
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();

    // Calculate total revenue
    const revenueResult = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' }
        }
      }
    ]);
    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    // Calculate growth (simplified - you can make this more sophisticated)
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    
    const lastMonthOrders = await Order.countDocuments({
      createdAt: { $gte: lastMonth }
    });
    
    const growth = {
      customers: 12.5, // Static for now
      orders: lastMonthOrders > 0 ? ((totalOrders - lastMonthOrders) / lastMonthOrders) * 100 : 0,
      revenue: 15.7 // Static for now
    };

    res.json({
      totalCustomers,
      totalOrders,
      totalProducts,
      totalRevenue,
      growth
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Failed to fetch dashboard statistics' 
    });
  }
};

// @desc    Get sales trend data
// @route   GET /api/dashboard/sales-trend
// @access  Private/Admin
const getSalesTrend = async (req, res) => {
  try {
    // Get last 7 months of data
    const months = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      months.push({
        name: date.toLocaleString('default', { month: 'short' }),
        month: date.getMonth(),
        year: date.getFullYear()
      });
    }

    const salesData = await Promise.all(
      months.map(async (month) => {
        const startDate = new Date(month.year, month.month, 1);
        const endDate = new Date(month.year, month.month + 1, 0);

        const orders = await Order.find({
          createdAt: { $gte: startDate, $lte: endDate }
        });

        const sales = orders.length;
        const revenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

        return {
          name: month.name,
          sales,
          revenue
        };
      })
    );

    res.json(salesData);
  } catch (error) {
    console.error('Error fetching sales trend:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Failed to fetch sales trend data' 
    });
  }
};

// @desc    Get category distribution
// @route   GET /api/dashboard/category-distribution
// @access  Private/Admin
const getCategoryDistribution = async (req, res) => {
  try {
    const categoryData = await Product.aggregate([
      {
        $match: {
          category: { $ne: null, $ne: "" } // Filter out null/empty categories
        }
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          name: '$_id',
          value: '$count'
        }
      },
      {
        $sort: { value: -1 } // Sort by count descending
      }
    ]);

    // If no categories found, return empty array
    if (categoryData.length === 0) {
      return res.json([]);
    }

    res.json(categoryData);
  } catch (error) {
    console.error('Error fetching category distribution:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Failed to fetch category distribution' 
    });
  }
};

// @desc    Get recent activities
// @route   GET /api/dashboard/recent-activities
// @access  Private/Admin
const getRecentActivities = async (req, res) => {
  try {
    const recentOrders = await Order.find({})
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    const activities = recentOrders.map((order, index) => ({
      id: index + 1,
      type: 'order',
      message: `Order #${order.orderNumber} from ${order.user?.name || 'Guest'}`,
      time: getTimeAgo(order.createdAt),
      amount: order.totalAmount
    }));

    res.json(activities);
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Failed to fetch recent activities' 
    });
  }
};

// @desc    Get top products
// @route   GET /api/dashboard/top-products
// @access  Private/Admin
const getTopProducts = async (req, res) => {
  try {
    // Get products with highest stock (as a proxy for popularity)
    const topProducts = await Product.find({})
      .sort({ stock: -1 })
      .limit(5)
      .select('name stock price');

    const products = topProducts.map((product, index) => ({
      id: index + 1,
      name: product.name,
      sales: Math.floor(Math.random() * 50) + 10, // Mock sales data
      revenue: Math.floor(Math.random() * 5000) + 1000, // Mock revenue
      target: product.stock + 10
    }));

    res.json(products);
  } catch (error) {
    console.error('Error fetching top products:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Failed to fetch top products' 
    });
  }
};

// Helper function to get time ago
const getTimeAgo = (date) => {
  const now = new Date();
  const diffInMinutes = Math.floor((now - date) / (1000 * 60));
  
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minutes ago`;
  } else if (diffInMinutes < 1440) {
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(diffInMinutes / 1440);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
};

module.exports = {
  getDashboardStats,
  getSalesTrend,
  getCategoryDistribution,
  getRecentActivities,
  getTopProducts
}; 