"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, error, clearError } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    clearError();
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password, displayName);
      } else {
        await signInWithEmail(email, password);
      }
      setSuccess(true);
    } catch {
      // error is set by context
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    clearError();
    try {
      await signInWithGoogle();
      setSuccess(true);
    } catch {
      // error is set by context
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4" dir="rtl">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-[#111111]/80 backdrop-blur-xl border border-white/[0.08] rounded-3xl p-12 text-center max-w-md w-full"
        >
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-2xl font-bold text-white mb-4">تم تسجيل الدخول بنجاح!</h2>
          <p className="text-gray-400 mb-8">مرحباً بك في منصة HITU</p>
          <Link
            href="/"
            className="inline-block bg-gradient-to-r from-[#14b8a6] to-[#0d9488] text-white px-8 py-3 rounded-2xl font-bold hover:shadow-lg hover:shadow-[#14b8a6]/25 transition-all"
          >
            الصفحة الرئيسية
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] relative overflow-hidden" dir="rtl">
      {/* Background Effects */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-[#14b8a6]/[0.06] rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#3b82f6]/[0.06] rounded-full blur-3xl animate-float delay-300" />


      {/* Login Form */}
      <div className="relative z-10 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#111111]/80 backdrop-blur-xl border border-white/[0.08] rounded-3xl p-8 sm:p-10 w-full max-w-md"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#14b8a6] to-[#3b82f6] flex items-center justify-center text-white text-3xl font-bold mb-4">
              H
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              {isSignUp ? "إنشاء حساب جديد" : "تسجيل الدخول"}
            </h1>
            <p className="text-gray-400 text-sm">
              {isSignUp ? "انضم لمنصة HITU الآن" : "مرحباً بعودتك إلى HITU"}
            </p>
          </div>

          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.08] text-white rounded-2xl py-3.5 px-4 font-medium transition-all hover:shadow-lg disabled:opacity-50 mb-6"
          >
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            الدخول بحساب Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-white/[0.08]" />
            <span className="text-sm text-gray-500">أو</span>
            <div className="flex-1 h-px bg-white/[0.08]" />
          </div>

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {isSignUp && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">الاسم</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="اسمك الكامل"
                    required={isSignUp}
                    className="w-full bg-[#111111] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14b8a6] transition-all"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">البريد الإلكتروني</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@hitu.edu.eg"
                required
                className="w-full bg-[#111111] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14b8a6] transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">كلمة المرور</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full bg-[#111111] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14b8a6] transition-all"
              />
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm"
                >
                  ⚠️ {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#14b8a6] to-[#0d9488] text-white rounded-2xl py-3.5 font-bold hover:shadow-lg hover:shadow-[#14b8a6]/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  جاري التحميل...
                </span>
              ) : isSignUp ? (
                "إنشاء الحساب"
              ) : (
                "تسجيل الدخول"
              )}
            </button>
          </form>

          {/* Toggle Sign Up / Sign In */}
          <div className="text-center mt-6">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                clearError();
              }}
              className="text-sm text-[#2dd4bf] hover:text-[#5eead4] transition-colors"
            >
              {isSignUp ? "عندك حساب بالفعل؟ سجل دخول" : "ليس لديك حساب؟ أنشئ حساب جديد"}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
