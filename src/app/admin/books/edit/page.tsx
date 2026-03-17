"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getBook, updateBook, uploadFile } from "@/lib/books";
import { Category, FirestoreBook } from "@/types";
import { Suspense } from "react";

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

  useEffect(() => {
    if (!id) return;
    getBook(id).then((b) => {
      if (b) {
        setBook(b);
        setForm({
          title: b.title, author: b.author, category: b.category,
          description: b.description || "", pages: b.pages?.toString() || "",
          language: b.language || "",
        });
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
        title: form.title, author: form.author, category: form.category,
        description: form.description,
        ...(form.pages ? { pages: parseInt(form.pages) } : {}),
        ...(form.language ? { language: form.language } : {}),
      };

      if (newCover) {
        const path = `covers/${Date.now()}_${form.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}`;
        const { url, storagePath } = await uploadFile(newCover, path);
        updates.coverUrl = url;
        updates.coverStoragePath = storagePath;
      }

      if (newPdf) {
        const path = `books/${Date.now()}_${form.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.pdf`;
        const { url, storagePath } = await uploadFile(newPdf, path);
        updates.pdfUrl = url;
        updates.pdfStoragePath = storagePath;
      }

      await updateBook(id, updates);
      setSuccess(true);
      setTimeout(() => router.push("/admin/books"), 1500);
    } catch (err) {
      console.error(err);
      setError("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" /></div>;
  if (!book) return <div className="text-center py-20 text-gray-500">Book not found.</div>;

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center text-4xl mb-4">✅</div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Changes Saved!</h2>
        <p className="text-gray-500 dark:text-gray-400">Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Edit Book</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 line-clamp-1">{book.title}</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm space-y-4">
          <h2 className="font-semibold text-gray-800 dark:text-white text-sm uppercase tracking-wider">Book Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Book Title *</label>
              <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Author *</label>
              <input type="text" required value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Category *</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Category })}
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3} className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Pages</label>
              <input type="number" value={form.pages} onChange={(e) => setForm({ ...form, pages: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Language</label>
              <input type="text" value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm" />
            </div>
          </div>
        </div>

        {/* Replace files */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm space-y-4">
          <h2 className="font-semibold text-gray-800 dark:text-white text-sm uppercase tracking-wider">Replace Files (optional)</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">New Cover Image</label>
            <div className="flex items-center gap-4">
              <label className="flex-1 flex items-center gap-3 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-xl p-4 cursor-pointer hover:border-emerald-400 transition-all">
                <span className="text-2xl">🖼️</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{newCover ? newCover.name : "Click to replace cover"}</span>
                <input type="file" accept="image/*" onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) { setNewCover(f); setCoverPreview(URL.createObjectURL(f)); }
                }} className="hidden" />
              </label>
              {coverPreview && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={coverPreview} alt="Cover" className="w-16 h-20 object-cover rounded-lg border border-gray-200 dark:border-gray-600 flex-shrink-0" />
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">New PDF File</label>
            <label className="flex items-center gap-3 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-xl p-4 cursor-pointer hover:border-emerald-400 transition-all">
              <span className="text-2xl">📄</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">{newPdf ? newPdf.name : "Click to replace PDF"}</span>
              <input type="file" accept=".pdf" onChange={(e) => setNewPdf(e.target.files?.[0] || null)} className="hidden" />
            </label>
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={saving}
            className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
            {saving ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving...</> : "💾 Save Changes"}
          </button>
          <button type="button" onClick={() => router.push("/admin/books")}
            className="px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default function EditBookPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" /></div>}>
      <EditContent />
    </Suspense>
  );
}
