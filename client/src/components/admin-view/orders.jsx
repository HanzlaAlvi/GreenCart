import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog } from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import AdminOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  resetOrderDetails,
} from "@/store/admin/order-slice";
import { Badge } from "../ui/badge";
import { motion } from "framer-motion";
import { Sparkles, Eye, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

function AdminOrdersView() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const { orderList, orderDetails } = useSelector((state) => state.adminOrder);
  const dispatch = useDispatch();

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetailsForAdmin(getId));
  }

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedOrders = [...(orderList || [])].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  useEffect(() => {
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-[#FAF9F6] rounded-t-lg">
          <div className="flex items-center justify-between">
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
                <Sparkles className="w-6 h-6 text-amber-400" />
              </motion.div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-[#5E8B4F] to-[#A7BC8A] bg-clip-text text-transparent">
                Order Management
              </CardTitle>
            </div>
            <Badge variant="outline" className="border-[#A7BC8A] text-[#5E8B4F]">
              {orderList?.length || 0} Orders
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-[#FAF9F6]">
              <TableRow className="hover:bg-transparent">
                <TableHead>
                  <button 
                    onClick={() => handleSort('_id')}
                    className="flex items-center gap-1 font-semibold"
                  >
                    Order ID
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </TableHead>
                <TableHead>
                  <button 
                    onClick={() => handleSort('orderDate')}
                    className="flex items-center gap-1 font-semibold"
                  >
                    Order Date
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </TableHead>
                <TableHead>
                  <button 
                    onClick={() => handleSort('orderStatus')}
                    className="flex items-center gap-1 font-semibold"
                  >
                    Status
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </TableHead>
                <TableHead>
                  <button 
                    onClick={() => handleSort('totalAmount')}
                    className="flex items-center gap-1 font-semibold"
                  >
                    Amount
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </TableHead>
                <TableHead className="text-right">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedOrders?.length > 0 ? (
                sortedOrders.map((orderItem, index) => (
                  <motion.tr
                    key={orderItem._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b hover:bg-[#FAF9F6]"
                  >
                    <TableCell className="font-medium">
                      #{orderItem._id.slice(-6).toUpperCase()}
                    </TableCell>
                    <TableCell>
                      {new Date(orderItem.orderDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          "py-1 px-3 text-white capitalize",
                          orderItem.orderStatus === "confirmed" && "bg-green-500",
                          orderItem.orderStatus === "rejected" && "bg-red-500",
                          orderItem.orderStatus === "pending" && "bg-amber-500",
                          orderItem.orderStatus === "shipped" && "bg-blue-500",
                          orderItem.orderStatus === "delivered" && "bg-purple-500"
                        )}
                      >
                        {orderItem.orderStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold">
                      ${orderItem.totalAmount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog
                        open={openDetailsDialog}
                        onOpenChange={() => {
                          setOpenDetailsDialog(false);
                          dispatch(resetOrderDetails());
                        }}
                      >
                        <motion.div whileHover={{ scale: 1.05 }}>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleFetchOrderDetails(orderItem._id)}
                            className="flex items-center gap-2 border-[#A7BC8A] text-[#5E8B4F] hover:bg-[#A7BC8A]/10"
                          >
                            <Eye className="w-4 h-4" />
                            Details
                          </Button>
                        </motion.div>
                        <AdminOrderDetailsView orderDetails={orderDetails} />
                      </Dialog>
                    </TableCell>
                  </motion.tr>
                ))
              ) : (
                <motion.tr
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <TableCell colSpan={5} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center py-8">
                      <Sparkles className="w-10 h-10 text-[#A7BC8A] mb-4" />
                      <p className="text-gray-500">No orders found</p>
                    </div>
                  </TableCell>
                </motion.tr>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default AdminOrdersView;