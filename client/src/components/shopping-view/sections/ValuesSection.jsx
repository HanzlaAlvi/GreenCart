import { motion } from "framer-motion";
import { Leaf, Warehouse, Sprout, Trees } from "lucide-react";

const ValuesSection = () => {
  return (
    <section className="py-16 bg-green-50">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 mb-4 text-green-600">
            <Trees className="text-green-600" />
            <span className="font-semibold">OUR VALUES</span>
          </div>
          <h2 className="text-3xl font-bold text-green-900 mb-4">The GreenCart Difference</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We're more than a marketplace - we're a movement towards responsible consumption.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Leaf size={32} className="text-green-600" />,
              title: "Sustainability First",
              description: "Every product meets our strict environmental standards"
            },
            {
              icon: <Warehouse size={32} className="text-green-600" />,
              title: "Transparent Supply Chain",
              description: "Know exactly where your products come from"
            },
            {
              icon: <Sprout size={32} className="text-green-600" />,
              title: "Community Growth",
              description: "Supporting small producers and local communities"
            }
          ].map((value, index) => (
            <motion.div
              key={index}
              className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-green-50 mx-auto">
                {value.icon}
              </div>
              <h3 className="text-xl font-semibold text-center text-green-900 mb-3">
                {value.title}
              </h3>
              <p className="text-gray-600 text-center">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValuesSection;