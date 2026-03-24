/**
 * GET    /api/scholars        — fetch all scholars
 * POST   /api/scholars        — create a scholar record
 * DELETE /api/scholars?id=    — delete a scholar record
 */

import { NextRequest } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { ok, err } from "@/lib/apiHelpers";
import { FieldValue } from "firebase-admin/firestore";

// ── GET /api/scholars ────────────────────────────────────────────────────────
export async function GET() {
  try {
    const db = getAdminDb();
    const snap = await db
      .collection("scholars")
      .orderBy("createdAt", "desc")
      .get();

    const scholars = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() ?? null,
    }));

    return ok(scholars);
  } catch (e) {
    console.error("[GET /api/scholars]", e);
    return err("Failed to fetch scholars.");
  }
}

// ── POST /api/scholars ───────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, title, biography, imageURL } = body;

    if (!name || !biography) {
      return err("name and biography are required.", 400);
    }

    const db = getAdminDb();
    const docRef = await db.collection("scholars").add({
      name,
      title:     title     ?? "",
      biography,
      imageURL:  imageURL  ?? "",
      createdAt: FieldValue.serverTimestamp(),
    });

    return ok({ id: docRef.id }, 201);
  } catch (e) {
    console.error("[POST /api/scholars]", e);
    return err("Failed to create scholar.");
  }
}

// ── DELETE /api/scholars?id=<docId> ─────────────────────────────────────────
export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) return err("id query param is required.", 400);

    const db = getAdminDb();
    await db.collection("scholars").doc(id).delete();
    return ok({ id });
  } catch (e) {
    console.error("[DELETE /api/scholars]", e);
    return err("Failed to delete scholar.");
  }
}
