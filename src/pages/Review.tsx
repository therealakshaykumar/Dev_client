// pages/Review.tsx
import toast from "react-hot-toast";
import { apiClient } from "../utils/axios";
import { useEffect, useState } from "react";
import { useStore } from "zustand";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { reviewStore } from "../store/reviewStore";
import { AxiosError } from "axios";

const Review = () => {
  const { reviews, setReviews } = useStore(reviewStore);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const navigate = useNavigate();

  const getIgnoredRequests = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/connection/review-ignored");
      setReviews(res.data.reviews);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch ignored requests");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId: string) => {
    try {
      setActionLoading(requestId);
      await apiClient.post(`/connection/reviews/accepted/${requestId}`);
      setReviews(reviews.filter((req: any) => req._id !== requestId));
      toast.success("Request accepted!");
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Failed to accept request");
      } else {
        toast.error("Failed to accept request");
      }
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      setActionLoading(requestId);
      await apiClient.post(`/connection/reviews/rejected/${requestId}`);
      setReviews(reviews.filter((req: any) => req._id !== requestId));
      toast.success("Request rejected permanently");
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Failed to reject request");
      } else {
        toast.error("Failed to reject request");
      }
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    getIgnoredRequests();
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
      scale: 0.8,
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
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="h-8 bg-gray-200 rounded-lg w-48 mb-8"
            />
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.5, 1, 0.5] }}
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
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                  />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-32" />
                    <div className="h-3 bg-gray-200 rounded w-48" />
                  </div>
                  <div className="flex gap-2">
                    <div className="w-10 h-10 bg-gray-200 rounded-full" />
                    <div className="w-10 h-10 bg-gray-200 rounded-full" />
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
  if (!reviews || reviews.length === 0) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
        <motion.div
          className="text-center"
          variants={emptyStateVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="relative w-32 h-32 mx-auto mb-8">
            <motion.div
              className="absolute inset-0 bg-linear-to-br from-violet-100 to-purple-100 rounded-full"
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
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
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
            </motion.div>
          </motion.div>

          <motion.h2
            className="text-2xl md:text-3xl font-bold text-gray-800 mb-3"
            variants={itemVariants}
          >
            No Ignored Requests
          </motion.h2>

          <motion.p
            className="text-gray-500 mb-8 max-w-sm mx-auto"
            variants={itemVariants}
          >
            You don't have any ignored requests to review.
          </motion.p>

          <motion.button
            onClick={() => navigate("/feed")}
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

  // Main Content
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
            Review Ignored Requests
          </motion.h1>
          <motion.p
            className="text-gray-500 mt-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <motion.span
              key={reviews.length}
              initial={{ scale: 1.5, color: "#8B5CF6" }}
              animate={{ scale: 1, color: "#6B7280" }}
              transition={{ duration: 0.5 }}
            >
              {reviews.length}
            </motion.span>{" "}
            ignored {reviews.length === 1 ? "request" : "requests"} to review
          </motion.p>
        </motion.div>

        {/* Reviews List */}
        <motion.div
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence mode="popLayout">
            {reviews.map((request: any) => (
              <motion.div
                key={request._id}
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
                className="group bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 hover:border-violet-200"
              >
                <div className="flex items-center gap-3 md:gap-4">
                  {/* Avatar - Always show fromUserId (the person who sent request) */}
                  <motion.div
                    className="relative flex-shrink-0"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-linear-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white text-lg md:text-2xl font-bold shadow-lg">
                      {request.fromUserId?.firstName?.charAt(0).toUpperCase()}
                    </div>
                    {/* Ignored badge */}
                    <motion.div
                      className="absolute -top-1 -right-1 w-5 h-5 md:w-6 md:h-6 bg-amber-400 border-2 border-white rounded-full flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.3 }}
                    >
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M12 9v2m0 4h.01"
                        />
                      </svg>
                    </motion.div>
                  </motion.div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <motion.h3
                      className="text-base md:text-xl font-semibold text-gray-800 truncate"
                      whileHover={{ color: "#7C3AED", x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      {request.fromUserId?.firstName}{" "}
                      {request.fromUserId?.lastName}
                    </motion.h3>
                    <motion.p
                      className="text-gray-500 text-xs md:text-base truncate"
                      initial={{ opacity: 0.7 }}
                      whileHover={{ opacity: 1 }}
                    >
                      {request.fromUserId?.email}
                    </motion.p>
                    <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-600">
                      Previously Ignored
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 md:gap-3">
                    {/* Reject Permanently */}
                    <motion.button
                      onClick={() => handleReject(request._id)}
                      disabled={actionLoading === request._id}
                      className="relative p-2.5 md:px-4 md:py-2 rounded-full bg-gray-100 text-gray-600 font-medium disabled:opacity-50 cursor-pointer"
                      whileHover={{
                        backgroundColor: "#FEE2E2",
                        color: "#DC2626",
                        scale: 1.05,
                      }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                    >
                      {actionLoading === request._id ? (
                        <motion.div
                          className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        />
                      ) : (
                        <>
                          <svg
                            className="w-5 h-5 md:hidden"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                          <span className="hidden md:inline">Reject</span>
                        </>
                      )}
                    </motion.button>

                    {/* Accept */}
                    <motion.button
                      onClick={() => handleAccept(request._id)}
                      disabled={actionLoading === request._id}
                      className="relative p-2.5 md:px-4 md:py-2 rounded-full bg-linear-to-r from-green-400 to-emerald-500 text-white font-medium shadow-md shadow-green-500/30 disabled:opacity-50 cursor-pointer"
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0 10px 30px rgba(34, 197, 94, 0.4)",
                      }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                    >
                      {actionLoading === request._id ? (
                        <motion.div
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        />
                      ) : (
                        <>
                          <svg
                            className="w-5 h-5 md:hidden"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span className="hidden md:inline">Accept</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Review;