import { filterOptions } from "@/config";
import { Fragment } from "react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

function ProductFilter({ filters, handleFilter }) {
  const [expandedSections, setExpandedSections] = useState(
    Object.keys(filterOptions).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {})
  );

  const toggleSection = (key) => {
    setExpandedSections(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-sm border border-[#D1E2C4] overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-5 border-b border-[#D1E2C4]">
        <h2 className="text-xl font-bold text-[#5E8B4F] flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6H20M7 12H17M10 18H14" stroke="#A7BC8A" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Filters
        </h2>
      </div>
      
      <div className="divide-y divide-[#D1E2C4]/50">
        {Object.keys(filterOptions).map((keyItem) => (
          <Fragment key={keyItem}>
            <div className="p-4">
              <button 
                className="flex items-center justify-between w-full group"
                onClick={() => toggleSection(keyItem)}
              >
                <h3 className="text-base font-semibold text-gray-800 group-hover:text-[#5E8B4F] transition-colors">
                  {keyItem}
                </h3>
                {expandedSections[keyItem] ? (
                  <ChevronUp className="w-5 h-5 text-[#A7BC8A] group-hover:text-[#5E8B4F] transition-colors" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-[#A7BC8A] group-hover:text-[#5E8B4F] transition-colors" />
                )}
              </button>
              
              {expandedSections[keyItem] && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-3 space-y-2 pl-1"
                >
                  {filterOptions[keyItem].map((option) => (
                    <motion.div
                      key={option.id}
                      whileHover={{ x: 3 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Label className="flex items-center gap-3 py-1.5 cursor-pointer">
                        <div className="relative">
                          <Checkbox
                            id={`${keyItem}-${option.id}`}
                            checked={
                              filters &&
                              Object.keys(filters).length > 0 &&
                              filters[keyItem] &&
                              filters[keyItem].includes(option.id)
                            }
                            onCheckedChange={() => handleFilter(keyItem, option.id)}
                            className={cn(
                              "w-5 h-5 rounded border-2 border-[#D1E2C4] data-[state=checked]:bg-[#A7BC8A] data-[state=checked]:border-[#A7BC8A]",
                              "focus:ring-2 focus:ring-[#A7BC8A] focus:ring-offset-2"
                            )}
                          />
                        </div>
                        <span className="text-gray-700 text-sm font-medium">
                          {option.label}
                        </span>
                        {option.count && (
                          <span className="ml-auto text-xs text-gray-500">
                            ({option.count})
                          </span>
                        )}
                      </Label>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </Fragment>
        ))}
      </div>

      {/* Clear All button */}
      {(filters && Object.keys(filters).length > 0) && (
        <div className="p-4 border-t border-[#D1E2C4]">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleFilter('clear', 'all')}
            className="w-full py-2 text-sm font-medium rounded-lg bg-[#D1E2C4]/30 hover:bg-[#D1E2C4]/50 text-[#5E8B4F] transition-colors"
          >
            Clear All Filters
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}

export default ProductFilter;