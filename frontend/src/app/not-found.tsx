import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <span className="text-8xl mb-6">🕌</span>
      <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-3">
        Page Not Found
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
        The page you&apos;re looking for doesn&apos;t exist. Perhaps you were looking for a
        book?
      </p>
      <div className="flex gap-4">
        <Link
          href="/"
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-colors"
        >
          Go Home
        </Link>
        <Link
          href="/books"
          className="px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold transition-colors"
        >
          Browse Books
        </Link>
      </div>
    </div>
  );
}
