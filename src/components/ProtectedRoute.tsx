import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router";
import { useAuthStore } from "@/stores/useAuthStore";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();

  // 로그인 안 돼있으면 로그인 페이지로 튕김
  if (!user) {
    navigate("/login", { state: { from: location }, replace: true });
  }

  // 로그인 돼있으면 정상 렌더링
  return <>{children}</>;
}
