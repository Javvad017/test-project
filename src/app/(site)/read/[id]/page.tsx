"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getBook, getBooks } from "@/lib/books";
import { FirestoreBook } from "@/types";
import PDFViewerWrapper from "@/components/PDFViewerWrapper";

export default function ReadPage() {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<FirestoreBook | null>(null);
  const [related, setRelated] = useState<FirestoreBook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const b = await getBook(id);
      setBook(b);
      if (b) {
        const all = await getBooks();
        setRelated(all.filter((x) => x.category === b.category && x.id !== b.id).slice(0, 3));
      }
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <span className="text-6xl mb-4">📚</span>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">Book Not Found</h1>
        <Link href="/books" className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold">Browse Books</Link>
      </div>
    );
  }

  const categoryIcons: Record<string, string> = { Quran: "📖", Hadith: "📜", Fiqh: "⚖️", "Islamic History": "🕌", Scholars: "🎓" };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
        <Link href="/" className="hover:text-emerald-600 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/books" className="hover:text-emerald-600 transition-colors">Books</Link>
        <span>/</span>
        <Link href={`/books?category=${book.category}`} className="hover:text-emerald-600 transition-colors">{book.category}</Link>
        <span>/</span>
        <span className="text-gray-700 dark:text-gray-300 line-clamp-1">{book.title}</span>
      </nav>

      {/* Book Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-900 text-white rounded-2xl p-6 mb-8 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {book.coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={book.coverUrl} alt={book.title} className="w-20 h-24 object-cover rounded-xl shadow-md flex-shrink-0" />
          ) : (
            <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
              {categoryIcons[book.category] || "📖"}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <span className="inline-block bg-amber-500/20 text-amber-300 text-xs font-semibold px-2.5 py-0.5 rounded-full mb-2">{book.category}</span>
            <h1 className="text-xl sm:text-2xl font-bold leading-tight mb-1">{book.title}</h1>
            <p className="text-emerald-200 text-sm">{book.author}</p>
            {book.pages && <p className="text-emerald-300 text-xs mt-1">{book.pages} pages{book.language ? ` · ${book.language}` : ""}</p>}
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <a href={book.pdfUrl} download className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-white rounded-xl text-sm font-semibold transition-colors">⬇ Download</a>
            <Link href="/books" className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-semibold transition-colors">← Back</Link>
          </div>
        </div>
        {book.description && (
          <p className="mt-4 text-emerald-200 text-sm leading-relaxed border-t border-white/10 pt-4">{book.description}</p>
        )}
      </div>

      <PDFViewerWrapper pdfUrl={book.pdfUrl} title={book.title} />

      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">More in {book.category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {related.map((r) => (
              <Link key={r.id} href={`/read/${r.id}`}
                className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-emerald-300 hover:shadow-md transition-all group">
                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg flex items-center justify-center text-xl flex-shrink-0">📖</div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-gray-800 dark:text-white group-hover:text-emerald-700 transition-colors line-clamp-1">{r.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{r.author}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
