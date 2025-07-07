import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";
import { motion } from "framer-motion";
import { ShoppingBag, ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

function UserCartWrapper({ cartItems, setOpenCartSheet }) {
  const navigate = useNavigate();

  const totalCartAmount =
    cartItems && cartItems.length > 0
      ? cartItems.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  const itemCount = cartItems?.length || 0;

  return (
    <SheetContent className="sm:max-w-lg w-full">
      <SheetHeader className="border-b border-[#A7BC8A]/20 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                repeat: Infinity, 
                repeatType: "reverse", 
                duration: 3 
              }}
            >
              <ShoppingBag className="w-6 h-6 text-[#5E8B4F]" />
            </motion.div>
            <SheetTitle className="text-2xl font-bold bg-gradient-to-r from-[#5E8B4F] to-[#A7BC8A] bg-clip-text text-transparent">
              Your Cart
            </SheetTitle>
          </div>
          <span className="text-sm text-muted-foreground">
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </span>
        </div>
      </SheetHeader>

      <div className="h-full flex flex-col">
        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {cartItems && cartItems.length > 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1 }}
            >
              {cartItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <UserCartItemsContent cartItem={item} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              className="flex flex-col items-center justify-center h-full py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles className="w-12 h-12 text-[#A7BC8A] mb-4" />
              <h3 className="text-xl font-medium text-gray-600">Your cart is empty</h3>
              <p className="text-gray-500 mt-2">Start shopping to add items</p>
            </motion.div>
          )}
        </div>

        {/* Checkout Section */}
        {cartItems && cartItems.length > 0 && (
          <motion.div 
            className="border-t border-[#A7BC8A]/20 pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex justify-between items-center mb-4">
              <span className="font-medium text-gray-700">Subtotal</span>
              <span className="font-bold text-lg">${totalCartAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-6 text-sm">
              <span className="text-muted-foreground">Shipping calculated at checkout</span>
              <span className="text-[#5E8B4F]">Free shipping over $50</span>
            </div>
            
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={() => {
                  navigate("/shop/checkout");
                  setOpenCartSheet(false);
                }}
                className={cn(
                  "w-full py-6 text-base font-medium",
                  "bg-[#5E8B4F] hover:bg-[#4A7740]",
                  "transition-all duration-300 shadow-md hover:shadow-lg"
                )}
              >
                Proceed to Checkout
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </SheetContent>
  );
}

export default UserCartWrapper;