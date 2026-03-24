"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { subscribeToBooks, deleteBook } from "@/lib/books";
import { FirestoreBook } from "@/types";

const categoryColors: Record<string, string> = {
  Quran: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400",
  Hadith: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400",
  Fiqh: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400",
  "Islamic History": "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-400",
  Scholars: "bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-400",
};

export default function ManageBooks() {
  const [books, setBooks] = useState<FirestoreBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const unsubscribe = subscribeToBooks((data) => {
      setBooks(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = async (book: FirestoreBook) => {
    if (!confirm(`Delete "${book.title}"? This cannot be undone.`)) return;
    setDeletingId(book.id);
    await deleteBook(book);
    setBooks((prev) => prev.filter((b) => b.id !== book.id));
    setDeletingId(null);
  };

  const filtered = books.filter((b) =>
    !search || b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Manage Books</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{books.length} books in the library</p>
        </div>
        <Link href="/admin/upload"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm transition-colors shadow-sm">
          <span>+</span> Upload New Book
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search books..."
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm" />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 dark:bg-gray-700 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <span className="text-5xl block mb-3">📭</span>
            <p className="text-gray-500 dark:text-gray-400">
              {search ? "No books match your search." : "No books yet. Upload your first book!"}
            </p>
          </div>
        ) : (
          <>
            {/* Table header */}
            <div className="hidden sm:grid grid-cols-12 gap-4 px-5 py-3 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <div className="col-span-5">Book</div>
              <div className="col-span-3">Author</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            <div className="divide-y divide-gray-50 dark:divide-gray-700">
              {filtered.map((book) => (
                <div key={book.id} className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors items-center">
                  <div className="sm:col-span-5 flex items-center gap-3">
                    {book.coverUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={book.coverUrl} alt={book.title} className="w-10 h-12 object-cover rounded-lg flex-shrink-0" />
                    ) : (
                      <div className="w-10 h-12 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg flex items-center justify-center text-lg flex-shrink-0">📖</div>
                    )}
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-800 dark:text-white text-sm line-clamp-1">{book.title}</p>
                      {book.pages && <p className="text-gray-400 text-xs">{book.pages} pages</p>}
                    </div>
                  </div>
                  <div className="sm:col-span-3">
                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-1">{book.author}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full ${categoryColors[book.category]}`}>
                      {book.category}
                    </span>
                  </div>
                  <div className="sm:col-span-2 flex items-center justify-start sm:justify-end gap-2">
                    <Link href={`/read/${book.id}`} target="_blank"
                      className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-gray-600 dark:text-gray-300 hover:text-emerald-700 rounded-lg text-xs font-medium transition-colors">
                      View
                    </Link>
                    <Link href={`/admin/books/edit?id=${book.id}`}
                      className="px-3 py-1.5 bg-amber-50 dark:bg-amber-900/30 hover:bg-amber-100 text-amber-700 dark:text-amber-400 rounded-lg text-xs font-medium transition-colors">
                      Edit
                    </Link>
                    <button onClick={() => handleDelete(book)} disabled={deletingId === book.id}
                      className="px-3 py-1.5 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 text-red-600 dark:text-red-400 rounded-lg text-xs font-medium transition-colors disabled:opacity-50">
                      {deletingId === book.id ? "..." : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
