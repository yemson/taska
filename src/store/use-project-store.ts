import { create } from "zustand";
import { Project } from "@/types/project";
import { getProjects } from "@/lib/projects";

interface ProjectStore {
  projects: Project[];
  activeProject: Project | null;
  loading: boolean;
  projectsLoaded: boolean;
  setProjects: (p: Project[]) => void;
  setLoading: (l: boolean) => void;
  setActiveProject: (project: Project | null) => void;
  reset: () => void;
  loadProjects: (uid: string, projectId?: string) => Promise<void>;
}

export const useProjectStore = create<ProjectStore>((set) => ({
  projects: [],
  activeProject: null,
  loading: true,
  projectsLoaded: false,
  setProjects: (projects) => set({ projects }),
  setLoading: (loading) => set({ loading }),
  setActiveProject: (project) => set({ activeProject: project }),
  reset: () =>
    set({
      projects: [],
      loading: false,
      activeProject: null,
      projectsLoaded: false,
    }),
  loadProjects: async (uid: string, activeProjectId?: string) => {
    try {
      const projects = await getProjects(uid);
      let finalActiveProject: Project | null = null;

      if (activeProjectId) {
        finalActiveProject =
          projects.find((p) => p.id === activeProjectId) || null;
      }

      set({
        projects,
        activeProject: finalActiveProject,
        projectsLoaded: true,
      });
    } catch (err) {
      console.error("프로젝트 로딩 실패", err);
      set({ projects: [], projectsLoaded: true });
    } finally {
      set({ loading: false });
    }
  },
}));
