'use client';

import { motion } from "framer-motion";
import { useState } from "react";

type EventType = 'study' | 'exam' | 'holiday' | 'national';

interface CalendarEvent {
  id: number;
  title: string;
  date: string;
  dateRange?: string;
  month: string;
  type: EventType;
  description: string;
  icon: string;
}

const typeConfig: Record<EventType, { label: string; color: string; bgColor: string; dotColor: string; borderColor: string }> = {
  study: {
    label: 'دراسة',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    dotColor: 'from-blue-400 to-blue-600',
    borderColor: 'border-blue-500/30',
  },
  exam: {
    label: 'امتحانات',
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    dotColor: 'from-red-400 to-red-600',
    borderColor: 'border-red-500/30',
  },
  holiday: {
    label: 'إجازات',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    dotColor: 'from-emerald-400 to-emerald-600',
    borderColor: 'border-emerald-500/30',
  },
  national: {
    label: 'أعياد',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    dotColor: 'from-amber-400 to-amber-600',
    borderColor: 'border-amber-500/30',
  },
};

const calendarEvents: CalendarEvent[] = [
  {
    id: 1,
    title: 'بداية الدراسة',
    date: '28 سبتمبر 2024',
    month: 'سبتمبر',
    type: 'study',
    description: 'بداية العام الدراسي الجديد 2024/2025 واستقبال الطلاب الجدد',
    icon: '🎓',
  },
  {
    id: 2,
    title: 'عيد القوات المسلحة',
    date: '6 أكتوبر 2024',
    month: 'أكتوبر',
    type: 'national',
    description: 'إجازة رسمية بمناسبة ذكرى انتصارات أكتوبر المجيدة',
    icon: '🇪🇬',
  },
  {
    id: 3,
    title: 'انتهاء فترة التسجيل',
    date: '15 أكتوبر 2024',
    month: 'أكتوبر',
    type: 'study',
    description: 'آخر موعد لتسجيل المقررات وسحب الإضافة',
    icon: '📝',
  },
  {
    id: 4,
    title: 'امتحانات منتصف الفصل',
    date: '16 - 28 نوفمبر 2024',
    month: 'نوفمبر',
    type: 'exam',
    description: 'فترة امتحانات الميدترم للفصل الدراسي الأول',
    icon: '📋',
  },
  {
    id: 5,
    title: 'عيد الفطر المبارك',
    date: 'مارس / أبريل 2025',
    month: 'ديسمبر',
    type: 'national',
    description: 'إجازة عيد الفطر المبارك - كل عام وأنتم بخير',
    icon: '🌙',
  },
  {
    id: 6,
    title: 'عيد الميلاد المجيد',
    date: '7 يناير 2025',
    month: 'يناير',
    type: 'national',
    description: 'إجازة رسمية بمناسبة عيد الميلاد المجيد',
    icon: '⛪',
  },
  {
    id: 7,
    title: 'امتحانات نصف العام',
    date: '4 - 16 يناير 2025',
    dateRange: '4 يناير - 16 يناير',
    month: 'يناير',
    type: 'exam',
    description: 'فترة امتحانات الفصل الدراسي الأول - نهاية الترم الأول',
    icon: '📝',
  },
  {
    id: 8,
    title: 'ثورة 25 يناير',
    date: '25 يناير 2025',
    month: 'يناير',
    type: 'national',
    description: 'إجازة رسمية بمناسبة ذكرى ثورة 25 يناير',
    icon: '✊',
  },
  {
    id: 9,
    title: 'إجازة نصف العام',
    date: '25 يناير - 8 فبراير 2025',
    dateRange: '25 يناير - 8 فبراير',
    month: 'فبراير',
    type: 'holiday',
    description: 'إجازة منتصف العام الدراسي - استراحة بين الفصلين',
    icon: '🏖️',
  },
  {
    id: 10,
    title: 'بداية الفصل الدراسي الثاني',
    date: '9 فبراير 2025',
    month: 'فبراير',
    type: 'study',
    description: 'استئناف الدراسة للفصل الدراسي الثاني',
    icon: '📚',
  },
  {
    id: 11,
    title: 'امتحانات منتصف الفصل الثاني',
    date: '22 مارس - 3 أبريل 2025',
    month: 'مارس',
    type: 'exam',
    description: 'فترة امتحانات الميدترم للفصل الدراسي الثاني',
    icon: '📋',
  },
  {
    id: 12,
    title: 'عيد الأضحى المبارك',
    date: 'يونيو 2025',
    month: 'أبريل',
    type: 'national',
    description: 'إجازة عيد الأضحى المبارك - كل عام وأنتم بخير',
    icon: '🐑',
  },
  {
    id: 13,
    title: 'امتحانات آخر العام',
    date: '17 مايو - 5 يونيو 2025',
    dateRange: '17 مايو - 5 يونيو',
    month: 'مايو',
    type: 'exam',
    description: 'فترة امتحانات نهاية العام الدراسي - الفصل الدراسي الثاني',
    icon: '✍️',
  },
  {
    id: 14,
    title: 'إجازة الصيف',
    date: '7 يونيو 2025',
    month: 'يونيو',
    type: 'holiday',
    description: 'بداية الإجازة الصيفية - نهاية العام الدراسي 2024/2025',
    icon: '☀️',
  },
];

