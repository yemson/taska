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

interface DeleteProjectAlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
}

export function DeleteProjectAlertDialog({
  open,
  onOpenChange,
  projectId,
}: DeleteProjectAlertDialogProps) {
  const { projects, setProjects, activeProject, setActiveProject } =
    useProjectStore();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
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
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {/* <AlertDialogTrigger>asdf</AlertDialogTrigger> */}
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
