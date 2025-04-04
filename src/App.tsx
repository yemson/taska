import { Routes, Route } from "react-router";
import LoginPage from "@/pages/login-page";
import { useAuthStore } from "@/store/use-auth-store";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import ProtectedRoute from "@/components/protected-route";
import DashboardPage from "@/pages/dashboard-page";
import RegisterPage from "@/pages/register-page";
import { getProjects, createInitialProject } from "@/lib/projects";
import { AppLoader } from "./components/app-loader";

function App() {
  const user = useAuthStore((state) => state.user);
  const initialized = useAuthStore((state) => state.initialized);
  const setUser = useAuthStore((state) => state.setUser);
  const setInitialized = useAuthStore((state) => state.setInitialized);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setInitialized(true);
      setLoading(false);
    });
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const ensureDefaultProject = async () => {
      if (!user || !initialized) return;

      const projects = await getProjects(user.uid);

      if (projects.length === 0) {
        await createInitialProject(user.uid);
      }
    };

    ensureDefaultProject();
  }, [user, initialized]);

  if (loading) return <AppLoader />;

  return (
    <Routes>
      <Route
        path="/dashboard/:projectId"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<div>asdf</div>} />
    </Routes>
  );
}

export default App;
