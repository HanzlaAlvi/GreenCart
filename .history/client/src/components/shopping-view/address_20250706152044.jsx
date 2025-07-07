import { useEffect, useState } from "react";
import CommonForm from "../common/form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { addressFormControls } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewAddress,
  deleteAddress,
  editaAddress,
  fetchAllAddresses,
} from "@/store/shop/address-slice";
import AddressCard from "./address-card";
import { useToast } from "../ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";

const initialAddressFormData = {
  address: "",
  city: "",
  phone: "",
  pincode: "",
  notes: "",
};

function Address({ setCurrentSelectedAddress, selectedId }) {
  const [formData, setFormData] = useState(initialAddressFormData);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { addressList } = useSelector((state) => state.shopAddress);
  const { toast } = useToast();

  async function handleManageAddress(event) {
    event.preventDefault();
    setIsEditing(true);

    if (addressList.length >= 3 && currentEditedId === null) {
      setFormData(initialAddressFormData);
      toast({
        title: "Address Limit Reached",
        description: "You can add maximum 3 addresses",
        variant: "destructive",
      });
      setIsEditing(false);
      return;
    }

    try {
      const action = currentEditedId 
        ? editaAddress({ userId: user?.id, addressId: currentEditedId, formData })
        : addNewAddress({ ...formData, userId: user?.id });

      const result = await dispatch(action).unwrap();

      if (result.success) {
        await dispatch(fetchAllAddresses(user?.id));
        setFormData(initialAddressFormData);
        setCurrentEditedId(null);
        toast({
          title: currentEditedId ? "Address Updated" : "Address Added",
          description: currentEditedId 
            ? "Your address has been updated successfully"
            : "New address added to your account",
          className: "bg-[#5E8B4F] text-white border-[#5E8B4F]",
        });
      }
    } catch (error) {
      toast({
        title: "Operation Failed",
        description: error.message || "Could not complete the operation",
        variant: "destructive",
      });
    } finally {
      setIsEditing(false);
    }
  }

  async function handleDeleteAddress(getCurrentAddress) {
    try {
      const result = await dispatch(
        deleteAddress({ userId: user?.id, addressId: getCurrentAddress._id })
      ).unwrap();

      if (result.success) {
        await dispatch(fetchAllAddresses(user?.id));
        toast({
          title: "Address Removed",
          description: "The address has been deleted successfully",
          className: "bg-[#5E8B4F] text-white border-[#5E8B4F]",
        });
      }
    } catch (error) {
      toast({
        title: "Deletion Failed",
        description: error.message || "Could not delete the address",
        variant: "destructive",
      });
    }
  }

  function handleEditAddress(getCurrentAddress) {
    setCurrentEditedId(getCurrentAddress?._id);
    setFormData({
      address: getCurrentAddress?.address || "",
      city: getCurrentAddress?.city || "",
      phone: getCurrentAddress?.phone || "",
      pincode: getCurrentAddress?.pincode || "",
      notes: getCurrentAddress?.notes || "",
    });
  }

  function isFormValid() {
    return (
      formData.address.trim() !== "" &&
      formData.city.trim() !== "" &&
      formData.phone.trim() !== "" &&
      formData.pincode.trim() !== ""
    );
  }

  useEffect(() => {
    dispatch(fetchAllAddresses(user?.id));
  }, [dispatch, user?.id]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto"
    >
      <Card className="border-[#A7BC8A]/30 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-[#5E8B4F]/10 to-[#A7BC8A]/10 rounded-t-lg border-b border-[#A7BC8A]/30">
          <CardTitle className="text-[#5E8B4F] text-2xl font-semibold">
            {currentEditedId ? "Edit Address" : "Add New Address"}
            <motion.div 
              className="h-1 w-12 bg-[#5E8B4F] mt-2 rounded-full"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5 }}
            />
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6">
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8"
            layout
          >
            <AnimatePresence>
              {addressList?.map((singleAddressItem) => (
                <AddressCard
                  key={singleAddressItem._id}
                  selectedId={selectedId}
                  handleDeleteAddress={handleDeleteAddress}
                  addressInfo={singleAddressItem}
                  handleEditAddress={handleEditAddress}
                  setCurrentSelectedAddress={setCurrentSelectedAddress}
                  isEditing={isEditing && currentEditedId === singleAddressItem._id}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden bg-[#FAF9F6] p-6 rounded-lg border border-[#A7BC8A]/20"
          >
            <CommonForm
              formControls={addressFormControls}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId ? "Update Address" : "Add Address"}
              onSubmit={handleManageAddress}
              isBtnDisabled={!isFormValid() || isEditing}
              buttonClassName="bg-[#5E8B4F] hover:bg-[#4A7740] text-white"
              fieldClassName="border-[#A7BC8A]/50 focus:border-[#5E8B4F] focus:ring-[#5E8B4F]/30"
            />
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default Address;