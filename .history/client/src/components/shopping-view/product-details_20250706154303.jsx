import { motion, AnimatePresence } from "framer-motion";
import { Star, MessageSquare, ShoppingCart } from "lucide-react";
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
    reviews?.length > 0
      ? reviews.reduce((sum, review) => sum + review.reviewValue, 0) / reviews.length
      : 0;

  const handleAddToCart = (productId, stock) => {
    const cartItem = cartItems.items?.find(item => item.productId === productId);
    if (cartItem?.quantity + 1 > stock) {
      toast({
        title: `Only ${stock - cartItem.quantity} more can be added`,
        variant: "destructive",
      });
      return;
    }

    dispatch(addToCart({ userId: user?.id, productId, quantity: 1 }))
      .then(({ payload }) => payload?.success && (
        dispatch(fetchCartItems(user?.id)),
        toast({
          title: "Added to cart",
          className: "bg-[#5E8B4F] text-white border-[#5E8B4F]",
        })
      ));
  };

  const handleAddReview = () => {
    dispatch(addReview({
      productId: productDetails?._id,
      userId: user?.id,
      userName: user?.userName,
      reviewMessage: reviewMsg,
      reviewValue: rating,
    })).then(({ payload }) => payload?.success && (
      setRating(0),
      setReviewMsg(""),
      dispatch(getReviews(productDetails?._id)),
      toast({
        title: "Review added!",
        className: "bg-[#5E8B4F] text-white border-[#5E8B4F]",
      })
    ));
  };

  useEffect(() => {
    if (productDetails) dispatch(getReviews(productDetails._id));
  }, [productDetails]);

  return (
    <Dialog open={open} onOpenChange={() => {
      setOpen(false);
      dispatch(setProductDetails());
      setRating(0);
      setReviewMsg("");
    }}>
      <DialogContent className="p-0 max-w-[95vw] w-full h-[90vh] sm:h-[85vh] md:h-[80vh] overflow-hidden rounded-2xl border-0">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 h-full"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Stunning Image Panel */}
          <motion.div 
            className="relative flex items-center justify-center bg-gradient-to-br from-[#5E8B4F]/5 to-[#A7BC8A]/10"
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.img
              src={productDetails?.image}
              alt={productDetails?.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="max-h-[70%] max-w-[90%] object-contain rounded-xl shadow-lg"
            />
            <motion.div 
              className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/30 to-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            />
          </motion.div>

          {/* Elegant Details Panel */}
          <motion.div 
            className="flex flex-col p-6 md:p-8 space-y-6 overflow-y-auto"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="space-y-3">
              <motion.h1 
                className="text-2xl md:text-3xl font-bold text-[#5E8B4F]"
                initial={{ y: -10 }}
                animate={{ y: 0 }}
                transition={{ type: "spring" }}
              >
                {productDetails?.title}
              </motion.h1>
              <motion.p 
                className="text-[#5E8B4F]/80 text-sm md:text-base line-clamp-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {productDetails?.description}
              </motion.p>
            </div>

            {/* Price with Bounce Animation */}
            <motion.div 
              className="flex items-center justify-between py-2"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.4 }}
            >
              <p className={`text-2xl font-bold text-[#5E8B4F] ${productDetails?.salePrice > 0 ? "line-through" : ""}`}>
                ${productDetails?.price}
              </p>
              {productDetails?.salePrice > 0 && (
                <motion.p 
                  className="text-2xl font-bold text-[#4A7740]"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500 }}
                >
                  ${productDetails?.salePrice}
                </motion.p>
              )}
            </motion.div>

            {/* Rating with Sparkle Effect */}
            <motion.div 
              className="flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center gap-1">
                <StarRatingComponent 
                  rating={averageReview} 
                  starColor="#5E8B4F"
                  starSize={20}
                />
              </div>
              <span className="text-sm text-[#5E8B4F]/80">
                ({averageReview.toFixed(1)})
              </span>
              {averageReview >= 4 && (
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="ml-1"
                >
                  <Star className="w-4 h-4 fill-[#FFD700] text-[#FFD700]" />
                </motion.div>
              )}
            </motion.div>

            {/* Add to Cart Button with Hover Glow */}
            <motion.div 
              className="py-2"
              initial={{ y: 10 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {productDetails?.totalStock === 0 ? (
                <Button 
                  className="w-full bg-[#A7BC8A]/60 text-white"
                  disabled
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Out of Stock
                </Button>
              ) : (
                <motion.div 
                  whileHover={{ scale: 1.02 }} 
                  whileTap={{ scale: 0.98 }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-[#5E8B4F] rounded-lg blur-md opacity-0 group-hover:opacity-50 transition-opacity" />
                  <Button
                    className="w-full bg-[#5E8B4F] hover:bg-[#4A7740] text-white relative z-10 shadow-md hover:shadow-[#5E8B4F]/40"
                    onClick={() => handleAddToCart(productDetails?._id, productDetails?.totalStock)}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                </motion.div>
              )}
            </motion.div>

            <Separator className="bg-[#A7BC8A]/30" />

            {/* Reviews Section with Floating Cards */}
            <motion.div 
              className="flex-1 flex flex-col space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#5E8B4F]" />
                <h3 className="text-lg font-semibold text-[#5E8B4F]">Customer Reviews</h3>
              </div>
              
              <div className="space-y-4 max-h-[180px] overflow-y-auto pr-2">
                {reviews?.length > 0 ? (
                  <AnimatePresence>
                    {reviews.slice(0, 3).map((review) => (
                      <motion.div 
                        key={review._id}
                        className="p-3 rounded-lg border border-[#A7BC8A]/30 hover:bg-[#A7BC8A]/5 transition-all"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        whileHover={{ y: -2 }}
                        layout
                      >
                        <div className="flex gap-3">
                          <Avatar className="w-9 h-9 border border-[#A7BC8A]/30">
                            <AvatarFallback className="bg-[#A7BC8A]/10 text-[#5E8B4F]">
                              {review.userName[0].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-medium text-[#5E8B4F] truncate">
                                {review.userName}
                              </h4>
                              <StarRatingComponent 
                                rating={review.reviewValue} 
                                starColor="#5E8B4F"
                                starSize={14}
                              />
                            </div>
                            <p className="text-sm text-[#5E8B4F]/80 mt-1 line-clamp-2">
                              {review.reviewMessage}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                ) : (
                  <motion.p 
                    className="text-center py-4 text-[#5E8B4F]/60"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    No reviews yet. Be the first!
                  </motion.p>
                )}
              </div>

              {/* Review Form with Floating Labels */}
              <motion.div 
                className="pt-2 space-y-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                <Label className="text-sm text-[#5E8B4F] flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Write Your Review
                </Label>
                <div className="flex items-center gap-1">
                  <StarRatingComponent
                    rating={rating}
                    handleRatingChange={setRating}
                    starColor="#5E8B4F"
                    starSize={22}
                  />
                </div>
                <Input
                  value={reviewMsg}
                  onChange={(e) => setReviewMsg(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="border-[#A7BC8A]/50 focus:border-[#5E8B4F] focus:ring-[#5E8B4F]/30"
                />
                <motion.div 
                  whileHover={{ scale: 1.02 }} 
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={handleAddReview}
                    disabled={!reviewMsg.trim() || rating === 0}
                    className="w-full bg-[#5E8B4F] hover:bg-[#4A7740] text-white"
                  >
                    Submit Review
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