import React, { useState, useEffect } from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Button,
  MenuItem,
  Badge,
  useScrollTrigger,
  Slide,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Avatar,
  Switch,
} from "@mui/material";
import {
  ShoppingCart as CartIcon,
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import HeroSearchBar from "../common/HeroSearchBar";
import { keyframes } from "@mui/system";
import axios from "axios";
import {
  API_ENDPOINTS,
  getApiConfig,
  handleApiResponse,
  handleApiError,
} from "../../utils/api";

const shine = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const pages = [
  { name: "HOME", path: "/" },
  { name: "PRODUCTS", path: "/products" },
  // { name: 'COLLECTIONS', path: '/collections' },
  { name: "BEATEN CLUB", path: "/premium" },
  { name: "ABOUT", path: "/about" },
  { name: "CONTACT", path: "/contact" },
];

const mobilePages = {
  main: [
    { name: "HOME", path: "/" },
    {
      name: "BEATEN EXCLUSIVE",
      path: "/products?collection=Beaten%20Exclusive%20Collection",
    },
    {
      name: "BEATEN SINGNATURE",
      path: "/products?collection=Beaten%20Signature%20Collection",
    },
    { name: "BEATEN CLUB", path: "/premium" },
  ],
  account: [
    { name: "MY ACCOUNT", path: "/profile" },
    { name: "MY ORDERS", path: "/orders" },
    { name: "WISHLIST", path: "/wishlist" },
    { name: "RETURN / EXCHANGE", path: "/returns" },
  ],
  support: [
    { name: "ABOUT", path: "/about" },
    { name: "CONTACT", path: "/contact" },
    { name: "NOTIFICATIONS", path: "/notifications" },
  ],
};

// Hide on scroll down, show on scroll up
function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger({
    threshold: 100,
    disableHysteresis: true,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Header = ({ mode, toggleColorMode }) => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { getCartCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { user, logout } = useAuth();
  // Determine if user is premium
  const isPremium =
    user &&
    (user.isPremium ||
      (user.subscription &&
        user.subscription.isSubscribed &&
        (!user.subscription.subscriptionExpiry ||
          new Date(user.subscription.subscriptionExpiry) > new Date())));
  const goldColor = "#FFD700";
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setUnreadCount(0);
        return;
      }
      try {
        const response = await axios(
          getApiConfig(API_ENDPOINTS.USER_NOTIFICATIONS_UNREAD_COUNT)
        );
        const data = handleApiResponse(response);
        setUnreadCount(data.count || 0);
      } catch (err) {
        setUnreadCount(0);
      }
    };
    fetchUnreadCount();
  }, []);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
    window.scrollTo(0, 0);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDrawerClose = () => {
    setMobileOpen(false);
    window.scrollTo(0, 0);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = () => {
    logout();
    handleUserMenuClose();
    navigate("/");
  };

  const handleNavigate = (path) => {
    navigate(path);
    handleMobileMenuClose();
  };

  const handleProfileMenuOpen = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileAnchorEl(null);
  };

  const drawer = (
    <Box
      sx={{
        position: "relative",
        textAlign: "center",
        bgcolor: "black", // ensure background is black
        height: "100%",
        minHeight: "100vh", // ensure it fills the viewport
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
      onClick={handleDrawerClose}
    >
      {/* Close (Cross) Button for Mobile Drawer */}
      <IconButton
        aria-label="close drawer"
        onClick={(e) => {
          e.stopPropagation();
          handleDrawerClose();
        }}
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          color: "white",
          zIndex: 10,
          display: { xs: "flex", md: "none" },
        }}
      >
        <CloseIcon sx={{ fontSize: 32 }} />
      </IconButton>
      <List sx={{ pt: 2 }}>
        {/* Main Navigation */}
        {mobilePages.main.map((page) => (
          <ListItem
            key={page.name}
            component={RouterLink}
            to={page.path}
            onClick={handleDrawerClose}
            sx={{
              color: isPremium ? goldColor : "white",
              paddingTop: 0,

              minHeight: "auto",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            <ListItemText
              primary={
                isPremium ? (
                  <span className="gold-shine">{page.name}</span>
                ) : (
                  <span style={{ color: "white", fontWeight: 600 }}>
                    {page.name}
                  </span>
                )
              }
              sx={{
                textAlign: "left",
                pl: 1,
                "& .MuiListItemText-primary": {
                  fontWeight: location.pathname === page.path ? 600 : 400,
                  letterSpacing: "0.1em",
                  fontSize: "0.95rem",
                },
              }}
            />
          </ListItem>
        ))}

        <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)", my: 1 }} />

        {/* Account Section */}
        <ListItem sx={{ m: 0, p: 0, minHeight: 0 }}>
          <ListItemText
            primary="ACCOUNT"
            sx={{
              textAlign: "left",
              pl: 1,
              //  pt: 0.5,
              pb: 0.5,
              m: 0,
              "& .MuiListItemText-primary": {
                fontSize: "0.7rem",
                letterSpacing: "0.2em",
                color: isPremium ? goldColor : "rgba(255, 255, 255, 0.5)",
                textTransform: "uppercase",
                paddingTop: 0,
                paddingBottom: 0,
                margin: 0,
              },
            }}
          />
        </ListItem>
        {mobilePages.account.map((page) => (
          <ListItem
            key={page.name}
            component={RouterLink}
            to={page.path}
            onClick={handleDrawerClose}
            sx={{
              color: isPremium ? goldColor : "white",
              paddingTop: 0,
              paddingBottom: 0,
              minHeight: "auto",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            <ListItemText
              primary={
                isPremium ? (
                  <span className="gold-shine">{page.name}</span>
                ) : (
                  <span style={{ color: "white", fontWeight: 600 }}>
                    {page.name}
                  </span>
                )
              }
              sx={{
                textAlign: "left",
                pl: 1,
                "& .MuiListItemText-primary": {
                  fontWeight: location.pathname === page.path ? 600 : 400,
                  letterSpacing: "0.1em",
                  fontSize: "0.95rem",
                },
              }}
            />
          </ListItem>
        ))}

        <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)", my: 1 }} />

        {/* Support Section */}
        <ListItem sx={{ m: 0, p: 0, minHeight: 0 }}>
          <ListItemText
            primary="SUPPORT"
            sx={{
              textAlign: "left",
              pl: 1,
              pt: 0.5,
              pb: 0.5,
              m: 0,
              "& .MuiListItemText-primary": {
                fontSize: "0.7rem",
                letterSpacing: "0.2em",
                color: isPremium ? goldColor : "rgba(255, 255, 255, 0.5)",
                textTransform: "uppercase",
                paddingTop: 0,
                paddingBottom: 0,
                margin: 0,
              },
            }}
          />
        </ListItem>
        {mobilePages.support.map((page) => (
          <ListItem
            key={page.name}
            component={RouterLink}
            to={page.path}
            onClick={handleDrawerClose}
            sx={{
              color: isPremium ? goldColor : "white",
              paddingTop: 0,
              //paddingBottom: 0,
              minHeight: "auto",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            <ListItemText
              primary={
                isPremium ? (
                  <span className="gold-shine">{page.name}</span>
                ) : (
                  <span style={{ color: "white", fontWeight: 600 }}>
                    {page.name}
                  </span>
                )
              }
              sx={{
                textAlign: "left",
                pl: 1,
                "& .MuiListItemText-primary": {
                  fontWeight: location.pathname === page.path ? 600 : 400,
                  letterSpacing: "0.1em",
                  fontSize: "0.95rem",
                },
              }}
            />
          </ListItem>
        ))}

        <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)", my: 1 }} />

        {/* Cart Link */}
        <ListItem
          component={RouterLink}
          to="/cart"
          onClick={handleDrawerClose}
          sx={{
            color: isPremium ? goldColor : "white",
            paddingTop: 0,
            // paddingBottom: 0,
            minHeight: "auto",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          <ListItemText
            primary={
              isPremium ? (
                <span className="gold-shine">CART</span>
              ) : (
                <span style={{ color: "white", fontWeight: 600 }}>CART</span>
              )
            }
            sx={{
              textAlign: "left",
              pl: 1,
              "& .MuiListItemText-primary": {
                fontWeight: location.pathname === "/cart" ? 600 : 400,
                letterSpacing: "0.1em",
                fontSize: "0.95rem",
              },
            }}
          />
        </ListItem>

        <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)", my: 1 }} />

        {/* Light/Dark Mode Toggler - Mobile Drawer */}
        <ListItem
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            bgcolor: "black",
            gap: 3,
            paddingTop: 0,
            paddingBottom: 0,
            minHeight: "auto",
            pl: 4, // Left align to match other sidebar items
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <Typography
            variant="body2"
            sx={{
              color: "white",
              fontWeight: 600,
              minWidth: 80,
              textAlign: "left",
              color: isPremium ? goldColor : "white",
            }}
          >
            {mode === "dark" ? "Dark Mode" : "Light Mode"}
          </Typography>
          <Switch
            checked={mode === "dark"}
            onChange={toggleColorMode}
            color="default"
            inputProps={{ "aria-label": "toggle dark mode" }}
          />
          {user && (
            <Button
              onClick={handleLogout}
              sx={{
                ml: 1,
                color: isPremium ? goldColor : "white",
                border: `1px solid ${isPremium ? goldColor : "white"}`,
                borderRadius: 2,
                px: 2,
                fontWeight: 600,
                fontSize: "0.95rem",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                background: "transparent",
                '&:hover': {
                  backgroundColor: "rgba(255,255,255,0.08)",
                },
                minHeight: "32px",
                height: "32px",
              }}
            >
              Logout
            </Button>
          )}
        </ListItem>
      </List>
    </Box>
  );

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: "black",
        backdropFilter: "blur(10px)",
        boxShadow: "none",
        borderBottom: "none",
        transition: "all 0.3s ease-in-out",
        zIndex: 9999,
        top: 0,
        height: { xs: "44px", md: "64px" },
        width: { xs: "100vw", md: "auto" },
        left: 0,
        p: { xs: 0, md: undefined }, // Remove AppBar padding on mobile
        m: { xs: 0, md: undefined }, // Remove AppBar margin on mobile
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          px: { xs: 0, md: 2 },
          width: { xs: "100vw", md: "100%" },
          minWidth: { xs: "100vw", md: "0" },
          m: { xs: 0, md: undefined }, // Remove Container margin on mobile
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            minHeight: { xs: "44px", md: "64px" },
            px: { xs: 0, md: 2 },
            py: { xs: 0, md: undefined }, // Remove vertical padding on mobile
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            position: "relative",
          }}
        >
          {/* Mobile Menu Button */}
          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              alignItems: "center",
              flex: "0 0 auto",
              zIndex: 2,
              pl: { xs: 0, md: 0 },
              ml: { xs: 0, md: 0 },
            }}
          >
            <IconButton
              size="large"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              color="inherit"
              sx={{ mr: 0, ml: 0, p: "8px", pl: 0, pr: 0 }} // Remove all side padding
            >
              <MenuIcon />
            </IconButton>
          </Box>

          {/* Logo - Mobile (centered absolutely) */}
          <Box
            sx={{
              position: { xs: "absolute", md: "static" },
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              display: { xs: "flex", md: "none" },
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
              zIndex: 1,
              height: "100%",
            }}
          >
            <Typography
              variant="h6"
              noWrap
              component={RouterLink}
              to="/"
              sx={{
                fontWeight: 700,
                color: "white",
                textDecoration: "none",
                letterSpacing: "0.2em",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                pointerEvents: "auto",
              }}
            >
              <img
                src={isPremium ? "/Beaten/Artboard-6.png" : "/Beaten/logo.png"}
                alt="Beaten Logo"
                style={{
                  width: "6em",
                  height: "auto",
                  padding: 0,
                  margin: 0,
                  display: "block",
                  ...(isPremium && {
                    filter: "drop-shadow(0 0 8px #FFD700) brightness(1.2)",
                  }),
                }}
              />
            </Typography>
          </Box>

          {/* Logo - Desktop */}
          <Typography
            variant="h5"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontWeight: 700,
              color: "white",
              textDecoration: "none",
              letterSpacing: "0.2em",
              fontSize: "1.5rem",
            }}
          >
            <img
              src={isPremium ? "/Beaten/Artboard-6.png" : "/Beaten/logo.png"}
              alt="Beaten Logo"
              style={{ width: "6em", height: "auto", padding: 0, margin: 0 }}
            />
          </Typography>

          {/* Desktop Menu */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              justifyContent: "center",
            }}
          >
            {pages.map((page) => (
              <Button
                key={page.name}
                component={RouterLink}
                to={page.path}
                onClick={handleCloseNavMenu}
                sx={{
                  my: 2,
                  color: "white", // keep button/icon color default
                  display: "block",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  fontSize: "1.08rem",
                  px: 2.5,
                  borderRadius: 2,
                  transition: "color 0.2s, background 0.2s",
                  backgroundColor: "transparent",
                  ...(location.pathname === page.path && {
                    textShadow: isPremium
                      ? `0 0 8px ${goldColor}99`
                      : undefined,
                  }),
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.08)",
                  },
                }}
              >
                <span
                  style={
                    isPremium
                      ? {
                          color: goldColor,
                          fontWeight: 600,
                          background: `linear-gradient(90deg, #FFD700 20%, #FFFBEA 50%, #FFD700 80%)`,
                          backgroundSize: "200% auto",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          animation: "shine 2.5s linear infinite",
                        }
                      : { color: "white", fontWeight: 600 }
                  }
                  className={isPremium ? "gold-shine" : ""}
                >
                  {page.name}
                </span>
              </Button>
            ))}
          </Box>

          {/* Right Icons - Desktop & Mobile (always far right) */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0, // Reduce gap for all screen sizes
              ml: "auto",
              flexShrink: 0,
              pr: { xs: 0, md: 0 },
              position: "relative",
              zIndex: 2,
            }}
          >
            {/* Wishlist Icon - only show on md and up */}
            <IconButton
              color="inherit"
              onClick={() => navigate("/wishlist")}
              sx={{ p: 1, display: { xs: "none", md: "flex" } }}
            >
              <FavoriteBorderIcon sx={{ fontSize: 26 }} />
            </IconButton>
            {/* Cart Icon - always show */}
            <IconButton
              color="inherit"
              onClick={() => navigate("/cart")}
              sx={{ p: 1 }}
            >
              <Badge badgeContent={getCartCount()} color="error">
                <CartIcon sx={{ fontSize: 26 }} />
              </Badge>
            </IconButton>

            {/* Notifications Icon - show on all screen sizes */}
            {user && (
              <IconButton
                color="inherit"
                onClick={() => navigate("/notifications")}
                sx={{ p: 1, mr: { xs: 0, md: 0 }, pr: { xs: 0, md: 0 } }} // Remove right padding on mobile
              >
                <Badge badgeContent={unreadCount} color="error">
                  <NotificationsIcon sx={{ fontSize: 26 }} />
                </Badge>
              </IconButton>
            )}

            {/* Dark/Light Mode Toggle - Desktop Only */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                mx: 1,
              }}
            >
              <IconButton onClick={toggleColorMode} color="inherit">
                {mode === "light" ? (
                  <Brightness4Icon sx={{ color: "#ffd600" }} />
                ) : (
                  <Brightness7Icon sx={{ color: "#ffd600" }} />
                )}
              </IconButton>
            </Box>
            {/* Profile Icon - only show on md and up */}
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <IconButton
                onClick={handleProfileMenuOpen}
                color="inherit"
                sx={{
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    transform: "scale(1.1)",
                  },
                  p: 1,
                  mr: 0,
                  pr: 0,
                }}
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                    "&:hover": {
                      bgcolor: "rgba(255, 255, 255, 0.2)",
                    },
                    ml: 0,
                    mr: 0,
                    pr: 0,
                  }}
                >
                  <PersonIcon />
                </Avatar>
              </IconButton>
              {/* Logout Button - only show if user is logged in */}
              {user && (
                <Button
                  color="inherit"
                  onClick={handleLogout}
                  sx={{
                    ml: 2,
                    color: "white",
                    border: "1px solid #fff",
                    borderRadius: 2,
                    px: 2,
                    fontWeight: 600,
                  }}
                >
                  Logout
                </Button>
              )}
              <Menu
                anchorEl={profileAnchorEl}
                open={Boolean(profileAnchorEl)}
                onClose={handleProfileMenuClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    mt: 1.5,
                    bgcolor: "black",
                    color: "white",
                    "& .MuiMenuItem-root": {
                      px: 2,
                      py: 1.5,
                      fontSize: "0.875rem",
                      letterSpacing: "0.05em",
                      "&:hover": {
                        bgcolor: "rgba(255, 255, 255, 0.1)",
                      },
                    },
                    "& .MuiDivider-root": {
                      borderColor: "rgba(255, 255, 255, 0.1)",
                      my: 1,
                    },
                    "&:before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: "black",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                {user ? (
                  <>
                    <MenuItem
                      onClick={() => {
                        handleProfileMenuClose();
                        navigate("/profile");
                      }}
                    >
                      Profile
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleProfileMenuClose();
                        navigate("/orders");
                      }}
                    >
                      Orders
                    </MenuItem>
                  </>
                ) : (
                  <>
                    <MenuItem
                      onClick={() => {
                        handleProfileMenuClose();
                        navigate("/login");
                      }}
                    >
                      Login
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleProfileMenuClose();
                        navigate("/register");
                      }}
                    >
                      Register
                    </MenuItem>
                  </>
                )}
              </Menu>
            </Box>
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerClose}
        variant="temporary"
        sx={{
          display: { xs: "block", md: "none" },
          zIndex: 10000,
          "& .MuiBackdrop-root": {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 9999,
          },
          "& .MuiDrawer-paper": {
            width: "80vw",
            maxWidth: "80vw",
            zIndex: 10000,
            position: "fixed",
            top: 0,
            left: 0,
            height: "100vh", // ensure full viewport height
            minHeight: "100vh",
            backgroundColor: "black", // ensure black background
            boxShadow: "4px 0 10px rgba(0, 0, 0, 0.1)",
          },
        }}
        PaperProps={{
          sx: {
            width: "75vw",
            maxWidth: "75vw",
            zIndex: 10000,
            position: "fixed",
            top: 0,
            left: 0,
            height: "100vh", // ensure full viewport height
            minHeight: "100vh",
            backgroundColor: "black", // ensure black background
            boxShadow: "4px 0 10px rgba(0, 0, 0, 0.1)",
          },
        }}
        ModalProps={{
          keepMounted: true,
          container: document.body,
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default Header;

// Add this to inject the keyframes for the shine animation
const style = document.createElement("style");
style.innerHTML = `
@keyframes shine {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}`;
if (!document.head.querySelector("style[data-gold-shine]")) {
  style.setAttribute("data-gold-shine", "true");
  document.head.appendChild(style);
}
