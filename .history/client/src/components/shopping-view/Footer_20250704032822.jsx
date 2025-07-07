import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Facebook, Twitter, Instagram, Mail } from "lucide-react";

const Footer = () => {
  return (
    <motion.footer 
      className="bg-white border-t border-[#D1E2C4] mt-16"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Us Column */}
          <div className="footer-column">
            <h3 className="text-lg font-semibold mb-4 text-[#5E8B4F]">ABOUT US</h3>
            <p className="text-gray-600 mb-4">
              Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <div className="flex gap-4">
              <motion.a 
                href="#" 
                whileHover={{ y: -2 }}
                className="text-[#A7BC8A] hover:text-[#5E8B4F]"
              >
                <Facebook size={20} />
              </motion.a>
              <motion.a 
                href="#" 
                whileHover={{ y: -2 }}
                className="text-[#A7BC8A] hover:text-[#5E8B4F]"
              >
                <Twitter size={20} />
              </motion.a>
              <motion.a 
                href="#" 
                whileHover={{ y: -2 }}
                className="text-[#A7BC8A] hover:text-[#5E8B4F]"
              >
                <Instagram size={20} />
              </motion.a>
            </div>
          </div>

          {/* Information Column */}
          <div className="footer-column">
            <h3 className="text-lg font-semibold mb-4 text-[#5E8B4F]">INFORMATION</h3>
            <ul className="space-y-2">
              {[
                { path: "/about", label: "About Us" },
                { path: "/manufacturer", label: "Manufacturer" },
                { path: "/trading-order", label: "Trading Order" },
                { path: "/privacy-policy", label: "Privacy Policy" },
                { path: "/terms-conditions", label: "Terms & Conditions" }
              ].map((item) => (
                <motion.li 
                  key={item.path}
                  whileHover={{ x: 5 }}
                >
                  <Link 
                    to={item.path} 
                    className="text-gray-600 hover:text-[#A7BC8A] transition-colors"
                  >
                    {item.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* My Account Column */}
          <div className="footer-column">
            <h3 className="text-lg font-semibold mb-4 text-[#5E8B4F]">MY ACCOUNT</h3>
            <ul className="space-y-2">
              {[
                { path: "/login", label: "Login" },
                { path: "/orders", label: "My Orders" },
                { path: "/wishlist", label: "Wishlist" },
                { path: "/compare", label: "Compare" },
                { path: "/account", label: "My Account" }
              ].map((item) => (
                <motion.li 
                  key={item.path}
                  whileHover={{ x: 5 }}
                >
                  <Link 
                    to={item.path} 
                    className="text-gray-600 hover:text-[#A7BC8A] transition-colors"
                  >
                    {item.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="footer-column">
            <h3 className="text-lg font-semibold mb-4 text-[#5E8B4F]">NEWSLETTER</h3>
            <p className="text-gray-600 mb-4">
              Subscribe to our newsletter for the latest updates and offers.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-1 px-4 py-2 border border-[#D1E2C4] rounded-md focus:outline-none focus:ring-2 focus:ring-[#A7BC8A]"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 bg-[#A7BC8A] text-white rounded-md hover:bg-[#5E8B4F] transition-colors"
              >
                Subscribe
              </motion.button>
            </div>
            <div className="mt-4 flex items-center gap-2 text-gray-600">
              <Mail size={18} className="text-[#A7BC8A]" />
              <span>support@yourbrand.com</span>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-[#D1E2C4] mt-12 pt-6 text-center text-gray-500">
          <motion.p 
            whileHover={{ scale: 1.01 }}
            className="flex items-center justify-center gap-1"
          >
            © {new Date().getFullYear()} YourBrand. Made with 
            <span className="text-red-500">❤️</span> 
            by YourTeam
          </motion.p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;