import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Divider,
  Pagination,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Drawer,
  useMediaQuery,
  useTheme,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Radio,
  RadioGroup,
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Close as CloseIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  ArrowBack as ArrowBackIcon,
  ViewModule as ViewModuleIcon,
  ViewList as ViewListIcon,
  Sort as SortIcon,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/format";
import axios from "axios";
import { useWishlist } from "../context/WishlistContext";
import Skeleton from "@mui/material/Skeleton";
import Tooltip from "@mui/material/Tooltip";
import Fade from "@mui/material/Fade";
import HeroSearchBar from "../components/common/HeroSearchBar";

const dummyProducts = [
  // MEN'S T-SHIRTS - Regular
  {
    _id: "1",
    name: "Classic Black T-Shirt",
    description: "Premium cotton t-shirt with a modern fit",
    price: 1999,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80",
    category: "MEN",
    subCategory: "Regular",
    collection: "Beaten Exclusive Collection",
    inStock: true,
    colors: ["Black", "White", "Navy"],
    gender: "Men",
  },
  {
    _id: "2",
    name: "Essential White T-Shirt",
    description: "Classic white t-shirt for everyday wear",
    price: 1499,
    image:
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    category: "MEN",
    subCategory: "Regular",
    collection: "Beaten Launch Sale Vol 1",
    inStock: true,
    colors: ["White", "Black", "Grey"],
    gender: "Men",
  },
  {
    _id: "3",
    name: "Oversized Graphic Tee",
    description: "Trendy oversized t-shirt with bold graphics",
    price: 2499,
    image:
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    category: "MEN",
    subCategory: "Oversized",
    collection: "Beaten Signature Collection",
    inStock: true,
    colors: ["White", "Black", "Grey"],
    gender: "Men",
  },
  {
    _id: "4",
    name: "Oversized Street Style Tee",
    description: "Urban oversized t-shirt with street style graphics",
    price: 2799,
    image:
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    category: "MEN",
    subCategory: "Oversized",
    collection: "Beaten Exclusive Collection",
    inStock: true,
    colors: ["Black", "Grey", "Navy"],
    gender: "Men",
  },
  // MEN'S T-SHIRTS - Graphic T-shirts
  {
    _id: "5",
    name: "Vintage Graphic Tee",
    description: "Retro-style graphic t-shirt with vintage design",
    price: 2299,
    image:
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    category: "MEN",
    subCategory: "Graphic T-shirts",
    collection: "Beaten Launch Sale Vol 1",
    inStock: true,
    colors: ["White", "Black", "Grey"],
    gender: "Men",
  },
  {
    _id: "6",
    name: "Artistic Graphic Tee",
    description: "T-shirt featuring unique artistic graphics",
    price: 2599,
    image:
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    category: "MEN",
    subCategory: "Graphic T-shirts",
    collection: "Beaten Signature Collection",
    inStock: true,
    colors: ["Black", "White", "Navy"],
    gender: "Men",
  },
  // MEN'S T-SHIRTS - Embroidery
  {
    _id: "7",
    name: "Embroidered Logo T-Shirt",
    description: "Premium t-shirt with embroidered brand logo",
    price: 2799,
    image:
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    category: "MEN",
    subCategory: "Embroidery",
    collection: "Beaten Exclusive Collection",
    inStock: true,
    colors: ["Navy", "Black", "White"],
    gender: "Men",
  },
  {
    _id: "8",
    name: "Floral Embroidered Tee",
    description: "T-shirt with delicate floral embroidery",
    price: 2999,
    image:
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    category: "MEN",
    subCategory: "Embroidery",
    collection: "Beaten Launch Sale Vol 1",
    inStock: true,
    colors: ["White", "Black", "Grey"],
    gender: "Men",
  },
  // MEN'S SHIRTS - Casual wear
  {
    _id: "9",
    name: "Casual Denim Shirt",
    description: "Comfortable denim shirt for everyday wear",
    price: 3499,
    image:
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    category: "MEN",
    subCategory: "Casual wear",
    collection: "Beaten Signature Collection",
    inStock: true,
    colors: ["Blue", "Black"],
    gender: "Men",
  },
  {
    _id: "10",
    name: "Linen Casual Shirt",
    description: "Light and breathable linen shirt",
    price: 3299,
    image:
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    category: "MEN",
    subCategory: "Casual wear",
    collection: "Beaten Exclusive Collection",
    inStock: true,
    colors: ["Beige", "White", "Blue"],
    gender: "Men",
  },
  // MEN'S SHIRTS - Formal wear
  {
    _id: "11",
    name: "Formal White Shirt",
    description: "Crisp white formal shirt for professional wear",
    price: 2999,
    image:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    category: "MEN",
    subCategory: "Formal wear",
    collection: "Beaten Launch Sale Vol 1",
    inStock: true,
    colors: ["White", "Light Blue"],
    gender: "Men",
  },
  {
    _id: "12",
    name: "Classic Blue Formal Shirt",
    description: "Professional blue formal shirt",
    price: 2799,
    image:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    category: "MEN",
    subCategory: "Formal wear",
    collection: "Beaten Signature Collection",
    inStock: true,
    colors: ["Blue", "White"],
    gender: "Men",
  },
  // MEN'S BOTTOM WEAR - Jeans
  {
    _id: "13",
    name: "Slim Fit Jeans",
    description: "Modern slim fit jeans with stretch comfort",
    price: 3999,
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    category: "MEN",
    subCategory: "Jeans",
    collection: "Beaten Exclusive Collection",
    inStock: true,
    colors: ["Blue", "Black", "Grey"],
    gender: "Men",
  },
  {
    _id: "14",
    name: "Classic Blue Jeans",
    description: "Timeless blue jeans with perfect fit",
    price: 3799,
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    category: "MEN",
    subCategory: "Jeans",
    collection: "Beaten Launch Sale Vol 1",
    inStock: true,
    colors: ["Blue", "Black"],
    gender: "Men",
  },
  // MEN'S BOTTOM WEAR - Cargo Pants
  {
    _id: "15",
    name: "Utility Cargo Pants",
    description: "Functional cargo pants with multiple pockets",
    price: 4499,
    image:
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1399&q=80",
    category: "MEN",
    subCategory: "Cargo Pants",
    collection: "Beaten Signature Collection",
    inStock: true,
    colors: ["Khaki", "Black", "Olive"],
    gender: "Men",
  },
  {
    _id: "16",
    name: "Urban Cargo Pants",
    description: "Stylish cargo pants for urban wear",
    price: 4299,
    image:
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1399&q=80",
    category: "MEN",
    subCategory: "Cargo Pants",
    collection: "Beaten Exclusive Collection",
    inStock: true,
    colors: ["Black", "Grey"],
    gender: "Men",
  },
  // MEN'S BOTTOM WEAR - Chinos
  {
    _id: "17",
    name: "Classic Chino Pants",
    description: "Classic chino pants for smart casual wear",
    price: 3799,
    image:
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1399&q=80",
    category: "MEN",
    subCategory: "Chinos",
    collection: "Beaten Launch Sale Vol 1",
    inStock: true,
    colors: ["Beige", "Navy", "Black"],
    gender: "Men",
  },
  {
    _id: "18",
    name: "Slim Fit Chinos",
    description: "Modern slim fit chinos for a contemporary look",
    price: 3599,
    image:
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1399&q=80",
    category: "MEN",
    subCategory: "Chinos",
    collection: "Beaten Signature Collection",
    inStock: true,
    colors: ["Khaki", "Navy", "Grey"],
    gender: "Men",
  },
  // WOMEN'S T-SHIRTS - Regular
  {
    _id: "19",
    name: "Women's Casual T-Shirt",
    description: "Soft cotton t-shirt for everyday wear",
    price: 1599,
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    category: "WOMEN",
    subCategory: "Regular",
    collection: "Beaten Exclusive Collection",
    inStock: true,
    colors: ["Pink", "Grey", "White"],
    gender: "Women",
  },
  {
    _id: "20",
    name: "Essential White Tee",
    description: "Classic white t-shirt for women",
    price: 1499,
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    category: "WOMEN",
    subCategory: "Regular",
    collection: "Beaten Launch Sale Vol 1",
    inStock: true,
    colors: ["White", "Black", "Grey"],
    gender: "Women",
  },
  // WOMEN'S T-SHIRTS - Oversized
  {
    _id: "21",
    name: "Oversized Graphic Tee",
    description: "Trendy oversized t-shirt with artistic print",
    price: 2299,
    image:
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1364&q=80",
    category: "WOMEN",
    subCategory: "Oversized",
    collection: "Beaten Signature Collection",
    inStock: true,
    colors: ["White", "Black", "Pink"],
    gender: "Women",
  },
  {
    _id: "22",
    name: "Oversized Street Style Tee",
    description: "Urban oversized t-shirt with street style graphics",
    price: 2499,
    image:
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1364&q=80",
    category: "WOMEN",
    subCategory: "Oversized",
    collection: "Beaten Exclusive Collection",
    inStock: true,
    colors: ["Black", "Grey", "White"],
    gender: "Women",
  },
  // WOMEN'S T-SHIRTS - Graphic T-shirts
  {
    _id: "23",
    name: "Vintage Graphic Tee",
    description: "Retro-style graphic t-shirt for women",
    price: 2099,
    image:
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1364&q=80",
    category: "WOMEN",
    subCategory: "Graphic T-shirts",
    collection: "Beaten Launch Sale Vol 1",
    inStock: true,
    colors: ["White", "Black", "Pink"],
    gender: "Women",
  },
  {
    _id: "24",
    name: "Artistic Graphic Tee",
    description: "T-shirt featuring unique artistic graphics",
    price: 2299,
    image:
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1364&q=80",
    category: "WOMEN",
    subCategory: "Graphic T-shirts",
    collection: "Beaten Signature Collection",
    inStock: true,
    colors: ["Black", "White", "Grey"],
    gender: "Women",
  },
  // WOMEN'S T-SHIRTS - Embroidery
  {
    _id: "25",
    name: "Embroidered Logo T-Shirt",
    description: "Premium t-shirt with embroidered brand logo",
    price: 2499,
    image:
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1364&q=80",
    category: "WOMEN",
    subCategory: "Embroidery",
    collection: "Beaten Exclusive Collection",
    inStock: true,
    colors: ["White", "Black", "Pink"],
    gender: "Women",
  },
  {
    _id: "26",
    name: "Floral Embroidered Tee",
    description: "T-shirt with delicate floral embroidery",
    price: 2699,
    image:
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1364&q=80",
    category: "WOMEN",
    subCategory: "Embroidery",
    collection: "Beaten Launch Sale Vol 1",
    inStock: true,
    colors: ["White", "Pink", "Blue"],
    gender: "Women",
  },
  // BOYS' CLOTHING
  {
    _id: "27",
    name: "Boys Graphic Tee",
    description: "Fun graphic t-shirt for boys",
    price: 999,
    image:
      "https://images.unsplash.com/photo-1600269451380-3e5026d89c41?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    category: "MEN",
    subCategory: "Graphic T-shirts",
    collection: "Beaten Signature Collection",
    inStock: true,
    colors: ["Blue", "Green"],
    gender: "Boys",
  },
  {
    _id: "28",
    name: "Boys Denim Jacket",
    description: "Stylish denim jacket for boys",
    price: 2499,
    image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    category: "MEN",
    subCategory: "Regular",
    collection: "Beaten Exclusive Collection",
    inStock: true,
    colors: ["Blue", "Black"],
    gender: "Boys",
  },
  // GIRLS' CLOTHING
  {
    _id: "29",
    name: "Girls Summer Dress",
    description: "Light and breezy dress for girls",
    price: 1299,
    image:
      "https://images.unsplash.com/photo-1592873400394-c16a1a6a3c2c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    category: "WOMEN",
    subCategory: null,
    collection: "Beaten Launch Sale Vol 1",
    inStock: true,
    colors: ["Yellow", "Pink"],
    gender: "Girls",
  },
  {
    _id: "30",
    name: "Girls Denim Overalls",
    description: "Cute denim overalls for girls",
    price: 1999,
    image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    category: "WOMEN",
    subCategory: null,
    collection: "Beaten Exclusive Collection",
    inStock: true,
    colors: ["Blue", "Pink"],
    gender: "Girls",
  },
  // ACCESSORIES
  {
    _id: "31",
    name: "Limited Edition Cap",
    description: "Exclusive design cap with premium materials",
    price: 1499,
    image:
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1336&q=80",
    category: "Accessories",
    subCategory: null,
    collection: "Beaten Signature Collection",
    inStock: true,
    colors: ["Black", "White"],
    gender: null,
  },
  {
    _id: "32",
    name: "Premium Leather Belt",
    description: "Handcrafted leather belt with unique buckle",
    price: 2999,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    category: "Accessories",
    subCategory: null,
    collection: "Beaten Exclusive Collection",
    inStock: true,
    colors: ["Brown", "Black"],
    gender: null,
  },
  {
    _id: "33",
    name: "Designer Watch",
    description: "Minimalist design watch with premium finish",
    price: 8999,
    image:
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    category: "Accessories",
    subCategory: null,
    collection: "Beaten Launch Sale Vol 1",
    inStock: true,
    colors: ["Silver", "Black", "Gold"],
    gender: null,
  },
  // Additional MEN'S T-SHIRTS
  {
    _id: "34",
    name: "Striped T-Shirt",
    description: "Classic striped t-shirt for casual wear",
    price: 1799,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80",
    category: "MEN",
    subCategory: "Regular",
    collection: "Beaten Exclusive Collection",
    inStock: true,
    colors: ["Navy/White", "Black/White"],
    gender: "Men",
  },
  {
    _id: "35",
    name: "Vintage Graphic Tee",
    description: "Retro-style graphic t-shirt",
    price: 2299,
    image:
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    category: "MEN",
    subCategory: "Graphic T-shirts",
    collection: "Beaten Launch Sale Vol 1",
    inStock: true,
    colors: ["White", "Black", "Grey"],
    gender: "Men",
  },
  // Additional WOMEN'S T-SHIRTS
  {
    _id: "36",
    name: "Crop Top T-Shirt",
    description: "Stylish crop top for casual wear",
    price: 1499,
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    category: "WOMEN",
    subCategory: "Regular",
    collection: "Beaten Signature Collection",
    inStock: true,
    colors: ["White", "Pink", "Black"],
    gender: "Women",
  },
  // Continue with more products...
  {
    _id: "37",
    name: "Men's Hooded Sweatshirt",
    description: "Comfortable hoodie for casual wear",
    price: 3999,
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    category: "MEN",
    subCategory: null,
    collection: "Beaten Exclusive Collection",
    inStock: true,
    colors: ["Grey", "Black", "Navy"],
    gender: "Men",
  },
  // Add more products following the same pattern...
  {
    _id: "38",
    name: "Women's Summer Dress",
    description: "Light and flowy summer dress",
    price: 2999,
    image:
      "https://images.unsplash.com/photo-1592873400394-c16a1a6a3c2c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    category: "WOMEN",
    subCategory: null,
    collection: "Beaten Launch Sale Vol 1",
    inStock: true,
    colors: ["Yellow", "Pink", "Blue"],
    gender: "Women",
  },
  // Continue adding more products...
  {
    _id: "39",
    name: "Boys Casual Shirt",
    description: "Comfortable casual shirt for boys",
    price: 1299,
    image:
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    category: "MEN",
    subCategory: "Casual wear",
    collection: "Beaten Signature Collection",
    inStock: true,
    colors: ["Blue", "White"],
    gender: "Boys",
  },
  // Add remaining products...
  {
    _id: "40",
    name: "Girls Casual Top",
    description: "Cute and comfortable top for girls",
    price: 999,
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    category: "WOMEN",
    subCategory: "Regular",
    collection: "Beaten Exclusive Collection",
    inStock: true,
    colors: ["Pink", "Yellow", "White"],
    gender: "Girls",
  },
  {
    _id: "41",
    name: "Men's Polo T-Shirt",
    description: "Classic polo t-shirt for casual wear",
    price: 2499,
    image:
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    category: "MEN",
    subCategory: "Regular",
    collection: "Beaten Launch Sale Vol 1",
    inStock: true,
    colors: ["Navy", "Black", "White"],
    gender: "Men",
  },
  {
    _id: "42",
    name: "Women's Blouse",
    description: "Elegant blouse for formal occasions",
    price: 3499,
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    category: "WOMEN",
    subCategory: "Regular",
    collection: "Beaten Signature Collection",
    inStock: true,
    colors: ["White", "Black", "Pink"],
    gender: "Women",
  },
  {
    _id: "43",
    name: "Boys Shorts",
    description: "Comfortable shorts for boys",
    price: 1299,
    image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    category: "MEN",
    subCategory: "Regular",
    collection: "Beaten Exclusive Collection",
    inStock: true,
    colors: ["Blue", "Black", "Grey"],
    gender: "Boys",
  },
  {
    _id: "44",
    name: "Girls Skirt",
    description: "Cute and comfortable skirt for girls",
    price: 1499,
    image:
      "https://images.unsplash.com/photo-1592873400394-c16a1a6a3c2c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    category: "WOMEN",
    subCategory: null,
    collection: "Beaten Launch Sale Vol 1",
    inStock: true,
    colors: ["Pink", "Yellow", "Blue"],
    gender: "Girls",
  },
  {
    _id: "45",
    name: "Men's Sweater",
    description: "Warm and comfortable sweater for winter",
    price: 3999,
    image:
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1364&q=80",
    category: "MEN",
    subCategory: null,
    collection: "Beaten Signature Collection",
    inStock: true,
    colors: ["Grey", "Navy", "Black"],
    gender: "Men",
  },
  {
    _id: "46",
    name: "Women's Cardigan",
    description: "Stylish cardigan for layering",
    price: 3499,
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    category: "WOMEN",
    subCategory: null,
    collection: "Beaten Exclusive Collection",
    inStock: true,
    colors: ["Beige", "Grey", "Black"],
    gender: "Women",
  },
  {
    _id: "47",
    name: "Boys Winter Jacket",
    description: "Warm winter jacket for boys",
    price: 2999,
    image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    category: "MEN",
    subCategory: null,
    collection: "Beaten Exclusive Collection",
    inStock: true,
    colors: ["Blue", "Red", "Black"],
    gender: "Boys",
  },
  {
    _id: "48",
    name: "Girls Winter Coat",
    description: "Warm and stylish winter coat for girls",
    price: 3499,
    image:
      "https://images.unsplash.com/photo-1592873400394-c16a1a6a3c2c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    category: "WOMEN",
    subCategory: null,
    collection: "Beaten Launch Sale Vol 1",
    inStock: true,
    colors: ["Pink", "Purple", "Red"],
    gender: "Girls",
  },
  {
    _id: "49",
    name: "Men's Formal Suit",
    description: "Classic formal suit for special occasions",
    price: 8999,
    image:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    category: "MEN",
    subCategory: "Formal wear",
    collection: "Beaten Signature Collection",
    inStock: true,
    colors: ["Black", "Navy", "Grey"],
    gender: "Men",
  },
  {
    _id: "50",
    name: "Women's Evening Dress",
    description: "Elegant evening dress for special occasions",
    price: 7999,
    image:
      "https://images.unsplash.com/photo-1592873400394-c16a1a6a3c2c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    category: "WOMEN",
    subCategory: null,
    collection: "Beaten Exclusive Collection",
    inStock: true,
    colors: ["Black", "Red", "Blue"],
    gender: "Women",
  },
  {
    _id: "51",
    name: "Boys Formal Shirt",
    description: "Smart formal shirt for boys",
    price: 1499,
    image:
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    category: "MEN",
    subCategory: "Formal wear",
    collection: "Beaten Launch Sale Vol 1",
    inStock: true,
    colors: ["White", "Light Blue"],
    gender: "Boys",
  },
  {
    _id: "52",
    name: "Girls Party Dress",
    description: "Beautiful party dress for girls",
    price: 2499,
    image:
      "https://images.unsplash.com/photo-1592873400394-c16a1a6a3c2c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    category: "WOMEN",
    subCategory: null,
    collection: "Beaten Signature Collection",
    inStock: true,
    colors: ["Pink", "Yellow", "Blue"],
    gender: "Girls",
  },
  {
    _id: "53",
    name: "Men's Sports T-Shirt",
    description: "Comfortable sports t-shirt for workouts",
    price: 1799,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80",
    category: "MEN",
    subCategory: "Regular",
    collection: "Beaten Exclusive Collection",
    inStock: true,
    colors: ["Black", "Grey", "Blue"],
    gender: "Men",
  },
  {
    _id: "54",
    name: "Women's Yoga Pants",
    description: "Comfortable yoga pants for workouts",
    price: 2499,
    image:
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1399&q=80",
    category: "WOMEN",
    subCategory: null,
    collection: "Beaten Launch Sale Vol 1",
    inStock: true,
    colors: ["Black", "Grey", "Navy"],
    gender: "Women",
  },
  {
    _id: "55",
    name: "Boys Sports Shorts",
    description: "Comfortable sports shorts for boys",
    price: 999,
    image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    category: "MEN",
    subCategory: "Regular",
    collection: "Beaten Signature Collection",
    inStock: true,
    colors: ["Blue", "Black", "Grey"],
    gender: "Boys",
  },
  {
    _id: "56",
    name: "Girls Sports Top",
    description: "Comfortable sports top for girls",
    price: 1299,
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    category: "WOMEN",
    subCategory: "Regular",
    collection: "Beaten Exclusive Collection",
    inStock: true,
    colors: ["Pink", "Purple", "Blue"],
    gender: "Girls",
  },
  {
    _id: "57",
    name: "Men's Swim Shorts",
    description: "Comfortable swim shorts for beach",
    price: 1499,
    image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    category: "MEN",
    subCategory: "Regular",
    collection: "Beaten Launch Sale Vol 1",
    inStock: true,
    colors: ["Blue", "Black", "Red"],
    gender: "Men",
  },
  {
    _id: "58",
    name: "Women's Swim Suit",
    description: "Stylish swim suit for beach",
    price: 2999,
    image:
      "https://images.unsplash.com/photo-1592873400394-c16a1a6a3c2c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    category: "WOMEN",
    subCategory: null,
    collection: "Beaten Signature Collection",
    inStock: true,
    colors: ["Black", "Red", "Blue"],
    gender: "Women",
  },
  {
    _id: "59",
    name: "Boys Swim Shorts",
    description: "Fun swim shorts for boys",
    price: 999,
    image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    category: "MEN",
    subCategory: "Regular",
    collection: "Beaten Exclusive Collection",
    inStock: true,
    colors: ["Blue", "Green", "Red"],
    gender: "Boys",
  },
  {
    _id: "60",
    name: "Girls Swim Suit",
    description: "Cute swim suit for girls",
    price: 1499,
    image:
      "https://images.unsplash.com/photo-1592873400394-c16a1a6a3c2c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    category: "WOMEN",
    subCategory: null,
    collection: "Beaten Launch Sale Vol 1",
    inStock: true,
    colors: ["Pink", "Yellow", "Blue"],
    gender: "Girls",
  },
  {
    _id: "61",
    name: "Men's Leather Jacket",
    description: "Stylish leather jacket for men",
    price: 7999,
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    category: "MEN",
    subCategory: null,
    collection: "Beaten Exclusive Collection",
    inStock: true,
    colors: ["Black", "Brown"],
    gender: "Men",
  },
  {
    _id: "62",
    name: "Women's Leather Jacket",
    description: "Stylish leather jacket for women",
    price: 6999,
    image:
      "https://images.unsplash.com/photo-1551489186-cf8726f514f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    category: "WOMEN",
    subCategory: null,
    collection: "Beaten Launch Sale Vol 1",
    inStock: true,
    colors: ["Black", "Brown"],
    gender: "Women",
  },
  {
    _id: "63",
    name: "Boys Denim Jacket",
    description: "Stylish denim jacket for boys",
    price: 2499,
    image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    category: "MEN",
    subCategory: "Regular",
    collection: "Beaten Exclusive Collection",
    inStock: true,
    colors: ["Blue", "Black"],
    gender: "Boys",
  },
  {
    _id: "64",
    name: "Girls Denim Jacket",
    description: "Stylish denim jacket for girls",
    price: 2299,
    image:
      "https://images.unsplash.com/photo-1592873400394-c16a1a6a3c2c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    category: "WOMEN",
    subCategory: null,
    collection: "Beaten Launch Sale Vol 1",
    inStock: true,
    colors: ["Blue", "Pink"],
    gender: "Girls",
  },
  {
    _id: "65",
    name: "Men's Sunglasses",
    description: "Stylish sunglasses for men",
    price: 1999,
    image:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    category: "Accessories",
    subCategory: null,
    collection: "Beaten Signature Collection",
    inStock: true,
    colors: ["Black", "Brown"],
    gender: "Men",
  },
  {
    _id: "66",
    name: "Women's Sunglasses",
    description: "Stylish sunglasses for women",
    price: 1799,
    image:
      "https://images.unsplash.com/photo-1577803645773-f96470509666?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    category: "Accessories",
    subCategory: null,
    collection: "Beaten Exclusive Collection",
    inStock: true,
    colors: ["Black", "Brown"],
    gender: "Women",
  },
];

