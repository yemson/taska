import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteProject } from "@/lib/projects";
import { toast } from "sonner";
import { useProjectStore } from "@/store/use-project-store";
import { useNavigate } from "react-router";
import { Project } from "@/types/project";

interface DeleteProjectAlertDialogProps {
  isOpen: boolean;
  project: Project | null;
  onClose: () => void;
}

export function DeleteProjectAlertDialog({
  isOpen,
  project,
  onClose,
}: DeleteProjectAlertDialogProps) {
  const projects = useProjectStore((state) => state.projects);
  const setProjects = useProjectStore((state) => state.setProjects);
  const activeProject = useProjectStore((state) => state.activeProject);
  const setActiveProject = useProjectStore((state) => state.setActiveProject);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const projectId = project!.id;
      await deleteProject(projectId);
      const updated = projects.filter((p) => p.id !== projectId);
      if (activeProject?.id === projectId && updated.length > 0) {
        setActiveProject(updated[0]);
        navigate(`/dashboard/${updated[0].id}`);
      }

      setProjects(updated);
    } catch (err) {
      toast.error("프로젝트 삭제에 실패했습니다.");
      console.error(err);
    } finally {
      onClose();
      toast.success("프로젝트가 삭제되었습니다.");
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>정말 프로젝트를 삭제하시겠습니까?</AlertDialogTitle>
          <AlertDialogDescription>
            이 작업은 되돌릴 수 없습니다. 이 작업을 수행하면 프로젝트 하위의
            모든 버킷이 삭제되고 서버에서 데이터가 제거됩니다.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmit}>삭제</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
