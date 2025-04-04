import { create } from "zustand";
import { Bucket } from "@/types/bucket";
import { getBuckets } from "@/lib/buckets";

interface BucketStore {
  buckets: Bucket[];
  activeBucket: Bucket | null;
  loading: boolean;
  setBuckets: (p: Bucket[]) => void;
  setLoading: (l: boolean) => void;
  setActiveBucket: (project: Bucket | null) => void;
  reset: () => void;
  loadBuckets: (projectId: string) => Promise<void>;
}

export const useBucketStore = create<BucketStore>((set) => ({
  buckets: [],
  activeBucket: null,
  loading: true,
  setBuckets: (buckets) => set({ buckets }),
  setLoading: (loading) => set({ loading }),
  setActiveBucket: (project) => set({ activeBucket: project }),
  reset: () => set({ buckets: [], loading: false, activeBucket: null }),
  loadBuckets: async (projectId: string) => {
    set({ loading: true });
    try {
      const buckets = await getBuckets(projectId);
      set({ buckets, loading: false });
    } catch (err) {
      console.error("버킷 로딩 실패", err);
      set({ buckets: [] });
    } finally {
      set({ loading: false });
    }
  },
}));
