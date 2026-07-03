"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Bot,
  Menu,
  X,
  ChevronDown,
  ArrowLeft,
  Sparkles,
  BookOpen,
  Users,
  Rocket,
  Building2,
} from "lucide-react";

// ==========================================
// Data
// ==========================================
const departments = [
  { id: "ai", nameAr: "الذكاء الاصطناعي", nameEn: "Artificial Intelligence", icon: "🤖", color: "from-blue-500 to-indigo-600", description: "تطوير أنظمة ذكية قادرة على التعلم واتخاذ القرارات" },
  { id: "ds", nameAr: "علوم البيانات", nameEn: "Data Science", icon: "📊", color: "from-emerald-500 to-teal-600", description: "تحليل البيانات الضخمة واستخراج المعرفة والرؤى" },
  { id: "cs", nameAr: "الأمن السيبراني", nameEn: "Cybersecurity", icon: "🛡️", color: "from-red-500 to-rose-600", description: "حماية الأنظمة والشبكات من التهديدات الإلكترونية" },
  { id: "auto", nameAr: "أوتوترونكس", nameEn: "Autotronics", icon: "🚗", color: "from-amber-500 to-orange-600", description: "دمج الإلكترونيات مع أنظمة السيارات الحديثة" },
  { id: "mech", nameAr: "ميكاترونكس", nameEn: "Mechatronics", icon: "⚙️", color: "from-violet-500 to-purple-600", description: "دمج الهندسة الميكانيكية والإلكترونية والبرمجيات" },
  { id: "iac", nameAr: "التحكم في الآليات الصناعية", nameEn: "Industrial Automation Control", icon: "🏭", color: "from-cyan-500 to-blue-600", description: "أتمتة العمليات الصناعية وأنظمة التحكم" },
  { id: "rgt", nameAr: "تكنولوجيا الملابس الجاهزة", nameEn: "Garment Technology", icon: "👔", color: "from-pink-500 to-fuchsia-600", description: "تكنولوجيا تصنيع وتصميم الملابس الجاهزة" },
];

const stats = [
  { label: "قسم علمي", value: "7", icon: "📚" },
  { label: "طالب وطالبة", value: "+2000", icon: "🎓" },
  { label: "عضو هيئة تدريس", value: "+50", icon: "👨‍🏫" },
  { label: "مشروع تخرج", value: "+100", icon: "🚀" },
];

const features = [
  { title: "المساعد الذكي", description: "شات بوت مدعوم بالذكاء الاصطناعي يجاوب على كل أسئلتك", icon: "🤖", href: "/chatbot" },
  { title: "الجداول الذكية", description: "نظام توليد جداول ذكي يراعي كل القيود والتفضيلات", icon: "📅", href: "/timetable" },
  { title: "القيادات الجامعية", description: "تعرف على قيادات الجامعة واتحاد الطلاب والليدرز", icon: "👔", href: "/leaders" },
  { title: "النتائج والترتيب", description: "اطلع على نتائجك وترتيب الطلاب الأوائل", icon: "🏆", href: "/rankings" },
  { title: "المكتبة الرقمية", description: "محاضرات وملفات ومواد تعليمية لكل الأقسام", icon: "📖", href: "/library" },
  { title: "التقويم الأكاديمي", description: "مواعيد الامتحانات والإجازات والأحداث المهمة", icon: "📆", href: "/calendar" },
];

// ==========================================
// Stat Icon Mapping
// ==========================================
const statIconMap: Record<string, React.ReactNode> = {
  "📚": <BookOpen className="w-5 h-5" />,
  "🎓": <GraduationCap className="w-5 h-5" />,
  "👨‍🏫": <Users className="w-5 h-5" />,
  "🚀": <Rocket className="w-5 h-5" />,
};

// ==========================================
// Sections
// ==========================================

