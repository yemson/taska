import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Bucket } from "@/types/bucket";
import { getBuckets } from "@/lib/buckets";

interface BucketStore {
  buckets: Bucket[];
  activeBucket: Bucket | null;
  loading: boolean;
  setBuckets: (p: Bucket[]) => void;
  setLoading: (l: boolean) => void;
  setActiveBucket: (bucket: Bucket | null) => void; // 파라미터 이름 수정됨
  reset: () => void;
  loadBuckets: (projectId: string) => Promise<void>;
}

const storeName = "bucket";

export const useBucketStore = create<BucketStore>()(
  devtools(
    (set) => ({
      buckets: [],
      activeBucket: null,
      loading: true,

      setBuckets: (buckets) =>
        set({ buckets }, false, `${storeName}/setBuckets`),

      setLoading: (loading) =>
        set({ loading }, false, `${storeName}/setLoading`),

      setActiveBucket: (bucket) =>
        set({ activeBucket: bucket }, false, `${storeName}/setActiveBucket`),

      reset: () =>
        set(
          { buckets: [], loading: false, activeBucket: null },
          false,
          `${storeName}/reset`
        ),

      loadBuckets: async (projectId: string) => {
        set({ loading: true }, false, `${storeName}/loadBuckets/start`);

        try {
          const buckets = await getBuckets(projectId);
          let finalActiveBucket: Bucket | null = null;

          if (buckets.length > 0) {
            finalActiveBucket = buckets[0];
          }

          set(
            { buckets, activeBucket: finalActiveBucket },
            false,
            `${storeName}/loadBuckets/success`
          );
        } catch (err) {
          console.error("버킷 로딩 실패", err);
          set(
            { buckets: [], activeBucket: null },
            false,
            `${storeName}/loadBuckets/error`
          );
        } finally {
          set({ loading: false }, false, `${storeName}/loadBuckets/finish`);
        }
      },
    }),
    {
      name: "BucketStore",
    }
  )
);
