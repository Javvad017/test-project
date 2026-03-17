"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { categories } from "@/data/books";
import { FirestoreBook } from "@/types";
import { getBooks } from "@/lib/books";
import FirestoreBookCard from "@/components/FirestoreBookCard";

function BooksContent() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "All");
  const [books, setBooks] = useState<FirestoreBook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBooks().then((data) => { setBooks(data); setLoading(false); });
  }, []);

  useEffect(() => {
    setSearchQuery(searchParams.get("search") || "");
    setSelectedCategory(searchParams.get("category") || "All");
  }, [searchParams]);

  const filtered = useMemo(() => {
    return books.filter((book) => {
      const matchesCat = selectedCategory === "All" || book.category === selectedCategory;
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q || book.title.toLowerCase().includes(q) || book.author.toLowerCase().includes(q) || book.category.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [books, searchQuery, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Islamic Books Library</h1>
        <p className="text-gray-500 dark:text-gray-400">
          {loading ? "Loading..." : `${filtered.length} book${filtered.length !== 1 ? "s" : ""} available`}
          {selectedCategory !== "All" ? ` in ${selectedCategory}` : ""}
          {searchQuery ? ` matching "${searchQuery}"` : ""}
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 mb-8 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title or author..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm" />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedCategory === cat ? "bg-emerald-600 text-white shadow-md" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-emerald-50 hover:text-emerald-700"}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl h-72 animate-pulse border border-gray-100 dark:border-gray-700" />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((book) => <FirestoreBookCard key={book.id} book={book} />)}
        </div>
      ) : (
        <div className="text-center py-20">
          <span className="text-6xl mb-4 block">📚</span>
          <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">No books found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Try adjusting your search or category filter.</p>
          <button onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-colors">
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}

export default function BooksPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" /></div>}>
      <BooksContent />
    </Suspense>
  );
}
