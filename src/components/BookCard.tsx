import Link from "next/link";
import { Book } from "@/types";

const categoryBadgeColors: Record<string, { bg: string; text: string }> = {
  Quran: { bg: "#dcfce7", text: "#15803d" },
  Hadith: { bg: "#fef9c3", text: "#a16207" },
  Fiqh: { bg: "#dbeafe", text: "#1d4ed8" },
  "Islamic History": { bg: "#f3e8ff", text: "#7e22ce" },
  Scholars: { bg: "#fce4ec", text: "#c62828" },
  "Scholar Biography": { bg: "#efebe9", text: "#4e342e" },
};

const categoryIcons: Record<string, string> = {
  Quran: "📖",
  Hadith: "📜",
  Fiqh: "⚖️",
  "Islamic History": "🕌",
  Scholars: "🎓",
  "Scholar Biography": "🕌",
};

export default function BookCard({ book }: { book: Book }) {
  const badge = categoryBadgeColors[book.category] || { bg: "#f5f5f5", text: "#616161" };

  return (
    <div className="card-islamic group overflow-hidden">
      {/* Cover */}
      <div
        className="relative h-52 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, var(--green-deep) 0%, var(--brown-deep) 100%)",
        }}
      >
        <div className="islamic-pattern-bg" style={{ opacity: 0.08 }} />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 z-10">
          <span className="text-5xl mb-2">{categoryIcons[book.category]}</span>
          <h3 className="text-white font-islamic font-bold text-center text-sm leading-tight line-clamp-2 px-2">
            {book.title}
          </h3>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-[3px] z-20" style={{ background: "linear-gradient(90deg, var(--green-primary), var(--gold-primary), var(--gold-light), var(--gold-primary), var(--green-primary))" }} />
      </div>

      {/* Content */}
      <div className="p-4">
        <span className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full mb-2" style={{ background: badge.bg, color: badge.text }}>
          {book.category}
        </span>
        <h3 className="font-islamic font-bold text-sm leading-tight mb-1 line-clamp-2 group-hover:text-green-700 transition-colors" style={{ color: "var(--brown-deep)" }}>
          {book.title}
        </h3>
        <p className="text-xs mb-2 line-clamp-1" style={{ color: "var(--text-muted)" }}>
          {book.author}
        </p>
        {book.pages && (
          <p className="text-xs mb-3" style={{ color: "var(--text-muted)", opacity: 0.7 }}>{book.pages} pages</p>
        )}
        <div className="flex gap-2">
          <Link href={`/read/${book.id}`} className="btn-green flex-1 text-xs py-2">📖 Read Online</Link>
          <a href={book.pdfUrl} download className="btn-gold flex-1 text-xs py-2">⬇ Download</a>
        </div>
      </div>
    </div>
  );
}
