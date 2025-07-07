import { Minus, Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, updateCartQuantity } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";

function UserCartItemsContent({ cartItem }) {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { productList } = useSelector((state) => state.shopProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();

  const handleUpdateQuantity = async (getCartItem, typeOfAction) => {
    if (typeOfAction === "plus") {
      const getCurrentProduct = productList.find(
        (product) => product._id === getCartItem?.productId
      );

      if (getCurrentProduct?.totalStock <= getCartItem?.quantity) {
        toast({
          title: "Stock Limit",
          description: `Only ${getCurrentProduct.totalStock} available`,
          className: "bg-[#5E8B4F] text-white",
        });
        return;
      }
    }

    const newQuantity = typeOfAction === "plus" 
      ? getCartItem.quantity + 1 
      : Math.max(1, getCartItem.quantity - 1);

    try {
      const result = await dispatch(
        updateCartQuantity({
          userId: user?.id,
          productId: getCartItem?.productId,
          quantity: newQuantity,
        })
      ).unwrap();

      if (result.success) {
        toast({
          title: "Cart Updated",
          className: "bg-[#5E8B4F] text-white",
        });
      }
    } catch (error) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleCartItemDelete = async (getCartItem) => {
    try {
      const result = await dispatch(
        deleteCartItem({ 
          userId: user?.id, 
          productId: getCartItem?.productId 
        })
      ).unwrap();

      if (result.success) {
        toast({
          title: "Item Removed",
          className: "bg-[#5E8B4F] text-white",
        });
      }
    } catch (error) {
      toast({
        title: "Removal Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div 
      className="flex items-center gap-4 p-4 rounded-xl bg-white border border-[#A7BC8A]/30"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Product Image */}
      <div className="relative flex-shrink-0">
        <img
          src={cartItem?.image}
          alt={cartItem?.title}
          className="w-20 h-20 rounded-lg object-cover border border-[#A7BC8A]/20"
        />
        {cartItem?.salePrice > 0 && (
          <div className="absolute -top-2 -right-2 bg-[#5E8B4F] text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
            SALE
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 space-y-2 min-w-0">
        <h3 className="font-bold text-gray-800 truncate">{cartItem?.title}</h3>
        
        {/* Price Display */}
        <div className="flex items-center gap-2">
          <p className={`font-semibold ${
            cartItem?.salePrice > 0 ? 'text-[#5E8B4F]' : 'text-gray-700'
          }`}>
            ${(cartItem?.salePrice > 0 ? cartItem.salePrice : cartItem.price).toFixed(2)}
          </p>
          {cartItem?.salePrice > 0 && (
            <p className="text-sm text-gray-400 line-through">
              ${cartItem.price.toFixed(2)}
            </p>
          )}
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 rounded-full border-[#A7BC8A] text-gray-700 hover:bg-[#FAF9F6]"
            disabled={cartItem?.quantity <= 1}
            onClick={() => handleUpdateQuantity(cartItem, "minus")}
          >
            <Minus className="w-3 h-3" />
          </Button>
          
          <span className="w-6 text-center font-medium text-gray-700">
            {cartItem?.quantity}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 rounded-full border-[#A7BC8A] text-gray-700 hover:bg-[#FAF9F6]"
            onClick={() => handleUpdateQuantity(cartItem, "plus")}
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Subtotal & Delete */}
      <div className="flex flex-col items-end gap-3 ml-auto">
        <p className="font-bold text-[#5E8B4F]">
          ${(
            (cartItem?.salePrice > 0 ? cartItem.salePrice : cartItem.price) *
            cartItem.quantity
          ).toFixed(2)}
        </p>
        
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50"
          onClick={() => handleCartItemDelete(cartItem)}
        >
          <Trash className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}

export default UserCartItemsContent;