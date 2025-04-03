import { create } from "zustand";
import { Project } from "@/types/project";

interface ProjectStore {
  projects: Project[];
  loading: boolean;
  setProjects: (p: Project[]) => void;
  setLoading: (l: boolean) => void;
  reset: () => void;
}

export const useProjectStore = create<ProjectStore>((set) => ({
  projects: [],
  loading: false,
  setProjects: (projects) => set({ projects }),
  setLoading: (loading) => set({ loading }),
  reset: () => set({ projects: [], loading: false }),
}));