const stats = [
  { label: 'أسابيع الدراسة', value: '30', icon: '📖' },
  { label: 'أسابيع الامتحانات', value: '6', icon: '📝' },
  { label: 'أسابيع الإجازات', value: '14', icon: '🌴' },
  { label: 'الأعياد الرسمية', value: '5', icon: '🎉' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export default function CalendarPage() {
  const [activeFilter, setActiveFilter] = useState<EventType | 'all'>('all');

  const filteredEvents = activeFilter === 'all'
    ? calendarEvents
    : calendarEvents.filter(e => e.type === activeFilter);

  return (
    <div className="min-h-screen bg-[#050505]">
{/* Hero Section */}
      <section className="relative pt-20 pb-12 px-4 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-[#14b8a6]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#3b82f6]/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-[#14b8a6]/10 border border-[#14b8a6]/20 rounded-full px-5 py-2 mb-6"
          >
            <span className="text-2xl">📅</span>
            <span className="text-[#2dd4bf] text-sm font-medium">العام الدراسي 2024/2025</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            التقويم{' '}
            <span className="bg-gradient-to-r from-[#14b8a6] to-[#3b82f6] bg-clip-text text-transparent">الأكاديمي</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto"
          >
            تابع جميع المواعيد والأحداث المهمة خلال العام الدراسي
          </motion.p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="max-w-5xl mx-auto px-4 mb-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-5 text-center hover:bg-white/[0.06] hover:border-[#14b8a6]/30 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Legend / Filter */}
      <section className="max-w-5xl mx-auto px-4 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-3"
        >
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14b8a6] ${
              activeFilter === 'all'
                ? 'bg-white/[0.12] text-white border border-white/[0.2]'
                : 'bg-white/[0.03] text-gray-400 border border-white/[0.08] hover:bg-white/[0.06]'
            }`}
          >
            🗓️ الكل
          </button>
          {(Object.entries(typeConfig) as [EventType, typeof typeConfig.study][]).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14b8a6] ${
                activeFilter === key
                  ? `${config.bgColor} ${config.color} ${config.borderColor} border`
                  : 'bg-white/[0.03] text-gray-400 border border-white/[0.08] hover:bg-white/[0.06]'
              }`}
            >
              <span className={`w-3 h-3 rounded-full bg-gradient-to-br ${config.dotColor}`} />
              {config.label}
            </button>
          ))}
        </motion.div>
      </section>

      {/* Timeline */}
      <section className="max-w-4xl mx-auto px-4 pb-24">
        <div className="relative">
          {/* Timeline center line */}
          <div className="absolute top-0 bottom-0 right-1/2 md:right-1/2 w-0.5 bg-gradient-to-b from-[#14b8a6]/50 via-[#3b82f6]/50 to-[#14b8a6]/50 transform translate-x-1/2 hidden md:block" />
          <div className="absolute top-0 bottom-0 right-8 w-0.5 bg-gradient-to-b from-[#14b8a6]/50 via-[#3b82f6]/50 to-[#14b8a6]/50 md:hidden" />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="space-y-8 md:space-y-12"
          >
            {filteredEvents.map((event, index) => {
              const config = typeConfig[event.type];
              const isLeft = index % 2 === 0;

              return (
                <motion.div
                  key={event.id}
                  variants={itemVariants}
                  className="relative"
                >
                  {/* Desktop layout - alternating sides */}
                  <div className="hidden md:grid md:grid-cols-2 md:gap-8 items-center">
                    {/* Left content */}
                    <div className={`${isLeft ? '' : 'order-2'}`}>
                      {isLeft && (
                        <div className={`bg-white/[0.03] backdrop-blur-xl border ${config.borderColor} rounded-2xl p-6 hover:bg-white/[0.06] hover:-translate-y-1 transition-all duration-300 group cursor-default`}>
                          <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 rounded-xl ${config.bgColor} flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform`}>
                              {event.icon}
                            </div>
                            <div className="flex-1">
                              <div className={`inline-block px-3 py-1 rounded-lg text-xs font-medium ${config.bgColor} ${config.color} mb-2`}>
                                {config.label}
                              </div>
                              <h3 className="text-lg font-bold text-white mb-1">{event.title}</h3>
                              <p className="text-sm text-gray-400 mb-3">{event.description}</p>
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <span>📆</span>
                                <span>{event.date}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Timeline dot */}
                    <div className="absolute right-1/2 top-1/2 transform translate-x-1/2 -translate-y-1/2 z-10">
                      <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${config.dotColor} shadow-lg ring-4 ring-[#050505]`} />
                      <div className={`absolute inset-0 w-5 h-5 rounded-full bg-gradient-to-br ${config.dotColor} animate-ping opacity-20`} />
                    </div>

                    {/* Right content */}
                    <div className={`${isLeft ? 'order-2' : ''}`}>
                      {!isLeft && (
                        <div className={`bg-white/[0.03] backdrop-blur-xl border ${config.borderColor} rounded-2xl p-6 hover:bg-white/[0.06] hover:-translate-y-1 transition-all duration-300 group cursor-default`}>
                          <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 rounded-xl ${config.bgColor} flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform`}>
                              {event.icon}
                            </div>
                            <div className="flex-1">
                              <div className={`inline-block px-3 py-1 rounded-lg text-xs font-medium ${config.bgColor} ${config.color} mb-2`}>
                                {config.label}
                              </div>
                              <h3 className="text-lg font-bold text-white mb-1">{event.title}</h3>
                              <p className="text-sm text-gray-400 mb-3">{event.description}</p>
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <span>📆</span>
                                <span>{event.date}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Mobile layout */}
                  <div className="md:hidden flex gap-6 items-start">
                    {/* Timeline dot */}
                    <div className="relative shrink-0 mt-2">
                      <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${config.dotColor} shadow-lg ring-4 ring-[#050505] relative z-10`} />
                    </div>

                    {/* Card */}
                    <div className={`flex-1 bg-white/[0.03] backdrop-blur-xl border ${config.borderColor} rounded-2xl p-5 hover:bg-white/[0.06] hover:-translate-y-1 transition-all duration-300`}>
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-xl ${config.bgColor} flex items-center justify-center text-xl shrink-0`}>
                          {event.icon}
                        </div>
                        <div className="flex-1">
                          <div className={`inline-block px-2.5 py-0.5 rounded-lg text-xs font-medium ${config.bgColor} ${config.color} mb-2`}>
                            {config.label}
                          </div>
                          <h3 className="text-base font-bold text-white mb-1">{event.title}</h3>
                          <p className="text-sm text-gray-400 mb-2">{event.description}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>📆</span>
                            <span>{event.date}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* End marker */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="flex justify-center mt-16"
        >
          <div className="bg-gradient-to-br from-[#14b8a6]/20 to-[#3b82f6]/20 backdrop-blur-xl border border-white/[0.08] rounded-2xl px-8 py-5 text-center">
            <div className="text-3xl mb-2">🎉</div>
            <p className="text-white font-semibold">نهاية العام الدراسي 2024/2025</p>
            <p className="text-gray-400 text-sm mt-1">نتمنى لكم عامًا دراسيًا موفقًا</p>
          </div>
        </motion.div>
      </section>

      {/* Footer spacer */}
      <div className="h-12" />
    </div>
  );
}
