import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const NotFoundGame = () => {
  const navigate = useNavigate();
  const gameAreaRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [leaves, setLeaves] = useState([]);
  const [playerPosition, setPlayerPosition] = useState(50);
  const [timeLeft, setTimeLeft] = useState(15);

  // Player movement
  const handleMouseMove = (e) => {
    if (!gameAreaRef.current) return;
    const rect = gameAreaRef.current.getBoundingClientRect();
    const position = ((e.clientX - rect.left) / rect.width) * 100;
    setPlayerPosition(Math.min(Math.max(position, 0), 85));
  };

  // Create falling leaves
  useEffect(() => {
    if (gameOver) return;

    const leafInterval = setInterval(() => {
      setLeaves(prev => [
        ...prev,
        {
          id: Date.now(),
          x: Math.random() * 80 + 5, // 5-85% horizontal position
          speed: Math.random() * 2 + 1, // 1-3 speed
          caught: false
        }
      ]);
    }, 800);

    return () => clearInterval(leafInterval);
  }, [gameOver]);

  // Game timer
  useEffect(() => {
    if (timeLeft <= 0) {
      setGameOver(true);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  // Catch detection
  useEffect(() => {
    const checkCollision = () => {
      setLeaves(prev => 
        prev.map(leaf => {
          if (leaf.caught) return leaf;
          
          const playerX = playerPosition;
          const leafBottom = 90 - (leaf.speed * timeLeft);
          
          // If leaf is in catch zone and aligned with player
          if (leafBottom >= 80 && leafBottom <= 85 && 
              Math.abs(leaf.x - playerX) < 10) {
            setScore(s => s + 10);
            return { ...leaf, caught: true };
          }
          
          return leaf;
        }).filter(leaf => !leaf.caught || Math.random() > 0.7) // Some leaves stay visible when caught
      );
    };

    const collisionInterval = setInterval(checkCollision, 100);
    return () => clearInterval(collisionInterval);
  }, [playerPosition, timeLeft]);

  return (
    <div 
      className="min-h-screen bg-gradient-to-b from-[#5E8B4F] to-[#3A5A40] flex flex-col items-center justify-center p-4 overflow-hidden"
      ref={gameAreaRef}
      onMouseMove={handleMouseMove}
    >
      {/* Game UI */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-6 mb-8 text-center"
      >
        <h1 className="text-3xl font-bold text-white mb-2">404 - Page Not Found!</h1>
        <p className="text-white mb-4">Catch falling leaves to earn your way back home</p>
        
        <div className="flex justify-between text-white font-mono mb-2">
          <span>Time: {timeLeft}s</span>
          <span>Score: {score}</span>
        </div>
      </motion.div>

      {/* Game Area */}
      <div className="relative w-full max-w-md h-96 bg-white bg-opacity-10 rounded-lg border-2 border-white border-opacity-30 overflow-hidden">
        {/* Falling Leaves */}
        {leaves.map(leaf => (
          <motion.div
            key={leaf.id}
            className={`absolute w-8 h-8 ${leaf.caught ? 'text-yellow-300' : 'text-[#A7BC8A]'}`}
            style={{
              left: `${leaf.x}%`,
              bottom: leaf.caught ? '85%' : `${90 - (leaf.speed * (15 - timeLeft))}%`,
              transition: leaf.caught ? 'none' : 'bottom linear'
            }}
            animate={{
              rotate: leaf.caught ? [0, 360] : [0, 45, -45, 0],
            }}
            transition={{
              duration: leaf.caught ? 0.5 : 2,
              repeat: leaf.caught ? 0 : Infinity
            }}
          >
            🍃
          </motion.div>
        ))}

        {/* Player Basket */}
        <motion.div
          className="absolute bottom-4 h-4 bg-[#4A7740] rounded-full"
          style={{
            left: `${playerPosition}%`,
            width: '10%',
          }}
          animate={{
            scaleX: [1, 1.1, 1],
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity
          }}
        >
          <div className="absolute -top-1 left-1/4 right-1/4 h-1 bg-[#3A5A40]"></div>
        </motion.div>
      </div>

      {/* Game Over Screen */}
      {gameOver && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center"
        >
          <div className="bg-[#5E8B4F] rounded-xl p-8 max-w-md text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Game Over!</h2>
            <p className="text-white mb-6">You collected {score} points</p>
            <button
              onClick={() => navigate('/')}
              className="bg-white text-[#5E8B4F] px-6 py-2 rounded-lg font-bold hover:bg-gray-100 transition"
            >
              {score >= 50 ? 'Claim Your Reward →' : 'Try Again'}
            </button>
          </div>
        </motion.div>
      )}

      {/* Instructions */}
      <motion.p 
        className="mt-6 text-white text-opacity-70 text-sm"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Move your mouse to catch the leaves
      </motion.p>
    </div>
  );
};

export default NotFoundGame;