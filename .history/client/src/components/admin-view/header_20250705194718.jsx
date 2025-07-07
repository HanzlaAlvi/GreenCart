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
    <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-4 bg-emerald-50 border-b border-emerald-100 shadow-sm">
      <Button 
        onClick={() => setOpen(true)} 
        variant="ghost"
        size="icon"
        className="lg:hidden sm:block rounded-full hover:bg-emerald-100 transition-colors text-emerald-600"
        aria-label="Toggle Menu"
      >
        <AlignJustify className="h-5 w-5" />
      </Button>
      
      <div className="flex flex-1 justify-end">
        <Button
          onClick={handleLogout}
          className="inline-flex gap-2 items-center rounded-full px-4 py-2 text-sm font-medium transition-all hover:shadow-md bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
      </div>
    </header>
  );
}

export default AdminHeader;