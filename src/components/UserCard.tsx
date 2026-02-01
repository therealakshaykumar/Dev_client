"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { apiClient } from "../utils/axios";
import toast from "react-hot-toast";

interface User {
  firstName: string;
  lastName: string;
  age: number;
  photo: string;
  _id: string;
}

interface UserCardProps {
  user: User;
  onAction?: (userId: string) => void;
}

const UserCard = ({ user, onAction }: UserCardProps) => {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [actionTaken, setActionTaken] = useState<string | null>(null);

  const sendConnection = async (action: string) => {
    setIsLoading(action);
    try {
      const res = await apiClient.post(`connection/connect/${action}/${user._id}`);
      toast.success(
        action === "interested" 
          ? `You liked ${user.firstName}! 💖` 
          : `Passed on ${user.firstName}`
      );
      setActionTaken(action);

      setTimeout(() => {
        onAction?.(user._id);
      }, 500);
    } catch (error:any) {
      const errorMessage = 
        error.response?.data?.message ||
        error.response?.data?.error ||  
        error.response?.data ||         
        error.message ||                
        "Something went wrong";         

      toast.error(errorMessage);
      console.error(error);
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <motion.div
      className="relative w-full max-w-sm h-[480px] rounded-3xl overflow-hidden shadow-2xl"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{
        opacity: 0,
        x: actionTaken === "interested" ? 300 : -300,
        rotate: actionTaken === "interested" ? 20 : -20,
        transition: { duration: 0.4 },
      }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8 }}
    >
      <img
        src={
          user.photo ??
          "https://www.svgrepo.com/show/384670/account-avatar-profile-user.svg"
        }
        alt={user.firstName}
        className="w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

      <motion.div
        className="absolute bottom-0 left-0 right-0 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="mb-5">
          <h3 className="text-2xl font-bold text-white">
            {user.firstName} {user.lastName},{" "}
            <span className="font-normal">{user.age}</span>
          </h3>
        </div>

        <div className="flex items-center justify-center gap-6">
          <motion.button
            onClick={() => sendConnection("ignored")}
            disabled={isLoading !== null || actionTaken !== null}
            className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border-2 border-white/30 flex items-center justify-center text-white disabled:opacity-50 cursor-pointer"
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
          >
            {isLoading === "ignored" ? (
              <motion.div
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </motion.button>

          <motion.button
            onClick={() => sendConnection("interested")}
            disabled={isLoading !== null || actionTaken !== null}
            className="w-16 h-16 rounded-full bg-gradient-to-r from-pink to-orange shadow-lg shadow-pink/40 flex items-center justify-center text-white disabled:opacity-50 cursor-pointer"
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
          >
            {isLoading === "interested" ? (
              <motion.div
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            ) : (
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            )}
          </motion.button>
        </div>
      </motion.div>

      <AnimatePresence>
        {actionTaken && (
          <motion.div
            className={`absolute inset-0 flex items-center justify-center ${
              actionTaken === "interested" ? "bg-green-500/80" : "bg-red-500/80"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {actionTaken === "interested" ? (
                <svg className="w-20 h-20 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              ) : (
                <svg className="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default UserCard;