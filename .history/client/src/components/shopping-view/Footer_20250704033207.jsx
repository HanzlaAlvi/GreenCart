import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Facebook, Twitter, Instagram, Mail, Heart } from "lucide-react";

const Footer = () => {
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
    <motion.footer 
      className="bg-white border-t"
      style={{ borderColor: colors.light }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-2"
            >
              <div 
                className="p-2 rounded-full flex items-center justify-center"
                style={{ backgroundColor: colors.primary }}
              >
                <ShoppingCart className="text-white" />
              </div>
              <span 
                className="text-xl font-bold"
                style={{ color: colors.dark }}
              >
                GreenCart
              </span>
            </motion.div>
            <p className="text-gray-600">
              Your premier destination for quality products and exceptional service since 2023.
            </p>
            <div className="flex gap-4 pt-2">
              {[Facebook, Twitter, Instagram].map((Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  whileHover={{ y: -4 }}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  style={{ color: colors.primary }}
                >
                  <Icon size={20} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 
              className="text-lg font-semibold mb-4 pb-2 border-b"
              style={{ borderColor: colors.light, color: colors.dark }}
            >
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { path: "/shop/home", label: "Home" },
                { path: "/shop/listing", label: "Products" },
                { path: "/shop/categories", label: "Categories" },
                { path: "/shop/about", label: "About Us" },
                { path: "/shop/contact", label: "Contact" }
              ].map((item) => (
                <motion.li 
                  key={item.path}
                  whileHover={{ x: 5 }}
                >
                  <Link 
                    to={item.path}
                    className="flex items-center gap-2 text-gray-600 hover:text-[#A7BC8A] transition-colors"
                  >
                    <div 
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: colors.primary }}
                    />
                    {item.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 
              className="text-lg font-semibold mb-4 pb-2 border-b"
              style={{ borderColor: colors.light, color: colors.dark }}
            >
              Customer Service
            </h3>
            <ul className="space-y-3">
              {[
                { path: "/faq", label: "FAQs" },
                { path: "/shipping", label: "Shipping Policy" },
                { path: "/returns", label: "Returns & Exchanges" },
                { path: "/privacy", label: "Privacy Policy" },
                { path: "/terms", label: "Terms of Service" }
              ].map((item) => (
                <motion.li 
                  key={item.path}
                  whileHover={{ x: 5 }}
                >
                  <Link 
                    to={item.path}
                    className="flex items-center gap-2 text-gray-600 hover:text-[#A7BC8A] transition-colors"
                  >
                    <div 
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: colors.primary }}
                    />
                    {item.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 
              className="text-lg font-semibold mb-4 pb-2 border-b"
              style={{ borderColor: colors.light, color: colors.dark }}
            >
              Newsletter
            </h3>
            <p className="text-gray-600">
              Subscribe to receive updates, access to exclusive deals, and more.
            </p>
            <div className="space-y-3">
              <div className="relative">
                <Mail 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2"
                  size={18}
                  style={{ color: colors.primary }}
                />
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-1"
                  style={{ 
                    borderColor: colors.light,
                    focusRingColor: colors.primary
                  }}
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-2 rounded-lg font-medium transition-colors"
                style={{ 
                  backgroundColor: colors.primary,
                  color: 'white',
                  hoverBackgroundColor: colors.dark
                }}
              >
                Subscribe Now
              </motion.button>
            </div>
            <div className="flex items-center gap-2 pt-2 text-gray-600">
              <div 
                className="p-1.5 rounded-full"
                style={{ backgroundColor: colors.light }}
              >
                <Phone size={16} style={{ color: colors.primary }} />
              </div>
              <span>+1 (555) 123-4567</span>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <motion.div 
          className="mt-12 pt-6 border-t text-center"
          style={{ borderColor: colors.light }}
          whileHover={{ scale: 1.01 }}
        >
          <p className="text-gray-500">
            © {new Date().getFullYear()} <span style={{ color: colors.dark }}>GreenCart</span>. All Rights Reserved.
          </p>
          <div className="flex justify-center items-center gap-1 mt-2">
            <span className="text-gray-500">Made with</span>
            <Heart 
              size={16} 
              className="text-red-500 fill-red-500" 
            />
            <span className="text-gray-500">by</span>
            <span style={{ color: colors.primary }}>YourTeam</span>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;