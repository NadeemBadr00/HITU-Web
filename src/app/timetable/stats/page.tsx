'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar, CheckCircle, Award, Building2, Users, Clock,
  TrendingUp, Gauge, BarChart3, Layers, Sparkles,
} from 'lucide-react';
import {
  DEPARTMENTS, Department, DEPARTMENT_COLORS,
  SAMPLE_PROFESSORS, SAMPLE_ROOMS, SAMPLE_TIME_SLOTS, SAMPLE_GROUPS,
  generateSampleTimetable, type TimetableEntry,
} from '@/lib/timetable-types';

// ==========================================
// Helper: Compute Stats
// ==========================================
function computeStats(entries: TimetableEntry[]) {
  const totalLectures = entries.length;
  const hardViolations = 0; // Always 0 for demo
  const softScore = 94;

  // Room utilization
  const totalRoomSlots = SAMPLE_ROOMS.length * SAMPLE_TIME_SLOTS.length * 5; // 5 working days
  const roomUtilization = Math.round((totalLectures / totalRoomSlots) * 100);

  // Professor load: hours per professor
  const profLoad: Record<string, { name: string; dept: Department; scheduled: number; max: number }> = {};
  SAMPLE_PROFESSORS.forEach(p => {
    profLoad[p.id] = { name: p.name, dept: p.department, scheduled: 0, max: p.max_hours };
  });
  entries.forEach(e => {
    if (profLoad[e.professor.id]) {
      profLoad[e.professor.id].scheduled += e.course.lecture_hours;
    }
  });

  // Room utilization per room
  const roomLoad: Record<string, { name: string; type: string; scheduled: number; total: number }> = {};
  SAMPLE_ROOMS.forEach(r => {
    roomLoad[r.id] = { name: r.name, type: r.type, scheduled: 0, total: SAMPLE_TIME_SLOTS.length * 5 };
  });
  entries.forEach(e => {
    if (roomLoad[e.room.id]) {
      roomLoad[e.room.id].scheduled += 1;
    }
  });

  // Gap analysis per group
  const groupGaps: { label: string; dept: Department; lectures: number; gaps: number; score: number }[] = [];
  SAMPLE_GROUPS.forEach(g => {
    const groupEntries = entries.filter(e => e.group.id === g.id);
    const lectures = groupEntries.length;

    // Calculate gaps: for each day, sort slots and count gaps between consecutive lectures
    let gaps = 0;
    const days = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء'] as const;
    days.forEach(day => {
      const dayEntries = groupEntries.filter(e => e.day === day);
      if (dayEntries.length <= 1) return;
      const slotIndices = dayEntries.map(e => {
        const idx = SAMPLE_TIME_SLOTS.findIndex(s => s.id === e.slot_id);
        return idx;
      }).sort((a, b) => a - b);
      for (let i = 1; i < slotIndices.length; i++) {
        const gap = slotIndices[i] - slotIndices[i - 1] - 1;
        if (gap > 0) gaps += gap;
      }
    });

    const score = gaps === 0 ? 100 : gaps === 1 ? 80 : gaps === 2 ? 60 : 40;
    groupGaps.push({
      label: `${g.department} - السنة ${g.year} (${g.section})`,
      dept: g.department,
      lectures,
      gaps,
      score,
    });
  });

  return { totalLectures, hardViolations, softScore, roomUtilization, profLoad, roomLoad, groupGaps };
}

// ==========================================
// Animated Bar Component
// ==========================================
function AnimatedBar({ percentage, color, delay = 0 }: { percentage: number; color: string; delay?: number }) {
  return (
    <div className="flex-1 h-3 bg-white/[0.05] rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(percentage, 100)}%` }}
        transition={{ delay, duration: 1, ease: 'easeOut' as const }}
        className={`h-full rounded-full ${color}`}
      />
    </div>
  );
}

// ==========================================
// Main Page Component
// ==========================================
export default function TimetableStatsPage() {
  const entries = useMemo(() => generateSampleTimetable(), []);
  const stats = useMemo(() => computeStats(entries), [entries]);

  const overviewCards = [
    {
      label: 'إجمالي المحاضرات',
      value: stats.totalLectures,
      icon: Calendar,
      gradient: 'from-[#3b82f6] to-[#06b6d4]',
      bgGlow: 'bg-[#3b82f6]/10',
    },
    {
      label: 'انتهاكات صلبة',
      value: stats.hardViolations,
      icon: CheckCircle,
      gradient: 'from-[#10b981] to-[#22c55e]',
      bgGlow: 'bg-[#10b981]/10',
      suffix: '✅',
    },
    {
      label: 'نقاط القيود المرنة',
      value: stats.softScore,
      icon: Award,
      gradient: 'from-[#f59e0b] to-[#f97316]',
      bgGlow: 'bg-[#f59e0b]/10',
      suffix: '/ 100',
    },
    {
      label: 'استغلال القاعات',
      value: stats.roomUtilization,
      icon: Building2,
      gradient: 'from-[#a855f7] to-[#ec4899]',
      bgGlow: 'bg-[#a855f7]/10',
      suffix: '%',
    },
  ];

  return (
    <div className="min-h-screen bg-[#050505]">
{/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#3b82f6]/8 via-transparent to-transparent" />
        <div className="absolute top-10 right-20 w-80 h-80 bg-[#3b82f6]/5 rounded-full blur-3xl" />
        <div className="absolute top-20 left-40 w-60 h-60 bg-[#14b8a6]/5 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-[#3b82f6]/10 border border-[#3b82f6]/20 rounded-full px-4 py-1.5 mb-4">
              <BarChart3 className="w-4 h-4 text-[#60a5fa]" />
              <span className="text-sm text-[#93c5fd]">تحليلات ذكية</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              تحليلات <span className="bg-gradient-to-r from-[#14b8a6] to-[#3b82f6] bg-clip-text text-transparent">الجدول</span>
            </h1>
            <p className="text-gray-400 text-sm max-w-xl mx-auto">
              مقاييس جودة الجدول الدراسي المُولَّد بالذكاء الاصطناعي
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {overviewCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                whileHover={{ scale: 1.03, y: -4 }}
                className="relative group"
              >
                {/* Glow */}
                <div className={`absolute inset-0 ${card.bgGlow} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity`} />
                
                <div className="relative bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 overflow-hidden">
                  {/* Gradient stripe */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.gradient}`} />

                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    {card.label === 'نقاط القيود المرنة' && (
                      <div className="w-10 h-10 relative">
                        <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
                          <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
                          <motion.circle
                            cx="18" cy="18" r="15" fill="none" stroke="url(#scoreGradient)" strokeWidth="3"
                            strokeDasharray={`${(stats.softScore / 100) * 94.2} 94.2`}
                            strokeLinecap="round"
                            initial={{ strokeDasharray: '0 94.2' }}
                            animate={{ strokeDasharray: `${(stats.softScore / 100) * 94.2} 94.2` }}
                            transition={{ delay: 0.5, duration: 1.5, ease: 'easeOut' as const }}
                          />
                          <defs>
                            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#f59e0b" />
                              <stop offset="100%" stopColor="#f97316" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className="flex items-baseline gap-2">
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className={`text-3xl font-bold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`}
                    >
                      {card.value}
                    </motion.span>
                    {card.suffix && (
                      <span className="text-sm text-gray-400">{card.suffix}</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 mt-1">{card.label}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Professor Load Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#14b8a6] to-[#3b82f6] flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">توزيع حمل الأساتذة</h2>
              <p className="text-xs text-gray-500">الساعات المجدولة مقابل الحد الأقصى</p>
            </div>
          </div>
          <div className="space-y-4">
            {Object.values(stats.profLoad).map((prof, i) => {
              const pct = (prof.scheduled / prof.max) * 100;
              const barColor = pct > 80
                ? 'bg-gradient-to-r from-[#ef4444] to-[#f97316]'
                : pct < 40
                  ? 'bg-gradient-to-r from-[#10b981] to-[#22c55e]'
                  : 'bg-gradient-to-r from-[#14b8a6] to-[#3b82f6]';
              const deptColors = DEPARTMENT_COLORS[prof.dept];

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.08 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-32 sm:w-40 flex-shrink-0">
                    <span className="text-sm text-white font-medium block truncate">{prof.name}</span>
                    <span className={`text-[10px] ${deptColors.text} ${deptColors.bg} px-2 py-0.5 rounded-md inline-block mt-0.5`}>
                      {prof.dept}
                    </span>
                  </div>
                  <AnimatedBar percentage={pct} color={barColor} delay={0.7 + i * 0.08} />
                  <div className="w-20 text-left flex-shrink-0">
                    <span className="text-sm text-white font-medium">{prof.scheduled}</span>
                    <span className="text-xs text-gray-500"> / {prof.max}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Room Utilization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#06b6d4] to-[#3b82f6] flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">استغلال القاعات والمعامل</h2>
              <p className="text-xs text-gray-500">نسبة إشغال كل قاعة من إجمالي الفترات المتاحة</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.values(stats.roomLoad).map((room, i) => {
              const pct = Math.round((room.scheduled / room.total) * 100);
              const barColor = pct > 60
                ? 'bg-gradient-to-r from-[#f59e0b] to-[#ef4444]'
                : pct > 30
                  ? 'bg-gradient-to-r from-[#06b6d4] to-[#3b82f6]'
                  : 'bg-gradient-to-r from-[#10b981] to-[#14b8a6]';

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + i * 0.08 }}
                  className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-white font-bold">{room.name}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-md ${room.type === 'معمل' ? 'bg-[#10b981]/10 text-[#6ee7b7]' : 'bg-[#3b82f6]/10 text-[#93c5fd]'}`}>
                        {room.type}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-white">{pct}%</span>
                  </div>
                  <AnimatedBar percentage={pct} color={barColor} delay={0.9 + i * 0.08} />
                  <div className="text-[10px] text-gray-500 mt-1.5">
                    {room.scheduled} من {room.total} فترة مستخدمة
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Gap Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f59e0b] to-[#f97316] flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">تحليل الفجوات لمجموعات الطلاب</h2>
              <p className="text-xs text-gray-500">فترات الفراغ بين المحاضرات لكل مجموعة</p>
            </div>
          </div>
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.08]">
                  <th className="text-gray-400 p-3 text-right font-medium">المجموعة</th>
                  <th className="text-gray-400 p-3 text-center font-medium">المحاضرات</th>
                  <th className="text-gray-400 p-3 text-center font-medium">الفجوات</th>
                  <th className="text-gray-400 p-3 text-center font-medium">الجودة</th>
                </tr>
              </thead>
              <tbody>
                {stats.groupGaps.map((g, i) => {
                  const deptColors = DEPARTMENT_COLORS[g.dept];
                  const qualityColor = g.score >= 80 ? 'bg-[#10b981]' : g.score >= 60 ? 'bg-[#f59e0b]' : 'bg-[#ef4444]';
                  const qualityLabel = g.score >= 80 ? 'ممتاز' : g.score >= 60 ? 'جيد' : 'يحتاج تحسين';

                  return (
                    <motion.tr
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1 + i * 0.06 }}
                      className="border-b border-white/[0.05] hover:bg-white/[0.03] transition-colors"
                    >
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${qualityColor}`} />
                          <span className="text-white font-medium text-xs sm:text-sm">{g.label}</span>
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <span className="bg-[#14b8a6]/10 text-[#2dd4bf] px-2.5 py-1 rounded-lg text-xs font-bold">
                          {g.lectures}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${g.gaps === 0 ? 'bg-[#10b981]/10 text-[#6ee7b7]' : 'bg-[#f59e0b]/10 text-[#fcd34d]'}`}>
                          {g.gaps}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className={`w-2.5 h-2.5 rounded-full ${qualityColor}`} />
                          <span className="text-xs text-gray-300">{qualityLabel}</span>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* AI Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-6 text-center"
        >
          <div className="inline-flex items-center gap-2 bg-white/[0.03] border border-white/[0.08] rounded-full px-5 py-2">
            <Sparkles className="w-4 h-4 text-[#fbbf24]" />
            <span className="text-xs text-gray-400">تم تحليل البيانات باستخدام محرك الذكاء الاصطناعي HITU</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
