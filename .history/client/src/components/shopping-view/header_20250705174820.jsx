import { HousePlug, LogOut, Menu, ShoppingCart, UserCog, Search, X } from "lucide-react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { logoutUser } from "@/store/auth-slice";
import UserCartWrapper from "./cart-wrapper";
import { useEffect, useState } from "react";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Label } from "../ui/label";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

function MenuItems() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  function handleNavigate(getCurrentMenuItem) {
    sessionStorage.removeItem("filters");
    const currentFilter =
      getCurrentMenuItem.id !== "home" &&
      getCurrentMenuItem.id !== "products" &&
      getCurrentMenuItem.id !== "search"
        ? {
            category: [getCurrentMenuItem.id],
          }
        : null;

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    location.pathname.includes("listing") && currentFilter !== null
      ? setSearchParams(
          new URLSearchParams(`?category=${getCurrentMenuItem.id}`)
        )
      : navigate(getCurrentMenuItem.path);
  }

  return (
    <nav className="flex flex-col lg:flex-row lg:items-center gap-4">
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <motion.div
          key={menuItem.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Label
            onClick={() => handleNavigate(menuItem)}
            className={cn(
              "text-sm font-medium cursor-pointer px-3 py-2 rounded-md transition-all duration-200",
              location.pathname === menuItem.path
                ? "bg-[#A7BC8A] text-white shadow-md"
                : "text-gray-700 hover:bg-[#D1E2C4]/50 hover:text-gray-900"
            )}
          >
            {menuItem.label}
          </Label>
        </motion.div>
      ))}
    </nav>
  );
}

function HeaderRightContent() {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser());
  }

  useEffect(() => {
    dispatch(fetchCartItems(user?.id));
  }, [dispatch]);

  return (
    <div className="flex items-center gap-4">
      {/* Search Button */}
      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="p-2 rounded-full hover:bg-[#D1E2C4]/50 transition-colors"
        onClick={() => navigate("/shop/search")}
      >
        <Search className="w-5 h-5 text-[#5E8B4F]" />
      </motion.button>

      {/* Cart */}
      <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
        <motion.div whileHover={{ scale: 1.05 }}>
          <Button
            onClick={() => setOpenCartSheet(true)}
            variant="ghost"
            size="icon"
            className="relative hover:bg-[#D1E2C4]/50 transition-colors"
          >
            <ShoppingCart className="w-5 h-5 text-[#5E8B4F]" />
            {cartItems?.items?.length > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-[#A7BC8A] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-sm"
              >
                {cartItems.items.length}
              </motion.span>
            )}
          </Button>
        </motion.div>
        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={
            cartItems && cartItems.items && cartItems.items.length > 0
              ? cartItems.items
              : []
          }
        />
      </Sheet>

      {/* User Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <motion.div whileHover={{ scale: 1.05 }}>
            <Avatar className="border-2 border-[#A7BC8A] shadow-sm">
              <AvatarFallback className="bg-[#A7BC8A] text-white font-medium">
                {user?.userName[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </motion.div>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          side="bottom" 
          className="w-56 mt-2 shadow-xl rounded-lg border border-[#D1E2C4] bg-white"
        >
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user?.userName}</p>
              <p className="text-xs leading-none text-gray-500">
                {user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-[#D1E2C4]" />
          <DropdownMenuItem 
            onClick={() => navigate("/shop/account")}
            className="cursor-pointer hover:bg-[#D1E2C4]/50 focus:bg-[#D1E2C4]/50 transition-colors"
          >
            <UserCog className="mr-2 h-4 w-4 text-[#5E8B4F]" />
            <span className="text-gray-700">Account</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-[#D1E2C4]" />
          <DropdownMenuItem 
            onClick={handleLogout}
            className="cursor-pointer hover:bg-[#D1E2C4]/50 focus:bg-[#D1E2C4]/50 transition-colors"
          >
            <LogOut className="mr-2 h-4 w-4 text-[#5E8B4F]" />
            <span className="text-gray-700">Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function ShoppingHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        "bg-white/95 backdrop-blur-sm border-b border-[#D1E2C4]/50",
        scrolled ? "shadow-sm py-2" : "py-4"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/shop/home" className="flex items-center gap-2">
              <motion.div 
                className="p-1.5 rounded-lg bg-[#A7BC8A] flex items-center justify-center shadow-sm"
                whileHover={{ rotate: 5 }}
              >
                <HousePlug className="h-5 w-5 text-white" />
              </motion.div>
              <span className="font-bold text-lg text-[#5E8B4F]">Ecommerce</span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            <MenuItems />
            <HeaderRightContent />
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="hover:bg-[#D1E2C4]/50 transition-colors"
                >
                  <Menu className="h-5 w-5 text-[#5E8B4F]" />
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="right" 
                className="w-[300px] sm:w-[350px] border-l border-[#D1E2C4]/50 bg-white/95 backdrop-blur-sm"
              >
                <div className="flex flex-col h-full py-6">
                  <div className="flex justify-between items-center mb-8">
                    <Link to="/shop/home" className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-[#A7BC8A] flex items-center justify-center">
                        <HousePlug className="h-5 w-5 text-white" />
                      </div>
                      <span className="font-bold text-lg text-[#5E8B4F]">Ecommerce</span>
                    </Link>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon" className="hover:bg-[#D1E2C4]/50">
                        <X className="h-5 w-5 text-[#5E8B4F]" />
                      </Button>
                    </SheetTrigger>
                  </div>
                  <div className="flex-1 flex flex-col gap-3">
                    <MenuItems />
                  </div>
                  <div className="mt-auto pt-6">
                    <HeaderRightContent />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

export default ShoppingHeader;