import { create } from "zustand";
import { Bucket } from "@/types/bucket";

interface BucketStore {
  buckets: Bucket[];
  activeBucket: Bucket | null;
  loading: boolean;
  setBuckets: (p: Bucket[]) => void;
  setLoading: (l: boolean) => void;
  setActiveBucket: (project: Bucket | null) => void;
  reset: () => void;
}

export const useBucketStore = create<BucketStore>((set) => ({
  buckets: [],
  activeBucket: null,
  loading: true,
  setBuckets: (buckets) => set({ buckets }),
  setLoading: (loading) => set({ loading }),
  setActiveBucket: (project) => set({ activeBucket: project }),
  reset: () => set({ buckets: [], loading: false, activeBucket: null }),
}));
