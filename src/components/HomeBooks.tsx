"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { subscribeToBooks } from "@/lib/books";
import { FirestoreBook } from "@/types";
import FirestoreBookCard from "./FirestoreBookCard";

// ── Skeleton placeholder ─────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden w-full animate-pulse"
      style={{ background: "var(--cream-dark)", border: "1px solid var(--border-gold)" }}>
      <div className="h-52 sm:h-56" style={{ background: "var(--bg-secondary)" }} />
      <div className="p-4 sm:p-5 space-y-3">
        <div className="h-4 w-20 rounded-full" style={{ background: "var(--cream-dark)" }} />
        <div className="h-4 w-full rounded" style={{ background: "var(--cream-dark)" }} />
        <div className="h-3 w-3/4 rounded" style={{ background: "var(--cream-dark)" }} />
        <div className="grid grid-cols-2 gap-2 pt-2">
          <div className="h-10 rounded-xl" style={{ background: "var(--cream-dark)" }} />
          <div className="h-10 rounded-xl" style={{ background: "var(--cream-dark)" }} />
        </div>
      </div>
    </div>
  );
}

// ── Section header ───────────────────────────────────────────────────────────
function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="flex items-end justify-between mb-6 sm:mb-8 gap-4">
      <div>
        <p className="font-islamic text-xs sm:text-sm tracking-[0.2em] uppercase mb-1"
          style={{ color: "var(--green-primary)" }}>
          {eyebrow}
        </p>
        <h2 className="font-islamic text-2xl sm:text-3xl font-bold leading-tight"
          style={{ color: "var(--brown-deep)" }}>
          {title}
        </h2>
      </div>
      <Link href="/books"
        className="flex-shrink-0 text-sm font-semibold flex items-center gap-1
                   hover:gap-2 transition-all duration-200 whitespace-nowrap"
        style={{ color: "var(--green-primary)" }}>
        View all <span aria-hidden>→</span>
      </Link>
    </div>
  );
}

// ── Books grid ───────────────────────────────────────────────────────────────
function BooksGrid({ books }: { books: FirestoreBook[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
      {books.map((book) => (
        <FirestoreBookCard key={book.id} book={book} />
      ))}
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
export default function HomeBooks() {
  const [books, setBooks] = useState<FirestoreBook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeToBooks((data) => {
      setBooks(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const featured = books.slice(0, 4);
  const latest   = books.slice(4, 8);

  // Loading state
  if (loading) {
    return (
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-12 sm:py-16">
        <SectionHeader eyebrow="Curated Collection" title="Featured Books" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </section>
    );
  }

  // Empty state
  if (books.length === 0) {
    return (
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-16 text-center">
        <span className="text-6xl block mb-4">📚</span>
        <p className="text-lg" style={{ color: "var(--text-muted)" }}>
          No books yet. Admin can upload books from the dashboard.
        </p>
      </section>
    );
  }

  return (
    <>
      {/* ── Featured Books ─────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-12 sm:py-16">
        <SectionHeader eyebrow="Curated Collection" title="Featured Books" />
        <BooksGrid books={featured} />
      </section>

      {/* ── Latest Additions ───────────────────────────────── */}
      {latest.length > 0 && (
        <section className="relative overflow-hidden py-12 sm:py-16"
          style={{ background: "var(--bg-secondary)" }}>
          <div className="islamic-pattern-bg-light" />
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-10">
            <SectionHeader eyebrow="Recently Added" title="Latest Additions" />
            <BooksGrid books={latest} />
          </div>
        </section>
      )}
    </>
  );
}
