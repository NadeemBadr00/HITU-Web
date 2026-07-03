'use client';

import { useState, useEffect, useCallback } from 'react';
import { type ImportResult, exportToCSV } from '@/lib/csv-import';
import { motion, AnimatePresence } from 'framer-motion';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getDb, COLLECTIONS, HITU_INSTITUTION_ID } from '@/lib/firebase';
import {
  Users, Building2, BookOpen, GraduationCap, Clock, Sparkles,
  Plus, Trash2, Edit, Check, X, Save, ChevronLeft, ChevronRight,
  Zap, Brain, UserCheck, Landmark, SlidersHorizontal, AlertCircle, Cloud, CheckCircle,
} from 'lucide-react';
import {
  DEPARTMENTS, Department, YEAR_LEVELS, SECTIONS, DAYS, Day,
  ROOM_TYPES, RoomType,
  type Professor, type Room, type Course, type StudentGroup,
  type TeachingAssistant, type Building, type ConstraintWeights,
  type Preference, type PreferenceType,
  type TimeSlot, type TimeSettings,
  SAMPLE_TIME_SLOTS, DEFAULT_CONSTRAINT_WEIGHTS, SAMPLE_GROUPS, SAMPLE_PROFESSORS, SAMPLE_TEACHING_ASSISTANTS, SAMPLE_ROOMS, SAMPLE_BUILDINGS, SAMPLE_COURSES,
} from '@/lib/timetable-types';

// ==========================================
// Tab Configuration
// ==========================================
const TABS = [
  { id: 'professors', label: 'الدكاترة', icon: Users },
  { id: 'assistants', label: 'المعيدون', icon: UserCheck },
  { id: 'rooms', label: 'القاعات والمعامل', icon: Building2 },
  { id: 'buildings', label: 'المباني', icon: Landmark },
  { id: 'courses', label: 'المواد الدراسية', icon: BookOpen },
  { id: 'groups', label: 'المجموعات', icon: GraduationCap },
  { id: 'time', label: 'إعدادات الوقت', icon: Clock },
  { id: 'weights', label: 'أوزان القيود', icon: SlidersHorizontal },
] as const;

type TabId = (typeof TABS)[number]['id'];

// ==========================================
// Helper: Generate ID
// ==========================================
const genId = () => Math.random().toString(36).slice(2, 10);

// ==========================================
// Dark-mode input styling
// ==========================================
const inputClass = 'w-full bg-[#111111] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:border-[#14b8a6]/50 focus:ring-2 focus:ring-[#14b8a6]/20 focus:outline-none transition-all text-sm';
const selectClass = 'w-full bg-[#111111] border border-white/[0.08] rounded-xl px-4 py-3 text-white focus:border-[#14b8a6]/50 focus:ring-2 focus:ring-[#14b8a6]/20 focus:outline-none transition-all text-sm appearance-none cursor-pointer [&>option]:bg-[#111111] [&>option]:text-white';
const labelClass = 'block text-sm font-medium text-gray-300 mb-1.5';
const btnPrimary = 'flex items-center gap-2 bg-gradient-to-r from-[#14b8a6] to-[#0d9488] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-[#14b8a6]/25 transition-all active:scale-95';
const btnDanger = 'p-2 rounded-lg text-[#f87171] hover:bg-[#ef4444]/10 transition-all';
const btnEdit = 'p-2 rounded-lg text-[#2dd4bf] hover:bg-[#14b8a6]/10 transition-all';

// ==========================================
// Difficulty labels
// ==========================================
const DIFFICULTY_LABELS: Record<string, string> = {
  easy: 'سهل',
  medium: 'متوسط',
  hard: 'صعب',
};

const PREFERENCE_LABELS: Record<PreferenceType, string> = {
  morning: 'الفترة الصباحية',
  afternoon: 'الفترة المسائية',
  specific_day: 'يوم محدد',
  avoid_consecutive: 'تجنب المحاضرات المتتالية',
};

