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
import { useEffect, useState } from "react";
import { createBucket } from "@/lib/buckets";
import { useBucketStore } from "@/store/use-bucket-store";
import { toast } from "sonner";
import { useProjectStore } from "@/store/use-project-store";
import { Textarea } from "@/components/ui/textarea";

interface NewBucketDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewBucketDialog({ open, onOpenChange }: NewBucketDialogProps) {
  const { setBuckets, setActiveBucket, buckets } = useBucketStore();
  const { activeProject } = useProjectStore();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setTitle("");
    setDescription("");
    setError("");
  }, [open]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError("버킷 이름을 입력하세요.");
      return;
    }

    const newBucket = await createBucket(activeProject!.id, title, description);
    setBuckets([newBucket, ...buckets]);
    setActiveBucket(newBucket);
    onOpenChange(false);
    setTitle("");
    setDescription("");
    setError("");

    toast.success("새로운 버킷이 생성되었습니다.");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>새로운 버킷</DialogTitle>
          <DialogDescription>버킷 정보를 입력하세요.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-2 pt-4 pb-2">
          <Label htmlFor="name">이름</Label>
          <Input
            id="name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="예: 여행 계획, 취미"
          />
          {error && <p className="text-sm text-destructive mt-1">{error}</p>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="name">설명</Label>
          <Textarea
            id="name"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="버킷 설명을 입력하세요."
          />
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>버킷 생성</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
