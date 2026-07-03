'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Student {
  id: string;
  name: string;
  student_id: string;
  department: string;
  year: number;
  gpa: number;
  email: string;
  status: 'active' | 'inactive' | 'graduated';
}

const defaultStudents: Student[] = [
  { id: '1', name: 'أحمد محمد حسن', student_id: 'HITU-2024-001', department: 'علوم الحاسب', year: 1, gpa: 3.7, email: 'ahmed@student.hitu.edu.eg', status: 'active' },
  { id: '2', name: 'فاطمة علي سالم', student_id: 'HITU-2024-002', department: 'الذكاء الاصطناعي', year: 2, gpa: 3.9, email: 'fatma@student.hitu.edu.eg', status: 'active' },
  { id: '3', name: 'خالد إبراهيم عمر', student_id: 'HITU-2024-003', department: 'علوم البيانات', year: 3, gpa: 2.8, email: 'khaled@student.hitu.edu.eg', status: 'active' },
  { id: '4', name: 'نورا حسين أحمد', student_id: 'HITU-2024-004', department: 'الأمن السيبراني', year: 1, gpa: 3.5, email: 'nora@student.hitu.edu.eg', status: 'active' },
  { id: '5', name: 'محمود سعيد عبدالله', student_id: 'HITU-2024-005', department: 'الميكاترونكس', year: 4, gpa: 3.2, email: 'mahmoud@student.hitu.edu.eg', status: 'active' },
  { id: '6', name: 'سارة حسن محمد', student_id: 'HITU-2024-006', department: 'الأوتوترونكس', year: 2, gpa: 3.8, email: 'sara@student.hitu.edu.eg', status: 'active' },
  { id: '7', name: 'عمر طارق يوسف', student_id: 'HITU-2024-007', department: 'الشبكات', year: 3, gpa: 2.5, email: 'omar@student.hitu.edu.eg', status: 'inactive' },
  { id: '8', name: 'ريم عادل فوزي', student_id: 'HITU-2024-008', department: 'علوم الحاسب', year: 1, gpa: 3.6, email: 'reem@student.hitu.edu.eg', status: 'active' },
  { id: '9', name: 'يوسف كمال حسن', student_id: 'HITU-2024-009', department: 'الذكاء الاصطناعي', year: 2, gpa: 2.3, email: 'youssef@student.hitu.edu.eg', status: 'active' },
  { id: '10', name: 'مريم سامي أحمد', student_id: 'HITU-2024-010', department: 'علوم البيانات', year: 4, gpa: 3.9, email: 'mariam@student.hitu.edu.eg', status: 'graduated' },
  { id: '11', name: 'حسن علاء محمد', student_id: 'HITU-2024-011', department: 'الأمن السيبراني', year: 1, gpa: 3.1, email: 'hassan@student.hitu.edu.eg', status: 'active' },
  { id: '12', name: 'دينا محمد عبدالرحمن', student_id: 'HITU-2024-012', department: 'الميكاترونكس', year: 3, gpa: 3.4, email: 'dina@student.hitu.edu.eg', status: 'active' },
  { id: '13', name: 'كريم أشرف سعيد', student_id: 'HITU-2024-013', department: 'الأوتوترونكس', year: 2, gpa: 2.9, email: 'karim@student.hitu.edu.eg', status: 'active' },
  { id: '14', name: 'هبة إبراهيم محمود', student_id: 'HITU-2024-014', department: 'الشبكات', year: 4, gpa: 3.7, email: 'heba@student.hitu.edu.eg', status: 'active' },
  { id: '15', name: 'عبدالرحمن خالد علي', student_id: 'HITU-2024-015', department: 'علوم الحاسب', year: 2, gpa: 2.1, email: 'abdelrahman@student.hitu.edu.eg', status: 'inactive' },
  { id: '16', name: 'لمياء فتحي حسن', student_id: 'HITU-2024-016', department: 'الذكاء الاصطناعي', year: 3, gpa: 3.8, email: 'lamia@student.hitu.edu.eg', status: 'active' },
  { id: '17', name: 'تامر وليد إبراهيم', student_id: 'HITU-2024-017', department: 'علوم البيانات', year: 1, gpa: 3.3, email: 'tamer@student.hitu.edu.eg', status: 'active' },
  { id: '18', name: 'جنا أحمد محمد', student_id: 'HITU-2024-018', department: 'الأمن السيبراني', year: 2, gpa: 3.6, email: 'jana@student.hitu.edu.eg', status: 'active' },
  { id: '19', name: 'إسلام رضا عبدالله', student_id: 'HITU-2024-019', department: 'الميكاترونكس', year: 4, gpa: 2.7, email: 'islam@student.hitu.edu.eg', status: 'active' },
  { id: '20', name: 'ياسمين محمد حسن', student_id: 'HITU-2024-020', department: 'الأوتوترونكس', year: 1, gpa: 3.5, email: 'yasmin@student.hitu.edu.eg', status: 'active' },
];

