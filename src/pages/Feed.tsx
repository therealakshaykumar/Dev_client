import { useState, useEffect } from "react";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import { feedStore } from "../store/feedStore";
import { apiClient } from "../utils/axios";

const Feed = () => {
  const { feed, setFeed, removeFromFeed } = feedStore();
  const [currentIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right" | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getFeed = async () => {
    if (feed.length > 0) {
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const res = await apiClient.get(`/connection/feed`, {
        withCredentials: true,
      });
      setFeed(res.data.feed);
    } catch (error:any) {
      console.error("Failed to fetch feed:", error.response);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  const handleSwipe = async (swipeDirection: "left" | "right") => {
    if (currentIndex >= feed.length) return;

    const currentUser = feed[currentIndex];
    setDirection(swipeDirection);

    try {
      if (swipeDirection === "right") {
        await apiClient.post(
          `/connection/connect/interested/${currentUser._id}`,
          {},
          { withCredentials: true }
        );
      } else {
        await apiClient.post(
          `/connection/connect/ignored/${currentUser._id}`,
          {},
          { withCredentials: true }
        );
      }
    } catch (error) {
      console.error("Action failed:", error);
    }

    setTimeout(() => {
      removeFromFeed(currentUser._id);
      setDirection(null);
    }, 300);
  };

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const threshold = 100;
    if (info.offset.x > threshold) {
      handleSwipe("right");
    } else if (info.offset.x < -threshold) {
      handleSwipe("left");
    }
  };

  const cardVariants = {
    current: {
      scale: 1,
      y: 0,
      opacity: 1,
      zIndex: 3,
    },
    next: {
      scale: 0.95,
      y: 20,
      opacity: 0.8,
      zIndex: 2,
    },
    behind: {
      scale: 0.9,
      y: 40,
      opacity: 0.6,
      zIndex: 1,
    },
    exit: (direction: "left" | "right") => ({
      x: direction === "right" ? 300 : -300,
      opacity: 0,
      rotate: direction === "right" ? 20 : -20,
      transition: { duration: 0.3 },
    }),
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-linear-to-br from-pink-50 to-purple-50">
        <motion.div
          className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  if (feed.length === 0) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center bg-linear-to-br from-pink-50 to-purple-50 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-linear-to-br from-pink-100 to-purple-100 flex items-center justify-center">
            <svg
              className="w-16 h-16 text-pink-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            No More Profiles
          </h2>
          <p className="text-gray-500">Check back later for new matches!</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-8 flex flex-col items-center justify-center bg-linear-to-br from-pink-50 to-purple-50 px-4">
      <div className="relative w-full max-w-sm h-[500px] sm:h-[550px]">
        <AnimatePresence custom={direction}>
          {feed
            .slice(0, 3)
            .reverse()
            .map((user: any, index: number) => {
              const isTop = index === feed.slice(0, 3).length - 1;
              const position =
                index === feed.slice(0, 3).length - 1
                  ? "current"
                  : index === feed.slice(0, 3).length - 2
                  ? "next"
                  : "behind";

              return (
                <motion.div
                  key={user._id}
                  className="absolute inset-0 w-full"
                  variants={cardVariants}
                  initial={position}
                  animate={position}
                  exit="exit"
                  custom={direction}
                  drag={isTop ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.9}
                  onDragEnd={isTop ? handleDragEnd : undefined}
                  whileDrag={{ cursor: "grabbing" }}
                >
                  <div className="w-full h-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                    <div className="relative h-3/5">
                      <img
                        src={
                          user.imageUrl ||
                          "https://www.svgrepo.com/show/384670/account-avatar-profile-user.svg"
                        }
                        alt={user.firstName}
                        className="w-full h-full object-cover"
                        draggable={false}
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

                      <motion.div
                        className="absolute top-4 left-4 px-4 py-2 bg-green-500 text-white font-bold rounded-lg rotate-[-15deg]"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 0, scale: 0 }}
                        style={{ opacity: 0 }}
                      >
                        LIKE
                      </motion.div>

                      <motion.div
                        className="absolute top-4 right-4 px-4 py-2 bg-red-500 text-white font-bold rounded-lg rotate-[15deg]"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 0, scale: 0 }}
                        style={{ opacity: 0 }}
                      >
                        NOPE
                      </motion.div>

                      <div className="absolute bottom-4 left-4 right-4">
                        <h2 className="text-2xl sm:text-3xl font-bold text-white">
                          {user.firstName} {user.lastName}
                        </h2>
                        {user.bio && (
                          <p className="text-white/80 text-sm mt-1 line-clamp-2">
                            {user.bio}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="h-2/5 p-4 flex flex-col justify-between">
                      <div className="space-y-2">
                        {user.gender && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                            <span className="capitalize">{user.gender}</span>
                          </div>
                        )}
                        {user.email && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                              />
                            </svg>
                            <span className="text-sm truncate">
                              {user.email}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-center gap-6 pt-4">
                        <motion.button
                          onClick={() => handleSwipe("left")}
                          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white border-2 border-red-400 flex items-center justify-center shadow-lg"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <svg
                            className="w-7 h-7 sm:w-8 sm:h-8 text-red-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2.5}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </motion.button>

                        <motion.button
                          onClick={() => handleSwipe("right")}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-linear-to-r from-pink-500 to-rose-500 flex items-center justify-center shadow-lg shadow-pink-500/30"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <svg
                            className="w-8 h-8 sm:w-10 sm:h-10 text-white"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                          </svg>
                        </motion.button>

                        <motion.button
                          onClick={() => handleSwipe("left")}
                          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white border-2 border-yellow-400 flex items-center justify-center shadow-lg"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <svg
                            className="w-7 h-7 sm:w-8 sm:h-8 text-yellow-500"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
        </AnimatePresence>
      </div>

      <motion.div
        className="mt-6 flex items-center gap-4 text-gray-500 text-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center gap-1">
          <span className="text-red-400">←</span>
          <span>Swipe left to pass</span>
        </div>
        <div className="w-1 h-1 bg-gray-300 rounded-full" />
        <div className="flex items-center gap-1">
          <span>Swipe right to like</span>
          <span className="text-green-400">→</span>
        </div>
      </motion.div>
    </div>
  );
};

export default Feed;