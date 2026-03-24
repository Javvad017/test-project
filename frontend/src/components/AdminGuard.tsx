"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (loading) return;
    // Not logged in and not already on login page → redirect to login
    if (!user && !isLoginPage) {
      router.replace("/admin/login");
    }
    // Logged in but on login page → redirect to dashboard
    if (user && isLoginPage) {
      router.replace("/admin/dashboard");
    }
  }, [user, loading, isLoginPage, router]);

  // On login page: always render (no guard needed)
  if (isLoginPage) {
    return <>{children}</>;
  }

  // On protected pages: show spinner while auth resolves
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated → render nothing (redirect is in flight)
  if (!user) return null;

  return <>{children}</>;
}