// ==========================================
// Main Page Component
// ==========================================
// CSV Preview Modal
// ==========================================
function CSVPreviewModal({ result, type, onConfirm, onCancel }: {
  result: ImportResult<Record<string, unknown>>;
  type: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const typeLabels: Record<string, string> = {
    professors: 'الدكاترة', rooms: 'القاعات', courses: 'المواد', groups: 'المجموعات',
  };
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        className="bg-[#111111] border border-white/[0.08] rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-auto"
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold text-white mb-4">استيراد {typeLabels[type] || type}</h3>
        {result.errors.length > 0 && (
          <div className="bg-[#ef4444]/10 border border-[#ef4444]/30 rounded-xl p-3 mb-3">
            <p className="text-[#f87171] text-sm font-medium mb-1">أخطاء ({result.errors.length})</p>
            {result.errors.slice(0, 3).map((e, i) => <p key={i} className="text-[#fca5a5] text-xs">{e}</p>)}
          </div>
        )}
        {result.warnings.length > 0 && (
          <div className="bg-[#f59e0b]/10 border border-[#f59e0b]/30 rounded-xl p-3 mb-3">
            <p className="text-[#fbbf24] text-sm font-medium mb-1">تحذيرات ({result.warnings.length})</p>
            {result.warnings.slice(0, 3).map((w, i) => <p key={i} className="text-[#fcd34d] text-xs">{w}</p>)}
          </div>
        )}
        <div className="bg-[#22c55e]/10 border border-[#22c55e]/30 rounded-xl p-3 mb-4">
          <p className="text-[#4ade80] text-sm font-bold">تم العثور على {result.data.length} عنصر جاهز للاستيراد</p>
        </div>
        {result.data.length > 0 && (
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-xs text-gray-300">
              <thead><tr className="border-b border-white/[0.08]">
                {Object.keys(result.data[0]).slice(0, 4).map(k => <th key={k} className="p-2 text-right">{k}</th>)}
              </tr></thead>
              <tbody>
                {result.data.slice(0, 3).map((row, i) => (
                  <tr key={i} className="border-b border-white/[0.05]">
                    {Object.values(row).slice(0, 4).map((v, j) => <td key={j} className="p-2">{String(v)}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="px-4 py-2 rounded-xl bg-white/[0.03] text-gray-400 hover:bg-white/[0.05] transition-all text-sm">إلغاء</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#16a34a] to-[#10b981] text-white font-medium text-sm hover:shadow-lg transition-all">
            استيراد {result.data.length} عنصر
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ==========================================
// Main Page Component
// ==========================================
export default function TimetableInputPage() {
  const [activeTab, setActiveTab] = useState<TabId>('professors');
  const [globalDeptFilter, setGlobalDeptFilter] = useState<string>('all');
  const [globalYearFilter, setGlobalYearFilter] = useState<string>('all');
  const [showSuccess, setShowSuccess] = useState(false);

  // Data states
  const [professors, setProfessors] = useState<Professor[]>(SAMPLE_PROFESSORS);
  const [assistants, setAssistants] = useState<TeachingAssistant[]>(SAMPLE_TEACHING_ASSISTANTS);
  const [rooms, setRooms] = useState<Room[]>(SAMPLE_ROOMS);
  const [buildings, setBuildings] = useState<Building[]>(SAMPLE_BUILDINGS);
  const [courses, setCourses] = useState<Course[]>(SAMPLE_COURSES);
  const [groups, setGroups] = useState<StudentGroup[]>(SAMPLE_GROUPS);
  const [timeSettings, setTimeSettings] = useState<TimeSettings>({
    slots: [...SAMPLE_TIME_SLOTS],
    working_days: ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'] as Day[],
    semester_name: 'الفصل الدراسي الأول 2026/2027',
  });
  const [constraintWeights, setConstraintWeights] = useState<ConstraintWeights>({ ...DEFAULT_CONSTRAINT_WEIGHTS });
  const [csvPreview, setCsvPreview] = useState<{ result: ImportResult<unknown>; type: string } | null>(null);

  // Cloud Sync State
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);

  // Load from Firebase on mount
  useEffect(() => {
    const fetchCloudData = async () => {
      try {
        const db = getDb();
        const configRef = doc(db, COLLECTIONS.timetables(HITU_INSTITUTION_ID), 'config');
        const docSnap = await getDoc(configRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfessors(data.professors?.length ? data.professors : SAMPLE_PROFESSORS);
          setAssistants(data.assistants?.length ? data.assistants : SAMPLE_TEACHING_ASSISTANTS);
          setRooms(data.rooms?.length ? data.rooms : SAMPLE_ROOMS);
          setBuildings(data.buildings?.length ? data.buildings : SAMPLE_BUILDINGS);
          setCourses(data.courses?.length ? data.courses : SAMPLE_COURSES);
          setGroups(data.groups?.length ? data.groups : SAMPLE_GROUPS);
          if (data.timeSettings) setTimeSettings(data.timeSettings);
          if (data.constraintWeights) setConstraintWeights(data.constraintWeights);
          if (data.lastUpdatedAt) setLastSyncedAt(new Date(data.lastUpdatedAt));
        }
      } catch (err) {
        console.error("Failed to load cloud config", err);
        setSyncError("فشل تحميل البيانات من السحابة");
      }
    };
    fetchCloudData();
  }, []);

  const handleSaveToCloud = async () => {
    setIsSyncing(true);
    setSyncError(null);
    try {
      const db = getDb();
      const configRef = doc(db, COLLECTIONS.timetables(HITU_INSTITUTION_ID), 'config');
      await setDoc(configRef, {
        professors,
        assistants,
        rooms,
        buildings,
        courses,
        groups,
        timeSettings,
        constraintWeights,
        lastUpdatedAt: Date.now()
      });
      setLastSyncedAt(new Date());
    } catch (err) {
      console.error("Save to cloud failed", err);
      setSyncError("فشل حفظ التغييرات في السحابة");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleGenerate = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3500);
  };

  const tabIndex = TABS.findIndex(t => t.id === activeTab);

  return (
    <div className="min-h-screen bg-[#050505]">
{/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#14b8a6]/8 via-transparent to-transparent" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-[#14b8a6]/5 rounded-full blur-3xl" />
        <div className="absolute top-10 left-40 w-56 h-56 bg-[#3b82f6]/5 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-[#14b8a6]/10 border border-[#14b8a6]/20 rounded-full px-4 py-1.5 mb-4">
              <Brain className="w-4 h-4 text-[#2dd4bf]" />
              <span className="text-sm text-[#5eead4]">نظام الجداول الذكية</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              إدارة بيانات <span className="bg-gradient-to-r from-[#14b8a6] to-[#3b82f6] bg-clip-text text-transparent">الجدول</span>
            </h1>
            <p className="text-gray-400 text-sm max-w-xl mx-auto mb-6">
              أدخل بيانات الأساتذة والقاعات والمواد الدراسية لتوليد الجدول الذكي تلقائياً
            </p>
            <div className="flex flex-col items-center justify-center gap-3">
              <button
                onClick={handleSaveToCloud}
                disabled={isSyncing}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#14b8a6] to-[#0d9488] hover:from-[#2dd4bf] hover:to-[#14b8a6] text-white rounded-xl font-medium shadow-lg shadow-[#14b8a6]/25 transition-all disabled:opacity-50"
              >
                {isSyncing ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                حفظ التغييرات في السحابة
              </button>
              
              <div className="flex items-center gap-2 text-xs">
                {syncError ? (
                  <span className="flex items-center gap-1 text-[#f87171] bg-[#ef4444]/10 px-2 py-1 rounded-md">
                    <AlertCircle className="w-3 h-3" />
                    {syncError}
                  </span>
                ) : lastSyncedAt ? (
                  <span className="flex items-center gap-1 text-[#4ade80] bg-[#22c55e]/10 px-2 py-1 rounded-md">
                    <CheckCircle className="w-3 h-3" />
                    آخر حفظ: {lastSyncedAt.toLocaleTimeString('ar-EG')}
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-gray-400">
                    <Cloud className="w-3 h-3" />
                    لم يتم الحفظ في السحابة بعد
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-1 p-1.5 bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl overflow-x-auto scrollbar-hide"
        >
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap flex-1 justify-center ${
                  isActive
                    ? 'text-white'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.03]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-[#14b8a6]/30 to-[#3b82f6]/30 border border-[#14b8a6]/30 rounded-xl"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <Icon className="w-4 h-4 relative z-10" />
                <span className="relative z-10 hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </motion.div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'professors' && (
              <ProfessorsTab professors={professors} setProfessors={setProfessors} globalDeptFilter={globalDeptFilter} courses={courses} />
            )}
            {activeTab === 'assistants' && (
              <AssistantsTab assistants={assistants} setAssistants={setAssistants} professors={professors} rooms={rooms} globalDeptFilter={globalDeptFilter} courses={courses} />
            )}
            {activeTab === 'rooms' && (
              <RoomsTab rooms={rooms} setRooms={setRooms} />
            )}
            {activeTab === 'buildings' && (
              <BuildingsTab buildings={buildings} setBuildings={setBuildings} />
            )}
            {activeTab === 'courses' && (
              <CoursesTab courses={courses} setCourses={setCourses} globalDeptFilter={globalDeptFilter} globalYearFilter={globalYearFilter} />
            )}
            {activeTab === 'groups' && (
              <GroupsTab groups={groups} setGroups={setGroups} courses={courses} globalDeptFilter={globalDeptFilter} globalYearFilter={globalYearFilter} />
            )}
            {activeTab === 'time' && (
              <TimeSettingsTab settings={timeSettings} setSettings={setTimeSettings} />
            )}
            {activeTab === 'weights' && (
              <ConstraintWeightsTab weights={constraintWeights} setWeights={setConstraintWeights} />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => tabIndex > 0 && setActiveTab(TABS[tabIndex - 1].id)}
            disabled={tabIndex === 0}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              tabIndex === 0
                ? 'text-gray-600 cursor-not-allowed'
                : 'text-gray-300 bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.05]'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
            السابق
          </button>
          <div className="flex gap-1.5">
            {TABS.map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === tabIndex ? 'bg-[#14b8a6] w-6' : 'bg-white/[0.15]'}`} />
            ))}
          </div>
          <button
            onClick={() => tabIndex < TABS.length - 1 && setActiveTab(TABS[tabIndex + 1].id)}
            disabled={tabIndex === TABS.length - 1}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              tabIndex === TABS.length - 1
                ? 'text-gray-600 cursor-not-allowed'
                : 'text-gray-300 bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.05]'
            }`}
          >
            التالي
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Generate Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-10 text-center"
        >
          <button
            onClick={handleGenerate}
            className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-[#14b8a6] via-[#3b82f6] to-[#14b8a6] text-white px-10 py-4 rounded-2xl text-lg font-bold shadow-2xl shadow-[#14b8a6]/30 hover:shadow-[#14b8a6]/50 transition-all hover:scale-105 active:scale-95 animated-gradient"
          >
            <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            توليد الجدول الذكي 🧠
            <Zap className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <div className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          <p className="text-gray-500 text-xs mt-3">سيتم استخدام خوارزميات الذكاء الاصطناعي لتوليد جدول مثالي</p>
        </motion.div>
      </div>

      {/* CSV Preview Modal */}
      <AnimatePresence>
        {csvPreview && (
          <CSVPreviewModal
            result={csvPreview.result as ImportResult<Record<string, unknown>>}
            type={csvPreview.type}
            onConfirm={() => {
              const { result, type } = csvPreview;
              switch (type) {
                case 'professors':
                  setProfessors(prev => [...prev, ...(result.data as Professor[])]);
                  break;
                case 'rooms':
                  setRooms(prev => [...prev, ...(result.data as Room[])]);
                  break;
                case 'courses':
                  setCourses(prev => [...prev, ...(result.data as Course[])]);
                  break;
                case 'groups':
                  setGroups(prev => [...prev, ...(result.data as StudentGroup[])]);
                  break;
              }
              setCsvPreview(null);
              setShowSuccess(true);
              setTimeout(() => setShowSuccess(false), 2500);
            }}
            onCancel={() => setCsvPreview(null)}
          />
        )}
      </AnimatePresence>

      {/* Success Overlay */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: 'spring', bounce: 0.4 }}
              className="bg-[#111111]/90 backdrop-blur-2xl border border-white/[0.15] rounded-3xl p-10 text-center max-w-sm mx-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#10b981] to-[#059669] flex items-center justify-center shadow-lg shadow-[#10b981]/30"
              >
                <Check className="w-10 h-10 text-white" />
              </motion.div>
              <h3 className="text-xl font-bold text-white mb-2">تم بنجاح! 🎉</h3>
              <p className="text-gray-400 text-sm mb-4">تم توليد الجدول الذكي بنجاح. يمكنك مراجعته الآن.</p>
              <div className="flex gap-2 justify-center">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ y: 0, opacity: 1 }}
                    animate={{ y: [-20, 0], opacity: [1, 0] }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 1, repeat: 2 }}
                    className="text-2xl"
                  >
                    ✨
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ==========================================
// PROFESSORS TAB
// ==========================================
function ProfessorsTab({ professors, setProfessors, globalDeptFilter, courses }: {
  professors: Professor[];
  setProfessors: React.Dispatch<React.SetStateAction<Professor[]>>;
  globalDeptFilter: string;
  courses: Course[];
}) {
  const [form, setForm] = useState({
    name: '', department: DEPARTMENTS[0] as Department, specialization: '', max_hours: 18,
  });
  const [unavailable, setUnavailable] = useState<{ day: Day; period: number }[]>([]);
  const [preferences, setPreferences] = useState<Preference[]>([]);
  const [taughtCourses, setTaughtCourses] = useState<string[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [editId, setEditId] = useState<string | null>(null);
  const toggleUnavailable = (day: Day, period: number) => {
    setUnavailable(prev => {
      const exists = prev.find(u => u.day === day && u.period === period);
      if (exists) return prev.filter(u => !(u.day === day && u.period === period));
      return [...prev, { day, period }];
    });
  };

  const togglePreference = (type: PreferenceType) => {
    setPreferences(prev => {
      const exists = prev.find(p => p.type === type);
      if (exists) return prev.filter(p => p.type !== type);
      return [...prev, { type }];
    });
  };

  const handleSubmit = () => {
    if (!form.name.trim()) return;
    if (editId) {
      setProfessors(prev => prev.map(p => p.id === editId ? { ...p, ...form, unavailable, preferences, taughtCourses } : p));
      setEditId(null);
    } else {
      setProfessors(prev => [...prev, { id: genId(), ...form, unavailable, preferences, taughtCourses }]);
    }
    setForm({ name: '', department: DEPARTMENTS[0], specialization: '', max_hours: 18 });
    setUnavailable([]);
    setPreferences([]);
  };

  const handleEdit = (p: Professor) => {
    setEditId(p.id);
    setForm({ name: p.name, department: p.department, specialization: p.specialization, max_hours: p.max_hours });
    setUnavailable([...p.unavailable]);
    setPreferences([...(p.preferences || [])]);
  };

  const handleDelete = (id: string) => {
    setProfessors(prev => prev.filter(p => p.id !== id));
    if (editId === id) { setEditId(null); setForm({ name: '', department: DEPARTMENTS[0], specialization: '', max_hours: 18 }); setUnavailable([]); setPreferences([]); }
  };

  return (
    <div className="space-y-6">
      {/* Form */}
      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
          <Users className="w-5 h-5 text-[#2dd4bf]" />
          {editId ? 'تعديل بيانات الأستاذ' : 'إضافة أستاذ جديد'}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          <div>
            <label className={labelClass}>الاسم</label>
            <input type="text" className={inputClass} placeholder="د. أحمد محمود" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div>
            <label className={labelClass}>القسم</label>
            <select className={selectClass} value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value as Department }))}>
              {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>التخصص</label>
            <input type="text" className={inputClass} placeholder="خوارزميات" value={form.specialization} onChange={e => setForm(f => ({ ...f, specialization: e.target.value }))} />
          </div>
          <div>
            <label className={labelClass}>الحد الأقصى للساعات</label>
            <input type="number" className={inputClass} min={1} max={30} value={form.max_hours} onChange={e => setForm(f => ({ ...f, max_hours: parseInt(e.target.value) || 0 }))} />
          </div>
        </div>

        {/* Preferences Section */}
        <div className="mb-5">
          <label className={labelClass}>أفضليات الأستاذ</label>
          <div className="flex flex-wrap gap-3">
            {(Object.keys(PREFERENCE_LABELS) as PreferenceType[]).map(type => {
              const active = preferences.some(p => p.type === type);
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => togglePreference(type)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                    active
                      ? 'bg-[#14b8a6]/20 border-[#14b8a6]/40 text-[#5eead4]'
                      : 'bg-white/[0.03] border-white/[0.08] text-gray-400 hover:bg-white/[0.05]'
                  }`}
                >
                  {active && <Check className="w-3.5 h-3.5 inline-block ml-1.5" />}
                  {PREFERENCE_LABELS[type]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Unavailable Grid */}
        <div className="mb-5">
          <label className={labelClass}>الأوقات غير المتاحة</label>
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-xs">
              <thead>
                <tr>
                  <th className="text-gray-400 p-2 text-right">اليوم / الفترة</th>
                  {SAMPLE_TIME_SLOTS.map((s, i) => (
                    <th key={i} className="text-gray-400 p-2 text-center whitespace-nowrap">{s.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DAYS.map(day => (
                  <tr key={day}>
                    <td className="text-gray-300 p-2 font-medium">{day}</td>
                    {SAMPLE_TIME_SLOTS.map((_, pi) => {
                      const checked = unavailable.some(u => u.day === day && u.period === pi);
                      return (
                        <td key={pi} className="p-2 text-center">
                          <button
                            type="button"
                            onClick={() => toggleUnavailable(day, pi)}
                            className={`w-7 h-7 rounded-lg border transition-all ${
                              checked
                                ? 'bg-[#ef4444]/30 border-[#ef4444]/50 text-[#f87171]'
                                : 'bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.05]'
                            }`}
                          >
                            {checked && <X className="w-3.5 h-3.5 mx-auto" />}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4">
          <label className={labelClass}>المواد التي يدرسها (اختر من القائمة)</label>
          <div className="flex gap-2 mb-3">
            <select 
              value={selectedCourseId} 
              onChange={e => setSelectedCourseId(e.target.value)} 
              className={inputClass}
            >
              <option value="">-- اختر مادة --</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.code} - {c.name_ar} ({c.department})</option>)}
            </select>
            <button 
              type="button" 
              onClick={() => {
                if (selectedCourseId && !taughtCourses.includes(selectedCourseId)) {
                  setTaughtCourses([...taughtCourses, selectedCourseId]);
                }
              }} 
              className={btnPrimary}
            >
              إضافة
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {taughtCourses.map(id => {
              const c = courses.find(x => x.id === id);
              if (!c) return null;
              return (
                <div key={id} className="bg-white/[0.05] text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 border border-white/[0.08]">
                  <span>{c.code} - {c.name_ar}</span>
                  <button type="button" onClick={() => setTaughtCourses(prev => prev.filter(x => x !== id))} className="text-gray-400 hover:text-[#f87171] transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={handleSubmit} className={btnPrimary}>
            {editId ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {editId ? 'حفظ التعديلات' : 'إضافة'}
          </button>
          {editId && (
            <button onClick={() => { setEditId(null); setForm({ name: '', department: DEPARTMENTS[0], specialization: '', max_hours: 18 }); setUnavailable([]); setPreferences([]); }} className="flex items-center gap-2 text-gray-400 hover:text-white px-4 py-2.5 rounded-xl text-sm transition-all">
              <X className="w-4 h-4" /> إلغاء
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      {professors.length > 0 && (
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-white/[0.08]">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-[#2dd4bf]" />
              الأساتذة ({professors.length})
            </h3>
          </div>
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.08]">
                  <th className="text-gray-400 p-3 text-right font-medium">الاسم</th>
                  <th className="text-gray-400 p-3 text-right font-medium">القسم</th>
                  <th className="text-gray-400 p-3 text-right font-medium">التخصص</th>
                  <th className="text-gray-400 p-3 text-center font-medium">ساعات</th>
                  <th className="text-gray-400 p-3 text-right font-medium">الأفضليات</th>
                  <th className="text-gray-400 p-3 text-center font-medium">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {professors.filter(item => globalDeptFilter === "all" || item.department === globalDeptFilter).map((p, i) => (
                  <motion.tr
                    key={p.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-white/[0.05] hover:bg-white/[0.03] transition-colors"
                  >
                    <td className="p-3 text-white font-medium">{p.name}</td>
                    <td className="p-3">
                      <span className="bg-[#14b8a6]/10 text-[#5eead4] px-2.5 py-1 rounded-lg text-xs">{p.department}</span>
                    </td>
                    <td className="p-3 text-gray-300">{p.specialization}</td>
                    <td className="p-3 text-center text-gray-300">{p.max_hours}</td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {(p.preferences || []).map((pref, j) => (
                          <span key={j} className="bg-[#3b82f6]/10 text-[#93c5fd] px-2 py-0.5 rounded-md text-xs">
                            {PREFERENCE_LABELS[pref.type]}
                          </span>
                        ))}
                        {(!p.preferences || p.preferences.length === 0) && (
                          <span className="text-gray-500 text-xs">—</span>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => handleEdit(p)} className={btnEdit}><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(p.id)} className={btnDanger}><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// TEACHING ASSISTANTS TAB
// ==========================================
function AssistantsTab({ assistants, setAssistants, professors, rooms, globalDeptFilter, courses }: {
  assistants: TeachingAssistant[];
  setAssistants: React.Dispatch<React.SetStateAction<TeachingAssistant[]>>;
  professors: Professor[];
  rooms: Room[];
  globalDeptFilter: string;
  courses: Course[];
}) {
  const labRooms = rooms.filter(r => r.type === 'معمل');
  const [form, setForm] = useState({
    name: '', department: DEPARTMENTS[0] as Department, maxHours: 12, supervisorId: '',
  });
  const [unavailableTimes, setUnavailableTimes] = useState<{ day: Day; period?: number }[]>([]);
  const [supervisedLabs, setSupervisedLabs] = useState<string[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [taughtCourses, setTaughtCourses] = useState<string[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const toggleUnavailable = (day: Day, period: number) => {
    setUnavailableTimes(prev => {
      const exists = prev.find(u => u.day === day && u.period === period);
      if (exists) return prev.filter(u => !(u.day === day && u.period === period));
      return [...prev, { day, period }];
    });
  };

  const toggleLab = (labId: string) => {
    setSupervisedLabs(prev =>
      prev.includes(labId) ? prev.filter(id => id !== labId) : [...prev, labId]
    );
  };

  const resetForm = () => {
    setForm({ name: '', department: DEPARTMENTS[0], maxHours: 12, supervisorId: '' });
    setUnavailableTimes([]);
    setSupervisedLabs([]);
      setTaughtCourses([]);
      setSelectedCourseId('');
      setTaughtCourses([]);
      setSelectedCourseId('');
    setEditId(null);
    };

  const handleSubmit = () => {
    if (!form.name.trim()) return;
    const entry: TeachingAssistant = {
      id: editId || genId(),
      name: form.name,
      department: form.department,
      maxHours: form.maxHours,
      supervisorId: form.supervisorId,
      unavailableTimes,
      supervisedLabs,
    };
    if (editId) {
      setAssistants(prev => prev.map(a => a.id === editId ? entry : a));
    } else {
      setAssistants(prev => [...prev, entry]);
    }
    resetForm();
  };

  const handleEdit = (a: TeachingAssistant) => {
    setEditId(a.id);
    setForm({ name: a.name, department: a.department, maxHours: a.maxHours, supervisorId: a.supervisorId });
    setUnavailableTimes([...(a.unavailableTimes || [])]);
    setSupervisedLabs([...(a.supervisedLabs || [])]);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-[#2dd4bf]" />
          {editId ? 'تعديل بيانات المعيد' : 'إضافة معيد جديد'}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          <div>
            <label className={labelClass}>الاسم</label>
            <input type="text" className={inputClass} placeholder="م. أحمد سمير" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div>
            <label className={labelClass}>القسم</label>
            <select className={selectClass} value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value as Department }))}>
              {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>المشرف (الأستاذ)</label>
            <select className={selectClass} value={form.supervisorId} onChange={e => setForm(f => ({ ...f, supervisorId: e.target.value }))}>
              <option value="">— اختر الأستاذ المشرف —</option>
              {professors.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>الحد الأقصى للساعات</label>
            <input type="number" className={inputClass} min={1} max={30} value={form.maxHours} onChange={e => setForm(f => ({ ...f, maxHours: parseInt(e.target.value) || 0 }))} />
          </div>
        </div>

        {/* Supervised Labs */}
        {labRooms.length > 0 && (
          <div className="mb-5">
            <label className={labelClass}>المعامل المشرف عليها</label>
            <div className="flex flex-wrap gap-3">
              {labRooms.map(lab => {
                const active = supervisedLabs.includes(lab.id);
                return (
                  <button
                    key={lab.id}
                    type="button"
                    onClick={() => toggleLab(lab.id)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                      active
                        ? 'bg-[#10b981]/20 border-[#10b981]/40 text-[#6ee7b7]'
                        : 'bg-white/[0.03] border-white/[0.08] text-gray-400 hover:bg-white/[0.05]'
                    }`}
                  >
                    {active && <Check className="w-3.5 h-3.5 inline-block ml-1.5" />}
                    {lab.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Unavailable Grid */}
        <div className="mb-5">
          <label className={labelClass}>الأوقات غير المتاحة</label>
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-xs">
              <thead>
                <tr>
                  <th className="text-gray-400 p-2 text-right">اليوم / الفترة</th>
                  {SAMPLE_TIME_SLOTS.map((s, i) => (
                    <th key={i} className="text-gray-400 p-2 text-center whitespace-nowrap">{s.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DAYS.map(day => (
                  <tr key={day}>
                    <td className="text-gray-300 p-2 font-medium">{day}</td>
                    {SAMPLE_TIME_SLOTS.map((_, pi) => {
                      const checked = unavailableTimes.some(u => u.day === day && u.period === pi);
                      return (
                        <td key={pi} className="p-2 text-center">
                          <button
                            type="button"
                            onClick={() => toggleUnavailable(day, pi)}
                            className={`w-7 h-7 rounded-lg border transition-all ${
                              checked
                                ? 'bg-[#ef4444]/30 border-[#ef4444]/50 text-[#f87171]'
                                : 'bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.05]'
                            }`}
                          >
                            {checked && <X className="w-3.5 h-3.5 mx-auto" />}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

                <div className="mt-4">
          <label className={labelClass}>المواد التي يدرسها (سكاشن/معامل)</label>
          <div className="flex gap-2 mb-3">
            <select 
              value={selectedCourseId} 
              onChange={e => setSelectedCourseId(e.target.value)} 
              className={inputClass}
            >
              <option value="">-- اختر مادة --</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.code} - {c.name_ar} ({c.department})</option>)}
            </select>
            <button 
              type="button" 
              onClick={() => {
                if (selectedCourseId && !taughtCourses.includes(selectedCourseId)) {
                  setTaughtCourses([...taughtCourses, selectedCourseId]);
                }
              }} 
              className={btnPrimary}
            >
              إضافة
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {taughtCourses.map(id => {
              const c = courses.find(x => x.id === id);
              if (!c) return null;
              return (
                <div key={id} className="bg-white/[0.05] text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 border border-white/[0.08]">
                  <span>{c.code} - {c.name_ar}</span>
                  <button type="button" onClick={() => setTaughtCourses(prev => prev.filter(x => x !== id))} className="text-gray-400 hover:text-[#f87171] transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex gap-3 mt-6">
            <button onClick={handleSubmit} className={btnPrimary}>
            {editId ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {editId ? 'حفظ التعديلات' : 'إضافة'}
          </button>
          {editId && (
            <button onClick={resetForm} className="flex items-center gap-2 text-gray-400 hover:text-white px-4 py-2.5 rounded-xl text-sm transition-all">
              <X className="w-4 h-4" /> إلغاء
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      {assistants.length > 0 && (
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-white/[0.08]">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-[#2dd4bf]" />
              المعيدون ({assistants.length})
            </h3>
          </div>
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.08]">
                  <th className="text-gray-400 p-3 text-right font-medium">الاسم</th>
                  <th className="text-gray-400 p-3 text-right font-medium">القسم</th>
                  <th className="text-gray-400 p-3 text-right font-medium">المشرف</th>
                  <th className="text-gray-400 p-3 text-center font-medium">ساعات</th>
                  <th className="text-gray-400 p-3 text-right font-medium">المعامل</th>
                  <th className="text-gray-400 p-3 text-center font-medium">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {assistants.filter(item => globalDeptFilter === "all" || item.department === globalDeptFilter).map((a, i) => {
                  const supervisor = professors.find(p => p.id === a.supervisorId);
                  return (
                    <motion.tr
                      key={a.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="border-b border-white/[0.05] hover:bg-white/[0.03] transition-colors"
                    >
                      <td className="p-3 text-white font-medium">{a.name}</td>
                      <td className="p-3">
                        <span className="bg-[#14b8a6]/10 text-[#5eead4] px-2.5 py-1 rounded-lg text-xs">{a.department}</span>
                      </td>
                      <td className="p-3 text-gray-300">{supervisor?.name || '—'}</td>
                      <td className="p-3 text-center text-gray-300">{a.maxHours}</td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {a.supervisedLabs.map(labId => {
                            const lab = rooms.find(r => r.id === labId);
                            return (
                              <span key={labId} className="bg-[#10b981]/10 text-[#6ee7b7] px-2 py-0.5 rounded-md text-xs">
                                {lab?.name || labId}
                              </span>
                            );
                          })}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center justify-center gap-1">
                          <button onClick={() => handleEdit(a)} className={btnEdit}><Edit className="w-4 h-4" /></button>
                          <button onClick={() => { setAssistants(prev => prev.filter(x => x.id !== a.id)); if (editId === a.id) resetForm(); }} className={btnDanger}><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// ROOMS TAB
// ==========================================
function RoomsTab({ rooms, setRooms }: {
  rooms: Room[];
  setRooms: React.Dispatch<React.SetStateAction<Room[]>>;
}) {
  const [form, setForm] = useState({
    name: '', building: '', capacity: 60, type: 'قاعة محاضرات' as RoomType, equipmentStr: '',
  });
  const [editId, setEditId] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!form.name.trim()) return;
    const equipment = form.equipmentStr.split(',').map(s => s.trim()).filter(Boolean);
    if (editId) {
      setRooms(prev => prev.map(r => r.id === editId ? { ...r, name: form.name, building: form.building, capacity: form.capacity, type: form.type, equipment } : r));
      setEditId(null);
    } else {
      setRooms(prev => [...prev, { id: genId(), name: form.name, building: form.building, capacity: form.capacity, type: form.type, equipment }]);
    }
    setForm({ name: '', building: '', capacity: 60, type: 'قاعة محاضرات', equipmentStr: '' });
  };

  const handleEdit = (r: Room) => {
    setEditId(r.id);
    setForm({ name: r.name, building: r.building, capacity: r.capacity, type: r.type, equipmentStr: r.equipment.join(', ') });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-[#60a5fa]" />
          {editId ? 'تعديل بيانات القاعة' : 'إضافة قاعة / معمل'}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-5">
          <div>
            <label className={labelClass}>اسم القاعة</label>
            <input type="text" className={inputClass} placeholder="H101" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div>
            <label className={labelClass}>المبنى</label>
            <input type="text" className={inputClass} placeholder="المبنى الرئيسي" value={form.building} onChange={e => setForm(f => ({ ...f, building: e.target.value }))} />
          </div>
          <div>
            <label className={labelClass}>السعة</label>
            <input type="number" className={inputClass} min={1} value={form.capacity} onChange={e => setForm(f => ({ ...f, capacity: parseInt(e.target.value) || 0 }))} />
          </div>
          <div>
            <label className={labelClass}>النوع</label>
            <select className={selectClass} value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as RoomType }))}>
              {ROOM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>التجهيزات</label>
            <input type="text" className={inputClass} placeholder="بروجيكتور, سبورة" value={form.equipmentStr} onChange={e => setForm(f => ({ ...f, equipmentStr: e.target.value }))} />
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={handleSubmit} className={btnPrimary}>
            {editId ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {editId ? 'حفظ' : 'إضافة'}
          </button>
          {editId && (
            <button onClick={() => { setEditId(null); setForm({ name: '', building: '', capacity: 60, type: 'قاعة محاضرات', equipmentStr: '' }); }} className="flex items-center gap-2 text-gray-400 hover:text-white px-4 py-2.5 rounded-xl text-sm transition-all">
              <X className="w-4 h-4" /> إلغاء
            </button>
          )}
        </div>
      </div>

      {rooms.length > 0 && (
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-white/[0.08]">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#60a5fa]" />
              القاعات والمعامل ({rooms.length})
            </h3>
          </div>
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.08]">
                  <th className="text-gray-400 p-3 text-right font-medium">الاسم</th>
                  <th className="text-gray-400 p-3 text-right font-medium">المبنى</th>
                  <th className="text-gray-400 p-3 text-center font-medium">السعة</th>
                  <th className="text-gray-400 p-3 text-center font-medium">النوع</th>
                  <th className="text-gray-400 p-3 text-right font-medium">التجهيزات</th>
                  <th className="text-gray-400 p-3 text-center font-medium">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((r, i) => (
                  <motion.tr
                    key={r.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-white/[0.05] hover:bg-white/[0.03] transition-colors"
                  >
                    <td className="p-3 text-white font-medium">{r.name}</td>
                    <td className="p-3 text-gray-300">{r.building}</td>
                    <td className="p-3 text-center text-gray-300">{r.capacity}</td>
                    <td className="p-3 text-center">
                      <span className={`px-2.5 py-1 rounded-lg text-xs ${r.type === 'معمل' ? 'bg-[#10b981]/10 text-[#6ee7b7]' : 'bg-[#3b82f6]/10 text-[#93c5fd]'}`}>
                        {r.type}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {r.equipment.map((eq, j) => (
                          <span key={j} className="bg-white/[0.05] text-gray-300 px-2 py-0.5 rounded-md text-xs">{eq}</span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => handleEdit(r)} className={btnEdit}><Edit className="w-4 h-4" /></button>
                        <button onClick={() => { setRooms(prev => prev.filter(x => x.id !== r.id)); if (editId === r.id) setEditId(null); }} className={btnDanger}><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// BUILDINGS TAB
// ==========================================
function BuildingsTab({ buildings, setBuildings }: {
  buildings: Building[];
  setBuildings: React.Dispatch<React.SetStateAction<Building[]>>;
}) {
  const [form, setForm] = useState({ id: '', name: '' });
  const [distances, setDistances] = useState<Record<string, number>>({});
  const [editId, setEditId] = useState<string | null>(null);

  const resetForm = () => {
    setForm({ id: '', name: '' });
    setDistances({});
    setEditId(null);
    };

  const handleSubmit = () => {
    if (!form.name.trim()) return;
    const buildingId = editId || form.id.trim() || genId();
    const entry: Building = {
      id: buildingId,
      name: form.name,
      distanceMatrix: { ...distances },
    };
    if (editId) {
      setBuildings(prev => prev.map(b => b.id === editId ? entry : b));
    } else {
      setBuildings(prev => [...prev, entry]);
    }
    resetForm();
  };

  const handleEdit = (b: Building) => {
    setEditId(b.id);
    setForm({ id: b.id, name: b.name });
    setDistances({ ...(b.distanceMatrix || {}) });
  };

  // Get other buildings for the distance matrix
  const otherBuildings = buildings.filter(b => b.id !== editId);

  return (
    <div className="space-y-6">
      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
          <Landmark className="w-5 h-5 text-[#fbbf24]" />
          {editId ? 'تعديل بيانات المبنى' : 'إضافة مبنى جديد'}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div>
            <label className={labelClass}>معرف المبنى</label>
            <input type="text" className={inputClass} placeholder="b1" value={form.id} disabled={!!editId} onChange={e => setForm(f => ({ ...f, id: e.target.value }))} />
          </div>
          <div>
            <label className={labelClass}>اسم المبنى</label>
            <input type="text" className={inputClass} placeholder="المبنى الرئيسي" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
        </div>

        {/* Distance Matrix */}
        {otherBuildings.length > 0 && (
          <div className="mb-5">
            <label className={labelClass}>مسافات التنقل (بالدقائق) إلى المباني الأخرى</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {otherBuildings.map(ob => (
                <div key={ob.id} className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3">
                  <span className="text-sm text-gray-300 flex-1">{ob.name}</span>
                  <input
                    type="number"
                    className="w-20 bg-white/[0.05] border border-white/[0.08] rounded-lg px-3 py-1.5 text-white text-sm text-center focus:border-[#14b8a6]/50 focus:outline-none"
                    min={0}
                    placeholder="0"
                    value={distances[ob.id] ?? ''}
                    onChange={e => setDistances(prev => ({ ...prev, [ob.id]: parseFloat(e.target.value) || 0 }))}
                  />
                  <span className="text-xs text-gray-500">دقيقة</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={handleSubmit} className={btnPrimary}>
            {editId ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {editId ? 'حفظ' : 'إضافة'}
          </button>
          {editId && (
            <button onClick={resetForm} className="flex items-center gap-2 text-gray-400 hover:text-white px-4 py-2.5 rounded-xl text-sm transition-all">
              <X className="w-4 h-4" /> إلغاء
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      {buildings.length > 0 && (
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-white/[0.08]">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Landmark className="w-4 h-4 text-[#fbbf24]" />
              المباني ({buildings.length})
            </h3>
          </div>
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.08]">
                  <th className="text-gray-400 p-3 text-right font-medium">المعرف</th>
                  <th className="text-gray-400 p-3 text-right font-medium">الاسم</th>
                  <th className="text-gray-400 p-3 text-right font-medium">المسافات</th>
                  <th className="text-gray-400 p-3 text-center font-medium">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {buildings.map((b, i) => (
                  <motion.tr
                    key={b.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-white/[0.05] hover:bg-white/[0.03] transition-colors"
                  >
                    <td className="p-3 text-[#5eead4] font-mono text-xs">{b.id}</td>
                    <td className="p-3 text-white font-medium">{b.name}</td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(b.distanceMatrix || {}).map(([targetId, mins]) => {
                          const target = buildings.find(x => x.id === targetId);
                          return (
                            <span key={targetId} className="bg-[#f59e0b]/10 text-[#fcd34d] px-2 py-0.5 rounded-md text-xs">
                              {target?.name || targetId}: {mins} د
                            </span>
                          );
                        })}
                        {Object.keys(b.distanceMatrix || {}).length === 0 && (
                          <span className="text-gray-500 text-xs">—</span>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => handleEdit(b)} className={btnEdit}><Edit className="w-4 h-4" /></button>
                        <button onClick={() => { setBuildings(prev => prev.filter(x => x.id !== b.id)); if (editId === b.id) resetForm(); }} className={btnDanger}><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// COURSES TAB
// ==========================================
function CoursesTab({ courses, setCourses, globalDeptFilter, globalYearFilter }: {
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  globalDeptFilter: string;
  globalYearFilter: string;
}) {
  const [form, setForm] = useState({
    code: '', name_ar: '', name_en: '', credits: 3, lecture_hours: 2, lab_hours: 0,
    department: DEPARTMENTS[0] as Department, year_level: 1 as 1 | 2 | 3 | 4, requires_lab: false,
    difficulty: 'medium' as 'easy' | 'medium' | 'hard', sectionHours: 0,
  });
  const [editId, setEditId] = useState<string | null>(null);
  const resetForm = () => {
    setForm({ code: '', name_ar: '', name_en: '', credits: 3, lecture_hours: 2, lab_hours: 0, department: DEPARTMENTS[0], year_level: 1, requires_lab: false, difficulty: 'medium', sectionHours: 0 });
    setEditId(null);
    };

  const handleSubmit = () => {
    if (!form.code.trim() || !form.name_ar.trim()) return;
    if (editId) {
      setCourses(prev => prev.map(c => c.id === editId ? { ...c, ...form, prerequisites: (prev.find(x => x.id === editId)?.prerequisites || []) } : c));
      setEditId(null);
    } else {
      setCourses(prev => [...prev, { id: genId(), ...form, prerequisites: [] }]);
    }
    resetForm();
  };

  const handleEdit = (c: Course) => {
    setEditId(c.id);
    setForm({
      code: c.code, name_ar: c.name_ar, name_en: c.name_en, credits: c.credits,
      lecture_hours: c.lecture_hours, lab_hours: c.lab_hours, department: c.department,
      year_level: c.year_level, requires_lab: c.requires_lab,
      difficulty: c.difficulty || 'medium', sectionHours: c.sectionHours || 0,
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#34d399]" />
          {editId ? 'تعديل المادة' : 'إضافة مادة دراسية'}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
          <div>
            <label className={labelClass}>كود المادة</label>
            <input type="text" className={inputClass} placeholder="CS101" value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} />
          </div>
          <div>
            <label className={labelClass}>الاسم بالعربية</label>
            <input type="text" className={inputClass} placeholder="مقدمة في البرمجة" value={form.name_ar} onChange={e => setForm(f => ({ ...f, name_ar: e.target.value }))} />
          </div>
          <div>
            <label className={labelClass}>الاسم بالإنجليزية</label>
            <input type="text" className={inputClass} placeholder="Intro to Programming" value={form.name_en} onChange={e => setForm(f => ({ ...f, name_en: e.target.value }))} />
          </div>
          <div>
            <label className={labelClass}>الساعات المعتمدة</label>
            <input type="number" className={inputClass} min={1} max={6} value={form.credits} onChange={e => setForm(f => ({ ...f, credits: parseInt(e.target.value) || 0 }))} />
          </div>
          <div>
            <label className={labelClass}>ساعات المحاضرة</label>
            <input type="number" className={inputClass} min={0} max={6} value={form.lecture_hours} onChange={e => setForm(f => ({ ...f, lecture_hours: parseInt(e.target.value) || 0 }))} />
          </div>
          <div>
            <label className={labelClass}>ساعات المعمل</label>
            <input type="number" className={inputClass} min={0} max={6} value={form.lab_hours} onChange={e => setForm(f => ({ ...f, lab_hours: parseInt(e.target.value) || 0 }))} />
          </div>
          <div>
            <label className={labelClass}>ساعات السكشن / التمارين</label>
            <input type="number" className={inputClass} min={0} max={6} value={form.sectionHours} onChange={e => setForm(f => ({ ...f, sectionHours: parseInt(e.target.value) || 0 }))} />
          </div>
          <div>
            <label className={labelClass}>درجة الصعوبة</label>
            <select className={selectClass} value={form.difficulty} onChange={e => setForm(f => ({ ...f, difficulty: e.target.value as 'easy' | 'medium' | 'hard' }))}>
              <option value="easy">سهل</option>
              <option value="medium">متوسط</option>
              <option value="hard">صعب</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>القسم</label>
            <select className={selectClass} value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value as Department }))}>
              {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>المستوى الدراسي</label>
            <select className={selectClass} value={form.year_level} onChange={e => setForm(f => ({ ...f, year_level: parseInt(e.target.value) as 1 | 2 | 3 | 4 }))}>
              {YEAR_LEVELS.map(y => <option key={y} value={y}>السنة {y}</option>)}
            </select>
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-3 cursor-pointer bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 w-full hover:bg-white/[0.05] transition-all">
              <div className={`w-10 h-6 rounded-full transition-all relative ${form.requires_lab ? 'bg-[#14b8a6]' : 'bg-white/[0.15]'}`}>
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${form.requires_lab ? 'right-0.5' : 'left-0.5'}`} />
              </div>
              <span className="text-sm text-gray-300">يتطلب معمل</span>
            </label>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={handleSubmit} className={btnPrimary}>
            {editId ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {editId ? 'حفظ' : 'إضافة'}
          </button>
          {editId && (
            <button onClick={resetForm} className="flex items-center gap-2 text-gray-400 hover:text-white px-4 py-2.5 rounded-xl text-sm transition-all">
              <X className="w-4 h-4" /> إلغاء
            </button>
          )}
        </div>
      </div>

      {courses.length > 0 && (
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-white/[0.08]">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#34d399]" />
              المواد الدراسية ({courses.length})
            </h3>
          </div>
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.08]">
                  <th className="text-gray-400 p-3 text-right font-medium">الكود</th>
                  <th className="text-gray-400 p-3 text-right font-medium">المادة</th>
                  <th className="text-gray-400 p-3 text-center font-medium">ساعات</th>
                  <th className="text-gray-400 p-3 text-center font-medium">محاضرة</th>
                  <th className="text-gray-400 p-3 text-center font-medium">معمل</th>
                  <th className="text-gray-400 p-3 text-center font-medium">سكشن</th>
                  <th className="text-gray-400 p-3 text-center font-medium">الصعوبة</th>
                  <th className="text-gray-400 p-3 text-right font-medium">القسم</th>
                  <th className="text-gray-400 p-3 text-center font-medium">السنة</th>
                  <th className="text-gray-400 p-3 text-center font-medium">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {courses.filter(item => (globalDeptFilter === "all" || item.department === globalDeptFilter) && (globalYearFilter === "all" || item.year_level.toString() === globalYearFilter)).map((c, i) => (
                  <motion.tr
                    key={c.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-white/[0.05] hover:bg-white/[0.03] transition-colors"
                  >
                    <td className="p-3 text-[#5eead4] font-mono text-xs">{c.code}</td>
                    <td className="p-3">
                      <div className="text-white font-medium">{c.name_ar}</div>
                      <div className="text-gray-500 text-xs">{c.name_en}</div>
                    </td>
                    <td className="p-3 text-center text-gray-300">{c.credits}</td>
                    <td className="p-3 text-center text-gray-300">{c.lecture_hours}</td>
                    <td className="p-3 text-center text-gray-300">{c.lab_hours}</td>
                    <td className="p-3 text-center text-gray-300">{c.sectionHours || 0}</td>
                    <td className="p-3 text-center">
                      <span className={`px-2.5 py-1 rounded-lg text-xs ${
                        c.difficulty === 'hard' ? 'bg-[#ef4444]/10 text-[#fca5a5]'
                        : c.difficulty === 'easy' ? 'bg-[#10b981]/10 text-[#6ee7b7]'
                        : 'bg-[#f59e0b]/10 text-[#fcd34d]'
                      }`}>
                        {DIFFICULTY_LABELS[c.difficulty || 'medium']}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="bg-[#14b8a6]/10 text-[#5eead4] px-2.5 py-1 rounded-lg text-xs">{c.department}</span>
                    </td>
                    <td className="p-3 text-center text-gray-300">{c.year_level}</td>
                    <td className="p-3">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => handleEdit(c)} className={btnEdit}><Edit className="w-4 h-4" /></button>
                        <button onClick={() => { setCourses(prev => prev.filter(x => x.id !== c.id)); if (editId === c.id) setEditId(null); }} className={btnDanger}><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// GROUPS TAB
// ==========================================
function GroupsTab({ groups, setGroups, courses, globalDeptFilter, globalYearFilter }: {
  groups: StudentGroup[];
  setGroups: React.Dispatch<React.SetStateAction<StudentGroup[]>>;
  courses: Course[];
  globalDeptFilter: string;
  globalYearFilter: string;
}) {
  const [form, setForm] = useState({
    department: (globalDeptFilter !== 'all' ? globalDeptFilter : DEPARTMENTS[0]) as Department, year: (globalYearFilter !== 'all' ? parseInt(globalYearFilter) : 1) as 1 | 2 | 3 | 4, section: 'A' as 'A' | 'B' | 'C', student_count: 40,
  });
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [editId, setEditId] = useState<string | null>(null);

  const toggleCourse = (courseId: string) => {
    setSelectedCourses(prev =>
      prev.includes(courseId) ? prev.filter(id => id !== courseId) : [...prev, courseId]
    );
  };

  const resetForm = () => {
    setForm({ department: DEPARTMENTS[0], year: 1, section: 'A', student_count: 40 });
    setSelectedCourses([]);
    setEditId(null);
    };

  const handleSubmit = () => {
    if (editId) {
      setGroups(prev => prev.map(g => g.id === editId ? { ...g, ...form, courseIds: selectedCourses } : g));
      setEditId(null);
    } else {
      setGroups(prev => [...prev, { id: genId(), ...form, courseIds: selectedCourses }]);
    }
    resetForm();
  };

  const handleEdit = (g: StudentGroup) => {
    setEditId(g.id);
    setForm({ department: g.department, year: g.year, section: g.section, student_count: g.student_count });
    setSelectedCourses([...(g.courseIds || [])]);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-[#fbbf24]" />
          {editId ? 'تعديل المجموعة' : 'إضافة مجموعة طلاب'}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          <div>
            <label className={labelClass}>القسم</label>
            <select className={selectClass} value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value as Department }))}>
              {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>السنة الدراسية</label>
            <select className={selectClass} value={form.year} onChange={e => setForm(f => ({ ...f, year: parseInt(e.target.value) as 1 | 2 | 3 | 4 }))}>
              {YEAR_LEVELS.map(y => <option key={y} value={y}>السنة {y}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>الشعبة</label>
            <select className={selectClass} value={form.section} onChange={e => setForm(f => ({ ...f, section: e.target.value as 'A' | 'B' | 'C' }))}>
              {SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>عدد الطلاب</label>
            <input type="number" className={inputClass} min={1} value={form.student_count} onChange={e => setForm(f => ({ ...f, student_count: parseInt(e.target.value) || 0 }))} />
          </div>
        </div>

        {/* Course Selection */}
        {courses.length > 0 && (
          <div className="mb-5">
            <label className={labelClass}>المواد المسجلة</label>
            <div className="flex flex-wrap gap-2">
              {courses.map(c => {
                const active = selectedCourses.includes(c.id);
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => toggleCourse(c.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium transition-all border ${
                      active
                        ? 'bg-[#14b8a6]/20 border-[#14b8a6]/40 text-[#5eead4]'
                        : 'bg-white/[0.03] border-white/[0.08] text-gray-400 hover:bg-white/[0.05]'
                    }`}
                  >
                    {active && <Check className="w-3 h-3 inline-block ml-1" />}
                    {c.code} — {c.name_ar}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={handleSubmit} className={btnPrimary}>
            {editId ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {editId ? 'حفظ' : 'إضافة'}
          </button>
          {editId && (
            <button onClick={resetForm} className="flex items-center gap-2 text-gray-400 hover:text-white px-4 py-2.5 rounded-xl text-sm transition-all">
              <X className="w-4 h-4" /> إلغاء
            </button>
          )}
        </div>
      </div>

      {groups.length > 0 && (
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-white/[0.08]">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-[#fbbf24]" />
              المجموعات ({groups.length})
            </h3>
          </div>
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.08]">
                  <th className="text-gray-400 p-3 text-right font-medium">القسم</th>
                  <th className="text-gray-400 p-3 text-center font-medium">السنة</th>
                  <th className="text-gray-400 p-3 text-center font-medium">الشعبة</th>
                  <th className="text-gray-400 p-3 text-center font-medium">الطلاب</th>
                  <th className="text-gray-400 p-3 text-right font-medium">المواد</th>
                  <th className="text-gray-400 p-3 text-center font-medium">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {groups.filter(item => (globalDeptFilter === "all" || item.department === globalDeptFilter) && (globalYearFilter === "all" || item.year.toString() === globalYearFilter)).map((g, i) => (
                  <motion.tr
                    key={g.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-white/[0.05] hover:bg-white/[0.03] transition-colors"
                  >
                    <td className="p-3">
                      <span className="bg-[#14b8a6]/10 text-[#5eead4] px-2.5 py-1 rounded-lg text-xs">{g.department}</span>
                    </td>
                    <td className="p-3 text-center text-white font-medium">السنة {g.year}</td>
                    <td className="p-3 text-center">
                      <span className="bg-[#3b82f6]/10 text-[#93c5fd] px-3 py-1 rounded-lg text-xs font-bold">{g.section}</span>
                    </td>
                    <td className="p-3 text-center text-gray-300">{g.student_count}</td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {(g.courseIds || []).map(cid => {
                          const course = courses.find(c => c.id === cid);
                          return (
                            <span key={cid} className="bg-[#10b981]/10 text-[#6ee7b7] px-2 py-0.5 rounded-md text-xs">
                              {course?.code || cid}
                            </span>
                          );
                        })}
                        {(!g.courseIds || g.courseIds.length === 0) && (
                          <span className="text-gray-500 text-xs">—</span>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => handleEdit(g)} className={btnEdit}><Edit className="w-4 h-4" /></button>
                        <button onClick={() => { setGroups(prev => prev.filter(x => x.id !== g.id)); if (editId === g.id) resetForm(); }} className={btnDanger}><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// TIME SETTINGS TAB
// ==========================================
function TimeSettingsTab({ settings, setSettings }: {
  settings: TimeSettings;
  setSettings: React.Dispatch<React.SetStateAction<TimeSettings>>;
}) {
  const [slotForm, setSlotForm] = useState({ start_time: '08:00', end_time: '09:30', label: '' });

  const addSlot = () => {
    if (!slotForm.label.trim()) return;
    setSettings(prev => ({
      ...prev,
      slots: [...prev.slots, { id: genId(), ...slotForm }],
    }));
    setSlotForm({ start_time: '', end_time: '', label: '' });
  };

  const removeSlot = (id: string) => {
    setSettings(prev => ({ ...prev, slots: prev.slots.filter(s => s.id !== id) }));
  };

  const toggleDay = (day: Day) => {
    setSettings(prev => ({
      ...prev,
      working_days: prev.working_days.includes(day)
        ? prev.working_days.filter(d => d !== day)
        : [...prev.working_days, day],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Semester Name */}
      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#22d3ee]" />
          إعدادات الفصل الدراسي
        </h3>
        <div className="max-w-md">
          <label className={labelClass}>اسم الفصل الدراسي</label>
          <input
            type="text"
            className={inputClass}
            value={settings.semester_name}
            onChange={e => setSettings(prev => ({ ...prev, semester_name: e.target.value }))}
            placeholder="الفصل الدراسي الأول 2026/2027"
          />
        </div>
      </div>

      {/* Working Days */}
      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6">
        <h3 className="text-base font-bold text-white mb-4">أيام العمل</h3>
        <div className="flex flex-wrap gap-3">
          {DAYS.map(day => {
            const active = settings.working_days.includes(day);
            return (
              <button
                key={day}
                onClick={() => toggleDay(day)}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                  active
                    ? 'bg-[#14b8a6]/20 border-[#14b8a6]/40 text-[#5eead4]'
                    : 'bg-white/[0.03] border-white/[0.08] text-gray-400 hover:bg-white/[0.05]'
                }`}
              >
                {active && <Check className="w-3.5 h-3.5 inline-block ml-1.5" />}
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Slots */}
      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6">
        <h3 className="text-base font-bold text-white mb-4">الفترات الزمنية</h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-5">
          <div>
            <label className={labelClass}>وقت البداية</label>
            <input type="time" className={inputClass} value={slotForm.start_time} onChange={e => setSlotForm(f => ({ ...f, start_time: e.target.value }))} />
          </div>
          <div>
            <label className={labelClass}>وقت النهاية</label>
            <input type="time" className={inputClass} value={slotForm.end_time} onChange={e => setSlotForm(f => ({ ...f, end_time: e.target.value }))} />
          </div>
          <div>
            <label className={labelClass}>التسمية</label>
            <input type="text" className={inputClass} placeholder="الفترة الأولى" value={slotForm.label} onChange={e => setSlotForm(f => ({ ...f, label: e.target.value }))} />
          </div>
          <div className="flex items-end">
            <button onClick={addSlot} className={btnPrimary}>
              <Plus className="w-4 h-4" /> إضافة فترة
            </button>
          </div>
        </div>

        {settings.slots.length > 0 && (
          <div className="space-y-2">
            {settings.slots.map((slot, i) => (
              <motion.div
                key={slot.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3"
              >
                <div className="flex items-center gap-4">
                  <span className="bg-[#14b8a6]/20 text-[#5eead4] px-3 py-1 rounded-lg text-xs font-bold">{i + 1}</span>
                  <span className="text-white font-medium text-sm">{slot.label}</span>
                  <span className="text-gray-400 text-xs font-mono">{slot.start_time} - {slot.end_time}</span>
                </div>
                <button onClick={() => removeSlot(slot.id)} className={btnDanger}>
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// CONSTRAINT WEIGHTS TAB
// ==========================================
function ConstraintWeightsTab({ weights, setWeights }: {
  weights: ConstraintWeights;
  setWeights: React.Dispatch<React.SetStateAction<ConstraintWeights>>;
}) {
  const weightConfig: { key: keyof ConstraintWeights; label: string; description: string; color: string }[] = [
    { key: 'gap_penalty_weight', label: 'أهمية تقليل الفجوات الزمنية', description: 'تقليل الأوقات الفارغة بين المحاضرات للطلاب والأساتذة', color: 'from-[#3b82f6] to-[#2563eb]' },
    { key: 'distribution_weight', label: 'أهمية توزيع الأيام', description: 'توزيع المحاضرات بشكل متساوٍ على أيام الأسبوع', color: 'from-[#a855f7] to-[#9333ea]' },
    { key: 'difficulty_time_weight', label: 'أهمية توقيت المواد الصعبة', description: 'جدولة المواد الصعبة في الفترات الصباحية', color: 'from-[#f59e0b] to-[#d97706]' },
    { key: 'travel_weight', label: 'أهمية تقليل التنقل', description: 'تقليل المسافات بين المباني للمحاضرات المتتالية', color: 'from-[#10b981] to-[#059669]' },
    { key: 'preference_weight', label: 'أهمية أفضليات الأساتذة', description: 'مراعاة تفضيلات الأساتذة في أوقات التدريس', color: 'from-[#f43f5e] to-[#e11d48]' },
    { key: 'balance_weight', label: 'أهمية التوازن العادل', description: 'توزيع عادل للأعباء التدريسية بين الأساتذة', color: 'from-[#06b6d4] to-[#0891b2]' },
  ];

  const handleReset = () => {
    setWeights({ ...DEFAULT_CONSTRAINT_WEIGHTS });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-[#a78bfa]" />
            أوزان القيود
          </h3>
          <button onClick={handleReset} className="flex items-center gap-2 text-gray-400 hover:text-white px-4 py-2 rounded-xl text-sm border border-white/[0.08] hover:bg-white/[0.03] transition-all">
            إعادة الافتراضي
          </button>
        </div>
        <p className="text-gray-400 text-sm mb-8">
          تحكم في أولويات خوارزمية التوليد عبر ضبط أوزان القيود. القيمة الأعلى تعني أولوية أكبر.
        </p>

        <div className="space-y-6">
          {weightConfig.map(({ key, label, description, color }) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5"
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="text-white font-medium text-sm">{label}</h4>
                  <p className="text-gray-500 text-xs mt-0.5">{description}</p>
                </div>
                <div className={`bg-gradient-to-r ${color} text-white px-4 py-1.5 rounded-xl text-sm font-bold min-w-[60px] text-center shadow-lg`}>
                  {weights[key].toFixed(1)}
                </div>
              </div>
              <div className="relative mt-3">
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={weights[key]}
                  onChange={e => setWeights(prev => ({ ...prev, [key]: parseFloat(e.target.value) }))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer bg-white/[0.08]
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#14b8a6]
                    [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#14b8a6]"
                />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-600">0</span>
                  <span className="text-xs text-gray-600">0.5</span>
                  <span className="text-xs text-gray-600">1.0</span>
                  <span className="text-xs text-gray-600">1.5</span>
                  <span className="text-xs text-gray-600">2.0</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
