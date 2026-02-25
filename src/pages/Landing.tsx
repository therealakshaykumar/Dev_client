import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useStore } from "zustand";
import { userStore } from "../store/userStore";
import { useEffect } from "react";

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useStore(userStore);
  
  useEffect(() => {
    console.log("Current user:", user);
    if (user) {
      navigate("/feed");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
      
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-pink rounded-full blur-xl opacity-10"
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      
      <motion.div
        className="absolute top-40 right-20 w-96 h-96 bg-orange rounded-full blur-xl opacity-10"
        animate={{
          x: [0, -30, 0],
          y: [0, 50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      
      <motion.div
        className="absolute bottom-20 left-1/3 w-80 h-80 bg-pink rounded-full blur-xl opacity-10"
        animate={{
          x: [0, 40, 0],
          y: [0, -30, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />

      <motion.div
        className="absolute bottom-40 right-10 w-64 h-64 bg-orange rounded-full blur-xl opacity-10"
        animate={{
          x: [0, -50, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 text-center px-4">
        
        {/* Logo/Brand */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 flex items-center justify-center gap-1"
        >
          <img className="w-6 h-6" src="/logo.svg" alt="" />
          <h2 className="text-white/80 text-xl font-medium tracking-wider">
            GitTogether
          </h2>
        </motion.div>

        {/* Main Tagline */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6"
        >
          <span className="bg-linear-to-r from-pink via-orange to-pink bg-clip-text text-transparent">
            git clone greatness
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-gray-400 text-lg md:text-xl max-w-md mx-auto mb-12"
        >
          Where developers find their perfect match.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/signup")}
            className="px-8 py-4 bg-linear-to-r from-pink to-orange text-white rounded-full"
          >
            Get Started
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/login")}
            className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-full border border-white/20 hover:bg-white/20 transition-colors"
          >
            {user ? "Feed" : 'Sign In'}
          </motion.button>
        </motion.div>

        {/* Terminal-style decoration */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-16 text-gray-500 font-mono text-sm"
        >
          <span className="text-pink">$</span> git push origin your-dreams
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="ml-1 inline-block w-2 h-4 bg-pink"
          />
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-gray-900 to-transparent" />
    </div>
  );
};

export default Landing;