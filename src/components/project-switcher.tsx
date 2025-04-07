import {
  ChevronsUpDown,
  GalleryVerticalEnd,
  PenLine,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";

import { EditProjectNameDialog } from "@/components/dialog/edit-project-name-dialog";
import { NewProjectDialog } from "@/components/dialog/new-project-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useProjectStore } from "@/store/use-project-store";
import { Project } from "@/types/project";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { DeleteProjectAlertDialog } from "./dialog/delete-project-alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";

export function ProjectSwitcher() {
  const { isMobile } = useSidebar();
  const navigate = useNavigate();

  const activeProject = useProjectStore((state) => state.activeProject);
  const setActiveProject = useProjectStore((state) => state.setActiveProject);
  const projects = useProjectStore((state) => state.projects);
  const loading = useProjectStore((state) => state.loading);

  const [newProjectOpen, setNewProjectOpen] = useState(false);
  const [editProjectNameOpen, setEditProjectNameOpen] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [deleteProjectOpen, setDeleteProjectOpen] = useState(false);
  const [deleteProjectId, setDeleteProjectId] = useState<string>("");

  const handleChangeProject = (projectId: string) => {
    const found = projects.find((p) => p.id === projectId);
    if (!found) return;
    setActiveProject(found);
    navigate(`/dashboard/${projectId}`);
  };

  const handleEditProject = (project: Project) => {
    setEditProject(project);
    setEditProjectNameOpen(true);
  };

  const handleDeleteProject = async (projectId: string) => {
    setDeleteProjectId(projectId);
    setDeleteProjectOpen(true);
  };

  if (!activeProject || loading) {
    return <Skeleton className="h-12 w-full" />;
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
                <DropdownMenuSub key={project.id}>
                  <DropdownMenuSubTrigger className="gap-2 p-2">
                    <div className="flex size-6 items-center justify-center rounded-md border">
                      <div>{project.title.charAt(0)}</div>
                    </div>
                    {project.title}
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem
                        onClick={() => handleChangeProject(project.id)}
                      >
                        <GalleryVerticalEnd className="text-muted-foreground" />
                        <span>보기</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleEditProject(project)}
                      >
                        <PenLine className="text-muted-foreground" />
                        <span>이름 변경</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => {
                          if (projects.length === 1) {
                            toast.error(
                              "마지막 프로젝트는 삭제할 수 없습니다."
                            );
                            return;
                          }

                          handleDeleteProject(project.id);
                        }}
                      >
                        <Trash2 className="text-muted-foreground" />
                        <span>제거</span>
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  if (projects.length >= 5) {
                    toast.warning("프로젝트는 5개까지 생성 가능합니다.");
                    return;
                  }
                  setNewProjectOpen(true);
                }}
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
      <NewProjectDialog
        open={newProjectOpen}
        onOpenChange={setNewProjectOpen}
      />
      <EditProjectNameDialog
        open={editProjectNameOpen}
        onOpenChange={setEditProjectNameOpen}
        editProject={editProject}
      />
      <DeleteProjectAlertDialog
        open={deleteProjectOpen}
        onOpenChange={setDeleteProjectOpen}
        projectId={deleteProjectId}
      />
    </>
  );
}
