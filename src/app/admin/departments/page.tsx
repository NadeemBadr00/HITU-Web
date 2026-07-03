'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Department {
  id: string;
  name_ar: string;
  name_en: string;
  description: string;
  icon: string;
  color: string;
  students: number;
}

const defaultDepartments: Department[] = [
  { id: '1', name_ar: 'علوم الحاسب', name_en: 'Computer Science', description: 'قسم متخصص في علوم الحاسب والبرمجة', icon: '💻', color: '#3b82f6', students: 210 },
  { id: '2', name_ar: 'الذكاء الاصطناعي', name_en: 'Artificial Intelligence', description: 'قسم متخصص في تقنيات الذكاء الاصطناعي', icon: '🤖', color: '#8b5cf6', students: 185 },
  { id: '3', name_ar: 'علوم البيانات', name_en: 'Data Science', description: 'قسم متخصص في تحليل البيانات والإحصاء', icon: '📊', color: '#06b6d4', students: 165 },
  { id: '4', name_ar: 'الأمن السيبراني', name_en: 'Cyber Security', description: 'قسم متخصص في أمن المعلومات والشبكات', icon: '🛡️', color: '#ef4444', students: 178 },
  { id: '5', name_ar: 'الميكاترونكس', name_en: 'Mechatronics', description: 'قسم يجمع بين الهندسة الميكانيكية والإلكترونية', icon: '⚙️', color: '#f59e0b', students: 142 },
  { id: '6', name_ar: 'الأوتوترونكس', name_en: 'Autotronics', description: 'قسم متخصص في تكنولوجيا السيارات الذكية', icon: '🚗', color: '#10b981', students: 120 },
  { id: '7', name_ar: 'الشبكات', name_en: 'Networks', description: 'قسم متخصص في شبكات الحاسب والاتصالات', icon: '🌐', color: '#ec4899', students: 135 },
];

const emptyDept: Omit<Department, 'id'> = {
  name_ar: '', name_en: '', description: '', icon: '📚', color: '#3b82f6', students: 0,
};

