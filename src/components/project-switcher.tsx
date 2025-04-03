import { useState, ElementType } from "react";
import { ChevronsUpDown, Plus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { createProject } from "@/lib/projects";
import { useAuthStore } from "@/store/use-auth-store";
import { useLoadProjects } from "@/hooks/use-load-projects";
import { useProjectStore } from "@/store/use-project-store";
import { Project } from "@/types/project";
import { useEffect } from "react";

export function ProjectSwitcher() {
  useLoadProjects();
  const { projects } = useProjectStore();
  const { isMobile } = useSidebar();
  const user = useAuthStore((state) => state.user);
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  useEffect(() => {
    if (projects.length > 0) {
      setActiveProject(projects[0]);
    }
  }, [projects]);

  if (!activeProject) {
    return null;
  }

  const handleCreateProject = async () => {
    try {
      await createProject("test", user!.uid);
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                {activeProject.title}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {activeProject.title}
                </span>
                <span className="truncate text-xs">{activeProject.title}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Projects
            </DropdownMenuLabel>
            {projects.map((project, index) => (
              <DropdownMenuItem
                key={project.id}
                onClick={() => setActiveProject(project)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                  {/* <project.title className="size-3.5 shrink-0" /> */}
                  <div>{project.title}</div>
                </div>
                {project.title}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleCreateProject}
              className="gap-2 p-2"
            >
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">Add team</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
