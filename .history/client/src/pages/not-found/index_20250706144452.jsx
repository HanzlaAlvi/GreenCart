import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Assuming you already have framer-motion

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <motion.div
        className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          animate={{
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            repeat: Infinity,
            repeatType: "reverse",
            duration: 2,
          }}
          className="text-6xl mb-6"
        >
          🎮
        </motion.div>

        <h1 className="text-3xl font-bold text-gray-800 mb-4">404 - Level Not Found!</h1>
        
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist in this game dimension.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate("/")}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Continue to Home
          </button>
          <button
            onClick={() => window.location.reload()}
            className="bg-gray-200 hover:bg-gray-300 px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Try Again
          </button>
        </div>

        <p className="mt-8 text-gray-400 text-sm">
          Press any button to continue your quest...
        </p>
      </motion.div>
    </div>
  );
}

export default NotFound;