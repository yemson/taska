import { useProjectStore } from "@/store/use-project-store";
import { useAuthStore } from "@/store/use-auth-store";
import { getProjects } from "@/lib/projects";
import { useEffect } from "react";

export function useLoadProjects() {
  // const { setProjects, setLoading } = useProjectStore();
  const user = useAuthStore((state) => state.user);
  const setProjects = useProjectStore((state) => state.setProjects);
  const setLoading = useProjectStore((state) => state.setLoading);

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      setLoading(true);
      try {
        const projects = await getProjects(user.uid);
        setProjects(projects);
      } catch (err) {
        console.error("프로젝트 로딩 실패", err);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user, setProjects, setLoading]);
}
