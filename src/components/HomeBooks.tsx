"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getBooks } from "@/lib/books";
import { FirestoreBook } from "@/types";
import FirestoreBookCard from "./FirestoreBookCard";

export default function HomeBooks() {
  const [books, setBooks] = useState<FirestoreBook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBooks().then((data) => { setBooks(data); setLoading(false); });
  }, []);

  const featured = books.slice(0, 4);
  const latest = books.slice(4, 8);

  const SkeletonGrid = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl h-72 animate-pulse border border-gray-100 dark:border-gray-700" />
      ))}
    </div>
  );

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Featured Books</h2>
        <SkeletonGrid />
      </section>
    );
  }

  if (books.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 text-center py-16">
        <span className="text-6xl block mb-4">📚</span>
        <p className="text-gray-500 dark:text-gray-400 text-lg">No books yet. Admin can upload books from the dashboard.</p>
      </section>
    );
  }

  return (
    <>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Featured Books</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Handpicked essential Islamic texts</p>
          </div>
          <Link href="/books" className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 text-sm font-medium transition-colors">View all →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((book) => <FirestoreBookCard key={book.id} book={book} />)}
        </div>
      </section>

      {latest.length > 0 && (
        <section className="bg-gradient-to-br from-emerald-50 to-white dark:from-gray-800/50 dark:to-gray-900 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Latest Additions</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Recently added to the library</p>
              </div>
              <Link href="/books" className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 text-sm font-medium transition-colors">View all →</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {latest.map((book) => <FirestoreBookCard key={book.id} book={book} />)}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
