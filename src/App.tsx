import { Routes, Route } from "react-router";
import LoginPage from "@/pages/login-page";
import { useAuthStore } from "@/store/use-auth-store";
import { useEffect, lazy, Suspense } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import ProtectedRoute from "@/components/protected-route";
import RegisterPage from "@/pages/register-page";
import { getProjects, createInitialProject } from "@/lib/projects";
import { AppLoader } from "./components/app-loader";

function App() {
  const DashboardPage = lazy(() => import("@/pages/dashboard-page"));

  const user = useAuthStore((state) => state.user);
  const initialized = useAuthStore((state) => state.initialized);
  const setUser = useAuthStore((state) => state.setUser);
  const setInitialized = useAuthStore((state) => state.setInitialized);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setInitialized(true);
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

  return (
    <Routes>
      <Route
        path="/dashboard/:projectId"
        element={
          <Suspense fallback={<AppLoader />}>
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          </Suspense>
        }
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<div>asdf</div>} />
    </Routes>
  );
}

export default App;
