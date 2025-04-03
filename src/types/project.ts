import { Timestamp } from "firebase/firestore";

export interface Project {
  id: string;
  title: string;
  owner: string;
  members: string[];
  createdAt: Timestamp;
}
