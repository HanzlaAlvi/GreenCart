import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  // 8-bit font style
  const retroStyle = {
    fontFamily: '"Press Start 2P", cursive, monospace',
    textShadow: '3px 3px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000'
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 overflow-hidden">
      {/* Pixelated background */}
      <div className="absolute inset-0 opacity-20">
        {Array.from({ length: 100 }).map((_, i) => (
          <div 
            key={i}
            className="absolute w-2 h-2 bg-green-400"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.1
            }}
          />
        ))}
      </div>

      {/* Main game screen */}
      <motion.div
        className="relative border-4 border-green-500 bg-gray-900 p-8 max-w-md w-full text-center"
        style={{
          boxShadow: '0 0 0 8px #222, 0 0 0 12px #5E8B4F',
          ...retroStyle
        }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        {/* Pixel corners */}
        <div className="absolute -top-2 -left-2 w-4 h-4 bg-green-500"></div>
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500"></div>
        <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-green-500"></div>
        <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-green-500"></div>

        {/* Error icon */}
        <motion.div
          animate={{
            y: [0, -10, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: 'mirror'
          }}
          className="text-6xl mb-6 text-red-500"
        >
          🚨
        </motion.div>

        {/* Error message */}
        <motion.h1 
          className="text-2xl md:text-3xl mb-4 text-green-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          ERROR 404
        </motion.h1>
        
        <motion.p 
          className="text-lg mb-8 text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          LEVEL NOT FOUND!
        </motion.p>

        {/* Game buttons */}
        <motion.div
          className="grid grid-cols-2 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <button
            onClick={() => navigate("/")}
            className="bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-none border-2 border-black text-sm"
            style={retroStyle}
          >
            CONTINUE
          </button>
          <button
            onClick={() => window.location.reload()}
            className="bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-none border-2 border-black text-sm"
            style={retroStyle}
          >
            TRY AGAIN
          </button>
        </motion.div>

        {/* Game instructions */}
        <motion.p
          className="mt-8 text-gray-400 text-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          PRESS START BUTTON
        </motion.p>

        {/* Fake game console */}
        <div className="mt-8 flex justify-center gap-4">
          <div className="w-8 h-8 rounded-full bg-red-500 border-2 border-black"></div>
          <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-black"></div>
          <div className="w-12 h-4 bg-gray-700 border-2 border-black self-center"></div>
        </div>
      </motion.div>

      {/* Game over footer */}
      <motion.div
        className="absolute bottom-4 left-0 right-0 text-center text-gray-500 text-xs"
        style={retroStyle}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        © 2023 GAME OVER
      </motion.div>
    </div>
  );
}

export default NotFound;