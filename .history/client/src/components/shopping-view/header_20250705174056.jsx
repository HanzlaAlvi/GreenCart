import { ShoppingBag, User, Menu, X, Search, Heart } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "@/store/auth-slice";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { cn } from "@/lib/utils";
import { shoppingViewHeaderMenuItems } from "@/config";

const ModernHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Color palette
  const colors = {
    primary: "#A7BC8A",  // Pistachio
    dark: "#5E8B4F",     // Dark green
    light: "#D1E2C4",    // Light pistachio
    text: "#2D3748",     // Dark gray
    background: "#FAF9F6" // Creamy white
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

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled ? "shadow-md py-2" : "py-4",
        "bg-[#FAF9F6] backdrop-blur-sm"
      )}
      style={{
        backgroundColor: colors.background // Explicitly setting background
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo with animation */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/shop/home" className="flex items-center gap-2">
              <motion.div 
                className="p-2 rounded-full flex items-center justify-center"
                style={{ backgroundColor: colors.primary }}
                whileHover={{ rotate: 10 }}
              >
                <ShoppingBag className="text-white" />
              </motion.div>
              <span 
                className="text-xl font-bold" 
                style={{ color: colors.text }}
              >
                GreenCart
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav 
            className="hidden lg:flex items-center gap-1"
            style={{ backgroundColor: colors.background }}
          >
            {shoppingViewHeaderMenuItems.map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(item.path)}
                className={cn(
                  "px-4 py-2 rounded-lg font-medium transition-all relative",
                  location.pathname === item.path 
                    ? "text-white"
                    : `text-[${colors.text}] hover:text-[${colors.dark}]`
                )}
                style={{
                  backgroundColor: location.pathname === item.path ? colors.primary : 'transparent'
                }}
              >
                <span className="relative z-10">{item.label}</span>
              </motion.button>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div 
            className="flex items-center gap-4"
            style={{ backgroundColor: colors.background }}
          >
            {/* Search */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full hover:bg-gray-100"
              onClick={() => navigate("/shop/search")}
              style={{ backgroundColor: colors.background }}
            >
              <Search className="w-5 h-5" style={{ color: colors.dark }} />
            </motion.button>

            {/* Cart */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full hover:bg-gray-100 relative"
              onClick={() => navigate("/shop/cart")}
              style={{ backgroundColor: colors.background }}
            >
              <ShoppingBag className="w-5 h-5" style={{ color: colors.dark }} />
              {cartItems?.items?.length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-[#A7BC8A] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                >
                  {cartItems.items.length}
                </motion.span>
              )}
            </motion.button>

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="lg:hidden p-2 rounded-full hover:bg-gray-100"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={{ backgroundColor: colors.background }}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" style={{ color: colors.dark }} />
              ) : (
                <Menu className="w-5 h-5" style={{ color: colors.dark }} />
              )}
            </motion.button>

            {/* User Profile (Desktop) */}
            {isAuthenticated && (
              <motion.div 
                className="hidden lg:block"
                whileHover={{ scale: 1.05 }}
                style={{ backgroundColor: colors.background }}
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="border-2" style={{ borderColor: colors.primary }}>
                      <AvatarFallback className="font-medium" style={{ color: colors.primary }}>
                        {user?.userName[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    className="w-56 rounded-xl shadow-lg border"
                    style={{ 
                      borderColor: colors.light,
                      backgroundColor: colors.background
                    }}
                  >
                    <DropdownMenuLabel>
                      <div className="flex flex-col">
                        <span className="font-medium">{user?.userName}</span>
                        <span className="text-xs text-gray-500">{user?.email}</span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => navigate("/account")}
                      className="cursor-pointer"
                      style={{ backgroundColor: colors.background }}
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={handleLogout}
                      className="cursor-pointer"
                      style={{ backgroundColor: colors.background }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </motion.div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:hidden mt-4 pb-4 rounded-lg shadow-lg p-4"
            style={{ backgroundColor: colors.background }}
          >
            <nav className="flex flex-col gap-2">
              {shoppingViewHeaderMenuItems.map((item) => (
                <motion.button
                  key={item.id}
                  whileHover={{ x: 5 }}
                  onClick={() => {
                    navigate(item.path);
                    setIsMenuOpen(false);
                  }}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-lg font-medium transition-colors",
                    location.pathname === item.path
                      ? "text-white"
                      : `text-[${colors.text}] hover:bg-[${colors.light}]`
                  )}
                  style={{
                    backgroundColor: location.pathname === item.path ? colors.primary : 'transparent'
                  }}
                >
                  {item.label}
                </motion.button>
              ))}

              {!isAuthenticated && (
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full px-4 py-3 rounded-lg font-medium text-center mt-2"
                  style={{ 
                    backgroundColor: colors.primary, 
                    color: "white"
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