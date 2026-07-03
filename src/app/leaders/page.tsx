'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Sparkles } from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const universityLeaders = [
  {
    name: 'د. السيد قنديل',
    role: 'رئيس جامعة حلوان',
    image: '/images/leaders/qandil.jpg',
    initials: 'س.ق',
    details: 'فنان تشكيلي وأكاديمي، يشغل منصب رئيس جامعة حلوان منذ عام 2022. حاصل على درجة الدكتوراه في الفنون الجميلة تخصص الجرافيك. حاصل على جائزة الدولة التشجيعية في الفنون.',
  },
  {
    name: 'د. حسام الرفاعي',
    role: 'نائب رئيس الجامعة لشئون التعليم والطلاب',
    image: '/images/leaders/hossam.jpg',
    initials: 'ح.ر',
    details: 'أستاذ بقسم الإرشاد السياحي وعميد كلية السياحة والفنادق سابقاً. منسق لبرامج ماجستير دولية مشتركة مع جامعات ألمانية.',
  },
  {
    name: 'د. أسامة القبيصي',
    role: 'عميد الكلية التكنولوجية بالقاهرة',
    image: '/images/leaders/Osama.jpg',
    initials: 'أ.ق',
    details: 'خبير في تاريخ النسيج المصري، يقود جهوداً لإحياء وتطوير حرفة النسيج اليدوي في مدينة أخميم.',
  },
  {
    name: 'د. أمير',
    role: 'وكيل الكلية التكنولوجية بالقاهرة',
    image: '',
    initials: 'أ.م',
  },
  {
    name: 'أ. أحمد صلاح',
    role: 'المشرف العام على الكلية',
    image: '',
    initials: 'أ.ص',
  },
];

const studentUnion = [
  {
    name: 'محمد عمرو',
    role: 'رئيس اتحاد الطلاب',
    image: '/images/leaders/Moamr.jpg',
    details: 'رابعة ذكاء اصطناعي • شاعر',
    phone: '+201116076731',
  },
  {
    name: 'محمود خلف',
    role: 'نائب رئيس الاتحاد',
    image: '/images/leaders/khalaf.jpg',
    details: 'تالتة ذكاء اصطناعي',
    phone: '+201129464914',
  },
];

const committees = [
  {
    name: 'اللجنة العلمية',
    president: { name: 'محمد عبد العزيز', image: '', details: 'رابعة ذكاء اصطناعي' },
    vp: { name: 'نديم بدر', image: '/images/leaders/Nadeem.jpg', details: 'تالتة ذكاء اصطناعي' },
  },
  {
    name: 'اللجنة الفنية',
    president: { name: 'هاجر أسامة', image: '', details: 'تانية أمن سيبراني' },
    vp: { name: 'يوسف هشام وليم', image: '/images/leaders/hesham.jpg', details: 'تالتة ذكاء اصطناعي' },
  },
  {
    name: 'اللجنة الثقافية',
    president: { name: 'إبراهيم هشام', image: '/images/leaders/ebrahim.jpg', details: 'تالتة أمن سيبراني' },
    vp: { name: 'محمد جميل', image: '/images/leaders/gamel.jpg', details: 'تالتة ذكاء اصطناعي' },
  },
  {
    name: 'اللجنة الرياضية',
    president: { name: 'محمد عاشور حلمي', image: '', details: 'تالتة أمن سيبراني' },
    vp: { name: 'منى', image: '', details: 'تالتة ميكاترونكس' },
  },
  {
    name: 'لجنة الكشافة',
    president: { name: 'مهند', image: '', details: '' },
    vp: { name: 'محمد شعبان', image: '', details: 'رابعة ذكاء اصطناعي' },
  },
  {
    name: 'لجنة الأسر',
    president: { name: 'عمر خالد', image: '', details: 'رابعة أوتوترونكس' },
    vp: { name: 'حسن سعيد', image: '/images/leaders/hassan.jpg', details: 'تالتة ذكاء اصطناعي' },
  },
  {
    name: 'اللجنة الاجتماعية',
    president: { name: 'يوسف يوسف', image: '', details: '' },
    vp: { name: 'عمر فوزي', image: '', details: 'تانية ميكاترونكس' },
  },
];

