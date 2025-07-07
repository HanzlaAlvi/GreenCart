import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { loginFormControls } from "@/config";
import { loginUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Mail, Smartphone, Monitor } from "lucide-react";

const initialState = {
  email: "",
  password: "",
};

function AuthLogin() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function onSubmit(event) {
    event.preventDefault();
    dispatch(loginUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast({ title: data?.payload?.message });
      } else {
        toast({ title: data?.payload?.message, variant: "destructive" });
      }
    });
  }

  // Color palette
  const colors = {
    primary: "#A7BC8A",
    dark: "#5E8B4F",
    light: "#D1E2C4",
    text: "#2D3748",
    background: "#F8FAF5"
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen flex items-center justify-center p-4 md:p-8"
      style={{ backgroundColor: colors.background }}
    >
      {/* Main Container - responsive width */}
      <div className="w-full max-w-[400px] md:max-w-[800px]">
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row"
        >
          {/* Left Side - Only visible on desktop */}
          <div 
            className="hidden md:flex md:w-1/2 items-center justify-center p-8"
            style={{ backgroundColor: colors.primary }}
          >
            <div className="text-center text-white space-y-6">
              <motion.div
                whileHover={{ rotate: 5 }}
                className="mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-6 bg-white/20"
              >
                <Monitor size={40} className="text-white" />
              </motion.div>
              <h2 className="text-3xl font-bold">Welcome Back!</h2>
              <p className="text-white/90">
                Sign in to access your personalized dashboard and manage your account.
              </p>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full md:w-1/2 p-6 md:p-10">
            {/* Mobile-only logo */}
            <div className="md:hidden flex justify-center mb-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ backgroundColor: colors.light }}
              >
                <Lock size={28} style={{ color: colors.primary }} />
              </motion.div>
            </div>

            <h1 
              className="text-2xl md:text-3xl font-bold text-center mb-2"
              style={{ color: colors.text }}
            >
              Sign in to your account
            </h1>
            
            <p className="text-center text-gray-600 mb-6 md:mb-8">
              {window.innerWidth < 768 ? "Enter your details to continue" : "Please enter your credentials to access your account"}
            </p>

            <CommonForm
              formControls={loginFormControls}
              buttonText={"Sign In"}
              formData={formData}
              setFormData={setFormData}
              onSubmit={onSubmit}
              customClasses={{
                button: `w-full py-3 rounded-lg font-medium transition-colors hover:bg-[${colors.dark}]`,
                input: `pl-10 border-[${colors.light}] focus:ring-[${colors.primary}]`,
              }}
            />

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded"
                  style={{ 
                    borderColor: colors.light,
                    accentColor: colors.primary
                  }}
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm"
                  style={{ color: colors.text }}
                >
                  Remember me
                </label>
              </div>

              <Link
                to="/auth/forgot-password"
                className="text-sm font-medium hover:underline"
                style={{ color: colors.primary }}
              >
                Forgot password?
              </Link>
            </div>

            {/* Social login - different layout for mobile/desktop */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t" style={{ borderColor: colors.light }}></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className={`grid ${window.innerWidth < 768 ? 'grid-cols-2' : 'grid-cols-2 gap-4'} mt-6`}>
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 w-full py-2 px-4 border rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
                  style={{ borderColor: colors.light }}
                >
                  <img 
                    src="https://www.svgrepo.com/show/355037/google.svg" 
                    alt="Google" 
                    className="h-5 w-5"
                  />
                  {window.innerWidth > 768 && 'Google'}
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 w-full py-2 px-4 border rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
                  style={{ borderColor: colors.light }}
                >
                  <img 
                    src="https://www.svgrepo.com/show/448234/facebook.svg" 
                    alt="Facebook" 
                    className="h-5 w-5"
                  />
                  {window.innerWidth > 768 && 'Facebook'}
                </button>
              </div>
            </div>

            <p className="text-center text-sm text-gray-600 mt-6">
              Don't have an account?{' '}
              <Link
                to="/auth/register"
                className="font-medium hover:underline"
                style={{ color: colors.primary }}
              >
                Register now
              </Link>
            </p>

            {/* Device indicator - for demo purposes */}
            <div className="mt-6 flex justify-center items-center gap-2 text-xs text-gray-400">
              {window.innerWidth < 768 ? (
                <>
                  <Smartphone size={14} />
                  <span>Mobile View</span>
                </>
              ) : (
                <>
                  <Monitor size={14} />
                  <span>Desktop View</span>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default AuthLogin;