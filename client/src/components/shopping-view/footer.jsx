import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Facebook, Instagram, MapPin, Mail, Phone, ShoppingBag } from "lucide-react";

const Footer = () => {
  return (
    <motion.footer 
      className="w-full bg-green-50 text-green-900 border-t border-green-200"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <Link to="/shop/home" className="flex items-center gap-2">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="p-2 rounded-full flex items-center justify-center bg-green-600"
              >
                <ShoppingBag className="text-white" />
              </motion.div>
              <span className="text-xl font-bold text-green-800">
                GreenCart
              </span>
            </Link>
            <p className="text-green-700">
              Sustainable products for conscious living.
            </p>
            <div className="flex gap-4 pt-2">
              {[Facebook, Instagram].map((Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  whileHover={{ y: -2 }}
                  className="p-2 rounded-full hover:bg-green-100 transition-colors text-green-600"
                >
                  <Icon size={20} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-green-800">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { path: "/shop/home", label: "Home" },
                { path: "/shop/listing", label: "Products" },
                { path: "/about", label: "About Us" }
              ].map((item) => (
                <motion.li 
                  key={item.path}
                  whileHover={{ x: 3 }}
                >
                  <Link 
                    to={item.path}
                    className="text-green-700 hover:text-green-600 transition-colors"
                  >
                    {item.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4 text-green-800">
              Contact Us
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 text-green-600" />
                <span className="text-green-700">123 Green Street, Eco City</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-green-600" />
                <a href="mailto:hello@greencart.com" className="text-green-700 hover:text-green-600">
                  hello@greencart.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-green-600" />
                <a href="tel:+15551234567" className="text-green-700 hover:text-green-600">
                  +1 (555) 123-4567
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-green-200 mt-12 pt-6 text-center">
          <p className="text-green-600 text-sm">
            © {new Date().getFullYear()} GreenCart. All rights reserved.
          </p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;