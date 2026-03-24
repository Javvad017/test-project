/**
 * POST /api/upload-book
 *
 * Accepts multipart/form-data with:
 *   - title        (string, required)
 *   - author       (string, required)
 *   - category     (string, required)
 *   - description  (string, optional)
 *   - pages        (number, optional)
 *   - language     (string, optional)
 *   - pdf          (File, required)   → stored at /books/<timestamp>_<slug>.pdf
 *   - cover        (File, optional)   → stored at /book-covers/<timestamp>_<slug>
 *
 * Returns the new Firestore document id and public download URLs.
 */

import { NextRequest } from "next/server";
import { getAdminDb, getAdminStorage } from "@/lib/firebaseAdmin";
import { ok, err } from "@/lib/apiHelpers";
import { FieldValue } from "firebase-admin/firestore";

async function uploadToStorage(
  buffer: Buffer,
  storagePath: string,
  contentType: string
): Promise<string> {
  const bucket = getAdminStorage().bucket();
  const file = bucket.file(storagePath);

  await file.save(buffer, {
    metadata: { contentType },
    resumable: false,
  });

  // Make the file publicly readable
  await file.makePublic();

  return `https://storage.googleapis.com/${bucket.name}/${storagePath}`;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // ── Required fields ──────────────────────────────────────────────────────
    const title    = formData.get("title")    as string | null;
    const author   = formData.get("author")   as string | null;
    const category = formData.get("category") as string | null;
    const pdfFile  = formData.get("pdf")      as File   | null;

    if (!title || !author || !category || !pdfFile) {
      return err("title, author, category, and pdf file are required.", 400);
    }

    // ── Optional fields ──────────────────────────────────────────────────────
    const description = (formData.get("description") as string) ?? "";
    const pages       = formData.get("pages") ? parseInt(formData.get("pages") as string) : null;
    const language    = (formData.get("language") as string) ?? null;
    const coverFile   = formData.get("cover") as File | null;

    const ts   = Date.now();
    const slug = title.replace(/[^a-z0-9]/gi, "_").toLowerCase();

    // ── Upload PDF ───────────────────────────────────────────────────────────
    const pdfBuffer      = Buffer.from(await pdfFile.arrayBuffer());
    const pdfStoragePath = `books/${ts}_${slug}.pdf`;
    const pdfURL         = await uploadToStorage(pdfBuffer, pdfStoragePath, "application/pdf");

    // ── Upload cover (optional) ──────────────────────────────────────────────
    let coverImageURL    = "";
    let coverStoragePath = "";

    if (coverFile && coverFile.size > 0) {
      const coverBuffer  = Buffer.from(await coverFile.arrayBuffer());
      coverStoragePath   = `book-covers/${ts}_${slug}`;
      coverImageURL      = await uploadToStorage(coverBuffer, coverStoragePath, coverFile.type);
    }

    // ── Save metadata to Firestore ───────────────────────────────────────────
    const db = getAdminDb();
    const docRef = await db.collection("books").add({
      title,
      author,
      category,
      description,
      coverImageURL,
      coverStoragePath,
      pdfURL,
      pdfStoragePath,
      pages,
      language,
      createdAt: FieldValue.serverTimestamp(),
    });

    return ok({
      id: docRef.id,
      pdfURL,
      coverImageURL,
      pdfStoragePath,
      coverStoragePath,
    }, 201);
  } catch (e) {
    console.error("[POST /api/upload-book]", e);
    return err("Upload failed. Check server logs for details.");
  }
}

// Note: Next.js App Router handles multipart/form-data natively via req.formData()
// No bodyParser config needed.
