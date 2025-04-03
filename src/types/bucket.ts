import { Timestamp } from "firebase/firestore";

export interface Bucket {
  id: string;
  projectId: string;
  title: string;
  description: string;
  createdAt: Timestamp;
}