const sizeOptions = ["S", "M", "L", "XL", "XXL"];
const fitOptions = ["Slim", "Oversized", "Regular"];
// Get all unique colors from products
const colorOptions = Array.from(
  new Set(dummyProducts.flatMap((p) => p.colors || []))
);

const collections = [
  "Beaten Exclusive Collection",
  "Beaten Launch Sale Vol 1",
  "Beaten Signature Collection",
];

const FALLBACK_IMAGE =
  'data:image/svg+xml;utf8,<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg"><rect fill="%23f5f5f5" width="200" height="200"/><text x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-size="20">Image</text></svg>';

const Products = ({ mode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist, isInWishlist } =
    useWishlist();

  // State
  const [products, setProducts] = useState(dummyProducts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    gender: null,
    category: null,
    subCategory: null,
    collection: null,
    priceRange: [0, 10000],
    sort: "newest",
    size: null,
    color: null,
    fit: null,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [activeChip, setActiveChip] = useState("all");
  // Add a loading skeleton state for demo
  const [showLoading, setShowLoading] = useState(false);

  // Filter options
  const categories = {
    // 'Shop All': [],
    MEN: {
      "T-shirts": ["Regular", "Oversized", "Graphic T-shirts", "Embroidery"],
      Shirts: ["Casual wear", "Formal wear"],
      "Bottom Wear": ["Jeans", "Cargo Pants", "Chinos"],
    },
    WOMEN: {
      "T-shirts": ["Regular", "Oversized", "Graphic T-shirts", "Embroidery"],
    },
  };

  // 1. Extract unique collections from product data
  // const uniqueCollections = Array.from(new Set(dummyProducts.map(p => p.collection).filter(Boolean)));

  // 2. Fix typos in collection names in both filter and product data
  // (Assume all product data is now correct, e.g., 'Beaten Exclusive Collection', 'Beaten Launch Sale Vol 1', 'Beaten Signature Collection', 'New Arrivals', 'Best Sellers', 'Summer Collection', 'Winter Collection')
  // If needed, update product data here (for brevity, not shown, but you would update any typos in the dummyProducts array)

  // 3. Update collections filter to use uniqueCollections
  // Replace:
  // const collections = [ ... ];
  // With:
  const collections = [
    "Beaten Exclusive Collection",
    "Beaten Launch Sale Vol 1",
    "Beaten Signature Collection",
  ];

  // Filter and sort products
  const filteredAndSortedProducts = React.useMemo(() => {
    let result = [...dummyProducts];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
      );
    }

    // Apply gender filter
    if (filters.gender) {
      result = result.filter(
        (product) => product.gender && product.gender === filters.gender
      );
    }

    // Apply category filter
    if (filters.category && filters.category !== "Shop All") {
      result = result.filter(
        (product) => product.category && product.category === filters.category
      );
    }

    // Apply subcategory filter
    if (filters.subCategory) {
      result = result.filter(
        (product) =>
          product.subCategory && product.subCategory === filters.subCategory
      );
    }

    // Apply collection filter
    if (filters.collection) {
      result = result.filter(
        (product) =>
          product.collection && product.collection === filters.collection
      );
    }

    // Apply price range filter
    result = result.filter(
      (product) =>
        product.price >= filters.priceRange[0] &&
        product.price <= filters.priceRange[1]
    );

    // Size filter
    if (filters.size) {
      result = result.filter((product) =>
        product.sizes ? product.sizes.includes(filters.size) : true
      );
    }

    // Color filter
    if (filters.color) {
      result = result.filter(
        (product) => product.colors && product.colors.includes(filters.color)
      );
    }

    // Fit filter
    if (filters.fit) {
      result = result.filter(
        (product) => product.subCategory && product.subCategory === filters.fit
      );
    }

    // Apply sorting
    switch (filters.sort) {
      case "price_asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        result.sort((a, b) => b._id - a._id);
        break;
      case "popular":
        // Keep original order
        break;
      default:
        break;
    }

    return result;
  }, [searchQuery, filters]);

  // Handlers
  const handleFilterChange = (filter, value) => {
    setFilters((prev) => {
      const newFilters = {
        gender: null,
        category: null,
        subCategory: null,
        collection: null,
        priceRange: prev.priceRange, // keep priceRange
        sort: prev.sort, // keep sort
        size: null,
        color: null,
        fit: null,
      };
      newFilters[filter] = value;
      return newFilters;
    });
    setPage(1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product._id, 1);
    } catch (err) {
      console.error("Error adding to cart:", err);
      // setError('Failed to add product to cart');
    }
  };

  const handleWishlistToggle = (productId) => {
    try {
      const productToToggle = products.find((p) => p._id === productId);
      if (!productToToggle) {
        console.error("Product not found:", productId);
        return;
      }

      if (isInWishlist(productId)) {
        removeFromWishlist(productId);
      } else {
        const productToAdd = {
          _id: productToToggle._id,
          name: productToToggle.name,
          price: productToToggle.price,
          image: productToToggle.image,
          description: productToToggle.description,
          category: productToToggle.category,
          subCategory: productToToggle.subCategory,
          collection: productToToggle.collection,
          colors: productToToggle.colors,
          gender: productToToggle.gender,
        };
        addToWishlist(productToAdd);
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Filter options
  const genderOptions = ["Men", "Women"];

  const filterBody = (
    <>
      {/* Gender */}
      <Accordion
        defaultExpanded
        elevation={0}
        square
        sx={{
          borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
          "&:before": { display: "none" },
        }}
      >
        <AccordionSummary
          expandIcon={<FilterIcon fontSize="small" />}
          aria-controls="gender-panel-content"
          id="gender-panel-header"
        >
          <Typography sx={{ fontWeight: 500, fontSize: "0.9rem" }}>
            Gender {filters.gender ? "(1)" : "(0)"}
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0, pb: 2 }}>
          <RadioGroup
            value={filters.gender || ""}
            onChange={(e) => handleFilterChange("gender", e.target.value)}
          >
            {genderOptions.map((gender) => (
              <FormControlLabel
                key={gender}
                value={gender}
                control={<Radio size="small" />}
                label={gender}
                sx={{
                  "& .MuiFormControlLabel-label": {
                    fontSize: "0.875rem",
                    color: "text.secondary",
                  },
                }}
              />
            ))}
          </RadioGroup>
        </AccordionDetails>
      </Accordion>

      {/* Categories */}
      <Accordion
        defaultExpanded
        elevation={0}
        square
        sx={{
          borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
          "&:before": { display: "none" },
        }}
      >
        <AccordionSummary
          expandIcon={<FilterIcon fontSize="small" />}
          aria-controls="category-panel-content"
          id="category-panel-header"
        >
          <Typography sx={{ fontWeight: 500, fontSize: "0.9rem" }}>
            Categories {filters.category ? "(1)" : "(0)"}
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0, pb: 2 }}>
          <RadioGroup
            value={filters.category || ""}
            onChange={(e) => handleFilterChange("category", e.target.value)}
          >
            {/* Shop All */}
            <FormControlLabel
              value="Shop All"
              control={<Radio size="small" />}
              label="Shop All"
              sx={{
                "& .MuiFormControlLabel-label": {
                  fontSize: "0.875rem",
                  color: "text.secondary",
                },
              }}
            />
            {/* MEN Section */}
            <Box sx={{ mt: 1 }}>
              <Typography
                sx={{
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "text.primary",
                  mb: 1,
                }}
              >
                MEN
              </Typography>
              {Object.keys(categories["MEN"]).map((mainCat) => (
                <FormControlLabel
                  key={mainCat}
                  value={mainCat}
                  control={<Radio size="small" />}
                  label={mainCat}
                  sx={{
                    ml: 2,
                    "& .MuiFormControlLabel-label": {
                      fontSize: "0.875rem",
                      color: "text.secondary",
                    },
                  }}
                />
              ))}
            </Box>
            {/* WOMEN Section */}
            <Box sx={{ mt: 2 }}>
              <Typography
                sx={{
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "text.primary",
                  mb: 1,
                }}
              >
                WOMEN
              </Typography>
              {Object.keys(categories["WOMEN"]).map((mainCat) => (
                <FormControlLabel
                  key={mainCat}
                  value={mainCat}
                  control={<Radio size="small" />}
                  label={mainCat}
                  sx={{
                    ml: 2,
                    "& .MuiFormControlLabel-label": {
                      fontSize: "0.875rem",
                      color: "text.secondary",
                    },
                  }}
                />
              ))}
            </Box>
          </RadioGroup>
          {/* SubCategory */}
          <Divider sx={{ my: 1 }} />
          <Typography sx={{ fontWeight: 500, fontSize: "0.9rem", mb: 1 }}>
            Subcategory {filters.subCategory ? "(1)" : "(0)"}
          </Typography>
          <RadioGroup
            value={filters.subCategory || ""}
            onChange={(e) => handleFilterChange("subCategory", e.target.value)}
          >
            {Object.values(categories["MEN"])
              .flat()
              .map((subCat) => (
                <FormControlLabel
                  key={subCat}
                  value={subCat}
                  control={<Radio size="small" />}
                  label={subCat}
                  sx={{
                    ml: 2,
                    "& .MuiFormControlLabel-label": {
                      fontSize: "0.875rem",
                      color: "text.secondary",
                    },
                  }}
                />
              ))}
            {Object.values(categories["WOMEN"])
              .flat()
              .map((subCat) => (
                <FormControlLabel
                  key={subCat}
                  value={subCat}
                  control={<Radio size="small" />}
                  label={subCat}
                  sx={{
                    ml: 2,
                    "& .MuiFormControlLabel-label": {
                      fontSize: "0.875rem",
                      color: "text.secondary",
                    },
                  }}
                />
              ))}
          </RadioGroup>
        </AccordionDetails>
      </Accordion>

      {/* Collections */}
      <Accordion
        defaultExpanded
        elevation={0}
        square
        sx={{
          borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
          "&:before": { display: "none" },
        }}
      >
        <AccordionSummary
          expandIcon={<FilterIcon fontSize="small" />}
          aria-controls="collection-panel-content"
          id="collection-panel-header"
        >
          <Typography sx={{ fontWeight: 500, fontSize: "0.9rem" }}>
            Collections {filters.collection ? "(1)" : "(0)"}
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0, pb: 2 }}>
          <RadioGroup
            value={filters.collection || ""}
            onChange={(e) => handleFilterChange("collection", e.target.value)}
          >
            {collections.map((collection) => (
              <FormControlLabel
                key={collection}
                value={collection}
                control={<Radio size="small" />}
                label={collection}
                sx={{
                  "& .MuiFormControlLabel-label": {
                    fontSize: "0.875rem",
                    color: "text.secondary",
                  },
                }}
              />
            ))}
          </RadioGroup>
        </AccordionDetails>
      </Accordion>

      {/* Price Range */}
      <Accordion
        defaultExpanded
        elevation={0}
        square
        sx={{
          borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
          "&:before": { display: "none" },
        }}
      >
        <AccordionSummary
          expandIcon={<FilterIcon fontSize="small" />}
          aria-controls="price-panel-content"
          id="price-panel-header"
        >
          <Typography sx={{ fontWeight: 500, fontSize: "0.9rem" }}>
            Price Range
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0, pb: 2 }}>
          <Slider
            value={filters.priceRange}
            onChange={(e, newValue) =>
              handleFilterChange("priceRange", newValue)
            }
            valueLabelDisplay="auto"
            min={0}
            max={10000}
            step={500}
            valueLabelFormat={(value) => `₹${value}`}
            sx={{
              "& .MuiSlider-thumb": {
                width: 12,
                height: 12,
              },
            }}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
            <Typography
              variant="body2"
              sx={{ fontSize: "0.875rem", color: "text.secondary" }}
            >
              ₹{filters.priceRange[0]}
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontSize: "0.875rem", color: "text.secondary" }}
            >
              ₹{filters.priceRange[1]}
            </Typography>
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Size */}
      <Accordion
        defaultExpanded
        elevation={0}
        square
        sx={{
          borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
          "&:before": { display: "none" },
        }}
      >
        <AccordionSummary
          expandIcon={<FilterIcon fontSize="small" />}
          aria-controls="size-panel-content"
          id="size-panel-header"
        >
          <Typography sx={{ fontWeight: 500, fontSize: "0.9rem" }}>
            Size {filters.size ? "(1)" : "(0)"}
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0, pb: 2 }}>
          <RadioGroup
            row
            value={filters.size || ""}
            onChange={(e) => handleFilterChange("size", e.target.value)}
          >
            {sizeOptions.map((size) => (
              <FormControlLabel
                key={size}
                value={size}
                control={<Radio size="small" />}
                label={size}
                sx={{
                  "& .MuiFormControlLabel-label": {
                    fontSize: "0.875rem",
                    color: "text.secondary",
                  },
                }}
              />
            ))}
          </RadioGroup>
        </AccordionDetails>
      </Accordion>
      {/* Fit */}
      <Accordion
        defaultExpanded
        elevation={0}
        square
        sx={{
          borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
          "&:before": { display: "none" },
        }}
      >
        <AccordionSummary
          expandIcon={<FilterIcon fontSize="small" />}
          aria-controls="fit-panel-content"
          id="fit-panel-header"
        >
          <Typography sx={{ fontWeight: 500, fontSize: "0.9rem" }}>
            Fit {filters.fit ? "(1)" : "(0)"}
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0, pb: 2 }}>
          <RadioGroup
            row
            value={filters.fit || ""}
            onChange={(e) => handleFilterChange("fit", e.target.value)}
          >
            {fitOptions.map((fit) => (
              <FormControlLabel
                key={fit}
                value={fit}
                control={<Radio size="small" />}
                label={fit}
                sx={{
                  "& .MuiFormControlLabel-label": {
                    fontSize: "0.875rem",
                    color: "text.secondary",
                  },
                }}
              />
            ))}
          </RadioGroup>
        </AccordionDetails>
      </Accordion>
    </>
  );

  // Mobile sticky header
  const mobileHeader = (
    <Box
      sx={{
        display: { xs: "flex", md: "none" },
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 1201,
        bgcolor: "background.paper",
        px: 2,
        py: 1.5,
        borderBottom: "1px solid #eee",
        boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
      }}
    >
      {/* Grid view icon on left */}
      <IconButton
        onClick={() => setViewMode("grid")}
        color={viewMode === "grid" ? "primary" : "default"}
      >
        <ViewModuleIcon />
      </IconButton>
      {/* Search icon in center */}
      <IconButton>
        <SearchIcon />
      </IconButton>
      {/* Filter icon on right */}
      <IconButton onClick={() => setDrawerOpen(true)}>
        <FilterIcon />
      </IconButton>
    </Box>
  );

  // For mobile chips, use only subcategories for category chips (not 'MEN'/'WOMEN')
  const subCategoryOptions = [
    ...Object.values(categories["MEN"] || {}).flat(),
    ...Object.values(categories["WOMEN"] || {}).flat(),
  ];

  const chipSet = new Set();
  const uniqueChips = [
    ...genderOptions.map((option) => ({
      label: option,
      filterKey: "gender",
      value: option,
    })),
    ...collections.map((collection) => ({
      label: collection,
      filterKey: "collection",
      value: collection,
    })),
    ...fitOptions.map((fit) => ({
      label: fit,
      filterKey: "fit",
      value: fit,
    })),
  ];

  const mobileChips = (
    <Box
      sx={{
        display: { xs: "flex", md: "none" },
        overflowX: "auto",
        gap: 0,
        px: 0,
        py: { xs: 1.5, md: 0.5 },
        bgcolor: "background.paper",
        borderBottom: "none",
        position: "sticky",
        top: 48,
        left: 0,
        width: "100%",
        zIndex: 1200,
        mt: 0,
        borderTop: "none",
        boxShadow: "none",
        mb: 0,
        pb: 0,
        "&::-webkit-scrollbar": {
          display: "none",
        },
        msOverflowStyle: "none",
        scrollbarWidth: "none",
      }}
    >
      {uniqueChips.map((chip) => (
        <Chip
          key={chip.filterKey + "-" + chip.value}
          label={chip.label}
          clickable
          onClick={() => {
            const isActive = filters[chip.filterKey] === chip.value;
            handleFilterChange(chip.filterKey, isActive ? null : chip.value);
          }}
          sx={{
            height: 32,
            borderRadius: 0,
            bgcolor:
              filters[chip.filterKey] === chip.value
                ? "primary.main"
                : "background.paper",
            color:
              filters[chip.filterKey] === chip.value ? "white" : "text.primary",
            border: "1px solid",
            borderColor:
              filters[chip.filterKey] === chip.value
                ? "primary.main"
                : "rgba(0, 0, 0, 0.12)",
            mx: 0,
            px: 0,
            "&:hover": {
              bgcolor:
                filters[chip.filterKey] === chip.value
                  ? "primary.dark"
                  : "rgba(0, 0, 0, 0.04)",
            },
            "& .MuiChip-label": {
              px: 1.2,
              fontWeight: 500,
              fontSize: "0.875rem",
            },
          }}
        />
      ))}
    </Box>
  );

  useEffect(() => {
    setShowLoading(true);
    const timer = setTimeout(() => setShowLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Add a floating filter button for mobile view
  const mobileFilterFab = (
    <Box
      sx={{
        display: { xs: "flex", md: "none" },
        position: "fixed",
        bottom: 80, // Move up to avoid covering bottom nav
        right: 20,
        zIndex: 1300,
        pointerEvents: "auto",
      }}
    >
      <IconButton
        size="large"
        color="primary"
        sx={{
          bgcolor: "primary.main",
          color: "white",
          boxShadow: 4,
          width: 44, // Decrease size
          height: 44, // Decrease size
          borderRadius: "50%",
          "&:hover": { bgcolor: "primary.dark" },
          fontSize: 24, // Decrease icon size
        }}
        onClick={() => setDrawerOpen(true)}
        aria-label="Open filters"
      >
        <FilterIcon fontSize="inherit" />
      </IconButton>
    </Box>
  );

  // Set collection filter from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const collectionParam = params.get("collection");
    if (collectionParam) {
      setFilters((prev) => ({
        ...prev,
        collection: collectionParam,
      }));
    }
  }, [location.search]);

  return (
    <Box
      sx={{
        bgcolor: mode === "dark" ? "#181818" : "#fff",
        color: mode === "dark" ? "#fff" : "inherit",
        minHeight: "100vh",
        width: "100%",
        transition: "background 0.3s, color 0.3s",
      }}
    >
      {/* Mobile Search Bar below navbar */}
      {isMobile && (
        <Box
          sx={{
            position: "sticky",
            top: { xs: "44px", sm: "44px" }, // match mobile navbar height
            zIndex: 1202,
            bgcolor: mode === "dark" ? "#181818" : "#fff",
            px: 2,
            py: 1,
            borderBottom: "1px solid #eee",
          }}
        >
          <HeroSearchBar colorMode={mode} />
        </Box>
      )}
      <Container maxWidth="xl" sx={{ py: 0, px: { xs: 0, md: 3 } }}>
        {/* Mobile custom header and chips */}
        {isMobile && <>{mobileChips}</>}
        <Grid container spacing={{ xs: 0, md: 3 }} sx={{ mt: 0, pt: 0 }}>
          {/* Restore desktop sidebar filter */}
          <Grid
            item
            xs={12}
            md={2.5}
            sx={{ display: { xs: "none", md: "block" } }}
          >
            <Paper
              sx={{
                p: 2,
                display: { xs: "none", md: "block" },
                position: "sticky",
                top: "100px",
                maxHeight: "calc(100vh - 100px)",
                overflowY: "auto",
              }}
            >
              {filterBody}
            </Paper>
          </Grid>

          {/* Products Grid */}
          <Grid item xs={12} md={9.5} sx={{ pt: 0, mt: 0 }}>
            {/* Products Grid/List */}
            <Grid container spacing={0}>
              {showLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <Grid item xs={6} sm={6} md={3} key={i}>
                    <Card
                      sx={{
                        borderRadius: 0,
                        boxShadow: 2,
                        minHeight: 320,
                        p: 0,
                      }}
                    >
                      <Skeleton
                        variant="rectangular"
                        sx={{ borderRadius: 0, height: { xs: 320, md: 480 } }}
                      />
                      <Box sx={{ p: 1 }}>
                        <Skeleton width="80%" />
                        <Skeleton width="60%" />
                        <Skeleton width="40%" />
                      </Box>
                    </Card>
                  </Grid>
                ))
              ) : filteredAndSortedProducts.length === 0 ? (
                <Grid item xs={12}>
                  <Box sx={{ textAlign: "center", py: 4 }}>
                    <Typography variant="h6" color="text.secondary">
                      No products found matching your criteria
                    </Typography>
                  </Box>
                </Grid>
              ) : (
                filteredAndSortedProducts.map((product, index) => (
                  <Grid
                    item
                    key={product._id}
                    xs={6}
                    sm={6}
                    md={viewMode === "grid" ? 3 : 12}
                  >
                    <Fade in timeout={400 + index * 60}>
                      <Card
                        elevation={0}
                        sx={{
                          height: "100%",
                          display: "flex",
                          flexDirection: viewMode === "grid" ? "column" : "row",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          position: "relative",
                          overflow: "hidden",
                          borderRadius: 0,
                          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                          minHeight: 320,
                          bgcolor: "background.paper",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                            "& .MuiCardMedia-root": {
                              transform: "scale(1.03)",
                            },
                          },
                        }}
                        onClick={() => handleProductClick(product._id)}
                      >
                        <CardActionArea
                          component="div"
                          sx={{
                            display: "flex",
                            flexDirection:
                              viewMode === "grid" ? "column" : "row",
                            alignItems: "stretch",
                          }}
                        >
                          <Box
                            sx={{
                              position: "relative",
                              width: "100%",
                              overflow: "hidden",
                            }}
                          >
                            <CardMedia
                              component="img"
                              sx={{
                                height: { xs: 320, md: 480 },
                                width: "100%",
                                objectFit: "cover",
                                borderRadius: 0,
                                background: "#f5f5f5",
                                transition: "transform 0.4s ease",
                              }}
                              image={product.image}
                              alt={product.name}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = FALLBACK_IMAGE;
                              }}
                            />
                            {/* Wishlist Button */}
                            <Fade in>
                              <IconButton
                                aria-label="add to wishlist"
                                size="small"
                                sx={{
                                  position: "absolute",
                                  top: 8,
                                  right: 8,
                                  bgcolor: "rgba(255, 255, 255, 0.95)",
                                  borderRadius: "50%",
                                  boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                                  width: 30,
                                  height: 30,
                                  transition: "all 0.2s ease",
                                  "&:hover": {
                                    bgcolor: "#fff",
                                    transform: "scale(1.05)",
                                    boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
                                  },
                                  zIndex: 1,
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleWishlistToggle(product._id);
                                }}
                              >
                                {isInWishlist(product._id) ? (
                                  <FavoriteIcon
                                    sx={{
                                      color: "#ff1744",
                                      fontSize: 18,
                                      transition: "all 0.2s ease",
                                    }}
                                  />
                                ) : (
                                  <FavoriteBorderIcon
                                    sx={{
                                      color: "rgba(0, 0, 0, 0.4)",
                                      fontSize: 18,
                                      transition: "all 0.2s ease",
                                    }}
                                  />
                                )}
                              </IconButton>
                            </Fade>
                          </Box>
                          <Box
                            sx={{
                              flex: 1,
                              p: 1.2,
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                              minHeight: 80,
                            }}
                          >
                            <Typography
                              gutterBottom
                              variant="subtitle1"
                              component="div"
                              sx={{
                                fontWeight: 500,
                                fontSize: "0.95rem",
                                mb: 0.5,
                                lineHeight: 1.2,
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                color: "text.primary",
                                transition: "color 0.2s ease",
                                "&:hover": {
                                  color: "primary.main",
                                },
                              }}
                            >
                              {product.name}
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                mb: 0.5,
                              }}
                            >
                              <Typography
                                variant="body2"
                                color="text.primary"
                                sx={{
                                  fontWeight: 600,
                                  fontSize: "1rem",
                                }}
                              >
                                {formatPrice(product.price)}
                              </Typography>
                              {product.discount && (
                                <Typography
                                  variant="body2"
                                  color="error"
                                  sx={{
                                    fontWeight: 500,
                                    ml: 1,
                                    fontSize: "0.9rem",
                                  }}
                                >
                                  {product.discount}% OFF
                                </Typography>
                              )}
                            </Box>
                            {/* Color swatches */}
                            {product.colors && product.colors.length > 0 && (
                              <Box
                                sx={{
                                  display: "flex",
                                  gap: 0.5,
                                  mt: 0.5,
                                }}
                              >
                                {product.colors.slice(0, 3).map((color) => (
                                  <Tooltip key={color} title={color} arrow>
                                    <Box
                                      sx={{
                                        width: 14,
                                        height: 14,
                                        borderRadius: "50%",
                                        bgcolor: color
                                          .toLowerCase()
                                          .replace(" ", ""),
                                        border: "1px solid #ddd",
                                        mr: 0.5,
                                        transition: "all 0.2s ease",
                                        "&:hover": {
                                          transform: "scale(1.1)",
                                          borderColor: "#999",
                                        },
                                      }}
                                    />
                                  </Tooltip>
                                ))}
                                {product.colors.length > 3 && (
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      ml: 0.5,
                                      color: "text.secondary",
                                      fontSize: "0.75rem",
                                    }}
                                  >
                                    +{product.colors.length - 3}
                                  </Typography>
                                )}
                              </Box>
                            )}
                          </Box>
                        </CardActionArea>
                      </Card>
                    </Fade>
                  </Grid>
                ))
              )}
            </Grid>
          </Grid>
        </Grid>

        {/* Mobile Filter Drawer */}
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          variant="temporary"
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              width: "100%",
              maxWidth: 320,
              boxSizing: "border-box",
              bgcolor: "background.paper",
              borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
              top: 80,
              height: "calc(100vh - 80px)",
            },
          }}
          PaperProps={{
            sx: {
              position: "fixed",
              top: 80,
              right: 0,
              height: "calc(100vh - 80px)",
              overflow: "hidden",
            },
          }}
        >
          <Box
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Drawer Header */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 2,
                borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                position: "sticky",
                top: 0,
                bgcolor: "background.paper",
                zIndex: 1,
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontSize: "1.1rem", fontWeight: 600 }}
              >
                Filters
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <Select
                    value={filters.sort}
                    onChange={(e) => handleFilterChange("sort", e.target.value)}
                    displayEmpty
                    sx={{ fontSize: "0.875rem" }}
                  >
                    <MenuItem value="newest">Newest</MenuItem>
                    <MenuItem value="price_asc">Price: Low to High</MenuItem>
                    <MenuItem value="price_desc">Price: High to Low</MenuItem>
                    <MenuItem value="popular">Most Popular</MenuItem>
                  </Select>
                </FormControl>
                <IconButton onClick={() => setDrawerOpen(false)} size="small">
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>

            {/* Filter Content */}
            <Box
              sx={{
                flex: 1,
                overflowY: "auto",
              }}
            >
              {filterBody}
            </Box>

            {/* Filter Footer */}
            <Box
              sx={{
                p: 2,
                borderTop: "1px solid rgba(0, 0, 0, 0.1)",
                bgcolor: "background.paper",
                position: "sticky",
                bottom: 0,
                pb: { xs: 9, md: 2 },
              }}
            >
              <Button
                fullWidth
                variant="contained"
                onClick={() => setDrawerOpen(false)}
                endIcon={<FilterIcon />}
                sx={{
                  py: 1.5,
                  fontWeight: 600,
                  fontSize: "1rem",
                  backgroundColor: "#1a1a1a",
                  color: "white",
                  borderRadius: "10px",
                  "&:hover": {
                    backgroundColor: "#2d2d2d",
                  },
                }}
              >
                Apply Filters
              </Button>
            </Box>
          </Box>
        </Drawer>
      </Container>
      {isMobile && !drawerOpen && mobileFilterFab}
    </Box>
  );
};

export default Products;
