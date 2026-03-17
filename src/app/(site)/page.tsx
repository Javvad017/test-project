import Link from "next/link";
import IslamicPattern from "@/components/IslamicPattern";
import { categories } from "@/data/books";
import HomeBooks from "@/components/HomeBooks";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-emerald-800 via-emerald-900 to-emerald-950 text-white overflow-hidden">
        <IslamicPattern />
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6 text-sm text-amber-300">
            <span>☽</span>
            <span>Free & Open Source Islamic Knowledge</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
            Islamic Digital Library
          </h1>
          <p className="text-amber-300 text-xl sm:text-2xl font-light mb-2">
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
          </p>
          <p className="text-emerald-200 text-lg sm:text-xl mb-10 max-w-2xl mx-auto">
            Read and download authentic Islamic books — Quran, Hadith, Fiqh, History, and more. Free for all.
          </p>

          <form action="/books" method="get" className="flex items-center max-w-xl mx-auto bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden shadow-xl">
            <span className="pl-5 text-emerald-300 text-xl">🔍</span>
            <input
              type="text"
              name="search"
              placeholder="Search by title, author, or category..."
              className="flex-1 bg-transparent px-4 py-4 text-white placeholder-emerald-300 focus:outline-none text-base"
            />
            <button type="submit" className="m-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-white font-semibold rounded-xl transition-colors">
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">Browse by Category</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((cat) => {
            const icons: Record<string, string> = { All: "📚", Quran: "📖", Hadith: "📜", Fiqh: "⚖️", "Islamic History": "🕌", Scholars: "🎓" };
            return (
              <Link key={cat} href={cat === "All" ? "/books" : `/books?category=${cat}`}
                className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:border-emerald-300 hover:text-emerald-700 transition-all shadow-sm hover:shadow-md">
                <span>{icons[cat]}</span>{cat}
              </Link>
            );
          })}
        </div>
      </section>

      {/* Dynamic books from Firestore */}
      <HomeBooks />

      {/* CTA */}
      <section className="relative bg-gradient-to-r from-emerald-700 to-emerald-900 text-white overflow-hidden">
        <IslamicPattern />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Explore the Full Library</h2>
          <p className="text-emerald-200 text-lg mb-8">Discover Islamic books across all categories, free and accessible to everyone.</p>
          <Link href="/books" className="inline-block px-8 py-4 bg-amber-500 hover:bg-amber-400 text-white font-bold rounded-2xl text-lg transition-colors shadow-lg">
            Browse All Books
          </Link>
        </div>
      </section>
    </div>
  );
}
