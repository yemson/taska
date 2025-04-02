import { Routes, Route } from "react-router";
import { Button } from "@/components/ui/button";
import LoginPage from "./pages/login-page";
import { useAuthStore } from "./stores/useAuthStore";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

function App() {
  const setUser = useAuthStore((state) => state.setUser);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [setUser]);

  if (loading) return <div>로딩 중...</div>;

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="flex flex-col items-center justify-center min-h-svh">
            <Button>Click me</Button>
          </div>
        }
      />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}

export default App;
