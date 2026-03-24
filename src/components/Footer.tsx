import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="relative overflow-hidden mt-0"
      style={{
        background:
          "linear-gradient(180deg, var(--brown-deep) 0%, #1a0f08 100%)",
        color: "var(--cream)",
      }}
    >
      {/* Gold gradient top border */}
      <div
        className="h-[2px]"
        style={{
          background:
            "linear-gradient(90deg, var(--gold-dark), var(--gold-light), var(--gold-primary), var(--gold-light), var(--gold-dark))",
        }}
      />

      {/* Islamic pattern background */}
      <div className="islamic-pattern-bg" style={{ opacity: 0.03 }} />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* About the Library */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, var(--gold-primary), var(--gold-dark))",
                  border: "2px solid var(--gold-light)",
                }}
              >
                <span className="text-white text-lg">☽</span>
              </div>
              <span className="font-islamic font-bold text-lg">
                Islamic Digital Library
              </span>
            </div>
            <p
              className="text-sm leading-relaxed mb-4"
              style={{ color: "var(--cream-dark)", opacity: 0.8 }}
            >
              A free, open-source platform dedicated to preserving and spreading
              authentic Islamic knowledge through digital books and resources.
            </p>
            <p
              className="font-islamic text-base"
              style={{ color: "var(--gold-light)" }}
            >
              بِسْمِ ٱللَّٰهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              className="font-islamic font-semibold mb-5 text-base tracking-wide"
              style={{ color: "var(--gold-light)" }}
            >
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Home", href: "/" },
                { label: "All Books", href: "/books" },
                { label: "Featured Books", href: "/books?featured=true" },
                { label: "Scholar Biographies", href: "/books?category=Scholar%20Biography" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:text-white flex items-center gap-2"
                    style={{ color: "var(--cream-dark)", opacity: 0.7 }}
                  >
                    <span style={{ color: "var(--gold-primary)" }}>›</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Islamic Resources */}
          <div>
            <h4
              className="font-islamic font-semibold mb-5 text-base tracking-wide"
              style={{ color: "var(--gold-light)" }}
            >
              Islamic Resources
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Quran", href: "/books?category=Quran" },
                { label: "Hadith", href: "/books?category=Hadith" },
                { label: "Scholar Biography", href: "/books?category=Scholar%20Biography" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:text-white flex items-center gap-2"
                    style={{ color: "var(--cream-dark)", opacity: 0.7 }}
                  >
                    <span style={{ color: "var(--gold-primary)" }}>›</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact / About */}
          <div>
            <h4
              className="font-islamic font-semibold mb-5 text-base tracking-wide"
              style={{ color: "var(--gold-light)" }}
            >
              About
            </h4>
            <p
              className="text-sm leading-relaxed mb-3"
              style={{ color: "var(--cream-dark)", opacity: 0.7 }}
            >
              This library is open source and free for all Muslims and
              non-Muslims seeking authentic Islamic knowledge.
            </p>
            <p
              className="text-sm"
              style={{ color: "var(--cream-dark)", opacity: 0.7 }}
            >
              All books are provided for educational purposes only.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid rgba(201, 168, 76, 0.2)" }}
        >
          <p className="text-sm" style={{ color: "var(--cream-dark)", opacity: 0.6 }}>
            © {new Date().getFullYear()} Faiz E Shaikh Ikramuddin Paturdavi. Open
            Source &amp; Free for All.
          </p>
          <p
            className="text-sm flex items-center gap-1"
            style={{ color: "var(--gold-primary)", opacity: 0.7 }}
          >
            Built with ❤️ for the Ummah
          </p>
        </div>
      </div>
    </footer>
  );
}
