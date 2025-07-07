import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import accImg from "../../assets/account.jpg";
import Address from "@/components/shopping-view/address";
import ShoppingOrders from "@/components/shopping-view/orders";
import { motion } from "framer-motion";
import { Sparkles, Package, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

function ShoppingAccount() {
  return (
    <div className="flex flex-col">
      {/* Hero Banner */}
      <motion.div 
        className="relative h-[300px] w-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <img
          src={accImg}
          className="h-full w-full object-cover object-center"
          alt="Account background"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <motion.div 
          className="absolute bottom-8 left-0 right-0 container mx-auto px-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-3">
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
            <h1 className="text-3xl md:text-4xl font-bold text-white">My Account</h1>
          </div>
        </motion.div>
      </motion.div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-8">
        <motion.div
          className="grid grid-cols-1 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="overflow-hidden rounded-xl border border-[#A7BC8A]/20 bg-white shadow-lg">
            <Tabs defaultValue="orders">
              <TabsList className="bg-[#FAF9F6] px-6 pt-6">
                <motion.div className="flex space-x-2">
                  <TabsTrigger 
                    value="orders"
                    className="data-[state=active]:bg-[#5E8B4F] data-[state=active]:text-white"
                  >
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      <span>My Orders</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="address"
                    className="data-[state=active]:bg-[#5E8B4F] data-[state=active]:text-white"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>Address Book</span>
                    </div>
                  </TabsTrigger>
                </motion.div>
              </TabsList>
              
              <TabsContent value="orders" className="p-6">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <ShoppingOrders />
                </motion.div>
              </TabsContent>
              
              <TabsContent value="address" className="p-6">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Address />
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default ShoppingAccount;