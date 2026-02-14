import toast from "react-hot-toast";
import { apiClient } from "../utils/axios";
import { useEffect, useState } from "react";
import { useStore } from "zustand";
import { connectionStore } from "../store/connectionStore";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Connections = () => {
  const { connections, setConnections } = useStore(connectionStore);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate()

  const getConnections = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/connection/connections");
      setConnections(res.data.connections);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch connections");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getConnections();
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
    exit: {
      opacity: 0,
      x: -100,
      transition: { duration: 0.3 },
    },
  };

  const headerVariants: Variants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
      },
    },
  };

  const emptyStateVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        staggerChildren: 0.2,
      },
    },
  };

  const iconVariants: Variants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
      },
    },
    hover: {
      scale: 1.1,
      rotate: [0, -10, 10, 0],
      transition: { duration: 0.5 },
    },
  };

  const buttonVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        delay: 0.5,
      },
    },
    hover: {
      scale: 1.05,
      boxShadow: "0 20px 40px rgba(139, 92, 246, 0.4)",
    },
    tap: { scale: 0.95 },
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 pt-20 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {/* ✅ Fixed: Use animate prop directly instead of variants */}
            <motion.div
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="h-8 bg-gray-200 rounded-lg w-48 mb-8"
            />
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.2,
                }}
                className="bg-white rounded-2xl p-6 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <motion.div
                    className="w-14 h-14 bg-linear-to-br from-gray-200 to-gray-300 rounded-full"
                    animate={{
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.1,
                    }}
                  />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-32" />
                    <div className="h-3 bg-gray-200 rounded w-48" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    );
  }

  // Empty State
  if (!connections || connections.length === 0) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
        <motion.div
          className="text-center"
          variants={emptyStateVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Animated Icon */}
          <motion.div className="relative w-32 h-32 mx-auto mb-8">
            {/* ✅ Fixed: Use animate prop directly for pulse */}
            <motion.div
              className="absolute inset-0 bg-linear-to-br from-violet-100 to-purple-100 rounded-full"
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute inset-4 bg-white rounded-full flex items-center justify-center shadow-inner"
              variants={iconVariants}
              whileHover="hover"
            >

              <svg
                className="w-12 h-12 text-violet-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </motion.div>
          </motion.div>

          <motion.h2
            className="text-2xl md:text-3xl font-bold text-gray-800 mb-3"
            variants={itemVariants}
          >
            No Connections Yet
          </motion.h2>

          <motion.p
            className="text-gray-500 mb-8 max-w-sm mx-auto"
            variants={itemVariants}
          >
            Start exploring and connect with amazing people around you
          </motion.p>

          <motion.button
            onClick={() => navigate('/feed')}
            className="group relative inline-flex items-center gap-2 bg-linear-to-r from-violet-500 to-purple-600 text-white px-8 py-3 rounded-full font-medium shadow-lg shadow-violet-500/30"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <span>Explore People</span>
            <motion.svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </motion.svg>
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 pt-20 pb-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-8"
          variants={headerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-2xl md:text-3xl font-bold text-gray-800"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            Connections
          </motion.h1>
          <motion.p
            className="text-gray-500 mt-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <motion.span
              key={connections.length}
              initial={{ scale: 1.5, color: "#8B5CF6" }}
              animate={{ scale: 1, color: "#6B7280" }}
              transition={{ duration: 0.5 }}
            >
              {connections.length}
            </motion.span>{" "}
            {connections.length === 1 ? "person" : "people"} in your network
          </motion.p>
        </motion.div>

        {/* Connections Grid */}
        <motion.div
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence mode="popLayout">
            {connections.map((connection: any) => (
              <motion.div
                key={connection._id}
                layout
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                whileHover={{
                  scale: 1.02,
                  y: -5,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
                }}
                className="group bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 hover:border-violet-200 cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <motion.div
                    className="relative"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {
                      connection?.imageUrl ? <img className="w-14 h-14 md:w-16 md:h-16 rounded-full" src={connection?.imageUrl} alt="" /> : (<div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-linear-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white text-xl md:text-2xl font-bold shadow-lg">
                      {connection?.firstName?.charAt(0).toUpperCase()}
                    </div>)
                    }
                    

                    {/* Online indicator with pulse */}
                    <motion.div
                      className="absolute bottom-0 right-2 w-2 h-2 bg-green-400 border-2 border-white rounded-full"
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  </motion.div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <motion.h3
                      className="text-lg md:text-xl font-semibold text-gray-800 truncate"
                      whileHover={{ color: "#7C3AED", x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      {connection?.firstName}{" "}
                      {connection?.lastName}
                    </motion.h3>
                    <motion.p
                      className="text-gray-500 text-sm md:text-base truncate"
                      initial={{ opacity: 0.7 }}
                      whileHover={{ opacity: 1 }}
                    >
                      {connection?.email}
                    </motion.p>
                  </div>

                  {/* Action Button - Desktop */}
                  <motion.button
                    className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-600 font-medium"
                    whileHover={{
                      backgroundColor: "#EDE9FE",
                      color: "#7C3AED",
                      scale: 1.05,
                    }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    <span onClick={()=> navigate(`/chat/${connection._id}`)}>Message</span>
                  </motion.button>

                  {/* Action Button - Mobile */}
                  <motion.button
                    className="sm:hidden p-3 rounded-full bg-gray-100 text-gray-600"
                    whileHover={{ backgroundColor: "#EDE9FE", color: "#7C3AED" }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>
    </div>
  );
};

export default Connections;