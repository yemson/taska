import { useProjectStore } from "@/store/use-project-store";
import { useAuthStore } from "@/store/use-auth-store";
import { getProjects } from "@/lib/projects";
import { useEffect } from "react";

export function useLoadProjects() {
  const { setProjects, setLoading } = useProjectStore();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    getProjects(user.uid)
      .then(setProjects)
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
}
