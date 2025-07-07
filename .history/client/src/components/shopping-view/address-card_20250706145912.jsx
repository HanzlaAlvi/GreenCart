import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { motion } from "framer-motion";

function AddressCard({
  addressInfo,
  handleDeleteAddress,
  handleEditAddress,
  setCurrentSelectedAddress,
  selectedId,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        onClick={
          setCurrentSelectedAddress
            ? () => setCurrentSelectedAddress(addressInfo)
            : null
        }
        className={`cursor-pointer transition-all ${
          selectedId?._id === addressInfo?._id
            ? "border-2 border-[#5E8B4F] shadow-lg"
            : "border-[#A7BC8A]/50 hover:border-[#5E8B4F]/70"
        }`}
      >
        <CardContent className="p-4 space-y-3">
          <div className="flex items-start gap-3">
            <div className="bg-[#5E8B4F]/10 p-2 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#5E8B4F"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">{addressInfo?.address}</h3>
              <p className="text-sm text-gray-600 mt-1">
                {addressInfo?.city}, {addressInfo?.pincode}
              </p>
              <div className="mt-3 space-y-1 text-sm">
                <p className="text-gray-700 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
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
                  <p className="text-gray-500 flex items-start gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
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
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex justify-end gap-2 border-t border-[#A7BC8A]/30">
          <Button
            variant="outline"
            className="text-[#5E8B4F] border-[#A7BC8A] hover:bg-[#FAF9F6]"
            onClick={(e) => {
              e.stopPropagation();
              handleEditAddress(addressInfo);
            }}
            size="sm"
          >
            Edit
          </Button>
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
        </CardFooter>
      </Card>
    </motion.div>
  );
}

export default AddressCard;