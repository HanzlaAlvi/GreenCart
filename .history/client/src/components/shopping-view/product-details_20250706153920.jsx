import { motion, AnimatePresence } from "framer-motion";
import { StarIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";
import { setProductDetails } from "@/store/shop/products-slice";
import { Label } from "../ui/label";
import StarRatingComponent from "../common/star-rating";
import { useEffect, useState } from "react";
import { addReview, getReviews } from "@/store/shop/review-slice";

function ProductDetailsDialog({ open, setOpen, productDetails }) {
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview);
  const { toast } = useToast();

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
        reviews.length
      : 0;

  const handleRatingChange = (getRating) => setRating(getRating);

  const handleAddToCart = (getCurrentProductId, getTotalStock) => {
    const getCartItems = cartItems.items || [];
    const indexOfCurrentItem = getCartItems.findIndex(
      (item) => item.productId === getCurrentProductId
    );

    if (indexOfCurrentItem > -1 && getCartItems[indexOfCurrentItem].quantity + 1 > getTotalStock) {
      toast({
        title: `Only ${getCartItems[indexOfCurrentItem].quantity} quantity can be added`,
        variant: "destructive",
      });
      return;
    }

    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product added to cart",
          className: "bg-[#5E8B4F] text-white border-[#5E8B4F]",
        });
      }
    });
  };

  const handleDialogClose = () => {
    setOpen(false);
    dispatch(setProductDetails());
    setRating(0);
    setReviewMsg("");
  };

  const handleAddReview = () => {
    dispatch(
      addReview({
        productId: productDetails?._id,
        userId: user?.id,
        userName: user?.userName,
        reviewMessage: reviewMsg,
        reviewValue: rating,
      })
    ).then((data) => {
      if (data.payload.success) {
        setRating(0);
        setReviewMsg("");
        dispatch(getReviews(productDetails?._id));
        toast({
          title: "Review added successfully!",
          className: "bg-[#5E8B4F] text-white border-[#5E8B4F]",
        });
      }
    });
  };

  useEffect(() => {
    if (productDetails) dispatch(getReviews(productDetails?._id));
  }, [productDetails]);

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="p-0 max-w-[95vw] h-[90vh] flex flex-col overflow-hidden">
        <motion.div 
          className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-0 h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Image Section */}
          <motion.div 
            className="relative flex items-center justify-center bg-gradient-to-br from-[#5E8B4F]/10 to-[#A7BC8A]/10"
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <motion.img
              src={productDetails?.image}
              alt={productDetails?.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="max-h-full max-w-full object-contain p-8"
            />
          </motion.div>

          {/* Details Section */}
          <motion.div 
            className="flex flex-col p-6 space-y-4 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="space-y-2">
              <motion.h1 
                className="text-2xl font-bold text-[#5E8B4F]"
                initial={{ x: -20 }}
                animate={{ x: 0 }}
              >
                {productDetails?.title}
              </motion.h1>
              <motion.p 
                className="text-[#5E8B4F]/80 text-sm line-clamp-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {productDetails?.description}
              </motion.p>
            </div>

            <motion.div 
              className="flex items-center justify-between py-2"
              initial={{ y: 10 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <p className={`text-xl font-bold text-[#5E8B4F] ${productDetails?.salePrice > 0 ? "line-through" : ""}`}>
                ${productDetails?.price}
              </p>
              {productDetails?.salePrice > 0 && (
                <p className="text-xl font-bold text-[#4A7740]">
                  ${productDetails?.salePrice}
                </p>
              )}
            </motion.div>

            <motion.div 
              className="flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <StarRatingComponent 
                rating={averageReview} 
                starColor="#5E8B4F"
                starSize={18}
              />
              <span className="text-sm text-[#5E8B4F]/80">
                ({averageReview.toFixed(1)})
              </span>
            </motion.div>

            <motion.div 
              className="py-2"
              initial={{ y: 10 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {productDetails?.totalStock === 0 ? (
                <Button className="w-full bg-[#A7BC8A]/60 text-white" disabled>
                  Out of Stock
                </Button>
              ) : (
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    className="w-full bg-[#5E8B4F] hover:bg-[#4A7740] text-white"
                    onClick={() => handleAddToCart(productDetails?._id, productDetails?.totalStock)}
                  >
                    Add to Cart
                  </Button>
                </motion.div>
              )}
            </motion.div>

            <Separator className="bg-[#A7BC8A]/30" />

            {/* Compact Reviews Section */}
            <motion.div 
              className="flex-1 flex flex-col space-y-4 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <h3 className="text-lg font-semibold text-[#5E8B4F]">Reviews</h3>
              
              <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                {reviews?.length > 0 ? (
                  <AnimatePresence>
                    {reviews.slice(0, 3).map((reviewItem) => (
                      <motion.div 
                        key={reviewItem._id}
                        className="p-2 rounded-lg hover:bg-[#A7BC8A]/10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        layout
                      >
                        <div className="flex items-center gap-2">
                          <Avatar className="w-8 h-8 border border-[#A7BC8A]/30">
                            <AvatarFallback className="bg-[#A7BC8A]/10 text-[#5E8B4F] text-xs">
                              {reviewItem?.userName[0].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-medium text-[#5E8B4F] truncate">
                                {reviewItem?.userName}
                              </h4>
                              <StarRatingComponent 
                                rating={reviewItem?.reviewValue} 
                                starColor="#5E8B4F"
                                starSize={12}
                              />
                            </div>
                            <p className="text-xs text-[#5E8B4F]/80 truncate">
                              {reviewItem.reviewMessage}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                ) : (
                  <p className="text-sm text-[#5E8B4F]/60 text-center py-2">
                    No reviews yet
                  </p>
                )}
              </div>

              {/* Compact Review Form */}
              <motion.div 
                className="pt-2 space-y-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <Label className="text-sm text-[#5E8B4F]">Your Review</Label>
                <div className="flex items-center gap-1">
                  <StarRatingComponent
                    rating={rating}
                    handleRatingChange={handleRatingChange}
                    starColor="#5E8B4F"
                    starSize={20}
                  />
                </div>
                <Input
                  value={reviewMsg}
                  onChange={(e) => setReviewMsg(e.target.value)}
                  placeholder="Brief review..."
                  className="text-sm h-8 border-[#A7BC8A]/50"
                />
                <motion.div whileHover={{ scale: 1.02 }}>
                  <Button
                    onClick={handleAddReview}
                    disabled={!reviewMsg.trim() || rating === 0}
                    className="w-full h-8 text-sm bg-[#5E8B4F] hover:bg-[#4A7740]"
                  >
                    Submit
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialog;