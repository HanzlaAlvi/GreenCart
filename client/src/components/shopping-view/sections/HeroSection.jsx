import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";

const HeroSection = () => {
  return (
    <motion.section 
      className="relative h-96 flex items-center justify-center bg-green-50 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30" />
      
      <motion.div 
        className="relative z-10 text-center px-4"
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        <div className="inline-flex items-center gap-2 mb-4">
          <ShoppingBag className="text-green-700" size={32} />
          <span className="text-3xl font-bold text-green-800">GreenCart</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-green-900 mb-4">Our Green Story</h1>
        <p className="text-lg text-green-800 max-w-2xl mx-auto">
          Cultivating sustainability, one product at a time
        </p>
      </motion.div>
    </motion.section>
  );
};

export default HeroSection;