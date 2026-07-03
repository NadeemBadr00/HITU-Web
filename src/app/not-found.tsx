import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient orbs */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl animate-pulse [animation-delay:1s]" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="text-center relative z-10 max-w-lg">
        {/* Animated 404 number */}
        <div className="relative mb-8">
          <h1 className="text-[10rem] sm:text-[12rem] font-black leading-none text-transparent bg-clip-text bg-gradient-to-br from-primary-400 via-accent-400 to-primary-600 select-none animate-pulse [animation-duration:3s]">
            404
          </h1>
          {/* Floating particles around the number */}
          <div className="absolute top-8 right-8 w-3 h-3 rounded-full bg-primary-400/60 animate-float" />
          <div className="absolute top-16 left-4 w-2 h-2 rounded-full bg-accent-400/60 animate-float [animation-delay:1s]" />
          <div className="absolute bottom-8 right-16 w-2.5 h-2.5 rounded-full bg-gold-400/60 animate-float [animation-delay:2s]" />
          <div className="absolute bottom-4 left-12 w-1.5 h-1.5 rounded-full bg-primary-300/60 animate-float [animation-delay:0.5s]" />
        </div>

        {/* Broken link illustration */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <svg width="80" height="80" viewBox="0 0 80 80" className="text-slate-600 animate-float [animation-delay:0.3s]">
              {/* Broken chain links */}
              <path
                d="M20 35 Q20 25, 30 25 L38 25 Q42 25, 42 29"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M60 45 Q60 55, 50 55 L42 55 Q38 55, 38 51"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
              {/* Lightning bolt / break */}
              <path
                d="M36 36 L42 40 L38 44"
                fill="none"
                stroke="rgba(234,179,8,0.8)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Message */}
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
          الصفحة غير موجودة
        </h2>
        <p className="text-slate-400 text-base sm:text-lg mb-8 leading-relaxed">
          عذرًا، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
          <br />
          تحقق من الرابط أو عد إلى الصفحة الرئيسية.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-accent-600
              text-white px-6 py-3 rounded-2xl font-medium
              hover:shadow-lg hover:shadow-primary-500/25 hover:scale-105
              transition-all duration-300 ease-out"
          >
            <svg className="w-5 h-5 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            العودة للرئيسية
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-white/5 border border-white/10
              text-slate-300 px-6 py-3 rounded-2xl font-medium
              hover:bg-white/10 hover:text-white
              transition-all duration-300 ease-out"
          >
            تواصل معنا
          </Link>
        </div>

        {/* Helpful suggestion */}
        <p className="mt-10 text-xs text-slate-600">
          رمز الخطأ: 404 — لم يتم العثور على المورد المطلوب
        </p>
      </div>
    </div>
  );
}
