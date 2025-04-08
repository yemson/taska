import {
  doc,
  updateDoc,
  addDoc,
  getDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { Project } from "@/types/project";

export async function getProjects(uid: string): Promise<Project[]> {
  const q = query(
    collection(db, "projects"),
    where("members", "array-contains", uid)
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

export async function createProject(
  title: string,
  uid: string
): Promise<Project> {
  const docRef = await addDoc(collection(db, "projects"), {
    title,
    createdAt: serverTimestamp(),
    owner: uid,
    members: [uid],
  });

  const snapshot = await getDoc(docRef);

  return {
    id: snapshot.id,
    ...(snapshot.data() as Omit<Project, "id">),
  };
}

export async function createInitialProject(uid: string) {
  await createProject("기본 프로젝트", uid);
}

export async function renameProject(id: string, newTitle: string) {
  const projectRef = doc(db, "projects", id);
  await updateDoc(projectRef, {
    title: newTitle,
  });
}

export async function deleteProject(id: string) {
  const buckets = await getDocs(
    query(collection(db, "buckets"), where("projectId", "==", id))
  );

  const tasks = await getDocs(
    query(collection(db, "tasks"), where("projectId", "==", id))
  );

  await Promise.all([
    ...buckets.docs.map((doc) => deleteDoc(doc.ref)),
    ...tasks.docs.map((doc) => deleteDoc(doc.ref)),
    deleteDoc(doc(db, "projects", id)),
  ]);
}
