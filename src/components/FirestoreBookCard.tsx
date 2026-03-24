import Link from "next/link";
import { FirestoreBook } from "@/types";

const categoryMeta: Record<string, { bg: string; text: string; icon: string }> = {
  Quran:              { bg: "#dcfce7", text: "#15803d", icon: "📖" },
  Hadith:             { bg: "#fef9c3", text: "#a16207", icon: "📜" },
  Fiqh:               { bg: "#dbeafe", text: "#1d4ed8", icon: "⚖️" },
  "Islamic History":  { bg: "#f3e8ff", text: "#7e22ce", icon: "🕌" },
  Scholars:           { bg: "#fce4ec", text: "#c62828", icon: "🎓" },
  "Scholar Biography":{ bg: "#efebe9", text: "#4e342e", icon: "🕌" },
};

export default function FirestoreBookCard({ book }: { book: FirestoreBook }) {
  const meta = categoryMeta[book.category] ?? { bg: "#f5f5f5", text: "#616161", icon: "📖" };

  return (
    <article className="book-card group flex flex-col w-full overflow-hidden rounded-2xl">

      {/* ── Cover image ─────────────────────────────────────── */}
      <div className="book-card__cover relative flex-shrink-0 overflow-hidden"
        style={{ background: "linear-gradient(135deg, var(--green-deep) 0%, var(--brown-deep) 100%)" }}>

        <div className="islamic-pattern-bg" style={{ opacity: 0.06 }} />

        {book.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={book.coverUrl}
            alt={book.title}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover z-10
                       transition-transform duration-500 ease-out
                       group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 p-4">
            <span className="text-5xl drop-shadow-md">{meta.icon}</span>
            <p className="text-white font-islamic font-bold text-sm text-center leading-snug
                          line-clamp-2 px-2 drop-shadow">
              {book.title}
            </p>
          </div>
        )}

        {/* Gold accent bar */}
        <div className="absolute bottom-0 inset-x-0 h-[3px] z-20"
          style={{ background: "linear-gradient(90deg, var(--green-primary), var(--gold-primary), var(--gold-light), var(--gold-primary), var(--green-primary))" }} />
      </div>

      {/* ── Content ─────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 p-4 sm:p-5 gap-2">

        {/* Category badge */}
        <span className="self-start text-xs font-semibold px-2.5 py-1 rounded-full leading-none"
          style={{ background: meta.bg, color: meta.text }}>
          {book.category}
        </span>

        {/* Title */}
        <h3 className="font-islamic font-bold leading-snug line-clamp-2
                       text-base sm:text-[0.95rem]
                       group-hover:text-green-700 transition-colors duration-200"
          style={{ color: "var(--brown-deep)" }}>
          {book.title}
        </h3>

        {/* Author */}
        <p className="text-sm line-clamp-1 leading-tight"
          style={{ color: "var(--text-muted)" }}>
          {book.author}
        </p>

        {/* Pages */}
        {book.pages && (
          <p className="text-xs" style={{ color: "var(--text-muted)", opacity: 0.65 }}>
            {book.pages.toLocaleString()} pages
          </p>
        )}

        {/* ── Action buttons ───────────────────────────────── */}
        <div className="mt-auto pt-3 grid grid-cols-2 gap-2 sm:gap-2.5">
          <Link
            href={`/read/${book.id}`}
            className="btn-green text-xs sm:text-sm py-2.5 sm:py-3 rounded-xl
                       flex items-center justify-center gap-1.5
                       active:scale-95 transition-transform"
          >
            <span aria-hidden>📖</span>
            <span>Read</span>
          </Link>
          <a
            href={book.pdfUrl}
            download
            className="btn-gold text-xs sm:text-sm py-2.5 sm:py-3 rounded-xl
                       flex items-center justify-center gap-1.5
                       active:scale-95 transition-transform"
          >
            <span aria-hidden>⬇</span>
            <span>Download</span>
          </a>
        </div>
      </div>
    </article>
  );
}
