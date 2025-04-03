import { Bucket } from "@/types/bucket";
import {
  addDoc,
  updateDoc,
  doc,
  collection,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

export async function getBuckets(projectId: string): Promise<Bucket[]> {
  const q = query(
    collection(db, "buckets"),
    where("projectId", "==", projectId),
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Bucket, "id">),
  }));
}

export async function createBucket(
  projectId: string,
  title: string,
  description: string = "",
): Promise<Bucket> {
  const docRef = await addDoc(collection(db, "buckets"), {
    projectId,
    title,
    description,
    createdAt: serverTimestamp(),
  });

  const snapshot = await getDoc(docRef);

  return {
    id: snapshot.id,
    ...(snapshot.data() as Omit<Bucket, "id">),
  };
}

export async function updateBucket(
  id: string,
  title: string,
  description: string = "",
): Promise<Bucket> {
  const bucketRef = doc(db, "buckets", id);

  await updateDoc(bucketRef, {
    title,
    description,
  });

  const snapshot = await getDoc(bucketRef);

  return {
    id: snapshot.id,
    ...(snapshot.data() as Omit<Bucket, "id">),
  };
}

// export async function createProject(
//   title: string,
//   uid: string,
// ): Promise<Project> {
//   const docRef = await addDoc(collection(db, "projects"), {
//     title,
//     createdAt: serverTimestamp(),
//     owner: uid,
//     members: [uid],
//   });

//   const snapshot = await getDoc(docRef);

//   return {
//     id: snapshot.id,
//     ...(snapshot.data() as Omit<Project, "id">),
//   };
// }

// export async function createInitialProject(uid: string) {
//   await createProject("기본 프로젝트", uid);
// }

// export async function renameProject(id: string, newTitle: string) {
//   const projectRef = doc(db, "projects", id);
//   await updateDoc(projectRef, {
//     title: newTitle,
//   });
// }

// export async function deleteProject(id: string) {
//   const buckets = await getDocs(
//     query(collection(db, "buckets"), where("projectId", "==", id)),
//   );

//   const tasks = await getDocs(
//     query(collection(db, "tasks"), where("projectId", "==", id)),
//   );

//   await Promise.all([
//     ...buckets.docs.map((doc) => deleteDoc(doc.ref)),
//     ...tasks.docs.map((doc) => deleteDoc(doc.ref)),
//     deleteDoc(doc(db, "projects", id)), // 🔥 이거 하나면 충분함
//   ]);
// }
