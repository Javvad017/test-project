"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addBook, uploadFile } from "@/lib/books";
import { Category } from "@/types";

const CATEGORIES: Category[] = ["Quran", "Hadith", "Fiqh", "Islamic History", "Scholars"];

const categoryIcons: Record<string, string> = {
  Quran: "📖", Hadith: "📜", Fiqh: "⚖️", "Islamic History": "🕌", Scholars: "🎓",
};

interface UploadState {
  phase: "idle" | "uploading-cover" | "uploading-pdf" | "saving" | "done" | "error";
  coverPct: number;
  pdfPct: number;
  error: string;
}

export default function UploadBook() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "", author: "", category: "Quran" as Category,
    description: "", pages: "", language: "",
  });
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [state, setState] = useState<UploadState>({ phase: "idle", coverPct: 0, pdfPct: 0, error: "" });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleCover = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) { setCoverFile(f); setCoverPreview(URL.createObjectURL(f)); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfFile) { setState((s) => ({ ...s, error: "Please select a PDF file." })); return; }
    setState({ phase: "uploading-pdf", coverPct: 0, pdfPct: 0, error: "" });

    try {
      const ts = Date.now();
      const slug = form.title.replace(/[^a-z0-9]/gi, "_").toLowerCase();

      // Upload PDF
      const pdfPath = `books/pdfs/${ts}_${slug}.pdf`;
      const { url: pdfUrl, storagePath: pdfStoragePath } = await uploadFile(
        pdfFile, pdfPath, (pct) => setState((s) => ({ ...s, pdfPct: pct }))
      );

      // Upload cover
      let coverUrl = "", coverStoragePath = "";
      if (coverFile) {
        setState((s) => ({ ...s, phase: "uploading-cover" }));
        const coverPath = `books/covers/${ts}_${slug}`;
        const res = await uploadFile(coverFile, coverPath, (pct) => setState((s) => ({ ...s, coverPct: pct })));
        coverUrl = res.url;
        coverStoragePath = res.storagePath;
      }

      setState((s) => ({ ...s, phase: "saving" }));
      await addBook({
        title: form.title, author: form.author, category: form.category,
        description: form.description, coverUrl, coverStoragePath, pdfUrl, pdfStoragePath,
        ...(form.pages ? { pages: parseInt(form.pages) } : {}),
        ...(form.language ? { language: form.language } : {}),
      });

      setState((s) => ({ ...s, phase: "done" }));
      setTimeout(() => router.push("/admin/manage-books"), 1800);
    } catch (err) {
      console.error("[UploadBook] Error:", err);
      const msg = err instanceof Error ? err.message : "Upload failed. Check your Firebase config and try again.";
      setState((s) => ({ ...s, phase: "error", error: msg }));
    }
  };

  const uploading = ["uploading-cover", "uploading-pdf", "saving"].includes(state.phase);

  if (state.phase === "done") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-600/20 border border-emerald-600/40 flex items-center justify-center text-4xl mb-5 animate-bounce">✅</div>
        <h2 className="text-2xl font-bold text-white mb-2">Book Published!</h2>
        <p className="text-gray-400 text-sm">It&apos;s now live on the public website.</p>
        <p className="text-gray-600 text-xs mt-2">Redirecting to manage books...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-2 h-6 bg-emerald-500 rounded-full" />
          <h1 className="text-2xl font-bold text-white">Upload New Book</h1>
        </div>
        <p className="text-gray-400 text-sm pl-5">Fill in the details and upload files to publish a book.</p>
      </div>

      {state.error && (
        <div className="mb-6 flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          <span className="text-base mt-0.5 flex-shrink-0">⚠️</span>
          <span>{state.error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Book info card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-gray-300 text-xs font-semibold uppercase tracking-wider flex items-center gap-2">
            <span className="w-4 h-px bg-gray-600 inline-block" />
            Book Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Title */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Book Title <span className="text-red-400">*</span></label>
              <input type="text" required value={form.title} onChange={(e) => set("title", e.target.value)}
                placeholder="e.g. Sahih Al-Bukhari"
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm transition-all" />
            </div>

            {/* Author */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Author Name <span className="text-red-400">*</span></label>
              <input type="text" required value={form.author} onChange={(e) => set("author", e.target.value)}
                placeholder="e.g. Imam al-Bukhari"
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm transition-all" />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Category <span className="text-red-400">*</span></label>
              <div className="relative">
                <select value={form.category} onChange={(e) => set("category", e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm appearance-none transition-all">
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{categoryIcons[c]} {c}</option>
                  ))}
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">▾</span>
              </div>
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Description</label>
              <textarea value={form.description} onChange={(e) => set("description", e.target.value)}
                rows={3} placeholder="Brief description of the book..."
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm resize-none transition-all" />
            </div>

            {/* Pages */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Number of Pages</label>
              <input type="number" value={form.pages} onChange={(e) => set("pages", e.target.value)}
                placeholder="e.g. 600" min="1"
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm transition-all" />
            </div>

            {/* Language */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Language</label>
              <input type="text" value={form.language} onChange={(e) => set("language", e.target.value)}
                placeholder="e.g. Arabic / English"
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm transition-all" />
            </div>
          </div>
        </div>

        {/* Files card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-5">
          <h2 className="text-gray-300 text-xs font-semibold uppercase tracking-wider flex items-center gap-2">
            <span className="w-4 h-px bg-gray-600 inline-block" />
            Upload Files
          </h2>

          {/* Cover image */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Book Cover Image <span className="text-gray-600 font-normal">(optional)</span></label>
            <div className="flex items-start gap-4">
              <label className={`flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 cursor-pointer transition-all ${coverFile ? "border-emerald-600/50 bg-emerald-900/10" : "border-gray-700 hover:border-gray-600 hover:bg-gray-800/50"
                }`}>
                {coverFile ? (
                  <>
                    <span className="text-3xl mb-2">🖼️</span>
                    <span className="text-emerald-400 text-sm font-medium text-center line-clamp-1">{coverFile.name}</span>
                    <span className="text-gray-500 text-xs mt-1">{(coverFile.size / 1024).toFixed(0)} KB · Click to change</span>
                  </>
                ) : (
                  <>
                    <span className="text-3xl mb-2 opacity-40">🖼️</span>
                    <span className="text-gray-400 text-sm">Click to upload cover image</span>
                    <span className="text-gray-600 text-xs mt-1">JPG, PNG, WebP</span>
                  </>
                )}
                <input type="file" accept="image/*" onChange={handleCover} className="hidden" />
              </label>

              {coverPreview && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={coverPreview} alt="Preview" className="w-24 h-32 object-cover rounded-xl border border-gray-700 flex-shrink-0 shadow-lg" />
              )}
            </div>

            {/* Cover progress */}
            {state.phase === "uploading-cover" && (
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                  <span>Uploading cover image...</span>
                  <span className="text-emerald-400 font-medium">{state.coverPct}%</span>
                </div>
                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-300" style={{ width: `${state.coverPct}%` }} />
                </div>
              </div>
            )}
          </div>

          {/* PDF file */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">PDF File <span className="text-red-400">*</span></label>
            <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 cursor-pointer transition-all ${pdfFile ? "border-emerald-600/50 bg-emerald-900/10" : "border-gray-700 hover:border-gray-600 hover:bg-gray-800/50"
              }`}>
              {pdfFile ? (
                <>
                  <span className="text-4xl mb-2">📄</span>
                  <span className="text-emerald-400 text-sm font-medium text-center">{pdfFile.name}</span>
                  <span className="text-gray-500 text-xs mt-1">{(pdfFile.size / 1024 / 1024).toFixed(2)} MB · Click to change</span>
                </>
              ) : (
                <>
                  <span className="text-4xl mb-2 opacity-40">📄</span>
                  <span className="text-gray-300 text-sm font-medium">Click to upload PDF file</span>
                  <span className="text-gray-600 text-xs mt-1">PDF files only · No size limit</span>
                </>
              )}
              <input type="file" accept=".pdf" onChange={(e) => setPdfFile(e.target.files?.[0] || null)} className="hidden" required />
            </label>

            {/* PDF progress — show when uploading PDF */}
            {["uploading-pdf", "uploading-cover", "saving"].includes(state.phase) && pdfFile && (
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                  <span>PDF Upload {state.pdfPct === 100 ? "Complete ✓" : "Progress"}</span>
                  <span className="text-emerald-400 font-medium">{state.pdfPct}%</span>
                </div>
                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-500" style={{ width: `${state.pdfPct}%` }} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Upload status */}
        {uploading && (
          <div className="bg-emerald-900/20 border border-emerald-700/30 rounded-xl p-4 flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />
            <div>
              <p className="text-emerald-400 text-sm font-medium">
                {state.phase === "uploading-pdf" && "Uploading PDF to Firebase Storage..."}
                {state.phase === "uploading-cover" && "Uploading cover image..."}
                {state.phase === "saving" && "Saving book to database..."}
              </p>
              <p className="text-emerald-600 text-xs">Please don&apos;t close this page</p>
            </div>
          </div>
        )}

        {/* Submit */}
        <button type="submit" disabled={uploading}
          className="w-full py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 disabled:from-gray-700 disabled:to-gray-800 disabled:text-gray-500 text-white font-bold rounded-2xl text-base transition-all shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-3">
          {uploading ? (
            <><div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Publishing...</>
          ) : (
            <><span className="text-lg">🚀</span> Publish Book</>
          )}
        </button>
      </form>
    </div>
  );
}
