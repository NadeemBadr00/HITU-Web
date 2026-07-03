'use client';

import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";

type Category = 'محاضرات' | 'ملخصات' | 'مشاريع تخرج' | 'أبحاث';
type Department = 'الذكاء الاصطناعي' | 'علوم البيانات' | 'الأمن السيبراني' | 'الميكاترونكس' | 'الأوتوترونكس';
type FileType = 'PDF' | 'PPTX' | 'DOC';

interface Resource {
  id: number;
  title: string;
  category: Category;
  department: Department;
  description: string;
  fileType: FileType;
  fileSize: string;
  downloads: number;
  author: string;
}

const categoryConfig: Record<Category, { color: string; bg: string; border: string }> = {
  'محاضرات': { color: 'text-blue-400', bg: 'bg-blue-500/15', border: 'border-blue-500/30' },
  'ملخصات': { color: 'text-purple-400', bg: 'bg-purple-500/15', border: 'border-purple-500/30' },
  'مشاريع تخرج': { color: 'text-emerald-400', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30' },
  'أبحاث': { color: 'text-amber-400', bg: 'bg-amber-500/15', border: 'border-amber-500/30' },
};

const fileTypeConfig: Record<FileType, { icon: string; color: string; bg: string }> = {
  'PDF': { icon: '📄', color: 'text-red-400', bg: 'bg-red-500/15' },
  'PPTX': { icon: '📊', color: 'text-orange-400', bg: 'bg-orange-500/15' },
  'DOC': { icon: '📝', color: 'text-blue-400', bg: 'bg-blue-500/15' },
};

const departments: Department[] = ['الذكاء الاصطناعي', 'علوم البيانات', 'الأمن السيبراني', 'الميكاترونكس', 'الأوتوترونكس'];
const categories: Category[] = ['محاضرات', 'ملخصات', 'مشاريع تخرج', 'أبحاث'];

const resources: Resource[] = [
  {
    id: 1,
    title: 'مقدمة في الذكاء الاصطناعي',
    category: 'محاضرات',
    department: 'الذكاء الاصطناعي',
    description: 'محاضرات تأسيسية في مفاهيم الذكاء الاصطناعي وتطبيقاته المختلفة',
    fileType: 'PDF',
    fileSize: '12.5 MB',
    downloads: 342,
    author: 'د. أحمد محمود',
  },
  {
    id: 2,
    title: 'تحليل البيانات باستخدام Python',
    category: 'محاضرات',
    department: 'علوم البيانات',
    description: 'سلسلة محاضرات شاملة عن تحليل البيانات باستخدام مكتبات بايثون',
    fileType: 'PPTX',
    fileSize: '28.3 MB',
    downloads: 567,
    author: 'د. سارة علي',
  },
  {
    id: 3,
    title: 'أساسيات الأمن السيبراني',
    category: 'محاضرات',
    department: 'الأمن السيبراني',
    description: 'مقدمة شاملة في أمن المعلومات والشبكات وأساليب الحماية',
    fileType: 'PDF',
    fileSize: '8.7 MB',
    downloads: 289,
    author: 'د. محمد حسن',
  },
  {
    id: 4,
    title: 'ملخص التعلم العميق',
    category: 'ملخصات',
    department: 'الذكاء الاصطناعي',
    description: 'ملخص شامل لمادة التعلم العميق يشمل الشبكات العصبية و CNN و RNN',
    fileType: 'PDF',
    fileSize: '5.2 MB',
    downloads: 891,
    author: 'طالب - عمر خالد',
  },
  {
    id: 5,
    title: 'مشروع تخرج: نظام التعرف على الوجوه',
    category: 'مشاريع تخرج',
    department: 'الذكاء الاصطناعي',
    description: 'مشروع تخرج يستخدم تقنيات الرؤية الحاسوبية للتعرف على الوجوه في الوقت الحقيقي',
    fileType: 'PDF',
    fileSize: '15.8 MB',
    downloads: 156,
    author: 'فريق التخرج 2024',
  },
  {
    id: 6,
    title: 'بحث: تحسين أداء الشبكات العصبية',
    category: 'أبحاث',
    department: 'الذكاء الاصطناعي',
    description: 'بحث أكاديمي حول تقنيات تحسين أداء الشبكات العصبية العميقة',
    fileType: 'PDF',
    fileSize: '3.4 MB',
    downloads: 98,
    author: 'د. فاطمة يوسف',
  },
  {
    id: 7,
    title: 'ملخص قواعد البيانات المتقدمة',
    category: 'ملخصات',
    department: 'علوم البيانات',
    description: 'ملخص شامل لمادة قواعد البيانات المتقدمة يشمل NoSQL و Big Data',
    fileType: 'DOC',
    fileSize: '4.1 MB',
    downloads: 445,
    author: 'طالبة - نور أحمد',
  },
  {
    id: 8,
    title: 'مشروع تخرج: منصة تحليل بيانات ذكية',
    category: 'مشاريع تخرج',
    department: 'علوم البيانات',
    description: 'منصة ويب ذكية لتحليل وعرض البيانات بطرق تفاعلية',
    fileType: 'PPTX',
    fileSize: '22.1 MB',
    downloads: 134,
    author: 'فريق التخرج 2024',
  },
  {
    id: 9,
    title: 'اختبار الاختراق والأمن الأخلاقي',
    category: 'محاضرات',
    department: 'الأمن السيبراني',
    description: 'محاضرات عن تقنيات اختبار الاختراق الأخلاقي وأدوات الأمان',
    fileType: 'PDF',
    fileSize: '11.9 MB',
    downloads: 378,
    author: 'د. خالد إبراهيم',
  },
  {
    id: 10,
    title: 'ملخص أنظمة التحكم الآلي',
    category: 'ملخصات',
    department: 'الميكاترونكس',
    description: 'ملخص مبسط لمادة أنظمة التحكم الآلي مع أمثلة تطبيقية',
    fileType: 'PDF',
    fileSize: '6.8 MB',
    downloads: 267,
    author: 'طالب - يوسف عادل',
  },
  {
    id: 11,
    title: 'مشروع تخرج: روبوت صناعي ذكي',
    category: 'مشاريع تخرج',
    department: 'الميكاترونكس',
    description: 'تصميم وبناء روبوت صناعي ذكي قادر على التعلم والتكيف',
    fileType: 'PPTX',
    fileSize: '35.2 MB',
    downloads: 201,
    author: 'فريق التخرج 2024',
  },
  {
    id: 12,
    title: 'أساسيات أنظمة السيارات الذكية',
    category: 'محاضرات',
    department: 'الأوتوترونكس',
    description: 'مقدمة في الأنظمة الإلكترونية للسيارات الحديثة والذكية',
    fileType: 'PDF',
    fileSize: '9.5 MB',
    downloads: 189,
    author: 'د. عمرو سعيد',
  },
  {
    id: 13,
    title: 'بحث: تقنيات القيادة الذاتية',
    category: 'أبحاث',
    department: 'الأوتوترونكس',
    description: 'بحث شامل عن تقنيات القيادة الذاتية والمستشعرات المستخدمة',
    fileType: 'PDF',
    fileSize: '7.3 MB',
    downloads: 145,
    author: 'د. هناء مصطفى',
  },
  {
    id: 14,
    title: 'ملخص التشفير وأمن الشبكات',
    category: 'ملخصات',
    department: 'الأمن السيبراني',
    description: 'ملخص شامل لمادة التشفير وأمن الشبكات مع أمثلة عملية',
    fileType: 'DOC',
    fileSize: '3.9 MB',
    downloads: 512,
    author: 'طالب - كريم وائل',
  },
  {
    id: 15,
    title: 'بحث: تطبيقات إنترنت الأشياء في الصناعة',
    category: 'أبحاث',
    department: 'الميكاترونكس',
    description: 'بحث عن استخدام تقنيات IoT في التصنيع الذكي والأتمتة',
    fileType: 'PDF',
    fileSize: '5.6 MB',
    downloads: 178,
    author: 'د. ليلى عبدالرحمن',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
};

export default function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<Department | 'الكل'>('الكل');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'الكل'>('الكل');

  const filteredResources = useMemo(() => {
    return resources.filter((r) => {
      const matchesSearch =
        searchQuery === '' ||
        r.title.includes(searchQuery) ||
        r.description.includes(searchQuery) ||
        r.author.includes(searchQuery);
      const matchesDept = selectedDepartment === 'الكل' || r.department === selectedDepartment;
      const matchesCat = selectedCategory === 'الكل' || r.category === selectedCategory;
      return matchesSearch && matchesDept && matchesCat;
    });
  }, [searchQuery, selectedDepartment, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#050505]">
{/* Hero Section */}
      <section className="relative pt-20 pb-12 px-4 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 right-1/4 w-80 h-80 bg-[#3b82f6]/8 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-[#14b8a6]/8 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-[#3b82f6]/10 border border-[#3b82f6]/20 rounded-full px-5 py-2 mb-6"
          >
            <span className="text-2xl">📚</span>
            <span className="text-[#60a5fa] text-sm font-medium">مصادر تعليمية متنوعة</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            المكتبة{' '}
            <span className="bg-gradient-to-r from-[#14b8a6] to-[#3b82f6] bg-clip-text text-transparent">الرقمية</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto mb-10"
          >
            اكتشف المحاضرات والملخصات ومشاريع التخرج والأبحاث من جميع الأقسام
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-xl mx-auto"
          >
            <div className="relative">
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xl">🔍</span>
              <input
                type="text"
                placeholder="ابحث عن محاضرة، ملخص، أو مشروع..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl py-4 px-12 text-white placeholder-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14b8a6] focus:bg-white/[0.06] transition-all duration-300"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="max-w-6xl mx-auto px-4 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-5"
        >
          {/* Department Filter */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm text-gray-500 font-medium">القسم:</span>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value as Department | 'الكل')}
              className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14b8a6] transition-all appearance-none cursor-pointer min-w-[180px]"
            >
              <option value="الكل" className="bg-[#111111]">الكل</option>
              {departments.map((dept) => (
                <option key={dept} value={dept} className="bg-[#111111]">{dept}</option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm text-gray-500 font-medium">النوع:</span>
            <button
              onClick={() => setSelectedCategory('الكل')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14b8a6] ${
                selectedCategory === 'الكل'
                  ? 'bg-white/[0.1] text-white border border-white/[0.15]'
                  : 'bg-white/[0.03] text-gray-400 border border-white/[0.08] hover:bg-white/[0.06]'
              }`}
            >
              الكل
            </button>
            {categories.map((cat) => {
              const config = categoryConfig[cat];
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14b8a6] ${
                    selectedCategory === cat
                      ? `${config.bg} ${config.color} border ${config.border}`
                      : 'bg-white/[0.03] text-gray-400 border border-white/[0.08] hover:bg-white/[0.06]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* Results Count */}
      <section className="max-w-6xl mx-auto px-4 mb-6">
        <p className="text-sm text-gray-500">
          عرض <span className="text-white font-semibold">{filteredResources.length}</span> من{' '}
          <span className="text-white font-semibold">{resources.length}</span> مصدر
        </p>
      </section>

      {/* Resources Grid */}
      <section className="max-w-6xl mx-auto px-4 pb-24">
        <AnimatePresence mode="wait">
          {filteredResources.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-bold text-white mb-2">لا توجد نتائج</h3>
              <p className="text-gray-400">جرب تغيير معايير البحث أو الفلتر</p>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredResources.map((resource) => {
                const catConfig = categoryConfig[resource.category];
                const ftConfig = fileTypeConfig[resource.fileType];

                return (
                  <motion.div
                    key={resource.id}
                    variants={cardVariants}
                    layout
                    className="group bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 hover:bg-white/[0.06] hover:border-[#14b8a6]/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#14b8a6]/5 flex flex-col"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className={`w-12 h-12 rounded-xl ${ftConfig.bg} flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform`}>
                        {ftConfig.icon}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${catConfig.bg} ${catConfig.color}`}>
                          {resource.category}
                        </span>
                        <span className={`px-2 py-1 rounded-lg text-xs ${ftConfig.bg} ${ftConfig.color}`}>
                          {resource.fileType}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-base font-bold text-white mb-2 line-clamp-2">{resource.title}</h3>
                    <p className="text-sm text-gray-400 mb-4 line-clamp-2 flex-1">{resource.description}</p>

                    {/* Meta */}
                    <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        🏛️ {resource.department}
                      </span>
                      <span className="flex items-center gap-1">
                        👤 {resource.author}
                      </span>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/[0.05]">
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>📦 {resource.fileSize}</span>
                        <span>⬇️ {resource.downloads}</span>
                      </div>
                      <a
                        href="#"
                        className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#14b8a6] to-[#0d9488] text-white px-4 py-2 rounded-xl text-xs font-medium hover:shadow-lg hover:shadow-[#14b8a6]/25 transition-all duration-300 group-hover:scale-105"
                      >
                        <span>⬇️</span>
                        تحميل
                      </a>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}
