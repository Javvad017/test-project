/**
 * books.ts — Firebase Realtime Database + Storage operations
 * Uses RTDB (not Firestore). All writes go to /books/<pushId>.
 */

import {
  ref as rtdbRef,
  get,
  set,
  push,
  update,
  remove,
  onValue,
  query,
  orderByChild,
} from "firebase/database";
import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { rtdb, storage } from "./firebase";
import { FirestoreBook } from "@/types";

// ─── Real-time subscription ──────────────────────────────────────────────────

export function subscribeToBooks(
  callback: (books: FirestoreBook[]) => void
): () => void {
  const q = query(rtdbRef(rtdb, "books"), orderByChild("createdAt"));
  const unsub = onValue(q, (snap) => {
    const books: FirestoreBook[] = [];
    snap.forEach((child) => {
      books.push({ id: child.key as string, ...child.val() });
    });
    callback(books.reverse()); // newest first
  });
  return unsub;
}

// ─── One-time fetch ──────────────────────────────────────────────────────────

export async function getBooks(): Promise<FirestoreBook[]> {
  const q = query(rtdbRef(rtdb, "books"), orderByChild("createdAt"));
  const snap = await get(q);
  const books: FirestoreBook[] = [];
  snap.forEach((child) => {
    books.push({ id: child.key as string, ...child.val() });
  });
  return books.reverse();
}

export async function getBook(id: string): Promise<FirestoreBook | null> {
  const snap = await get(rtdbRef(rtdb, `books/${id}`));
  if (!snap.exists()) return null;
  return { id: snap.key as string, ...snap.val() } as FirestoreBook;
}

// ─── Upload file to Firebase Storage ────────────────────────────────────────
// Uses uploadBytesResumable for progress tracking on all file sizes.
// onProgress callback receives 0–100 integer.

export async function uploadFile(
  file: File,
  path: string,
  onProgress?: (pct: number) => void
): Promise<{ url: string; storagePath: string }> {
  return new Promise((resolve, reject) => {
    // Log for debugging
    console.log("[uploadFile] Starting upload:", { path, size: file.size, type: file.type });

    const fileRef = storageRef(storage, path);

    const metadata = {
      contentType: file.type || "application/octet-stream",
    };

    const task = uploadBytesResumable(fileRef, file, metadata);

    // Stall watchdog: cancel if no bytes transferred for 60 s
    let lastBytes = -1;
    let stallCount = 0;
    const STALL_INTERVAL_MS = 5000;
    const MAX_STALL_INTERVALS = 12; // 60 s total

    const watchdog = setInterval(() => {
      const current = task.snapshot.bytesTransferred;
      if (current === lastBytes) {
        stallCount++;
        console.warn(
          `[uploadFile] Stall detected (${stallCount}/${MAX_STALL_INTERVALS}), bytes stuck at ${current}`
        );
        if (stallCount >= MAX_STALL_INTERVALS) {
          clearInterval(watchdog);
          task.cancel();
          reject(
            new Error(
              "Upload stalled for 60 s. Possible causes:\n" +
              "1. Firebase Storage rules block unauthenticated uploads\n" +
              "2. CORS not configured for your storage bucket\n" +
              "3. Network issue\n\n" +
              "Fix: Set Storage rules to 'allow read, write: if true;' in Firebase Console."
            )
          );
        }
      } else {
        stallCount = 0;
        lastBytes = current;
      }
    }, STALL_INTERVAL_MS);

    task.on(
      "state_changed",
      (snap) => {
        if (snap.totalBytes > 0) {
          const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
          console.log(`[uploadFile] Progress: ${pct}% (${snap.bytesTransferred}/${snap.totalBytes})`);
          onProgress?.(pct);
        }
      },
      (err) => {
        clearInterval(watchdog);
        // Provide human-readable error messages
        let message = err.message;
        if (err.code === "storage/unauthorized") {
          message =
            "Permission denied by Firebase Storage rules. " +
            "Open Firebase Console → Storage → Rules and set: allow read, write: if true;";
        } else if (err.code === "storage/canceled") {
          message = "Upload was cancelled (likely due to a stall timeout).";
        } else if (err.code === "storage/unknown") {
          message =
            "Unknown Storage error. This is often a CORS issue. " +
            "See the README for CORS configuration instructions.";
        }
        console.error("[uploadFile] Error:", err.code, message);
        reject(new Error(message));
      },
      async () => {
        clearInterval(watchdog);
        try {
          console.log("[uploadFile] Upload complete! Getting download URL...");
          const url = await getDownloadURL(task.snapshot.ref);
          console.log("[uploadFile] Download URL obtained:", url);
          resolve({ url, storagePath: path });
        } catch (e) {
          console.error("[uploadFile] getDownloadURL failed:", e);
          reject(e);
        }
      }
    );
  });
}

// ─── Write book metadata to RTDB ────────────────────────────────────────────
// Uses Date.now() instead of serverTimestamp() sentinel to avoid
// issues when mixing it with other fields in set().

export async function addBook(
  data: Omit<FirestoreBook, "id" | "createdAt">
): Promise<ReturnType<typeof push>> {
  console.log("[addBook] Writing to RTDB:", data.title);
  const newRef = push(rtdbRef(rtdb, "books"));
  await set(newRef, {
    title: data.title,
    author: data.author,
    category: data.category,
    description: data.description || "",
    coverUrl: data.coverUrl || "",
    coverStoragePath: data.coverStoragePath || "",
    pdfUrl: data.pdfUrl,
    pdfStoragePath: data.pdfStoragePath,
    ...(data.pages   !== undefined ? { pages: data.pages }       : {}),
    ...(data.language               ? { language: data.language } : {}),
    createdAt: Date.now(), // numeric timestamp — safe with RTDB set()
  });
  console.log("[addBook] Book saved to RTDB with key:", newRef.key);
  return newRef;
}

export async function updateBook(
  id: string,
  data: Partial<FirestoreBook>
): Promise<void> {
  await update(rtdbRef(rtdb, `books/${id}`), {
    ...data,
    updatedAt: Date.now(),
  });
}

// ─── Delete book + its storage files ────────────────────────────────────────

export async function deleteBook(book: FirestoreBook): Promise<void> {
  const deletions: Promise<void>[] = [];

  if (book.pdfStoragePath) {
    deletions.push(
      deleteObject(storageRef(storage, book.pdfStoragePath)).catch(() => {})
    );
  }
  if (book.coverStoragePath) {
    deletions.push(
      deleteObject(storageRef(storage, book.coverStoragePath)).catch(() => {})
    );
  }

  await Promise.all(deletions);
  await remove(rtdbRef(rtdb, `books/${book.id}`));
}
