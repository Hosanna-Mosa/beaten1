import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const login = async ({ email, password }) => {
    setLoading(true);
    setError(null);
    try {
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const response = await axios.post(`${apiUrl}/api/auth/login`, { email, password });
      if (response.data && response.data.success) {
        const user = response.data.data;
        localStorage.setItem("token", user.token);
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
        setLoading(false);
        return { success: true };
      } else {
        setError(response.data.message || "Login failed");
        setLoading(false);
        return { success: false, message: response.data.message || "Login failed" };
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      setLoading(false);
      return { success: false, message: err.response?.data?.message || "Login failed" };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}; 