import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import Layout from './components/layout/Layout';
import BottomNav from './components/layout/BottomNav';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import NewsScroller from './components/common/NewsScroller';
import { Box } from '@mui/material';
import ScrollToTop from './components/ScrollToTop';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Help from './pages/Help';
import Shipping from './pages/Shipping';
import Returns from './pages/Returns';
import SizeGuide from './pages/SizeGuide';
import Payment from './pages/Payment';

// Import Roboto font from Google Fonts
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import ChangePassword from './pages/ChangePassword';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
import Premium from './pages/Premium';
import NotFound from './pages/NotFound';
import Collections from './pages/Collections';
import About from './pages/About';
import Contact from './pages/Contact';
import Notifies from './pages/Notifies';
import Wishlist from './pages/Wishlist';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#000000'
    },
    secondary: {
      main: '#ffffff'
    }
  },
  typography: {
    fontFamily: [
      'Roboto',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
      lineHeight: 1.2
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
      lineHeight: 1.2
    },
    h3: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
      lineHeight: 1.3
    },
    h4: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
      lineHeight: 1.3
    },
    h5: {
      fontWeight: 500,
      letterSpacing: '-0.01em',
      lineHeight: 1.4
    },
    h6: {
      fontWeight: 500,
      letterSpacing: '-0.01em',
      lineHeight: 1.4
    },
    body1: {
      fontWeight: 400,
      letterSpacing: '0.01em',
      lineHeight: 1.5
    },
    body2: {
      fontWeight: 400,
      letterSpacing: '0.01em',
      lineHeight: 1.5
    },
    button: {
      fontWeight: 500,
      letterSpacing: '0.05em',
      textTransform: 'none',
      lineHeight: 1.75
    },
    subtitle1: {
      fontWeight: 400,
      letterSpacing: '0.01em',
      lineHeight: 1.5
    },
    subtitle2: {
      fontWeight: 500,
      letterSpacing: '0.01em',
      lineHeight: 1.5
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          letterSpacing: '0.05em',
          textTransform: 'none',
          borderRadius: 8
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12
        }
      }
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: [
            'Roboto',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Arial',
            'sans-serif',
          ].join(',')
        }
      }
    }
  }
});

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <ErrorBoundary>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <NewsScroller />
                <Header />
                
                <Box sx={{ 
                  pb: { xs: 10, md: 0 },
                  pt: { xs: 0, md: 0 }
                }}>
                  <Routes>
                    <Route path="/" element={<Layout />}>
                      {/* Public Routes */}
                      <Route index element={<Home />} />
                      <Route path="products" element={<Products />} />
                      <Route path="products/:productId" element={<ProductDetail />} />
                      <Route path="collections" element={<Collections />} />
                      <Route path="collections/:id" element={<Collections />} />
                      <Route path="cart" element={<Cart />} />
                      <Route path="login" element={<Login />} />
                      <Route path="register" element={<Register />} />
                      <Route path="forgot-password" element={<ForgotPassword />} />
                      <Route path="reset-password/:token" element={<ResetPassword />} />
                      <Route path="premium" element={<Premium />} />
                      <Route path="about" element={<About />} />
                      <Route path="contact" element={<Contact />} />
                      <Route path="alerts" element={<Notifies />} />
                      <Route path="wishlist" element={<Wishlist />} />
                      <Route path="privacy" element={<Privacy />} />
                      <Route path="terms" element={<Terms />} />
                      <Route path="help" element={<Help />} />
                      <Route path="shipping" element={<Shipping />} />
                      <Route path="returns" element={<Returns />} />
                      <Route path="size-guide" element={<SizeGuide />} />
                      <Route path="payment" element={<Payment />} />

                      {/* Previously Protected Routes - Now Public */}
                      <Route path="checkout" element={<Checkout />} />
                      <Route path="profile" element={<Profile />} />
                      <Route path="change-password" element={<ChangePassword />} />
                      <Route path="orders" element={<Orders />} />
                      <Route path="orders/:orderId" element={<OrderDetails />} />

                      {/* 404 Route */}
                      <Route path="*" element={<NotFound />} />
                    </Route>
                  </Routes>
                </Box>
                <BottomNav />
                <Footer />
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </Router>
  );
};

export default App; 