/**
 * Firebase Admin SDK — server-side only.
 * Lazy-initialized on first use so it never runs at build time.
 * Never import this from client components.
 */

import { getApps, cert, initializeApp, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import { getStorage, Storage } from "firebase-admin/storage";
import { getAuth, Auth } from "firebase-admin/auth";

let _app: App | null = null;
let _db: Firestore | null = null;
let _storage: Storage | null = null;
let _auth: Auth | null = null;

function getServiceAccount() {
  // Option A: full service account JSON as base64 string
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (raw) {
    try {
      return JSON.parse(Buffer.from(raw, "base64").toString("utf8"));
    } catch {
      return JSON.parse(raw); // try raw JSON
    }
  }

  // Option B: individual env vars
  const projectId   = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey  = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Firebase Admin credentials not configured. " +
      "Set FIREBASE_SERVICE_ACCOUNT_KEY or the three FIREBASE_ADMIN_* env vars."
    );
  }

  return { project_id: projectId, client_email: clientEmail, private_key: privateKey };
}

function getAdminApp(): App {
  if (_app) return _app;
  const existing = getApps();
  if (existing.length > 0) {
    _app = existing[0];
    return _app;
  }
  _app = initializeApp({
    credential: cert(getServiceAccount()),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
  return _app;
}

// Lazy getters — safe to import at module level, only execute on first call
export function getAdminDb(): Firestore {
  if (!_db) _db = getFirestore(getAdminApp());
  return _db;
}

export function getAdminStorage(): Storage {
  if (!_storage) _storage = getStorage(getAdminApp());
  return _storage;
}

export function getAdminAuth(): Auth {
  if (!_auth) _auth = getAuth(getAdminApp());
  return _auth;
}

// Convenience re-exports as properties (initialized lazily via getters)
export const adminDb      = new Proxy({} as Firestore,      { get: (_, p) => (getAdminDb()      as never)[p] });
export const adminStorage = new Proxy({} as Storage,        { get: (_, p) => (getAdminStorage() as never)[p] });
export const adminAuth    = new Proxy({} as Auth,           { get: (_, p) => (getAdminAuth()    as never)[p] });
