import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import { addFeatureImage, getFeatureImages } from "@/store/common-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Sparkles, Trash2, ImagePlus } from "lucide-react";
import { cn } from "@/lib/utils";

function AdminDashboard() {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const dispatch = useDispatch();
  const { featureImageList } = useSelector((state) => state.commonFeature);

  function handleUploadFeatureImage() {
    setImageLoadingState(true);
    dispatch(addFeatureImage(uploadedImageUrl)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
        setImageFile(null);
        setUploadedImageUrl("");
      }
      setImageLoadingState(false);
    });
  }

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-3 mb-8"
      >
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
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#5E8B4F] to-[#A7BC8A] bg-clip-text text-transparent">
          Image Gallery Manager
        </h1>
      </motion.div>

      {/* Upload Section */}
      <motion.div 
        className="bg-white rounded-xl p-6 shadow-lg border border-[#A7BC8A]/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <ImagePlus className="w-5 h-5 text-[#5E8B4F]" />
          <h2 className="text-xl font-semibold text-gray-800">Upload New Feature Image</h2>
        </div>
        
        <ProductImageUpload
          imageFile={imageFile}
          setImageFile={setImageFile}
          uploadedImageUrl={uploadedImageUrl}
          setUploadedImageUrl={setUploadedImageUrl}
          setImageLoadingState={setImageLoadingState}
          imageLoadingState={imageLoadingState}
          isCustomStyling={true}
        />
        
        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
          <Button 
            onClick={handleUploadFeatureImage} 
            className={cn(
              "mt-4 w-full bg-[#5E8B4F] hover:bg-[#4A7740] text-white",
              "transition-all duration-300 shadow-md hover:shadow-lg",
              "flex items-center gap-2 py-6 text-lg"
            )}
            disabled={!uploadedImageUrl || imageLoadingState}
          >
            {imageLoadingState ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              />
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Upload Image</span>
              </>
            )}
          </Button>
        </motion.div>
      </motion.div>

      {/* Gallery Section */}
      <motion.div 
        className="mt-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3 text-gray-800">
          <Sparkles className="w-6 h-6 text-amber-400" />
          <span>Current Feature Images</span>
        </h2>
        
        {featureImageList?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureImageList.map((featureImgItem, index) => (
              <motion.div
                key={featureImgItem.id || index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="relative group rounded-xl overflow-hidden shadow-lg"
              >
                <img
                  src={featureImgItem.image}
                  className="w-full h-64 object-cover transition-all duration-500 group-hover:scale-105"
                  alt="Feature content"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <Button
                    variant="destructive"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Remove</span>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div 
            className="bg-[#FAF9F6] rounded-xl p-8 text-center border-2 border-dashed border-[#A7BC8A]/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Sparkles className="w-10 h-10 mx-auto text-[#A7BC8A] mb-4" />
            <h3 className="text-xl font-medium text-gray-600">No feature images yet</h3>
            <p className="text-gray-500 mt-2">Upload your first image to get started</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default AdminDashboard;