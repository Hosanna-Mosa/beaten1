import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  Divider,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  CircularProgress,
  IconButton,
  Chip,
  Alert,
} from "@mui/material";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import PaymentsIcon from "@mui/icons-material/Payments";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/format";
import { ordersAPI, validateCoupon, couponAPI } from "../api";

const Payment = ({ mode = "dark" }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, clearCart } = useCart();
  const location = useLocation();
  const selectedAddress = location.state?.selectedAddress;
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [showOffers, setShowOffers] = useState(false);

  useEffect(() => {
    couponAPI.getAvailableCoupons().then(res => {
      // Filter only public coupons
      const publicCoupons = (res.data?.data || []).filter(c => c.category === 'public' || c.isPersonal === false);
      setAvailableCoupons(publicCoupons);
    });
  }, []);

  // Calculate totals
  const subtotal = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
  const discount = user?.isPremium ? 250 : 0;
  const shipping = subtotal > 0 ? 100 : 0;
  const total = subtotal - discount - couponDiscount + shipping;

  const handleApplyCoupon = async () => {
    if (couponApplied) return;
    
    if (!coupon.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    setValidatingCoupon(true);
    setCouponError("");

    try {
      const response = await validateCoupon(coupon.trim(), subtotal);
      
      if (response.valid) {
        setCouponDiscount(response.coupon.discountAmount);
        setCouponApplied(true);
        setAppliedCoupon(response.coupon);
        setCouponError("");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Invalid coupon code";
      setCouponError(errorMessage);
      setCouponDiscount(0);
      setCouponApplied(false);
      setAppliedCoupon(null);
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCoupon("");
    setCouponApplied(false);
    setCouponDiscount(0);
    setCouponError("");
    setAppliedCoupon(null);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError("");
    try {
      // Calculate total with COD charge if applicable
      const finalTotal = paymentMethod === "cod" ? total + 50 : total;

      const orderResponse = await ordersAPI.createOrder({
        items: cart.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          price: item.product.price,
        })),
        shippingAddress: {
          address: String,
          city: String,
          postalCode: String,
          state: String,
          country: String,
        },
        paymentMethod,
        totalAmount: finalTotal, // Must be a number
        codCharge: paymentMethod === "cod" ? 50 : 0,
        appliedCoupon: appliedCoupon ? appliedCoupon.code : null,
      });

      // For Razorpay payments
      if (paymentMethod === "razorpay") {
        if (!orderResponse.data.razorpayOrderId) {
          throw new Error("Missing Razorpay order ID");
        }

        const options = {
          key: process.env.REACT_APP_RAZORPAY_KEY,
          amount: orderResponse.data.amount * 100,
          currency: "INR",
          name: "BEATEN",
          description: "Order Payment",
          order_id: orderResponse.data.razorpayOrderId,
          handler: async function (response) {
            try {
              // Use the verifyPayment method from ordersAPI
              await ordersAPI.verifyPayment({
                razorpayOrderId: orderResponse.data.razorpayOrderId,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              });

              setOrderPlaced(true);
              clearCart();
            } catch (err) {
              setError(
                "Payment verification failed: " +
                  (err.response?.data?.message || err.message)
              );
            } finally {
              setLoading(false);
            }
          },
          prefill: {
            name: user.name,
            email: user.email,
            contact: user.phone,
          },
          theme: { color: "#1976d2" },
          modal: {
            ondismiss: () => {
              setLoading(false);
              setError("Payment was cancelled");
            },
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } else {
        // For COD payments
        setOrderPlaced(true);
        clearCart();
        setLoading(false);
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Payment failed. Please try again."
      );
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h5" gutterBottom>
            Order Placed Successfully!
          </Typography>
          <Typography variant="body1" paragraph>
            Thank you for shopping with us.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/orders")}
          >
            View Orders
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="md"
      sx={{
        py: 4,
        bgcolor: mode === "dark" ? "#181818" : "#fff",
        color: mode === "dark" ? "#fff" : "#181818",
        minHeight: "100vh",
      }}
    >
      <Grid container spacing={4}>
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Payment Method
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Choose your preferred payment method
            </Typography>
            
            {/* Coupon Section */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Apply Coupon
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <TextField
                  label="Coupon Code"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  size="small"
                  disabled={couponApplied || validatingCoupon}
                  sx={{ mr: 2, flex: 1 }}
                  placeholder="Enter coupon code"
                />
                <Button
                  variant="outlined"
                  onClick={handleApplyCoupon}
                  disabled={couponApplied || validatingCoupon}
                  sx={{ mr: couponApplied ? 2 : 0 }}
                >
                  {validatingCoupon ? (
                    <CircularProgress size={20} />
                  ) : couponApplied ? (
                    "Applied"
                  ) : (
                    "Apply"
                  )}
                </Button>
                {couponApplied && (
                  <Button
                    variant="text"
                    color="error"
                    onClick={handleRemoveCoupon}
                  >
                    Remove
                  </Button>
                )}
              </Box>
              
              {couponError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {couponError}
                </Alert>
              )}
              
              {couponApplied && appliedCoupon && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Coupon applied successfully!
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <Chip 
                        label={appliedCoupon.isPersonal ? "Personal" : "Public"} 
                        color={appliedCoupon.isPersonal ? "primary" : "secondary"}
                        size="small"
                        sx={{ mr: 1 }}
                      />
                      <Typography variant="body2">
                        {appliedCoupon.discount}% off - ₹{appliedCoupon.discountAmount.toFixed(2)} saved
                      </Typography>
                    </Box>
                    {appliedCoupon.isPersonal && appliedCoupon.recipientName && (
                      <Typography variant="caption" color="text.secondary">
                        For: {appliedCoupon.recipientName}
                      </Typography>
                    )}
                  </Box>
                </Alert>
              )}
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <IconButton color="primary" sx={{ mr: 1 }} onClick={() => setShowOffers((prev) => !prev)}>
                <RemoveRedEyeIcon />
              </IconButton>
              <Button
                variant="text"
                color="primary"
                sx={{ textTransform: "none", fontWeight: 600 }}
                onClick={() => setShowOffers((prev) => !prev)}
              >
                View Available Offers
              </Button>
            </Box>
            {showOffers && availableCoupons.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  Public Coupons
                </Typography>
                {availableCoupons.map((coupon) => (
                  <Paper key={coupon.code} sx={{ p: 2, mb: 1, bgcolor: '#f5f5f5' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {coupon.code} - {coupon.discount}% off
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Min Purchase: ₹{coupon.minPurchase} | Valid: {new Date(coupon.validFrom).toLocaleDateString()} - {new Date(coupon.validUntil).toLocaleDateString()}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            )}
            <FormControl component="fieldset" fullWidth>
              <RadioGroup
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    mb: 2,
                    borderColor:
                      paymentMethod === "razorpay" ? "primary.main" : "divider",
                    backgroundColor:
                      paymentMethod === "razorpay"
                        ? "primary.50"
                        : "background.paper",
                    boxShadow: paymentMethod === "razorpay" ? 2 : 0,
                  }}
                >
                  <FormControlLabel
                    value="razorpay"
                    control={<Radio />}
                    label={
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold">
                          <CreditCardIcon
                            sx={{ mr: 1, verticalAlign: "middle" }}
                          />{" "}
                          Online Payment (Credit/Debit Card)
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Pay securely with Razorpay
                        </Typography>
                        <Box
                          sx={{ display: "flex", alignItems: "center", mt: 1 }}
                        >
                          <PaymentsIcon fontSize="small" sx={{ mr: 1 }} />
                          <Typography variant="caption" color="text.secondary">
                            Instant payment confirmation
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <PaymentsIcon fontSize="small" sx={{ mr: 1 }} />
                          <Typography variant="caption" color="text.secondary">
                            Secure SSL encryption
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <CreditCardIcon fontSize="small" sx={{ mr: 1 }} />
                          <Typography variant="caption" color="text.secondary">
                            Multiple card options accepted
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                </Paper>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    mb: 2,
                    borderColor:
                      paymentMethod === "cod" ? "primary.main" : "divider",
                    backgroundColor:
                      paymentMethod === "cod"
                        ? "primary.50"
                        : "background.paper",
                    boxShadow: paymentMethod === "cod" ? 2 : 0,
                  }}
                >
                  <FormControlLabel
                    value="cod"
                    control={<Radio />}
                    label={
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold">
                          <PaymentsIcon
                            sx={{ mr: 1, verticalAlign: "middle" }}
                          />{" "}
                          Cash on Delivery (COD)
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Pay when you receive your order
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                        >
                          • No upfront payment required
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                        >
                          • Pay with cash or card on delivery
                        </Typography>
                        <Typography
                          variant="caption"
                          color="warning.main"
                          display="block"
                        >
                          • Additional ₹50 COD charge applies
                        </Typography>
                      </Box>
                    }
                  />
                </Paper>
              </RadioGroup>
            </FormControl>
            {error && (
              <Typography color="error" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}
            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              sx={{
                mt: 3,
                py: 1.5,
                fontWeight: 700,
                fontSize: "1.1rem",
                borderRadius: 2,
                background: "#111",
                letterSpacing: 0.5,
              }}
              onClick={handlePlaceOrder}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : (
                `Place Order - ${formatPrice(
                  paymentMethod === "cod" ? total + 50 : total
                )}`
              )}
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {cart.map((item) => (
              <Box
                key={item.product._id}
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography>
                  {item.product.name} x{item.quantity}
                </Typography>
                <Typography>
                  {formatPrice(item.product.price * item.quantity)}
                </Typography>
              </Box>
            ))}
            <Divider sx={{ my: 2 }} />
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography>Subtotal</Typography>
              <Typography>{formatPrice(subtotal)}</Typography>
            </Box>
            {user?.isPremium && (
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography>Premium Discount</Typography>
                <Typography color="success.main">
                  -{formatPrice(discount)}
                </Typography>
              </Box>
            )}
            {couponDiscount > 0 && (
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography>Coupon Discount</Typography>
                <Typography color="success.main">
                  -{formatPrice(couponDiscount)}
                </Typography>
              </Box>
            )}
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography>Shipping</Typography>
              <Typography>{formatPrice(shipping)}</Typography>
            </Box>
            {paymentMethod === "cod" && (
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography>COD Charge</Typography>
                <Typography color="warning.main">+₹50</Typography>
              </Box>
            )}
            <Divider sx={{ my: 2 }} />
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <Typography variant="h6" fontWeight={700}>
                Total
              </Typography>
              <Typography variant="h6" color="primary" fontWeight={700}>
                {formatPrice(paymentMethod === "cod" ? total + 50 : total)}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Payment;
