import { ChevronsUpDown, Plus } from "lucide-react";
import { useState } from "react";

import { NewProjectDialog } from "@/components/new-project-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useLoadProjects } from "@/hooks/use-load-projects";
import { useProjectStore } from "@/store/use-project-store";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";

export function ProjectSwitcher() {
  useLoadProjects();
  const { projects } = useProjectStore();
  const { isMobile } = useSidebar();
  const { projectId } = useParams();
  const { activeProject, setActiveProject } = useProjectStore();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!projectId || activeProject?.id === projectId) return;
    const found = projects.find((p) => p.id === projectId);
    if (found) setActiveProject(found);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projects, projectId, activeProject]);

  const handleChangeProject = (projectId: string) => {
    const found = projects.find((p) => p.id === projectId);
    if (!found) return;
    setActiveProject(found);
    navigate(`/dashboard/${projectId}`);
  };

  if (!activeProject) {
    return null;
  }

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  {activeProject.title.charAt(0)}
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {activeProject.title}
                  </span>
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
                프로젝트
              </DropdownMenuLabel>
              {projects.map((project) => (
                <DropdownMenuItem
                  key={project.id}
                  onClick={() => handleChangeProject(project.id)}
                  className="gap-2 p-2"
                >
                  <div className="flex size-6 items-center justify-center rounded-md border">
                    {/* <project.title className="size-3.5 shrink-0" /> */}
                    <div>{project.title.charAt(0)}</div>
                  </div>
                  {project.title}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setOpen(true)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                  <Plus className="size-4" />
                </div>
                <div className="text-muted-foreground font-medium">
                  새로운 프로젝트
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <NewProjectDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
