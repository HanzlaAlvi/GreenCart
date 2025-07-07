import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useState } from "react";

function AddressCard({
  addressInfo,
  handleDeleteAddress,
  handleEditAddress,
  setCurrentSelectedAddress,
  selectedId,
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative"
    >
      {/* Floating decoration elements */}
      {isHovered && (
        <>
          <motion.div
            className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-[#5E8B4F]"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
          />
          <motion.div
            className="absolute -bottom-2 -left-2 w-4 h-4 rounded-full bg-[#A7BC8A]"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          />
        </>
      )}

      <Card
        onClick={
          setCurrentSelectedAddress
            ? () => setCurrentSelectedAddress(addressInfo)
            : null
        }
        className={`relative overflow-hidden cursor-pointer transition-all duration-300 ${
          selectedId?._id === addressInfo?._id
            ? "border-2 border-[#5E8B4F] shadow-lg bg-gradient-to-br from-[#5E8B4F]/5 to-[#A7BC8A]/5"
            : "border-[#A7BC8A]/30 hover:border-[#5E8B4F]/50 bg-white"
        }`}
      >
        {/* Animated background effect when selected */}
        {selectedId?._id === addressInfo?._id && (
          <motion.div
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,#5E8B4F/5%,transparent_70%)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
        )}

        <CardContent className="p-6">
          <motion.div 
            className="flex items-start gap-4"
            animate={{
              x: isHovered ? 5 : 0
            }}
          >
            <motion.div
              className="flex-shrink-0"
              animate={{
                rotate: isHovered ? [0, 10, -10, 0] : 0,
                scale: isHovered ? 1.1 : 1
              }}
              transition={{
                duration: 0.8,
                repeat: isHovered ? Infinity : 0
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke={selectedId?._id === addressInfo?._id ? "#5E8B4F" : "#A7BC8A"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </motion.div>

            <div className="space-y-2">
              <motion.h3 
                className="font-bold text-lg text-gray-800"
                animate={{
                  color: selectedId?._id === addressInfo?._id ? "#5E8B4F" : "#1f2937"
                }}
              >
                {addressInfo?.address}
              </motion.h3>
              
              <motion.p 
                className="text-gray-600 flex items-center gap-2"
                animate={{
                  x: isHovered ? 3 : 0
                }}
                transition={{ delay: 0.1 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#5E8B4F"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                {addressInfo?.city}, {addressInfo?.pincode}
              </motion.p>

              <motion.div 
                className="pt-2 space-y-1"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                <p className="text-gray-700 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#5E8B4F"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  {addressInfo?.phone}
                </p>
                
                {addressInfo?.notes && (
                  <motion.p 
                    className="text-gray-500 flex items-start gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#5E8B4F"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                    {addressInfo?.notes}
                  </motion.p>
                )}
              </motion.div>
            </div>
          </motion.div>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex justify-end gap-2">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="outline"
              className="text-[#5E8B4F] border-[#A7BC8A] hover:bg-[#FAF9F6] hover:text-[#4A7740]"
              onClick={(e) => {
                e.stopPropagation();
                handleEditAddress(addressInfo);
              }}
              size="sm"
            >
              Edit
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="outline"
              className="text-red-500 border-red-200 hover:bg-red-50"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteAddress(addressInfo);
              }}
              size="sm"
            >
              Delete
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

export default AddressCard;