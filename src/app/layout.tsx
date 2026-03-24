import type { Metadata } from "next";
import { Lora } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const lora = Lora({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "Faiz E Shaikh Ikramuddin Paturdavi — Islamic Digital Library",
  description:
    "A free, open-source Islamic digital library. Read and download authentic Islamic books including Quran, Hadith, Scholar Biographies, and more.",
  keywords: [
    "Islamic books",
    "Quran",
    "Hadith",
    "Scholar Biography",
    "Islamic library",
    "PDF books",
    "Shaikh Ikramuddin Paturdavi",
  ],
  openGraph: {
    title: "Faiz E Shaikh Ikramuddin Paturdavi — Islamic Digital Library",
    description: "Read and download authentic Islamic books for free",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning data-theme="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400;1,700&family=Playfair+Display:wght@400;500;600;700;800&family=Scheherazade+New:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${lora.className} min-h-screen flex flex-col`}
        style={{
          background: "#faf6ef",
          color: "#2c1810",
        }}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
