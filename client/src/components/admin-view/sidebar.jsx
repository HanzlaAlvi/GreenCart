import {
  BadgeCheck,
  ChartNoAxesCombined,
  LayoutDashboard,
  ShoppingBasket,
  Sparkles,
} from "lucide-react";
import { Fragment } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const adminSidebarMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
    color: "text-[#5E8B4F]",
  },
  {
    id: "products",
    label: "Products",
    path: "/admin/products",
    icon: <ShoppingBasket className="w-5 h-5" />,
    color: "text-[#A7BC8A]",
  },
  {
    id: "orders",
    label: "Orders",
    path: "/admin/orders",
    icon: <BadgeCheck className="w-5 h-5" />,
    color: "text-[#4A7740]",
  },
];

function MenuItems({ setOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="mt-8 flex-col flex gap-1">
      {adminSidebarMenuItems.map((menuItem) => {
        const isActive = location.pathname === menuItem.path;
        return (
          <motion.div
            key={menuItem.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              navigate(menuItem.path);
              setOpen?.(false);
            }}
            className={cn(
              "flex cursor-pointer items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all",
              isActive
                ? "bg-[#5E8B4F]/10 text-[#5E8B4F]"
                : "text-muted-foreground hover:bg-[#FAF9F6] hover:text-[#5E8B4F]"
            )}
          >
            <span className={isActive ? menuItem.color : "text-current"}>
              {menuItem.icon}
            </span>
            <span>{menuItem.label}</span>
            {isActive && (
              <motion.div
                layoutId="activeIndicator"
                className="ml-auto h-2 w-2 rounded-full bg-[#5E8B4F]"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </motion.div>
        );
      })}
    </nav>
  );
}

function AdminSideBar({ open, setOpen }) {
  const navigate = useNavigate();

  return (
    <Fragment>
      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex flex-col h-full">
            <SheetHeader className="border-b border-[#A7BC8A]/20 px-6">
              <SheetTitle className="flex items-center gap-3 py-6">
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
                <motion.h1 
                  className="text-2xl font-bold bg-gradient-to-r from-[#5E8B4F] to-[#A7BC8A] bg-clip-text text-transparent"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  Admin Panel
                </motion.h1>
              </SheetTitle>
            </SheetHeader>
            <div className="px-4 py-2">
              <MenuItems setOpen={setOpen} />
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col border-r border-[#A7BC8A]/20 bg-[#FAF9F6] p-6 lg:flex">
        <motion.div
          onClick={() => navigate("/admin/dashboard")}
          className="flex cursor-pointer items-center gap-3 mb-8"
          whileHover={{ scale: 1.02 }}
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
            <Sparkles className="w-6 h-6 text-amber-400" />
          </motion.div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#5E8B4F] to-[#A7BC8A] bg-clip-text text-transparent">
            Admin Panel
          </h1>
        </motion.div>
        <MenuItems />
      </aside>
    </Fragment>
  );
}

export default AdminSideBar;