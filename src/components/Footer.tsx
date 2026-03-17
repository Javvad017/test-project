import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-emerald-900 dark:bg-gray-950 text-white mt-16">
      {/* Islamic pattern top border */}
      <div className="h-1 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
                <span className="text-lg">☽</span>
              </div>
              <span className="font-bold text-lg">Islamic Digital Library</span>
            </div>
            <p className="text-emerald-200 text-sm leading-relaxed">
              A free, open-source platform dedicated to spreading Islamic
              knowledge through digital books and resources.
            </p>
            <p className="mt-4 text-amber-400 text-sm font-arabic">
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
            </p>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-amber-400 mb-4 uppercase text-xs tracking-wider">
              Categories
            </h4>
            <ul className="space-y-2">
              {["Quran", "Hadith", "Fiqh", "Islamic History", "Scholars"].map(
                (cat) => (
                  <li key={cat}>
                    <Link
                      href={`/books?category=${cat}`}
                      className="text-emerald-200 hover:text-white text-sm transition-colors"
                    >
                      {cat}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-amber-400 mb-4 uppercase text-xs tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {[
                { label: "Home", href: "/" },
                { label: "All Books", href: "/books" },
                { label: "Featured Books", href: "/books?featured=true" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-emerald-200 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="font-semibold text-amber-400 mb-4 uppercase text-xs tracking-wider">
              About
            </h4>
            <p className="text-emerald-200 text-sm leading-relaxed">
              This library is open source and free for all Muslims and
              non-Muslims seeking Islamic knowledge.
            </p>
            <p className="mt-3 text-emerald-200 text-sm">
              All books are provided for educational purposes.
            </p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-emerald-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-emerald-300 text-sm">
            © {new Date().getFullYear()} Islamic Digital Library. Open Source &
            Free for All.
          </p>
          <p className="text-emerald-400 text-sm">
            Built with ❤️ for the Ummah
          </p>
        </div>
      </div>
    </footer>
  );
}
