import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Facebook, Twitter, Instagram, Mail, MapPin, Phone, ShoppingBag, Heart } from "lucide-react";

const Footer = () => {
  // Color palette
  const colors = {
    primary: "#A7BC8A",
    dark: "#5E8B4F",
    light: "#D1E2C4",
    text: "#2D3748",
    background: "#FAF9F6"
  };

  return (
    <motion.footer 
      className="w-full bg-[#FAF9F6] border-t border-[#D1E2C4] mt-auto" // Changed to mt-auto
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ zIndex: 10 }} // Ensure footer stays above content
    >
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
                <ShoppingBag className="text-white" />
              </div>
              <span 
                className="text-xl font-bold"
                style={{ color: colors.dark }}
              >
                GreenCart
              </span>
            </motion.div>
            <p className="text-gray-600">
              Your premier destination for quality products and exceptional service.
            </p>
            <div className="flex gap-4 pt-2">
              {[Facebook, Twitter, Instagram].map((Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  whileHover={{ y: -4 }}
                  className="p-2 rounded-full hover:bg-[#D1E2C4] transition-colors"
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
                { path: "/about", label: "About Us" },
                { path: "/contact", label: "Contact" }
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

          {/* Contact & Newsletter */}
          <div className="space-y-4">
            <h3 
              className="text-lg font-semibold mb-4 pb-2 border-b"
              style={{ borderColor: colors.light, color: colors.dark }}
            >
              Contact Us
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MapPin size={18} style={{ color: colors.primary }} />
                <span className="text-gray-600">123 Green Street, Eco City</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} style={{ color: colors.primary }} />
                <span className="text-gray-600">support@greencart.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} style={{ color: colors.primary }} />
                <span className="text-gray-600">+1 (555) 123-4567</span>
              </div>
            </div>

            <h3 
              className="text-lg font-semibold mt-6 mb-4 pb-2 border-b"
              style={{ borderColor: colors.light, color: colors.dark }}
            >
              Newsletter
            </h3>
            <div className="flex flex-col sm:flex-row gap-2">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-1 px-4 py-2 border border-[#D1E2C4] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A7BC8A]"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 rounded-lg font-medium"
                style={{ 
                  backgroundColor: colors.primary,
                  color: "white"
                }}
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <motion.div 
          className="border-t border-[#D1E2C4] mt-12 pt-6 text-center"
          whileHover={{ scale: 1.01 }}
        >
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} GreenCart. All rights reserved.
          </p>
          <div className="flex justify-center items-center gap-1 mt-2">
            <span className="text-gray-500 text-sm">Made with</span>
            <Heart size={16} className="text-red-500 fill-red-500" />
            <span className="text-gray-500 text-sm">by</span>
            <span className="text-sm" style={{ color: colors.primary }}>YourTeam</span>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;