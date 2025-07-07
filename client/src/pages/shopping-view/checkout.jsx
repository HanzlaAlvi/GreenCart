import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { createNewOrder, clearOrderError } from "@/store/shop/order-slice";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { Sparkles, ShoppingBag, Wallet, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Address from "@/components/shopping-view/address";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import img from "../../assets/account.jpg";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const navigate = useNavigate();

  const totalCartAmount = cartItems?.items?.reduce(
    (sum, currentItem) =>
      sum +
      (currentItem?.salePrice > 0 ? currentItem?.salePrice : currentItem?.price) *
        currentItem?.quantity,
    0
  ) || 0;

  const shippingFee = 200;
  const orderTotal = totalCartAmount + shippingFee;

  const handleOrderConfirmation = async () => {
    if (!cartItems?.items?.length) {
      toast({ 
        title: "Your cart is empty", 
        variant: "destructive",
        duration: 2000 
      });
      return;
    }
    if (!currentSelectedAddress) {
      toast({ 
        title: "Address required", 
        description: "Please select a delivery address",
        variant: "destructive",
        duration: 2000
      });
      return;
    }

    setIsProcessing(true);
    dispatch(clearOrderError());

    try {
      const orderData = {
        userId: user?.id,
        cartId: cartItems?._id,
        cartItems: cartItems.items.map(item => ({
          productId: item.productId,
          title: item.title,
          image: item.image,
          price: item.salePrice > 0 ? item.salePrice : item.price,
          quantity: item.quantity
        })),
        addressInfo: {
          addressId: currentSelectedAddress._id,
          address: currentSelectedAddress.address,
          city: currentSelectedAddress.city,
          pincode: currentSelectedAddress.pincode,
          phone: currentSelectedAddress.phone,
          notes: currentSelectedAddress.notes || ''
        },
        paymentMethod: 'cod',
        subtotal: totalCartAmount,
        shippingFee,
        totalAmount: orderTotal
      };

      const result = await dispatch(createNewOrder(orderData)).unwrap();
      
      if (result.success) {
        // Show confirmation message
        toast({
          title: "Order Confirmed!",
          description: `Your order #${result.orderId} has been placed`,
          className: "bg-[#5E8B4F] text-white",
          duration: 3000
        });

        // Navigate directly to home page after successful order
        navigate("/shop/home", {
          state: { 
            showOrderConfirmation: true,
            orderId: result.orderId 
          }
        });
      }
    } catch (error) {
      console.error("Order error:", error);
      toast({
        title: "Order Failed",
        description: error.payload?.message || "Failed to create order",
        variant: "destructive",
        duration: 3000
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Banner */}
      <motion.div 
        className="relative h-[300px] w-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <img 
          src={img} 
          className="h-full w-full object-cover object-center" 
          alt="Checkout background" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <motion.div 
          className="absolute bottom-8 left-0 right-0 container mx-auto px-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
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
              <Sparkles className="w-8 h-8 text-amber-400" />
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">Checkout</h1>
          </div>
        </motion.div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        className="container mx-auto px-4 py-8 flex-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Address Section */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Address
              selectedId={currentSelectedAddress}
              setCurrentSelectedAddress={setCurrentSelectedAddress}
            />
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl shadow-lg border border-[#A7BC8A]/20 p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <ShoppingBag className="w-6 h-6 text-[#5E8B4F]" />
              <h2 className="text-xl font-bold">Order Summary</h2>
            </div>

            {/* Cart Items */}
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
              {cartItems?.items?.length > 0 ? (
                cartItems.items.map((item, index) => (
                  <motion.div
                    key={`${item.productId}-${index}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <UserCartItemsContent cartItem={item} />
                  </motion.div>
                ))
              ) : (
                <motion.div
                  className="flex flex-col items-center justify-center py-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Sparkles className="w-10 h-10 text-[#A7BC8A] mb-4" />
                  <p className="text-gray-500">Your cart is empty</p>
                </motion.div>
              )}
            </div>

            {/* Order Total */}
            <div className="mt-6 pt-6 border-t border-[#A7BC8A]/20">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${totalCartAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium text-[#5E8B4F]">${shippingFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-[#A7BC8A]/20">
                <span className="font-bold text-lg">Total</span>
                <span className="font-bold text-lg">${orderTotal.toFixed(2)}</span>
              </div>

              {/* Payment Method Section */}
              <div className="mt-6 space-y-3">
                <h3 className="font-medium text-gray-700">Payment Method</h3>
                <div className="space-y-2">
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="default"
                      className={cn(
                        "w-full justify-start gap-3",
                        "bg-[#5E8B4F] hover:bg-[#4A7740] text-white"
                      )}
                    >
                      <Wallet className="w-5 h-5" />
                      Cash on Delivery
                    </Button>
                  </motion.div>
                  <div className="p-3 text-sm bg-[#FAF9F6] rounded-md border border-[#A7BC8A]/20">
                    <p className="text-gray-600">Pay when you receive your order</p>
                  </div>
                </div>
              </div>

              {/* Confirm Order Button */}
              <motion.div 
                className="mt-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Button
                  onClick={handleOrderConfirmation}
                  disabled={isProcessing || !cartItems?.items?.length || !currentSelectedAddress}
                  className={cn(
                    "w-full py-6 text-base font-medium",
                    "bg-[#5E8B4F] hover:bg-[#4A7740]",
                    "transition-all duration-300 shadow-md hover:shadow-lg"
                  )}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Confirming Order
                    </>
                  ) : (
                    <>
                      <Wallet className="w-5 h-5 mr-2" />
                      Confirm Order
                    </>
                  )}
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default ShoppingCheckout;