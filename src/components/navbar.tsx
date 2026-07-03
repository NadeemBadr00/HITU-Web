"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Menu, X, LogOut, User } from "lucide-react";

const navLinks = [
  { href: "/", label: "الرئيسية" },
  { href: "/departments", label: "الأقسام" },
  { href: "/leaders", label: "القيادات" },
  { href: "/rankings", label: "الأوائل" },
  { href: "/timetable", label: "الجدول الذكي" },
  { href: "/projects", label: "المشاريع" },
  { href: "/chatbot", label: "المساعد الذكي" },
  { href: "/news", label: "الأخبار" },
  { href: "/about", label: "عن الجامعة" },
  { href: "/contact", label: "تواصل" },
];

export function Navbar() {
  const pathname = usePathname();
  const { user, signOut, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/logo.png"
              alt="HITU Logo"
              width={40}
              height={40}
              className="w-10 h-10 rounded-full shadow-lg shadow-[#14b8a6]/15 transition-transform group-hover:scale-105"
            />
            <div className="hidden sm:block">
              <span className="text-lg font-bold text-gradient-brand">HITU</span>
              <p className="text-[10px] text-gray-500 -mt-0.5">جامعة حلوان التكنولوجية الدولية</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-[#14b8a6]/10 text-[#2dd4bf] border border-[#14b8a6]/20"
                      : "text-gray-400 hover:text-white hover:bg-white/[0.05] border border-transparent"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right Side: Auth + Mobile Menu */}
          <div className="flex items-center gap-2">
            {/* Auth */}
            {!loading && user && (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.08] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14b8a6]"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#14b8a6] to-[#3b82f6] flex items-center justify-center">
                    <User className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-sm text-gray-300 hidden sm:block">{user.displayName || 'المستخدم'}</span>
                </button>

                {userMenuOpen && (
                  <div className="absolute left-0 top-full mt-2 w-48 rounded-xl bg-[#111111] border border-white/[0.08] shadow-2xl shadow-black/50 overflow-hidden z-50">
                    <Link
                      href="/admin"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 text-sm text-gray-300 hover:bg-white/[0.05] hover:text-white transition-colors"
                    >
                      <User className="w-4 h-4" />
                      لوحة التحكم
                    </Link>
                    <button
                      onClick={() => { signOut(); setUserMenuOpen(false); }}
                      className="flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors w-full"
                    >
                      <LogOut className="w-4 h-4" />
                      تسجيل الخروج
                    </button>
                  </div>
                )}
              </div>
            )}

            {!loading && !user && (
              <Link
                href="/login"
                className="px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-[#14b8a6] to-[#0d9488] text-white shadow-lg shadow-[#14b8a6]/20 hover:shadow-xl hover:shadow-[#14b8a6]/30 hover:-translate-y-0.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14b8a6]"
              >
                تسجيل الدخول
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl hover:bg-white/[0.05] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14b8a6]"
              aria-label={mobileMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-gray-300" />
              ) : (
                <Menu className="w-5 h-5 text-gray-300" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/[0.06] bg-[#050505]/95 backdrop-blur-xl">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-[#14b8a6]/10 text-[#2dd4bf] border border-[#14b8a6]/20"
                      : "text-gray-400 hover:text-white hover:bg-white/[0.05]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
