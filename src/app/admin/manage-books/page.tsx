"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getBooks, deleteBook } from "@/lib/books";
import { FirestoreBook } from "@/types";

const categoryStyle: Record<string, string> = {
  Quran:            "text-emerald-400 border-emerald-700/50 bg-emerald-900/30",
  Hadith:           "text-amber-400 border-amber-700/50 bg-amber-900/30",
  Fiqh:             "text-blue-400 border-blue-700/50 bg-blue-900/30",
  "Islamic History":"text-purple-400 border-purple-700/50 bg-purple-900/30",
  Scholars:         "text-rose-400 border-rose-700/50 bg-rose-900/30",
};

const categoryIcons: Record<string, string> = {
  Quran: "📖", Hadith: "📜", Fiqh: "⚖️", "Islamic History": "🕌", Scholars: "🎓",
};

export default function ManageBooks() {
  const [books, setBooks] = useState<FirestoreBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("All");

  useEffect(() => {
    getBooks().then((d) => { setBooks(d); setLoading(false); });
  }, []);

  const handleDelete = async (book: FirestoreBook) => {
    if (!confirm(`Delete "${book.title}"?\n\nThis will permanently remove the book and its files.`)) return;
    setDeletingId(book.id);
    await deleteBook(book);
    setBooks((prev) => prev.filter((b) => b.id !== book.id));
    setDeletingId(null);
  };

  const categories = ["All", ...Array.from(new Set(books.map((b) => b.category)))];

  const filtered = books.filter((b) => {
    const matchCat = filterCat === "All" || b.category === filterCat;
    const q = search.toLowerCase();
    const matchSearch = !q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-2 h-6 bg-amber-500 rounded-full" />
            <h1 className="text-2xl font-bold text-white">Manage Books</h1>
          </div>
          <p className="text-gray-400 text-sm pl-5">
            {loading ? "Loading..." : `${books.length} book${books.length !== 1 ? "s" : ""} in the library`}
          </p>
        </div>
        <Link href="/admin/upload-book"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold text-sm transition-colors shadow-lg shadow-emerald-900/30 flex-shrink-0">
          <span className="text-base">+</span> Upload New Book
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or author..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm transition-all" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setFilterCat(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                filterCat === cat
                  ? "bg-emerald-600 text-white shadow-md"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white border border-gray-700"
              }`}>
              {cat !== "All" && categoryIcons[cat] ? `${categoryIcons[cat]} ` : ""}{cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-16 bg-gray-800 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <span className="text-5xl mb-4">📭</span>
            <p className="text-gray-300 font-medium mb-1">
              {search || filterCat !== "All" ? "No books match your filters" : "No books yet"}
            </p>
            <p className="text-gray-500 text-sm mb-4">
              {search || filterCat !== "All" ? "Try adjusting your search or filter." : "Upload your first book to get started."}
            </p>
            {!search && filterCat === "All" && (
              <Link href="/admin/upload-book" className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold transition-colors">
                Upload First Book
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* Table header — desktop */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 bg-gray-800/60 border-b border-gray-800 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <div className="col-span-5">Book</div>
              <div className="col-span-3">Author</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            <div className="divide-y divide-gray-800/60">
              {filtered.map((book) => (
                <div key={book.id}
                  className="group grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 px-5 py-4 hover:bg-gray-800/30 transition-colors items-center">

                  {/* Book info */}
                  <div className="md:col-span-5 flex items-center gap-3">
                    {book.coverUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={book.coverUrl} alt={book.title}
                        className="w-10 h-13 object-cover rounded-lg flex-shrink-0 border border-gray-700 shadow-md" />
                    ) : (
                      <div className="w-10 h-12 bg-gray-800 rounded-lg flex items-center justify-center text-lg flex-shrink-0 border border-gray-700">
                        {categoryIcons[book.category] || "📖"}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-white text-sm font-semibold line-clamp-1 group-hover:text-emerald-400 transition-colors">
                        {book.title}
                      </p>
                      {book.pages && <p className="text-gray-600 text-xs">{book.pages} pages</p>}
                      {/* Mobile: show author + category inline */}
                      <div className="md:hidden flex items-center gap-2 mt-1">
                        <span className="text-gray-400 text-xs">{book.author}</span>
                        <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full border ${categoryStyle[book.category]}`}>
                          {book.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Author — desktop */}
                  <div className="hidden md:block md:col-span-3">
                    <p className="text-gray-300 text-sm line-clamp-1">{book.author}</p>
                  </div>

                  {/* Category — desktop */}
                  <div className="hidden md:block md:col-span-2">
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${categoryStyle[book.category]}`}>
                      <span>{categoryIcons[book.category]}</span>
                      {book.category}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="md:col-span-2 flex items-center gap-2 md:justify-end">
                    <Link href={`/read/${book.id}`} target="_blank"
                      className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-lg text-xs font-medium transition-colors border border-gray-700 hover:border-gray-600">
                      View
                    </Link>
                    <Link href={`/admin/manage-books/edit?id=${book.id}`}
                      className="px-3 py-1.5 bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 hover:text-amber-300 rounded-lg text-xs font-medium transition-colors border border-amber-700/40">
                      Edit
                    </Link>
                    <button onClick={() => handleDelete(book)} disabled={deletingId === book.id}
                      className="px-3 py-1.5 bg-red-600/10 hover:bg-red-600/20 text-red-400 hover:text-red-300 rounded-lg text-xs font-medium transition-colors border border-red-700/30 disabled:opacity-40">
                      {deletingId === book.id ? (
                        <span className="flex items-center gap-1">
                          <span className="w-3 h-3 border border-red-400 border-t-transparent rounded-full animate-spin" />
                        </span>
                      ) : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer count */}
            <div className="px-5 py-3 border-t border-gray-800 bg-gray-800/30">
              <p className="text-gray-600 text-xs">
                Showing {filtered.length} of {books.length} books
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
