import Image from 'next/image';

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#14b8a6]/[0.05] rounded-full blur-[100px]" />
      </div>

      {/* Logo with pulse */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Pulsing rings */}
        <div className="relative w-24 h-24 mb-8">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-2 border-[#14b8a6]/20 animate-ping [animation-duration:2s]" />
          {/* Middle ring */}
          <div className="absolute inset-1 rounded-full border border-[#3b82f6]/15 animate-ping [animation-duration:2s] [animation-delay:0.3s]" />
          {/* University Logo */}
          <div className="relative w-full h-full rounded-full flex items-center justify-center shadow-2xl shadow-[#14b8a6]/20 animate-pulse [animation-duration:2s]">
            <Image
              src="/logo.png"
              alt="HITU Logo"
              width={96}
              height={96}
              className="w-full h-full rounded-full object-contain"
              priority
            />
          </div>
        </div>

        {/* Spinner dots */}
        <div className="flex items-center gap-1.5 mb-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-[#14b8a6]"
              style={{
                animation: 'bounce 1.4s ease-in-out infinite',
                animationDelay: `${i * 0.16}s`,
              }}
            />
          ))}
        </div>

        {/* Text */}
        <p className="text-sm text-gray-500 animate-pulse">
          جارِ التحميل...
        </p>
      </div>

      {/* Inline keyframes for bounce */}
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
