import Link from "next/link";

const knowledgeCategories = [
    {
        title: "Quran",
        icon: "📖",
        description:
            "The holy scripture of Islam — the final revelation from Allah to mankind through Prophet Muhammad ﷺ.",
        href: "/books?category=Quran",
        accent: "#15803d",
    },
    {
        title: "Hadith",
        icon: "📜",
        description:
            "Authentic collections of sayings and actions of Prophet Muhammad ﷺ — the second source of Islamic guidance.",
        href: "/books?category=Hadith",
        accent: "#a07c2a",
    },
    {
        title: "Scholar Biography",
        icon: "🕌",
        description:
            "Lives and works of great Islamic scholars and saints who preserved and spread sacred knowledge.",
        href: "/books?category=Scholar%20Biography",
        accent: "#5c4033",
    },
];

export default function BrowseKnowledge() {
    return (
        <section className="py-20 relative overflow-hidden">
            <div className="islamic-pattern-bg-light" />
            <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-14">
                    <p className="font-islamic text-sm tracking-[0.25em] uppercase mb-3" style={{ color: "var(--green-primary)" }}>
                        Explore Islamic Knowledge
                    </p>
                    <h2 className="font-islamic text-3xl sm:text-4xl font-bold mb-4" style={{ color: "var(--brown-deep)" }}>
                        Browse Knowledge
                    </h2>
                    <div className="gold-divider mb-4" />
                    <p style={{ color: "var(--text-muted)" }} className="max-w-xl mx-auto">
                        Dive into the treasures of Islamic scholarship across authentic categories of sacred knowledge.
                    </p>
                </div>

                {/* Category Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {knowledgeCategories.map((cat, i) => (
                        <Link
                            key={cat.title}
                            href={cat.href}
                            className="card-islamic group relative p-8 text-center"
                            style={{ animationDelay: `${i * 0.12}s` }}
                        >
                            {/* Green + Gold border top accent */}
                            <div
                                className="absolute top-0 left-8 right-8 h-[2px] rounded-full"
                                style={{
                                    background: `linear-gradient(90deg, transparent, ${cat.accent}, var(--gold-primary), ${cat.accent}, transparent)`,
                                }}
                            />

                            {/* Icon */}
                            <div
                                className="w-20 h-20 mx-auto mb-5 rounded-full flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-300"
                                style={{
                                    background: "linear-gradient(135deg, var(--cream) 0%, var(--cream-dark) 100%)",
                                    border: "2px solid var(--border-gold)",
                                }}
                            >
                                {cat.icon}
                            </div>

                            {/* Title */}
                            <h3 className="font-islamic text-xl font-bold mb-3 transition-colors" style={{ color: "var(--brown-deep)" }}>
                                {cat.title}
                            </h3>

                            {/* Description */}
                            <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--text-muted)" }}>
                                {cat.description}
                            </p>

                            {/* CTA */}
                            <span className="inline-flex items-center text-sm font-semibold gap-1 group-hover:gap-2 transition-all" style={{ color: "var(--green-primary)" }}>
                                Explore Collection <span className="transition-transform group-hover:translate-x-1">→</span>
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