export default function AdminDepartments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [form, setForm] = useState(emptyDept);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('hitu-admin-departments');
    if (stored) {
      setDepartments(JSON.parse(stored));
    } else {
      setDepartments(defaultDepartments);
      localStorage.setItem('hitu-admin-departments', JSON.stringify(defaultDepartments));
    }
    setMounted(true);
  }, []);

  const saveDepartments = (depts: Department[]) => {
    setDepartments(depts);
    localStorage.setItem('hitu-admin-departments', JSON.stringify(depts));
  };

  const openAdd = () => {
    setEditingDept(null);
    setForm(emptyDept);
    setModalOpen(true);
  };

  const openEdit = (dept: Department) => {
    setEditingDept(dept);
    setForm({ name_ar: dept.name_ar, name_en: dept.name_en, description: dept.description, icon: dept.icon, color: dept.color, students: dept.students });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.name_ar.trim() || !form.name_en.trim()) return;
    if (editingDept) {
      const updated = departments.map((d) => d.id === editingDept.id ? { ...d, ...form } : d);
      saveDepartments(updated);
    } else {
      const newDept: Department = { ...form, id: Date.now().toString() };
      saveDepartments([...departments, newDept]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    saveDepartments(departments.filter((d) => d.id !== id));
    setDeleteConfirm(null);
  };

  const totalStudents = departments.reduce((sum, d) => sum + d.students, 0);

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">إدارة الأقسام</h1>
          <p className="text-slate-400 mt-1">إضافة وتعديل وحذف الأقسام العلمية</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={openAdd}
          className="px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl font-medium text-sm hover:shadow-lg hover:shadow-primary-500/25 transition-shadow flex items-center gap-2 self-start"
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 4.5v15m7.5-7.5h-15" /></svg>
          إضافة قسم
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-white">{departments.length}</p>
          <p className="text-slate-400 text-sm">إجمالي الأقسام</p>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-white">{totalStudents.toLocaleString('ar-EG')}</p>
          <p className="text-slate-400 text-sm">إجمالي الطلاب</p>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-right text-sm font-medium text-slate-400 p-4">الأيقونة</th>
              <th className="text-right text-sm font-medium text-slate-400 p-4">الاسم بالعربية</th>
              <th className="text-right text-sm font-medium text-slate-400 p-4">الاسم بالإنجليزية</th>
              <th className="text-right text-sm font-medium text-slate-400 p-4">الوصف</th>
              <th className="text-right text-sm font-medium text-slate-400 p-4">عدد الطلاب</th>
              <th className="text-right text-sm font-medium text-slate-400 p-4">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept, index) => (
              <motion.tr
                key={dept.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <td className="p-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ backgroundColor: dept.color + '20' }}>
                    {dept.icon}
                  </div>
                </td>
                <td className="p-4 text-white font-medium">{dept.name_ar}</td>
                <td className="p-4 text-slate-300 text-sm">{dept.name_en}</td>
                <td className="p-4 text-slate-400 text-sm max-w-[200px] truncate">{dept.description}</td>
                <td className="p-4">
                  <span className="px-3 py-1 rounded-lg text-sm font-medium bg-primary-500/10 text-primary-400">
                    {dept.students}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(dept)} className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors">
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" /></svg>
                    </button>
                    <button onClick={() => setDeleteConfirm(dept.id)} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {departments.map((dept, index) => (
          <motion.div
            key={dept.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-4"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ backgroundColor: dept.color + '20' }}>
                {dept.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-white font-bold">{dept.name_ar}</h3>
                <p className="text-slate-400 text-sm">{dept.name_en}</p>
              </div>
              <span className="px-3 py-1 rounded-lg text-xs font-medium bg-primary-500/10 text-primary-400">
                {dept.students} طالب
              </span>
            </div>
            <p className="text-slate-400 text-sm mb-3">{dept.description}</p>
            <div className="flex items-center gap-2">
              <button onClick={() => openEdit(dept)} className="flex-1 py-2 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors text-sm font-medium">
                تعديل
              </button>
              <button onClick={() => setDeleteConfirm(dept.id)} className="flex-1 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors text-sm font-medium">
                حذف
              </button>
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
              <p className="text-slate-400 text-sm mb-6">هل أنت متأكد من حذف هذا القسم؟ لا يمكن التراجع عن هذا الإجراء.</p>
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
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                {editingDept ? '✏️ تعديل القسم' : '➕ إضافة قسم جديد'}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-300 mb-2">الاسم بالعربية *</label>
                  <input type="text" value={form.name_ar} onChange={(e) => setForm({ ...form, name_ar: e.target.value })} className="w-full bg-slate-800/50 border border-white/10 rounded-xl text-white px-4 py-3 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition" placeholder="مثال: علوم الحاسب" />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-2">الاسم بالإنجليزية *</label>
                  <input type="text" value={form.name_en} onChange={(e) => setForm({ ...form, name_en: e.target.value })} className="w-full bg-slate-800/50 border border-white/10 rounded-xl text-white px-4 py-3 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition" dir="ltr" placeholder="e.g. Computer Science" />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-2">الوصف</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full bg-slate-800/50 border border-white/10 rounded-xl text-white px-4 py-3 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition resize-none" placeholder="وصف مختصر للقسم" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-300 mb-2">الأيقونة (Emoji)</label>
                    <input type="text" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="w-full bg-slate-800/50 border border-white/10 rounded-xl text-white px-4 py-3 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition text-center text-2xl" />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-300 mb-2">اللون</label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className="w-12 h-12 rounded-xl border border-white/10 cursor-pointer bg-transparent" />
                      <input type="text" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className="flex-1 bg-slate-800/50 border border-white/10 rounded-xl text-white px-4 py-3 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition text-sm" dir="ltr" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-2">عدد الطلاب</label>
                  <input type="number" value={form.students} onChange={(e) => setForm({ ...form, students: parseInt(e.target.value) || 0 })} className="w-full bg-slate-800/50 border border-white/10 rounded-xl text-white px-4 py-3 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition" min="0" />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={handleSave} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium hover:shadow-lg hover:shadow-primary-500/25 transition-all">
                  {editingDept ? 'حفظ التعديلات' : 'إضافة القسم'}
                </button>
                <button onClick={() => setModalOpen(false)} className="px-6 py-3 rounded-xl bg-slate-700 text-white font-medium hover:bg-slate-600 transition-colors">
                  إلغاء
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