const departmentReps = [
  {
    name: 'الذكاء الاصطناعي', icon: '🤖',
    reps: [
      { year: 'رابعة', name: 'زياد جمايكا', phone: '+201276044436' },
      { year: 'تالتة', name: 'نديم بدر', phone: '+201222977345' },
      { year: 'تانية', name: 'عاصم حاتم', phone: '+201204804966' },
    ],
  },
  {
    name: 'علوم البيانات', icon: '📊',
    reps: [
      { year: 'رابعة', name: 'عمر جدو (OGY)', phone: '+201098034093' },
      { year: 'تالتة', name: 'محمد هاني', phone: '+201155676429' },
      { year: 'تانية', name: 'نور عماد', phone: '+201207082127' },
    ],
  },
  {
    name: 'الأمن السيبراني', icon: '🔐',
    reps: [
      { year: 'رابعة', name: 'فكري', phone: '+201002113973' },
      { year: 'تالتة', name: 'أندرو ممدوح', phone: '+201200517894' },
      { year: 'تانية', name: 'يوسف حمدي', phone: '+201011233662' },
    ],
  },
  {
    name: 'أوتوترونكس', icon: '🚗',
    reps: [
      { year: 'رابعة', name: 'إسلام جمعة', phone: '+201011550294' },
      { year: 'تالتة', name: 'علي دوشة', phone: '+201272630822' },
      { year: 'تانية', name: 'إبراهيم محمد', phone: '+201149443778' },
    ],
  },
  {
    name: 'ميكاترونكس', icon: '⚙️',
    reps: [
      { year: 'رابعة', name: 'زياد سنوسي', phone: '+201122080023' },
      { year: 'تالتة', name: 'معاذ', phone: '+201029755003' },
      { year: 'تانية', name: 'جمال', phone: '+201003368870' },
    ],
  },
  {
    name: 'التحكم الصناعي', icon: '🏭',
    reps: [
      { year: 'رابعة', name: 'كيمو', phone: '+201500488618' },
      { year: 'تالتة', name: 'سيف', phone: '+201125755890' },
      { year: 'تانية', name: 'أحمد محمد', phone: '+201044524426' },
    ],
  },
  {
    name: 'تكنولوجيا الملابس', icon: '👔',
    reps: [
      { year: 'رابعة', name: 'عبدالحميد محمد', phone: '+201010051665' },
      { year: 'تالتة', name: 'محمود محمد', phone: '+201113323781' },
      { year: 'تانية', name: 'رحمة', phone: '+201129246663' },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Helper: Avatar with gradient ring                                  */
/* ------------------------------------------------------------------ */

function AvatarRing({
  src,
  alt,
  initials,
  size = 'lg',
}: {
  src?: string;
  alt: string;
  initials?: string;
  size?: 'lg' | 'sm';
}) {
  const dims = size === 'lg' ? 'w-36 h-36 sm:w-44 sm:h-44' : 'w-14 h-14';
  const textSize = size === 'lg' ? 'text-4xl sm:text-5xl' : 'text-lg';
  const ringPad = size === 'lg' ? '-inset-[3px]' : '-inset-[2px]';

  return (
    <div className="relative inline-block">
      {/* Gradient ring */}
      <div
        className={`absolute ${ringPad} rounded-full bg-gradient-to-br from-teal-500 to-blue-600`}
      />
      {src ? (
        <Image
          src={src}
          alt={alt}
          width={size === 'lg' ? 200 : 60}
          height={size === 'lg' ? 200 : 60}
          className={`relative ${dims} rounded-full object-cover border-2 border-[#111111]`}
        />
      ) : (
        <div
          className={`relative ${dims} rounded-full bg-[#111111] flex items-center justify-center border-2 border-[#111111]`}
        >
          <span className={`${textSize} font-bold text-gray-300`}>
            {initials || alt.charAt(0)}
          </span>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section Heading                                                    */
/* ------------------------------------------------------------------ */

function SectionHeading({
  emoji,
  title,
  subtitle,
}: {
  emoji: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="text-center mb-14">
      <h2 className="text-3xl sm:text-4xl font-bold text-white animate-fade-in-up">
        <span className="ml-2">{emoji}</span>
        <span className="bg-gradient-to-l from-teal-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
          {title}
        </span>
      </h2>
      <p className="mt-3 text-gray-400">{subtitle}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function LeadersPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-gray-100 overflow-hidden" dir="rtl">
{/* ── Hero ───────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background mesh */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 right-1/4 h-[400px] w-[400px] rounded-full bg-teal-500/[0.07] blur-[120px]" />
          <div className="absolute bottom-0 left-1/4 h-[350px] w-[350px] rounded-full bg-violet-500/[0.05] blur-[120px]" />
        </div>

        {/* Dot grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'radial-gradient(rgba(255,255,255,0.3) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-5 py-2 backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-teal-400" />
            <span className="text-sm font-medium text-gray-400">
              University Leadership
            </span>
          </div>

          <h1 className="animate-fade-in-up text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-5">
            <span className="bg-gradient-to-l from-teal-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              قيادات الجامعة
            </span>
          </h1>
          <p
            className="animate-fade-in-up text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
            style={{ animationDelay: '150ms' }}
          >
            رؤية حكيمة نحو مستقبل تعليمي مشرق
          </p>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-teal-500/30 to-transparent" />

      {/* ── University Leadership ──────────────────────────────── */}
      <section className="py-20 relative">
        <div className="pointer-events-none absolute top-0 left-10 w-64 h-64 bg-teal-500/[0.04] rounded-full blur-[100px]" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionHeading
            emoji="🏛️"
            title="إدارة الجامعة"
            subtitle="القيادات الأكاديمية لجامعة حلوان التكنولوجية الدولية"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {universityLeaders.map((leader, i) => (
              <div
                key={leader.name}
                className="group rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-8 text-center transition-all duration-500 hover:border-teal-500/30 animate-fade-in-up"
                style={{ animationDelay: `${i * 120}ms` }}
              >
                <div className="flex flex-col items-center gap-5">
                  <AvatarRing
                    src={leader.image || undefined}
                    alt={leader.name}
                    initials={leader.initials}
                    size="lg"
                  />
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-teal-300 transition-colors duration-300">
                      {leader.name}
                    </h3>
                    <p className="mt-1 text-gray-400 font-semibold text-base sm:text-lg">
                      {leader.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />

      {/* ── Student Union ──────────────────────────────────────── */}
      <section className="py-20 relative">
        <div className="pointer-events-none absolute bottom-0 right-10 w-80 h-80 bg-violet-500/[0.04] rounded-full blur-[120px]" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionHeading
            emoji="🎓"
            title="اتحاد الطلاب"
            subtitle="قيادات اتحاد طلاب الجامعة"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {studentUnion.map((member, i) => (
              <div
                key={member.name}
                className="group rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-8 text-center transition-all duration-500 hover:border-teal-500/30 animate-fade-in-up"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className="flex flex-col items-center gap-5">
                  <AvatarRing
                    src={member.image}
                    alt={member.name}
                    size="lg"
                  />
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-teal-300 transition-colors duration-300">
                      {member.name}
                    </h3>
                    <p className="mt-1 text-gray-400 font-semibold text-base sm:text-lg">
                      {member.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-teal-500/20 to-transparent" />

      {/* ── Committees ─────────────────────────────────────────── */}
      <section className="py-20 relative">
        <div className="pointer-events-none absolute top-1/3 left-1/4 w-72 h-72 bg-teal-500/[0.04] rounded-full blur-[120px]" />
        <div className="pointer-events-none absolute bottom-1/4 right-1/3 w-64 h-64 bg-cyan-500/[0.03] rounded-full blur-[100px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionHeading
            emoji="⭐"
            title="اللجان"
            subtitle="لجان اتحاد الطلاب ورؤساء ونواب اللجان"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {committees.map((committee, i) => (
              <div
                key={committee.name}
                className="group rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl overflow-hidden transition-all duration-500 hover:border-teal-500/20 animate-fade-in-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {/* Committee header */}
                <div className="bg-gradient-to-r from-teal-600/20 to-blue-600/20 px-6 py-4 border-b border-white/[0.06]">
                  <h3 className="text-base font-bold text-white text-center">
                    {committee.name}
                  </h3>
                </div>

                <div className="p-6 space-y-5">
                  {/* President */}
                  <div className="flex items-center gap-4">
                    <AvatarRing
                      src={committee.president.image}
                      alt={committee.president.name}
                      size="sm"
                    />
                    <div>
                      <p className="text-xs text-teal-400 font-semibold mb-0.5">
                        رئيس اللجنة
                      </p>
                      <p className="text-sm font-bold text-white">
                        {committee.president.name}
                      </p>
                    </div>
                  </div>

                  {/* VP */}
                  <div className="flex items-center gap-4">
                    <AvatarRing
                      src={committee.vp.image}
                      alt={committee.vp.name}
                      size="sm"
                    />
                    <div>
                      <p className="text-xs text-cyan-400 font-semibold mb-0.5">
                        نائب رئيس اللجنة
                      </p>
                      <p className="text-sm font-bold text-white">
                        {committee.vp.name}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-teal-500/20 to-transparent" />

      {/* ── Department Representatives ─────────────────────────── */}
      <section className="py-20 relative">
        <div className="pointer-events-none absolute top-10 right-1/4 w-60 h-60 bg-violet-500/[0.04] rounded-full blur-[100px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionHeading
            emoji="🏫"
            title="ممثلين الأقسام"
            subtitle="ممثلين الفرق الدراسية في كل قسم"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {departmentReps.map((dept, i) => (
              <div
                key={dept.name}
                className="group rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-6 transition-all duration-500 hover:border-teal-500/20 animate-fade-in-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="text-center">
                  <div className="text-4xl mb-3">{dept.icon}</div>
                  <h3 className="text-base font-bold text-white mb-4 group-hover:text-teal-300 transition-colors duration-300">
                    {dept.name}
                  </h3>

                  <div className="space-y-3 text-sm">
                    {dept.reps.map((rep) => (
                      <div key={rep.year} className="rounded-xl bg-white/[0.03] border border-white/[0.05] px-4 py-3">
                        <p className="text-gray-500 text-xs mb-1">
                          ممثل الفرقة ال{rep.year}
                        </p>
                        <p className="text-white font-medium text-sm">{rep.name}</p>
                        <a
                          href={`tel:${rep.phone}`}
                          className="text-teal-400 text-xs hover:text-teal-300 transition-colors"
                          dir="ltr"
                        >
                          {rep.phone}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
