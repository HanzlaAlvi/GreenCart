import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import UserCartItemsContent from "./cart-items-content";
import { motion } from "framer-motion";

function UserCartWrapper({ cartItems, setOpenCartSheet }) {
  const navigate = useNavigate();

  const totalCartAmount = cartItems?.reduce(
    (sum, item) => sum + (item?.salePrice || item?.price) * item?.quantity,
    0
  ) || 0;

  return (
    <SheetContent className="sm:max-w-lg bg-[#FAF9F6]">
      <SheetHeader>
        <SheetTitle className="text-[#5E8B4F]">Your Shopping Cart</SheetTitle>
      </SheetHeader>

      {/* Cart Items */}
      <motion.div 
        className="mt-6 space-y-4 max-h-[60vh] overflow-y-auto pr-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {cartItems?.length > 0 ? (
          cartItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <UserCartItemsContent cartItem={item} />
            </motion.div>
          ))
        ) : (
          <motion.div
            className="flex flex-col items-center justify-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-16 h-16 rounded-full bg-[#A7BC8A]/20 flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#5E8B4F"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="10" cy="20.5" r="1" />
                <circle cx="18" cy="20.5" r="1" />
                <path d="M2.5 2.5h3l2.7 12.4a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6l1.6-8.4H7.1" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-600">Your cart is empty</h3>
            <p className="text-sm text-gray-400 mt-1">Start shopping to add items</p>
          </motion.div>
        )}
      </motion.div>

      {/* Order Summary */}
      {cartItems?.length > 0 && (
        <motion.div
          className="mt-6 border-t border-[#A7BC8A]/30 pt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">${totalCartAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium text-[#5E8B4F]">Free</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-[#A7BC8A]/30">
              <span className="font-bold text-lg">Total</span>
              <span className="font-bold text-lg text-[#5E8B4F]">
                ${totalCartAmount.toFixed(2)}
              </span>
            </div>
          </div>

          <Button
            onClick={() => {
              navigate("/shop/checkout");
              setOpenCartSheet(false);
            }}
            className="w-full mt-6 bg-[#5E8B4F] hover:bg-[#4A7740] h-12 text-lg"
          >
            Proceed to Checkout
          </Button>
        </motion.div>
      )}

      {!cartItems?.length && (
        <Button
          onClick={() => {
            navigate("/shop");
            setOpenCartSheet(false);
          }}
          className="w-full mt-6 bg-[#5E8B4F] hover:bg-[#4A7740] h-12 text-lg"
        >
          Browse Products
        </Button>
      )}
    </SheetContent>
  );
}

export default UserCartWrapper;