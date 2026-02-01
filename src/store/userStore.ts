import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  user: any;
  setUser: (user: any) => void;
  clearUser: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const userStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      setUser: (user: any) => set({ user }),
      clearUser: () => set({ user: null }),
      setIsLoading: (loading: boolean) => set({ isLoading: loading }),
    }),
    {
      name: "user-storage",
      partialize: (state) => ({ user: state.user }),
    }
  )
);