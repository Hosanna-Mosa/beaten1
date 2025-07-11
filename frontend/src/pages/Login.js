import React, { useState } from "react";

import { useNavigate, useLocation, Link as RouterLink } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Paper,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import LockIcon from "@mui/icons-material/Lock";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useAuth } from "../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  sendForgotPasswordOTP,
  verifyForgotPasswordOTP,
  resetPassword,
} from "../api/forgotPasswordAPI";

const Login = () => {
  const { login, error, loading } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [localError, setLocalError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Forgot Password Dialog States
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState(1);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordOtp, setForgotPasswordOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [forgotPasswordError, setForgotPasswordError] = useState("");
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState("");
  // Store resetToken after OTP verification
  const [resetToken, setResetToken] = useState("");

  const from = location.state?.from?.pathname || "/";

  const matteColors = {
    900: "#1a1a1a",
    800: "#2d2d2d",
    700: "#404040",
    600: "#525252",
    100: "#f5f5f5",
  };

  // Email validation function
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password validation function
  const isValidPassword = (password) => {
    return password.length >= 6;
  };

  // Handle forgot password dialog open
  const handleForgotPasswordOpen = () => {
    setForgotPasswordOpen(true);
    setForgotPasswordStep(1);
    setForgotPasswordEmail("");
    setForgotPasswordOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setForgotPasswordError("");
    setForgotPasswordSuccess("");
  };

  // Handle forgot password dialog close
  const handleForgotPasswordClose = () => {
    setForgotPasswordOpen(false);
    setForgotPasswordStep(1);
    setForgotPasswordEmail("");
    setForgotPasswordOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setForgotPasswordError("");
    setForgotPasswordSuccess("");
  };

  // Handle send OTP for forgot password
  const handleForgotPasswordSendOtp = async () => {
    if (!forgotPasswordEmail) {
      setForgotPasswordError("Please enter your email address.");
      return;
    }

    if (!isValidEmail(forgotPasswordEmail)) {
      setForgotPasswordError("Please enter a valid email address.");
      return;
    }

    setForgotPasswordLoading(true);
    setForgotPasswordError("");
    setForgotPasswordSuccess("");

    try {
      const response = await sendForgotPasswordOTP(forgotPasswordEmail);

      setForgotPasswordSuccess("OTP sent successfully! Check your email.");
      setForgotPasswordStep(2);
      toast.success("OTP sent to your email!");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to send OTP. Please try again.";
      setForgotPasswordError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  // Handle verify OTP for forgot password
  const handleForgotPasswordVerifyOtp = async () => {
    if (!forgotPasswordOtp) {
      setForgotPasswordError("Please enter the OTP.");
      return;
    }

    if (forgotPasswordOtp.length !== 6) {
      setForgotPasswordError("Please enter a 6-digit OTP.");
      return;
    }

    setForgotPasswordLoading(true);
    setForgotPasswordError("");

    try {
      const response = await verifyForgotPasswordOTP(
        forgotPasswordEmail,
        forgotPasswordOtp
      );
      setResetToken(response.resetToken); // Store resetToken
      setForgotPasswordStep(3);
      toast.success("OTP verified successfully!");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Invalid OTP. Please try again.";
      setForgotPasswordError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  // Handle reset password
  const handleResetPassword = async () => {
    if (!newPassword) {
      setForgotPasswordError("Please enter a new password.");
      return;
    }

    if (!isValidPassword(newPassword)) {
      setForgotPasswordError("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setForgotPasswordError("Passwords do not match.");
      return;
    }

    setForgotPasswordLoading(true);
    setForgotPasswordError("");

    try {
      const response = await resetPassword(
        forgotPasswordEmail,
        resetToken,
        newPassword
      );
      toast.success("Password reset successfully!");
      handleForgotPasswordClose();
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Failed to reset password. Please try again.";
      setForgotPasswordError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  // Add handleChange and handleSubmit for the main login form
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    const result = await login(form);
    if (result.success) {
      navigate("/");
    } else {
      setLocalError(result.message || "Login failed");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 8 }}>
        <Typography variant="h5" align="center" sx={{ mb: 3, fontWeight: 700 }}>
          Login
        </Typography>
        <TextField
          label="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        {(localError || error) && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {localError || error}
          </Alert>
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Login"}
        </Button>
        <Box sx={{ textAlign: "right", mb: 2 }}>
          <Link
            component="button"
            variant="body2"
            onClick={handleForgotPasswordOpen}
            sx={{ cursor: "pointer" }}
          >
            Forgot password?
          </Link>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Don't have an account?{" "}
          <Link component={RouterLink} to="/register">
            Register here
          </Link>
        </Typography>
      </Box>

      {/* Forgot Password Dialog */}
      <Dialog
        open={forgotPasswordOpen}
        onClose={handleForgotPasswordClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            backgroundColor: "rgba(255, 255, 255, 0.98)",
            backdropFilter: "blur(10px)",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pb: 1,
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, color: matteColors[900] }}
          >
            {forgotPasswordStep === 1 && "Forgot Password"}
            {forgotPasswordStep === 2 && "Enter OTP"}
            {forgotPasswordStep === 3 && "Reset Password"}
          </Typography>
          <IconButton onClick={handleForgotPasswordClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          {forgotPasswordError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {forgotPasswordError}
            </Alert>
          )}
          {forgotPasswordSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {forgotPasswordSuccess}
            </Alert>
          )}

          {/* Step 1: Email Input */}
          {forgotPasswordStep === 1 && (
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Enter your email address and we'll send you a one-time password
                to reset your account.
              </Typography>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={forgotPasswordEmail}
                onChange={(e) => setForgotPasswordEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <EmailIcon sx={{ color: "action.active", mr: 1 }} />
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Box>
          )}

          {/* Step 2: OTP Input */}
          {forgotPasswordStep === 2 && (
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                We've sent a 6-digit OTP to{" "}
                <strong>{forgotPasswordEmail}</strong>. Please enter it below.
              </Typography>
              <TextField
                fullWidth
                label="Enter OTP"
                value={forgotPasswordOtp}
                onChange={(e) => setForgotPasswordOtp(e.target.value)}
                inputProps={{ maxLength: 6 }}
                InputProps={{
                  startAdornment: (
                    <LockIcon sx={{ color: "action.active", mr: 1 }} />
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Box>
          )}

          {/* Step 3: New Password */}
          {forgotPasswordStep === 3 && (
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Create a new password for your account.
              </Typography>
              <TextField
                fullWidth
                label="New Password"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <LockIcon sx={{ color: "action.active", mr: 1 }} />
                  ),
                  endAdornment: (
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
              <TextField
                fullWidth
                label="Confirm New Password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <LockIcon sx={{ color: "action.active", mr: 1 }} />
                  ),
                  endAdornment: (
                    <IconButton
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      edge="end"
                    >
                      {showConfirmPassword ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          {forgotPasswordStep > 1 && (
            <Button
              onClick={() => setForgotPasswordStep(forgotPasswordStep - 1)}
              sx={{
                color: matteColors[700],
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Back
            </Button>
          )}

          <Button
            onClick={
              forgotPasswordStep === 1
                ? handleForgotPasswordSendOtp
                : forgotPasswordStep === 2
                  ? handleForgotPasswordVerifyOtp
                  : handleResetPassword
            }
            variant="contained"
            disabled={forgotPasswordLoading}
            sx={{
              backgroundColor: matteColors[900],
              color: "white",
              px: 3,
              py: 1,
              borderRadius: 2,
              fontWeight: 600,
              textTransform: "none",
              "&:hover": {
                backgroundColor: matteColors[800],
              },
            }}
          >
            {forgotPasswordLoading ? (
              <CircularProgress size={20} color="inherit" />
            ) : forgotPasswordStep === 1 ? (
              "Send OTP"
            ) : forgotPasswordStep === 2 ? (
              "Verify OTP"
            ) : (
              "Reset Password"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Login;
