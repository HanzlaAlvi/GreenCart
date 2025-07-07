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

  const handleRatingChange = (getRating) => {
    setRating(getRating);
  };

  const handleAddToCart = (getCurrentProductId, getTotalStock) => {
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`,
            variant: "destructive",
          });
          return;
        }
      }
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
    if (productDetails !== null) dispatch(getReviews(productDetails?._id));
  }, [productDetails]);

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
        reviews.length
      : 0;

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[70vw] p-0 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-0"
        >
          {/* Product Image Section */}
          <motion.div 
            className="relative overflow-hidden bg-gradient-to-br from-[#5E8B4F]/10 to-[#A7BC8A]/10"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <motion.img
              src={productDetails?.image}
              alt={productDetails?.title}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="aspect-square w-full object-cover p-8"
            />
            <motion.div 
              className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/20 to-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            />
          </motion.div>

          {/* Product Details Section */}
          <motion.div 
            className="p-6 md:p-8 space-y-6 overflow-y-auto max-h-[80vh]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div>
              <motion.h1 
                className="text-3xl font-extrabold text-[#5E8B4F]"
                initial={{ x: -20 }}
                animate={{ x: 0 }}
                transition={{ type: "spring" }}
              >
                {productDetails?.title}
              </motion.h1>
              <motion.p 
                className="text-[#5E8B4F]/80 text-lg mb-5 mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {productDetails?.description}
              </motion.p>
            </div>

            {/* Price Section */}
            <motion.div 
              className="flex items-center justify-between"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <p className={`text-3xl font-bold text-[#5E8B4F] ${productDetails?.salePrice > 0 ? "line-through" : ""}`}>
                ${productDetails?.price}
              </p>
              {productDetails?.salePrice > 0 && (
                <motion.p 
                  className="text-2xl font-bold text-[#4A7740]"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring" }}
                >
                  ${productDetails?.salePrice}
                </motion.p>
              )}
            </motion.div>

            {/* Rating Section */}
            <motion.div 
              className="flex items-center gap-2 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center gap-0.5">
                <StarRatingComponent 
                  rating={averageReview} 
                  starColor="#5E8B4F"
                  starSize={24}
                />
              </div>
              <span className="text-[#5E8B4F]/80">
                ({averageReview.toFixed(2)})
              </span>
            </motion.div>

            {/* Add to Cart Button */}
            <motion.div 
              className="mt-5 mb-5"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {productDetails?.totalStock === 0 ? (
                <Button 
                  className="w-full bg-[#A7BC8A]/60 text-white cursor-not-allowed"
                  disabled
                >
                  Out of Stock
                </Button>
              ) : (
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    className="w-full bg-[#5E8B4F] hover:bg-[#4A7740] text-white shadow-lg hover:shadow-[#5E8B4F]/40 transition-all"
                    onClick={() => handleAddToCart(productDetails?._id, productDetails?.totalStock)}
                  >
                    Add to Cart
                  </Button>
                </motion.div>
              )}
            </motion.div>

            <Separator className="bg-[#A7BC8A]/30" />

            {/* Reviews Section */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <h2 className="text-xl font-bold text-[#5E8B4F]">Customer Reviews</h2>
              
              <div className="space-y-6 max-h-[200px] overflow-y-auto pr-2">
                {reviews && reviews.length > 0 ? (
                  <AnimatePresence>
                    {reviews.map((reviewItem) => (
                      <motion.div 
                        key={reviewItem._id}
                        className="flex gap-4 p-3 rounded-lg hover:bg-[#A7BC8A]/10 transition-colors"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        layout
                      >
                        <Avatar className="w-10 h-10 border border-[#A7BC8A]/30">
                          <AvatarFallback className="bg-[#A7BC8A]/10 text-[#5E8B4F]">
                            {reviewItem?.userName[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-[#5E8B4F]">{reviewItem?.userName}</h3>
                            <span className="text-xs text-[#5E8B4F]/60">
                              {new Date(reviewItem.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-0.5">
                            <StarRatingComponent 
                              rating={reviewItem?.reviewValue} 
                              starColor="#5E8B4F"
                              starSize={16}
                            />
                          </div>
                          <p className="text-[#5E8B4F]/80">{reviewItem.reviewMessage}</p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                ) : (
                  <motion.p 
                    className="text-[#5E8B4F]/60 text-center py-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    No reviews yet. Be the first to review!
                  </motion.p>
                )}
              </div>

              {/* Add Review Section */}
              <motion.div 
                className="mt-8 space-y-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                <Label className="text-[#5E8B4F]">Write Your Review</Label>
                <div className="flex gap-1">
                  <StarRatingComponent
                    rating={rating}
                    handleRatingChange={handleRatingChange}
                    starColor="#5E8B4F"
                    starSize={28}
                  />
                </div>
                <Input
                  name="reviewMsg"
                  value={reviewMsg}
                  onChange={(e) => setReviewMsg(e.target.value)}
                  placeholder="Share your experience with this product..."
                  className="border-[#A7BC8A]/50 focus:border-[#5E8B4F] focus:ring-[#5E8B4F]/30"
                />
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={handleAddReview}
                    disabled={reviewMsg.trim() === "" || rating === 0}
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