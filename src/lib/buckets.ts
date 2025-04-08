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
  deleteDoc,
} from "firebase/firestore";
import { db } from "./firebase";

export async function getBuckets(projectId: string): Promise<Bucket[]> {
  const q = query(
    collection(db, "buckets"),
    where("projectId", "==", projectId)
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
  description: string = ""
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
  description: string = ""
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

export async function deleteBucket(id: string) {
  const tasks = await getDocs(
    query(collection(db, "tasks"), where("bucketId", "==", id))
  );

  await Promise.all([
    ...tasks.docs.map((doc) => deleteDoc(doc.ref)),
    deleteDoc(doc(db, "buckets", id)),
  ]);
}
