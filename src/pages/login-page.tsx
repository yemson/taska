import { LoginForm } from "@/components/form/login-form";
import { useState } from "react";
import { useNavigate } from "react-router";
import { login } from "@/lib/auth";
import { getProjects } from "@/lib/projects";

export default function LoginPage() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    try {
      setLoading(true);

      const user = await login(email, password);
      const projects = await getProjects(user.uid);

      if (projects.length === 0) {
        setErrorMessage("프로젝트가 없습니다. 관리자에게 문의하세요.");
        return;
      }

      const firstProjectId = projects[0].id;
      navigate(`/dashboard/${firstProjectId}`, { replace: true });
    } catch (error) {
      console.error(error);
      setErrorMessage("이메일 또는 비밀번호가 잘못되었습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm
          errorMessage={errorMessage}
          onLogin={handleLogin}
          loading={loading}
        />
      </div>
    </div>
  );
}
