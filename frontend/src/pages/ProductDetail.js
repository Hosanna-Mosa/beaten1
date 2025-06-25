import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, Grid, IconButton, TextField, Avatar, Rating, Divider, Paper, Breadcrumbs, Link, useTheme, useMediaQuery, Chip, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Add as AddIcon, Remove as RemoveIcon, Star as StarIcon, NavigateNext as NavigateNextIcon, FavoriteBorder as FavoriteBorderIcon, LocalShippingOutlined as ShippingIcon, CheckCircleOutline as CheckIcon, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { useWishlist } from '../context/WishlistContext';

const matteColors = {
  900: '#1a1a1a',
  800: '#2d2d2d',
  700: '#404040',
  600: '#525252',
  100: '#f5f5f5'
};

const ProductDetail = () => {
  const { productId } = useParams();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Sample data for now
  const product = {
    _id: productId,
    name: 'Sample Product Name',
    description: 'This is a sample product description. It should provide extensive details about the product, covering its features, materials, and any other relevant information a customer might want to know before making a purchase. It is designed to give a comprehensive overview. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    price: 4999,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1364&q=80',
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1399&q=80',
    ],
    category: 'Sample Category',
    collection: 'Sample Collection',
    inStock: true,
    material: 'Cotton Blend',
    brand: 'BEATEN',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'White', 'Gray', 'Navy']
  };

  const [mainImage, setMainImage] = useState(product?.image);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(product.sizes ? product.sizes[0] : null);
  const [selectedColor, setSelectedColor] = useState(product.colors ? product.colors[0] : null);
  const [pincode, setPincode] = useState('');
  const [deliveryInfo, setDeliveryInfo] = useState(null);

  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const isWishlisted = isInWishlist(productId);

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      removeFromWishlist(productId);
    } else {
      addToWishlist({ ...product, _id: productId });
    }
  };

  const handlePincodeCheck = () => {
    // Dummy delivery info
    if (pincode.length === 6) {
      setDeliveryInfo({
        date: 'Thursday, 24 Jul',
        cod: 'Available'
      });
    } else {
      setDeliveryInfo(null);
    }
  };

  // Move reviews to state for dynamic updates
  const [reviews, setReviews] = useState([
    {
      id: 1,
      user: {
        name: 'John Doe',
        avatar: 'https://i.pravatar.cc/150?img=1'
      },
      rating: 5,
      date: '2024-03-15',
      comment: 'Excellent quality and perfect fit. The material is premium and the stitching is impeccable. Highly recommended!'
    },
    {
      id: 2,
      user: {
        name: 'Jane Smith',
        avatar: 'https://i.pravatar.cc/150?img=2'
      },
      rating: 4,
      date: '2024-03-10',
      comment: 'Great product, very comfortable. The only reason for 4 stars is that the color is slightly different from the picture.'
    },
    {
      id: 3,
      user: {
        name: 'Mike Johnson',
        avatar: 'https://i.pravatar.cc/150?img=3'
      },
      rating: 5,
      date: '2024-03-05',
      comment: 'Absolutely love this product! The quality is outstanding and it exceeded my expectations.'
    }
  ]);

  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!userRating || !userReview.trim()) return;
    // Add new review to the top
    setReviews([
      {
        id: Date.now(),
        user: {
          name: 'You', // Replace with real user name if available
          avatar: 'https://i.pravatar.cc/150?img=4' // Replace with real user avatar if available
        },
        rating: userRating,
        date: new Date().toISOString(),
        comment: userReview.trim()
      },
      ...reviews
    ]);
    setUserRating(0);
    setUserReview('');
    setReviewSuccess(true);
    setTimeout(() => setReviewSuccess(false), 2000);
  };

  // Calculate average rating
  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

  if (!product) {
    return (
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <Container maxWidth="lg">
          <Typography variant="h5">Product not found</Typography>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ py: { xs: 2, md: 4 }, bgcolor: 'white' }}>
      <Container maxWidth="xl">
        <Grid container spacing={{ xs: 2, md: 6 }}>
          {/* Image Gallery (Left) */}
          <Grid item xs={12} md={7}>
            <Box sx={{ position: 'sticky', top: 100 }}>
              <Box
                sx={{
                  mb: 2,
                  border: '1px solid #eee',
                  borderRadius: 2,
                  overflow: 'hidden',
                }}
              >
                <Box
                  component="img"
                  src={mainImage}
                  alt={product.name}
                  sx={{
                    width: '100%',
                    height: 'auto',
                    aspectRatio: { xs: '1/1', md: '0.8/1' },
                    objectFit: 'cover',
                    display: 'block',
                    transition: 'transform 0.5s ease',
                    '&:hover': {
                      transform: 'scale(1.1)',
                    },
                  }}
                />
              </Box>
              <Grid container spacing={1}>
                {product.images.map((img, index) => (
                  <Grid item xs={3} key={index}>
                    <Box
                      onClick={() => setMainImage(img)}
                      sx={{
                        cursor: 'pointer',
                        border: mainImage === img ? `2px solid ${matteColors[900]}` : '2px solid transparent',
                        borderRadius: 2,
                        overflow: 'hidden',
                        transition: 'border-color 0.3s ease',
                      }}
                    >
                      <Box
                        component="img"
                        src={img}
                        alt={`${product.name} thumbnail ${index + 1}`}
                        sx={{
                          width: '100%',
                          height: 'auto',
                          aspectRatio: '1/1',
                          objectFit: 'cover',
                          display: 'block',
                        }}
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>

          {/* Product Info (Right) */}
          <Grid item xs={12} md={5}>
            <Box sx={{ position: 'sticky', top: 100 }}>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 600, mb: 1.5, letterSpacing: '-0.02em' }}>
                {product.name}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Rating value={averageRating} precision={0.5} readOnly />
                <Typography sx={{ ml: 1, color: 'text.secondary' }}>({reviews.length} reviews)</Typography>
              </Box>

              <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, color: matteColors[800] }}>
                ₹{product.price.toLocaleString()}
              </Typography>

              {/* Color Selector */}
              <Box sx={{ mb: 3 }}>
                <Typography sx={{ fontWeight: 500, mb: 1 }}>Color: {selectedColor}</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {product.colors.map(color => (
                    <Chip
                      key={color}
                      label={color}
                      onClick={() => setSelectedColor(color)}
                      variant={selectedColor === color ? 'filled' : 'outlined'}
                      sx={{
                        cursor: 'pointer',
                        borderColor: selectedColor === color ? matteColors[900] : '#ccc',
                        backgroundColor: selectedColor === color ? matteColors[900] : 'transparent',
                        color: selectedColor === color ? 'white' : 'text.primary',
                        '&:hover': {
                          backgroundColor: selectedColor === color ? matteColors[800] : '#f5f5f5'
                        }
                      }}
                    />
                  ))}
                </Box>
              </Box>

              {/* Size Selector */}
              <Box sx={{ mb: 3 }}>
                <Typography sx={{ fontWeight: 500, mb: 1 }}>Size</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {product.sizes.map(size => (
                    <Chip
                      key={size}
                      label={size}
                      onClick={() => setSelectedSize(size)}
                      variant={selectedSize === size ? 'filled' : 'outlined'}
                      sx={{
                        cursor: 'pointer',
                        minWidth: '48px',
                        borderColor: selectedSize === size ? matteColors[900] : '#ccc',
                        backgroundColor: selectedSize === size ? matteColors[900] : 'transparent',
                        color: selectedSize === size ? 'white' : 'text.primary',
                        '&:hover': {
                          backgroundColor: selectedSize === size ? matteColors[800] : '#f5f5f5'
                        }
                      }}
                    />
                  ))}
                </Box>
              </Box>

              {/* Quantity & Add to Cart */}
              <Grid container spacing={2} sx={{ mb: 3 }} alignItems="center">
                <Grid item xs={5} sm={4}>
                  <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: 2, justifyContent: 'space-between' }}>
                    <IconButton onClick={() => setQuantity(q => Math.max(1, q - 1))} size="small">
                      <RemoveIcon />
                    </IconButton>
                    <Typography sx={{ fontWeight: 600 }}>{quantity}</Typography>
                    <IconButton onClick={() => setQuantity(q => q + 1)} size="small">
                      <AddIcon />
                    </IconButton>
                  </Box>
                </Grid>
                <Grid item xs={7} sm={8}>
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={() => addToCart({ ...product, _id: productId, quantity })}
                    sx={{
                      py: 1.5,
                      backgroundColor: matteColors[900],
                      color: 'white',
                      borderRadius: 2,
                      '&:hover': { backgroundColor: matteColors[700] }
                    }}
                  >
                    Add to Cart
                  </Button>
                </Grid>
              </Grid>

              {/* Wishlist Button */}
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FavoriteBorderIcon />}
                onClick={handleWishlistToggle}
                sx={{
                  py: 1.5,
                  borderColor: '#ccc',
                  color: 'text.primary',
                  borderRadius: 2,
                  mb: 3
                }}
              >
                {isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </Button>

              {/* Delivery Pincode Check */}
              <Box sx={{ border: '1px solid #eee', borderRadius: 2, p: 2 }}>
                <Typography sx={{ fontWeight: 600, mb: 1 }}>Delivery Options</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    variant="outlined"
                    size="small"
                    placeholder="Enter Pincode"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                  />
                  <Button variant="text" onClick={handlePincodeCheck}>Check</Button>
                </Box>
                {deliveryInfo && (
                  <Box sx={{ mt: 1.5, display: 'flex', alignItems: 'center', color: 'green' }}>
                    <CheckIcon sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      Delivery by {deliveryInfo.date}. COD {deliveryInfo.cod}.
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Product Details Accordion */}
              <Box sx={{ mt: 3 }}>
                <Accordion defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography sx={{ fontWeight: 600 }}>Product Description</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2">{product.description}</Typography>
                  </AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography sx={{ fontWeight: 600 }}>Material & Care</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2">{product.material}</Typography>
                  </AccordionDetails>
                </Accordion>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ProductDetail; 