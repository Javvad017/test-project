"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { categories } from "@/data/books";
import { FirestoreBook } from "@/types";
import { subscribeToBooks } from "@/lib/books";
import FirestoreBookCard from "@/components/FirestoreBookCard";

function BooksContent() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "All"
  );
  const [books, setBooks] = useState<FirestoreBook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToBooks((data) => {
      setBooks(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setSearchQuery(searchParams.get("search") || "");
    setSelectedCategory(searchParams.get("category") || "All");
  }, [searchParams]);

  const filtered = useMemo(() => {
    return books.filter((book) => {
      const matchesCat =
        selectedCategory === "All" || book.category === selectedCategory;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        book.title.toLowerCase().includes(q) ||
        book.author.toLowerCase().includes(q) ||
        book.category.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [books, searchQuery, selectedCategory]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="mb-8">
        <p
          className="font-islamic text-sm tracking-[0.25em] uppercase mb-1"
          style={{ color: "var(--gold-dark)" }}
        >
          Digital Collection
        </p>
        <h1
          className="font-islamic text-3xl sm:text-4xl font-bold mb-2"
          style={{ color: "var(--brown-deep)" }}
        >
          Islamic Books Library
        </h1>
        <div className="gold-divider-wide mt-2 mb-3" style={{ margin: "0.5rem 0" }} />
        <p style={{ color: "var(--text-muted)" }}>
          {loading
            ? "Loading..."
            : `${filtered.length} book${filtered.length !== 1 ? "s" : ""} available`}
          {selectedCategory !== "All" ? ` in ${selectedCategory}` : ""}
          {searchQuery ? ` matching "${searchQuery}"` : ""}
        </p>
      </div>

      {/* Filters */}
      <div
        className="card-islamic p-5 mb-8"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <span
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: "var(--gold-primary)" }}
            >
              🔍
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title or author..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all"
              style={{
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-gold)",
                color: "var(--text-primary)",
              }}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
                style={
                  selectedCategory === cat
                    ? {
                      background:
                        "linear-gradient(135deg, var(--gold-primary), var(--gold-dark))",
                      color: "white",
                      boxShadow: "0 2px 8px rgba(201, 168, 76, 0.3)",
                    }
                    : {
                      background: "var(--bg-secondary)",
                      color: "var(--text-secondary)",
                      border: "1px solid var(--border-gold)",
                    }
                }
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Book Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="card-islamic h-80 animate-pulse"
              style={{ background: "var(--cream-dark)" }}
            />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((book) => (
            <FirestoreBookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <span className="text-6xl mb-4 block">📚</span>
          <h3
            className="font-islamic text-xl font-bold mb-2"
            style={{ color: "var(--brown-deep)" }}
          >
            No books found
          </h3>
          <p className="mb-6" style={{ color: "var(--text-muted)" }}>
            Try adjusting your search or category filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
            }}
            className="btn-gold px-6 py-3"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}

export default function BooksPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-20">
          <div
            className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: "var(--gold-primary)", borderTopColor: "transparent" }}
          />
        </div>
      }
    >
      <BooksContent />
    </Suspense>
  );
}
