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
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import LockIcon from "@mui/icons-material/Lock";
import { useAuth } from "../context/AuthContext";

const Login = ({ mode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [otp, setOtp] = useState("");

  const from = location.state?.from?.pathname || "/";

  const matteColors = {
    900: "#1a1a1a",
    800: "#2d2d2d",
    700: "#404040",
    600: "#525252",
    100: "#f5f5f5",
  };

  // Mock API call to send OTP
  const sendOtp = async (emailOrPhone) => {
    setLoading(true);
    setError("");
    setSuccess("");
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        setLoading(false);
        setSuccess("OTP sent successfully!");
        resolve();
      }, 1200);
    });
  };

  // Mock API call to verify OTP
  const verifyOtp = async (emailOrPhone, otp) => {
    setLoading(true);
    setError("");
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        setLoading(false);
        if (otp === "123456") {
          resolve();
        } else {
          setError("Invalid OTP. Please try again.");
          reject();
        }
      }, 1200);
    });
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!emailOrPhone) {
      setError("Please enter your email or phone number.");
      return;
    }
    try {
      await sendOtp(emailOrPhone);
      setStep(2);
    } catch (err) {
      setError("Failed to send OTP.");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) {
      setError("Please enter the OTP.");
      return;
    }
    try {
      await verifyOtp(emailOrPhone, otp);
      // Simulate login (replace with real login logic)
      await login(emailOrPhone, otp); // You may need to adjust your login function
      navigate(from, { replace: true });
    } catch (err) {
      // Error is set in verifyOtp
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          bgcolor: mode === "dark" ? "#181818" : "#fff",
          color: mode === "dark" ? "#fff" : "inherit",
          minHeight: "100vh",
          width: "100%",
          transition: "background 0.3s, color 0.3s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(/Beaten/Artboard 3.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          py: 8,
        }}
      >
        <Paper
          sx={{
            p: 4,
            width: "100%",
            maxWidth: 450,
            borderRadius: 4,
            boxShadow: 24,
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
          }}
        >
          <Typography
            variant="h5"
            component="h5"
            align="center"
            gutterBottom
            sx={{
              fontWeight: 900,
              color: "primary.main",
              mb: 2,
              letterSpacing: 2,
            }}
          >
            WELCOME BACK
          </Typography>
          <Typography
            variant="body1"
            align="center"
            color="text.secondary"
            sx={{
              mb: 4,
              fontSize: "1.1rem",
            }}
          >
            {step === 1
              ? "Enter your email or phone to continue"
              : "Enter the OTP sent to your device"}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {success}
            </Alert>
          )}

          {step === 1 && (
            <form onSubmit={handleSendOtp}>
              <TextField
                fullWidth
                id="emailOrPhone"
                name="emailOrPhone"
                label="Email or Phone"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                margin="normal"
                autoFocus
                InputProps={{
                  startAdornment: emailOrPhone.includes("@") ? (
                    <EmailIcon sx={{ color: "action.active", mr: 1 }} />
                  ) : (
                    <PhoneIphoneIcon sx={{ color: "action.active", mr: 1 }} />
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  mt: 3,
                  mb: 2,
                  backgroundColor: matteColors[900],
                  color: "white",
                  py: { xs: 0.7, md: 1 },
                  px: { xs: 2, md: 3 },
                  fontSize: { xs: "0.98rem", md: "1.05rem" },
                  borderRadius: 10,
                  minHeight: { xs: 40, md: 48 },
                  fontWeight: 700,
                  textTransform: "none",
                  letterSpacing: 1.2,
                  transition: "all 0.3s ease",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  "&:hover": {
                    backgroundColor: matteColors[800],
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  },
                }}
              >
                {loading ? <CircularProgress size={24} /> : "Send OTP"}
              </Button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOtp}>
              <TextField
                fullWidth
                id="otp"
                name="otp"
                label="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                margin="normal"
                autoFocus
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
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  mt: 3,
                  mb: 2,
                  backgroundColor: matteColors[900],
                  color: "white",
                  py: { xs: 0.7, md: 1 },
                  px: { xs: 2, md: 3 },
                  fontSize: { xs: "0.98rem", md: "1.05rem" },
                  borderRadius: 10,
                  minHeight: { xs: 40, md: 48 },
                  fontWeight: 700,
                  textTransform: "none",
                  letterSpacing: 1.2,
                  transition: "all 0.3s ease",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  "&:hover": {
                    backgroundColor: matteColors[800],
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  },
                }}
              >
                {loading ? <CircularProgress size={24} /> : "Verify & Login"}
              </Button>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => setStep(1)}
                sx={{
                  mb: 2,
                  borderColor: matteColors[900],
                  color: matteColors[900],
                  backgroundColor: "white",
                  py: { xs: 0.7, md: 1 },
                  px: { xs: 2, md: 3 },
                  fontSize: { xs: "0.98rem", md: "1.05rem" },
                  borderRadius: 10,
                  minHeight: { xs: 40, md: 48 },
                  fontWeight: 600,
                  textTransform: "none",
                  transition: "all 0.3s ease",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  "&:hover": {
                    backgroundColor: matteColors[100],
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.10)",
                  },
                }}
              >
                Change Email/Phone
              </Button>
            </form>
          )}

          <Typography variant="body2" color="text.secondary">
            Don't have an account?{" "}
            <Link component={RouterLink} to="/register">
              Register here
            </Link>
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
