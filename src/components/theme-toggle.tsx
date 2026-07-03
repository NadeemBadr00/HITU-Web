'use client';

import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('hitu-theme');
    if (stored === 'light') {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    } else {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('hitu-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('hitu-theme', 'light');
    }
  };

  if (!mounted) return null;

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? 'تفعيل الوضع الفاتح' : 'تفعيل الوضع الداكن'}
      className="fixed bottom-6 left-6 z-50 w-12 h-12 rounded-2xl
        bg-white/10 dark:bg-white/5 backdrop-blur-2xl
        border border-white/20 dark:border-white/10
        shadow-lg shadow-black/10 dark:shadow-black/30
        hover:bg-white/20 dark:hover:bg-white/10
        hover:scale-110 active:scale-95
        transition-all duration-300 ease-out
        flex items-center justify-center group cursor-pointer"
    >
      {/* Sun icon (shown in dark mode) */}
      <svg
        className={`absolute w-5 h-5 transition-all duration-500 ease-in-out
          ${isDark
            ? 'rotate-0 scale-100 opacity-100 text-amber-400'
            : 'rotate-90 scale-0 opacity-0 text-amber-400'
          }`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <circle cx="12" cy="12" r="5" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>

      {/* Moon icon (shown in light mode) */}
      <svg
        className={`absolute w-5 h-5 transition-all duration-500 ease-in-out
          ${!isDark
            ? 'rotate-0 scale-100 opacity-100 text-indigo-600'
            : '-rotate-90 scale-0 opacity-0 text-indigo-600'
          }`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
      </svg>

      {/* Glow ring on hover */}
      <span className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300
        bg-gradient-to-br from-amber-400/20 to-indigo-500/20 dark:from-amber-400/10 dark:to-indigo-500/10" />
    </button>
  );
}
