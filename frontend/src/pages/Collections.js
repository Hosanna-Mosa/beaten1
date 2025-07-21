import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Button,
  useTheme,
  useMediaQuery,
  Paper,
} from "@mui/material";
import { ArrowForward as ArrowForwardIcon } from "@mui/icons-material";
import { axiosInstance, API_ENDPOINTS } from "../utils/api";

const collectionNames = [
  
  "Tshirts",
  "Shirts",
  
  "Oversized T-shirts",
  "Bottom Wear",
  "Cargo Pants",
  "Jackets",
  "Hoodies",
  "Co-Ord Sets",
];

// Add a royalty-free human PNG image URL
const humanPng =
  "https://pngimg.com/uploads/businessman/businessman_PNG6567.png"; // Example PNG with transparency

const placeholderImg = "https://via.placeholder.com/300x150?text=No+Image";

const Collections = ({ mode = 'light' }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCollections = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get(
          API_ENDPOINTS.COLLECTION_IMAGES("main")
        );
        const images = res.data.collectionsImages || [];
        // Always create 10 cards, use placeholder if image is missing
        const mapped = collectionNames.map((name, idx) => ({
          id: name.toLowerCase().replace(/\s+/g, "-"),
          name,
          image: images[idx] || placeholderImg,
        }));
        setCollections(mapped);
      } catch (err) {
        setError("Failed to load collections");
      } finally {
        setLoading(false);
      }
    };
    fetchCollections();
  }, []);

  return (
    <Container
      maxWidth="xl"
      sx={{
        py: { xs: 3, md: 8 },
        px: { xs: 2, md: 3 },
      }}
    >
      {/* Hero Section */}

      <Box sx={{ mb: { xs: 4, md: 8 } }}>
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "2rem", sm: "2.5rem", md: "3.5rem" },
            fontWeight: 700,
            textAlign: "center",
            mb: { xs: 1.5, md: 2 },
            letterSpacing: { xs: "-0.02em", md: "-0.03em" },
          }}
        >
          Our Collections
        </Typography>
        <Typography
          variant="h5"
          color="text.secondary"
          sx={{
            textAlign: "center",
            maxWidth: "800px",
            mx: "auto",
            mb: { xs: 3, md: 4 },
            fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" },
            px: { xs: 2, md: 0 },
          }}
        >
          Discover our carefully curated collections, each telling its own
          unique story
        </Typography>
      </Box>
      {loading ? (
        <Typography align="center">Loading collections...</Typography>
      ) : error ? (
        <Typography color="error" align="center">
          {error}
        </Typography>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {collections.map((collection, index) => (
            <Card

              sx={{
                position: "relative",
                overflow: "hidden",
                borderRadius: { xs: "0px", md: "0px" },
                height: { xs: "110px", sm: "130px", md: "150px" },
                p: 0,
                background: "linear-gradient(90deg, #111 60%, #444 100%)",
              }}
            >
              <CardActionArea
                onClick={() => navigate(`/collections/${collection.id}`)}
                sx={{
                  height: "100%",
                  p: 0,
                  position: "relative",
                  zIndex: 2,
                }}
              >
                {/* Collection image as background */}
                <Box
                  component="img"
                  src={collection.image}
                  alt={collection.name}
                  sx={{

                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    zIndex: 1,
                    opacity: 0.7,
                  }}
                />
                {/* Human PNG overlay, always right */}
                {/* <Box
                  component="img"
                  src={humanPng}
                  alt="Human"
                  sx={{
                    position: "absolute",
                    top: "50%",
                    right: 0,
                    left: "auto",
                    transform: "translateY(-50%)",
                    height: { xs: 100, sm: 170, md: 200 },
                    zIndex: 3,
                    opacity: 0.92,
                    pointerEvents: "none",
                    filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.25))",
                    userSelect: "none",
                    display: { xs: "block", md: "block" },
                  }}
                /> */}
                {/* Collection name, larger and left-aligned */}
                {/* <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    color: "#222",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    zIndex: 4,
                    textAlign: "left",
                    p: 0,
                    pl: { xs: 2, sm: 4, md: 6 },

                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 800,
                      textShadow: "0 2px 8px rgba(0,0,0,0.45)",
                      fontSize: { xs: "1.35rem", sm: "1.7rem", md: "2.1rem" },
                      lineHeight: 1.1,
                      letterSpacing: "-0.01em",
                      px: 1,
                      color: "#fff",
                      textAlign: "left",
                      maxWidth: { xs: "60%", sm: "60%", md: "60%" },
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {collection.name}
                  </Typography>
                </Box> */}
              </CardActionArea>
            </Card>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default Collections;

