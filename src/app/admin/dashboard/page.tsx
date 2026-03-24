"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { subscribeToBooks } from "@/lib/books";
import { FirestoreBook, Category } from "@/types";
import { useAuth } from "@/context/AuthContext";

const categoryMeta: Record<string, { icon: string; color: string }> = {
  Quran: { icon: "📖", color: "text-emerald-400" },
  Hadith: { icon: "📜", color: "text-amber-400" },
  Fiqh: { icon: "⚖️", color: "text-blue-400" },
  "Islamic History": { icon: "🕌", color: "text-purple-400" },
  Scholars: { icon: "🎓", color: "text-rose-400" },
};

export default function Dashboard() {
  const { user } = useAuth();
  const [books, setBooks] = useState<FirestoreBook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToBooks((d) => { setBooks(d); setLoading(false); });
    return () => unsubscribe();
  }, []);

  const categoryCounts = books.reduce<Record<string, number>>((acc, b) => {
    acc[b.category] = (acc[b.category] || 0) + 1;
    return acc;
  }, {});

  const topStats = [
    { label: "Total Books", value: books.length, icon: "📚", gradient: "from-emerald-600/20 to-emerald-700/10", border: "border-emerald-700/30", text: "text-emerald-400" },
    { label: "Categories", value: Object.keys(categoryCounts).length, icon: "🗂️", gradient: "from-amber-600/20 to-amber-700/10", border: "border-amber-700/30", text: "text-amber-400" },
    { label: "Quran", value: categoryCounts["Quran"] || 0, icon: "📖", gradient: "from-blue-600/20 to-blue-700/10", border: "border-blue-700/30", text: "text-blue-400" },
    { label: "Hadith", value: categoryCounts["Hadith"] || 0, icon: "📜", gradient: "from-purple-600/20 to-purple-700/10", border: "border-purple-700/30", text: "text-purple-400" },
  ];

  const Skeleton = ({ className = "" }: { className?: string }) => (
    <div className={`bg-gray-800 rounded-lg animate-pulse ${className}`} />
  );

  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-2 h-6 bg-emerald-500 rounded-full" />
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        </div>
        <p className="text-gray-400 text-sm pl-5">
          Welcome back, <span className="text-emerald-400">{user?.email}</span>
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {topStats.map((stat) => (
          <div key={stat.label}
            className={`relative bg-gradient-to-br ${stat.gradient} border ${stat.border} rounded-2xl p-5 overflow-hidden`}>
            <div className="absolute top-3 right-3 text-2xl opacity-30">{stat.icon}</div>
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2">{stat.label}</p>
            {loading
              ? <Skeleton className="h-8 w-16" />
              : <p className={`text-3xl font-bold ${stat.text}`}>{stat.value}</p>
            }
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Link href="/admin/upload-book"
          className="group relative flex items-center gap-4 p-5 bg-gradient-to-r from-emerald-700/30 to-emerald-800/20 border border-emerald-700/40 rounded-2xl hover:border-emerald-500/60 hover:from-emerald-700/40 transition-all overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/0 to-emerald-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="w-12 h-12 rounded-xl bg-emerald-600/30 border border-emerald-600/40 flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">
            📤
          </div>
          <div>
            <p className="text-white font-semibold">Upload New Book</p>
            <p className="text-emerald-400/70 text-sm">Add a PDF book to the library</p>
          </div>
          <span className="ml-auto text-emerald-500 text-lg group-hover:translate-x-1 transition-transform">→</span>
        </Link>

        <Link href="/admin/manage-books"
          className="group relative flex items-center gap-4 p-5 bg-gradient-to-r from-amber-700/20 to-amber-800/10 border border-amber-700/30 rounded-2xl hover:border-amber-500/50 hover:from-amber-700/30 transition-all overflow-hidden">
          <div className="w-12 h-12 rounded-xl bg-amber-600/20 border border-amber-600/30 flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">
            📚
          </div>
          <div>
            <p className="text-white font-semibold">Manage Books</p>
            <p className="text-amber-400/70 text-sm">Edit or delete existing books</p>
          </div>
          <span className="ml-auto text-amber-500 text-lg group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>

      {/* Category breakdown + recent books */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category breakdown */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-amber-500 rounded-full inline-block" />
            By Category
          </h2>
          {loading ? (
            <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10" />)}</div>
          ) : Object.keys(categoryMeta).length === 0 || books.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-6">No books yet</p>
          ) : (
            <div className="space-y-2">
              {(Object.keys(categoryMeta) as Category[]).map((cat) => {
                const count = categoryCounts[cat] || 0;
                const pct = books.length > 0 ? Math.round((count / books.length) * 100) : 0;
                const meta = categoryMeta[cat];
                return (
                  <div key={cat} className="flex items-center gap-3">
                    <span className="text-base w-6 text-center flex-shrink-0">{meta.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-gray-300 text-xs font-medium truncate">{cat}</span>
                        <span className={`text-xs font-bold ${meta.color}`}>{count}</span>
                      </div>
                      <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full bg-gradient-to-r transition-all duration-500 ${cat === "Quran" ? "from-emerald-600 to-emerald-400" :
                            cat === "Hadith" ? "from-amber-600 to-amber-400" :
                              cat === "Fiqh" ? "from-blue-600 to-blue-400" :
                                cat === "Islamic History" ? "from-purple-600 to-purple-400" :
                                  "from-rose-600 to-rose-400"
                          }`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent books */}
        <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
            <h2 className="text-white font-semibold flex items-center gap-2">
              <span className="w-1.5 h-4 bg-emerald-500 rounded-full inline-block" />
              Recent Books
            </h2>
            <Link href="/admin/manage-books" className="text-emerald-400 hover:text-emerald-300 text-xs font-medium transition-colors">
              View all →
            </Link>
          </div>

          {loading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14" />)}
            </div>
          ) : books.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-4">
              <span className="text-4xl mb-3">📭</span>
              <p className="text-gray-400 text-sm">No books yet.</p>
              <Link href="/admin/upload-book" className="mt-3 text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors">
                Upload your first book →
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-800/60">
              {books.slice(0, 6).map((book) => (
                <div key={book.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-800/40 transition-colors group">
                  {book.coverUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={book.coverUrl} alt={book.title} className="w-9 h-11 object-cover rounded-lg flex-shrink-0 border border-gray-700" />
                  ) : (
                    <div className="w-9 h-11 bg-gray-800 rounded-lg flex items-center justify-center text-base flex-shrink-0 border border-gray-700">
                      {categoryMeta[book.category]?.icon || "📖"}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium line-clamp-1 group-hover:text-emerald-400 transition-colors">{book.title}</p>
                    <p className="text-gray-500 text-xs line-clamp-1">{book.author}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full border flex-shrink-0 ${book.category === "Quran" ? "text-emerald-400 border-emerald-700/50 bg-emerald-900/30" :
                      book.category === "Hadith" ? "text-amber-400 border-amber-700/50 bg-amber-900/30" :
                        book.category === "Fiqh" ? "text-blue-400 border-blue-700/50 bg-blue-900/30" :
                          book.category === "Islamic History" ? "text-purple-400 border-purple-700/50 bg-purple-900/30" :
                            "text-rose-400 border-rose-700/50 bg-rose-900/30"
                    }`}>
                    {book.category}
                  </span>
                  <Link href={`/admin/manage-books/edit?id=${book.id}`}
                    className="ml-1 px-2.5 py-1 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-lg text-xs font-medium transition-colors opacity-0 group-hover:opacity-100">
                    Edit
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
