import { RegisterForm } from "@/components/form/register-form";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { register } from "@/lib/auth";
import { createInitialProject } from "@/lib/projects";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (email: string, password: string) => {
    try {
      setLoading(true);
      const userCredential = await register(email, password);
      const uid = userCredential.uid;
      await createInitialProject(uid);
      navigate(from, { replace: true });
    } catch (error) {
      console.error(error);
      setErrorMessage("회원가입 중 문제가 발생하였습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <RegisterForm
          errorMessage={errorMessage}
          onRegister={handleRegister}
          loading={loading}
        />
      </div>
    </div>
  );
}
