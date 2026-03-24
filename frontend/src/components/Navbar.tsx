"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/books?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-emerald-100 dark:border-emerald-900 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center shadow-md group-hover:shadow-emerald-300 transition-shadow">
              <span className="text-white text-lg font-bold">☽</span>
            </div>
            <span className="font-bold text-emerald-800 dark:text-emerald-400 text-lg hidden sm:block">
              Islamic Digital Library
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-gray-600 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-emerald-400 font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              href="/books"
              className="text-gray-600 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-emerald-400 font-medium transition-colors"
            >
              Books
            </Link>
            {["Quran", "Hadith", "Fiqh"].map((cat) => (
              <Link
                key={cat}
                href={`/books?category=${cat}`}
                className="text-gray-600 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-emerald-400 font-medium transition-colors"
              >
                {cat}
              </Link>
            ))}
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search books..."
                className="pl-4 pr-10 py-2 rounded-full border border-emerald-200 dark:border-emerald-700 bg-emerald-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 w-48 lg:w-64 transition-all"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600 dark:text-emerald-400 hover:text-emerald-800"
              >
                🔍
              </button>
            </div>
          </form>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-gray-800"
            aria-label="Toggle menu"
          >
            <div className="w-5 h-0.5 bg-current mb-1 transition-all" />
            <div className="w-5 h-0.5 bg-current mb-1 transition-all" />
            <div className="w-5 h-0.5 bg-current transition-all" />
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-emerald-100 dark:border-emerald-900 space-y-3">
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search books..."
                className="flex-1 pl-4 pr-4 py-2 rounded-full border border-emerald-200 dark:border-emerald-700 bg-emerald-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 text-white rounded-full text-sm font-medium"
              >
                Search
              </button>
            </form>
            {["Home", "Books", "Quran", "Hadith", "Fiqh", "Islamic History", "Scholars"].map(
              (item) => (
                <Link
                  key={item}
                  href={
                    item === "Home"
                      ? "/"
                      : item === "Books"
                      ? "/books"
                      : `/books?category=${item}`
                  }
                  onClick={() => setMenuOpen(false)}
                  className="block px-2 py-1.5 text-gray-700 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-emerald-400 font-medium"
                >
                  {item}
                </Link>
              )
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
