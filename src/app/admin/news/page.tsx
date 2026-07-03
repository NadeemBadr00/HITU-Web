'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  category: string;
  date: string;
  image: string;
  published: boolean;
}

const defaultNews: NewsItem[] = [
  { id: '1', title: 'افتتاح المعمل الجديد للذكاء الاصطناعي', content: 'تم افتتاح معمل جديد مجهز بأحدث التقنيات لطلاب قسم الذكاء الاصطناعي. يحتوي المعمل على أحدث أجهزة الحوسبة عالية الأداء وبيئات تطوير متقدمة لدعم الأبحاث والمشاريع الطلابية.', category: 'أكاديمي', date: '2025-01-15', image: '', published: true },
  { id: '2', title: 'نتائج امتحانات الفصل الدراسي الأول', content: 'تم اعتماد نتائج امتحانات الفصل الدراسي الأول لجميع الأقسام. يمكن للطلاب الاطلاع على نتائجهم من خلال البوابة الإلكترونية أو تطبيق الجامعة.', category: 'إداري', date: '2025-01-10', image: '', published: true },
  { id: '3', title: 'مؤتمر التكنولوجيا السنوي', content: 'تنظم الجامعة المؤتمر السنوي للتكنولوجيا والابتكار بمشاركة نخبة من الخبراء والباحثين من مصر والعالم. سيتضمن المؤتمر ورش عمل وعروض تقديمية.', category: 'فعاليات', date: '2025-01-05', image: '', published: true },
  { id: '4', title: 'برنامج التدريب الصيفي', content: 'يسر الجامعة الإعلان عن برنامج التدريب الصيفي بالتعاون مع شركات التكنولوجيا الكبرى مثل Google و Microsoft و Amazon. البرنامج متاح لطلاب السنة الثالثة والرابعة.', category: 'فرص', date: '2024-12-28', image: '', published: false },
  { id: '5', title: 'تطوير المناهج الدراسية', content: 'تم الانتهاء من تطوير المناهج الدراسية لتتوافق مع أحدث المعايير الدولية ومتطلبات سوق العمل المتغيرة في مجال التكنولوجيا.', category: 'أكاديمي', date: '2024-12-20', image: '', published: true },
  { id: '6', title: 'زيارة وفد جامعة أكسفورد', content: 'استقبلت الجامعة وفداً أكاديمياً من جامعة أكسفورد لبحث سبل التعاون المشترك في مجالات البحث العلمي وتبادل الطلاب والأساتذة.', category: 'دولي', date: '2024-12-15', image: '', published: true },
];

const newsCategories = ['الكل', 'أكاديمي', 'إداري', 'فعاليات', 'فرص', 'دولي'];

const categoryColors: Record<string, string> = {
  'أكاديمي': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'إداري': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  'فعاليات': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  'فرص': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'دولي': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
};

const emptyNews: Omit<NewsItem, 'id'> = {
  title: '', content: '', category: 'أكاديمي', date: new Date().toISOString().split('T')[0], image: '', published: true,
};