const departments = ['الكل', 'علوم الحاسب', 'الذكاء الاصطناعي', 'علوم البيانات', 'الأمن السيبراني', 'الميكاترونكس', 'الأوتوترونكس', 'الشبكات'];
const years = ['الكل', '1', '2', '3', '4'];
const statuses = [
  { key: 'all', label: 'الكل' },
  { key: 'active', label: 'نشط' },
  { key: 'inactive', label: 'غير نشط' },
  { key: 'graduated', label: 'خريج' },
];

const statusBadge: Record<string, { label: string; color: string }> = {
  active: { label: 'نشط', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  inactive: { label: 'غير نشط', color: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
  graduated: { label: 'خريج', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
};

const PAGE_SIZE = 8;

const emptyStudent: Omit<Student, 'id'> = {
  name: '', student_id: '', department: 'علوم الحاسب', year: 1, gpa: 0, email: '', status: 'active',
};

export default function AdminStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('الكل');
  const [yearFilter, setYearFilter] = useState('الكل');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [form, setForm] = useState(emptyStudent);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('hitu-admin-students');
    if (stored) {
      setStudents(JSON.parse(stored));
    } else {
      setStudents(defaultStudents);
      localStorage.setItem('hitu-admin-students', JSON.stringify(defaultStudents));
    }
    setMounted(true);
  }, []);

  const saveStudents = (data: Student[]) => {
    setStudents(data);
    localStorage.setItem('hitu-admin-students', JSON.stringify(data));
  };

  const filtered = useMemo(() => {
    return students.filter((s) => {
      if (search && !s.name.includes(search) && !s.student_id.toLowerCase().includes(search.toLowerCase())) return false;
      if (deptFilter !== 'الكل' && s.department !== deptFilter) return false;
      if (yearFilter !== 'الكل' && s.year !== parseInt(yearFilter)) return false;
      if (statusFilter !== 'all' && s.status !== statusFilter) return false;
      return true;
    });
  }, [students, search, deptFilter, yearFilter, statusFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  useEffect(() => { setCurrentPage(1); }, [search, deptFilter, yearFilter, statusFilter]);

  const activeCount = students.filter((s) => s.status === 'active').length;
  const inactiveCount = students.filter((s) => s.status === 'inactive').length;
  const graduatedCount = students.filter((s) => s.status === 'graduated').length;

  const openAdd = () => { setEditingStudent(null); setForm(emptyStudent); setModalOpen(true); };
  const openEdit = (student: Student) => {
    setEditingStudent(student);
    setForm({ name: student.name, student_id: student.student_id, department: student.department, year: student.year, gpa: student.gpa, email: student.email, status: student.status });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.student_id.trim()) return;
    if (editingStudent) {
      saveStudents(students.map((s) => s.id === editingStudent.id ? { ...s, ...form } : s));
    } else {
      saveStudents([...students, { ...form, id: Date.now().toString() }]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    saveStudents(students.filter((s) => s.id !== id));
    setDeleteConfirm(null);
  };

  const getGpaColor = (gpa: number) => {
    if (gpa >= 3.5) return 'text-emerald-400';
    if (gpa >= 2.5) return 'text-amber-400';
    return 'text-red-400';
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">إدارة الطلاب</h1>
          <p className="text-slate-400 mt-1">البحث وإدارة بيانات الطلاب</p>
        </div>
        <div className="flex items-center gap-3 self-start">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => alert('هذه الميزة قيد التطوير')}
            className="px-5 py-3 bg-slate-700 text-white rounded-xl font-medium text-sm hover:bg-slate-600 transition-colors flex items-center gap-2"
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" /></svg>
            استيراد CSV
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={openAdd}
            className="px-5 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl font-medium text-sm hover:shadow-lg hover:shadow-primary-500/25 transition-shadow flex items-center gap-2"
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 4.5v15m7.5-7.5h-15" /></svg>
            إضافة طالب
          </motion.button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-white">{students.length}</p>
          <p className="text-slate-400 text-sm">إجمالي الطلاب</p>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-emerald-400">{activeCount}</p>
          <p className="text-slate-400 text-sm">نشط</p>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-slate-400">{inactiveCount}</p>
          <p className="text-slate-400 text-sm">غير نشط</p>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-blue-400">{graduatedCount}</p>
          <p className="text-slate-400 text-sm">خريج</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">بحث</label>
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-slate-700/50 border border-white/10 rounded-xl text-white px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition" placeholder="اسم أو كود الطالب..." />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">القسم</label>
            <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="w-full bg-slate-700/50 border border-white/10 rounded-xl text-white px-4 py-2.5 text-sm focus:border-primary-500 outline-none transition">
              {departments.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">السنة الدراسية</label>
            <select value={yearFilter} onChange={(e) => setYearFilter(e.target.value)} className="w-full bg-slate-700/50 border border-white/10 rounded-xl text-white px-4 py-2.5 text-sm focus:border-primary-500 outline-none transition">
              {years.map((y) => <option key={y} value={y}>{y === 'الكل' ? 'الكل' : `السنة ${y}`}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">الحالة</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full bg-slate-700/50 border border-white/10 rounded-xl text-white px-4 py-2.5 text-sm focus:border-primary-500 outline-none transition">
              {statuses.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="hidden md:block bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-right text-sm font-medium text-slate-400 p-4">الكود</th>
              <th className="text-right text-sm font-medium text-slate-400 p-4">الاسم</th>
              <th className="text-right text-sm font-medium text-slate-400 p-4">القسم</th>
              <th className="text-right text-sm font-medium text-slate-400 p-4">السنة</th>
              <th className="text-right text-sm font-medium text-slate-400 p-4">المعدل</th>
              <th className="text-right text-sm font-medium text-slate-400 p-4">الحالة</th>
              <th className="text-right text-sm font-medium text-slate-400 p-4">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((student, index) => (
              <motion.tr
                key={student.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <td className="p-4 text-slate-400 text-sm font-mono" dir="ltr">{student.student_id}</td>
                <td className="p-4 text-white font-medium">{student.name}</td>
                <td className="p-4 text-slate-300 text-sm">{student.department}</td>
                <td className="p-4 text-slate-300 text-sm text-center">{student.year}</td>
                <td className="p-4">
                  <span className={`font-bold ${getGpaColor(student.gpa)}`}>{student.gpa.toFixed(1)}</span>
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${statusBadge[student.status].color}`}>
                    {statusBadge[student.status].label}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(student)} className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors">
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" /></svg>
                    </button>
                    <button onClick={() => setDeleteConfirm(student.id)} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {paginated.length === 0 && (
          <div className="p-12 text-center text-slate-500">
            <p className="text-4xl mb-3">🎓</p>
            <p>لا توجد نتائج مطابقة</p>
          </div>
        )}
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {paginated.map((student, index) => (
          <motion.div
            key={student.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white font-bold">{student.name}</h3>
              <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${statusBadge[student.status].color}`}>
                {statusBadge[student.status].label}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm text-slate-400 mb-3">
              <p dir="ltr" className="text-start font-mono">{student.student_id}</p>
              <p>{student.department}</p>
              <p>السنة: {student.year}</p>
              <p>المعدل: <span className={`font-bold ${getGpaColor(student.gpa)}`}>{student.gpa.toFixed(1)}</span></p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => openEdit(student)} className="flex-1 py-2 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors text-sm font-medium">تعديل</button>
              <button onClick={() => setDeleteConfirm(student.id)} className="flex-1 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors text-sm font-medium">حذف</button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
          <span className="text-sm text-slate-400">
            عرض {((currentPage - 1) * PAGE_SIZE) + 1} - {Math.min(currentPage * PAGE_SIZE, filtered.length)} من {filtered.length}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded-lg bg-slate-700/50 text-white text-sm disabled:opacity-30 hover:bg-slate-600/50 transition-colors"
            >
              السابق
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                  currentPage === page
                    ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg'
                    : 'bg-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-600/50'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 rounded-lg bg-slate-700/50 text-white text-sm disabled:opacity-30 hover:bg-slate-600/50 transition-colors"
            >
              التالي
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setDeleteConfirm(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 w-full max-w-sm text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center text-3xl">⚠️</div>
              <h3 className="text-xl font-bold text-white mb-2">تأكيد الحذف</h3>
              <p className="text-slate-400 text-sm mb-6">هل أنت متأكد من حذف هذا الطالب؟</p>
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
                {editingStudent ? '✏️ تعديل بيانات الطالب' : '➕ إضافة طالب جديد'}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-300 mb-2">اسم الطالب *</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-slate-800/50 border border-white/10 rounded-xl text-white px-4 py-3 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition" placeholder="الاسم الكامل" />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-2">كود الطالب *</label>
                  <input type="text" value={form.student_id} onChange={(e) => setForm({ ...form, student_id: e.target.value })} className="w-full bg-slate-800/50 border border-white/10 rounded-xl text-white px-4 py-3 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition" dir="ltr" placeholder="HITU-2024-XXX" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-300 mb-2">القسم</label>
                    <select value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className="w-full bg-slate-800/50 border border-white/10 rounded-xl text-white px-4 py-3 focus:border-primary-500 outline-none transition">
                      {departments.filter((d) => d !== 'الكل').map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-300 mb-2">السنة الدراسية</label>
                    <select value={form.year} onChange={(e) => setForm({ ...form, year: parseInt(e.target.value) })} className="w-full bg-slate-800/50 border border-white/10 rounded-xl text-white px-4 py-3 focus:border-primary-500 outline-none transition">
                      <option value={1}>السنة 1</option>
                      <option value={2}>السنة 2</option>
                      <option value={3}>السنة 3</option>
                      <option value={4}>السنة 4</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-300 mb-2">المعدل التراكمي</label>
                    <input type="number" step="0.1" min="0" max="4" value={form.gpa} onChange={(e) => setForm({ ...form, gpa: parseFloat(e.target.value) || 0 })} className="w-full bg-slate-800/50 border border-white/10 rounded-xl text-white px-4 py-3 focus:border-primary-500 outline-none transition" />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-300 mb-2">الحالة</label>
                    <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Student['status'] })} className="w-full bg-slate-800/50 border border-white/10 rounded-xl text-white px-4 py-3 focus:border-primary-500 outline-none transition">
                      <option value="active">نشط</option>
                      <option value="inactive">غير نشط</option>
                      <option value="graduated">خريج</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-2">البريد الإلكتروني</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full bg-slate-800/50 border border-white/10 rounded-xl text-white px-4 py-3 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition" dir="ltr" placeholder="student@student.hitu.edu.eg" />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={handleSave} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium hover:shadow-lg hover:shadow-primary-500/25 transition-all">
                  {editingStudent ? 'حفظ التعديلات' : 'إضافة الطالب'}
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
