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
          title: "Stock Limit Reached",
          description: `Only ${getCurrentProduct.totalStock} available in stock`,
          variant: "destructive",
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
          description: `Quantity changed to ${newQuantity}`,
        });
      }
    } catch (error) {
      toast({
        title: "Update Failed",
        description: error.message || "Couldn't update quantity",
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
          description: `${getCartItem.title} removed from cart`,
        });
      }
    } catch (error) {
      toast({
        title: "Removal Failed",
        description: error.message || "Couldn't remove item",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div 
      className="flex items-center gap-4 p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.2 }}
    >
      {/* Product Image */}
      <div className="relative">
        <img
          src={cartItem?.image}
          alt={cartItem?.title}
          className="w-20 h-20 rounded-lg object-cover border border-gray-100"
        />
        {cartItem?.salePrice > 0 && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            SALE
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 space-y-2">
        <h3 className="font-bold text-gray-800 line-clamp-1">{cartItem?.title}</h3>
        
        {/* Price Display */}
        <div className="flex items-center gap-2">
          <p className={`font-semibold ${
            cartItem?.salePrice > 0 ? 'text-green-600' : 'text-gray-700'
          }`}>
            ${(cartItem?.salePrice > 0 ? cartItem.salePrice : cartItem.price).toFixed(2)}
          </p>
          {cartItem?.salePrice > 0 && (
            <p className="text-sm text-gray-500 line-through">
              ${cartItem.price.toFixed(2)}
            </p>
          )}
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full hover:bg-gray-100"
            disabled={cartItem?.quantity <= 1}
            onClick={() => handleUpdateQuantity(cartItem, "minus")}
          >
            <Minus className="w-4 h-4" />
          </Button>
          
          <span className="w-8 text-center font-medium">
            {cartItem?.quantity}
          </span>
          
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full hover:bg-gray-100"
            onClick={() => handleUpdateQuantity(cartItem, "plus")}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Subtotal & Delete */}
      <div className="flex flex-col items-end gap-2">
        <p className="font-bold text-gray-800">
          ${(
            (cartItem?.salePrice > 0 ? cartItem.salePrice : cartItem.price) *
            cartItem.quantity
          ).toFixed(2)}
        </p>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-gray-500 hover:text-red-500 hover:bg-red-50"
          onClick={() => handleCartItemDelete(cartItem)}
        >
          <Trash className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}

export default UserCartItemsContent;