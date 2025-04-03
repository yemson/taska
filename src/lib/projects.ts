import {
  addDoc,
  getDocs,
  query,
  where,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { Project } from "@/types/project";

export async function getProjects(uid: string): Promise<Project[]> {
  const q = query(
    collection(db, "projects"),
    where("members", "array-contains", uid),
  );

  const snapshot = await getDocs(q);
  const myProjects: Project[] = snapshot.docs.map((doc) => {
    const data = doc.data() as Omit<Project, "id">;
    return {
      id: doc.id,
      ...data,
    };
  });

  return myProjects;
}

export async function createProject(title: string, uid: string) {
  await addDoc(collection(db, "projects"), {
    title,
    createdAt: serverTimestamp(),
    owner: uid,
    members: [uid],
  });
}

export async function createInitialProject(uid: string) {
  await createProject("기본 프로젝트", uid);
}
