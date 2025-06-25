import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Divider,
  CircularProgress
} from '@mui/material';

const Payment = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
    address: '',
    city: '',
    state: '',
    zip: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 2000);
  };

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 3, md: 6 } }}>
      <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, boxShadow: 2 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Payment Details
        </Typography>
        <Divider sx={{ mb: 3 }} />
        {success ? (
          <Box textAlign="center" py={6}>
            <Typography variant="h6" color="success.main" gutterBottom>
              Payment Successful!
            </Typography>
            <Typography>Your order has been placed.</Typography>
          </Box>
        ) : (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Name on Card"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Card Number"
                  name="cardNumber"
                  value={form.cardNumber}
                  onChange={handleChange}
                  fullWidth
                  required
                  inputProps={{ maxLength: 19 }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Expiry (MM/YY)"
                  name="expiry"
                  value={form.expiry}
                  onChange={handleChange}
                  fullWidth
                  required
                  inputProps={{ maxLength: 5 }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="CVC"
                  name="cvc"
                  value={form.cvc}
                  onChange={handleChange}
                  fullWidth
                  required
                  inputProps={{ maxLength: 4 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Billing Address"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="City"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="State"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="ZIP / Postal Code"
                  name="zip"
                  value={form.zip}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
            </Grid>
            {error && (
              <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              sx={{ mt: 3, py: 1.5, fontWeight: 600, fontSize: '1.1rem', borderRadius: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Pay Now'}
            </Button>
          </form>
        )}
      </Paper>
    </Container>
  );
};

export default Payment; 