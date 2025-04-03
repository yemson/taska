import { create } from "zustand";
import { Project } from "@/types/project";

interface ProjectStore {
  projects: Project[];
  activeProject: Project | null;
  loading: boolean;
  setProjects: (p: Project[]) => void;
  setLoading: (l: boolean) => void;
  setActiveProject: (project: Project | null) => void;
  reset: () => void;
}

export const useProjectStore = create<ProjectStore>((set) => ({
  projects: [],
  activeProject: null,
  loading: false,
  setProjects: (projects) => set({ projects }),
  setLoading: (loading) => set({ loading }),
  setActiveProject: (project) => set({ activeProject: project }),
  reset: () => set({ projects: [], loading: false, activeProject: null }),
}));
