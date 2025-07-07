import { motion, useAnimation } from "framer-motion";
import { AlertTriangle, Home, RotateCw, Joystick } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Confetti from "react-dom-confetti";

function NotFound() {
  const navigate = useNavigate();
  const controls = useAnimation();
  const [isExploding, setIsExploding] = useState(false);

  const config = {
    angle: 90,
    spread: 360,
    startVelocity: 40,
    elementCount: 70,
    dragFriction: 0.12,
    duration: 3000,
    stagger: 3,
    width: "10px",
    height: "10px",
    colors: ["#5E8B4F", "#4A7740", "#A7BC8A", "#3A5A40", "#588157"]
  };

  useEffect(() => {
    const sequence = async () => {
      await controls.start({
        scale: [1, 1.1, 1],
        rotate: [0, 5, -5, 0],
        transition: { duration: 0.8 }
      });
      setIsExploding(true);
      await controls.start({
        y: [0, -20, 0],
        transition: { duration: 0.5 }
      });
    };
    sequence();
  }, [controls]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4 overflow-hidden">
      {/* Background elements */}
      <motion.div 
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 2 }}
      >
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-[#5E8B4F]"
            style={{
              width: Math.random() * 10 + 5,
              height: Math.random() * 10 + 5,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, (Math.random() - 0.5) * 100],
              x: [0, (Math.random() - 0.5) * 100],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </motion.div>

      {/* Main content */}
      <motion.div
        className="relative bg-gray-800 border-2 border-[#5E8B4F] rounded-xl p-8 max-w-md w-full text-center shadow-2xl overflow-hidden"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 10, stiffness: 100 }}
      >
        {/* Pixel art border */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-[#5E8B4F]"></div>
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-[#5E8B4F]"></div>
        <div className="absolute left-0 top-0 bottom-0 w-2 bg-[#5E8B4F]"></div>
        <div className="absolute right-0 top-0 bottom-0 w-2 bg-[#5E8B4F]"></div>

        {/* 8-bit corners */}
        <div className="absolute top-0 left-0 w-4 h-4 bg-gray-800 border-l-2 border-t-2 border-[#5E8B4F]"></div>
        <div className="absolute top-0 right-0 w-4 h-4 bg-gray-800 border-r-2 border-t-2 border-[#5E8B4F]"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 bg-gray-800 border-l-2 border-b-2 border-[#5E8B4F]"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 bg-gray-800 border-r-2 border-b-2 border-[#5E8B4F]"></div>

        {/* Game-like content */}
        <motion.div
          animate={controls}
          className="mb-6 relative inline-block"
        >
          <div className="absolute -inset-4 bg-[#5E8B4F] rounded-full blur-md opacity-75"></div>
          <AlertTriangle className="w-16 h-16 text-amber-400 relative z-10" />
          <Confetti active={isExploding} config={config} />
        </motion.div>

        <motion.h1
          className="text-4xl font-bold text-white mb-4 font-mono"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          404 ERROR
        </motion.h1>

        <motion.p
          className="text-gray-300 mb-8 text-lg"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          LEVEL NOT FOUND!
        </motion.p>

        <motion.div
          className="grid grid-cols-2 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <Button
            onClick={() => navigate("/")}
            className="bg-[#5E8B4F] hover:bg-[#4A7740] h-12 gap-2"
          >
            <Home className="w-5 h-5" />
            Continue Game
          </Button>
          <Button
            onClick={() => window.location.reload()}
            className="bg-gray-700 hover:bg-gray-600 h-12 gap-2"
          >
            <RotateCw className="w-5 h-5" />
            Try Again
          </Button>
        </motion.div>

        <motion.div
          className="mt-8 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Joystick className="w-4 h-4" />
            <span>Press any button to continue</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Retro game overlay */}
      <div className="absolute bottom-4 left-0 right-0 text-center">
        <motion.p
          className="text-gray-500 text-xs font-mono"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          © 2023 GAME OVER - TRY AGAIN?
        </motion.p>
      </div>
    </div>
  );
}

export default NotFound;