export default function AdminNews() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [filter, setFilter] = useState('الكل');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null);
  const [form, setForm] = useState(emptyNews);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('hitu-admin-news');
    if (stored) {
      setNews(JSON.parse(stored));
    } else {
      setNews(defaultNews);
      localStorage.setItem('hitu-admin-news', JSON.stringify(defaultNews));
    }
    setMounted(true);
  }, []);

  const saveNews = (data: NewsItem[]) => {
    setNews(data);
    localStorage.setItem('hitu-admin-news', JSON.stringify(data));
  };

  const filtered = filter === 'الكل' ? news : news.filter((n) => n.category === filter);
  const publishedCount = news.filter((n) => n.published).length;
  const draftCount = news.filter((n) => !n.published).length;

  const openAdd = () => {
    setEditingItem(null);
    setForm(emptyNews);
    setModalOpen(true);
  };

  const openEdit = (item: NewsItem) => {
    setEditingItem(item);
    setForm({ title: item.title, content: item.content, category: item.category, date: item.date, image: item.image, published: item.published });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.title.trim()) return;
    if (editingItem) {
      saveNews(news.map((n) => n.id === editingItem.id ? { ...n, ...form } : n));
    } else {
      saveNews([{ ...form, id: Date.now().toString() }, ...news]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    saveNews(news.filter((n) => n.id !== id));
    setDeleteConfirm(null);
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">إدارة الأخبار</h1>
          <p className="text-slate-400 mt-1">إضافة وتعديل ونشر الأخبار</p>
        </div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={openAdd} className="px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl font-medium text-sm hover:shadow-lg hover:shadow-primary-500/25 transition-shadow flex items-center gap-2 self-start">
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 4.5v15m7.5-7.5h-15" /></svg>
          إضافة خبر
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-white">{news.length}</p>
          <p className="text-slate-400 text-sm">إجمالي الأخبار</p>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-emerald-400">{publishedCount}</p>
          <p className="text-slate-400 text-sm">منشور</p>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-amber-400">{draftCount}</p>
          <p className="text-slate-400 text-sm">مسودة</p>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {newsCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === cat
                ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg shadow-primary-500/25'
                : 'bg-slate-800/50 text-slate-400 border border-white/10 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-right text-sm font-medium text-slate-400 p-4">العنوان</th>
              <th className="text-right text-sm font-medium text-slate-400 p-4">التصنيف</th>
              <th className="text-right text-sm font-medium text-slate-400 p-4">التاريخ</th>
              <th className="text-right text-sm font-medium text-slate-400 p-4">الحالة</th>
              <th className="text-right text-sm font-medium text-slate-400 p-4">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item, index) => (
              <motion.tr
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <td className="p-4">
                  <div>
                    <p className="text-white font-medium">{item.title}</p>
                    <p className="text-slate-500 text-xs mt-1 max-w-[300px] truncate">{item.content}</p>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${categoryColors[item.category] || 'bg-slate-500/10 text-slate-400'}`}>
                    {item.category}
                  </span>
                </td>
                <td className="p-4 text-slate-400 text-sm">{item.date}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
                    item.published
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {item.published ? 'منشور' : 'مسودة'}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(item)} className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors">
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" /></svg>
                    </button>
                    <button onClick={() => setDeleteConfirm(item.id)} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="p-12 text-center text-slate-500">
            <p className="text-4xl mb-3">📰</p>
            <p>لا توجد أخبار في هذا التصنيف</p>
          </div>
        )}
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {filtered.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-4"
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-white font-bold flex-1">{item.title}</h3>
              <span className={`px-2 py-1 rounded-lg text-xs font-medium ms-2 ${
                item.published ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
              }`}>
                {item.published ? 'منشور' : 'مسودة'}
              </span>
            </div>
            <p className="text-slate-400 text-sm mb-2 line-clamp-2">{item.content}</p>
            <div className="flex items-center justify-between mb-3">
              <span className={`px-2 py-1 rounded-lg text-xs border ${categoryColors[item.category]}`}>{item.category}</span>
              <span className="text-slate-500 text-xs">{item.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => openEdit(item)} className="flex-1 py-2 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors text-sm font-medium">تعديل</button>
              <button onClick={() => setDeleteConfirm(item.id)} className="flex-1 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors text-sm font-medium">حذف</button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Delete Confirm */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setDeleteConfirm(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 w-full max-w-sm text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center text-3xl">⚠️</div>
              <h3 className="text-xl font-bold text-white mb-2">تأكيد الحذف</h3>
              <p className="text-slate-400 text-sm mb-6">هل أنت متأكد من حذف هذا الخبر؟</p>
              <div className="flex gap-3">
                <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-3 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors">حذف</button>
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-3 rounded-xl bg-slate-700 text-white font-medium hover:bg-slate-600 transition-colors">إلغاء</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setModalOpen(false)}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-xl font-bold text-white mb-6">
                {editingItem ? '✏️ تعديل الخبر' : '➕ إضافة خبر جديد'}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-300 mb-2">العنوان *</label>
                  <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full bg-slate-800/50 border border-white/10 rounded-xl text-white px-4 py-3 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition" placeholder="عنوان الخبر" />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-2">المحتوى</label>
                  <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={6} className="w-full bg-slate-800/50 border border-white/10 rounded-xl text-white px-4 py-3 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition resize-none" placeholder="محتوى الخبر..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-300 mb-2">التصنيف</label>
                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full bg-slate-800/50 border border-white/10 rounded-xl text-white px-4 py-3 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition">
                      <option value="أكاديمي">أكاديمي</option>
                      <option value="إداري">إداري</option>
                      <option value="فعاليات">فعاليات</option>
                      <option value="فرص">فرص</option>
                      <option value="دولي">دولي</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-300 mb-2">التاريخ</label>
                    <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full bg-slate-800/50 border border-white/10 rounded-xl text-white px-4 py-3 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-2">رابط الصورة</label>
                  <input type="text" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="w-full bg-slate-800/50 border border-white/10 rounded-xl text-white px-4 py-3 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition" dir="ltr" placeholder="https://..." />
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl border border-white/5">
                  <span className="text-sm text-slate-300">نشر الخبر</span>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, published: !form.published })}
                    className={`relative w-12 h-7 rounded-full transition-colors ${form.published ? 'bg-emerald-500' : 'bg-slate-600'}`}
                  >
                    <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-all ${form.published ? 'left-0.5' : 'left-[22px]'}`} />
                  </button>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={handleSave} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium hover:shadow-lg hover:shadow-primary-500/25 transition-all">
                  {editingItem ? 'حفظ التعديلات' : 'إضافة الخبر'}
                </button>
                <button onClick={() => setModalOpen(false)} className="px-6 py-3 rounded-xl bg-slate-700 text-white font-medium hover:bg-slate-600 transition-colors">إلغاء</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
