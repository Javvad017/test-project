"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Books", href: "/books" },
  { label: "Quran", href: "/books?category=Quran" },
  { label: "Hadith", href: "/books?category=Hadith" },
  { label: "Scholar Biography", href: "/books?category=Scholar%20Biography" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/books?search=${encodeURIComponent(searchQuery.trim())}`);
      setMenuOpen(false);
    }
  };

  return (
    <nav
      className="sticky top-0 z-50 backdrop-blur-md"
      style={{
        background: "rgba(250, 246, 239, 0.96)",
        borderBottom: "1px solid var(--border-gold)",
      }}
    >
      {/* Green + Gold accent top line */}
      <div
        className="h-[3px]"
        style={{
          background:
            "linear-gradient(90deg, var(--green-deep), var(--green-primary), var(--gold-primary), var(--gold-light), var(--gold-primary), var(--green-primary), var(--green-deep))",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow"
              style={{
                background: "linear-gradient(135deg, var(--green-primary), var(--green-deep))",
                border: "2px solid var(--gold-primary)",
              }}
            >
              <span className="text-white text-lg font-bold">☽</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-islamic font-bold text-lg block leading-tight" style={{ color: "var(--green-deep)" }}>
                Faiz E Shaikh Ikramuddin
              </span>
              <span className="text-xs tracking-wider uppercase" style={{ color: "var(--gold-dark)" }}>
                Islamic Digital Library
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-green-50"
                style={{ color: "var(--brown-warm)" }}
              >
                {link.label}
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
                className="pl-4 pr-10 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-green-400 w-48 lg:w-56 transition-all"
                style={{
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-gold)",
                  color: "var(--text-primary)",
                }}
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors" style={{ color: "var(--green-primary)" }}>
                🔍
              </button>
            </div>
          </form>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 rounded-lg transition-colors hover:bg-green-50"
            style={{ color: "var(--green-deep)" }}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden py-4 space-y-2" style={{ borderTop: "1px solid var(--border-gold)" }}>
            <form onSubmit={handleSearch} className="flex items-center gap-2 mb-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search books..."
                className="flex-1 pl-4 pr-4 py-2.5 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-gold)", color: "var(--text-primary)" }}
              />
              <button type="submit" className="btn-green text-sm px-4 py-2.5">Search</button>
            </form>
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 rounded-lg font-medium transition-colors hover:bg-green-50"
                style={{ color: "var(--brown-warm)" }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
