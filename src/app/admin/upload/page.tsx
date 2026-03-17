"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addBook, uploadFile } from "@/lib/books";
import { Category } from "@/types";

const CATEGORIES: Category[] = ["Quran", "Hadith", "Fiqh", "Islamic History", "Scholars"];

export default function UploadBook() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "", author: "", category: "Quran" as Category,
    description: "", pages: "", language: "", year: "",
  });
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({ cover: 0, pdf: 0 });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfFile) { setError("Please select a PDF file."); return; }
    setError("");
    setUploading(true);

    try {
      const timestamp = Date.now();
      const safeTitle = form.title.replace(/[^a-z0-9]/gi, "_").toLowerCase();

      // Upload PDF
      const pdfPath = `books/${timestamp}_${safeTitle}.pdf`;
      const { url: pdfUrl, storagePath: pdfStoragePath } = await uploadFile(
        pdfFile, pdfPath, (pct) => setProgress((p) => ({ ...p, pdf: pct }))
      );

      // Upload cover (optional)
      let coverUrl = "";
      let coverStoragePath = "";
      if (coverFile) {
        const coverPath = `covers/${timestamp}_${safeTitle}`;
        const result = await uploadFile(
          coverFile, coverPath, (pct) => setProgress((p) => ({ ...p, cover: pct }))
        );
        coverUrl = result.url;
        coverStoragePath = result.storagePath;
      }

      await addBook({
        title: form.title,
        author: form.author,
        category: form.category,
        description: form.description,
        coverUrl,
        coverStoragePath,
        pdfUrl,
        pdfStoragePath,
        ...(form.pages ? { pages: parseInt(form.pages) } : {}),
        ...(form.language ? { language: form.language } : {}),
        ...(form.year ? { year: parseInt(form.year) } : {}),
      });

      setSuccess(true);
      setTimeout(() => router.push("/admin/books"), 1500);
    } catch (err) {
      console.error(err);
      setError("Upload failed. Please check your Firebase configuration and try again.");
    } finally {
      setUploading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center text-4xl mb-4">✅</div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Book Published!</h2>
        <p className="text-gray-500 dark:text-gray-400">Redirecting to manage books...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Upload New Book</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Fill in the details and upload the PDF to publish a book.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Book Info */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm space-y-4">
          <h2 className="font-semibold text-gray-800 dark:text-white text-sm uppercase tracking-wider">Book Information</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Book Title *</label>
              <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Sahih Al-Bukhari"
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Author Name *</label>
              <input type="text" required value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })}
                placeholder="e.g. Imam al-Bukhari"
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
                rows={3} placeholder="Brief description of the book..."
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Pages</label>
              <input type="number" value={form.pages} onChange={(e) => setForm({ ...form, pages: e.target.value })}
                placeholder="e.g. 600"
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Language</label>
              <input type="text" value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })}
                placeholder="e.g. Arabic / English"
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm" />
            </div>
          </div>
        </div>

        {/* File Uploads */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm space-y-4">
          <h2 className="font-semibold text-gray-800 dark:text-white text-sm uppercase tracking-wider">Files</h2>

          {/* Cover Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Book Cover Image (optional)</label>
            <div className="flex items-start gap-4">
              <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-xl p-6 cursor-pointer hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all">
                <span className="text-3xl mb-2">🖼️</span>
                <span className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  {coverFile ? coverFile.name : "Click to upload cover image"}
                </span>
                <span className="text-xs text-gray-400 mt-1">JPG, PNG, WebP</span>
                <input type="file" accept="image/*" onChange={handleCoverChange} className="hidden" />
              </label>
              {coverPreview && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={coverPreview} alt="Cover preview" className="w-24 h-28 object-cover rounded-xl border border-gray-200 dark:border-gray-600 flex-shrink-0" />
              )}
            </div>
            {uploading && coverFile && (
              <div className="mt-2">
                <div className="flex justify-between text-xs text-gray-500 mb-1"><span>Uploading cover...</span><span>{progress.cover}%</span></div>
                <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${progress.cover}%` }} />
                </div>
              </div>
            )}
          </div>

          {/* PDF File */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">PDF File *</label>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-xl p-8 cursor-pointer hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all">
              <span className="text-4xl mb-2">📄</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {pdfFile ? pdfFile.name : "Click to upload PDF file"}
              </span>
              {pdfFile && <span className="text-xs text-gray-400 mt-1">{(pdfFile.size / 1024 / 1024).toFixed(2)} MB</span>}
              {!pdfFile && <span className="text-xs text-gray-400 mt-1">PDF files only</span>}
              <input type="file" accept=".pdf" onChange={(e) => setPdfFile(e.target.files?.[0] || null)} className="hidden" required />
            </label>
            {uploading && pdfFile && (
              <div className="mt-2">
                <div className="flex justify-between text-xs text-gray-500 mb-1"><span>Uploading PDF...</span><span>{progress.pdf}%</span></div>
                <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${progress.pdf}%` }} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Submit */}
        <button type="submit" disabled={uploading}
          className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold rounded-2xl text-base transition-colors flex items-center justify-center gap-3 shadow-lg">
          {uploading ? (
            <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Uploading & Publishing...</>
          ) : (
            <><span>🚀</span> Publish Book</>
          )}
        </button>
      </form>
    </div>
  );
}
