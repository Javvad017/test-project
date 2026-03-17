"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

const navItems = [
  { href: "/admin/dashboard",     label: "Dashboard",     icon: "⊞",  desc: "Overview & stats" },
  { href: "/admin/upload-book",   label: "Upload Book",   icon: "↑",  desc: "Add new book" },
  { href: "/admin/manage-books",  label: "Manage Books",  icon: "☰",  desc: "Edit & delete" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [signingOut, setSigningOut] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    await signOut(auth);
    router.push("/admin/login");
  };

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  const NavContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-6 py-5 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center shadow-lg shadow-emerald-900/50 flex-shrink-0">
            <span className="text-base">☽</span>
          </div>
          <div className="min-w-0">
            <p className="text-white font-bold text-sm leading-tight">Islamic Library</p>
            <p className="text-emerald-500 text-xs">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* User badge */}
      {user && (
        <div className="px-4 py-3 mx-3 mt-4 bg-gray-800/60 rounded-xl border border-gray-700/50">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-emerald-700 flex items-center justify-center text-xs text-white font-bold flex-shrink-0">
              {user.email?.[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-medium truncate">{user.email}</p>
              <p className="text-emerald-500 text-xs">Administrator</p>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="text-gray-600 text-xs font-semibold uppercase tracking-wider px-3 mb-3">Navigation</p>
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                active
                  ? "bg-emerald-600/20 text-emerald-400 border border-emerald-600/30"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white border border-transparent"
              }`}>
              <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0 transition-all ${
                active ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/50" : "bg-gray-800 group-hover:bg-gray-700"
              }`}>
                {item.icon}
              </span>
              <div className="min-w-0">
                <p className="leading-tight">{item.label}</p>
                <p className={`text-xs leading-tight ${active ? "text-emerald-500/70" : "text-gray-600 group-hover:text-gray-500"}`}>
                  {item.desc}
                </p>
              </div>
              {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />}
            </Link>
          );
        })}

        <div className="pt-3 mt-3 border-t border-gray-800">
          <Link href="/" target="_blank" onClick={() => setMobileOpen(false)}
            className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white border border-transparent transition-all">
            <span className="w-8 h-8 rounded-lg bg-gray-800 group-hover:bg-gray-700 flex items-center justify-center text-base flex-shrink-0">🌐</span>
            <div>
              <p>View Website</p>
              <p className="text-xs text-gray-600 group-hover:text-gray-500">Opens in new tab</p>
            </div>
          </Link>
        </div>
      </nav>

      {/* Sign out */}
      <div className="px-3 pb-4 border-t border-gray-800 pt-3">
        <button onClick={handleSignOut} disabled={signingOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-red-500/10 hover:text-red-400 border border-transparent hover:border-red-500/20 transition-all">
          <span className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-base flex-shrink-0">🚪</span>
          {signingOut ? "Signing out..." : "Sign Out"}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-gray-900 border-r border-gray-800 min-h-screen fixed left-0 top-0 z-40">
        <NavContent />
      </aside>

      {/* Mobile topbar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-gray-900 border-b border-gray-800 px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center">
            <span className="text-sm">☽</span>
          </div>
          <span className="text-white font-bold text-sm">Admin Panel</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)}
          className="w-9 h-9 flex flex-col items-center justify-center gap-1.5 text-gray-400 hover:text-white transition-colors">
          {mobileOpen ? (
            <span className="text-lg leading-none">✕</span>
          ) : (
            <>
              <span className="w-5 h-0.5 bg-current rounded" />
              <span className="w-5 h-0.5 bg-current rounded" />
              <span className="w-5 h-0.5 bg-current rounded" />
            </>
          )}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-gray-900 border-r border-gray-800 overflow-y-auto">
            <NavContent />
          </aside>
        </div>
      )}
    </>
  );
}
