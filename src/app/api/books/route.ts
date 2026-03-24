/**
 * GET  /api/books        — fetch all books (newest first)
 * POST /api/books        — create a book record (metadata only, no file upload)
 * DELETE /api/books?id=  — delete a book record from Firestore
 *
 * All operations use Firebase Admin SDK (server-side only).
 */

import { NextRequest } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { ok, err } from "@/lib/apiHelpers";
import { FieldValue } from "firebase-admin/firestore";

// ── GET /api/books ──────────────────────────────────────────────────────────
export async function GET() {
  try {
    const db = getAdminDb();
    const snap = await db
      .collection("books")
      .orderBy("createdAt", "desc")
      .get();

    const books = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      // Convert Firestore Timestamp → ISO string for JSON serialization
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() ?? null,
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() ?? null,
    }));

    return ok(books);
  } catch (e) {
    console.error("[GET /api/books]", e);
    return err("Failed to fetch books.");
  }
}

// ── POST /api/books ─────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, author, category, description, coverImageURL, pdfURL, pages, language } = body;

    if (!title || !author || !category || !pdfURL) {
      return err("title, author, category, and pdfURL are required.", 400);
    }

    const db = getAdminDb();
    const docRef = await db.collection("books").add({
      title,
      author,
      category,
      description: description ?? "",
      coverImageURL: coverImageURL ?? "",
      pdfURL,
      pages: pages ?? null,
      language: language ?? null,
      createdAt: FieldValue.serverTimestamp(),
    });

    return ok({ id: docRef.id }, 201);
  } catch (e) {
    console.error("[POST /api/books]", e);
    return err("Failed to create book.");
  }
}

// ── DELETE /api/books?id=<docId> ─────────────────────────────────────────────
export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) return err("id query param is required.", 400);

    const db = getAdminDb();
    await db.collection("books").doc(id).delete();
    return ok({ id });
  } catch (e) {
    console.error("[DELETE /api/books]", e);
    return err("Failed to delete book.");
  }
}
