import { create } from "zustand";

interface UserState {
  user: any;
  setUser: (user: any) => void;
  clearUser: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const userStore = create<UserState>()((set) => ({
      user: null,
      isLoading: false,
      setUser: (user: any) => set({ user }),
      clearUser: () => set({ user: null }),
      setIsLoading: (loading: boolean) => set({ isLoading: loading }),
    })
);