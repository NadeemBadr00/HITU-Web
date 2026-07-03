'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Filter, ExternalLink, Users, Calendar, Award, FolderOpen } from 'lucide-react';

const departments = [
  { id: 'all', name: 'جميع الأقسام', emoji: '🎓' },
  { id: 'ai', name: 'الذكاء الاصطناعي', emoji: '🤖' },
  { id: 'ds', name: 'علوم البيانات', emoji: '📊' },
  { id: 'cs', name: 'الأمن السيبراني', emoji: '🔐' },
  { id: 'auto', name: 'أوتوترونكس', emoji: '🚗' },
  { id: 'mech', name: 'ميكاترونكس', emoji: '⚙️' },
  { id: 'iac', name: 'التحكم الصناعي', emoji: '🏭' },
  { id: 'rgt', name: 'تكنولوجيا الملابس', emoji: '👔' },
];

type YearFilter = 'all' | 'second' | 'fourth';

interface Project {
  id: number;
  title: string;
  description: string;
  team: string[];
  supervisor: string;
  department: string;
  year: 'second' | 'fourth';
  tags: string[];
  status: 'completed' | 'in-progress';
}

const projects: Project[] = [
  // الذكاء الاصطناعي - فرقة ثانية
  {
    id: 1,
    title: 'نظام التعرف على الوجوه للحضور',
    description: 'نظام ذكي يستخدم تقنيات التعرف على الوجوه لتسجيل حضور الطلاب تلقائياً باستخدام كاميرات الفصول.',
    team: ['أحمد محمد', 'سارة أحمد', 'محمود علي'],
    supervisor: 'د. أحمد بنداري',
    department: 'ai',
    year: 'second',
    tags: ['Computer Vision', 'OpenCV', 'Python'],
    status: 'completed',
  },
  {
    id: 2,
    title: 'شات بوت خدمة العملاء',
    description: 'بوت محادثة ذكي للرد على استفسارات الطلاب حول الجامعة باستخدام معالجة اللغة الطبيعية.',
    team: ['نور خالد', 'يوسف عمر'],
    supervisor: 'د. منى حسن',
    department: 'ai',
    year: 'second',
    tags: ['NLP', 'Gemini API', 'Flask'],
    status: 'completed',
  },
  // الذكاء الاصطناعي - فرقة رابعة
  {
    id: 3,
    title: 'Anubis - مرشد سياحي بالذكاء الاصطناعي',
    description: 'تطبيق مرشد سياحي يتعرف على التماثيل والآثار المصرية بدقة 90% مع شات بوت متعدد اللغات (59 لغة) باستخدام Gemini.',
    team: ['نديم بدر', 'فريق التخرج'],
    supervisor: 'د. أحمد بنداري',
    department: 'ai',
    year: 'fourth',
    tags: ['YOLO', 'Gemini', 'Flutter', 'Computer Vision'],
    status: 'in-progress',
  },
  // علوم البيانات
  {
    id: 4,
    title: 'تحليل بيانات سوق العمل المصري',
    description: 'مشروع لتحليل بيانات الوظائف المتاحة في مصر وتوقع المهارات المطلوبة مستقبلاً باستخدام Machine Learning.',
    team: ['خالد أحمد', 'مريم سعيد'],
    supervisor: 'د. سامي عبدالله',
    department: 'ds',
    year: 'second',
    tags: ['Pandas', 'Scikit-learn', 'Visualization'],
    status: 'completed',
  },
  {
    id: 5,
    title: 'نظام توصية أكاديمي ذكي',
    description: 'منصة تحليل أداء الطلاب وتقديم توصيات مخصصة للمواد والمسارات الدراسية المناسبة.',
    team: ['ياسمين محمد', 'أحمد حسام', 'عمر فاروق'],
    supervisor: 'د. سامي عبدالله',
    department: 'ds',
    year: 'fourth',
    tags: ['Recommendation System', 'Deep Learning', 'React'],
    status: 'in-progress',
  },
  // الأمن السيبراني
  {
    id: 6,
    title: 'أداة فحص ثغرات المواقع',
    description: 'أداة آلية لفحص المواقع واكتشاف الثغرات الأمنية الشائعة مع تقديم تقارير تفصيلية.',
    team: ['محمد إبراهيم', 'عبدالرحمن سيد'],
    supervisor: 'د. ياسر محمود',
    department: 'cs',
    year: 'second',
    tags: ['Python', 'Security', 'Automation'],
    status: 'completed',
  },
  {
    id: 7,
    title: 'منصة محاكاة الهجمات السيبرانية',
    description: 'بيئة تعليمية تفاعلية لمحاكاة الهجمات الإلكترونية وتدريب الطلاب على الدفاع السيبراني.',
    team: ['حسن مصطفى', 'كريم أشرف', 'لمياء خالد'],
    supervisor: 'د. ياسر محمود',
    department: 'cs',
    year: 'fourth',
    tags: ['Penetration Testing', 'Docker', 'Network Security'],
    status: 'in-progress',
  },
  // أوتوترونكس
  {
    id: 8,
    title: 'سيارة ذاتية القيادة مصغرة',
    description: 'نموذج مصغر لسيارة ذاتية القيادة باستخدام Raspberry Pi وكاميرات ومستشعرات.',
    team: ['عمرو حسين', 'طارق سمير'],
    supervisor: 'د. محمد عادل',
    department: 'auto',
    year: 'second',
    tags: ['Raspberry Pi', 'Sensors', 'Arduino'],
    status: 'completed',
  },
  // ميكاترونكس
  {
    id: 9,
    title: 'ذراع روبوتية صناعية',
    description: 'تصميم وتنفيذ ذراع روبوتية بـ 6 درجات حرية للاستخدام في خطوط الإنتاج.',
    team: ['أحمد سعيد', 'محمد خالد', 'هشام طارق'],
    supervisor: 'د. حاتم رشاد',
    department: 'mech',
    year: 'fourth',
    tags: ['ROS', '3D Printing', 'Control Systems'],
    status: 'in-progress',
  },
  // التحكم الصناعي
  {
    id: 10,
    title: 'نظام مراقبة خطوط الإنتاج IoT',
    description: 'نظام مراقبة وتحكم عن بعد في خطوط الإنتاج باستخدام إنترنت الأشياء ولوحات تحكم تفاعلية.',
    team: ['محمود سامي', 'إسلام أحمد'],
    supervisor: 'د. عمرو سالم',
    department: 'iac',
    year: 'second',
    tags: ['IoT', 'PLC', 'SCADA', 'Dashboard'],
    status: 'completed',
  },
  // تكنولوجيا الملابس
  {
    id: 11,
    title: 'تطبيق تصميم أزياء بالذكاء الاصطناعي',
    description: 'تطبيق يستخدم AI لتوليد تصميمات أزياء مبتكرة بناءً على اتجاهات الموضة الحالية.',
    team: ['بسمة حسين', 'نورهان أحمد'],
    supervisor: 'د. سهام محمد',
    department: 'rgt',
    year: 'fourth',
    tags: ['AI Generation', 'Fashion Tech', 'UI/UX'],
    status: 'in-progress',
  },
];

