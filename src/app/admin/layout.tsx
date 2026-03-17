"use client";

import AdminGuard from "@/components/AdminGuard";
import AdminSidebar from "@/components/AdminSidebar";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  return (
    <AdminGuard>
      {isLoginPage ? (
        // Login page: full screen, no sidebar
        <div className="min-h-screen bg-gray-950">{children}</div>
      ) : (
        // Protected pages: sidebar + content
        <div className="min-h-screen bg-gray-950 text-white">
          <AdminSidebar />
          <div className="lg:pl-64 pt-14 lg:pt-0 min-h-screen">
            <div className="p-6 lg:p-8 max-w-7xl">{children}</div>
          </div>
        </div>
      )}
    </AdminGuard>
  );
}
