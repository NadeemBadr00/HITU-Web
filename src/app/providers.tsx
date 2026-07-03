"use client";

import { AuthProvider } from "@/lib/auth-context";
import { ThemeToggle } from "@/components/theme-toggle";
import { GoogleAnalytics } from "@/components/analytics";
import type { ReactNode } from "react";
import { useEffect } from "react";

function ThemeInitializer() {
  useEffect(() => {
    const stored = localStorage.getItem('hitu-theme');
    if (stored === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  }, []);
  return null;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ThemeInitializer />
      <GoogleAnalytics />
      {children}
      <ThemeToggle />
    </AuthProvider>
  );
}
