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
import { useState } from "react";
import { createProject } from "@/lib/projects";
import { useAuthStore } from "@/store/use-auth-store";
import { useProjectStore } from "@/store/use-project-store";
import { useNavigate } from "react-router";
import { toast } from "sonner";

interface NewProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewProjectDialog({ isOpen, onClose }: NewProjectDialogProps) {
  const user = useAuthStore((state) => state.user);
  const projects = useProjectStore((state) => state.projects);
  const setProjects = useProjectStore((state) => state.setProjects);
  const setActiveProject = useProjectStore((state) => state.setActiveProject);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError("프로젝트 이름을 입력하세요.");
      return;
    }

    try {
      const newProject = await createProject(title, user!.uid);
      setProjects([newProject, ...projects]);
      setActiveProject(newProject);
      navigate(`/dashboard/${newProject.id}`);
      onClose();

      toast.success("새로운 프로젝트가 생성되었습니다.");
    } catch (err) {
      console.error("프로젝트 생성 중 오류 발생:", err);
      setError("프로젝트 생성에 실패했습니다.");
    } finally {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>새로운 프로젝트</DialogTitle>
          <DialogDescription>프로젝트 이름을 입력하세요.</DialogDescription>
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
          <Button onClick={handleSubmit}>프로젝트 생성</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
