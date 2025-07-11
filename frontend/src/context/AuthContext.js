import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

// API Configuration
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8000/api";

// Create axios instance for auth context
const authApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");
      if (token && userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (err) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setError("Invalid user data");
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  // Register user (connects to backend)
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.post("/auth/register", userData);
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed"
      );
      setLoading(false);
      throw err;
    }
  };

  // Login user (placeholder - no backend connection)
  const login = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      // Placeholder for login logic
      console.log("Login data:", userData);
      const mockUser = { id: 1, name: userData.email, email: userData.email };
      const mockToken = "mock-token-" + Date.now();

      localStorage.setItem("token", mockToken);
      localStorage.setItem("user", JSON.stringify(mockUser));
      setUser(mockUser);
      setLoading(false);
      return { success: true, message: "Login successful (placeholder)" };
    } catch (err) {
      setError("Login failed");
      setLoading(false);
      throw err;
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setError(null);
  };

  // Update user profile (placeholder - no backend connection)
  const updateProfile = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      // Placeholder for profile update logic
      console.log("Profile update data:", userData);
      const updatedUser = { ...user, ...userData };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setLoading(false);
      return { success: true, message: "Profile updated (placeholder)" };
    } catch (err) {
      setError("Profile update failed");
      setLoading(false);
      throw err;
    }
  };

  // Change password (placeholder - no backend connection)
  const changePassword = async (passwordData) => {
    setLoading(true);
    setError(null);
    try {
      // Placeholder for password change logic
      console.log("Password change data:", passwordData);
      setLoading(false);
      return { success: true, message: "Password changed (placeholder)" };
    } catch (err) {
      setError("Password change failed");
      setLoading(false);
      throw err;
    }
  };

  // Send OTP for login (placeholder - no backend connection)
  const sendOTP = async (emailOrPhone) => {
    setLoading(true);
    setError(null);
    try {
      // Placeholder for OTP sending logic
      console.log("Send OTP to:", emailOrPhone);
      setLoading(false);
      return { success: true, message: "OTP sent (placeholder)" };
    } catch (err) {
      setError("Failed to send OTP");
      setLoading(false);
      throw err;
    }
  };

  // Verify OTP and login (placeholder - no backend connection)
  const verifyOTP = async (emailOrPhone, otp) => {
    setLoading(true);
    setError(null);
    try {
      // Placeholder for OTP verification logic
      console.log("Verify OTP:", emailOrPhone, otp);
      const mockUser = { id: 1, name: emailOrPhone, email: emailOrPhone };
      const mockToken = "mock-token-" + Date.now();

      localStorage.setItem("token", mockToken);
      localStorage.setItem("user", JSON.stringify(mockUser));
      setUser(mockUser);
      setLoading(false);
      return { success: true, message: "OTP verified (placeholder)" };
    } catch (err) {
      setError("OTP verification failed");
      setLoading(false);
      throw err;
    }
  };

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    updateProfile,
    changePassword,
    sendOTP,
    verifyOTP,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
