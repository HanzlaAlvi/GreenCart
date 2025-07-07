import { ShoppingBag, User, Menu, X, Search, Heart } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "@/store/auth-slice";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { cn } from "@/lib/utils";

const ModernNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Pistachio color palette with #A7BC8A as primary
  const colors = {
    primary: "#A7BC8A",
    dark: "#5E8B4F",
    light: "#D1E2C4",
    accent: "#FFD166",
    text: "#2D3748",
    background: "#F8FAF5"
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCartItems(user?.id));
    }
  }, [dispatch, isAuthenticated]);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  const navItems = [
    { name: "Home", path: "/shop/home", id: "home" },
    { name: "Products", path: "/shop/listing", id: "products" },
    { name: "Categories", path: "/shop/categories", id: "categories" },
    { name: "About", path: "/shop/about", id: "about" },
    { name: "Contact", path: "/shop/contact", id: "contact" },
  ];

  const handleNavigate = (item) => {
    sessionStorage.removeItem("filters");
    const currentFilter = 
      item.id !== "home" && item.id !== "products" && item.id !== "search"
        ? { category: [item.id] }
        : null;

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    if (location.pathname.includes("listing") && currentFilter !== null) {
      navigate(`${item.path}?category=${item.id}`);
    } else {
      navigate(item.path);
    }
    setIsMenuOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        scrolled ? "shadow-lg py-2" : "py-4",
        "bg-white backdrop-blur-md bg-opacity-90"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo with animation */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center"
          >
            <Link
              to="/shop/home"
              className="flex items-center gap-2"
            >
              <motion.span 
                className="p-2 rounded-full flex items-center justify-center"
                style={{ backgroundColor: colors.primary }}
                whileHover={{ rotate: 10 }}
              >
                <ShoppingBag className="text-white" />
              </motion.span>
              <span className="text-xl font-bold" style={{ color: colors.dark }}>
                GreenCart
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <motion.button
                key={item.name}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNavigate(item)}
                className={cn(
                  "px-4 py-2 rounded-lg font-medium transition-all relative",
                  location.pathname === item.path 
                    ? "text-white"
                    : "text-gray-700 hover:text-gray-900"
                )}
              >
                {location.pathname === item.path && (
                  <motion.span
                    layoutId="activeNavItem"
                    className="absolute inset-0 rounded-lg"
                    style={{ backgroundColor: colors.primary }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{item.name}</span>
              </motion.button>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full hover:bg-gray-100"
              onClick={() => navigate("/shop/search")}
            >
              <Search className="w-5 h-5" style={{ color: colors.dark }} />
            </motion.button>

            {/* Wishlist */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full hover:bg-gray-100 relative"
              onClick={() => navigate("/shop/wishlist")}
            >
              <Heart className="w-5 h-5" style={{ color: colors.dark }} />
            </motion.button>

            {/* Cart */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full hover:bg-gray-100 relative"
              onClick={() => navigate("/shop/cart")}
            >
              <ShoppingBag className="w-5 h-5" style={{ color: colors.dark }} />
              {cartItems?.items?.length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                >
                  {cartItems.items.length}
                </motion.span>
              )}
            </motion.button>

            {/* User Profile */}
            {isAuthenticated ? (
              <motion.div whileHover={{ scale: 1.05 }} className="relative">
                <button
                  className="flex items-center justify-center w-10 h-10 rounded-full border-2"
                  style={{ borderColor: colors.primary }}
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <span 
                    className="font-medium"
                    style={{ color: colors.primary }}
                  >
                    {user?.userName[0].toUpperCase()}
                  </span>
                </button>

                {isMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg py-1 z-50 bg-white border border-gray-100"
                  >
                    <div className="px-4 py-2 border-b">
                      <p className="text-sm font-medium" style={{ color: colors.dark }}>
                        {user?.userName}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user?.email}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        navigate("/shop/account");
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                      style={{ color: colors.text }}
                    >
                      My Account
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                      style={{ color: colors.text }}
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-full text-sm font-medium"
                style={{ backgroundColor: colors.primary, color: "white" }}
                onClick={() => navigate("/login")}
              >
                Login
              </motion.button>
            )}

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-full hover:bg-gray-100"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" style={{ color: colors.dark }} />
              ) : (
                <Menu className="w-5 h-5" style={{ color: colors.dark }} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:hidden mt-4 pb-4 space-y-2 bg-white rounded-lg shadow-lg p-4"
          >
            {navItems.map((item, index) => (
              <motion.button
                key={item.name}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleNavigate(item)}
                className={cn(
                  "block w-full text-left px-4 py-3 rounded-lg font-medium transition-colors",
                  location.pathname === item.path
                    ? "text-white"
                    : "text-gray-700 hover:bg-gray-50"
                )}
                style={{
                  backgroundColor: location.pathname === item.path ? colors.primary : "transparent"
                }}
              >
                {item.name}
              </motion.button>
            ))}
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};

export default ModShoppingernNavbar;