import { create } from "zustand";
import { devtools } from "zustand/middleware";
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

const storeName = "project";

export const useProjectStore = create<ProjectStore>()(
  devtools(
    (set) => ({
      projects: [],
      activeProject: null,
      loading: true,
      projectsLoaded: false,
      setProjects: (projects) =>
        set({ projects }, false, `${storeName}/setProjects`),
      setLoading: (loading) =>
        set({ loading }, false, `${storeName}/setLoading`),
      setActiveProject: (project) =>
        set({ activeProject: project }, false, `${storeName}/setActiveProject`),
      reset: () =>
        set(
          () => ({
            projects: [],
            loading: false,
            activeProject: null,
            projectsLoaded: false,
          }),
          false,
          `${storeName}/reset`
        ),
      loadProjects: async (uid: string, activeProjectId?: string) => {
        set({ loading: true }, false, `${storeName}/loadProjects/start`);

        try {
          const projects = await getProjects(uid);
          let finalActiveProject: Project | null = null;

          if (activeProjectId) {
            finalActiveProject =
              projects.find((p) => p.id === activeProjectId) || null;
          }

          set(
            {
              projects,
              activeProject: finalActiveProject,
              projectsLoaded: true,
            },
            false,
            `${storeName}/loadProjects/success`
          );
        } catch (err) {
          console.error("프로젝트 로딩 실패", err);
          set(
            {
              projects: [],
              activeProject: null,
              projectsLoaded: true,
            },
            false,
            `${storeName}/loadProjects/error`
          );
        } finally {
          set({ loading: false }, false, `${storeName}/loadProjects/finish`);
        }
      },
    }),
    {
      name: "ProjectStore",
    }
  )
);
