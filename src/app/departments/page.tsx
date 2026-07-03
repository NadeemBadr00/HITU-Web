'use client';

import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const departments = [
  {
    id: 'ai',
    nameAr: 'الذكاء الاصطناعي',
    nameEn: 'Artificial Intelligence',
    icon: '🤖',
    gradient: 'from-blue-500 to-indigo-600',
    meshColor: 'rgba(99, 102, 241, 0.06)',
    description: 'تطوير أنظمة ذكية قادرة على التعلم واتخاذ القرارات',
  },
  {
    id: 'ds',
    nameAr: 'علوم البيانات',
    nameEn: 'Data Science',
    icon: '📊',
    gradient: 'from-emerald-500 to-teal-600',
    meshColor: 'rgba(20, 184, 166, 0.06)',
    description: 'تحليل البيانات الضخمة واستخراج المعرفة والرؤى',
  },
  {
    id: 'cs',
    nameAr: 'الأمن السيبراني',
    nameEn: 'Cybersecurity',
    icon: '🛡️',
    gradient: 'from-red-500 to-rose-600',
    meshColor: 'rgba(244, 63, 94, 0.06)',
    description: 'حماية الأنظمة والشبكات من التهديدات الإلكترونية',
  },
  {
    id: 'auto',
    nameAr: 'أوتوترونكس',
    nameEn: 'Autotronics',
    icon: '🚗',
    gradient: 'from-amber-500 to-orange-600',
    meshColor: 'rgba(245, 158, 11, 0.06)',
    description: 'دمج الإلكترونيات مع أنظمة السيارات الحديثة',
  },
  {
    id: 'mech',
    nameAr: 'ميكاترونكس',
    nameEn: 'Mechatronics',
    icon: '⚙️',
    gradient: 'from-violet-500 to-purple-600',
    meshColor: 'rgba(139, 92, 246, 0.06)',
    description: 'دمج الهندسة الميكانيكية والإلكترونية والبرمجيات',
  },
  {
    id: 'iac',
    nameAr: 'التحكم في الآليات الصناعية',
    nameEn: 'Industrial Automation Control',
    icon: '🏭',
    gradient: 'from-cyan-500 to-blue-600',
    meshColor: 'rgba(6, 182, 212, 0.06)',
    description: 'أتمتة العمليات الصناعية وأنظمة التحكم',
  },
  {
    id: 'rgt',
    nameAr: 'تكنولوجيا الملابس الجاهزة',
    nameEn: 'Garment Technology',
    icon: '👔',
    gradient: 'from-pink-500 to-fuchsia-600',
    meshColor: 'rgba(236, 72, 153, 0.06)',
    description: 'تكنولوجيا تصنيع وتصميم الملابس الجاهزة',
  },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function DepartmentsPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-gray-100" dir="rtl">
{/* ===== Hero Section ===== */}
      <section className="relative overflow-hidden pt-32 pb-20">
        {/* Background mesh */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-teal-500/[0.07] blur-[120px]" />
          <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-violet-500/[0.05] blur-[120px]" />
        </div>

        {/* Dot grid overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'radial-gradient(rgba(255,255,255,0.3) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        <div className="relative mx-auto max-w-4xl px-4 text-center">
          {/* Badge */}
          <div
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-5 py-2 backdrop-blur-sm"
            style={{ animationDelay: '0ms' }}
          >
            <Sparkles className="h-4 w-4 text-teal-400" />
            <span className="text-sm font-medium text-gray-400">
              HITU Departments
            </span>
          </div>

          {/* Title */}
          <h1
            className="animate-fade-in-up text-4xl sm:text-5xl md:text-6xl font-black leading-tight mb-5"
          >
            <span className="bg-gradient-to-l from-teal-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              الأقسام العلمية
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className="animate-fade-in-up text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
            style={{ animationDelay: '150ms' }}
          >
            اكتشف <span className="text-teal-400 font-bold">7 أقسام</span>{' '}
            تكنولوجية متقدمة تجمع بين النظرية والتطبيق العملي
          </p>
        </div>
      </section>

      {/* ===== Departments Grid ===== */}
      <section className="relative py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section label */}
          <div className="mb-14 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              اختر{' '}
              <span className="bg-gradient-to-l from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                قسمك
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              كل قسم يقدم برنامجاً أكاديمياً متميزاً يواكب متطلبات سوق العمل
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {departments.map((dept, index) => (
              <Link
                key={dept.id}
                href={`/departments/${dept.id}`}
                className="group relative h-72 rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-7 overflow-hidden transition-all duration-500 hover:-translate-y-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                {/* Top highlight line — visible on hover */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Gradient mesh background on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-2xl"
                  style={{
                    background: `radial-gradient(ellipse at 30% 20%, ${dept.meshColor}, transparent 60%), radial-gradient(ellipse at 80% 80%, ${dept.meshColor}, transparent 60%)`,
                  }}
                />

                {/* Hover border glow */}
                <div className={`absolute inset-0 rounded-2xl border border-transparent group-hover:border-white/[0.12] transition-colors duration-500`} />

                {/* Icon */}
                <div className="relative mb-5">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${dept.gradient} text-2xl shadow-lg transition-transform duration-500 group-hover:scale-110`}
                  >
                    {dept.icon}
                  </div>
                </div>

                {/* Content */}
                <div className="relative flex flex-col flex-1">
                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-teal-300 transition-colors duration-300">
                    {dept.nameAr}
                  </h3>
                  <p className="text-sm font-medium text-teal-500/70 mb-3">
                    {dept.nameEn}
                  </p>

                  {/* Description — fades in on hover */}
                  <p className="text-sm text-gray-500 leading-relaxed opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                    {dept.description}
                  </p>

                  {/* CTA arrow */}
                  <div className="absolute bottom-0 left-0 flex items-center gap-2 text-sm font-semibold text-teal-400 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 delay-100">
                    <span>استكشف</span>
                    <ArrowLeft className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA Section ===== */}
      <section className="relative py-20 overflow-hidden">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[600px] rounded-full bg-teal-500/[0.04] blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-3xl px-4 text-center">
          {/* Glass card */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-10 sm:p-14">
            <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-blue-600 text-2xl">
              🎓
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              ابدأ رحلتك الأكاديمية اليوم
            </h3>
            <p className="text-gray-400 text-lg mb-8 max-w-lg mx-auto leading-relaxed">
              اكتشف القسم الذي يناسب شغفك وطموحاتك المهنية في واحدة من أحدث
              الجامعات التكنولوجية في مصر
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-teal-500 to-cyan-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/30 hover:-translate-y-0.5 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
              >
                <span>العودة للرئيسية</span>
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.05] px-6 py-3 text-sm font-semibold text-gray-300 hover:bg-white/[0.08] hover:text-white transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
              >
                تعرف على الجامعة
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="border-t border-white/[0.06] bg-[#050505] py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-blue-600 text-white font-bold text-sm">
                H
              </div>
              <div>
                <span className="font-bold text-white text-sm">HITU</span>
                <p className="text-xs text-gray-500 -mt-0.5">
                  جامعة حلوان التكنولوجية الدولية
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} جامعة حلوان التكنولوجية الدولية. جميع
              الحقوق محفوظة.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
