import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { registerFormControls } from "@/config";
import { registerUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { UserPlus, Lock, Mail, User, Smartphone, Monitor } from "lucide-react";

const initialState = {
  userName: "",
  email: "",
  password: "",
};

function AuthRegister() {
  const [formData, setFormData] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Color palette (same as login)
  const colors = {
    primary: "#A7BC8A",
    dark: "#5E8B4F",
    light: "#D1E2C4",
    text: "#2D3748",
    background: "#F8FAF5"
  };

  async function onSubmit(event) {
    event.preventDefault();

    if (!formData.userName || !formData.email || !formData.password) {
      toast({
        title: "Validation Error",
        description: "All fields are required",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await dispatch(registerUser(formData)).unwrap();

      if (result?.success) {
        toast({
          title: "Registration Successful",
          description: result.message,
          className: "bg-[#5E8B4F] text-white",
        });
        navigate("/auth/login");
      }
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error?.message || "An error occurred during registration",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen flex items-center justify-center p-4 md:p-8"
      style={{ backgroundColor: colors.background }}
    >
      <div className="w-full max-w-[400px] md:max-w-[800px]">
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row"
        >
          {/* Left Side - Illustration */}
          <div
            className="hidden md:flex md:w-1/2 items-center justify-center p-8"
            style={{ backgroundColor: colors.primary }}
          >
            <div className="text-center text-white space-y-6">
              <motion.div
                whileHover={{ rotate: 5 }}
                className="mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-6 bg-white/20"
              >
                <UserPlus size={40} className="text-white" />
              </motion.div>
              <h2 className="text-3xl font-bold">Join Us!</h2>
              <p className="text-white/90">
                Create an account to access all features and start your sustainable shopping journey.
              </p>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="w-full md:w-1/2 p-6 md:p-10">
            {/* Mobile-only logo */}
            <div className="md:hidden flex justify-center mb-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ backgroundColor: colors.light }}
              >
                <UserPlus size={28} style={{ color: colors.primary }} />
              </motion.div>
            </div>

            <h1
              className="text-2xl md:text-3xl font-bold text-center mb-2"
              style={{ color: colors.text }}
            >
              Create your account
            </h1>

            <p className="text-center text-gray-600 mb-6 md:mb-8">
              {window.innerWidth < 768 ? "Enter your details to get started" : "Fill in the form to create your account"}
            </p>

            <CommonForm
              formControls={registerFormControls}
              buttonText={isLoading ? "Creating Account..." : "Sign Up"}
              formData={formData}
              setFormData={setFormData}
              onSubmit={onSubmit}
              disabled={isLoading}
              customClasses={{
                button: `w-full py-3 rounded-lg font-medium transition-colors hover:bg-[${colors.dark}]`,
                input: `pl-10 border-[${colors.light}] focus:ring-[${colors.primary}]`,
              }}
            />

            <p className="text-center text-sm text-gray-600 mt-6">
              Already have an account?{' '}
              <Link
                to="/auth/login"
                className="font-medium hover:underline"
                style={{ color: colors.primary }}
              >
                Login here
              </Link>
            </p>

            {/* Device indicator */}
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

export default AuthRegister;