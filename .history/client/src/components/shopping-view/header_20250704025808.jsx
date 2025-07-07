import { ShoppingBag, User, Menu, X, Search, Heart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "@/store/auth-slice";
import { fetchCartItems } from "@/store/shop/cart-slice";

const AnimatedHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Updated Pistachio color palette with #A7BC8A as primary
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
    { name: "Home", path: "/shop/home" },
    { name: "Products", path: "/shop/listing" },
    { name: "Categories", path: "/shop/categories" },
    { name: "About", path: "/shop/about" },
    { name: "Contact", path: "/shop/contact" },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "shadow-lg py-2" : "py-4"
      }`}
      style={{ 
        backgroundColor: colors.primary,
        boxShadow: scrolled ? `0 4px 12px ${colors.dark}20` : "none"
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo with animation */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/shop/home"
              className="flex items-center gap-2 text-2xl font-bold"
              style={{ color: colors.text }}
            >
              <motion.span 
                className="p-2 rounded-full flex items-center justify-center"
                style={{ backgroundColor: colors.dark }}
                whileHover={{ rotate: 10 }}
              >
                <ShoppingBag className="text-white" />
              </motion.span>
              <span className="hidden sm:inline">GreenCart</span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <motion.div
                key={item.name}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={item.path}
                  className="font-medium px-3 py-1 rounded-lg transition-all"
                  style={{ 
                    color: colors.text,
                    backgroundColor: location.pathname === item.path ? colors.light : 'transparent'
                  }}
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Search Bar with animation */}
          <motion.div
            className="hidden md:flex items-center bg-white rounded-full px-4 py-2 shadow-sm"
            whileHover={{ scale: 1.02 }}
            style={{ boxShadow: `0 2px 8px ${colors.dark}30` }}
          >
            <input
              type="text"
              placeholder="Search products..."
              className="outline-none w-40 lg:w-64 bg-transparent text-sm"
              style={{ color: colors.text }}
            />
            <motion.div whileHover={{ scale: 1.1 }}>
              <Search className="ml-2" style={{ color: colors.dark }} />
            </motion.div>
          </motion.div>

          {/* Action Icons */}
          <div className="flex items-center gap-4">
            {/* Wishlist */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
              className="relative p-2 rounded-full"
              style={{ 
                backgroundColor: colors.light,
                boxShadow: `0 2px 6px ${colors.dark}20`
              }}
              onClick={() => navigate("/shop/wishlist")}
            >
              <Heart style={{ color: colors.dark }} />
            </motion.button>

            {/* Cart with counter */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative p-2 rounded-full"
              style={{ 
                backgroundColor: colors.light,
                boxShadow: `0 2px 6px ${colors.dark}20`
              }}
              onClick={() => navigate("/shop/cart")}
            >
              <ShoppingBag style={{ color: colors.dark }} />
              {cartItems?.items?.length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 text-xs rounded-full h-5 w-5 flex items-center justify-center"
                  style={{ 
                    backgroundColor: colors.accent,
                    color: colors.text
                  }}
                >
                  {cartItems.items.length}
                </motion.span>
              )}
            </motion.button>

            {/* User Dropdown */}
            {isAuthenticated ? (
              <motion.div whileHover={{ scale: 1.05 }} className="relative">
                <button
                  className="flex items-center gap-2 p-2 rounded-full"
                  style={{ 
                    backgroundColor: colors.light,
                    boxShadow: `0 2px 6px ${colors.dark}20`
                  }}
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <User style={{ color: colors.dark }} />
                  <span className="hidden md:inline" style={{ color: colors.text }}>
                    {user?.userName}
                  </span>
                </button>

                {isMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg py-1 z-50 overflow-hidden"
                    style={{ 
                      backgroundColor: colors.background,
                      boxShadow: `0 4px 20px ${colors.dark}30`
                    }}
                  >
                    <Link
                      to="/shop/account"
                      className="block px-4 py-2 text-sm hover:bg-white/50 transition-colors"
                      style={{ color: colors.text }}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Account
                    </Link>
                    <Link
                      to="/shop/orders"
                      className="block px-4 py-2 text-sm hover:bg-white/50 transition-colors"
                      style={{ color: colors.text }}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Orders
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-white/50 transition-colors"
                      style={{ color: colors.text }}
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-full text-sm font-medium"
                style={{ 
                  backgroundColor: colors.dark, 
                  color: "white",
                  boxShadow: `0 2px 8px ${colors.dark}40`
                }}
                onClick={() => navigate("/login")}
              >
                Login
              </motion.button>
            )}

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="md:hidden p-2 rounded-full"
              style={{ 
                backgroundColor: colors.light,
                boxShadow: `0 2px 6px ${colors.dark}20`
              }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X style={{ color: colors.dark }} />
              ) : (
                <Menu style={{ color: colors.dark }} />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 pb-4 space-y-3"
          >
            <motion.div
              className="flex items-center bg-white rounded-full px-4 py-2"
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              style={{ boxShadow: `0 2px 8px ${colors.dark}30` }}
            >
              <input
                type="text"
                placeholder="Search products..."
                className="outline-none w-full bg-transparent text-sm"
                style={{ color: colors.text }}
              />
              <Search className="ml-2" style={{ color: colors.dark }} />
            </motion.div>

            <nav className="flex flex-col gap-2">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={item.path}
                    className="block px-4 py-3 rounded-lg font-medium transition-colors"
                    style={{ 
                      backgroundColor: colors.light,
                      color: colors.text 
                    }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}

              {!isAuthenticated && (
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full px-4 py-3 rounded-lg font-medium text-center mt-2"
                  style={{ 
                    backgroundColor: colors.dark, 
                    color: "white",
                    boxShadow: `0 2px 8px ${colors.dark}40`
                  }}
                  onClick={() => {
                    navigate("/login");
                    setIsMenuOpen(false);
                  }}
                >
                  Login
                </motion.button>
              )}
            </nav>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};

export default ShoppingHeader;