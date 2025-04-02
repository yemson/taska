import { auth } from "@/lib/firebase";
import { signOut, signInWithEmailAndPassword } from "firebase/auth";
import { useAuthStore } from "@/store/useAuthStore";

// 로그인 로직
export async function login(email: string, password: string) {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password,
  );
  const user = userCredential.user;
  useAuthStore.getState().setUser(user);
  return user;
}

// 로그아웃 로직
export async function logout(navigate: (path: string) => void) {
  await signOut(auth);
  useAuthStore.getState().setUser(null);
  navigate("/login");
}
