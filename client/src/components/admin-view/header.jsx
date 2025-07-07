import { AlignJustify, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/store/auth-slice";

function AdminHeader({ setOpen }) {
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser());
  }

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-4 bg-[#FAF9F6] border-b border-[#A7BC8A]/30 shadow-sm">
      <Button 
        onClick={() => setOpen(true)} 
        variant="ghost"
        size="icon"
        className="lg:hidden sm:block rounded-full hover:bg-[#A7BC8A]/20 transition-colors text-[#5E8B4F]"
        aria-label="Toggle Menu"
      >
        <AlignJustify className="h-5 w-5" />
      </Button>
      
      <div className="flex flex-1 justify-end">
        <Button
          onClick={handleLogout}
          className="inline-flex gap-2 items-center rounded-full px-4 py-2 text-sm font-medium transition-all hover:shadow-md bg-[#5E8B4F] hover:bg-[#4A7740] text-white"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
      </div>
    </header>
  );
}

export default AdminHeader;