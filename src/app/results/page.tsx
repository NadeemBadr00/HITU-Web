'use client';

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { exportResultsPDF } from '@/lib/export-utils';
import type { StudentInfo, SemesterExport } from '@/lib/export-utils';

interface CourseGrade {
  code: string;
  name: string;
  credits: number;
  score: number;
  points: number;
  grade: string;
}

interface SemesterData {
  id: string;
  label: string;
  gpa: number;
  courses: CourseGrade[];
}

const studentInfo = {
  id: '20240156',
  name: 'أحمد محمد عبدالله',
  department: 'الذكاء الاصطناعي',
  level: 'الثاني',
  status: 'مقيد',
  enrollDate: 'سبتمبر 2023',
};

const semesters: SemesterData[] = [
  {
    id: 'sem1',
    label: 'الفصل الأول 2024/2025',
    gpa: 3.45,
    courses: [
      { code: 'CS201', name: 'مقدمة في الذكاء الاصطناعي', credits: 3, score: 92, points: 3.7, grade: 'A-' },
      { code: 'CS202', name: 'هياكل البيانات', credits: 3, score: 88, points: 3.3, grade: 'B+' },
      { code: 'CS203', name: 'البرمجة المتقدمة', credits: 3, score: 95, points: 4.0, grade: 'A' },
      { code: 'MATH201', name: 'الرياضيات المتقدمة', credits: 3, score: 78, points: 2.7, grade: 'B-' },
      { code: 'ENG201', name: 'اللغة الإنجليزية التقنية', credits: 2, score: 85, points: 3.3, grade: 'B+' },
      { code: 'PHY201', name: 'الفيزياء الهندسية', credits: 3, score: 90, points: 3.7, grade: 'A-' },
    ],
  },
  {
    id: 'sem2',
    label: 'الفصل الثاني 2024/2025',
    gpa: 3.60,
    courses: [
      { code: 'CS204', name: 'التعلم الآلي', credits: 3, score: 94, points: 3.7, grade: 'A-' },
      { code: 'CS205', name: 'قواعد البيانات', credits: 3, score: 91, points: 3.7, grade: 'A-' },
      { code: 'CS206', name: 'الشبكات الحاسوبية', credits: 3, score: 87, points: 3.3, grade: 'B+' },
      { code: 'MATH202', name: 'الإحصاء والاحتمالات', credits: 3, score: 82, points: 3.0, grade: 'B' },
      { code: 'ENG202', name: 'الكتابة التقنية', credits: 2, score: 96, points: 4.0, grade: 'A' },
      { code: 'CS207', name: 'أنظمة التشغيل', credits: 3, score: 89, points: 3.3, grade: 'B+' },
    ],
  },
];

const gpaHistory = [
  { semester: 'الأول ٢٣/٢٤', gpa: 3.20 },
  { semester: 'الثاني ٢٣/٢٤', gpa: 3.35 },
  { semester: 'الأول ٢٤/٢٥', gpa: 3.45 },
  { semester: 'الثاني ٢٤/٢٥', gpa: 3.60 },
];

const cumulativeGPA = 3.52;

function getGradeColor(grade: string): string {
  if (grade.startsWith('A')) return 'text-emerald-400';
  if (grade === 'B+' || grade === 'B') return 'text-blue-400';
  if (grade === 'B-' || grade === 'C+') return 'text-amber-400';
  return 'text-red-400';
}

function getGradeBg(grade: string): string {
  if (grade.startsWith('A')) return 'bg-emerald-500/15';
  if (grade === 'B+' || grade === 'B') return 'bg-blue-500/15';
  if (grade === 'B-' || grade === 'C+') return 'bg-amber-500/15';
  return 'bg-red-500/15';
}

function getGpaColor(gpa: number): string {
  if (gpa >= 3.5) return 'text-emerald-400';
  if (gpa >= 3.0) return 'text-blue-400';
  if (gpa >= 2.0) return 'text-amber-400';
  return 'text-red-400';
}

