import { ShoppingBag, User, Menu, X, Search, Heart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "@/store/auth-slice";
import { fetchCartItems } from "@/store/shop/cart-slice";

const ShoppingHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Pistachio color palette
  const colors = {
    primary: "#ffffff",
    dark: "#BCB88A",
    light: "#C1E1A6",
    accent: "##BCB88A",
    text: "#2D3748",
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
      style={{ backgroundColor: colors.primary }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link
              to="/shop/home"
              className="flex items-center gap-2 text-2xl font-bold"
              style={{ color: colors.text }}
            >
              <span className="p-2 rounded-full" style={{ backgroundColor: colors.dark }}>
                <ShoppingBag className="text-white" />
              </span>
              <span className="hidden sm:inline">Pistachio</span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <motion.div
                key={item.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={item.path}
                  className="font-medium transition-colors hover:text-white"
                  style={{ color: colors.text }}
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Search Bar */}
          <motion.div
            className="hidden md:flex items-center bg-white rounded-full px-4 py-2 shadow-sm"
            whileHover={{ scale: 1.02 }}
          >
            <input
              type="text"
              placeholder="Search products..."
              className="outline-none w-40 lg:w-64 bg-transparent text-sm"
              style={{ color: colors.text }}
            />
            <Search className="ml-2" style={{ color: colors.dark }} />
          </motion.div>

          {/* Icons */}
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative p-2 rounded-full"
              style={{ backgroundColor: colors.light }}
              onClick={() => navigate("/shop/wishlist")}
            >
              <Heart style={{ color: colors.dark }} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative p-2 rounded-full"
              style={{ backgroundColor: colors.light }}
              onClick={() => navigate("/shop/cart")}
            >
              <ShoppingBag style={{ color: colors.dark }} />
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

            {/* User Dropdown */}
            {isAuthenticated ? (
              <motion.div whileHover={{ scale: 1.05 }} className="relative">
                <button
                  className="flex items-center gap-2 p-2 rounded-full"
                  style={{ backgroundColor: colors.light }}
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
                    className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 z-50"
                    style={{ backgroundColor: colors.light }}
                  >
                    <Link
                      to="/shop/account"
                      className="block px-4 py-2 text-sm hover:bg-white/20"
                      style={{ color: colors.text }}
                    >
                      My Account
                    </Link>
                    <Link
                      to="/shop/orders"
                      className="block px-4 py-2 text-sm hover:bg-white/20"
                      style={{ color: colors.text }}
                    >
                      My Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-white/20"
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
                style={{ backgroundColor: colors.dark, color: "white" }}
                onClick={() => navigate("/login")}
              >
                Login
              </motion.button>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-full"
              style={{ backgroundColor: colors.light }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X style={{ color: colors.dark }} />
              ) : (
                <Menu style={{ color: colors.dark }} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 pb-4 space-y-4"
          >
            <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-sm">
              <input
                type="text"
                placeholder="Search products..."
                className="outline-none w-full bg-transparent text-sm"
                style={{ color: colors.text }}
              />
              <Search className="ml-2" style={{ color: colors.dark }} />
            </div>

            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <motion.div
                  key={item.name}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    to={item.path}
                    className="block px-4 py-2 rounded-lg font-medium transition-colors"
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
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-4 py-2 rounded-lg font-medium text-center"
                  style={{ backgroundColor: colors.dark, color: "white" }}
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