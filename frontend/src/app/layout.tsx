import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Islamic Digital Library — Read Islamic Books Online",
  description:
    "A free, open-source Islamic digital library. Read and download Islamic books including Quran, Hadith, Fiqh, Islamic History, and more.",
  keywords: ["Islamic books", "Quran", "Hadith", "Fiqh", "Islamic library", "PDF books"],
  openGraph: {
    title: "Islamic Digital Library",
    description: "Read Islamic books online for free",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geist.className} bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen flex flex-col`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
