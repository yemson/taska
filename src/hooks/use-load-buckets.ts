import { getBuckets } from "@/lib/buckets";
import { useBucketStore } from "@/store/use-bucket-store";
import { useEffect } from "react";

export function useLoadBuckets(projectId: string | null) {
  const setBuckets = useBucketStore((state) => state.setBuckets);
  const setLoading = useBucketStore((state) => state.setLoading);

  useEffect(() => {
    console.log("123");

    if (!projectId) return;

    const load = async () => {
      setLoading(true);
      try {
        const buckets = await getBuckets(projectId);
        setBuckets(buckets);
      } catch (err) {
        console.error("버킷 로딩 실패", err);
        setBuckets([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [projectId]);
}
