import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { loginFormControls } from "@/config";
import { loginUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Mail } from "lucide-react";

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
        toast({
          title: data?.payload?.message,
        });
      } else {
        toast({
          title: data?.payload?.message,
          variant: "destructive",
        });
      }
    });
  }

  // Color palette
  const colors = {
    primary: "#A7BC8A",  // Pistachio green
    dark: "#5E8B4F",     // Dark green
    light: "#D1E2C4",    // Light pistachio
    accent: "#FFD166",   // Golden yellow
    text: "#2D3748",     // Dark gray
    background: "#F8FAF5" // Off-white
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: colors.background }}
    >
      <div className="w-full max-w-md">
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          {/* Decorative header */}
          <div 
            className="h-2 w-full"
            style={{ backgroundColor: colors.primary }}
          ></div>

          <div className="p-8 space-y-6">
            <div className="text-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: colors.light }}
              >
                <Lock 
                  size={28} 
                  style={{ color: colors.primary }} 
                />
              </motion.div>
              
              <h1 
                className="text-3xl font-bold tracking-tight"
                style={{ color: colors.text }}
              >
                Welcome back
              </h1>
              <p className="mt-2 text-gray-600">
                Sign in to access your account
              </p>
            </div>

            <CommonForm
              formControls={loginFormControls}
              buttonText={"Sign In"}
              formData={formData}
              setFormData={setFormData}
              onSubmit={onSubmit}
              customClasses={{
                button: `w-full py-3 rounded-lg font-medium transition-colors`,
                input: `pl-10 border-${colors.light} focus:ring-${colors.primary}`,
              }}
            />

            <div className="flex items-center justify-between">
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

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" style={{ borderColor: colors.light }}></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span 
                  className="px-2 bg-white text-gray-500"
                  style={{ backgroundColor: 'white' }}
                >
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
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
                Google
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
                Facebook
              </button>
            </div>

            <p className="text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/auth/register"
                className="font-medium hover:underline"
                style={{ color: colors.primary }}
              >
                Register now
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default AuthLogin;