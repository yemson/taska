import { Routes, Route } from "react-router";
import LoginPage from "./pages/login-page";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import ProtectedRoute from "./components/protected-route";
import DashboardPage from "./pages/dashboard-page";

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
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}

export default App;
