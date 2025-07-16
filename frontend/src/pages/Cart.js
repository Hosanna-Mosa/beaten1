import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  IconButton,
  Divider,
  TextField,
  Card,
  CardContent,
  CardMedia,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  ShoppingBag as ShoppingBagIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { formatPrice } from "../utils/format";
import axios from "axios";
import { buildApiUrl } from "../utils/api";

const FALLBACK_IMAGE =
  'data:image/svg+xml;utf8,<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg"><rect fill="%23f5f5f5" width="200" height="200"/><text x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-size="20">Image</text></svg>';

const getImageUrl = (imagePath) => {
  if (!imagePath) return FALLBACK_IMAGE;
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  if (imagePath.startsWith("blob:")) {
    return imagePath;
  }
  if (imagePath.startsWith("photo-")) {
    return `https://images.unsplash.com/${imagePath}`;
  }
  // If the image path starts with a slash, treat it as a public asset
  if (imagePath.startsWith("/")) {
    return imagePath;
  }
  // Otherwise, treat as uploaded file
  return `${buildApiUrl("")}/uploads/${imagePath}`;
};

const Cart = ({ mode }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { user } = useAuth();
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [wishlistDialog, setWishlistDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const matteColors = {
    900: "#1a1a1a",
    800: "#2d2d2d",
    700: "#404040",
    600: "#525252",
    100: "#f5f5f5",
    50: "#fafafa",
    accent: "#FFD700",
    danger: "#ff1744",
  };

  // Calculate totals
  const subtotal = cart.reduce((total, item) => {
    if (!item.product || typeof item.product.price !== "number") return total;
    return total + item.product.price * item.quantity;
  }, 0);
  const discount = (user?.isPremium && new Date(user.premiumExpiry) > new Date()) ? 250 : 0;
  const shipping = subtotal > 0 ? 100 : 0;
  const total = subtotal - discount + shipping;

  // Handlers
  const handleQuantityChange = async (item, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await updateQuantity(
        item.product._id,
        item.size,
        item.color,
        newQuantity
      );
    } catch (err) {
      setError("Failed to update quantity");
    }
  };

  const handleRemoveItem = async (item) => {
    try {
      await removeFromCart(item.product._id, item.size, item.color);
    } catch (err) {
      setError("Failed to remove item");
    }
  };

  const handleWishlistToggle = (item) => {
    setSelectedItem(item);
    setWishlistDialog(true);
  };

  const handleWishlistConfirm = async () => {
    try {
      const productToAdd = {
        _id: selectedItem.product._id,
        name: selectedItem.product.name,
        price: selectedItem.product.price,
        image: selectedItem.product.image,
        description: selectedItem.product.description,
        category: selectedItem.product.category,
        subCategory: selectedItem.product.subCategory,
        collection: selectedItem.product.collectionName,
        colors: selectedItem.product.colors,
        gender: selectedItem.product.gender,
      };

      addToWishlist(productToAdd);
      await removeFromCart(
        selectedItem.product._id,
        selectedItem.size,
        selectedItem.color
      );
      setWishlistDialog(false);
    } catch (err) {
      setError("Failed to move item to wishlist");
    }
  };

  const handleCheckout = () => {
    if (!user) {
      navigate("/login", { state: { from: "/cart" } });
      return;
    }
    navigate("/checkout");
  };

  if (cart.length === 0) {
    return (
      <Container
        maxWidth="md"
        sx={{
          py: { xs: 6, md: 10 },
          minHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <ShoppingBagIcon sx={{ fontSize: 80, color: "#e0e0e0", mb: 2 }} />
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Your cart is empty
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Looks like you haven't added any items yet.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/products")}
            sx={{
              background: matteColors[900],
              color: "#fff",
              borderRadius: 8,
              px: 4,
              py: 1.5,
              fontWeight: 600,
              fontSize: "1.1rem",
              boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
              '&:hover': { background: matteColors[800] },
            }}
          >
            Continue Shopping
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 6 }, minHeight: "80vh" }}>
      <Grid container spacing={4} alignItems="flex-start">
        {/* Cart Items */}
        <Grid item xs={12} md={7}>
          <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
            Shopping Cart
          </Typography>
          <Box>
            {cart.map((item, idx) =>
              !item.product || typeof item.product.price !== "number" ? null : (
                
                <Card
                  key={item.product._id + item.size + item.color}
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: { xs: "flex-start", sm: "center" },
                    mb: 3,
                    p: 2,
                    borderRadius: 4,
                    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                    background: matteColors[50],
                    transition: "box-shadow 0.2s",
                    '&:hover': { boxShadow: "0 6px 24px rgba(0,0,0,0.10)" },
                  }}
                >
                  {/* Product Image */}
                  <Box
                    component="img"
                    src={getImageUrl(item.product.image)}
                    alt={item.product.name}
                    sx={{
                      width: { xs: 90, sm: 110 },
                      height: { xs: 90, sm: 110 },
                      objectFit: "cover",
                      borderRadius: 3,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                      mr: { sm: 3 },
                      mb: { xs: 2, sm: 0 },
                      background: "#f5f5f5",
                      border: "1px solid #eee",
                    }}
                  />
                  {/* Product Details & Actions */}
                  <Box sx={{ flex: 1, width: "100%" }}>
                    <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: { sm: "center" }, justifyContent: "space-between" }}>
                      <Box>
                        <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
                          {item.product.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          {item.product.category} {item.size && `| Size: ${item.size}`} {item.color && `| Color: ${item.color}`}
                        </Typography>
                        <Typography variant="body2" fontWeight={600} color="primary.main" sx={{ mb: 1 }}>
                          {formatPrice(item.product.price)} x {item.quantity}
                        </Typography>
                      </Box>
                      {/* Actions */}
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: { xs: 2, sm: 0 } }}>
                        <Tooltip title="Decrease quantity">
                          <span>
                            <IconButton
                              size="small"
                              onClick={() => handleQuantityChange(item, item.quantity - 1)}
                              sx={{
                                border: "1px solid #ddd",
                                borderRadius: 2,
                                background: "white",
                                color: matteColors[900],
                                '&:hover': { background: matteColors[100] },
                                p: 0.5,
                              }}
                              disabled={item.quantity <= 1}
                            >
                              <RemoveIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                        <TextField
                          value={item.quantity}
                          variant="standard"
                          inputProps={{
                            readOnly: true,
                            style: {
                              textAlign: "center",
                              width: 32,
                              fontWeight: 600,
                            },
                          }}
                          sx={{ mx: 1, width: 40 }}
                        />
                        <Tooltip title="Increase quantity">
                          <IconButton
                            size="small"
                            onClick={() => handleQuantityChange(item, item.quantity + 1)}
                            sx={{
                              border: "1px solid #ddd",
                              borderRadius: 2,
                              background: "white",
                              color: matteColors[900],
                              '&:hover': { background: matteColors[100] },
                              p: 0.5,
                            }}
                          >
                            <AddIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Remove from cart">
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveItem(item)}
                            sx={{
                              border: `1px solid ${matteColors.danger}`,
                              borderRadius: 2,
                              background: "white",
                              color: matteColors.danger,
                              ml: 1,
                              '&:hover': { background: matteColors[100] },
                              p: 0.5,
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={isInWishlist(item.product._id) ? "Remove from wishlist" : "Move to wishlist"}>
                          <IconButton
                            size="small"
                            onClick={() => handleWishlistToggle(item)}
                            sx={{
                              border: `1px solid ${matteColors.accent}`,
                              borderRadius: 2,
                              background: "white",
                              color: matteColors.accent,
                              ml: 1,
                              '&:hover': { background: matteColors[100] },
                              p: 0.5,
                            }}
                          >
                            {isInWishlist(item.product._id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </Box>
                </Card>
              )
            )}
          </Box>
        </Grid>
        {/* Order Summary */}
        <Grid item xs={12} md={5}>
          <Paper
            elevation={4}
            sx={{
              p: { xs: 2, md: 4 },
              borderRadius: 4,
              boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
              background: matteColors[50],
              minWidth: 280,
              position: { md: "sticky" },
              top: { md: 32 },
            }}
          >
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
              Order Summary
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography>Subtotal</Typography>
              <Typography>{formatPrice(subtotal)}</Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography>Shipping</Typography>
              <Typography>{shipping === 0 ? "Free" : formatPrice(shipping)}</Typography>
            </Box>
            {discount > 0 && (
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography color="success.main">Premium Discount</Typography>
                <Typography color="success.main">- {formatPrice(discount)}</Typography>
              </Box>
            )}
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="h6" fontWeight={700}>
                Total
              </Typography>
              <Typography variant="h6" fontWeight={700}>
                {formatPrice(total)}
              </Typography>
            </Box>
            <Button
              variant="contained"
              size={isMobile ? "large" : "medium"}
              fullWidth
              onClick={handleCheckout}
              sx={{
                background: matteColors[900],
                color: "#fff",
                borderRadius: 8,
                fontWeight: 700,
                fontSize: "1.08rem",
                py: 1.2,
                mb: 2,
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                '&:hover': { background: matteColors[800] },
              }}
            >
              Proceed to Checkout
            </Button>
            <Button
              variant="outlined"
              fullWidth
              onClick={clearCart}
              sx={{
                borderColor: matteColors[900],
                color: matteColors[900],
                borderRadius: 8,
                fontWeight: 700,
                fontSize: "1.08rem",
                py: 1.2,
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                '&:hover': { background: matteColors[100] },
              }}
            >
              Clear Cart
            </Button>
          </Paper>
        </Grid>
      </Grid>
      {/* Wishlist Dialog and Error Alert (unchanged) */}
      <Dialog open={wishlistDialog} onClose={() => setWishlistDialog(false)}>
        <DialogTitle>Move to Wishlist</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to move this item to your wishlist?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setWishlistDialog(false)} sx={{ borderRadius: 8 }}>
            Cancel
          </Button>
          <Button onClick={handleWishlistConfirm} color="primary" sx={{ borderRadius: 8, fontWeight: 600 }}>
            Move to Wishlist
          </Button>
        </DialogActions>
      </Dialog>
      {error && (
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
      )}
    </Container>
  );
};

export default Cart;
