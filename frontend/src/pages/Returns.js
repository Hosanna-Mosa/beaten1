import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Chip,
  Grid,
  Divider,
  Avatar,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import {
  Refresh as RefreshIcon,
  AssignmentReturn as ReturnIcon,
  CheckCircle as ApprovedIcon,
  Pending as PendingIcon,
  Cancel as RejectedIcon,
} from "@mui/icons-material";
import { useTheme, useMediaQuery } from "@mui/material";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const PLACEHOLDER_IMAGE = "https://via.placeholder.com/80x80?text=Product";

// Define matte black colors
const matteColors = {
  900: "#1a1a1a",
  800: "#2d2d2d",
  700: "#404040",
  600: "#525252",
  100: "#f5f5f5",
};

const getStatusColor = (status) => {
  switch (status) {
    case "approved":
      return "success";
    case "pending":
      return "warning";
    case "rejected":
      return "error";
    default:
      return "default";
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case "approved":
      return <ApprovedIcon />;
    case "pending":
      return <PendingIcon />;
    case "rejected":
      return <RejectedIcon />;
    default:
      return <PendingIcon />;
  }
};

const Returns = ({ mode }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderError, setOrderError] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const fetchReturns = async () => {
    setLoading(true);
    setError("");
    try {
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8000";
      const token = localStorage.getItem("token");
      const response = await axios.get(`${apiUrl}/api/user/returns`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setReturns(response.data.data || []);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch returns."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchReturns();
    }
  }, [user]);

  // Sort returns by date descending (newest first)
  const sortedReturns = [...returns].sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));

  // Don't render anything if not logged in
  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <Container
        sx={{
          py: { xs: 4, md: 8 },
          bgcolor: mode === "dark" ? "#181818" : "#fff",
          color: mode === "dark" ? "#fff" : "#181818",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  const handleReturnCardClick = async (orderId) => {
    setOrderDialogOpen(true);
    setOrderLoading(true);
    setOrderError("");
    setOrderDetails(null);
    try {
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8000";
      const token = localStorage.getItem("token");
      const response = await axios.get(`${apiUrl}/api/orders/my/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrderDetails(response.data.data);
    } catch (err) {
      setOrderError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to fetch order details."
      );
    } finally {
      setOrderLoading(false);
    }
  };

  const handleCloseOrderDialog = () => {
    setOrderDialogOpen(false);
    setOrderDetails(null);
    setOrderError("");
  };

  return (
    <Container
      sx={{
        py: { xs: 4, md: 8 },
        bgcolor: mode === "dark" ? "#181818" : "#fff",
        color: mode === "dark" ? "#fff" : "#181818",
        minHeight: "100vh",
        transition: "background 0.3s, color 0.3s",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button 
          variant="outlined" 
          onClick={fetchReturns}
          startIcon={<RefreshIcon />}
        >
          Refresh Returns
        </Button>
      </Box>
      <Typography
        variant="h4"
        sx={{ fontWeight: 800, mb: 3, textAlign: "center" }}
      >
        My Returns
      </Typography>
      <Divider sx={{ mb: 4 }} />
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {sortedReturns.length === 0 ? (
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 3,
            textAlign: "center",
            boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
          }}
        >
          <ReturnIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
            No Returns Found
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary" }}>
            You haven't submitted any return requests yet.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {sortedReturns.map((returnItem, index) => (
            <Grid item xs={12} key={index}>
              <Paper
                elevation={3}
                sx={{
                  p: { xs: 2, sm: 3 },
                  borderRadius: 3,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
                  border: "1px solid",
                  borderColor: "divider",
                  cursor: "pointer",
                  transition: "box-shadow 0.2s",
                  '&:hover': { boxShadow: '0 4px 24px rgba(0,0,0,0.13)' },
                }}
                onClick={() => handleReturnCardClick(returnItem.orderId)}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    alignItems: isMobile ? "flex-start" : "center",
                    gap: 2,
                    mb: 2,
                  }}
                >
                  <Avatar
                    src={PLACEHOLDER_IMAGE}
                    alt="Product"
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: 2,
                      bgcolor: "#fafafa",
                      border: "2px solid #e0e0e0",
                    }}
                  />
                  
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        mb: 1,
                        overflowWrap: "break-word",
                      }}
                    >
                      Product Return Request
                    </Typography>
                    
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary", mb: 1 }}
                    >
                      Order ID: {returnItem.orderId}
                    </Typography>
                    
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary", mb: 1 }}
                    >
                      Product ID: {returnItem.productId}
                    </Typography>
                    
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary", mb: 1 }}
                    >
                      Submitted: {new Date(returnItem.createdAt || Date.now()).toLocaleDateString()}
                    </Typography>
                  </Box>
                  
                  <Chip
                    icon={getStatusIcon(returnItem.status || "pending")}
                    label={returnItem.status || "Pending"}
                    color={getStatusColor(returnItem.status || "pending")}
                    sx={{
                      fontWeight: 600,
                      minWidth: 100,
                    }}
                  />
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 600, mb: 1 }}
                  >
                    Return Reason:
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      p: 2,
                      bgcolor: "grey.50",
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    {returnItem.reason}
                  </Typography>
                </Box>
                
                {returnItem.status === "approved" && (
                  <Box sx={{ mt: 2 }}>
                    <Alert severity="success">
                      Your return request has been approved. Please follow the return instructions provided.
                    </Alert>
                  </Box>
                )}
                
                {returnItem.status === "rejected" && (
                  <Box sx={{ mt: 2 }}>
                    <Alert severity="error">
                      Your return request has been rejected. Please contact customer support for more information.
                    </Alert>
                  </Box>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Order Details Dialog */}
      <Dialog open={orderDialogOpen} onClose={handleCloseOrderDialog} maxWidth="md" fullWidth>
        <DialogTitle>Order Details</DialogTitle>
        <DialogContent dividers>
          {orderLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : orderError ? (
            <Alert severity="error">{orderError}</Alert>
          ) : orderDetails ? (
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>Order #{orderDetails._id}</Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>Placed on: {new Date(orderDetails.createdAt).toLocaleDateString()}</Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>Total: ₹{orderDetails.totalPrice}</Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>Payment Type: {orderDetails.paymentInfo?.method?.toUpperCase() || 'N/A'}</Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>Status: <Chip label={orderDetails.orderStatus} color={getStatusColor(orderDetails.orderStatus)} size="small" /></Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Order Items:</Typography>
              <List>
                {orderDetails.orderItems.map((item, idx) => (
                  <ListItem key={idx} alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar src={item.image || PLACEHOLDER_IMAGE} alt={item.name} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={item.name}
                      secondary={`Qty: ${item.qty} | Price: ₹${item.price}`}
                    />
                  </ListItem>
                ))}
              </List>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Delivery Address:</Typography>
              <Typography variant="body2">{orderDetails.shippingAddress?.address}, {orderDetails.shippingAddress?.city}, {orderDetails.shippingAddress?.state}, {orderDetails.shippingAddress?.country}, {orderDetails.shippingAddress?.postalCode}</Typography>
            </Box>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseOrderDialog} color="primary" variant="contained">Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Returns;
