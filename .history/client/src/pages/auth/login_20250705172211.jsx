import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { loginFormControls } from "@/config";
import { loginUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, ShoppingBag } from "lucide-react";

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
      className="min-h-screen flex items-center justify-center p-4 md:p-8 w-full"
      style={{ backgroundColor: colors.background }}
    >
      {/* Full width container */}
      <div className="w-full max-w-4xl"> {/* Increased max-width */}
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden w-full"
        >
          {/* Single full-width column */}
          <div className="w-full p-8 md:p-12">
            {/* Logo/icon */}
            <div className="flex justify-center mb-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ backgroundColor: colors.light }}
              >
                <ShoppingBag size={28} style={{ color: colors.primary }} />
              </motion.div>
            </div>

            {/* Welcome message */}
            <div className="text-center mb-2">
              <h1 
                className="text-2xl md:text-3xl font-bold"
                style={{ color: colors.text }}
              >
                Welcome to Ecommerce
              </h1>
              <p className="text-lg text-gray-600 mt-2">
                Sign in to access your account
              </p>
            </div>

            {/* Form */}
            <div className="max-w-md mx-auto mt-8"> {/* Centered form container */}
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

              {/* Social login */}
              <div className="mt-8">
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

                <div className="grid grid-cols-2 gap-3 mt-6">
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
              </div>

              <p className="text-center text-sm text-gray-600 mt-8">
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
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default AuthLogin;