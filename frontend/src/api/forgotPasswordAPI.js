import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Send forgot password OTP
export const sendForgotPasswordOTP = async (email) => {
  try {
    const response = await api.post(
      `${API_BASE_URL}/forgot-password/user/send-otp`,
      {
        email,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Verify forgot password OTP
export const verifyForgotPasswordOTP = async (email, otp) => {
  try {
    const response = await api.post(
      `${API_BASE_URL}/forgot-password/user/verify-otp`,
      {
        email,
        otp,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Reset password
export const resetPassword = async (email, resetToken, newPassword) => {
  try {
    const response = await api.post("/forgot-password/user/reset-password", {
      email,
      resetToken,
      newPassword,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Send OTP for login (email or phone)
export const sendOtpLogin = async ({ email, phone }) => {
  try {
    const response = await api.post(`${API_BASE_URL}/auth/send-otp-login`, {
      email,
      phone,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Verify OTP for login (email or phone)
export const verifyOtpLogin = async ({ email, phone, otp }) => {
  try {
    const response = await api.post(`${API_BASE_URL}/auth/verify-otp-login`, {
      email,
      phone,
      otp,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
