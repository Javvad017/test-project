import { Book } from "@/types";

export const books: Book[] = [
  {
    id: "1",
    title: "The Noble Quran",
    author: "Allah (Revealed to Prophet Muhammad ﷺ)",
    category: "Quran",
    cover: "/covers/quran.jpg",
    pdfUrl: "/books/quran.pdf",
    description:
      "The holy scripture of Islam, the final revelation from Allah to mankind.",
    pages: 604,
    language: "Arabic / English",
    year: 610,
  },
  {
    id: "2",
    title: "Sahih Al-Bukhari",
    author: "Imam Muhammad ibn Ismail al-Bukhari",
    category: "Hadith",
    cover: "/covers/bukhari.jpg",
    pdfUrl: "/books/bukhari.pdf",
    description:
      "One of the six major hadith collections, considered the most authentic book after the Quran.",
    pages: 1200,
    language: "Arabic / English",
    year: 846,
  },
  {
    id: "3",
    title: "Sahih Muslim",
    author: "Imam Muslim ibn al-Hajjaj",
    category: "Hadith",
    cover: "/covers/muslim.jpg",
    pdfUrl: "/books/muslim.pdf",
    description:
      "The second most authentic hadith collection in Sunni Islam.",
    pages: 1100,
    language: "Arabic / English",
    year: 875,
  },
  {
    id: "4",
    title: "Fiqh us-Sunnah",
    author: "Sayyid Sabiq",
    category: "Fiqh",
    cover: "/covers/fiqh-sunnah.jpg",
    pdfUrl: "/books/fiqh-sunnah.pdf",
    description:
      "A comprehensive guide to Islamic jurisprudence based on the Quran and Sunnah.",
    pages: 800,
    language: "English",
    year: 1945,
  },
  {
    id: "5",
    title: "The Sealed Nectar",
    author: "Safiur-Rahman al-Mubarakpuri",
    category: "Islamic History",
    cover: "/covers/sealed-nectar.jpg",
    pdfUrl: "/books/sealed-nectar.pdf",
    description:
      "An award-winning biography of Prophet Muhammad ﷺ, winner of the First International Competition on the Prophet's Biography.",
    pages: 580,
    language: "English",
    year: 1979,
  },
  {
    id: "6",
    title: "Riyad as-Salihin",
    author: "Imam Yahya ibn Sharaf al-Nawawi",
    category: "Hadith",
    cover: "/covers/riyad.jpg",
    pdfUrl: "/books/riyad.pdf",
    description:
      "Gardens of the Righteous — a compilation of Quranic verses and hadiths on Islamic morals and manners.",
    pages: 600,
    language: "Arabic / English",
    year: 1270,
  },
  {
    id: "7",
    title: "Ibn Kathir's Tafsir",
    author: "Imam Ismail ibn Kathir",
    category: "Quran",
    cover: "/covers/ibn-kathir.jpg",
    pdfUrl: "/books/ibn-kathir.pdf",
    description:
      "One of the most comprehensive and widely used Tafsir (exegesis) of the Quran.",
    pages: 2000,
    language: "English",
    year: 1370,
  },
  {
    id: "8",
    title: "The History of Islam",
    author: "Akbar Shah Najeebabadi",
    category: "Islamic History",
    cover: "/covers/history-islam.jpg",
    pdfUrl: "/books/history-islam.pdf",
    description:
      "A detailed account of Islamic history from the time of the Prophet ﷺ to the modern era.",
    pages: 900,
    language: "English",
    year: 2000,
  },
  {
    id: "9",
    title: "Lives of the Scholars",
    author: "Imam al-Dhahabi",
    category: "Scholars",
    cover: "/covers/scholars.jpg",
    pdfUrl: "/books/scholars.pdf",
    description:
      "Biographies of the great Islamic scholars throughout history.",
    pages: 750,
    language: "English",
    year: 1350,
  },
  {
    id: "10",
    title: "Al-Muwatta",
    author: "Imam Malik ibn Anas",
    category: "Fiqh",
    cover: "/covers/muwatta.jpg",
    pdfUrl: "/books/muwatta.pdf",
    description:
      "The earliest surviving book of Islamic law and hadith collection by Imam Malik.",
    pages: 500,
    language: "Arabic / English",
    year: 795,
  },
  {
    id: "11",
    title: "Ihya Ulum al-Din",
    author: "Imam Abu Hamid al-Ghazali",
    category: "Scholars",
    cover: "/covers/ihya.jpg",
    pdfUrl: "/books/ihya.pdf",
    description:
      "Revival of the Religious Sciences — a masterpiece of Islamic spirituality and ethics.",
    pages: 1500,
    language: "English",
    year: 1100,
  },
  {
    id: "12",
    title: "The Beginning and the End",
    author: "Imam Ismail ibn Kathir",
    category: "Islamic History",
    cover: "/covers/beginning-end.jpg",
    pdfUrl: "/books/beginning-end.pdf",
    description:
      "Al-Bidaya wan-Nihaya — a comprehensive history of the world from an Islamic perspective.",
    pages: 1800,
    language: "English",
    year: 1370,
  },
];

export const categories = [
  "All",
  "Quran",
  "Hadith",
  "Fiqh",
  "Islamic History",
  "Scholars",
] as const;

export const featuredBooks = books.slice(0, 4);
export const latestBooks = books.slice(4, 8);
