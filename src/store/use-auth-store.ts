import { create } from "zustand";
import { User } from "firebase/auth";

interface AuthState {
  user: User | null;
  initialized: boolean;
  setInitialized: (initialized: boolean) => void;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  initialized: false,
  setInitialized: (initialized: boolean) => set({ initialized }),
  setUser: (user) => set({ user }),
}));
