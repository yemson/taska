import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { User } from "firebase/auth";

interface AuthState {
  user: User | null;
  initialized: boolean;
  setInitialized: (initialized: boolean) => void;
  setUser: (user: User | null) => void;
}

const storeName = "auth";

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      user: null,
      initialized: false,

      setInitialized: (initialized: boolean) =>
        set({ initialized }, false, `${storeName}/setInitialized`),

      setUser: (user) => set({ user }, false, `${storeName}/setUser`),
    }),
    {
      name: "AuthStore",
    }
  )
);
