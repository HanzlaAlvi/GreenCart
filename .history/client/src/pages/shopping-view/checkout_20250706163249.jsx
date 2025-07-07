import Address from "@/components/shopping-view/address";
import img from "../../assets/account.jpg";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { createNewOrder } from "@/store/shop/order-slice";
import { useToast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ShoppingBag, Wallet, Loader2, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [expandedPayment, setExpandedPayment] = useState(null);
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

  const paymentOptions = [
    {
      id: "jazzcash",
      name: "JazzCash",
      icon: <Smartphone className="w-5 h-5" />,
      description: "Send screenshot of payment to 03347157029 on WhatsApp",
    },
    {
      id: "easypaisa",
      name: "EasyPaisa",
      icon: <Smartphone className="w-5 h-5" />,
      description: "Send screenshot of payment to 03347157029 on WhatsApp",
    },
    {
      id: "cod",
      name: "Cash on Delivery",
      icon: <Wallet className="w-5 h-5" />,
      description: "Pay when you receive your order",
    },
  ];

  const handleOrderConfirmation = async () => {
    if (!cartItems?.items?.length) {
      toast({
        title: "Your cart is empty",
        description: "Please add items to proceed",
        variant: "destructive",
      });
      return;
    }
    if (!currentSelectedAddress) {
      toast({
        title: "Address required",
        description: "Please select a delivery address",
        variant: "destructive",
      });
      return;
    }
    if (!paymentMethod) {
      toast({
        title: "Payment method required",
        description: "Please select a payment method",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((item) => ({
        productId: item?.productId,
        title: item?.title,
        image: item?.image,
        price: item?.salePrice > 0 ? item?.salePrice : item?.price,
        quantity: item?.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
      orderStatus: "pending",
      paymentMethod: paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'unpaid',
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
    };

    try {
      const result = await dispatch(createNewOrder(orderData)).unwrap();
      
      if (result.success) {
        toast({
          title: "Order Confirmed!",
          description: "Your order has been placed successfully",
          className: "bg-[#5E8B4F] text-white",
        });
        navigate("/shop/orders");
      }
    } catch (error) {
      toast({
        title: "Order Failed",
        description: "There was an error processing your order",
        variant: "destructive",
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
                    key={item.id}
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
                <span className="font-medium text-[#5E8B4F]">200</span>
              </div>
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-[#A7BC8A]/20">
                <span className="font-bold text-lg">Total</span>
                <span className="font-bold text-lg">${totalCartAmount.toFixed(2)}</span>
              </div>

              {/* Payment Options */}
              <div className="mt-6 space-y-3">
                <h3 className="font-medium text-gray-700">Payment Method</h3>
                {paymentOptions.map((option) => (
                  <div key={option.id} className="space-y-2">
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant={paymentMethod === option.id ? "default" : "outline"}
                        onClick={() => {
                          setPaymentMethod(option.id);
                          setExpandedPayment(expandedPayment === option.id ? null : option.id);
                        }}
                        className={cn(
                          "w-full justify-start gap-3",
                          paymentMethod === option.id 
                            ? "bg-[#5E8B4F] hover:bg-[#4A7740] text-white" 
                            : "border-[#A7BC8A] text-gray-700 hover:bg-[#FAF9F6]"
                        )}
                      >
                        {option.icon}
                        {option.name}
                      </Button>
                    </motion.div>

                    <AnimatePresence>
                      {expandedPayment === option.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="p-3 text-sm bg-[#FAF9F6] rounded-md border border-[#A7BC8A]/20">
                            <p className="text-gray-600">{option.description}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
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
                  disabled={isProcessing || !paymentMethod || !cartItems?.items?.length}
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