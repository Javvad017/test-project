import Link from "next/link";
import Image from "next/image";
import IslamicPattern from "@/components/IslamicPattern";
import BrowseKnowledge from "@/components/BrowseKnowledge";
import ScholarBiography from "@/components/ScholarBiography";
import HomeBooks from "@/components/HomeBooks";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <div>
      {/* ═══════════════ HERO SECTION ═══════════════ */}
      <section
        className="relative overflow-hidden min-h-[580px] flex items-center"
        style={{
          background:
            "linear-gradient(170deg, #e8f0e4 0%, #f0ebe0 20%, #f5efe3 40%, #ede4d3 60%, #e8dcc8 80%, #eee8dc 100%)",
        }}
      >
        {/* Islamic geometric pattern overlays */}
        <IslamicPattern variant="default" />
        <IslamicPattern variant="star" className="opacity-[0.02]" />

        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" style={{ background: "rgba(21, 128, 61, 0.06)" }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full translate-y-1/2 -translate-x-1/3 blur-3xl" style={{ background: "rgba(201, 168, 76, 0.06)" }} />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] rounded-full blur-3xl" style={{ background: "rgba(13, 74, 46, 0.04)" }} />

        {/* Green + Gold accent top line */}
        <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: "linear-gradient(90deg, var(--green-deep), var(--green-primary), var(--gold-primary), var(--gold-light), var(--gold-primary), var(--green-primary), var(--green-deep))" }} />
        {/* Gold accent bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg, transparent, var(--gold-primary), var(--gold-light), var(--gold-primary), transparent)" }} />

        {/* Madina image — left side */}
        <div className="hero-city-image hero-city-madina" aria-hidden="true">
          <Image src="/madina.png" alt="" fill className="object-contain object-right opacity-0" priority />
        </div>

        {/* Makkah image — right side */}
        <div className="hero-city-image hero-city-makkah" aria-hidden="true">
          <Image src="/makkah.png" alt="" fill className="object-contain object-left opacity-0" priority />
        </div>

        {/* Hero Content */}
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-center w-full z-10">
          {/* Badge */}
          <div className="animate-fade-in-up inline-flex items-center gap-2 backdrop-blur-sm rounded-full px-5 py-2 mb-8 text-sm" style={{ background: "rgba(13, 74, 46, 0.08)", border: "1px solid var(--border-green)", color: "var(--green-deep)" }}>
            <span className="animate-gold-shimmer">☽</span>
            <span className="font-medium tracking-wide">Free &amp; Open Source Islamic Knowledge</span>
            <span className="animate-gold-shimmer">☽</span>
          </div>

          {/* Bismillah */}
          <p className="animate-fade-in-up font-islamic text-2xl sm:text-3xl mb-5 tracking-wider" style={{ color: "var(--gold-dark)" }}>
            بِسْمِ ٱللَّٰهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
          </p>

          {/* Gold divider */}
          <div className="gold-divider-wide mb-6 animate-fade-in-up" />

          {/* Main Title */}
          <h1 className="font-islamic text-4xl sm:text-5xl lg:text-7xl font-bold mb-2 leading-tight animate-fade-in-up-d1 tracking-wide">
            <span className="block" style={{ color: "var(--green-deep)" }}>Faiz E Shaikh</span>
            <span className="block mt-1" style={{ color: "var(--brown-deep)" }}>Ikramuddin Paturdavi</span>
          </h1>

          {/* Gold divider */}
          <div className="gold-divider mt-4 mb-6 animate-fade-in-up-d1" />

          {/* Subtitle */}
          <p className="text-lg sm:text-xl mb-10 max-w-2xl mx-auto animate-fade-in-up-d2 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Read and download authentic Islamic books — Quran, Hadith, Scholar Biography and Islamic knowledge.
          </p>

          {/* Search */}
          <form action="/books" method="get" className="flex items-center max-w-xl mx-auto rounded-2xl overflow-hidden shadow-lg animate-fade-in-up-d3 transition-shadow hover:shadow-xl" style={{ background: "rgba(255, 253, 248, 0.92)", border: "1px solid var(--border-gold)" }}>
            <span className="pl-5 text-xl" style={{ color: "var(--green-primary)" }}>🔍</span>
            <input type="text" name="search" placeholder="Search by title, author, or category..." className="flex-1 bg-transparent px-4 py-4 focus:outline-none text-base" style={{ color: "var(--text-primary)" }} />
            <button type="submit" className="btn-green m-2 px-6 py-2.5 rounded-xl">
              Search
            </button>
          </form>
        </div>
      </section>

      {/* ═══════════════ BROWSE KNOWLEDGE ═══════════════ */}
      <BrowseKnowledge />

      {/* ═══════════════ FEATURED BOOKS ═══════════════ */}
      <HomeBooks />

      {/* ═══════════════ SCHOLAR BIOGRAPHIES ═══════════════ */}
      <ScholarBiography />

      {/* ═══════════════ CTA SECTION ═══════════════ */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, var(--green-deep) 0%, #0a3d26 50%, var(--brown-deep) 100%)" }}>
        <IslamicPattern variant="light" className="opacity-[0.05]" />
        <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg, transparent, var(--gold-primary), var(--gold-light), var(--gold-primary), transparent)" }} />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <p className="font-islamic text-sm tracking-[0.25em] uppercase mb-3" style={{ color: "var(--gold-light)" }}>Expand Your Knowledge</p>
          <h2 className="font-islamic text-3xl sm:text-4xl font-bold mb-4 text-white">Explore the Full Library</h2>
          <div className="gold-divider mb-6" />
          <p className="text-lg mb-8" style={{ color: "var(--cream-dark)" }}>
            Discover authentic Islamic books across all categories, free and accessible to everyone seeking sacred knowledge.
          </p>
          <Link href="/books" className="btn-gold text-base px-8 py-4 rounded-2xl">
            Browse All Books
          </Link>
        </div>
      </section>
    </div>
  );
}
