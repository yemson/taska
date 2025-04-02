import { ReactNode, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { useAuthStore } from "@/store/useAuthStore";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      console.log("로그인 안 되어 있음. 리디렉션 중...");
      navigate("/login", { state: { from: location }, replace: true });
    }
  }, [user, location, navigate]);

  if (!user) return null;

  return <>{children}</>;
}
