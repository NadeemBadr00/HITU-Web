'use client';

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core';
import {
  Filter, Download, Printer, FileSpreadsheet, Image as ImageIcon,
  Calendar, ChevronDown, Eye, Layers, Grid3X3,
  Lock, Unlock, Undo2, Save, Info, Sparkles, Pin,
} from 'lucide-react';
import {
  DEPARTMENTS, Department, DAYS, Day, DEPARTMENT_COLORS,
  type TimetableEntry, type TimeSlot,
  SAMPLE_TIME_SLOTS, SAMPLE_PROFESSORS, SAMPLE_ROOMS,
  generateSampleTimetable,
} from '@/lib/timetable-types';
import { exportTimetablePDF, exportTimetableExcel } from '@/lib/export-utils';

// ==========================================
// Styling constants
// ==========================================
const selectClass = 'bg-[#111111] border border-white/[0.08] rounded-xl px-3 py-2.5 text-white text-sm focus:border-[#14b8a6]/50 focus:ring-2 focus:ring-[#14b8a6]/20 focus:outline-none transition-all appearance-none cursor-pointer [&>option]:bg-[#111111] [&>option]:text-white min-w-[130px]';

// ==========================================
// Toast Component
// ==========================================
function Toast({ message, onClose, variant = 'info' }: { message: string; onClose: () => void; variant?: 'info' | 'error' | 'success' }) {
  const icons = { info: '🚧', error: '⛔', success: '✅' };
  const borders = { info: 'border-white/[0.08]', error: 'border-[#ef4444]/40', success: 'border-[#10b981]/40' };
  const bgs = { info: 'bg-[#111111]/90', error: 'bg-[#450a0a]/90', success: 'bg-[#052e16]/90' };
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] ${bgs[variant]} backdrop-blur-xl border ${borders[variant]} text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-sm`}
    >
      <span>{icons[variant]}</span>
      {message}
      <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors mr-2">✕</button>
    </motion.div>
  );
}

// ==========================================
// Draggable Entry Card
// ==========================================
function DraggableEntryCard({
  entry,
  editMode,
  isPinned,
  onTogglePin,
}: {
  entry: TimetableEntry;
  editMode: boolean;
  isPinned: boolean;
  onTogglePin: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: entry.id,
    data: { entry },
    disabled: !editMode || isPinned,
  });

  const colors = DEPARTMENT_COLORS[entry.course.department];

  return (
    <div
      ref={setNodeRef}
      {...(editMode && !isPinned ? { ...listeners, ...attributes } : {})}
      className={`
        ${isPinned ? 'bg-[#f59e0b]/10 border-[#f59e0b]/50' : `${colors.bg} ${colors.border}`} border rounded-xl p-2.5 relative
        ${editMode && !isPinned ? 'cursor-grab active:cursor-grabbing' : isPinned ? 'cursor-default' : 'cursor-pointer'}
        hover:scale-[1.02] hover:shadow-lg transition-all group/cell
        print:border-gray-400 print:bg-gray-50
        ${isDragging ? 'opacity-30 scale-95' : ''}
        ${isPinned ? 'ring-1 ring-[#f59e0b]/30 shadow-md shadow-[#f59e0b]/10' : ''}
      `}
      style={{ touchAction: 'none' }}
      title={isPinned ? 'محاضرة مثبتة — لا يمكن نقلها' : ''}
    >
      {/* Pin button */}
      <button
        onClick={(e) => { e.stopPropagation(); onTogglePin(entry.id); }}
        className={`absolute top-1.5 left-1.5 w-6 h-6 rounded-lg flex items-center justify-center transition-all z-10
          ${isPinned
            ? 'bg-[#f59e0b]/30 text-[#fcd34d] border border-[#f59e0b]/40 opacity-100'
            : 'opacity-0 group-hover/cell:opacity-100 bg-white/[0.05] text-gray-400 hover:text-[#fcd34d] hover:bg-[#f59e0b]/20 border border-transparent hover:border-[#f59e0b]/30'
          }`}
        title={isPinned ? 'إلغاء التثبيت' : 'تثبيت المحاضرة'}
      >
        <Pin className={`w-3 h-3 ${isPinned ? 'fill-[#f59e0b]' : ''}`} />
      </button>

      <div className={`text-xs font-bold ${colors.text} mb-1 print:text-black ${isPinned ? 'pr-0 pl-6' : ''}`}>
        {entry.course.name_ar}
      </div>
      <div className="text-[10px] text-gray-300 print:text-gray-700">
        👨‍🏫 {entry.professor.name}
      </div>
      <div className="text-[10px] text-gray-400 print:text-gray-500">
        🏢 {entry.room.name}
      </div>
      <div className="flex items-center justify-between mt-1.5">
        <span className={`text-[9px] px-1.5 py-0.5 rounded-md ${colors.bg} ${colors.text} border ${colors.border} print:text-gray-600`}>
          {entry.course.department}
        </span>
        <span className="text-[9px] text-gray-500 print:text-gray-500">
          {entry.group.section}
        </span>
      </div>
    </div>
  );
}

// ==========================================
// Drag Overlay Ghost Card
// ==========================================
function DragOverlayCard({ entry }: { entry: TimetableEntry }) {
  const colors = DEPARTMENT_COLORS[entry.course.department];
  return (
    <div
      className={`
        ${colors.bg} ${colors.border} border rounded-xl p-2.5
        shadow-2xl shadow-[#14b8a6]/30
        rotate-2 scale-105 opacity-90
        min-w-[150px]
      `}
      style={{ pointerEvents: 'none' }}
    >
      <div className={`text-xs font-bold ${colors.text} mb-1`}>
        {entry.course.name_ar}
      </div>
      <div className="text-[10px] text-gray-300">
        👨‍🏫 {entry.professor.name}
      </div>
      <div className="text-[10px] text-gray-400">
        🏢 {entry.room.name}
      </div>
      <div className="flex items-center justify-between mt-1.5">
        <span className={`text-[9px] px-1.5 py-0.5 rounded-md ${colors.bg} ${colors.text} border ${colors.border}`}>
          {entry.course.department}
        </span>
        <span className="text-[9px] text-gray-500">
          {entry.group.section}
        </span>
      </div>
    </div>
  );
}

// ==========================================
// Droppable Cell Wrapper
// ==========================================
function DroppableCell({
  day,
  slotId,
  children,
  editMode,
}: {
  day: Day;
  slotId: string;
  children: React.ReactNode;
  editMode: boolean;
}) {
  const droppableId = `${day}::${slotId}`;
  const { setNodeRef, isOver } = useDroppable({
    id: droppableId,
    data: { day, slotId },
    disabled: !editMode,
  });

  return (
    <td
      ref={setNodeRef}
      className={`
        p-1.5 border-b border-l border-white/[0.05] align-top min-w-[160px]
        print:border-gray-200 transition-all duration-200
        ${isOver ? 'bg-[#14b8a6]/15 ring-2 ring-[#2dd4bf]/50 ring-inset shadow-inner shadow-[#14b8a6]/20' : ''}
        ${editMode && !isOver ? 'hover:bg-white/[0.02]' : ''}
      `}
    >
      {children}
    </td>
  );
}

// ==========================================
// Main Page Component
// ==========================================
export default function TimetableViewerPage() {
  // Filters
  const [filterDept, setFilterDept] = useState<string>('الكل');
  const [filterYear, setFilterYear] = useState<string>('الكل');
  const [filterProf, setFilterProf] = useState<string>('الكل');
  const [filterRoom, setFilterRoom] = useState<string>('الكل');
  const [pinFilter, setPinFilter] = useState<'all' | 'pinned' | 'unpinned'>('all');
  const [toast, setToast] = useState<{ message: string; variant: 'info' | 'error' | 'success' } | null>(null);

  // Drag & Drop state
  const [editMode, setEditMode] = useState(false);
  const [entries, setEntries] = useState<TimetableEntry[]>(() => generateSampleTimetable());
  const [activeEntry, setActiveEntry] = useState<TimetableEntry | null>(null);
  const [undoStack, setUndoStack] = useState<TimetableEntry[][]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSampleData, setIsSampleData] = useState(true);
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);

  // Keep reference to the original generated data for initial comparison
  const originalEntries = useRef<TimetableEntry[]>(entries);

  // Load generated timetable from localStorage if available
  useEffect(() => {
    try {
      const stored = localStorage.getItem('hitu_generated_timetable');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.entries && parsed.entries.length > 0) {
          setEntries(parsed.entries);
          originalEntries.current = parsed.entries;
          setIsSampleData(false);
          const at = localStorage.getItem('hitu_generated_at');
          if (at) setGeneratedAt(at);
        }
      }
    } catch {
      // Ignore parse errors, keep sample data
    }
  }, []);

  // Pin state
  const [pinnedIds, setPinnedIds] = useState<Set<string>>(() => {
    if (typeof window === 'undefined') return new Set<string>();
    try {
      const stored = localStorage.getItem('hitu_pinned_entries');
      return stored ? new Set(JSON.parse(stored)) : new Set<string>();
    } catch { return new Set<string>(); }
  });

  // Persist pinned state
  useEffect(() => {
    localStorage.setItem('hitu_pinned_entries', JSON.stringify([...pinnedIds]));
  }, [pinnedIds]);

  const togglePin = useCallback((id: string) => {
    setPinnedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const timeSlots = SAMPLE_TIME_SLOTS;
  const workingDays: Day[] = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء'];

  // DnD sensors
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 8 },
  });
  const sensors = useSensors(pointerSensor);

  // Apply filters
  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      if (filterDept !== 'الكل' && entry.course.department !== filterDept) return false;
      if (filterYear !== 'الكل' && entry.group.year !== parseInt(filterYear)) return false;
      if (filterProf !== 'الكل' && entry.professor.name !== filterProf) return false;
      if (filterRoom !== 'الكل' && entry.room.name !== filterRoom) return false;
      if (pinFilter === 'pinned' && !pinnedIds.has(entry.id)) return false;
      if (pinFilter === 'unpinned' && pinnedIds.has(entry.id)) return false;
      return true;
    });
  }, [entries, filterDept, filterYear, filterProf, filterRoom, pinFilter, pinnedIds]);

  const pinnedCount = useMemo(() => {
    return entries.filter(e => pinnedIds.has(e.id)).length;
  }, [entries, pinnedIds]);

  // Get entries for a specific cell
  const getCellEntries = (day: Day, slotId: string): TimetableEntry[] => {
    return filteredEntries.filter(e => e.day === day && e.slot_id === slotId);
  };

  const showToast = useCallback((msg: string, variant: 'info' | 'error' | 'success' = 'info') => {
    setToast({ message: msg, variant });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const uniqueProfs = [...new Set(entries.map(e => e.professor.name))];
  const uniqueRooms = [...new Set(entries.map(e => e.room.name))];

  // ==========================================
  // Conflict Detection
  // ==========================================
  const checkConflict = useCallback(
    (entryToMove: TimetableEntry, targetDay: Day, targetSlotId: string): string | null => {
      // Check against ALL entries (not just filtered)
      for (const existing of entries) {
        if (existing.id === entryToMove.id) continue;
        if (existing.day !== targetDay || existing.slot_id !== targetSlotId) continue;

        // Same room conflict
        if (existing.room.id === entryToMove.room.id) {
          return `تعارض: القاعة "${existing.room.name}" مشغولة بمحاضرة "${existing.course.name_ar}"`;
        }
        // Same professor conflict
        if (existing.professor.id === entryToMove.professor.id) {
          return `تعارض: الأستاذ "${existing.professor.name}" لديه محاضرة "${existing.course.name_ar}" في نفس الوقت`;
        }
      }
      return null;
    },
    [entries]
  );

  // ==========================================
  // DnD Handlers
  // ==========================================
  const handleDragStart = useCallback((event: DragStartEvent) => {
    const entry = event.active.data.current?.entry as TimetableEntry | undefined;
    if (entry) setActiveEntry(entry);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveEntry(null);

      const { active, over } = event;
      if (!over) return;

      const draggedEntry = active.data.current?.entry as TimetableEntry | undefined;
      if (!draggedEntry) return;

      const overData = over.data.current as { day?: Day; slotId?: string } | undefined;
      // If dropped on another entry (the droppable is also an entry), resolve from the cell
      const targetDay = overData?.day;
      const targetSlotId = overData?.slotId;

      if (!targetDay || !targetSlotId) return;

      // No-op if same cell
      if (draggedEntry.day === targetDay && draggedEntry.slot_id === targetSlotId) return;

      // Validate conflicts
      const conflict = checkConflict(draggedEntry, targetDay, targetSlotId);
      if (conflict) {
        showToast(conflict, 'error');
        return;
      }

      // Save undo snapshot
      setUndoStack(prev => [...prev, entries.map(e => ({ ...e }))]);

      // Move the entry
      setEntries(prev =>
        prev.map(e =>
          e.id === draggedEntry.id
            ? { ...e, day: targetDay, slot_id: targetSlotId }
            : e
        )
      );
      setHasChanges(true);
      showToast(`تم نقل "${draggedEntry.course.name_ar}" إلى ${targetDay} — ${timeSlots.find(s => s.id === targetSlotId)?.label ?? ''}`, 'success');
    },
    [entries, checkConflict, showToast, timeSlots]
  );

  const handleDragCancel = useCallback(() => {
    setActiveEntry(null);
  }, []);

  // ==========================================
  // Undo
  // ==========================================
  const handleUndo = useCallback(() => {
    if (undoStack.length === 0) return;
    const previous = undoStack[undoStack.length - 1];
    setEntries(previous);
    setUndoStack(prev => prev.slice(0, -1));
    if (undoStack.length <= 1) setHasChanges(false);
    showToast('تم التراجع عن آخر عملية', 'info');
  }, [undoStack, showToast]);

  // ==========================================
  // Save
  // ==========================================
  const handleSave = useCallback(() => {
    // Persist changes (in a real app this would call an API)
    originalEntries.current = entries.map(e => ({ ...e }));
    setUndoStack([]);
    setHasChanges(false);
    showToast('تم حفظ التعديلات بنجاح', 'success');
  }, [entries, showToast]);

  return (
    <div className="min-h-screen bg-[#050505] print:bg-white print:text-black">
      <div className="print:hidden">
</div>

      {/* Hero */}
      <div className="relative overflow-hidden print:hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#14b8a6]/8 via-transparent to-transparent" />
        <div className="absolute top-20 left-20 w-72 h-72 bg-[#3b82f6]/5 rounded-full blur-3xl" />
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-10 pb-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <div className="inline-flex items-center gap-2 bg-[#14b8a6]/10 border border-[#14b8a6]/20 rounded-full px-4 py-1.5 mb-3">
                  <Grid3X3 className="w-4 h-4 text-[#2dd4bf]" />
                  <span className="text-sm text-[#5eead4]">عرض الجدول</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white">
                  الجدول <span className="bg-gradient-to-r from-[#14b8a6] to-[#3b82f6] bg-clip-text text-transparent">الدراسي</span>
                </h1>
                <p className="text-gray-400 text-sm mt-1">الفصل الدراسي الأول 2026/2027</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                {/* Edit Mode Toggle */}
                <button
                  onClick={() => setEditMode(prev => !prev)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                    editMode
                      ? 'bg-[#f59e0b]/20 border-[#f59e0b]/40 text-[#fcd34d] hover:bg-[#f59e0b]/30 shadow-lg shadow-[#f59e0b]/10'
                      : 'bg-white/[0.03] border-white/[0.08] text-gray-300 hover:bg-white/[0.05]'
                  }`}
                >
                  {editMode ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  {editMode ? 'وضع التحرير' : 'مقفل'}
                </button>

                {/* Undo Button */}
                <AnimatePresence>
                  {editMode && undoStack.length > 0 && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      onClick={handleUndo}
                      className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.08] text-gray-300 px-4 py-2.5 rounded-xl text-sm hover:bg-white/[0.05] transition-all"
                    >
                      <Undo2 className="w-4 h-4" />
                      تراجع
                    </motion.button>
                  )}
                </AnimatePresence>

                <button
                  onClick={() => exportTimetablePDF(filteredEntries, { department: filterDept, year: filterYear, professor: filterProf, room: filterRoom })}
                  className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.08] text-gray-300 px-4 py-2.5 rounded-xl text-sm hover:bg-white/[0.05] transition-all"
                >
                  <Download className="w-4 h-4" /> PDF
                </button>
                <button
                  onClick={() => exportTimetableExcel(filteredEntries)}
                  className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.08] text-gray-300 px-4 py-2.5 rounded-xl text-sm hover:bg-white/[0.05] transition-all"
                >
                  <FileSpreadsheet className="w-4 h-4" /> Excel
                </button>
                <button
                  onClick={() => showToast('سيتم إضافة تصدير كصورة قريباً')}
                  className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.08] text-gray-300 px-4 py-2.5 rounded-xl text-sm hover:bg-white/[0.05] transition-all"
                >
                  <ImageIcon className="w-4 h-4" /> صورة
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 bg-gradient-to-r from-[#14b8a6] to-[#0d9488] text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-[#14b8a6]/25 transition-all"
                >
                  <Printer className="w-4 h-4" /> طباعة
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Sample Data Banner */}
      {isSampleData && (
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 mb-4 print:hidden">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#f59e0b]/10 border border-[#f59e0b]/20 rounded-xl px-4 py-3 flex items-center gap-3"
          >
            <Info className="w-4 h-4 text-[#fbbf24] flex-shrink-0" />
            <span className="text-sm text-[#fcd34d]">
              هذا جدول تجريبي — استخدم صفحة الإدخال لتوليد جدول حقيقي
            </span>
            <a
              href="/timetable/input"
              className="flex-shrink-0 flex items-center gap-1.5 bg-[#f59e0b]/20 border border-[#f59e0b]/30 text-[#fcd34d] px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-[#f59e0b]/30 transition-all"
            >
              <Sparkles className="w-3 h-3" />
              توليد جدول
            </a>
          </motion.div>
        </div>
      )}

      {/* Generated Data Banner */}
      {!isSampleData && generatedAt && (
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 mb-4 print:hidden">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#10b981]/10 border border-[#10b981]/20 rounded-xl px-4 py-3 flex items-center gap-3"
          >
            <Sparkles className="w-4 h-4 text-[#34d399] flex-shrink-0" />
            <span className="text-sm text-[#6ee7b7]">
              جدول مولّد بالذكاء الاصطناعي — تم التوليد {new Date(generatedAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </span>
          </motion.div>
        </div>
      )}

      {/* Filters */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 mb-6 print:hidden">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-[#2dd4bf]" />
            <span className="text-sm font-medium text-white">تصفية</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">القسم</label>
              <select className={selectClass} value={filterDept} onChange={e => setFilterDept(e.target.value)}>
                <option value="الكل">الكل</option>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">السنة</label>
              <select className={selectClass} value={filterYear} onChange={e => setFilterYear(e.target.value)}>
                <option value="الكل">الكل</option>
                {[1, 2, 3, 4].map(y => <option key={y} value={y}>السنة {y}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">الأستاذ</label>
              <select className={selectClass} value={filterProf} onChange={e => setFilterProf(e.target.value)}>
                <option value="الكل">الكل</option>
                {uniqueProfs.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">القاعة</label>
              <select className={selectClass} value={filterRoom} onChange={e => setFilterRoom(e.target.value)}>
                <option value="الكل">الكل</option>
                {uniqueRooms.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">التثبيت</label>
              <select className={selectClass} value={pinFilter} onChange={e => setPinFilter(e.target.value as 'all' | 'pinned' | 'unpinned')}>
                <option value="all">الكل</option>
                <option value="pinned">📌 مثبتة فقط</option>
                <option value="unpinned">غير مثبتة</option>
              </select>
            </div>
          </div>
          {(filterDept !== 'الكل' || filterYear !== 'الكل' || filterProf !== 'الكل' || filterRoom !== 'الكل' || pinFilter !== 'all') && (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs text-gray-400">
                يعرض {filteredEntries.length} من {entries.length} محاضرة
              </span>
              {pinnedCount > 0 && (
                <span className="text-xs bg-[#f59e0b]/15 text-[#fcd34d] border border-[#f59e0b]/20 rounded-lg px-2.5 py-0.5 flex items-center gap-1.5">
                  <Pin className="w-3 h-3 fill-[#f59e0b]" />
                  {pinnedCount} محاضرات مثبتة
                </span>
              )}
              <button
                onClick={() => { setFilterDept('الكل'); setFilterYear('الكل'); setFilterProf('الكل'); setFilterRoom('الكل'); setPinFilter('all'); }}
                className="text-xs text-[#2dd4bf] hover:text-[#5eead4] transition-colors"
              >
                إعادة تعيين
              </button>
            </div>
          )}
          {(filterDept === 'الكل' && filterYear === 'الكل' && filterProf === 'الكل' && filterRoom === 'الكل' && pinFilter === 'all') && pinnedCount > 0 && (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs bg-[#f59e0b]/15 text-[#fcd34d] border border-[#f59e0b]/20 rounded-lg px-2.5 py-0.5 flex items-center gap-1.5">
                <Pin className="w-3 h-3 fill-[#f59e0b]" />
                {pinnedCount} محاضرات مثبتة
              </span>
            </div>
          )}
        </motion.div>
      </div>

      {/* Edit Mode Banner */}
      <AnimatePresence>
        {editMode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="max-w-[1400px] mx-auto px-4 sm:px-6 mb-4 print:hidden"
          >
            <div className="bg-[#f59e0b]/10 border border-[#f59e0b]/30 rounded-xl px-4 py-2.5 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#fbbf24] animate-pulse" />
              <span className="text-sm text-[#fcd34d]">
                وضع التحرير — اسحب المحاضرات لنقلها بين الخانات
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Timetable Grid */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pb-12">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl overflow-hidden print:bg-white print:border-gray-300"
          >
            <div className="overflow-x-auto scrollbar-hide">
              <table className="w-full min-w-[900px] border-collapse">
                {/* Header - Days */}
                <thead>
                  <tr>
                    <th className="sticky right-0 z-10 bg-[#111111]/95 backdrop-blur-xl p-4 border-b border-l border-white/[0.08] min-w-[120px] print:bg-gray-100 print:border-gray-300">
                      <div className="flex items-center gap-2 justify-center">
                        <Calendar className="w-4 h-4 text-[#2dd4bf] print:text-blue-600" />
                        <span className="text-sm font-bold text-white print:text-black">الوقت</span>
                      </div>
                    </th>
                    {workingDays.map((day, i) => (
                      <th
                        key={day}
                        className="p-4 border-b border-l border-white/[0.08] print:border-gray-300"
                      >
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 * i }}
                          className="text-center"
                        >
                          <span className="text-sm font-bold bg-gradient-to-r from-[#2dd4bf] to-[#60a5fa] bg-clip-text text-transparent print:text-black">
                            {day}
                          </span>
                        </motion.div>
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* Body - Time Slots × Days */}
                <tbody>
                  {timeSlots.map((slot, si) => (
                    <tr key={slot.id} className="group">
                      {/* Time Column */}
                      <td className="sticky right-0 z-10 bg-[#111111]/95 backdrop-blur-xl p-3 border-b border-l border-white/[0.08] print:bg-gray-50 print:border-gray-300">
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.05 * si }}
                          className="text-center"
                        >
                          <div className="text-xs font-bold text-white print:text-black">{slot.label}</div>
                          <div className="text-[10px] text-gray-500 font-mono mt-0.5 print:text-gray-600">{slot.start_time} - {slot.end_time}</div>
                        </motion.div>
                      </td>

                      {/* Day Cells */}
                      {workingDays.map((day, di) => {
                        const cellEntries = getCellEntries(day, slot.id);
                        return (
                          <DroppableCell
                            key={`${day}-${slot.id}`}
                            day={day}
                            slotId={slot.id}
                            editMode={editMode}
                          >
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.02 * (si * workingDays.length + di) }}
                            >
                              {cellEntries.length > 0 ? (
                                <div className="space-y-1">
                                  {cellEntries.map((entry) => (
                                    <DraggableEntryCard
                                      key={entry.id}
                                      entry={entry}
                                      editMode={editMode}
                                      isPinned={pinnedIds.has(entry.id)}
                                      onTogglePin={togglePin}
                                    />
                                  ))}
                                </div>
                              ) : (
                                <div className="h-20 flex items-center justify-center">
                                  <span className="text-gray-700 text-xs">—</span>
                                </div>
                              )}
                            </motion.div>
                          </DroppableCell>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Drag Overlay — rendered at top-level with rotation and scale */}
          <DragOverlay dropAnimation={{
            duration: 250,
            easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
          }}>
            {activeEntry ? <DragOverlayCard entry={activeEntry} /> : null}
          </DragOverlay>
        </DndContext>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-4 print:bg-white print:border-gray-300"
        >
          <div className="flex items-center gap-2 mb-3">
            <Layers className="w-4 h-4 text-[#2dd4bf] print:text-blue-600" />
            <span className="text-sm font-bold text-white print:text-black">دليل الألوان</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {DEPARTMENTS.map(dept => {
              const colors = DEPARTMENT_COLORS[dept];
              return (
                <div key={dept} className={`flex items-center gap-2 ${colors.bg} ${colors.border} border rounded-lg px-3 py-1.5`}>
                  <div className={`w-2.5 h-2.5 rounded-full ${colors.text === 'text-blue-300' ? 'bg-blue-400' : colors.text === 'text-purple-300' ? 'bg-purple-400' : colors.text === 'text-emerald-300' ? 'bg-emerald-400' : colors.text === 'text-red-300' ? 'bg-red-400' : colors.text === 'text-amber-300' ? 'bg-amber-400' : colors.text === 'text-cyan-300' ? 'bg-cyan-400' : 'bg-pink-400'}`} />
                  <span className={`text-xs font-medium ${colors.text} print:text-black`}>{dept}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Stats Summary */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 print:hidden"
        >
          {[
            { label: 'إجمالي المحاضرات', value: filteredEntries.length, icon: Calendar, color: 'text-[#2dd4bf]' },
            { label: 'محاضرات مثبتة', value: pinnedCount, icon: Pin, color: 'text-[#fbbf24]' },
            { label: 'الأساتذة', value: new Set(filteredEntries.map(e => e.professor.id)).size, icon: Eye, color: 'text-[#60a5fa]' },
            { label: 'القاعات المستخدمة', value: new Set(filteredEntries.map(e => e.room.id)).size, icon: Layers, color: 'text-[#34d399]' },
          ].map((stat, i) => (
            <div key={i} className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-xl p-4 text-center">
              <stat.icon className={`w-5 h-5 ${stat.color} mx-auto mb-2`} />
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Floating Save Button */}
      <AnimatePresence>
        {hasChanges && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            onClick={handleSave}
            className="fixed bottom-8 right-8 z-50 flex items-center gap-2 bg-gradient-to-r from-[#10b981] to-[#059669] text-white px-6 py-3.5 rounded-2xl text-sm font-bold shadow-2xl shadow-[#10b981]/30 hover:shadow-[#10b981]/50 hover:scale-105 transition-all print:hidden"
          >
            <Save className="w-5 h-5" />
            حفظ التعديلات
          </motion.button>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && <Toast message={toast.message} variant={toast.variant} onClose={() => setToast(null)} />}
      </AnimatePresence>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body { background: white !important; color: black !important; }
          .print\\:hidden { display: none !important; }
          .print\\:bg-white { background: white !important; }
          .print\\:text-black { color: black !important; }
          .print\\:border-gray-300 { border-color: #d1d5db !important; }
          .print\\:border-gray-200 { border-color: #e5e7eb !important; }
          .print\\:border-gray-400 { border-color: #9ca3af !important; }
          .print\\:bg-gray-100 { background: #f3f4f6 !important; }
          .print\\:bg-gray-50 { background: #f9fafb !important; }
          .print\\:text-gray-700 { color: #374151 !important; }
          .print\\:text-gray-600 { color: #4b5563 !important; }
          .print\\:text-gray-500 { color: #6b7280 !important; }
          .print\\:text-blue-600 { color: #2563eb !important; }
        }
      `}</style>
    </div>
  );
}
