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
    <nav className="flex flex-col lg:flex-row lg:items-center gap-6">
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <motion.div
          key={menuItem.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Label
            onClick={() => handleNavigate(menuItem)}
            className={cn(
              "text-sm font-medium cursor-pointer px-3 py-1 rounded-md transition-colors",
              location.pathname === menuItem.path
                ? "bg-primary text-white"
                : "hover:bg-gray-100"
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
        whileHover={{ scale: 1.05 }}
        className="p-2 rounded-full hover:bg-gray-100"
        onClick={() => navigate("/shop/search")}
      >
        <Search className="w-5 h-5" />
      </motion.button>

      {/* Cart */}
      <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
        <motion.div whileHover={{ scale: 1.05 }}>
          <Button
            onClick={() => setOpenCartSheet(true)}
            variant="ghost"
            size="icon"
            className="relative hover:bg-gray-100"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartItems?.items?.length > 0 && (
              <span className="absolute top-0 right-0 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItems.items.length}
              </span>
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
            <Avatar className="border border-gray-200 cursor-pointer">
              <AvatarFallback className="bg-primary text-white font-medium">
                {user?.userName[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </motion.div>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" className="w-56 mt-2 shadow-xl rounded-lg">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user?.userName}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => navigate("/shop/account")}
            className="cursor-pointer hover:bg-gray-50"
          >
            <UserCog className="mr-2 h-4 w-4" />
            <span>Account</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={handleLogout}
            className="cursor-pointer hover:bg-gray-50"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function ShoppingHeader() {
  const { isAuthenticated } = useSelector((state) => state.auth);
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
        "bg-white border-b",
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
              <HousePlug className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">Ecommerce</span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <MenuItems />
            <HeaderRightContent />
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[350px]">
                <div className="flex flex-col h-full py-6">
                  <div className="flex justify-between items-center mb-8">
                    <Link to="/shop/home" className="flex items-center gap-2">
                      <HousePlug className="h-6 w-6 text-primary" />
                      <span className="font-bold text-lg">Ecommerce</span>
                    </Link>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <X className="h-5 w-5" />
                      </Button>
                    </SheetTrigger>
                  </div>
                  <div className="flex-1 flex flex-col gap-4">
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