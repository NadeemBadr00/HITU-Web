'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Leader {
  id: string;
  name: string;
  position: string;
  department: string;
  image_url: string;
  contact: string;
  category: 'administration' | 'union' | 'committee' | 'department';
}

const defaultLeaders: Leader[] = [
  { id: '1', name: 'أ.د/ محمد أحمد', position: 'عميد الكلية', department: 'الإدارة', image_url: '', contact: 'dean@hitu.edu.eg', category: 'administration' },
  { id: '2', name: 'أ.د/ سارة حسن', position: 'وكيل الكلية لشؤون الطلاب', department: 'الإدارة', image_url: '', contact: 'vdean@hitu.edu.eg', category: 'administration' },
  { id: '3', name: 'د/ أحمد علي', position: 'رئيس قسم علوم الحاسب', department: 'علوم الحاسب', image_url: '', contact: 'cs@hitu.edu.eg', category: 'department' },
  { id: '4', name: 'د/ فاطمة محمود', position: 'رئيس قسم الذكاء الاصطناعي', department: 'الذكاء الاصطناعي', image_url: '', contact: 'ai@hitu.edu.eg', category: 'department' },
  { id: '5', name: 'محمد خالد', position: 'رئيس اتحاد الطلاب', department: 'اتحاد الطلاب', image_url: '', contact: 'union@hitu.edu.eg', category: 'union' },
  { id: '6', name: 'نورهان أحمد', position: 'نائب رئيس اتحاد الطلاب', department: 'اتحاد الطلاب', image_url: '', contact: 'union2@hitu.edu.eg', category: 'union' },
  { id: '7', name: 'د/ كريم محسن', position: 'رئيس لجنة الجودة', department: 'لجنة الجودة', image_url: '', contact: 'quality@hitu.edu.eg', category: 'committee' },
  { id: '8', name: 'د/ هدى سالم', position: 'رئيس لجنة البحث العلمي', department: 'لجنة البحث العلمي', image_url: '', contact: 'research@hitu.edu.eg', category: 'committee' },
];

const categories = [
  { key: 'all', label: 'الكل' },
  { key: 'administration', label: 'الإدارة' },
  { key: 'union', label: 'اتحاد الطلاب' },
  { key: 'committee', label: 'اللجان' },
  { key: 'department', label: 'رؤساء الأقسام' },
];

