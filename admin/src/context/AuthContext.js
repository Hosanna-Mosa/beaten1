import React, { createContext, useState, useContext, useEffect } from "react";
import { dummyDataAPI } from "../api/dummyData";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("admin_token");
      if (token) {
        try {
          const res = await dummyDataAPI.auth.getMe();
          setUser(res.data);
        } catch (err) {
          localStorage.removeItem("admin_token");
          setError(err.message || "Authentication failed");
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (credentials) => {
    try {
      const res = await dummyDataAPI.auth.login(credentials);
      if (res.data.token) {
        localStorage.setItem("admin_token", res.data.token);
        setUser(res.data.user);
        setError(null);
        return res.data;
      } else {
        setError("No token received from server");
        throw new Error("No token received from server");
      }
    } catch (err) {
      setError(err.message || "Login failed");
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      const res = await dummyDataAPI.auth.register(userData);
      if (res.data.token) {
        // For registration, we don't automatically log in the user
        // They need to login separately
        setError(null);
        return res.data;
      } else {
        setError("Registration completed but no token received");
        throw new Error("Registration completed but no token received");
      }
    } catch (err) {
      setError(err.message || "Registration failed");
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    setUser(null);
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