export default function ProjectsPage() {
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedYear, setSelectedYear] = useState<YearFilter>('all');

  const filteredProjects = projects.filter((p) => {
    const deptMatch = selectedDept === 'all' || p.department === selectedDept;
    const yearMatch = selectedYear === 'all' || p.year === selectedYear;
    return deptMatch && yearMatch;
  });

  const secondYearProjects = filteredProjects.filter(p => p.year === 'second');
  const fourthYearProjects = filteredProjects.filter(p => p.year === 'fourth');

  return (
    <div className="min-h-screen bg-[#050505]">
      {/* Hero */}
      <section className="relative py-16 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#14b8a6]/[0.08] blur-[120px] rounded-full" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#14b8a6]/10 border border-[#14b8a6]/20 text-[#2dd4bf] text-sm font-medium mb-6"
          >
            <GraduationCap className="w-4 h-4" />
            مشاريع التخرج
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-black text-white mb-4"
          >
            مشاريع طلاب{' '}
            <span className="bg-gradient-to-r from-[#14b8a6] to-[#3b82f6] bg-clip-text text-transparent">
              HITU
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto"
          >
            اكتشف المشاريع المبتكرة لطلاب الجامعة في مختلف التخصصات التكنولوجية
          </motion.p>
        </div>
      </section>

      {/* Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-10">
        {/* Year Filter */}
        <div className="flex items-center gap-3 mb-6">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-400 font-medium">المرحلة:</span>
          <div className="flex gap-2">
            {([
              { id: 'all' as YearFilter, label: 'الكل' },
              { id: 'second' as YearFilter, label: 'الفرقة الثانية (دبلوم)' },
              { id: 'fourth' as YearFilter, label: 'الفرقة الرابعة (بكالوريوس)' },
            ]).map((y) => (
              <button
                key={y.id}
                onClick={() => setSelectedYear(y.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  selectedYear === y.id
                    ? 'bg-[#14b8a6]/15 text-[#2dd4bf] border border-[#14b8a6]/30'
                    : 'bg-white/[0.03] text-gray-400 border border-white/[0.08] hover:bg-white/[0.06] hover:text-white'
                }`}
              >
                {y.label}
              </button>
            ))}
          </div>
        </div>

        {/* Department Filter */}
        <div className="flex flex-wrap gap-2">
          {departments.map((dept) => (
            <button
              key={dept.id}
              onClick={() => setSelectedDept(dept.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                selectedDept === dept.id
                  ? 'bg-gradient-to-r from-[#14b8a6]/15 to-[#3b82f6]/15 text-[#2dd4bf] border border-[#14b8a6]/30 shadow-lg shadow-[#14b8a6]/10'
                  : 'bg-white/[0.03] text-gray-400 border border-white/[0.08] hover:bg-white/[0.06] hover:text-white'
              }`}
            >
              <span>{dept.emoji}</span>
              {dept.name}
            </button>
          ))}
        </div>
      </section>

      {/* Projects Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        {filteredProjects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <FolderOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl text-gray-400 mb-2">لا توجد مشاريع</h3>
            <p className="text-gray-500">جرب تغيير الفلتر لعرض مشاريع مختلفة</p>
          </motion.div>
        ) : (
          <div className="space-y-12">
            {/* Second Year Projects */}
            {(selectedYear === 'all' || selectedYear === 'second') && secondYearProjects.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[#3b82f6]/15 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-[#60a5fa]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">مشاريع الفرقة الثانية</h2>
                    <p className="text-sm text-gray-500">مرحلة الدبلوم فوق المتوسط</p>
                  </div>
                  <span className="mr-auto px-3 py-1 rounded-full bg-[#3b82f6]/10 text-[#60a5fa] text-sm font-medium">
                    {secondYearProjects.length} مشروع
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  <AnimatePresence mode="popLayout">
                    {secondYearProjects.map((project, i) => (
                      <ProjectCard key={project.id} project={project} index={i} />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* Fourth Year Projects */}
            {(selectedYear === 'all' || selectedYear === 'fourth') && fourthYearProjects.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[#8b5cf6]/15 flex items-center justify-center">
                    <Award className="w-5 h-5 text-[#a78bfa]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">مشاريع الفرقة الرابعة</h2>
                    <p className="text-sm text-gray-500">مرحلة البكالوريوس التكنولوجي</p>
                  </div>
                  <span className="mr-auto px-3 py-1 rounded-full bg-[#8b5cf6]/10 text-[#a78bfa] text-sm font-medium">
                    {fourthYearProjects.length} مشروع
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  <AnimatePresence mode="popLayout">
                    {fourthYearProjects.map((project, i) => (
                      <ProjectCard key={project.id} project={project} index={i} />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const deptInfo = departments.find(d => d.id === project.department);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.05 }}
      className="group relative rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.08] p-6 hover:border-[#14b8a6]/30 hover:-translate-y-1 transition-all duration-300"
    >
      {/* Status Badge */}
      <div className="absolute top-4 left-4">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${
          project.status === 'completed'
            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
            : 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${
            project.status === 'completed' ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'
          }`} />
          {project.status === 'completed' ? 'مكتمل' : 'قيد التنفيذ'}
        </span>
      </div>

      {/* Department Badge */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">{deptInfo?.emoji}</span>
        <span className="text-xs text-gray-500 font-medium">{deptInfo?.name}</span>
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#2dd4bf] transition-colors leading-tight">
        {project.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-400 leading-relaxed mb-4 line-clamp-3">
        {project.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 rounded-md bg-white/[0.05] text-[11px] text-gray-400 border border-white/[0.06]"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Team */}
      <div className="flex items-center gap-2 mb-2">
        <Users className="w-3.5 h-3.5 text-gray-500" />
        <span className="text-xs text-gray-500">
          {project.team.join('، ')}
        </span>
      </div>

      {/* Supervisor */}
      <div className="flex items-center gap-2">
        <GraduationCap className="w-3.5 h-3.5 text-gray-500" />
        <span className="text-xs text-gray-500">
          إشراف: {project.supervisor}
        </span>
      </div>

      {/* Hover Gradient */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[#14b8a6]/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </motion.div>
  );
}
