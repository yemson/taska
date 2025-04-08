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
import { toast } from "sonner";
import { useBucketStore } from "@/store/use-bucket-store";
import { useNavigate } from "react-router";
import { deleteBucket } from "@/lib/buckets";

interface DeleteBucketAlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bucketId: string;
}

export function DeleteBucketAlertDialog({
  open,
  onOpenChange,
  bucketId,
}: DeleteBucketAlertDialogProps) {
  const buckets = useBucketStore((state) => state.buckets);
  const setBuckets = useBucketStore((state) => state.setBuckets);
  const activeBucket = useBucketStore((state) => state.activeBucket);
  const setActiveBucket = useBucketStore((state) => state.setActiveBucket);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      await deleteBucket(bucketId);
      const updated = buckets.filter((b) => b.id !== bucketId);

      if (activeBucket?.id === bucketId && updated.length > 0) {
        setActiveBucket(updated[0]);
        navigate({
          search: `?bucketId=${updated[0].id}`,
        });
      } else if (updated.length === 0) {
        setActiveBucket(null);
        navigate({
          search: "",
        });
      }

      setBuckets(updated);

      toast.success("버킷이 삭제되었습니다.");
    } catch (err) {
      toast.error("버킷 삭제를 실패했습니다.");
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
          <AlertDialogTitle>정말 버킷을 삭제하시겠습니까?</AlertDialogTitle>
          <AlertDialogDescription>
            이 작업은 되돌릴 수 없습니다. 이 작업을 수행하면 버킷 하위의 모든
            태스크가 삭제되고 서버에서 데이터가 제거됩니다.
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
