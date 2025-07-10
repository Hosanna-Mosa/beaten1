import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Card,
  CardContent,
  LinearProgress,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  People as PeopleIcon,
  ShoppingCart as OrdersIcon,
  Inventory as ProductsIcon,
  AttachMoney as RevenueIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Circle as CircleIcon
} from '@mui/icons-material';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { dashboardAPI } from '../api/axiosAdmin';

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all dashboard data in parallel
        const [
          statsResponse,
          salesResponse,
          categoryResponse,
          activitiesResponse,
          productsResponse
        ] = await Promise.all([
          dashboardAPI.getStats(),
          dashboardAPI.getSalesTrend(),
          dashboardAPI.getCategoryDistribution(),
          dashboardAPI.getRecentActivities(),
          dashboardAPI.getTopProducts()
        ]);

        setStats(statsResponse.data);
        setSalesData(salesResponse.data);
        setCategoryData(categoryResponse.data);
        setRecentActivities(activitiesResponse.data);
        setTopProducts(productsResponse.data);
        
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const StatCard = ({ title, value, icon, color, growth }) => (
    <Paper
      sx={{
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        height: 140,
        bgcolor: color,
        color: 'white'
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" component="div">
          {title}
        </Typography>
        {icon}
      </Box>
      <Typography variant="h4" component="div" sx={{ mt: 2 }}>
        {value}
      </Typography>
      {growth !== undefined && (
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          {growth > 0 ? (
            <TrendingUpIcon sx={{ fontSize: 16, mr: 0.5 }} />
          ) : (
            <TrendingDownIcon sx={{ fontSize: 16, mr: 0.5 }} />
          )}
          <Typography variant="body2">
            {Math.abs(growth).toFixed(1)}% from last month
          </Typography>
        </Box>
      )}
    </Paper>
  );

  const ActivityItem = ({ activity }) => (
    <ListItem>
      <ListItemIcon>
        <CircleIcon sx={{ 
          fontSize: 8,
          color: activity.type === 'order' ? '#2e7d32' :
                 activity.type === 'customer' ? '#1976d2' :
                 activity.type === 'product' ? '#ed6c02' : '#9c27b0'
        }} />
      </ListItemIcon>
      <ListItemText
        primary={activity.message}
        secondary={activity.time}
      />
      {activity.amount && (
        <Typography variant="body2" color="text.secondary">
          ₹{activity.amount.toFixed(2)}
        </Typography>
      )}
    </ListItem>
  );

  const ProductProgress = ({ product }) => (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body2">{product.name}</Typography>
        <Typography variant="body2" color="text.secondary">
          {product.sales}/{product.target} units
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={(product.sales / product.target) * 100}
        sx={{ height: 8, borderRadius: 4 }}
      />
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        ₹{product.revenue.toFixed(2)} revenue
      </Typography>
    </Box>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Typography variant="h6" color="text.secondary">
          Please check your connection and try again
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Customers"
            value={stats?.totalCustomers || 0}
            icon={<PeopleIcon />}
            color="#1976d2"
            growth={stats?.growth?.customers}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Orders"
            value={stats?.totalOrders || 0}
            icon={<OrdersIcon />}
            color="#2e7d32"
            growth={stats?.growth?.orders}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Products"
            value={stats?.totalProducts || 0}
            icon={<ProductsIcon />}
            color="#ed6c02"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Revenue"
            value={`₹${(stats?.totalRevenue || 0).toFixed(2)}`}
            icon={<RevenueIcon />}
            color="#9c27b0"
            growth={stats?.growth?.revenue}
          />
        </Grid>

        {/* Sales Trend Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Sales Trend
            </Typography>
            {salesData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={salesData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stackId="1"
                  stroke="#8884d8"
                  fill="#8884d8"
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stackId="2"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                />
              </AreaChart>
            </ResponsiveContainer>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Typography color="text.secondary">No sales data available</Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Category Distribution */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Category Distribution
            </Typography>
            {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Typography color="text.secondary">No category data available</Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Revenue Distribution */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: 300 }}>
            <Typography variant="h6" gutterBottom>
              Revenue Distribution
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { name: 'Online', value: 65 },
                  { name: 'Store', value: 35 }
                ]}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: 300, overflow: 'auto' }}>
            <Typography variant="h6" gutterBottom>
              Recent Activities
            </Typography>
            {recentActivities.length > 0 ? (
            <List>
              {recentActivities.map((activity, index) => (
                <React.Fragment key={activity.id}>
                  <ActivityItem activity={activity} />
                  {index < recentActivities.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Typography color="text.secondary">No recent activities</Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Top Products */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Top Products
            </Typography>
            {topProducts.length > 0 ? (
              topProducts.map((product) => (
              <ProductProgress key={product.id} product={product} />
              ))
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
                <Typography color="text.secondary">No top products data available</Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard; 