import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProjectStore } from "@/store/use-project-store";
import { Project } from "@/types/project";
import { useState } from "react";
import { renameProject } from "@/lib/projects";
import { toast } from "sonner";

interface EditProjectNameDialogProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
}

export function EditProjectNameDialog({
  isOpen,
  onClose,
  project,
}: EditProjectNameDialogProps) {
  const projects = useProjectStore((state) => state.projects);
  const setProjects = useProjectStore((state) => state.setProjects);
  const setActiveProject = useProjectStore((state) => state.setActiveProject);
  const activeProject = useProjectStore((state) => state.activeProject);

  const [title, setTitle] = useState(project?.title || "");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError("프로젝트 이름을 입력하세요.");
      return;
    }

    try {
      await renameProject(project!.id, title);
      const updated = projects.map((p) =>
        p.id === project!.id ? { ...p, title } : p
      );
      setProjects(updated);
      if (project!.id === activeProject?.id) {
        setActiveProject({ ...project!, title });
      }

      toast.success("프로젝트 이름이 변경되었습니다.");
    } catch (err) {
      console.error("이름 변경 중 오류 발생:", err);
      setError("이름 변경에 실패했습니다.");
    } finally {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>프로젝트 이름 변경</DialogTitle>
          <DialogDescription>
            변경할 프로젝트 이름을 입력하세요.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2 py-4">
          <Label htmlFor="name">이름</Label>
          <Input
            id="name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="예: 사이드 프로젝트, 업무용 등"
          />
          {error && <p className="text-sm text-destructive mt-1">{error}</p>}
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>이름 변경</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
