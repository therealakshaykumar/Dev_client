import { useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { useStore } from "zustand";
import { userStore } from "../store/userStore";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../utils/axios";
import { requestStore } from "../store/requestStore";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const { user, isLoading, clearUser } = useStore(userStore);
  const navigate = useNavigate();
  const { scrollY } = useScroll();

  const {requests} = useStore(requestStore)

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    
    if (latest > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }

    if (latest > previous && latest > 150) {
      setIsHidden(true);
    } else {
      setIsHidden(false);
    }
  });

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = async () => {
    try {
      await apiClient.post("/auth/logout");
      clearUser();
      setIsDropdownOpen(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      clearUser();
      navigate("/login");
    }
  };

  const userImage =
    user?.imageUrl ||
    "https://www.svgrepo.com/show/384670/account-avatar-profile-user.svg";

  const navbarVariants = {
    visible: {
      y: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 30,
      },
    },
    hidden: {
      y: "-100%",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 30,
      },
    },
  } as const;

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: -10,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
        staggerChildren: 0.05,
        delayChildren: 0.05,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: -10,
      transition: {
        duration: 0.15,
      },
    },
  } as const;

  const itemVariants = {
    hidden: {
      opacity: 0,
      x: -10,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  } as const;

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <motion.nav
      variants={navbarVariants}
      animate={isHidden ? "hidden" : "visible"}
      initial="visible"
      className={`
        fixed top-0 left-0 right-0 z-50
        flex items-center justify-between px-4 sm:px-6 py-3
        transition-all duration-300 ease-in-out
        ${
          isScrolled
            ? "bg-white/70 backdrop-blur-xl shadow-lg shadow-gray-200/50 border-b border-white/20"
            : "bg-white/90 backdrop-blur-sm"
        }
      `}
    >
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-pink via-orange to-pink"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{
          scaleX: isScrolled ? 1 : 0,
          opacity: isScrolled ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        style={{ backgroundSize: "200% 100%" }}
      />

      <div className="flex-1">
        <motion.a
          onClick={() => navigate("/feed")}
          className="
            px-4 py-2 text-xl rounded-lg inline-flex items-center gap-2
            bg-linear-to-r from-pink to-orange font-bold
            bg-clip-text text-transparent cursor-pointer
            select-none
          "
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <img className="w-6 h-6" src="/logo.svg" alt="" /><span>GiTogether</span>
        </motion.a>
      </div>

      
      <div className="flex items-center justify-end gap-3 flex-1 cursor-pointer">
        {isLoading ? (
          <motion.div
            className="w-10 h-10 rounded-full bg-linear-to-r from-gray-200 to-gray-300  cursor-pointer"
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ) : user ? (
          <div className="relative  cursor-pointer">
            <motion.button
              onClick={toggleDropdown}
              className={`
                flex items-center gap-3 p-1.5 pr-4 rounded-full
                transition-all duration-300
                ${
                  isDropdownOpen
                    ? "bg-gray-100 ring-2 ring-pink/30"
                    : "hover:bg-gray-50"
                }
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="relative">
                <motion.img
                  alt="User avatar"
                  src={userImage}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-white"
                  animate={isDropdownOpen ? { scale: 1.05 } : { scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
                <motion.span
                  className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 border-2 border-white rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />
              </div>

              <span className="hidden sm:block text-sm font-medium text-gray-700">
                {user.firstName}
              </span>

              <motion.svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </motion.svg>
            </motion.button>

            <AnimatePresence>
              {isDropdownOpen && (
                <>
                  <motion.div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsDropdownOpen(false)}
                    variants={backdropVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  />

                  <motion.div
                    className="absolute right-0 mt-3 w-64 p-2 bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100 z-20 origin-top-right"
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <motion.div
                      variants={itemVariants}
                      className="px-4 py-3 border-b border-gray-100"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={userImage}
                          alt="Profile"
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-800 truncate">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    <div className="py-2">
                      <motion.button
                        variants={itemVariants}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                        whileHover={{ x: 5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setIsDropdownOpen(false);
                          navigate("/profile");
                        }}
                      >
                        <div className="w-8 h-8 rounded-lg bg-linear-to-br from-pink/10 to-orange/10 flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-pink"
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
                        </div>
                        <span>My Profile</span>
                      </motion.button>

                      <motion.button
                        variants={itemVariants}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                        whileHover={{ x: 5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setIsDropdownOpen(false);
                          navigate("/connections");
                        }}
                      >
                        <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-500/10 to-cyan-500/10 flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-blue-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                          </svg>
                        </div>
                        <span>Connections</span>
                      </motion.button>

                      <motion.button
                        variants={itemVariants}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                        whileHover={{ x: 5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setIsDropdownOpen(false);
                          navigate("/requests");
                        }}
                      >
                        <div className="w-8 h-8 rounded-lg bg-linear-to-br from-purple-500/10 to-indigo-500/10 flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-purple-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                            />
                          </svg>
                        </div>
                        <span>Requests</span>
                        {/* Notification badge */}
                        {requests.length > 0 && (
                          <span className="ml-auto px-2 py-0.5 text-xs font-medium bg-pink text-white rounded-full">
                          {requests.length}
                        </span>
                        )}
                      </motion.button>
                    </div>

                    {/* Divider */}
                    <div className="my-1 border-t border-gray-100" />

                    {/* Logout */}
                    <motion.button
                      variants={itemVariants}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleLogout}
                    >
                      <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-red-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                      </div>
                      <span>Logout</span>
                    </motion.button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <motion.button
            className="px-5 py-2.5 bg-linear-to-r from-pink to-orange text-white font-medium rounded-xl shadow-lg shadow-pink/25 cursor-pointer"
            whileHover={{ scale: 1.05, boxShadow: "0 10px 40px -10px rgba(254, 60, 114, 0.5)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/login")}
          >
            Login
          </motion.button>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;