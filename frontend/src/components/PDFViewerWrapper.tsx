"use client";

import dynamic from "next/dynamic";

const PDFViewer = dynamic(() => import("./PDFViewer"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center py-20 bg-gray-100 dark:bg-gray-900 rounded-xl">
      <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-gray-500 dark:text-gray-400">Loading PDF viewer...</p>
    </div>
  ),
});

interface Props {
  pdfUrl: string;
  title: string;
}

export default function PDFViewerWrapper({ pdfUrl, title }: Props) {
  return <PDFViewer pdfUrl={pdfUrl} title={title} />;
}
