'use client';


import { motion } from 'framer-motion';
import { Calendar, ArrowLeft, Bell, Sparkles } from 'lucide-react';

const sampleNews = [
  {
    id: 1,
    title: 'فتح باب التقديم للعام الجامعي 2025/2026',
    excerpt: 'تعلن جامعة حلوان التكنولوجية الدولية عن فتح باب التقديم للطلاب الجدد في جميع الأقسام العلمية السبعة للعام الجامعي الجديد.',
    date: '2025-07-01',
    category: 'قبول',
    color: 'from-[#10b981] to-[#14b8a6]',
    icon: '🎓',
  },
  {
    id: 2,
    title: 'نتائج امتحانات الفصل الدراسي الثاني',
    excerpt: 'تم اعتماد نتائج امتحانات الفصل الدراسي الثاني لجميع الفرق الدراسية. يمكن للطلاب الاطلاع على النتائج من خلال المنصة.',
    date: '2025-06-20',
    category: 'نتائج',
    color: 'from-[#3b82f6] to-[#6366f1]',
    icon: '📋',
  },
  {
    id: 3,
    title: 'ورشة عمل: مستقبل الذكاء الاصطناعي في مصر',
    excerpt: 'تنظم الجامعة ورشة عمل حول تطبيقات الذكاء الاصطناعي ومستقبله في السوق المصري بمشاركة خبراء من كبرى الشركات التقنية.',
    date: '2025-06-15',
    category: 'فعاليات',
    color: 'from-[#8b5cf6] to-[#a855f7]',
    icon: '🤖',
  },
  {
    id: 4,
    title: 'شراكة جديدة مع جامعات دولية',
    excerpt: 'وقعت الجامعة اتفاقيات شراكة جديدة مع عدة جامعات دولية في إطار برنامج 2+2 لتوسيع فرص الطلاب الأكاديمية.',
    date: '2025-06-10',
    category: 'أخبار',
    color: 'from-[#f59e0b] to-[#ea580c]',
    icon: '🌍',
  },
  {
    id: 5,
    title: 'تكريم أوائل الطلاب للعام الجامعي 2024/2025',
    excerpt: 'أقامت الجامعة حفل تكريم لأوائل الطلاب المتفوقين من جميع الأقسام العلمية في احتفالية كبيرة بحضور قيادات الجامعة.',
    date: '2025-06-05',
    category: 'فعاليات',
    color: 'from-[#eab308] to-[#d97706]',
    icon: '🏆',
  },
  {
    id: 6,
    title: 'إطلاق المنصة الرقمية الجديدة للجامعة',
    excerpt: 'تم إطلاق المنصة الرقمية الجديدة التي تضم جميع الخدمات الطلابية والأكاديمية في مكان واحد مع تصميم عصري ومتكامل.',
    date: '2025-05-28',
    category: 'تقنية',
    color: 'from-[#06b6d4] to-[#3b82f6]',
    icon: '💻',
  },
];

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-[#050505]">

      {/* ===== Hero Section ===== */}
      <section className="relative overflow-hidden bg-[#050505] py-32 pt-40">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-[#14b8a6]/10 blur-3xl animate-float" />
          <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-[#3b82f6]/10 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>
        <div className="pointer-events-none absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <div className="animate-fade-in mb-6 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-5 py-2 backdrop-blur-xl">
            <span className="h-2 w-2 rounded-full bg-gradient-to-r from-[#14b8a6] to-[#3b82f6] animate-pulse" />
            <span className="text-sm font-medium text-gray-400">HITU News</span>
          </div>
          <h1 className="animate-slide-up text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6 leading-tight">📰 آخر <span className="text-gradient-brand bg-gradient-to-r from-[#14b8a6] to-[#3b82f6] bg-clip-text text-transparent">الأخبار</span></h1>
          <p className="animate-slide-up text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed" style={{ animationDelay: '150ms' }}>تابع آخر أخبار الجامعة، الفعاليات، والإعلانات المهمة</p>
        </div>
      </section>

      {/* ===== News Grid ===== */}
      <section className="relative bg-[#050505] py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Coming Soon Badge */}
          <div className="mb-12 text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#14b8a6] to-[#3b82f6] px-5 py-2 text-sm font-bold text-white shadow-lg shadow-[#14b8a6]/25">
              <Sparkles className="h-4 w-4" />
              قريباً — نظام الأخبار المتكامل
            </span>
          </div>

          {/* News Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {sampleNews.map((article, index) => (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl overflow-hidden hover:-translate-y-1 hover:border-[#14b8a6]/30 transition-all duration-300"
              >
                {/* Card Header with Gradient */}
                <div className={`h-32 bg-gradient-to-br ${article.color} flex items-center justify-center relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/20" />
                  <span className="text-5xl relative z-10">{article.icon}</span>
                  {/* Category Badge */}
                  <span className="absolute top-4 left-4 z-10 inline-flex items-center rounded-full bg-black/30 backdrop-blur-sm border border-white/[0.12] px-3 py-1 text-xs font-bold text-white">
                    {article.category}
                  </span>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3 text-gray-500 text-xs">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(article.date).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#14b8a6] group-hover:to-[#3b82f6] transition-all duration-300 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed line-clamp-3 mb-4">
                    {article.excerpt}
                  </p>
                  <span className="inline-flex items-center gap-2 text-sm font-bold text-[#2dd4bf] group-hover:gap-3 transition-all duration-300">
                    اقرأ المزيد
                    <ArrowLeft className="h-3.5 w-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </span>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Newsletter / Coming Soon */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-20 rounded-2xl bg-[#111111]/80 backdrop-blur-xl border border-white/[0.08] p-8 sm:p-12 text-center relative overflow-hidden"
          >
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-[#14b8a6]/10 blur-3xl" />
              <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-[#3b82f6]/10 blur-3xl" />
            </div>
            <div className="relative">
              <Bell className="h-12 w-12 text-[#2dd4bf] mx-auto mb-4" />
              <h3 className="text-2xl sm:text-3xl font-black text-white mb-3">ابقَ على <span className="bg-gradient-to-r from-[#f59e0b] to-[#eab308] bg-clip-text text-transparent">اطلاع</span></h3>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">سيتم إطلاق نظام الإشعارات والأخبار المتكامل قريباً. ترقبوا التحديثات!</p>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-6 py-3 backdrop-blur-xl">
                <span className="h-2 w-2 rounded-full bg-gradient-to-r from-[#10b981] to-[#14b8a6] animate-pulse" />
                <span className="text-sm font-medium text-gray-300">قيد التطوير</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>


    </div>
  );
}
