import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "./firebase";
import { FirestoreBook } from "@/types";

export async function getBooks(): Promise<FirestoreBook[]> {
  const q = query(collection(db, "books"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestoreBook));
}

export async function getBook(id: string): Promise<FirestoreBook | null> {
  const snap = await getDoc(doc(db, "books", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as FirestoreBook;
}

export async function deleteBook(book: FirestoreBook) {
  // Delete files from storage
  if (book.pdfStoragePath) {
    try { await deleteObject(ref(storage, book.pdfStoragePath)); } catch {}
  }
  if (book.coverStoragePath) {
    try { await deleteObject(ref(storage, book.coverStoragePath)); } catch {}
  }
  await deleteDoc(doc(db, "books", book.id));
}

export async function uploadFile(
  file: File,
  path: string,
  onProgress?: (pct: number) => void
): Promise<{ url: string; storagePath: string }> {
  const storageRef = ref(storage, path);
  return new Promise((resolve, reject) => {
    const task = uploadBytesResumable(storageRef, file);
    task.on(
      "state_changed",
      (snap) => {
        const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
        onProgress?.(pct);
      },
      reject,
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        resolve({ url, storagePath: path });
      }
    );
  });
}

export async function addBook(data: Omit<FirestoreBook, "id" | "createdAt">) {
  return addDoc(collection(db, "books"), {
    ...data,
    createdAt: serverTimestamp(),
  });
}

export async function updateBook(id: string, data: Partial<FirestoreBook>) {
  return updateDoc(doc(db, "books", id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}