function getGpaGradient(gpa: number): string {
  if (gpa >= 3.5) return 'from-emerald-500 to-emerald-400';
  if (gpa >= 3.0) return 'from-blue-500 to-blue-400';
  if (gpa >= 2.0) return 'from-amber-500 to-amber-400';
  return 'from-red-500 to-red-400';
}

export default function ResultsPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [activeSemester, setActiveSemester] = useState('sem1');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
  };

  const currentSemester = semesters.find((s) => s.id === activeSemester) || semesters[0];
  const totalCredits = currentSemester.courses.reduce((sum, c) => sum + c.credits, 0);

  return (
    <div className="min-h-screen bg-[#050505]">
<AnimatePresence mode="wait">
        {!isLoggedIn ? (
          /* ==================== LOGIN STATE ==================== */
          <motion.section
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -30 }}
            className="flex items-center justify-center min-h-[80vh] px-4"
          >
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-[#14b8a6]/[0.06] rounded-full blur-3xl" />
              <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-[#3b82f6]/[0.06] rounded-full blur-3xl" />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-md bg-[#111111]/80 backdrop-blur-xl border border-white/[0.08] rounded-3xl p-10 relative z-10"
            >
              {/* Lock Icon */}
              <div className="text-center mb-8">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#14b8a6]/20 to-[#3b82f6]/20 border border-white/[0.08] flex items-center justify-center text-4xl mx-auto mb-5">
                  🔒
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">بوابة النتائج</h1>
                <p className="text-gray-400 text-sm">يجب تسجيل الدخول لعرض النتائج</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">الرقم الأكاديمي</label>
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="مثال: 20240156"
                    className="w-full bg-[#111111] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14b8a6] transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">كلمة المرور</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#111111] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14b8a6] transition-all text-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#14b8a6] to-[#0d9488] text-white py-3.5 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-[#14b8a6]/25 transition-all duration-300"
                >
                  🔓 تسجيل الدخول
                </button>
              </form>

              <div className="mt-6 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 text-center">
                <p className="text-xs text-amber-400">
                  ⚠️ هذا عرض تجريبي - أدخل أي بيانات للمتابعة
                </p>
              </div>
            </motion.div>
          </motion.section>
        ) : (
          /* ==================== RESULTS STATE ==================== */
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Top Bar */}
            <div className="max-w-6xl mx-auto px-4 pt-6 pb-4 flex items-center justify-between print:hidden">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#14b8a6] to-[#3b82f6] flex items-center justify-center text-white font-bold">
                  {studentInfo.name[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">مرحباً، {studentInfo.name}</p>
                  <p className="text-xs text-gray-500">{studentInfo.department}</p>
                </div>
              </motion.div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    const exportStudent: StudentInfo = studentInfo;
                    const exportSemesters: SemesterExport[] = semesters.map(s => ({
                      label: s.label,
                      gpa: s.gpa,
                      courses: s.courses.map(c => ({
                        code: c.code,
                        name: c.name,
                        credits: c.credits,
                        score: c.score,
                        points: c.points,
                        grade: c.grade,
                      })),
                    }));
                    exportResultsPDF(exportStudent, exportSemesters, cumulativeGPA);
                  }}
                  className="flex items-center gap-2 bg-gradient-to-r from-[#14b8a6] to-[#0d9488] text-white px-4 py-2 rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-[#14b8a6]/25 transition-all"
                >
                  📄 تحميل PDF
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.08] text-gray-300 px-4 py-2 rounded-xl text-sm hover:bg-white/[0.05] transition-all"
                >
                  🖨️ طباعة النتائج
                </button>
                <button
                  onClick={() => setIsLoggedIn(false)}
                  className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-xl text-sm hover:bg-red-500/20 transition-all"
                >
                  🚪 خروج
                </button>
              </div>
            </div>

            {/* Student Info Card */}
            <section className="max-w-6xl mx-auto px-4 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-[#14b8a6]/10 to-[#3b82f6]/10 backdrop-blur-xl border border-white/[0.08] rounded-3xl p-8"
              >
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                  {[
                    { label: 'الرقم الأكاديمي', value: studentInfo.id, icon: '🆔' },
                    { label: 'الاسم', value: studentInfo.name, icon: '👤' },
                    { label: 'القسم', value: studentInfo.department, icon: '🏛️' },
                    { label: 'المستوى', value: studentInfo.level, icon: '📊' },
                    { label: 'تاريخ القيد', value: studentInfo.enrollDate, icon: '📅' },
                    { label: 'الحالة', value: studentInfo.status, icon: '✅' },
                  ].map((item) => (
                    <div key={item.label}>
                      <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                        <span>{item.icon}</span> {item.label}
                      </p>
                      <p className={`text-sm font-semibold ${item.label === 'الحالة' ? 'text-emerald-400' : 'text-white'}`}>
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </section>

            {/* GPA Summary Cards */}
            <section className="max-w-6xl mx-auto px-4 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Semester GPA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-3xl p-8 text-center"
                >
                  <p className="text-sm text-gray-400 mb-4">معدل الفصل</p>
                  <div className="relative w-36 h-36 mx-auto mb-4">
                    {/* Circular progress */}
                    <svg className="w-36 h-36 -rotate-90" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                      <motion.circle
                        cx="60"
                        cy="60"
                        r="50"
                        fill="none"
                        stroke="url(#gpaSemGrad)"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${(currentSemester.gpa / 4) * 314} 314`}
                        initial={{ strokeDasharray: '0 314' }}
                        animate={{ strokeDasharray: `${(currentSemester.gpa / 4) * 314} 314` }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                      <defs>
                        <linearGradient id="gpaSemGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#14b8a6" />
                          <stop offset="100%" stopColor="#3b82f6" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={`text-3xl font-bold ${getGpaColor(currentSemester.gpa)}`}>
                        {currentSemester.gpa.toFixed(2)}
                      </span>
                      <span className="text-xs text-gray-500">من 4.0</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">{currentSemester.label}</p>
                </motion.div>

                {/* Cumulative GPA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-3xl p-8 text-center"
                >
                  <p className="text-sm text-gray-400 mb-4">المعدل التراكمي</p>
                  <div className="relative w-36 h-36 mx-auto mb-4">
                    <svg className="w-36 h-36 -rotate-90" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                      <motion.circle
                        cx="60"
                        cy="60"
                        r="50"
                        fill="none"
                        stroke="url(#gpaCumGrad)"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${(cumulativeGPA / 4) * 314} 314`}
                        initial={{ strokeDasharray: '0 314' }}
                        animate={{ strokeDasharray: `${(cumulativeGPA / 4) * 314} 314` }}
                        transition={{ duration: 1, delay: 0.7 }}
                      />
                      <defs>
                        <linearGradient id="gpaCumGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#d946ef" />
                          <stop offset="100%" stopColor="#3b82f6" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={`text-3xl font-bold ${getGpaColor(cumulativeGPA)}`}>
                        {cumulativeGPA.toFixed(2)}
                      </span>
                      <span className="text-xs text-gray-500">من 4.0</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">جميع الفصول الدراسية</p>
                </motion.div>
              </div>
            </section>

            {/* Semester Tabs */}
            <section className="max-w-6xl mx-auto px-4 mb-6 print:hidden">
              <div className="flex gap-3">
                {semesters.map((sem) => (
                  <button
                    key={sem.id}
                    onClick={() => setActiveSemester(sem.id)}
                    className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                      activeSemester === sem.id
                        ? 'bg-[#14b8a6]/20 text-[#2dd4bf] border border-[#14b8a6]/30'
                        : 'bg-white/[0.03] text-gray-400 border border-white/[0.08] hover:bg-white/[0.05]'
                    }`}
                  >
                    {sem.label}
                  </button>
                ))}
              </div>
            </section>

            {/* Grades Table */}
            <section className="max-w-6xl mx-auto px-4 mb-8">
              <motion.div
                key={activeSemester}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-3xl overflow-hidden"
              >
                <div className="px-8 py-5 border-b border-white/[0.05] flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">📋 كشف الدرجات</h3>
                  <span className="text-xs text-gray-500">إجمالي الساعات: {totalCredits} ساعة</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/[0.05]">
                        <th className="text-right px-6 py-4 text-xs font-medium text-gray-500 uppercase">كود المقرر</th>
                        <th className="text-right px-6 py-4 text-xs font-medium text-gray-500 uppercase">اسم المقرر</th>
                        <th className="text-center px-6 py-4 text-xs font-medium text-gray-500 uppercase">الساعات</th>
                        <th className="text-center px-6 py-4 text-xs font-medium text-gray-500 uppercase">الدرجة</th>
                        <th className="text-center px-6 py-4 text-xs font-medium text-gray-500 uppercase">النقاط</th>
                        <th className="text-center px-6 py-4 text-xs font-medium text-gray-500 uppercase">التقدير</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentSemester.courses.map((course, index) => (
                        <motion.tr
                          key={course.code}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-white/[0.05] hover:bg-white/[0.03] transition-colors"
                        >
                          <td className="px-6 py-4">
                            <span className="text-sm font-mono text-[#2dd4bf]">{course.code}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-white">{course.name}</span>
                          </td>
                          <td className="text-center px-6 py-4">
                            <span className="text-sm text-gray-400">{course.credits}</span>
                          </td>
                          <td className="text-center px-6 py-4">
                            <span className="text-sm text-white font-semibold">{course.score}</span>
                          </td>
                          <td className="text-center px-6 py-4">
                            <span className="text-sm text-gray-300">{course.points.toFixed(1)}</span>
                          </td>
                          <td className="text-center px-6 py-4">
                            <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold ${getGradeColor(course.grade)} ${getGradeBg(course.grade)}`}>
                              {course.grade}
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </section>

            {/* GPA Progression Chart */}
            <section className="max-w-6xl mx-auto px-4 pb-24">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-3xl p-8"
              >
                <h3 className="text-lg font-bold text-white mb-8 flex items-center gap-2">
                  📈 تطور المعدل التراكمي
                </h3>

                <div className="flex items-end justify-center gap-6 md:gap-10 h-56">
                  {gpaHistory.map((item, index) => {
                    const heightPct = (item.gpa / 4) * 100;
                    const gradient = getGpaGradient(item.gpa);

                    return (
                      <div key={index} className="flex flex-col items-center gap-2 flex-1 max-w-[100px]">
                        {/* GPA Value */}
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.7 + index * 0.1 }}
                          className={`text-sm font-bold ${getGpaColor(item.gpa)}`}
                        >
                          {item.gpa.toFixed(2)}
                        </motion.span>

                        {/* Bar */}
                        <div className="w-full h-40 bg-white/[0.05] rounded-xl overflow-hidden flex items-end">
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${heightPct}%` }}
                            transition={{ duration: 0.8, delay: 0.5 + index * 0.15 }}
                            className={`w-full rounded-xl bg-gradient-to-t ${gradient} relative`}
                          >
                            <div className="absolute inset-0 bg-white/10 rounded-xl" />
                          </motion.div>
                        </div>

                        {/* Semester Label */}
                        <span className="text-xs text-gray-500 text-center whitespace-nowrap">
                          {item.semester}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          .print\\:hidden {
            display: none !important;
          }
          nav {
            display: none !important;
          }
          body {
            background: white !important;
            color: black !important;
          }
          * {
            color: black !important;
            background: white !important;
            border-color: #ddd !important;
          }
        }
      `}</style>
    </div>
  );
}
