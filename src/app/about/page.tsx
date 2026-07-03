import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'عن الجامعة',
  description:
    'تعرف على جامعة حلوان التكنولوجية الدولية - تاريخها، رؤيتها، رسالتها، والنظام الأكاديمي',
};


const features = [
  {
    icon: '🎓',
    title: 'تعليم تطبيقي',
    description: 'نظام تعليمي يركز على التطبيق العملي والمهارات التقنية',
  },
  {
    icon: '🌍',
    title: 'شراكات دولية',
    description: 'تعاون مع جامعات ومؤسسات دولية رائدة',
  },
  {
    icon: '🏭',
    title: 'تدريب عملي',
    description: 'تدريب في شركات ومصانع حقيقية أثناء الدراسة',
  },
  {
    icon: '💡',
    title: 'تكنولوجيا متقدمة',
    description: 'معامل ومعدات حديثة على أعلى مستوى',
  },
  {
    icon: '📚',
    title: 'مناهج محدثة',
    description: 'مناهج متطورة تواكب احتياجات سوق العمل',
  },
  {
    icon: '🤝',
    title: 'دعم طلابي',
    description: 'خدمات دعم أكاديمي واجتماعي شاملة',
  },
];

const keyBullets = [
  'الدراسة باللغة الإنجليزية مع دعم عربي',
  'التدريب العملي في الشركات والمصانع جزء أساسي من البرنامج',
  'إمكانية العمل بالدبلوم بعد سنتين أو إكمال البكالوريوس',
  'مشروع تخرج تطبيقي في السنة الرابعة',
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-gray-100 overflow-x-hidden">

      {/* ───────────────── Hero Section ───────────────── */}
      <section className="relative py-32 pt-40 bg-[#050505] overflow-hidden">
        {/* Decorative orbs */}
        <div className="absolute top-20 right-1/4 w-72 h-72 bg-[#14b8a6]/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 left-1/3 w-96 h-96 bg-[#3b82f6]/8 rounded-full blur-3xl animate-float delay-300" />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-[#14b8a6] to-[#3b82f6] bg-clip-text text-transparent animate-slide-up leading-tight">
            🏛️ عن جامعة حلوان التكنولوجية الدولية
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto animate-fade-in delay-200">
            جامعة تكنولوجية رائدة تجمع بين التعليم الأكاديمي المتميز والتدريب
            العملي، لتأهيل كوادر تقنية قادرة على قيادة المستقبل.
          </p>
        </div>
      </section>

      {/* ───────────────── Gradient divider ───────────────── */}
      <div className="h-px bg-gradient-to-r from-[#14b8a6] via-[#3b82f6] to-[#f59e0b]" />

      {/* ───────────────── About Section ───────────────── */}
      <section className="py-24 bg-[#0a0a0a] relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#14b8a6]/5 rounded-full blur-3xl" />

        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 animate-slide-up">
            <span className="bg-gradient-to-r from-[#14b8a6] to-[#3b82f6] bg-clip-text text-transparent">📖 نبذة عن الجامعة</span>
          </h2>

          <div className="bg-[#111111]/80 backdrop-blur-xl border border-white/[0.08] rounded-3xl p-8 sm:p-12 hover:-translate-y-1 hover:border-[#14b8a6]/30 transition-all duration-300 animate-fade-in delay-100">
            <div className="space-y-5 text-lg leading-relaxed text-gray-300">
              <p className="flex items-start gap-3">
                <span className="text-2xl mt-1 shrink-0">🏫</span>
                <span>
                  جامعة حلوان التكنولوجية الدولية هي جامعة تكنولوجية متخصصة
                  تابعة لوزارة التعليم العالي.
                </span>
              </p>
              <p className="flex items-start gap-3">
                <span className="text-2xl mt-1 shrink-0">🎯</span>
                <span>
                  تأسست بهدف تخريج كوادر تقنية متميزة تلبي احتياجات سوق العمل
                  المحلي والدولي.
                </span>
              </p>
              <p className="flex items-start gap-3">
                <span className="text-2xl mt-1 shrink-0">⚙️</span>
                <span>
                  تتميز بنظام تعليمي تطبيقي يجمع بين النظرية والممارسة العملية.
                </span>
              </p>
              <p className="flex items-start gap-3">
                <span className="text-2xl mt-1 shrink-0">🔬</span>
                <span>
                  تضم 7 أقسام علمية متخصصة في مجالات التكنولوجيا المتقدمة.
                </span>
              </p>
              <p className="flex items-start gap-3">
                <span className="text-2xl mt-1 shrink-0">📍</span>
                <span>
                  تقع في مجمع الأميرية التابع لجامعة حلوان، بالإضافة إلى فرع
                  شارع السواح بمنطقة الزيتون.
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────── Gradient divider ───────────────── */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#14b8a6]/40 to-transparent" />

      {/* ───────────────── Vision & Mission ───────────────── */}
      <section className="py-24 bg-[#050505] relative">
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#3b82f6]/5 rounded-full blur-3xl" />

        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-14 animate-slide-up">
            <span className="bg-gradient-to-r from-[#14b8a6] to-[#3b82f6] bg-clip-text text-transparent">الرؤية والرسالة</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Vision */}
            <div className="bg-[#111111]/80 backdrop-blur-xl border border-white/[0.08] rounded-3xl p-8 sm:p-10 hover:-translate-y-1 hover:border-[#14b8a6]/30 transition-all duration-300 animate-fade-in delay-100">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-4xl">🔭</span>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-[#f59e0b] to-[#f97316] bg-clip-text text-transparent">الرؤية</h3>
              </div>
              <p className="text-lg leading-relaxed text-gray-300">
                أن تكون جامعة حلوان التكنولوجية الدولية رائدة في التعليم
                التكنولوجي التطبيقي على المستوى الإقليمي والدولي، وأن تساهم في
                بناء جيل من المتخصصين القادرين على قيادة التحول الرقمي
                والتكنولوجي.
              </p>
            </div>

            {/* Mission */}
            <div className="bg-[#111111]/80 backdrop-blur-xl border border-white/[0.08] rounded-3xl p-8 sm:p-10 hover:-translate-y-1 hover:border-[#14b8a6]/30 transition-all duration-300 animate-fade-in delay-200">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-4xl">🎯</span>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-[#f59e0b] to-[#f97316] bg-clip-text text-transparent">الرسالة</h3>
              </div>
              <p className="text-lg leading-relaxed text-gray-300">
                تقديم تعليم تكنولوجي تطبيقي عالي الجودة يجمع بين المعرفة النظرية
                والمهارات العملية، من خلال برامج أكاديمية متطورة وشراكات صناعية
                فعالة، لتأهيل خريجين قادرين على المنافسة في سوق العمل المحلي
                والدولي.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────── Gradient divider ───────────────── */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#3b82f6]/40 to-transparent" />

      {/* ───────────────── Academic System ───────────────── */}
      <section className="py-24 bg-[#0a0a0a] relative overflow-hidden">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-[#f59e0b]/5 rounded-full blur-3xl" />

        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 animate-slide-up">
            <span className="bg-gradient-to-r from-[#14b8a6] to-[#3b82f6] bg-clip-text text-transparent">📐 النظام الأكاديمي (2+2)</span>
          </h2>
          <p className="text-center text-lg text-gray-400 mb-14 animate-fade-in delay-100">
            نظام فريد يجمع بين الدبلوم والبكالوريوس
          </p>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="hidden md:block absolute top-0 bottom-0 right-1/2 w-0.5 bg-gradient-to-b from-[#14b8a6] via-[#3b82f6] to-[#f59e0b]" />

            {/* Step 1 */}
            <div className="relative md:flex items-center mb-16 animate-fade-in delay-200">
              <div className="md:w-1/2 md:pl-12 md:text-left">
                <div className="bg-[#111111]/80 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 sm:p-8 hover:-translate-y-1 hover:border-[#14b8a6]/30 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">📝</span>
                    <div>
                      <h3 className="text-xl font-bold text-[#2dd4bf]">
                        السنة الأولى والثانية
                      </h3>
                      <span className="text-sm font-semibold text-[#f59e0b]">
                        دبلوم فني تقني
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    الطالب بيدرس المقررات الأساسية والتخصصية الأولية ويحصل على
                    دبلوم فني متخصص. يقدر يشتغل بعد السنتين دول لو حب.
                  </p>
                </div>
              </div>

              {/* Timeline dot */}
              <div className="hidden md:flex absolute right-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-[#14b8a6] items-center justify-center text-white font-bold shadow-lg shadow-[#14b8a6]/30">
                1
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative md:flex items-center flex-row-reverse animate-fade-in delay-300">
              <div className="md:w-1/2 md:pr-12 md:text-right">
                <div className="bg-[#111111]/80 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 sm:p-8 hover:-translate-y-1 hover:border-[#14b8a6]/30 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">🎓</span>
                    <div>
                      <h3 className="text-xl font-bold text-[#60a5fa]">
                        السنة الثالثة والرابعة
                      </h3>
                      <span className="text-sm font-semibold text-[#f59e0b]">
                        بكالوريوس تكنولوجيا
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    الطالب بيكمل دراسته المتقدمة والتخصصية ويحصل على درجة
                    البكالوريوس. يشمل مشروع التخرج والتدريب العملي.
                  </p>
                </div>
              </div>

              {/* Timeline dot */}
              <div className="hidden md:flex absolute right-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-[#3b82f6] items-center justify-center text-white font-bold shadow-lg shadow-[#3b82f6]/30">
                2
              </div>
            </div>
          </div>

          {/* Key info bullets */}
          <div className="mt-16 bg-[#111111]/80 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 sm:p-8 animate-fade-in delay-400">
            <h4 className="text-lg font-bold mb-4 bg-gradient-to-r from-[#f59e0b] to-[#f97316] bg-clip-text text-transparent">
              ✨ معلومات مهمة
            </h4>
            <ul className="space-y-3">
              {keyBullets.map((bullet, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-gray-300"
                >
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-gradient-to-br from-[#14b8a6] to-[#3b82f6]" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ───────────────── Gradient divider ───────────────── */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#f59e0b]/40 to-transparent" />

      {/* ───────────────── University Features ───────────────── */}
      <section className="py-24 bg-[#050505] relative">
        <div className="absolute top-10 right-10 w-64 h-64 bg-[#14b8a6]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-[#3b82f6]/5 rounded-full blur-3xl" />

        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-14 animate-slide-up">
            <span className="bg-gradient-to-r from-[#14b8a6] to-[#3b82f6] bg-clip-text text-transparent">🌟 مميزات الجامعة</span>
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className={`bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 sm:p-8 hover:-translate-y-1 hover:border-[#14b8a6]/30 transition-all duration-300 animate-fade-in delay-${
                  (i + 1) * 100
                }`}
              >
                <span className="text-4xl block mb-4">{feature.icon}</span>
                <h3 className="text-xl font-bold mb-2 text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────── Gradient divider ───────────────── */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#14b8a6]/40 to-transparent" />

      {/* ───────────────── Locations & Transportation ───────────────── */}
      <section className="py-24 bg-[#0a0a0a] relative">
        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-14 animate-slide-up">
            <span className="bg-gradient-to-r from-[#14b8a6] to-[#3b82f6] bg-clip-text text-transparent">📍 الموقع والمواصلات</span>
          </h2>

          {/* Google Maps Embed */}
          <div className="bg-[#111111]/80 backdrop-blur-xl border border-white/[0.08] rounded-3xl overflow-hidden mb-10 animate-fade-in">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3452.8!2d31.3085!3d30.0875!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14583f7e5e8f1b5b%3A0x48a84ef6e1e08a73!2z2KzYp9mF2LnYqSDYrdmE2YjYp9mGINin2YTYqtmD2YbZiNmE2YjYrNmK2Kkg2KfZhNiv2YjZhNmK2Kk!5e0!3m2!1sar!2seg!4v1719922800000!5m2!1sar!2seg"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full"
              title="موقع جامعة حلوان التكنولوجية الدولية"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-10">
            {/* Main Campus */}
            <div className="bg-[#111111]/80 backdrop-blur-xl border border-white/[0.08] rounded-3xl p-8 hover:-translate-y-1 hover:border-[#14b8a6]/30 transition-all duration-300 animate-fade-in delay-100">
              <div className="flex items-center gap-4 mb-5">
                <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[#14b8a6]/15 text-3xl">
                  🏛️
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    مجمع الأميرية التعليمي
                  </h3>
                  <p className="text-sm text-[#2dd4bf] font-medium">
                    الحرم الرئيسي
                  </p>
                </div>
              </div>
              <p className="text-gray-400 mb-3">
                شارع الصحراء — منطقة الأميرية — القاهرة
              </p>
              <a
                href="https://www.google.com/maps/search/%D8%AC%D8%A7%D9%85%D8%B9%D8%A9+%D8%AD%D9%84%D9%88%D8%A7%D9%86+%D8%A7%D9%84%D8%AA%D9%83%D9%86%D9%88%D9%84%D9%88%D8%AC%D9%8A%D8%A9+%D8%A7%D9%84%D8%AF%D9%88%D9%84%D9%8A%D8%A9"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#2dd4bf] hover:text-[#5eead4] text-sm font-medium transition-colors"
              >
                <span>📌</span> افتح في Google Maps
                <span className="text-xs">↗</span>
              </a>
            </div>

            {/* Branch */}
            <div className="bg-[#111111]/80 backdrop-blur-xl border border-white/[0.08] rounded-3xl p-8 hover:-translate-y-1 hover:border-[#14b8a6]/30 transition-all duration-300 animate-fade-in delay-200">
              <div className="flex items-center gap-4 mb-5">
                <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[#3b82f6]/15 text-3xl">
                  🏢
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    فرع السواح
                  </h3>
                  <p className="text-sm text-[#60a5fa] font-medium">الفرع</p>
                </div>
              </div>
              <p className="text-gray-400">
                شارع السواح — منطقة الزيتون — القاهرة
              </p>
            </div>
          </div>

          {/* Transportation Guide */}
          <div className="bg-[#111111]/80 backdrop-blur-xl border border-white/[0.08] rounded-3xl p-8 animate-fade-in delay-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[#22c55e]/15 text-3xl">
                🚇
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  إزاي توصل الجامعة؟
                </h3>
                <p className="text-sm text-[#4ade80] font-medium">
                  دليل المواصلات
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Metro Option 1 */}
              <div className="bg-white/[0.03] rounded-2xl p-5 border border-white/[0.08]">
                <div className="flex items-center gap-3 mb-3">
                  <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-red-500/15 text-lg">🚇</span>
                  <span className="font-bold text-white text-sm">مترو سراي القبة</span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  انزل محطة <span className="text-[#2dd4bf] font-medium">سراي القبة</span> (الخط الأول) → اركب ميكروباص لمجمع الأميرية التعليمي
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="inline-block w-3 h-3 rounded-full bg-red-500"></span>
                  <span className="text-xs text-gray-500">الخط الأول — حلوان ↔ المرج</span>
                </div>
              </div>

              {/* Metro Option 2 */}
              <div className="bg-white/[0.03] rounded-2xl p-5 border border-white/[0.08]">
                <div className="flex items-center gap-3 mb-3">
                  <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-red-500/15 text-lg">🚇</span>
                  <span className="font-bold text-white text-sm">مترو كوبري القبة</span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  انزل محطة <span className="text-[#2dd4bf] font-medium">كوبري القبة</span> (الخط الأول) → اركب ميكروباص لمجمع الأميرية التعليمي
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="inline-block w-3 h-3 rounded-full bg-red-500"></span>
                  <span className="text-xs text-gray-500">الخط الأول — حلوان ↔ المرج</span>
                </div>
              </div>

              {/* Microbus */}
              <div className="bg-white/[0.03] rounded-2xl p-5 border border-white/[0.08]">
                <div className="flex items-center gap-3 mb-3">
                  <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-500/15 text-lg">🚐</span>
                  <span className="font-bold text-white text-sm">ميكروباص</span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  من أي محطة مترو قريبة، اركب <span className="text-[#2dd4bf] font-medium">ميكروباص الأميرية</span> واسأل عن مجمع الأميرية التعليمي
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="inline-block w-3 h-3 rounded-full bg-blue-500"></span>
                  <span className="text-xs text-gray-500">~10 دقايق من المترو</span>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-[#14b8a6]/10 rounded-2xl border border-[#14b8a6]/20">
              <p className="text-sm text-gray-300 text-center">
                💡 <span className="font-medium">نصيحة:</span> أقرب محطتين مترو هم{" "}
                <span className="text-[#2dd4bf] font-bold">سراي القبة</span> و{" "}
                <span className="text-[#2dd4bf] font-bold">كوبري القبة</span> على الخط الأول (الأحمر) — ومن هناك ميكروباص مباشر للجامعة
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────── Gradient divider ───────────────── */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#3b82f6]/40 to-transparent" />

      {/* ───────────────── CTA Section ───────────────── */}
      <section className="py-24 bg-[#050505] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 bg-[#14b8a6]/10 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-80 h-80 bg-[#3b82f6]/10 rounded-full blur-3xl animate-float delay-300" />

        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 animate-slide-up">
            <span className="bg-gradient-to-r from-[#f59e0b] to-[#f97316] bg-clip-text text-transparent">جاهز تكتشف أكتر؟</span>
          </h2>
          <p className="text-lg text-gray-400 mb-10 animate-fade-in delay-100">
            اكتشف الأقسام العلمية واتعرف على قيادات الجامعة
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in delay-200">
            <Link
              href="/departments"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#14b8a6] to-[#0d9488] text-white font-semibold shadow-lg shadow-[#14b8a6]/25 hover:shadow-[#14b8a6]/40 hover:scale-105 transition-all duration-300"
            >
              استكشف الأقسام
              <span className="text-lg">🔬</span>
            </Link>
            <Link
              href="/leaders"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white/[0.05] backdrop-blur-sm border border-white/[0.12] text-white font-semibold hover:bg-white/[0.1] hover:scale-105 transition-all duration-300"
            >
              تعرف على القيادات
              <span className="text-lg">👥</span>
            </Link>
          </div>
        </div>
      </section>


    </main>
  );
}
