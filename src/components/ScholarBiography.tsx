import Link from "next/link";

const scholar = {
    name: "Faiz E Shaikh Ikramuddin Paturdavi",
    title: "Islamic Scholar and Spiritual Teacher",
    bio: "Faiz E Shaikh Ikramuddin Paturdavi is a respected Islamic scholar dedicated to spreading authentic Islamic knowledge, guiding students, and preserving traditional teachings. His work focuses on Islamic education, spirituality, and strengthening the community through learning and faith.",
    icon: "🕌",
};

export default function ScholarBiography() {
    return (
        <section
            className="py-20 relative overflow-hidden"
            style={{ background: "var(--bg-secondary)" }}
        >
            <div className="islamic-star-pattern" />
            <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-14">
                    <p className="font-islamic text-sm tracking-[0.25em] uppercase mb-3" style={{ color: "var(--green-primary)" }}>
                        Guardians of Knowledge
                    </p>
                    <h2 className="font-islamic text-3xl sm:text-4xl font-bold mb-4" style={{ color: "var(--brown-deep)" }}>
                        Scholar Biographies
                    </h2>
                    <div className="gold-divider mb-4" />
                    <p style={{ color: "var(--text-muted)" }} className="max-w-xl mx-auto">
                        Discover the great Islamic scholars and saints whose contributions preserved sacred knowledge for generations.
                    </p>
                </div>

                {/* Single Scholar Card — Centered */}
                <div className="flex justify-center">
                    <div className="card-islamic group overflow-hidden w-full max-w-md">
                        {/* Top decorative band — green to brown gradient */}
                        <div
                            className="h-28 relative flex items-center justify-center"
                            style={{
                                background: "linear-gradient(135deg, var(--green-deep) 0%, var(--green-primary) 40%, var(--brown-warm) 100%)",
                            }}
                        >
                            <div className="islamic-pattern-bg-light" style={{ opacity: 0.08 }} />
                            <span className="text-5xl relative z-10">{scholar.icon}</span>
                        </div>

                        {/* Content */}
                        <div className="p-6 text-center">
                            <h3 className="font-islamic text-xl font-bold mb-2" style={{ color: "var(--brown-deep)" }}>
                                {scholar.name}
                            </h3>
                            <p className="text-sm font-semibold mb-4" style={{ color: "var(--green-primary)" }}>
                                {scholar.title}
                            </p>
                            <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--text-secondary)" }}>
                                {scholar.bio}
                            </p>
                            <Link href="/books?category=Scholar%20Biography" className="btn-gold text-sm w-full">
                                Read Biography
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
