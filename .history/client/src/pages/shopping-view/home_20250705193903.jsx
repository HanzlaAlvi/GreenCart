import { Button } from "@/components/ui/button";
import {
  Airplay,
  BabyIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloudLightning,
  Heater,
  Images,
  Shirt,
  ShirtIcon,
  ShoppingBasket,
  UmbrellaIcon,
  WashingMachine,
  WatchIcon,
  Sparkles,
  Star,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { getFeatureImages } from "@/store/common-slice";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const categoriesWithIcon = [
  { id: "men", label: "Men", icon: ShirtIcon, color: "#3B82F6" },
  { id: "women", label: "Women", icon: CloudLightning, color: "#EC4899" },
  { id: "kids", label: "Kids", icon: BabyIcon, color: "#10B981" },
  { id: "accessories", label: "Accessories", icon: WatchIcon, color: "#F59E0B" },
  { id: "footwear", label: "Footwear", icon: UmbrellaIcon, color: "#8B5CF6" },
];

const brandsWithIcon = [
  { id: "nike", label: "Nike", icon: Shirt, color: "#000000" },
  { id: "adidas", label: "Adidas", icon: WashingMachine, color: "#005A9C" },
  { id: "puma", label: "Puma", icon: ShoppingBasket, color: "#FA4616" },
  { id: "levi", label: "Levi's", icon: Airplay, color: "#0056A3" },
  { id: "zara", label: "Zara", icon: Images, color: "#000000" },
  { id: "h&m", label: "H&M", icon: Heater, color: "#E50010" },
];

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const { productList, productDetails } = useSelector((state) => state.shopProducts);
  const { featureImageList } = useSelector((state) => state.commonFeature);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleNavigateToListingPage = (getCurrentItem, section) => {
    sessionStorage.removeItem("filters");
    const currentFilter = { [section]: [getCurrentItem.id] };
    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
  };

  const handleGetProductDetails = (getCurrentProductId) => {
    dispatch(fetchProductDetails(getCurrentProductId));
  };

  const handleAddtoCart = (getCurrentProductId) => {
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
          description: "Your item has been successfully added to your cart",
          action: (
            <Button variant="secondary" onClick={() => navigate("/shop/cart")}>
              View Cart
            </Button>
          ),
        });
      }
    });
  };

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length);
    }, 5000); // Reduced interval for better engagement

    return () => clearInterval(timer);
  }, [featureImageList]);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Carousel */}
      <motion.div 
        className="relative w-full h-[600px] overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {featureImageList?.map((slide, index) => (
          <motion.img
            key={index}
            src={slide?.image}
            initial={{ opacity: 0 }}
            animate={{
              opacity: index === currentSlide ? 1 : 0,
              scale: index === currentSlide ? 1 : 1.05
            }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
        ))}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        
        <motion.div 
          className="absolute bottom-20 left-0 right-0 text-center text-white z-10"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.div 
            className="inline-block mb-4"
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              repeat: Infinity, 
              repeatType: "reverse", 
              duration: 3 
            }}
          >
            <Sparkles className="w-12 h-12 text-yellow-300" />
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">New Collections</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Discover our latest products with exclusive offers</p>
          <motion.div whileHover={{ scale: 1.05 }}>
            <Button 
              size="lg" 
              className="bg-[#A7BC8A] hover:bg-[#5E8B4F] text-white"
              onClick={() => navigate("/shop/listing")}
            >
              Shop Now
            </Button>
          </motion.div>
        </motion.div>

        <motion.div 
          className="absolute bottom-4 left-0 right-0 flex justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {featureImageList?.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? 'bg-white w-6' : 'bg-white/50'}`}
            />
          ))}
        </motion.div>

        <motion.div whileHover={{ scale: 1.1 }}>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentSlide((prevSlide) => (prevSlide - 1 + featureImageList.length) % featureImageList.length)}
            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80 hover:bg-white"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.1 }}>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length)}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80 hover:bg-white"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </Button>
        </motion.div>
      </motion.div>

      {/* Categories Section */}
      <motion.section 
        className="py-16 bg-[#FAF9F6]"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Shop by Category</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our wide range of products across different categories
            </p>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categoriesWithIcon.map((categoryItem) => (
              <motion.div
                key={categoryItem.id}
                whileHover={{ y: -10 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card
                  onClick={() => handleNavigateToListingPage(categoryItem, "category")}
                  className="cursor-pointer hover:shadow-xl transition-all duration-300 border-0 rounded-xl overflow-hidden group"
                >
                  <CardContent className="flex flex-col items-center justify-center p-8 relative">
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ 
                        background: `radial-gradient(circle at center, ${categoryItem.color}20, transparent 70%)`
                      }}
                    />
                    <motion.div
                      className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                      style={{ backgroundColor: `${categoryItem.color}20` }}
                      whileHover={{ rotate: 15 }}
                    >
                      <categoryItem.icon 
                        className="w-10 h-10" 
                        style={{ color: categoryItem.color }} 
                      />
                    </motion.div>
                    <span className="font-bold text-lg">{categoryItem.label}</span>
                    <motion.div 
                      className="mt-2 text-sm text-gray-500"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      Shop now
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Brands Section */}
      <motion.section 
        className="py-16 bg-white"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Shop by Brand</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover products from your favorite brands
            </p>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {brandsWithIcon.map((brandItem) => (
              <motion.div
                key={brandItem.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card
                  onClick={() => handleNavigateToListingPage(brandItem, "brand")}
                  className="cursor-pointer hover:shadow-lg transition-all duration-300 border-0 rounded-xl overflow-hidden group"
                >
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <motion.div
                      className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                      style={{ backgroundColor: `${brandItem.color}10` }}
                    >
                      <brandItem.icon 
                        className="w-8 h-8" 
                        style={{ color: brandItem.color }} 
                      />
                    </motion.div>
                    <span className="font-bold">{brandItem.label}</span>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Featured Products */}
      <motion.section 
        className="py-16 bg-[#FAF9F6]"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
              <h2 className="text-3xl md:text-4xl font-bold">Featured Products</h2>
              <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked selection of premium products
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {productList?.map((productItem) => (
              <motion.div
                key={productItem.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <ShoppingProductTile
                  handleGetProductDetails={handleGetProductDetails}
                  product={productItem}
                  handleAddtoCart={handleAddtoCart}
                />
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
          >
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button 
                size="lg" 
                className="bg-[#A7BC8A] hover:bg-[#5E8B4F] text-white"
                onClick={() => navigate("/shop/listing")}
              >
                View All Products
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Special Offer Banner */}
      <motion.section 
        className="py-12 bg-[#5E8B4F] text-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4 text-center">
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              repeat: Infinity, 
              repeatType: "reverse", 
              duration: 3 
            }}
            className="inline-block mb-4"
          >
            <Sparkles className="w-10 h-10 text-yellow-300" />
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Special Limited Time Offer</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Get 20% off on all new arrivals this week only!</p>
          <motion.div whileHover={{ scale: 1.05 }}>
            <Button 
              variant="secondary" 
              size="lg"
              className="text-[#5E8B4F]"
              onClick={() => navigate("/shop/listing")}
            >
              Claim Your Discount
            </Button>
          </motion.div>
        </div>
      </motion.section>

      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingHome;