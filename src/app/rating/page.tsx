'use client';

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo } from "react";

type Department = 'الذكاء الاصطناعي' | 'علوم البيانات' | 'الأمن السيبراني' | 'الميكاترونكس' | 'الأوتوترونكس';

interface Course {
  id: string;
  name: string;
  department: Department;
  professor: string;
}

interface RatingData {
  courseId: string;
  ratings: {
    explanation: number;
    punctuality: number;
    evaluation: number;
    communication: number;
    content: number;
  };
  comment: string;
  timestamp: number;
}

interface AggregatedRating {
  courseId: string;
  courseName: string;
  department: Department;
  professor: string;
  count: number;
  averages: {
    explanation: number;
    punctuality: number;
    evaluation: number;
    communication: number;
    content: number;
    overall: number;
  };
}

const departmentCourses: Record<Department, Course[]> = {
  'الذكاء الاصطناعي': [
    { id: 'AI101', name: 'مقدمة في الذكاء الاصطناعي', department: 'الذكاء الاصطناعي', professor: 'د. أحمد محمود' },
    { id: 'AI201', name: 'التعلم الآلي', department: 'الذكاء الاصطناعي', professor: 'د. فاطمة يوسف' },
    { id: 'AI301', name: 'التعلم العميق', department: 'الذكاء الاصطناعي', professor: 'د. محمد عبدالله' },
    { id: 'AI202', name: 'معالجة اللغات الطبيعية', department: 'الذكاء الاصطناعي', professor: 'د. نورا سمير' },
  ],
  'علوم البيانات': [
    { id: 'DS101', name: 'أساسيات علوم البيانات', department: 'علوم البيانات', professor: 'د. سارة علي' },
    { id: 'DS201', name: 'تحليل البيانات المتقدم', department: 'علوم البيانات', professor: 'د. كريم حسان' },
    { id: 'DS301', name: 'هندسة البيانات الضخمة', department: 'علوم البيانات', professor: 'د. ياسمين فؤاد' },
  ],
  'الأمن السيبراني': [
    { id: 'CS101', name: 'أساسيات الأمن السيبراني', department: 'الأمن السيبراني', professor: 'د. خالد إبراهيم' },
    { id: 'CS201', name: 'التشفير وأمن الشبكات', department: 'الأمن السيبراني', professor: 'د. عمر حسين' },
    { id: 'CS301', name: 'اختبار الاختراق الأخلاقي', department: 'الأمن السيبراني', professor: 'د. محمد حسن' },
  ],
  'الميكاترونكس': [
    { id: 'ME101', name: 'أنظمة التحكم الآلي', department: 'الميكاترونكس', professor: 'د. عادل مصطفى' },
    { id: 'ME201', name: 'الروبوتات الصناعية', department: 'الميكاترونكس', professor: 'د. ليلى عبدالرحمن' },
    { id: 'ME301', name: 'المستشعرات والمشغلات', department: 'الميكاترونكس', professor: 'د. حسام الدين' },
  ],
  'الأوتوترونكس': [
    { id: 'AT101', name: 'إلكترونيات السيارات', department: 'الأوتوترونكس', professor: 'د. عمرو سعيد' },
    { id: 'AT201', name: 'أنظمة القيادة الذاتية', department: 'الأوتوترونكس', professor: 'د. هناء مصطفى' },
    { id: 'AT301', name: 'ديناميكا المركبات', department: 'الأوتوترونكس', professor: 'د. طارق نبيل' },
  ],
};

const criteriaLabels = [
  { key: 'explanation' as const, label: 'جودة الشرح', icon: '📖' },
  { key: 'punctuality' as const, label: 'الالتزام بالمواعيد', icon: '⏰' },
  { key: 'evaluation' as const, label: 'طريقة التقييم', icon: '📝' },
  { key: 'communication' as const, label: 'التواصل مع الطلاب', icon: '💬' },
  { key: 'content' as const, label: 'المادة العلمية', icon: '🔬' },
];

const sampleRatings: RatingData[] = [
  { courseId: 'AI101', ratings: { explanation: 5, punctuality: 4, evaluation: 4, communication: 5, content: 5 }, comment: 'دكتور ممتاز', timestamp: Date.now() - 86400000 },
  { courseId: 'AI101', ratings: { explanation: 4, punctuality: 5, evaluation: 3, communication: 4, content: 4 }, comment: '', timestamp: Date.now() - 172800000 },
  { courseId: 'AI101', ratings: { explanation: 4, punctuality: 4, evaluation: 4, communication: 3, content: 5 }, comment: 'محتوى رائع', timestamp: Date.now() - 259200000 },
  { courseId: 'AI201', ratings: { explanation: 5, punctuality: 5, evaluation: 5, communication: 4, content: 5 }, comment: 'من أفضل المواد', timestamp: Date.now() - 100000000 },
  { courseId: 'AI201', ratings: { explanation: 4, punctuality: 4, evaluation: 5, communication: 5, content: 4 }, comment: '', timestamp: Date.now() - 200000000 },
  { courseId: 'DS101', ratings: { explanation: 3, punctuality: 4, evaluation: 3, communication: 3, content: 4 }, comment: '', timestamp: Date.now() - 300000000 },
  { courseId: 'DS101', ratings: { explanation: 4, punctuality: 3, evaluation: 4, communication: 4, content: 3 }, comment: 'جيد', timestamp: Date.now() - 400000000 },
  { courseId: 'DS101', ratings: { explanation: 3, punctuality: 5, evaluation: 3, communication: 2, content: 4 }, comment: '', timestamp: Date.now() - 500000000 },
  { courseId: 'CS101', ratings: { explanation: 5, punctuality: 5, evaluation: 4, communication: 5, content: 5 }, comment: 'ممتاز جداً', timestamp: Date.now() - 150000000 },
  { courseId: 'CS101', ratings: { explanation: 4, punctuality: 4, evaluation: 4, communication: 4, content: 4 }, comment: '', timestamp: Date.now() - 250000000 },
  { courseId: 'ME101', ratings: { explanation: 3, punctuality: 3, evaluation: 4, communication: 3, content: 4 }, comment: '', timestamp: Date.now() - 350000000 },
  { courseId: 'ME101', ratings: { explanation: 4, punctuality: 4, evaluation: 3, communication: 4, content: 3 }, comment: 'جيد', timestamp: Date.now() - 450000000 },
  { courseId: 'AT101', ratings: { explanation: 4, punctuality: 5, evaluation: 4, communication: 4, content: 5 }, comment: 'ممتاز', timestamp: Date.now() - 550000000 },
  { courseId: 'AT101', ratings: { explanation: 5, punctuality: 4, evaluation: 5, communication: 5, content: 4 }, comment: '', timestamp: Date.now() - 650000000 },
];

const STORAGE_KEY = 'hitu_ratings';

function StarRating({
  value,
  onChange,
  readonly = false,
  size = 'md',
}: {
  value: number;
  onChange?: (v: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md';
}) {
  const [hoverValue, setHoverValue] = useState(0);
  const sizeClass = size === 'sm' ? 'text-lg gap-0.5' : 'text-2xl gap-1';

  return (
    <div
      className={`flex items-center ${sizeClass} ${readonly ? '' : 'cursor-pointer'}`}
      dir="ltr"
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onMouseEnter={() => !readonly && setHoverValue(star)}
          onMouseLeave={() => !readonly && setHoverValue(0)}
          onClick={() => onChange?.(star)}
          className={`transition-all duration-200 ${
            !readonly ? 'hover:scale-125' : ''
          } ${
            star <= (hoverValue || value)
              ? 'text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.4)]'
              : 'text-gray-600'
          }`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default function RatingPage() {
  const [allRatings, setAllRatings] = useState<RatingData[]>(sampleRatings);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | ''>('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [ratings, setRatings] = useState({
    explanation: 0,
    punctuality: 0,
    evaluation: 0,
    communication: 0,
    content: 0,
  });
  const [comment, setComment] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [sortBy, setSortBy] = useState<'highest' | 'most'>('highest');

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as RatingData[];
        setAllRatings([...sampleRatings, ...parsed]);
      }
    } catch {
      // ignore
    }
  }, []);

  const availableCourses = selectedDepartment
    ? departmentCourses[selectedDepartment]
    : [];

  const allCourses = Object.values(departmentCourses).flat();

  // Aggregate ratings
  const aggregatedRatings = useMemo<AggregatedRating[]>(() => {
    const grouped: Record<string, RatingData[]> = {};
    for (const r of allRatings) {
      if (!grouped[r.courseId]) grouped[r.courseId] = [];
      grouped[r.courseId].push(r);
    }

    return Object.entries(grouped)
      .map(([courseId, courseRatings]) => {
        const course = allCourses.find((c) => c.id === courseId);
        if (!course) return null;

        const count = courseRatings.length;
        const sums = { explanation: 0, punctuality: 0, evaluation: 0, communication: 0, content: 0 };
        for (const r of courseRatings) {
          sums.explanation += r.ratings.explanation;
          sums.punctuality += r.ratings.punctuality;
          sums.evaluation += r.ratings.evaluation;
          sums.communication += r.ratings.communication;
          sums.content += r.ratings.content;
        }

        const averages = {
          explanation: sums.explanation / count,
          punctuality: sums.punctuality / count,
          evaluation: sums.evaluation / count,
          communication: sums.communication / count,
          content: sums.content / count,
          overall: 0,
        };
        averages.overall = (averages.explanation + averages.punctuality + averages.evaluation + averages.communication + averages.content) / 5;

        return {
          courseId,
          courseName: course.name,
          department: course.department,
          professor: course.professor,
          count,
          averages,
        };
      })
      .filter(Boolean) as AggregatedRating[];
  }, [allRatings, allCourses]);

  const sortedRatings = useMemo(() => {
    const sorted = [...aggregatedRatings];
    if (sortBy === 'highest') {
      sorted.sort((a, b) => b.averages.overall - a.averages.overall);
    } else {
      sorted.sort((a, b) => b.count - a.count);
    }
    return sorted;
  }, [aggregatedRatings, sortBy]);

  const handleSubmit = () => {
    if (!selectedCourseId || Object.values(ratings).some((v) => v === 0)) return;

    const newRating: RatingData = {
      courseId: selectedCourseId,
      ratings: { ...ratings },
      comment,
      timestamp: Date.now(),
    };

    // Save to localStorage
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const existing = stored ? JSON.parse(stored) : [];
      existing.push(newRating);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    } catch {
      // ignore
    }

    setAllRatings((prev) => [...prev, newRating]);

    // Reset form
    setRatings({ explanation: 0, punctuality: 0, evaluation: 0, communication: 0, content: 0 });
    setComment('');
    setSelectedCourseId('');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const isFormValid = selectedCourseId && Object.values(ratings).every((v) => v > 0);

  return (
    <div className="min-h-screen bg-[#050505]">
{/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-emerald-500/90 backdrop-blur-xl text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3"
          >
            <span className="text-2xl">✅</span>
            <span className="font-medium">تم إرسال تقييمك بنجاح! شكراً لمساهمتك</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero */}
      <section className="relative pt-20 pb-12 px-4 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-1/4 w-72 h-72 bg-amber-500/[0.06] rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-[#14b8a6]/[0.06] rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-5 py-2 mb-6"
          >
            <span className="text-2xl">⭐</span>
            <span className="text-amber-400 text-sm font-medium">تقييمك مجهول تماماً - لا يتطلب تسجيل دخول</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            تقييم المقررات{' '}
            <span className="bg-gradient-to-r from-[#14b8a6] to-[#3b82f6] bg-clip-text text-transparent">والأساتذة</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto"
          >
            ساهم في تحسين جودة التعليم من خلال تقييمك المجهول للمقررات والأساتذة
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Rating Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-3xl p-8 sticky top-24">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-amber-500/15 flex items-center justify-center text-2xl">
                  📝
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">أضف تقييمك</h2>
                  <p className="text-sm text-gray-400">اختر المقرر وقيّم حسب المعايير</p>
                </div>
              </div>

              {/* Department Select */}
              <div className="mb-5">
                <label className="block text-sm text-gray-400 mb-2">اختر القسم</label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => {
                    setSelectedDepartment(e.target.value as Department);
                    setSelectedCourseId('');
                  }}
                  className="w-full bg-[#111111] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14b8a6] transition-all appearance-none cursor-pointer"
                >
                  <option value="" className="bg-[#111111]">اختر القسم...</option>
                  {Object.keys(departmentCourses).map((dept) => (
                    <option key={dept} value={dept} className="bg-[#111111]">{dept}</option>
                  ))}
                </select>
              </div>

              {/* Course Select */}
              <div className="mb-8">
                <label className="block text-sm text-gray-400 mb-2">اختر المقرر</label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  disabled={!selectedDepartment}
                  className="w-full bg-[#111111] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14b8a6] transition-all appearance-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <option value="" className="bg-[#111111]">اختر المقرر...</option>
                  {availableCourses.map((course) => (
                    <option key={course.id} value={course.id} className="bg-[#111111]">
                      {course.name} - {course.professor}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rating Criteria */}
              <div className="space-y-5 mb-8">
                {criteriaLabels.map((criteria) => (
                  <div key={criteria.key} className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <span>{criteria.icon}</span>
                      <span>{criteria.label}</span>
                    </div>
                    <StarRating
                      value={ratings[criteria.key]}
                      onChange={(v) => setRatings((prev) => ({ ...prev, [criteria.key]: v }))}
                    />
                  </div>
                ))}
              </div>

              {/* Comment */}
              <div className="mb-6">
                <label className="block text-sm text-gray-400 mb-2">تعليق (اختياري)</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="اكتب تعليقك هنا..."
                  rows={3}
                  className="w-full bg-[#111111] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14b8a6] transition-all resize-none"
                />
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={!isFormValid}
                className="w-full bg-gradient-to-r from-[#14b8a6] to-[#0d9488] text-white py-3.5 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-[#14b8a6]/25 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none"
              >
                ⭐ إرسال التقييم
              </button>

              {/* Anonymous notice */}
              <div className="mt-4 flex items-center gap-2 justify-center">
                <span className="text-xs">🔒</span>
                <p className="text-xs text-gray-500">تقييمك مجهول تماماً ولن يتم ربطه بأي حساب</p>
              </div>
            </div>
          </motion.div>

          {/* Existing Ratings */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                📊 متوسط التقييمات
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setSortBy('highest')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    sortBy === 'highest'
                      ? 'bg-[#14b8a6]/15 text-[#2dd4bf] border border-[#14b8a6]/30'
                      : 'bg-white/[0.03] text-gray-400 border border-white/[0.08]'
                  }`}
                >
                  الأعلى تقييماً
                </button>
                <button
                  onClick={() => setSortBy('most')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    sortBy === 'most'
                      ? 'bg-[#14b8a6]/15 text-[#2dd4bf] border border-[#14b8a6]/30'
                      : 'bg-white/[0.03] text-gray-400 border border-white/[0.08]'
                  }`}
                >
                  الأكثر تقييماً
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {sortedRatings.map((item, index) => (
                <motion.div
                  key={item.courseId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 hover:bg-white/[0.05] hover:-translate-y-1 hover:border-[#14b8a6]/30 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-base font-bold text-white mb-1">{item.courseName}</h3>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>🏛️ {item.department}</span>
                        <span>👨‍🏫 {item.professor}</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-amber-400">{item.averages.overall.toFixed(1)}</div>
                      <div className="flex items-center gap-1 mt-1">
                        <StarRating value={Math.round(item.averages.overall)} readonly size="sm" />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{item.count} تقييم</p>
                    </div>
                  </div>

                  {/* Criteria Bars */}
                  <div className="space-y-2.5">
                    {criteriaLabels.map((criteria) => {
                      const val = item.averages[criteria.key];
                      const pct = (val / 5) * 100;
                      const barColor = val >= 4 ? 'from-emerald-500 to-emerald-400' : val >= 3 ? 'from-amber-500 to-amber-400' : 'from-red-500 to-red-400';

                      return (
                        <div key={criteria.key} className="flex items-center gap-3">
                          <span className="text-xs text-gray-400 w-28 shrink-0">{criteria.icon} {criteria.label}</span>
                          <div className="flex-1 h-2 bg-white/[0.05] rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.8, delay: 0.2 }}
                              className={`h-full rounded-full bg-gradient-to-r ${barColor}`}
                            />
                          </div>
                          <span className="text-xs text-gray-400 w-8 text-left">{val.toFixed(1)}</span>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
