import { motion } from "framer-motion";
import { Leaf, Sprout } from "lucide-react";

const MissionSection = () => {
  return (
    <section className="py-16 px-4 max-w-6xl mx-auto">
      <motion.div 
        className="flex flex-col md:flex-row gap-12 items-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="md:w-1/2">
          <div className="relative h-64 w-full rounded-xl overflow-hidden shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=2071&auto=format&fit=crop" 
              alt="Sustainable farming"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-green-800 opacity-20" />
          </div>
        </div>
        <div className="md:w-1/2">
          <div className="inline-flex items-center gap-2 mb-4 text-green-600">
            <Leaf className="text-green-600" />
            <span className="font-semibold">OUR MISSION</span>
          </div>
          <h2 className="text-3xl font-bold text-green-900 mb-4">Rooted in Sustainability</h2>
          <p className="text-gray-600 mb-6">
            At GreenCart, we believe in creating a greener future through conscious commerce. 
            Our mission is to bridge the gap between sustainable producers and eco-conscious consumers.
          </p>
          <ul className="space-y-3">
            {[
              "Ethically sourced products",
              "Carbon-neutral shipping",
              "Plastic-free packaging",
              "Support for local farmers"
            ].map((item, index) => (
              <motion.li 
                key={index}
                className="flex items-start gap-3"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Sprout className="mt-0.5 flex-shrink-0 text-green-600" size={18} />
                <span className="text-gray-700">{item}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.div>
    </section>
  );
};

export default MissionSection;