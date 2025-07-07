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
    <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-4 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <Button 
        onClick={() => setOpen(true)} 
        variant="ghost"
        size="icon"
        className="lg:hidden sm:block rounded-full hover:bg-gray-100 transition-colors"
        aria-label="Toggle Menu"
      >
        <AlignJustify className="h-5 w-5 text-gray-600" />
      </Button>
      
      <div className="flex flex-1 justify-end">
        <Button
          onClick={handleLogout}
          variant="outline"
          className="inline-flex gap-2 items-center rounded-full px-4 py-2 text-sm font-medium transition-all hover:shadow-md hover:bg-gray-50 border-gray-200"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
      </div>
    </header>
  );
}

export default AdminHeader;