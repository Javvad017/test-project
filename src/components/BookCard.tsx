import Link from "next/link";
import { Book } from "@/types";

const categoryColors: Record<string, string> = {
  Quran: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300",
  Hadith: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
  Fiqh: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  "Islamic History": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  Scholars: "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300",
};

const categoryIcons: Record<string, string> = {
  Quran: "📖",
  Hadith: "📜",
  Fiqh: "⚖️",
  "Islamic History": "🕌",
  Scholars: "🎓",
};

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  return (
    <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 hover:-translate-y-1">
      {/* Cover */}
      <div className="relative h-52 bg-gradient-to-br from-emerald-700 via-emerald-800 to-emerald-900 overflow-hidden">
        {/* Islamic pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
          <span className="text-5xl mb-2">{categoryIcons[book.category]}</span>
          <h3 className="text-white font-bold text-center text-sm leading-tight line-clamp-2 px-2">
            {book.title}
          </h3>
        </div>
        {/* Gold accent bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500" />
      </div>

      {/* Content */}
      <div className="p-4">
        <span
          className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full mb-2 ${categoryColors[book.category]}`}
        >
          {book.category}
        </span>
        <h3 className="font-bold text-gray-800 dark:text-white text-sm leading-tight mb-1 line-clamp-2 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
          {book.title}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-xs mb-3 line-clamp-1">
          {book.author}
        </p>
        {book.pages && (
          <p className="text-gray-400 dark:text-gray-500 text-xs mb-3">
            {book.pages} pages
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            href={`/read/${book.id}`}
            className="flex-1 text-center py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            📖 Read
          </Link>
          <a
            href={book.pdfUrl}
            download
            className="flex-1 text-center py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            ⬇ Download
          </a>
        </div>
      </div>
    </div>
  );
}