function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050505]"
    >
      {/* Mesh gradient background */}
      <div className="absolute inset-0">
        {/* Primary radial glow — top center */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] opacity-40"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(20,184,166,0.18) 0%, rgba(59,130,246,0.08) 40%, transparent 70%)",
          }}
        />
        {/* Secondary glow — bottom right */}
        <div
          className="absolute -bottom-32 -end-32 w-[500px] h-[500px] rounded-full opacity-20 animate-float"
          style={{
            background:
              "radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%)",
          }}
        />
        {/* Tertiary glow — left */}
        <div
          className="absolute top-1/3 -start-20 w-[400px] h-[400px] rounded-full opacity-15 animate-float"
          style={{
            background:
              "radial-gradient(circle, rgba(45,212,191,0.2) 0%, transparent 70%)",
            animationDelay: "3s",
          }}
        />
        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-16">
        {/* Live badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] backdrop-blur-md border border-white/[0.08] text-gray-400 text-sm mb-8 animate-fade-in">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500" />
          </span>
          المنصة الرقمية الرسمية
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white mb-6 animate-slide-up leading-[1.2]">
          جامعة حلوان
          <br />
          <span className="text-gradient-brand">التكنولوجية الدولية</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-12 animate-slide-up delay-200 leading-relaxed">
          منصة رقمية متكاملة تجمع بين الذكاء الاصطناعي والتعليم التكنولوجي —
          اكتشف أقسامنا، تصفح الجداول الذكية، وتحدث مع المساعد الذكي
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up delay-300">
          <a
            href="#departments"
            className="group w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-teal-600 to-teal-500 text-white font-bold text-lg shadow-2xl shadow-teal-600/20 hover:shadow-teal-500/40 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
          >
            <GraduationCap className="w-5 h-5 group-hover:scale-110 transition-transform" />
            استكشف الأقسام
          </a>
          <Link
            href="/chatbot"
            className="group w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/[0.1] text-white font-bold text-lg hover:bg-white/[0.08] hover:border-white/[0.15] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          >
            <Bot className="w-5 h-5 group-hover:scale-110 transition-transform" />
            جرّب المساعد الذكي
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-6 h-6 text-gray-600" />
      </div>
    </section>
  );
}

function StatsSection() {
  return (
    <section className="relative py-20 bg-[#050505]">
      {/* Top divider line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-teal-500/30 to-transparent" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, idx) => (
            <div
              key={stat.label}
              className="group relative p-6 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] text-center hover:-translate-y-1 hover:border-teal-500/30 hover:bg-white/[0.05] transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {/* Icon circle */}
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-teal-500/10 text-teal-400 mb-4 group-hover:bg-teal-500/15 transition-colors">
                {statIconMap[stat.icon] || (
                  <span className="text-xl">{stat.icon}</span>
                )}
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white mb-1 tracking-tight">
                {stat.value}
              </div>
              <div className="text-sm text-gray-500 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DepartmentsSection() {
  return (
    <section id="departments" className="relative py-24 bg-[#050505]">
      {/* Subtle background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] opacity-15 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(20,184,166,0.12) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-sm font-semibold mb-5">
            <Building2 className="w-4 h-4" />
            الأقسام العلمية
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">
            7 أقسام{" "}
            <span className="text-gradient-brand">تكنولوجية متقدمة</span>
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            اكتشف التخصصات المتاحة وابدأ رحلتك في عالم التكنولوجيا
          </p>
        </div>

        {/* Department cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {departments.map((dept, idx) => (
            <Link
              key={dept.id}
              href={`/departments/${dept.id}`}
              className="group relative p-6 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] overflow-hidden hover:scale-[1.02] hover:border-white/[0.15] hover:bg-white/[0.05] transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              {/* Gradient overlay on hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${dept.color} opacity-0 group-hover:opacity-[0.06] transition-opacity duration-500`}
              />

              {/* Icon */}
              <div
                className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${dept.color} flex items-center justify-center text-2xl shadow-lg mb-4 group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}
              >
                {dept.icon}
              </div>

              {/* Content */}
              <h3 className="relative text-lg font-bold text-white mb-1 group-hover:text-teal-300 transition-colors duration-200">
                {dept.nameAr}
              </h3>
              <p className="relative text-xs text-teal-500/70 font-medium mb-3 tracking-wide">
                {dept.nameEn}
              </p>
              <p className="relative text-sm text-gray-500 leading-relaxed">
                {dept.description}
              </p>

              {/* Arrow */}
              <div className="relative mt-4 flex items-center gap-2 text-teal-400 text-sm font-medium opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                اعرف أكتر
                <ArrowLeft className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 bg-[#050505]">
      {/* Top divider */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-semibold mb-5">
            <Sparkles className="w-4 h-4" />
            خدمات المنصة
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">
            كل اللي{" "}
            <span className="text-gradient-ai">محتاجه في مكان واحد</span>
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            منصة ذكية ومتكاملة تقدملك كل الخدمات الجامعية بشكل عصري
          </p>
        </div>

        {/* Feature cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, idx) => (
            <Link
              key={feature.title}
              href={feature.href}
              className="group relative p-8 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] hover:-translate-y-1 hover:border-violet-500/25 hover:bg-white/[0.05] transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {/* Icon */}
              <div className="text-4xl mb-5 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-violet-300 transition-colors duration-200">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-gray-500 leading-relaxed mb-4">
                {feature.description}
              </p>

              {/* Arrow link */}
              <div className="flex items-center gap-2 text-violet-400 text-sm font-medium opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                اكتشف المزيد
                <ArrowLeft className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="relative py-24 overflow-hidden bg-[#050505]">
      {/* Full-width glass panel container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] overflow-hidden">
          {/* Inner mesh gradient */}
          <div
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at top center, rgba(20,184,166,0.15) 0%, rgba(139,92,246,0.08) 50%, transparent 80%)",
            }}
          />
          <div
            className="absolute -bottom-20 -start-20 w-[300px] h-[300px] rounded-full opacity-20 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(45,212,191,0.3) 0%, transparent 70%)",
            }}
          />

          {/* Content */}
          <div className="relative z-10 px-6 py-16 sm:px-12 sm:py-20 text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6">
              جاهز تبدأ رحلتك؟
            </h2>
            <p className="text-lg sm:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              سواء كنت طالب جديد أو حالي، المنصة دي هتسهّل عليك كل حاجة
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/chatbot"
                className="group w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-teal-600 to-teal-500 text-white font-bold text-lg shadow-2xl shadow-teal-600/20 hover:shadow-teal-500/40 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
              >
                <Bot className="w-5 h-5 group-hover:scale-110 transition-transform" />
                اسأل المساعد الذكي
              </Link>
              <Link
                href="/timetable"
                className="group w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/[0.1] text-white font-bold text-lg hover:bg-white/[0.08] hover:border-white/[0.15] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              >
                📅 الجداول الذكية
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ==========================================
// Main Page
// ==========================================
export default function HomePage() {
  return (
    <main className="bg-[#050505] min-h-screen">
<HeroSection />
      <StatsSection />
      <DepartmentsSection />
      <FeaturesSection />
      <CTASection />
</main>
  );
}
