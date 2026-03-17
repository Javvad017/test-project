"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getBook, updateBook, uploadFile } from "@/lib/books";
import { Category, FirestoreBook } from "@/types";

const CATEGORIES: Category[] = ["Quran", "Hadith", "Fiqh", "Islamic History", "Scholars"];

function EditContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "";

  const [book, setBook] = useState<FirestoreBook | null>(null);
  const [form, setForm] = useState({ title: "", author: "", category: "Quran" as Category, description: "", pages: "", language: "" });
  const [newCover, setNewCover] = useState<File | null>(null);
  const [newPdf, setNewPdf] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    if (!id) return;
    getBook(id).then((b) => {
      if (b) {
        setBook(b);
        setForm({ title: b.title, author: b.author, category: b.category, description: b.description || "", pages: b.pages?.toString() || "", language: b.language || "" });
        setCoverPreview(b.coverUrl || "");
      }
      setLoading(false);
    });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!book) return;
    setSaving(true);
    setError("");
    try {
      const updates: Partial<FirestoreBook> = {
        title: form.title, author: form.author, category: form.category, description: form.description,
        ...(form.pages ? { pages: parseInt(form.pages) } : {}),
        ...(form.language ? { language: form.language } : {}),
      };
      if (newCover) {
        const path = `covers/${Date.now()}_${form.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}`;
        const { url, storagePath } = await uploadFile(newCover, path);
        updates.coverUrl = url; updates.coverStoragePath = storagePath;
      }
      if (newPdf) {
        const path = `books/${Date.now()}_${form.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.pdf`;
        const { url, storagePath } = await uploadFile(newPdf, path);
        updates.pdfUrl = url; updates.pdfStoragePath = storagePath;
      }
      await updateBook(id, updates);
      setSuccess(true);
      setTimeout(() => router.push("/admin/manage-books"), 1500);
    } catch (err) {
      console.error(err);
      setError("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (!book) return <div className="text-center py-20 text-gray-500">Book not found.</div>;

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-600/20 border border-emerald-600/40 flex items-center justify-center text-4xl mb-5">✅</div>
        <h2 className="text-2xl font-bold text-white mb-2">Changes Saved!</h2>
        <p className="text-gray-400 text-sm">Redirecting to manage books...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <button onClick={() => router.push("/admin/manage-books")} className="text-gray-500 hover:text-gray-300 transition-colors text-sm">← Back</button>
          <div className="w-px h-4 bg-gray-700" />
          <div className="w-2 h-6 bg-amber-500 rounded-full" />
          <h1 className="text-2xl font-bold text-white">Edit Book</h1>
        </div>
        <p className="text-gray-500 text-sm pl-5 line-clamp-1">{book.title}</p>
      </div>

      {error && (
        <div className="mb-6 flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          <span className="flex-shrink-0">⚠️</span><span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Book Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Book Title <span className="text-red-400">*</span></label>
              <input type="text" required value={form.title} onChange={(e) => set("title", e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Author <span className="text-red-400">*</span></label>
              <input type="text" required value={form.author} onChange={(e) => set("author", e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Category <span className="text-red-400">*</span></label>
              <div className="relative">
                <select value={form.category} onChange={(e) => set("category", e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm appearance-none transition-all">
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">▾</span>
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Description</label>
              <textarea value={form.description} onChange={(e) => set("description", e.target.value)}
                rows={3} className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm resize-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Pages</label>
              <input type="number" value={form.pages} onChange={(e) => set("pages", e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Language</label>
              <input type="text" value={form.language} onChange={(e) => set("language", e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm transition-all" />
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Replace Files <span className="text-gray-600 font-normal normal-case">(optional)</span></h2>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">New Cover Image</label>
            <div className="flex items-center gap-4">
              <label className={`flex-1 flex items-center gap-3 border-2 border-dashed rounded-xl p-4 cursor-pointer transition-all ${newCover ? "border-emerald-600/50 bg-emerald-900/10" : "border-gray-700 hover:border-gray-600"}`}>
                <span className="text-2xl">{newCover ? "🖼️" : "📷"}</span>
                <span className="text-sm text-gray-400">{newCover ? newCover.name : "Click to replace cover image"}</span>
                <input type="file" accept="image/*" onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) { setNewCover(f); setCoverPreview(URL.createObjectURL(f)); }
                }} className="hidden" />
              </label>
              {coverPreview && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={coverPreview} alt="Cover" className="w-16 h-20 object-cover rounded-xl border border-gray-700 flex-shrink-0" />
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">New PDF File</label>
            <label className={`flex items-center gap-3 border-2 border-dashed rounded-xl p-4 cursor-pointer transition-all ${newPdf ? "border-emerald-600/50 bg-emerald-900/10" : "border-gray-700 hover:border-gray-600"}`}>
              <span className="text-2xl">📄</span>
              <span className="text-sm text-gray-400">{newPdf ? newPdf.name : "Click to replace PDF file"}</span>
              <input type="file" accept=".pdf" onChange={(e) => setNewPdf(e.target.files?.[0] || null)} className="hidden" />
            </label>
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={saving}
            className="flex-1 py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 disabled:from-gray-700 disabled:to-gray-800 disabled:text-gray-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20">
            {saving ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Saving...</> : "💾 Save Changes"}
          </button>
          <button type="button" onClick={() => router.push("/admin/manage-books")}
            className="px-6 py-3.5 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white font-semibold rounded-xl transition-colors border border-gray-700">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default function EditBookPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" /></div>}>
      <EditContent />
    </Suspense>
  );
}
