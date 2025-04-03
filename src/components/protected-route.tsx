import { ReactNode, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { useAuthStore } from "@/store/use-auth-store";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, initialized } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!initialized) return;
    if (!user) {
      navigate("/login", { state: { from: location }, replace: true });
    }
  }, [user, location, navigate, initialized]);

  if (!initialized) return null;
  if (!user) return null;

  return <>{children}</>;
}
