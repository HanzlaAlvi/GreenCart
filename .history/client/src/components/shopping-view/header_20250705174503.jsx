import { ShoppingBag, User, Menu, X, Search } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "@/store/auth-slice";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { cn } from "@/lib/utils";
import { shoppingViewHeaderMenuItems } from "@/config";

const ShoppingHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isAuthenticated) dispatch(fetchCartItems(user?.id));
  }, [dispatch, isAuthenticated]);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 bg-[#FAF9F6]",
        scrolled ? "shadow-md py-2" : "py-4"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/shop/home" className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-[#A7BC8A]">
              <ShoppingBag className="text-white" />
            </div>
            <span className="text-xl font-bold text-[#5E8B4F]">GreenCart</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {shoppingViewHeaderMenuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={cn(
                  "px-4 py-2 rounded-lg font-medium",
                  location.pathname === item.path
                    ? "bg-[#A7BC8A] text-white"
                    : "text-[#5E8B4F] hover:bg-[#D1E2C4]"
                )}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate("/shop/search")}
              className="p-2 rounded-full hover:bg-[#D1E2C4]"
            >
              <Search className="w-5 h-5 text-[#5E8B4F]" />
            </button>

            <button 
              onClick={() => navigate("/shop/cart")}
              className="p-2 rounded-full hover:bg-[#D1E2C4] relative"
            >
              <ShoppingBag className="w-5 h-5 text-[#5E8B4F]" />
              {cartItems?.items?.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#A7BC8A] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems.items.length}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-full hover:bg-[#D1E2C4]"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-[#5E8B4F]" />
              ) : (
                <Menu className="w-5 h-5 text-[#5E8B4F]" />
              )}
            </button>

            {/* User Profile */}
            {isAuthenticated && (
              <div className="hidden lg:block">
                <button className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-[#A7BC8A]">
                  <span className="font-medium text-[#A7BC8A]">
                    {user?.userName[0].toUpperCase()}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 bg-white rounded-lg shadow-lg p-4">
            <nav className="flex flex-col gap-2">
              {shoppingViewHeaderMenuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    navigate(item.path);
                    setIsMenuOpen(false);
                  }}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-lg font-medium",
                    location.pathname === item.path
                      ? "bg-[#A7BC8A] text-white"
                      : "text-[#5E8B4F] hover:bg-[#D1E2C4]"
                  )}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default ShoppingHeader;