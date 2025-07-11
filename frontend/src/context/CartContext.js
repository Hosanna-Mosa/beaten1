import React, { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";
import axios from "axios";
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8000/api";
const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
      return [];
    }
  });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // No need to fetch from server since we're removing backend connections
    setLoading(false);
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [cart]);

  const fetchSavedCart = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/user/me`);
      const serverCart = response.data.savedCart || [];
      // Merge server cart with local cart, preferring server data
      const mergedCart = serverCart.map((serverItem) => {
        const localItem = cart.find(
          (item) =>
            item.product._id === serverItem.product._id &&
            item.size === serverItem.size &&
            item.color === serverItem.color
        );
        return localItem || serverItem;
      });
      setCart(mergedCart);
    } catch (error) {
      console.error("Error fetching saved cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product, quantity, size, color) => {
    try {
      const existingItem = cart.find(
        (item) =>
          item.product._id === product._id &&
          item.size === size &&
          item.color === color
      );
      let updatedCart;
      if (existingItem) {
        updatedCart = cart.map((item) =>
          item.product._id === product._id &&
          item.size === size &&
          item.color === color
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        updatedCart = [
          ...cart,
          {
            product,
            quantity,
            size,
            color,
          },
        ];
      }
      setCart(updatedCart);
      if (user) {
        await axios.put(`${API_BASE_URL}/user/me`, {
          savedCart: updatedCart,
        });
      }
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: "Failed to add to cart",
      };
    }
  };

  const updateQuantity = async (productId, size, color, quantity) => {
    try {
      const updatedCart = cart.map((item) =>
        item.product._id === productId &&
        item.size === size &&
        item.color === color
          ? { ...item, quantity }
          : item
      );
      setCart(updatedCart);
      if (user) {
        await axios.put(`${API_BASE_URL}/user/me`, {
          savedCart: updatedCart,
        });
      }
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: "Failed to update quantity",
      };
    }
  };

  const removeFromCart = async (productId, size, color) => {
    try {
      const updatedCart = cart.filter(
        (item) =>
          !(
            item.product._id === productId &&
            item.size === size &&
            item.color === color
          )
      );
      setCart(updatedCart);
      if (user) {
        await axios.put(`${API_BASE_URL}/user/me`, {
          savedCart: updatedCart,
        });
      }
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: "Failed to remove from cart",
      };
    }
  };

  const clearCart = async () => {
    try {
      setCart([]);
      if (user) {
        await axios.put(`${API_BASE_URL}/user/me`, {
          savedCart: [],
        });
      }
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: "Failed to clear cart",
      };
    }
  };

  const getCartTotal = () => {
    return cart.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cart,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
