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
import { useBucketStore } from "@/store/use-bucket-store";
import { Bucket } from "@/types/bucket";
import { useEffect, useState } from "react";
import { updateBucket } from "@/lib/buckets";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

interface UpdateBucketDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bucket: Bucket | null;
}

export function UpdateBucketDialog({
  open,
  onOpenChange,
  bucket,
}: UpdateBucketDialogProps) {
  const { buckets, setBuckets } = useBucketStore();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (bucket) {
      setTitle(bucket.title || "");
      setDescription(bucket.description || "");
      setError("");
    }
  }, [open, bucket]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError("프로젝트 이름을 입력하세요.");
      return;
    }

    try {
      await updateBucket(bucket!.id, title, description);

      const updated = buckets.map((b) =>
        b.id === bucket!.id ? { ...b, title } : b,
      );

      setBuckets(updated);

      onOpenChange(false);
      setTitle("");
      setError("");

      toast.success("버킷 정보가 변경되었습니다.");
    } catch (err) {
      console.error("버킷 정보 변경 중 오류 발생:", err);
      setError("버킷 정보 변경에 실패했습니다.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>버킷 정보 변경</DialogTitle>
          <DialogDescription>
            변경할 버킷의 정보를 입력하세요.
          </DialogDescription>
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
          <Button onClick={handleSubmit}>이름 변경</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
