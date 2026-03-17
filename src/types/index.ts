export interface Book {
  id: string;
  title: string;
  author: string;
  category: Category;
  cover: string;
  pdfUrl: string;
  description: string;
  pages?: number;
  language?: string;
  year?: number;
}

export type Category =
  | "Quran"
  | "Hadith"
  | "Fiqh"
  | "Islamic History"
  | "Scholars";

export interface FirestoreBook {
  id: string;
  title: string;
  author: string;
  category: Category;
  description: string;
  coverUrl: string;
  coverStoragePath: string;
  pdfUrl: string;
  pdfStoragePath: string;
  pages?: number;
  language?: string;
  year?: number;
  createdAt?: unknown;
  updatedAt?: unknown;
}
