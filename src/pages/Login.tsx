import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useStore } from "zustand";
import { userStore } from "../store/userStore";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../utils/axios";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

const Login = () => {
  const [email, setEmail] = useState("akshay@kumar.com");
  const [password, setPassword] = useState("12345");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate()

  const {setUser,user} = useStore(userStore)

  useEffect(() => {
    if (user) {
      navigate('/feed');}
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
        const data = await apiClient.post(`/auth/login`, { email, password });
        setUser(data.data.data)
        setIsLoading(false);
        navigate('/feed');
    } catch (error:any) {
        setIsLoading(false);
        if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.message || "Please try again.";
        toast.error(errorMessage);
        console.error("Backend error:", errorMessage);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="mt-[-61.6px] min-h-screen flex items-center justify-center bg-linear-to-br from-pink-50 to-purple-50 px-4">
      <motion.div
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
          Welcome Back
        </h1>
        <p className="text-center text-gray-600 mb-8">Sign in to your account</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
            />
          </motion.div>

          {/* Password Field */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
            />
          </motion.div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            className="w-full mt-6 bg-linear-to-r from-pink-600 to-purple-600 text-white font-semibold py-2 rounded-lg hover:shadow-lg transition-shadow duration-200 cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {isLoading ? "Logging in..." : "Log In"}
          </motion.button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-6">
          Don't have an account?{" "}
          <a onClick={()=>navigate('/signup')} className="text-pink-600 font-medium hover:underline">
            Sign up here
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;