const categoryBadge: Record<string, { label: string; color: string }> = {
  administration: { label: 'إدارة', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  union: { label: 'اتحاد طلاب', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  committee: { label: 'لجنة', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  department: { label: 'قسم', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
};

const emptyLeader: Omit<Leader, 'id'> = {
  name: '', position: '', department: '', image_url: '', contact: '', category: 'administration',
};

export default function AdminLeaders() {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [filter, setFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLeader, setEditingLeader] = useState<Leader | null>(null);
  const [form, setForm] = useState(emptyLeader);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('hitu-admin-leaders');
    if (stored) {
      setLeaders(JSON.parse(stored));
    } else {
      setLeaders(defaultLeaders);
      localStorage.setItem('hitu-admin-leaders', JSON.stringify(defaultLeaders));
    }
    setMounted(true);
  }, []);

  const saveLeaders = (data: Leader[]) => {
    setLeaders(data);
    localStorage.setItem('hitu-admin-leaders', JSON.stringify(data));
  };

  const filtered = filter === 'all' ? leaders : leaders.filter((l) => l.category === filter);

  const openAdd = () => {
    setEditingLeader(null);
    setForm(emptyLeader);
    setModalOpen(true);
  };

  const openEdit = (leader: Leader) => {
    setEditingLeader(leader);
    setForm({ name: leader.name, position: leader.position, department: leader.department, image_url: leader.image_url, contact: leader.contact, category: leader.category });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.position.trim()) return;
    if (editingLeader) {
      const updated = leaders.map((l) => l.id === editingLeader.id ? { ...l, ...form } : l);
      saveLeaders(updated);
    } else {
      saveLeaders([...leaders, { ...form, id: Date.now().toString() }]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    saveLeaders(leaders.filter((l) => l.id !== id));
    setDeleteConfirm(null);
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">إدارة القيادات</h1>
          <p className="text-slate-400 mt-1">إدارة بيانات القيادات والمسؤولين</p>
        </div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={openAdd} className="px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl font-medium text-sm hover:shadow-lg hover:shadow-primary-500/25 transition-shadow flex items-center gap-2 self-start">
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 4.5v15m7.5-7.5h-15" /></svg>
          إضافة قيادة
        </motion.button>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setFilter(cat.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === cat.key
                ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg shadow-primary-500/25'
                : 'bg-slate-800/50 text-slate-400 border border-white/10 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            {cat.label}
            {cat.key !== 'all' && (
              <span className="ms-2 text-xs opacity-70">
                ({leaders.filter((l) => l.category === cat.key).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-right text-sm font-medium text-slate-400 p-4">الاسم</th>
              <th className="text-right text-sm font-medium text-slate-400 p-4">المنصب</th>
              <th className="text-right text-sm font-medium text-slate-400 p-4">القسم/الجهة</th>
              <th className="text-right text-sm font-medium text-slate-400 p-4">التصنيف</th>
              <th className="text-right text-sm font-medium text-slate-400 p-4">البريد الإلكتروني</th>
              <th className="text-right text-sm font-medium text-slate-400 p-4">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((leader, index) => (
              <motion.tr
                key={leader.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                      {leader.name.charAt(0)}
                    </div>
                    <span className="text-white font-medium">{leader.name}</span>
                  </div>
                </td>
                <td className="p-4 text-slate-300 text-sm">{leader.position}</td>
                <td className="p-4 text-slate-400 text-sm">{leader.department}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${categoryBadge[leader.category].color}`}>
                    {categoryBadge[leader.category].label}
                  </span>
                </td>
                <td className="p-4 text-slate-400 text-sm" dir="ltr">{leader.contact}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(leader)} className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors">
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" /></svg>
                    </button>
                    <button onClick={() => setDeleteConfirm(leader.id)} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
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
            <p className="text-4xl mb-3">👤</p>
            <p>لا توجد قيادات في هذا التصنيف</p>
          </div>
        )}
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {filtered.map((leader, index) => (
          <motion.div
            key={leader.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-4"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {leader.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h3 className="text-white font-bold">{leader.name}</h3>
                <p className="text-slate-400 text-sm">{leader.position}</p>
              </div>
              <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${categoryBadge[leader.category].color}`}>
                {categoryBadge[leader.category].label}
              </span>
            </div>
            <div className="text-sm text-slate-400 mb-3 space-y-1">
              <p>📍 {leader.department}</p>
              <p dir="ltr" className="text-start">📧 {leader.contact}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => openEdit(leader)} className="flex-1 py-2 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors text-sm font-medium">تعديل</button>
              <button onClick={() => setDeleteConfirm(leader.id)} className="flex-1 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors text-sm font-medium">حذف</button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setDeleteConfirm(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 w-full max-w-sm text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center text-3xl">⚠️</div>
              <h3 className="text-xl font-bold text-white mb-2">تأكيد الحذف</h3>
              <p className="text-slate-400 text-sm mb-6">هل أنت متأكد من حذف هذه القيادة؟</p>
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
                {editingLeader ? '✏️ تعديل القيادة' : '➕ إضافة قيادة جديدة'}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-300 mb-2">الاسم *</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-slate-800/50 border border-white/10 rounded-xl text-white px-4 py-3 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition" placeholder="اسم القيادة" />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-2">المنصب *</label>
                  <input type="text" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} className="w-full bg-slate-800/50 border border-white/10 rounded-xl text-white px-4 py-3 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition" placeholder="المنصب الوظيفي" />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-2">القسم / الجهة</label>
                  <input type="text" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className="w-full bg-slate-800/50 border border-white/10 rounded-xl text-white px-4 py-3 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition" placeholder="القسم أو الجهة" />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-2">التصنيف</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Leader['category'] })} className="w-full bg-slate-800/50 border border-white/10 rounded-xl text-white px-4 py-3 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition">
                    <option value="administration">إدارة</option>
                    <option value="union">اتحاد طلاب</option>
                    <option value="committee">لجنة</option>
                    <option value="department">قسم</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-2">رابط الصورة</label>
                  <input type="text" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="w-full bg-slate-800/50 border border-white/10 rounded-xl text-white px-4 py-3 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition" dir="ltr" placeholder="https://..." />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-2">البريد الإلكتروني</label>
                  <input type="email" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} className="w-full bg-slate-800/50 border border-white/10 rounded-xl text-white px-4 py-3 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition" dir="ltr" placeholder="email@hitu.edu.eg" />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={handleSave} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium hover:shadow-lg hover:shadow-primary-500/25 transition-all">
                  {editingLeader ? 'حفظ التعديلات' : 'إضافة القيادة'}
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
