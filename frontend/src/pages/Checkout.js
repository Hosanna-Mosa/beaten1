import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Stepper,
  Step,
  StepLabel,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Divider,
  Alert,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/format';
import axios from 'axios';

const steps = ['Shipping', 'Payment', 'Review'];

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, clearCart } = useCart();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [newAddress, setNewAddress] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false
  });
  const [addressDialog, setAddressDialog] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Calculate totals
  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const discount = user?.isPremium ? 250 : 0;
  const shipping = subtotal > 0 ? 100 : 0;
  const total = subtotal - discount + shipping;

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await axios.get('/api/user/addresses');
      setAddresses(response.data);
      const defaultAddress = response.data.find(addr => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddress(defaultAddress._id);
      }
    } catch (err) {
      setError('Failed to load addresses');
    }
  };

  const handleAddressSubmit = async () => {
    try {
      await axios.post('/api/user/addresses', newAddress);
      setAddressDialog(false);
      fetchAddresses();
      setNewAddress({
        name: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        pincode: '',
        isDefault: false
      });
    } catch (err) {
      setError('Failed to add address');
    }
  };

  const handleNext = () => {
    if (activeStep === 0 && !selectedAddress) {
      setError('Please select a shipping address');
      return;
    }
    setActiveStep((prevStep) => prevStep + 1);
    setError(null);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    setError(null);
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      setError('Please select a shipping address');
      return;
    }

    setLoading(true);
    try {
      // Create order
      const orderResponse = await axios.post('/api/orders', {
        items: cart.map(item => ({
          product: item._id,
          quantity: item.quantity,
          size: item.size,
          price: item.price
        })),
        shippingAddress: selectedAddress,
        paymentMethod,
        total
      });

      if (paymentMethod === 'razorpay') {
        // Initialize Razorpay payment
        const options = {
          key: process.env.REACT_APP_RAZORPAY_KEY,
          amount: total * 100, // Razorpay expects amount in paise
          currency: 'INR',
          name: 'BEATEN',
          description: 'Premium Clothing',
          order_id: orderResponse.data.razorpayOrderId,
          handler: async (response) => {
            try {
              // Verify payment
              await axios.post('/api/orders/verify-payment', {
                orderId: orderResponse.data._id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature
              });
              setOrderPlaced(true);
              clearCart();
            } catch (err) {
              setError('Payment verification failed');
            }
          },
          prefill: {
            name: user.name,
            email: user.email,
            contact: user.phone
          },
          theme: {
            color: '#1976d2'
          }
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } else {
        // Handle COD
        setOrderPlaced(true);
        clearCart();
      }
    } catch (err) {
      setError('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Order Placed Successfully!
          </Typography>
          <Typography variant="body1" paragraph>
            Thank you for shopping with BEATEN. We'll send you an email with the
            order details.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/account/orders')}
          >
            View Orders
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          {activeStep === 0 && (
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Shipping Address</Typography>
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => setAddressDialog(true)}
                >
                  Add New Address
                </Button>
              </Box>

              <RadioGroup
                value={selectedAddress}
                onChange={(e) => setSelectedAddress(e.target.value)}
              >
                {addresses.map((address) => (
                  <Paper
                    key={address._id}
                    sx={{
                      p: 2,
                      mb: 2,
                      border: '1px solid',
                      borderColor: selectedAddress === address._id ? 'primary.main' : 'divider'
                    }}
                  >
                    <FormControlLabel
                      value={address._id}
                      control={<Radio />}
                      label={
                        <Box>
                          <Typography variant="subtitle1">
                            {address.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {address.street}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {address.city}, {address.state} - {address.pincode}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Phone: {address.phone}
                          </Typography>
                        </Box>
                      }
                    />
                  </Paper>
                ))}
              </RadioGroup>
            </Paper>
          )}

          {activeStep === 1 && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Payment Method
              </Typography>
              <FormControl component="fieldset">
                <RadioGroup
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <FormControlLabel
                    value="razorpay"
                    control={<Radio />}
                    label="Credit/Debit Card (Razorpay)"
                  />
                  <FormControlLabel
                    value="cod"
                    control={<Radio />}
                    label="Cash on Delivery"
                  />
                </RadioGroup>
              </FormControl>
            </Paper>
          )}

          {activeStep === 2 && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              {cart.map((item) => (
                <Box key={item._id} sx={{ display: 'flex', mb: 2 }}>
                  <CardMedia
                    component="img"
                    image={item.images[0]}
                    alt={item.name}
                    sx={{ width: 80, height: 80, objectFit: 'cover' }}
                  />
                  <Box sx={{ ml: 2, flex: 1 }}>
                    <Typography variant="subtitle1">{item.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Size: {item.size}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Quantity: {item.quantity}
                    </Typography>
                    <Typography variant="subtitle1" color="primary">
                      {formatPrice(item.price * item.quantity)}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Paper>
          )}
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <Box sx={{ my: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mb: 1
                }}
              >
                <Typography>Subtotal</Typography>
                <Typography>{formatPrice(subtotal)}</Typography>
              </Box>
              {user?.isPremium && (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 1
                  }}
                >
                  <Typography>Premium Discount</Typography>
                  <Typography color="success.main">
                    -{formatPrice(discount)}
                  </Typography>
                </Box>
              )}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mb: 1
                }}
              >
                <Typography>Shipping</Typography>
                <Typography>{formatPrice(shipping)}</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mb: 2
                }}
              >
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6" color="primary">
                  {formatPrice(total)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                >
                  Back
                </Button>
                {activeStep === steps.length - 1 ? (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handlePlaceOrder}
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Place Order'}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                  >
                    Next
                  </Button>
                )}
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Add Address Dialog */}
      <Dialog
        open={addressDialog}
        onClose={() => setAddressDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Address</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Full Name"
              value={newAddress.name}
              onChange={(e) =>
                setNewAddress({ ...newAddress, name: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Phone Number"
              value={newAddress.phone}
              onChange={(e) =>
                setNewAddress({ ...newAddress, phone: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Street Address"
              value={newAddress.street}
              onChange={(e) =>
                setNewAddress({ ...newAddress, street: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="City"
                  value={newAddress.city}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, city: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="State"
                  value={newAddress.state}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, state: e.target.value })
                  }
                />
              </Grid>
            </Grid>
            <TextField
              fullWidth
              label="PIN Code"
              value={newAddress.pincode}
              onChange={(e) =>
                setNewAddress({ ...newAddress, pincode: e.target.value })
              }
              sx={{ mt: 2, mb: 2 }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={newAddress.isDefault}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, isDefault: e.target.checked })
                  }
                />
              }
              label="Set as default address"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddressDialog(false)}>Cancel</Button>
          <Button onClick={handleAddressSubmit} color="primary">
            Save Address
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Checkout; 