import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { useStore } from "zustand";
import { userStore } from "../store/userStore";
import { useEffect } from "react";
import { apiClient } from "../utils/axios";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

const Body = () => {
  const { user, setUser, setIsLoading, isLoading } = useStore(userStore);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      if (user) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await apiClient.get("/user/profile");
        const userData = res.data.user || res.data;
        if (userData && userData._id) {
          setUser(userData);
        }
      } catch (error: any) {
        // console.error("Error fetching user profile:", error);
        // if (error instanceof AxiosError) {
        //   console.log(error.response?.data)
        //   const errorMessage = error.response?.data || "Please try again.";
        //   toast.error(errorMessage);
        // }
        if (error.response?.status === 401) {
          setUser(null);
          navigate("/");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-pink border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
};

export default Body;