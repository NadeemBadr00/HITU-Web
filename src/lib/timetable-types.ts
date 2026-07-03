// ==========================================
// Timetable System Types
// ==========================================

export const DEPARTMENTS = [
  'تكنولوجيا الملابس الجاهزة',
  'الذكاء الاصطناعي',
  'علوم البيانات',
  'الأمن السيبراني',
  'التحكم في الاليات الصناعية',
  'الميكاترونكس',
  'الأوتوترونكس',
] as const;

export type Department = (typeof DEPARTMENTS)[number];

export const YEAR_LEVELS = [1, 2, 3, 4] as const;
export type YearLevel = (typeof YEAR_LEVELS)[number];

export const SECTIONS = ['A', 'B', 'C'] as const;
export type Section = (typeof SECTIONS)[number];

export const DAYS = [
  'السبت',
  'الأحد',
  'الاثنين',
  'الثلاثاء',
  'الأربعاء',
  'الخميس',
] as const;
export type Day = (typeof DAYS)[number];

export const ROOM_TYPES = ['قاعة محاضرات', 'معمل'] as const;
export type RoomType = (typeof ROOM_TYPES)[number];

export type PreferenceType = 'morning' | 'afternoon' | 'specific_day' | 'avoid_consecutive';

export interface Preference {
  type: PreferenceType;
  value?: string;
}

export interface Professor {
  id: string;
  name: string;
  department: Department;
  specialization: string;
  max_hours: number;
  unavailable: { day: Day; period: number }[];
  preferences: Preference[];
  taughtCourses?: string[];
}

export interface TeachingAssistant {
  id: string;
  name: string;
  department: Department;
  maxHours: number;
  unavailableTimes: { day: Day; period?: number }[];
  supervisedLabs: string[];
  taughtCourses?: string[];
  supervisorId: string;
}

export interface Room {
  id: string;
  name: string;
  building: string;
  capacity: number;
  type: RoomType;
  equipment: string[];
}

export interface Building {
  id: string;
  name: string;
  distanceMatrix: Record<string, number>;
}

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Course {
  id: string;
  code: string;
  name_ar: string;
  name_en: string;
  credits: number;
  lecture_hours: number;
  lab_hours: number;
  department: Department;
  year_level: YearLevel;
  requires_lab: boolean;
  difficulty: Difficulty;
  sectionHours: number;
  prerequisites: string[];
}

export interface StudentGroup {
  id: string;
  department: Department;
  year: YearLevel;
  section: Section;
  student_count: number;
  courseIds: string[];
}

export interface TimeSlot {
  id: string;
  start_time: string;
  end_time: string;
  label: string;
}

export interface TimeSettings {
  slots: TimeSlot[];
  working_days: Day[];
  semester_name: string;
}

export interface ConstraintWeights {
  gap_penalty_weight: number;
  distribution_weight: number;
  difficulty_time_weight: number;
  travel_weight: number;
  preference_weight: number;
  balance_weight: number;
}

export const DEFAULT_CONSTRAINT_WEIGHTS: ConstraintWeights = {
  gap_penalty_weight: 1.0,
  distribution_weight: 0.8,
  difficulty_time_weight: 0.6,
  travel_weight: 0.7,
  preference_weight: 0.5,
  balance_weight: 0.4,
};

export interface TimetableEntry {
  id: string;
  day: Day;
  slot_id: string;
  course: Course;
  professor: Professor;
  room: Room;
  group: StudentGroup;
}

// Department color mapping for the timetable grid
export const DEPARTMENT_COLORS: Record<Department, { bg: string; text: string; border: string }> = {
  'تكنولوجيا الملابس الجاهزة': { bg: 'bg-blue-500/20', text: 'text-blue-300', border: 'border-blue-500/40' },
  'الذكاء الاصطناعي': { bg: 'bg-purple-500/20', text: 'text-purple-300', border: 'border-purple-500/40' },
  'علوم البيانات': { bg: 'bg-emerald-500/20', text: 'text-emerald-300', border: 'border-emerald-500/40' },
  'الأمن السيبراني': { bg: 'bg-red-500/20', text: 'text-red-300', border: 'border-red-500/40' },
  'التحكم في الاليات الصناعية': { bg: 'bg-amber-500/20', text: 'text-amber-300', border: 'border-amber-500/40' },
  'الميكاترونكس': { bg: 'bg-cyan-500/20', text: 'text-cyan-300', border: 'border-cyan-500/40' },
  'الأوتوترونكس': { bg: 'bg-pink-500/20', text: 'text-pink-300', border: 'border-pink-500/40' },
};

// ==========================================
// Sample / Demo Data
// ==========================================

export const SAMPLE_TIME_SLOTS: TimeSlot[] = [
  { id: 'ts1', start_time: '08:00', end_time: '09:30', label: 'الفترة الأولى' },
  { id: 'ts2', start_time: '09:45', end_time: '11:15', label: 'الفترة الثانية' },
  { id: 'ts3', start_time: '11:30', end_time: '13:00', label: 'الفترة الثالثة' },
  { id: 'ts4', start_time: '13:30', end_time: '15:00', label: 'الفترة الرابعة' },
  { id: 'ts5', start_time: '15:15', end_time: '16:45', label: 'الفترة الخامسة' },
];

export const SAMPLE_PROFESSORS: Professor[] = [
  { id: 'p1', name: 'د. هند زيادة', department: 'الذكاء الاصطناعي', specialization: 'الذكاء الاصطناعي', max_hours: 18, unavailable: [], preferences: [] },
  { id: 'p2', name: 'د. نجلاء عبدالمحسن', department: 'تكنولوجيا الملابس الجاهزة', specialization: 'مهارات تفاوض', max_hours: 16, unavailable: [], preferences: [] },
  { id: 'p3', name: 'د. سيمون', department: 'الذكاء الاصطناعي', specialization: 'دوائر رقمية', max_hours: 18, unavailable: [], preferences: [] },
  { id: 'p4', name: 'د. صابرين', department: 'الذكاء الاصطناعي', specialization: 'لغة إنجليزية', max_hours: 14, unavailable: [], preferences: [] },
  { id: 'p5', name: 'د. محمود سامي', department: 'الذكاء الاصطناعي', specialization: 'برمجة', max_hours: 18, unavailable: [], preferences: [] },
  { id: 'p6', name: 'د. طه', department: 'تكنولوجيا الملابس الجاهزة', specialization: 'حقوق إنسان', max_hours: 16, unavailable: [], preferences: [] },
  { id: 'p7', name: 'د. نيللي سعيد', department: 'الذكاء الاصطناعي', specialization: 'نظم تشغيل', max_hours: 16, unavailable: [], preferences: [] },
  { id: 'p8', name: 'د. عبدالسلام', department: 'علوم البيانات', specialization: 'إنترنت الأشياء', max_hours: 18, unavailable: [], preferences: [] },
  { id: 'p9', name: 'د. جهاد زيادة', department: 'علوم البيانات', specialization: 'حقوق إنسان', max_hours: 18, unavailable: [], preferences: [] },
  { id: 'p10', name: 'د. عبير', department: 'علوم البيانات', specialization: 'تنقيب البيانات', max_hours: 18, unavailable: [], preferences: [] },
  { id: 'p11', name: 'د. علام', department: 'علوم البيانات', specialization: 'خوارزميات', max_hours: 18, unavailable: [], preferences: [] },
  { id: 'p12', name: 'د. شريف', department: 'علوم البيانات', specialization: 'حوسبة سحابية', max_hours: 18, unavailable: [], preferences: [] },
];

export const SAMPLE_TEACHING_ASSISTANTS: TeachingAssistant[] = [
  { id: 'ta1', name: 'م. نادية', department: 'الذكاء الاصطناعي', maxHours: 12, unavailableTimes: [], supervisedLabs: ['r14', 'r15'], supervisorId: 'p7' },
  { id: 'ta2', name: 'م. نجلاء', department: 'الذكاء الاصطناعي', maxHours: 12, unavailableTimes: [], supervisedLabs: ['r14'], supervisorId: 'p5' },
  { id: 'ta3', name: 'م. رضوى', department: 'الذكاء الاصطناعي', maxHours: 12, unavailableTimes: [], supervisedLabs: [], supervisorId: 'p3' },
  { id: 'ta4', name: 'م. نهال', department: 'الذكاء الاصطناعي', maxHours: 12, unavailableTimes: [], supervisedLabs: [], supervisorId: 'p1' },
  { id: 'ta5', name: 'م. آية جمال', department: 'الذكاء الاصطناعي', maxHours: 12, unavailableTimes: [], supervisedLabs: [], supervisorId: 'p5' },
  { id: 'ta6', name: 'م. محمد مصطفى', department: 'الذكاء الاصطناعي', maxHours: 12, unavailableTimes: [], supervisedLabs: [], supervisorId: 'p3' },
  { id: 'ta7', name: 'م. كريم', department: 'الذكاء الاصطناعي', maxHours: 12, unavailableTimes: [], supervisedLabs: ['r14'], supervisorId: 'p7' },
  { id: 'ta8', name: 'م. محمود جاد', department: 'علوم البيانات', maxHours: 12, unavailableTimes: [], supervisedLabs: [], supervisorId: 'p8' },
  { id: 'ta9', name: 'م. إيهاب', department: 'علوم البيانات', maxHours: 12, unavailableTimes: [], supervisedLabs: ['r14'], supervisorId: 'p10' },
  { id: 'ta10', name: 'م. عمار', department: 'علوم البيانات', maxHours: 12, unavailableTimes: [], supervisedLabs: [], supervisorId: 'p8' },
  { id: 'ta11', name: 'م. عبدالعزيز', department: 'علوم البيانات', maxHours: 12, unavailableTimes: [], supervisedLabs: [], supervisorId: 'p11' },
];

export const SAMPLE_ROOMS: Room[] = [
  { id: 'r1', name: 'مدرج A', building: 'المبنى الرئيسي', capacity: 200, type: 'قاعة محاضرات', equipment: ['بروجيكتور', 'سبورة ذكية'] },
  { id: 'r2', name: 'F-Sem', building: 'المبنى الرئيسي', capacity: 100, type: 'قاعة محاضرات', equipment: ['بروجيكتور'] },
  { id: 'r3', name: 'A202', building: 'مبنى المعامل', capacity: 60, type: 'قاعة محاضرات', equipment: ['بروجيكتور'] },
  { id: 'r4', name: 'A303', building: 'مبنى المعامل', capacity: 60, type: 'قاعة محاضرات', equipment: ['بروجيكتور'] },
  { id: 'r5', name: 'A304', building: 'مبنى المعامل', capacity: 60, type: 'قاعة محاضرات', equipment: ['بروجيكتور'] },
  { id: 'r6', name: 'A305', building: 'مبنى المعامل', capacity: 60, type: 'قاعة محاضرات', equipment: ['بروجيكتور'] },
  { id: 'r7', name: 'G201', building: 'مبنى الهندسة', capacity: 80, type: 'قاعة محاضرات', equipment: ['بروجيكتور'] },
  { id: 'r8', name: 'G202', building: 'مبنى الهندسة', capacity: 80, type: 'قاعة محاضرات', equipment: ['بروجيكتور'] },
  { id: 'r9', name: 'D101', building: 'المبنى الرئيسي', capacity: 60, type: 'قاعة محاضرات', equipment: ['بروجيكتور'] },
  { id: 'r10', name: 'D102', building: 'المبنى الرئيسي', capacity: 60, type: 'قاعة محاضرات', equipment: ['بروجيكتور'] },
  { id: 'r11', name: 'D103', building: 'المبنى الرئيسي', capacity: 60, type: 'قاعة محاضرات', equipment: ['بروجيكتور'] },
  { id: 'r12', name: 'D104', building: 'المبنى الرئيسي', capacity: 60, type: 'قاعة محاضرات', equipment: ['بروجيكتور'] },
  { id: 'r13', name: 'D105', building: 'المبنى الرئيسي', capacity: 60, type: 'قاعة محاضرات', equipment: ['بروجيكتور'] },
  { id: 'r14', name: 'Simulation LAB', building: 'مبنى المعامل', capacity: 40, type: 'معمل', equipment: ['حواسيب', 'بروجيكتور'] },
  { id: 'r15', name: 'AI LAB', building: 'مبنى المعامل', capacity: 40, type: 'معمل', equipment: ['حواسيب'] },
];

export const SAMPLE_BUILDINGS: Building[] = [
  { id: 'b1', name: 'المبنى الرئيسي', distanceMatrix: { 'b2': 5, 'b3': 10 } },
  { id: 'b2', name: 'مبنى المعامل', distanceMatrix: { 'b1': 5, 'b3': 8 } },
  { id: 'b3', name: 'مبنى الهندسة', distanceMatrix: { 'b1': 10, 'b2': 8 } },
];





export const SAMPLE_COURSES: Course[] = [
  { id: 'c1', code: 'AI100', name_ar: '**الدبلوم العالي:** يتطلب إتمام 64 ساعة معتمدة مقسمة على 4 فصول دراسية (أول سنتين).', name_en: '**الدبلوم العالي:** يتطلب إتمام 64 ساعة معتمدة مقسمة على 4 فصول دراسية (أول سنتين).', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الذكاء الاصطناعي', year_level: 1, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c2', code: 'AI101', name_ar: '**البكالوريوس:** يتطلب إتمام 64 ساعة معتمدة إضافية بعد الدبلوم، مقسمة على 4 فصول دراسية أخرى (سنة تالتة ورابعة).', name_en: '**البكالوريوس:** يتطلب إتمام 64 ساعة معتمدة إضافية بعد الدبلوم، مقسمة على 4 فصول دراسية أخرى (سنة تالتة ورابعة).', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الذكاء الاصطناعي', year_level: 1, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c3', code: 'AI102', name_ar: 'لغة انجليزية 1', name_en: 'لغة انجليزية 1', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الذكاء الاصطناعي', year_level: 1, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c4', code: 'AI103', name_ar: 'إحصاء تطبيقية', name_en: 'إحصاء تطبيقية', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الذكاء الاصطناعي', year_level: 1, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c5', code: 'AI104', name_ar: 'رياضيات', name_en: 'رياضيات', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الذكاء الاصطناعي', year_level: 1, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c6', code: 'AI105', name_ar: 'الفيزياء التطبيقية', name_en: 'الفيزياء التطبيقية', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الذكاء الاصطناعي', year_level: 1, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c7', code: 'AI106', name_ar: 'تكنولوجيا المعلومات', name_en: 'تكنولوجيا المعلومات', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الذكاء الاصطناعي', year_level: 1, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c8', code: 'AI107', name_ar: 'مقدمة في نظم المعلومات', name_en: 'مقدمة في نظم المعلومات', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الذكاء الاصطناعي', year_level: 1, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c9', code: 'AI108', name_ar: 'برمجة بلغة بايثون', name_en: 'برمجة بلغة بايثون', credits: 3, lecture_hours: 2, lab_hours: 2, department: 'الذكاء الاصطناعي', year_level: 1, requires_lab: true, difficulty: 'medium', sectionHours: 1, prerequisites: [] },
  { id: 'c10', code: 'AI109', name_ar: 'تدريب ميداني (1)', name_en: 'تدريب ميداني (1)', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الذكاء الاصطناعي', year_level: 1, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c11', code: 'AI1010', name_ar: 'لغة انجليزية 2', name_en: 'لغة انجليزية 2', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الذكاء الاصطناعي', year_level: 1, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c12', code: 'AI1011', name_ar: 'حقوق الإنسان وقانون العمل المصري', name_en: 'حقوق الإنسان وقانون العمل المصري', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الذكاء الاصطناعي', year_level: 1, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c13', code: 'AI1012', name_ar: 'أساسيات الذكاء الاصطناعي', name_en: 'أساسيات الذكاء الاصطناعي', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الذكاء الاصطناعي', year_level: 1, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c14', code: 'AI1013', name_ar: 'مهارات التفاوض', name_en: 'مهارات التفاوض', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الذكاء الاصطناعي', year_level: 1, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c15', code: 'AI1014', name_ar: 'برمجة الذكاء الاصطناعي', name_en: 'برمجة الذكاء الاصطناعي', credits: 3, lecture_hours: 2, lab_hours: 2, department: 'الذكاء الاصطناعي', year_level: 1, requires_lab: true, difficulty: 'medium', sectionHours: 1, prerequisites: [] },
  { id: 'c16', code: 'AI1015', name_ar: 'تصميم الدوائر الرقمية', name_en: 'تصميم الدوائر الرقمية', credits: 3, lecture_hours: 2, lab_hours: 2, department: 'الذكاء الاصطناعي', year_level: 1, requires_lab: true, difficulty: 'medium', sectionHours: 1, prerequisites: [] },
  { id: 'c17', code: 'AI1016', name_ar: 'نظم التشغيل', name_en: 'نظم التشغيل', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الذكاء الاصطناعي', year_level: 1, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c18', code: 'AI1017', name_ar: 'تدريب ميداني (2)', name_en: 'تدريب ميداني (2)', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الذكاء الاصطناعي', year_level: 1, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c19', code: 'AI2018', name_ar: 'مبادئ التكنولوجيا', name_en: 'مبادئ التكنولوجيا', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الذكاء الاصطناعي', year_level: 2, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c20', code: 'AI2019', name_ar: 'تاريخ التكنولوجيا', name_en: 'تاريخ التكنولوجيا', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الذكاء الاصطناعي', year_level: 2, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c21', code: 'AI2020', name_ar: 'السلامة والصحة المهنية', name_en: 'السلامة والصحة المهنية', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الذكاء الاصطناعي', year_level: 2, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c22', code: 'AI2021', name_ar: 'الذكاء الاصطناعي', name_en: 'الذكاء الاصطناعي', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الذكاء الاصطناعي', year_level: 2, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c23', code: 'AI2022', name_ar: 'الأنظمة الخبيرة', name_en: 'الأنظمة الخبيرة', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الذكاء الاصطناعي', year_level: 2, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c24', code: 'AI2023', name_ar: 'تطبيقات الذكاء الاصطناعي', name_en: 'تطبيقات الذكاء الاصطناعي', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الذكاء الاصطناعي', year_level: 2, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c25', code: 'AI2024', name_ar: 'أساسيات علم البيانات', name_en: 'أساسيات علم البيانات', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الذكاء الاصطناعي', year_level: 2, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c26', code: 'AI2025', name_ar: 'لغة برمجة جافا', name_en: 'لغة برمجة جافا', credits: 3, lecture_hours: 2, lab_hours: 2, department: 'الذكاء الاصطناعي', year_level: 2, requires_lab: true, difficulty: 'medium', sectionHours: 1, prerequisites: [] },
  { id: 'c27', code: 'AI2026', name_ar: 'لغة انجليزية تخصصية', name_en: 'لغة انجليزية تخصصية', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الذكاء الاصطناعي', year_level: 2, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c28', code: 'AI2027', name_ar: 'تصميم الخوارزميات', name_en: 'تصميم الخوارزميات', credits: 3, lecture_hours: 2, lab_hours: 2, department: 'الذكاء الاصطناعي', year_level: 2, requires_lab: true, difficulty: 'medium', sectionHours: 1, prerequisites: [] },
  { id: 'c29', code: 'AI2028', name_ar: 'انترنت الأشياء', name_en: 'انترنت الأشياء', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الذكاء الاصطناعي', year_level: 2, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c30', code: 'AI2029', name_ar: 'تنقيب البيانات', name_en: 'تنقيب البيانات', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الذكاء الاصطناعي', year_level: 2, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c31', code: 'AI2030', name_ar: 'الحوسبة السحابية', name_en: 'الحوسبة السحابية', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الذكاء الاصطناعي', year_level: 2, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c32', code: 'AI2031', name_ar: 'تطوير تطبيقات الانترنت', name_en: 'تطوير تطبيقات الانترنت', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الذكاء الاصطناعي', year_level: 2, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c33', code: 'AI2032', name_ar: 'مشروع تخرج عملي (للدبلوم)', name_en: 'مشروع تخرج عملي (للدبلوم)', credits: 3, lecture_hours: 2, lab_hours: 2, department: 'الذكاء الاصطناعي', year_level: 2, requires_lab: true, difficulty: 'medium', sectionHours: 1, prerequisites: [] },
  { id: 'c34', code: 'AI3033', name_ar: 'مبادئ الإدارة والقيادة', name_en: 'مبادئ الإدارة والقيادة', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الذكاء الاصطناعي', year_level: 3, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c35', code: 'AI3034', name_ar: 'إحصاء 2', name_en: 'إحصاء 2', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الذكاء الاصطناعي', year_level: 3, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c36', code: 'AI3035', name_ar: 'مراقبة الشركات وحمايتها', name_en: 'مراقبة الشركات وحمايتها', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الذكاء الاصطناعي', year_level: 3, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c37', code: 'AI3036', name_ar: 'وسائل القرصنة وكشفها', name_en: 'وسائل القرصنة وكشفها', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الذكاء الاصطناعي', year_level: 3, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c38', code: 'AI3037', name_ar: 'مقرر تخصصي اختياري', name_en: 'مقرر تخصصي اختياري', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الذكاء الاصطناعي', year_level: 3, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c39', code: 'AI3038', name_ar: 'البيانات الضخمة', name_en: 'البيانات الضخمة', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الذكاء الاصطناعي', year_level: 3, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c40', code: 'AI3039', name_ar: 'الروبوتات الذكية', name_en: 'الروبوتات الذكية', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الذكاء الاصطناعي', year_level: 3, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c41', code: 'AI3040', name_ar: 'أخلاقيات المهنة', name_en: 'أخلاقيات المهنة', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الذكاء الاصطناعي', year_level: 3, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c42', code: 'AI3041', name_ar: 'تكنولوجيا التعليم', name_en: 'تكنولوجيا التعليم', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الذكاء الاصطناعي', year_level: 3, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c43', code: 'AI3042', name_ar: 'أسس ومبادئ التسويق', name_en: 'أسس ومبادئ التسويق', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الذكاء الاصطناعي', year_level: 3, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c44', code: 'AI3043', name_ar: 'الوسائل التعليمية في التعليم التكنولوجي', name_en: 'الوسائل التعليمية في التعليم التكنولوجي', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الذكاء الاصطناعي', year_level: 3, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c45', code: 'AI3044', name_ar: 'الواقع المعزز الافتراضي', name_en: 'الواقع المعزز الافتراضي', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الذكاء الاصطناعي', year_level: 3, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c46', code: 'AI3045', name_ar: 'استكشاف البيانات وتحليلها', name_en: 'استكشاف البيانات وتحليلها', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الذكاء الاصطناعي', year_level: 3, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c47', code: 'AI4046', name_ar: 'أسس كتابة البحث العلمي', name_en: 'أسس كتابة البحث العلمي', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الذكاء الاصطناعي', year_level: 4, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c48', code: 'AI4047', name_ar: 'مقرر اختياري (جامعة)', name_en: 'مقرر اختياري (جامعة)', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الذكاء الاصطناعي', year_level: 4, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c49', code: 'AI4048', name_ar: 'مقرر اختياري (كلية)', name_en: 'مقرر اختياري (كلية)', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الذكاء الاصطناعي', year_level: 4, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c50', code: 'AI4049', name_ar: 'أمن المعلومات والشبكات', name_en: 'أمن المعلومات والشبكات', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الذكاء الاصطناعي', year_level: 4, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c51', code: 'AI4050', name_ar: 'معالجة اللغات الطبيعية', name_en: 'معالجة اللغات الطبيعية', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الذكاء الاصطناعي', year_level: 4, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c52', code: 'AI4051', name_ar: 'معالجة الصور الرقمية', name_en: 'معالجة الصور الرقمية', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الذكاء الاصطناعي', year_level: 4, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c53', code: 'AI4052', name_ar: 'مشروع تخرج (1)', name_en: 'مشروع تخرج (1)', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الذكاء الاصطناعي', year_level: 4, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c54', code: 'AI4053', name_ar: 'تمييز الأنماط الافتراضية', name_en: 'تمييز الأنماط الافتراضية', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الذكاء الاصطناعي', year_level: 4, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c55', code: 'AI4054', name_ar: 'تصميم النماذج ثلاثية الأبعاد', name_en: 'تصميم النماذج ثلاثية الأبعاد', credits: 3, lecture_hours: 2, lab_hours: 2, department: 'الذكاء الاصطناعي', year_level: 4, requires_lab: true, difficulty: 'medium', sectionHours: 1, prerequisites: [] },
  { id: 'c56', code: 'AI4055', name_ar: 'الوسائط المتعددة', name_en: 'الوسائط المتعددة', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الذكاء الاصطناعي', year_level: 4, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c57', code: 'AI4056', name_ar: 'مشروع تخرج عملي (للبكالوريوس)', name_en: 'مشروع تخرج عملي (للبكالوريوس)', credits: 3, lecture_hours: 2, lab_hours: 2, department: 'الذكاء الاصطناعي', year_level: 4, requires_lab: true, difficulty: 'medium', sectionHours: 1, prerequisites: [] },
  { id: 'c58', code: 'CS1057', name_ar: '**الدبلوم العالي:** يتطلب إتمام 64 ساعة معتمدة مقسمة على 4 فصول دراسية (أول سنتين).', name_en: '**الدبلوم العالي:** يتطلب إتمام 64 ساعة معتمدة مقسمة على 4 فصول دراسية (أول سنتين).', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الأمن السيبراني', year_level: 1, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c59', code: 'CS1058', name_ar: '**البكالوريوس:** يتطلب إتمام 64 ساعة معتمدة إضافية بعد الدبلوم، مقسمة على 4 فصول دراسية أخرى (سنة ثالثة ورابعة).', name_en: '**البكالوريوس:** يتطلب إتمام 64 ساعة معتمدة إضافية بعد الدبلوم، مقسمة على 4 فصول دراسية أخرى (سنة ثالثة ورابعة).', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الأمن السيبراني', year_level: 1, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c60', code: 'CS1059', name_ar: 'لغة انجليزية 1', name_en: 'لغة انجليزية 1', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الأمن السيبراني', year_level: 1, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c61', code: 'CS1060', name_ar: 'تكنولوجيا المعلومات', name_en: 'تكنولوجيا المعلومات', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الأمن السيبراني', year_level: 1, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c62', code: 'CS1061', name_ar: 'رياضيات', name_en: 'رياضيات', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الأمن السيبراني', year_level: 1, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c63', code: 'CS1062', name_ar: 'مهارات الريادة والتفكير الإبداعي', name_en: 'مهارات الريادة والتفكير الإبداعي', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الأمن السيبراني', year_level: 1, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c64', code: 'CS1063', name_ar: 'الفيزياء التطبيقية', name_en: 'الفيزياء التطبيقية', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الأمن السيبراني', year_level: 1, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c65', code: 'CS1064', name_ar: 'مقدمة في نظم المعلومات', name_en: 'مقدمة في نظم المعلومات', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الأمن السيبراني', year_level: 1, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c66', code: 'CS1065', name_ar: 'نظم قواعد البيانات', name_en: 'نظم قواعد البيانات', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الأمن السيبراني', year_level: 1, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c67', code: 'CS1066', name_ar: 'تدريب ميداني (1)', name_en: 'تدريب ميداني (1)', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الأمن السيبراني', year_level: 1, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c68', code: 'CS1067', name_ar: 'لغة انجليزية 2', name_en: 'لغة انجليزية 2', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الأمن السيبراني', year_level: 1, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c69', code: 'CS1068', name_ar: 'مبادئ التكنولوجيا', name_en: 'مبادئ التكنولوجيا', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الأمن السيبراني', year_level: 1, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c70', code: 'CS1069', name_ar: 'الرسم الهندسي والإسقاط', name_en: 'الرسم الهندسي والإسقاط', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الأمن السيبراني', year_level: 1, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c71', code: 'CS1070', name_ar: 'مهارات التفاوض', name_en: 'مهارات التفاوض', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الأمن السيبراني', year_level: 1, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c72', code: 'CS1071', name_ar: 'مبادئ الأمن السيبراني', name_en: 'مبادئ الأمن السيبراني', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الأمن السيبراني', year_level: 1, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c73', code: 'CS1072', name_ar: 'الشبكات وتراسل البيانات', name_en: 'الشبكات وتراسل البيانات', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الأمن السيبراني', year_level: 1, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c74', code: 'CS1073', name_ar: 'نظم التشغيل', name_en: 'نظم التشغيل', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الأمن السيبراني', year_level: 1, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c75', code: 'CS1074', name_ar: 'تدريب ميداني (2)', name_en: 'تدريب ميداني (2)', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الأمن السيبراني', year_level: 1, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c76', code: 'CS2075', name_ar: 'تاريخ التكنولوجيا', name_en: 'تاريخ التكنولوجيا', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الأمن السيبراني', year_level: 2, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c77', code: 'CS2076', name_ar: 'لغة انجليزية تخصصية', name_en: 'لغة انجليزية تخصصية', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الأمن السيبراني', year_level: 2, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c78', code: 'CS2077', name_ar: 'السلامة والصحة المهنية', name_en: 'السلامة والصحة المهنية', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الأمن السيبراني', year_level: 2, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c79', code: 'CS2078', name_ar: 'البرمجة للأمن السيبراني', name_en: 'البرمجة للأمن السيبراني', credits: 3, lecture_hours: 2, lab_hours: 2, department: 'الأمن السيبراني', year_level: 2, requires_lab: true, difficulty: 'medium', sectionHours: 1, prerequisites: [] },
  { id: 'c80', code: 'CS2079', name_ar: 'بروتوكول أمن الشبكات', name_en: 'بروتوكول أمن الشبكات', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الأمن السيبراني', year_level: 2, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c81', code: 'CS2080', name_ar: 'الذكاء الصناعي', name_en: 'الذكاء الصناعي', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الأمن السيبراني', year_level: 2, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c82', code: 'CS2081', name_ar: 'الشبكة الآمنة', name_en: 'الشبكة الآمنة', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الأمن السيبراني', year_level: 2, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c83', code: 'CS2082', name_ar: 'تطوير تطبيقات الانترنت', name_en: 'تطوير تطبيقات الانترنت', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الأمن السيبراني', year_level: 2, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c84', code: 'CS2083', name_ar: 'حقوق الإنسان وقانون العمل المصري', name_en: 'حقوق الإنسان وقانون العمل المصري', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الأمن السيبراني', year_level: 2, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c85', code: 'CS2084', name_ar: 'تصميم الخوارزميات', name_en: 'تصميم الخوارزميات', credits: 3, lecture_hours: 2, lab_hours: 2, department: 'الأمن السيبراني', year_level: 2, requires_lab: true, difficulty: 'medium', sectionHours: 1, prerequisites: [] },
  { id: 'c86', code: 'CS2085', name_ar: 'تصميم البرمجيات والأنظمة', name_en: 'تصميم البرمجيات والأنظمة', credits: 3, lecture_hours: 2, lab_hours: 2, department: 'الأمن السيبراني', year_level: 2, requires_lab: true, difficulty: 'medium', sectionHours: 1, prerequisites: [] },
  { id: 'c87', code: 'CS2086', name_ar: 'تنقيب البيانات', name_en: 'تنقيب البيانات', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الأمن السيبراني', year_level: 2, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c88', code: 'CS2087', name_ar: 'الأمن السيبراني والتحول الرقمي', name_en: 'الأمن السيبراني والتحول الرقمي', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الأمن السيبراني', year_level: 2, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c89', code: 'CS2088', name_ar: 'لغة برمجة جافا', name_en: 'لغة برمجة جافا', credits: 3, lecture_hours: 2, lab_hours: 2, department: 'الأمن السيبراني', year_level: 2, requires_lab: true, difficulty: 'medium', sectionHours: 1, prerequisites: [] },
  { id: 'c90', code: 'CS2089', name_ar: 'مشروع تخرج عملي (للدبلوم)', name_en: 'مشروع تخرج عملي (للدبلوم)', credits: 3, lecture_hours: 2, lab_hours: 2, department: 'الأمن السيبراني', year_level: 2, requires_lab: true, difficulty: 'medium', sectionHours: 1, prerequisites: [] },
  { id: 'c91', code: 'CS3090', name_ar: 'مبادئ الإدارة والقيادة', name_en: 'مبادئ الإدارة والقيادة', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الأمن السيبراني', year_level: 3, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c92', code: 'CS3091', name_ar: 'إحصاء', name_en: 'إحصاء', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الأمن السيبراني', year_level: 3, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c93', code: 'CS3092', name_ar: 'مراقبة الشركات وحمايتها', name_en: 'مراقبة الشركات وحمايتها', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الأمن السيبراني', year_level: 3, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c94', code: 'CS3093', name_ar: 'وسائل القرصنة وكشفها', name_en: 'وسائل القرصنة وكشفها', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الأمن السيبراني', year_level: 3, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c95', code: 'CS3094', name_ar: 'مقرر تخصصي اختياري', name_en: 'مقرر تخصصي اختياري', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الأمن السيبراني', year_level: 3, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c96', code: 'CS3095', name_ar: 'البيانات الضخمة', name_en: 'البيانات الضخمة', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الأمن السيبراني', year_level: 3, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c97', code: 'CS3096', name_ar: 'أخلاقيات العمل والاختراق الأخلاقي', name_en: 'أخلاقيات العمل والاختراق الأخلاقي', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الأمن السيبراني', year_level: 3, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c98', code: 'CS3097', name_ar: 'أخلاقيات المهنة', name_en: 'أخلاقيات المهنة', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الأمن السيبراني', year_level: 3, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c99', code: 'CS3098', name_ar: 'تكنولوجيا التعليم', name_en: 'تكنولوجيا التعليم', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الأمن السيبراني', year_level: 3, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c100', code: 'CS3099', name_ar: 'أسس ومبادئ التسويق', name_en: 'أسس ومبادئ التسويق', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الأمن السيبراني', year_level: 3, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c101', code: 'CS300', name_ar: 'الوسائل التعليمية في التعليم التكنولوجي', name_en: 'الوسائل التعليمية في التعليم التكنولوجي', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الأمن السيبراني', year_level: 3, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c102', code: 'CS301', name_ar: 'قانون الجرائم الإلكترونية', name_en: 'قانون الجرائم الإلكترونية', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الأمن السيبراني', year_level: 3, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c103', code: 'CS302', name_ar: 'أمن البطاقات الذكية', name_en: 'أمن البطاقات الذكية', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الأمن السيبراني', year_level: 3, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c104', code: 'CS403', name_ar: 'أسس كتابة البحث العلمي', name_en: 'أسس كتابة البحث العلمي', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الأمن السيبراني', year_level: 4, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c105', code: 'CS404', name_ar: 'مقرر اختياري (جامعة)', name_en: 'مقرر اختياري (جامعة)', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الأمن السيبراني', year_level: 4, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c106', code: 'CS405', name_ar: 'مقرر اختياري (كلية)', name_en: 'مقرر اختياري (كلية)', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الأمن السيبراني', year_level: 4, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c107', code: 'CS406', name_ar: 'أساسيات أمن ليونكس', name_en: 'أساسيات أمن ليونكس', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الأمن السيبراني', year_level: 4, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c108', code: 'CS407', name_ar: 'التشفير', name_en: 'التشفير', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الأمن السيبراني', year_level: 4, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c109', code: 'CS408', name_ar: 'التدقيق في الأمن السيبراني', name_en: 'التدقيق في الأمن السيبراني', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الأمن السيبراني', year_level: 4, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c110', code: 'CS409', name_ar: 'مشروع تخرج (1)', name_en: 'مشروع تخرج (1)', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الأمن السيبراني', year_level: 4, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c111', code: 'CS4010', name_ar: 'التشفير المتقدم التطبيقي', name_en: 'التشفير المتقدم التطبيقي', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الأمن السيبراني', year_level: 4, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c112', code: 'CS4011', name_ar: 'برمجة متقدمة', name_en: 'برمجة متقدمة', credits: 3, lecture_hours: 2, lab_hours: 2, department: 'الأمن السيبراني', year_level: 4, requires_lab: true, difficulty: 'medium', sectionHours: 1, prerequisites: [] },
  { id: 'c113', code: 'CS4012', name_ar: 'برمجة التطبيقات الآمنة', name_en: 'برمجة التطبيقات الآمنة', credits: 3, lecture_hours: 2, lab_hours: 2, department: 'الأمن السيبراني', year_level: 4, requires_lab: true, difficulty: 'medium', sectionHours: 1, prerequisites: [] },
  { id: 'c114', code: 'CS4013', name_ar: 'مشروع تخرج عملي (للبكالوريوس)', name_en: 'مشروع تخرج عملي (للبكالوريوس)', credits: 3, lecture_hours: 2, lab_hours: 2, department: 'الأمن السيبراني', year_level: 4, requires_lab: true, difficulty: 'medium', sectionHours: 1, prerequisites: [] },
  { id: 'c115', code: 'CS4014', name_ar: 'تحليل وتصميم الخوارزميات', name_en: 'تحليل وتصميم الخوارزميات', credits: 3, lecture_hours: 2, lab_hours: 2, department: 'الأمن السيبراني', year_level: 4, requires_lab: true, difficulty: 'medium', sectionHours: 1, prerequisites: [] },
  { id: 'c116', code: 'CS4015', name_ar: 'أمن الشبكات', name_en: 'أمن الشبكات', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الأمن السيبراني', year_level: 4, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c117', code: 'CS4016', name_ar: 'تصميم منطق الحاسوب', name_en: 'تصميم منطق الحاسوب', credits: 3, lecture_hours: 2, lab_hours: 2, department: 'الأمن السيبراني', year_level: 4, requires_lab: true, difficulty: 'medium', sectionHours: 1, prerequisites: [] },
  { id: 'c118', code: 'CS4017', name_ar: 'برمجة جافا 2', name_en: 'برمجة جافا 2', credits: 3, lecture_hours: 2, lab_hours: 2, department: 'الأمن السيبراني', year_level: 4, requires_lab: true, difficulty: 'medium', sectionHours: 1, prerequisites: [] },
  { id: 'c119', code: 'CS4018', name_ar: 'أنظمة كشف التسلسل والاختراق', name_en: 'أنظمة كشف التسلسل والاختراق', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الأمن السيبراني', year_level: 4, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c120', code: 'CS4019', name_ar: 'الخصوصية وإخفاء الهوية', name_en: 'الخصوصية وإخفاء الهوية', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الأمن السيبراني', year_level: 4, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c121', code: 'DS1020', name_ar: '**الدبلوم العالي:** يتطلب إتمام 64 ساعة معتمدة مقسمة على 4 فصول دراسية (أول سنتين).', name_en: '**الدبلوم العالي:** يتطلب إتمام 64 ساعة معتمدة مقسمة على 4 فصول دراسية (أول سنتين).', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'علوم البيانات', year_level: 1, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c122', code: 'DS1021', name_ar: '**البكالوريوس:** يتطلب إتمام 64 ساعة معتمدة إضافية بعد الدبلوم، مقسمة على 4 فصول دراسية أخرى (سنة ثالثة ورابعة).', name_en: '**البكالوريوس:** يتطلب إتمام 64 ساعة معتمدة إضافية بعد الدبلوم، مقسمة على 4 فصول دراسية أخرى (سنة ثالثة ورابعة).', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'علوم البيانات', year_level: 1, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c123', code: 'DS1022', name_ar: 'لغة انجليزية 1', name_en: 'لغة انجليزية 1', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'علوم البيانات', year_level: 1, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c124', code: 'DS1023', name_ar: 'تكنولوجيا المعلومات', name_en: 'تكنولوجيا المعلومات', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'علوم البيانات', year_level: 1, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c125', code: 'DS1024', name_ar: 'رياضيات', name_en: 'رياضيات', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'علوم البيانات', year_level: 1, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c126', code: 'DS1025', name_ar: 'إحصاء تطبيقية', name_en: 'إحصاء تطبيقية', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'علوم البيانات', year_level: 1, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c127', code: 'DS1026', name_ar: 'الفيزياء التطبيقية', name_en: 'الفيزياء التطبيقية', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'علوم البيانات', year_level: 1, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c128', code: 'DS1027', name_ar: 'مقدمة في نظم المعلومات', name_en: 'مقدمة في نظم المعلومات', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'علوم البيانات', year_level: 1, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c129', code: 'DS1028', name_ar: 'ثقافة التحول الرقمي', name_en: 'ثقافة التحول الرقمي', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'علوم البيانات', year_level: 1, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c130', code: 'DS1029', name_ar: 'تدريب ميداني (1)', name_en: 'تدريب ميداني (1)', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'علوم البيانات', year_level: 1, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c131', code: 'DS1030', name_ar: 'لغة انجليزية 2', name_en: 'لغة انجليزية 2', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'علوم البيانات', year_level: 1, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c132', code: 'DS1031', name_ar: 'مبادئ التكنولوجيا', name_en: 'مبادئ التكنولوجيا', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'علوم البيانات', year_level: 1, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c133', code: 'DS1032', name_ar: 'برمجة الذكاء الصناعي', name_en: 'برمجة الذكاء الصناعي', credits: 3, lecture_hours: 2, lab_hours: 2, department: 'علوم البيانات', year_level: 1, requires_lab: true, difficulty: 'medium', sectionHours: 1, prerequisites: [] },
  { id: 'c134', code: 'DS1033', name_ar: 'مهارات التفاوض', name_en: 'مهارات التفاوض', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'علوم البيانات', year_level: 1, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c135', code: 'DS1034', name_ar: 'تحليل الأنظمة وتصميمها', name_en: 'تحليل الأنظمة وتصميمها', credits: 3, lecture_hours: 2, lab_hours: 2, department: 'علوم البيانات', year_level: 1, requires_lab: true, difficulty: 'medium', sectionHours: 1, prerequisites: [] },
  { id: 'c136', code: 'DS1035', name_ar: 'التنقيب عن البيانات', name_en: 'التنقيب عن البيانات', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'علوم البيانات', year_level: 1, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c137', code: 'DS1036', name_ar: 'نظم التشغيل', name_en: 'نظم التشغيل', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'علوم البيانات', year_level: 1, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c138', code: 'DS1037', name_ar: 'تدريب ميداني (2)', name_en: 'تدريب ميداني (2)', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'علوم البيانات', year_level: 1, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c139', code: 'DS2038', name_ar: 'تاريخ التكنولوجيا', name_en: 'تاريخ التكنولوجيا', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'علوم البيانات', year_level: 2, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c140', code: 'DS2039', name_ar: 'لغة انجليزية تخصصية', name_en: 'لغة انجليزية تخصصية', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'علوم البيانات', year_level: 2, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c141', code: 'DS2040', name_ar: 'السلامة والصحة المهنية', name_en: 'السلامة والصحة المهنية', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'علوم البيانات', year_level: 2, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c142', code: 'DS2041', name_ar: 'هندسة وتحليل البيانات', name_en: 'هندسة وتحليل البيانات', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'علوم البيانات', year_level: 2, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c143', code: 'DS2042', name_ar: 'الأنظمة الخبيرة', name_en: 'الأنظمة الخبيرة', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'علوم البيانات', year_level: 2, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c144', code: 'DS2043', name_ar: 'الذكاء الاصطناعي', name_en: 'الذكاء الاصطناعي', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'علوم البيانات', year_level: 2, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c145', code: 'DS2044', name_ar: 'أساسيات علم البيانات', name_en: 'أساسيات علم البيانات', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'علوم البيانات', year_level: 2, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c146', code: 'DS2045', name_ar: 'تطوير تطبيقات الانترنت', name_en: 'تطوير تطبيقات الانترنت', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'علوم البيانات', year_level: 2, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c147', code: 'DS2046', name_ar: 'حقوق الإنسان وقانون العمل المصري', name_en: 'حقوق الإنسان وقانون العمل المصري', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'علوم البيانات', year_level: 2, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c148', code: 'DS2047', name_ar: 'تصميم الخوارزميات', name_en: 'تصميم الخوارزميات', credits: 3, lecture_hours: 2, lab_hours: 2, department: 'علوم البيانات', year_level: 2, requires_lab: true, difficulty: 'medium', sectionHours: 1, prerequisites: [] },
  { id: 'c149', code: 'DS2048', name_ar: 'انترنت الأشياء', name_en: 'انترنت الأشياء', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'علوم البيانات', year_level: 2, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c150', code: 'DS2049', name_ar: 'تنقيب البيانات', name_en: 'تنقيب البيانات', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'علوم البيانات', year_level: 2, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c151', code: 'DS2050', name_ar: 'الحوسبة السحابية', name_en: 'الحوسبة السحابية', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'علوم البيانات', year_level: 2, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c152', code: 'DS2051', name_ar: 'تحليل البيانات الضخمة', name_en: 'تحليل البيانات الضخمة', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'علوم البيانات', year_level: 2, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c153', code: 'DS2052', name_ar: 'مشروع تخرج عملي (للدبلوم)', name_en: 'مشروع تخرج عملي (للدبلوم)', credits: 3, lecture_hours: 2, lab_hours: 2, department: 'علوم البيانات', year_level: 2, requires_lab: true, difficulty: 'medium', sectionHours: 1, prerequisites: [] },
  { id: 'c154', code: 'DS3053', name_ar: 'مبادئ الإدارة والقيادة', name_en: 'مبادئ الإدارة والقيادة', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'علوم البيانات', year_level: 3, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c155', code: 'DS3054', name_ar: 'إحصاء 2', name_en: 'إحصاء 2', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'علوم البيانات', year_level: 3, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c156', code: 'DS3055', name_ar: 'مراقبة الشركات وحمايتها', name_en: 'مراقبة الشركات وحمايتها', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'علوم البيانات', year_level: 3, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c157', code: 'DS3056', name_ar: 'وسائل القرصنة وكشفها', name_en: 'وسائل القرصنة وكشفها', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'علوم البيانات', year_level: 3, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c158', code: 'DS3057', name_ar: 'مقرر تخصصي اختياري', name_en: 'مقرر تخصصي اختياري', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'علوم البيانات', year_level: 3, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c159', code: 'DS3058', name_ar: 'تعلم الآلة بلغة البايثون', name_en: 'تعلم الآلة بلغة البايثون', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'علوم البيانات', year_level: 3, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c160', code: 'DS3059', name_ar: 'الروبوتات الذكية', name_en: 'الروبوتات الذكية', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'علوم البيانات', year_level: 3, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c161', code: 'DS3060', name_ar: 'أخلاقيات المهنة', name_en: 'أخلاقيات المهنة', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'علوم البيانات', year_level: 3, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c162', code: 'DS3061', name_ar: 'تكنولوجيا التعليم', name_en: 'تكنولوجيا التعليم', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'علوم البيانات', year_level: 3, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c163', code: 'DS3062', name_ar: 'أسس ومبادئ التسويق', name_en: 'أسس ومبادئ التسويق', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'علوم البيانات', year_level: 3, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c164', code: 'DS3063', name_ar: 'الوسائل التعليمية في التعليم التكنولوجي', name_en: 'الوسائل التعليمية في التعليم التكنولوجي', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'علوم البيانات', year_level: 3, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c165', code: 'DS3064', name_ar: 'الواقع المعزز الافتراضي', name_en: 'الواقع المعزز الافتراضي', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'علوم البيانات', year_level: 3, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c166', code: 'DS3065', name_ar: 'استكشاف البيانات وتحليلها', name_en: 'استكشاف البيانات وتحليلها', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'علوم البيانات', year_level: 3, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c167', code: 'DS4066', name_ar: 'أسس كتابة البحث العلمي', name_en: 'أسس كتابة البحث العلمي', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'علوم البيانات', year_level: 4, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c168', code: 'DS4067', name_ar: 'مقرر اختياري (جامعة)', name_en: 'مقرر اختياري (جامعة)', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'علوم البيانات', year_level: 4, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c169', code: 'DS4068', name_ar: 'مقرر اختياري (كلية)', name_en: 'مقرر اختياري (كلية)', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'علوم البيانات', year_level: 4, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c170', code: 'DS4069', name_ar: 'أمن المعلومات والشبكات', name_en: 'أمن المعلومات والشبكات', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'علوم البيانات', year_level: 4, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c171', code: 'DS4070', name_ar: 'معالجة اللغات الطبيعية', name_en: 'معالجة اللغات الطبيعية', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'علوم البيانات', year_level: 4, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c172', code: 'DS4071', name_ar: 'تصميم وتحليل الخوارزميات', name_en: 'تصميم وتحليل الخوارزميات', credits: 3, lecture_hours: 2, lab_hours: 2, department: 'علوم البيانات', year_level: 4, requires_lab: true, difficulty: 'medium', sectionHours: 1, prerequisites: [] },
  { id: 'c173', code: 'DS4072', name_ar: 'مشروع تخرج (1)', name_en: 'مشروع تخرج (1)', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'علوم البيانات', year_level: 4, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c174', code: 'DS4073', name_ar: 'تمييز الأنماط الافتراضية', name_en: 'تمييز الأنماط الافتراضية', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'علوم البيانات', year_level: 4, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c175', code: 'DS4074', name_ar: 'أساسيات استرجاع البيانات', name_en: 'أساسيات استرجاع البيانات', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'علوم البيانات', year_level: 4, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c176', code: 'DS4075', name_ar: 'أنظمة كشف التسلسل والاختراق', name_en: 'أنظمة كشف التسلسل والاختراق', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'علوم البيانات', year_level: 4, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c177', code: 'DS4076', name_ar: 'مشروع تخرج عملي (للبكالوريوس)', name_en: 'مشروع تخرج عملي (للبكالوريوس)', credits: 3, lecture_hours: 2, lab_hours: 2, department: 'علوم البيانات', year_level: 4, requires_lab: true, difficulty: 'medium', sectionHours: 1, prerequisites: [] },
  { id: 'c178', code: 'DS4077', name_ar: 'الابتكار وريادة الأعمال', name_en: 'الابتكار وريادة الأعمال', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'علوم البيانات', year_level: 4, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c179', code: 'DS4078', name_ar: 'استراتيجيات التحول الرقمي', name_en: 'استراتيجيات التحول الرقمي', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'علوم البيانات', year_level: 4, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c180', code: 'DS4079', name_ar: 'شبكات الاتصالات', name_en: 'شبكات الاتصالات', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'علوم البيانات', year_level: 4, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c181', code: 'DS4080', name_ar: 'نمذجة البيانات ومحاكاتها', name_en: 'نمذجة البيانات ومحاكاتها', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'علوم البيانات', year_level: 4, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c182', code: 'DS4081', name_ar: 'المنطق الرقمي', name_en: 'المنطق الرقمي', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'علوم البيانات', year_level: 4, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c183', code: 'DS4082', name_ar: 'البرمجة الكينونية بلغة (C++)', name_en: 'البرمجة الكينونية بلغة (C++)', credits: 3, lecture_hours: 2, lab_hours: 2, department: 'علوم البيانات', year_level: 4, requires_lab: true, difficulty: 'medium', sectionHours: 1, prerequisites: [] },
  { id: 'c184', code: 'MA1083', name_ar: 'الموضة واألزياء والثقافة والمجتمع', name_en: 'الموضة واألزياء والثقافة والمجتمع', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'تكنولوجيا الملابس الجاهزة', year_level: 1, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c185', code: 'MA1084', name_ar: 'تكنولوجيا صناعة المالبس الجاهزة', name_en: 'تكنولوجيا صناعة المالبس الجاهزة', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'تكنولوجيا الملابس الجاهزة', year_level: 1, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c186', code: 'MA1085', name_ar: 'أسس بناء الجسم ورسم وتصميم مانيكان الموضة ونظريات األلوان', name_en: 'أسس بناء الجسم ورسم وتصميم مانيكان الموضة ونظريات األلوان', credits: 3, lecture_hours: 2, lab_hours: 2, department: 'تكنولوجيا الملابس الجاهزة', year_level: 1, requires_lab: true, difficulty: 'medium', sectionHours: 1, prerequisites: [] },
  { id: 'c187', code: 'MA1086', name_ar: 'تكنولوجيا المعلومات', name_en: 'تكنولوجيا المعلومات', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'تكنولوجيا الملابس الجاهزة', year_level: 1, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c188', code: 'MA1087', name_ar: 'التشكيل على المانيكان 1', name_en: 'التشكيل على المانيكان 1', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'تكنولوجيا الملابس الجاهزة', year_level: 1, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c189', code: 'MA1088', name_ar: 'لغة إيطالية 1', name_en: 'لغة إيطالية 1', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'تكنولوجيا الملابس الجاهزة', year_level: 1, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c190', code: 'MA1089', name_ar: 'علم النسيج', name_en: 'علم النسيج', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'تكنولوجيا الملابس الجاهزة', year_level: 1, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c191', code: 'MA1090', name_ar: 'تصميم أزياء بالحاسب 1', name_en: 'تصميم أزياء بالحاسب 1', credits: 3, lecture_hours: 2, lab_hours: 2, department: 'تكنولوجيا الملابس الجاهزة', year_level: 1, requires_lab: true, difficulty: 'medium', sectionHours: 1, prerequisites: [] },
  { id: 'c192', code: 'MA1091', name_ar: 'تاريخ التكنولوجيا', name_en: 'تاريخ التكنولوجيا', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'تكنولوجيا الملابس الجاهزة', year_level: 1, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c193', code: 'MA1092', name_ar: 'رسم وتصميم األزياء', name_en: 'رسم وتصميم األزياء', credits: 3, lecture_hours: 2, lab_hours: 2, department: 'تكنولوجيا الملابس الجاهزة', year_level: 1, requires_lab: true, difficulty: 'medium', sectionHours: 1, prerequisites: [] },
  { id: 'c194', code: 'MA1093', name_ar: 'إعداد باترونات المالبس الكاجوال النسائية', name_en: 'إعداد باترونات المالبس الكاجوال النسائية', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'تكنولوجيا الملابس الجاهزة', year_level: 1, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c195', code: 'MA1094', name_ar: 'لغة إيطالية 2', name_en: 'لغة إيطالية 2', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'تكنولوجيا الملابس الجاهزة', year_level: 1, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c196', code: 'MA1095', name_ar: 'لغة إنجليزية متخصصة في الموضة 1', name_en: 'لغة إنجليزية متخصصة في الموضة 1', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'تكنولوجيا الملابس الجاهزة', year_level: 1, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c197', code: 'MA2096', name_ar: 'تصميم أزياء بالحاسب 2', name_en: 'تصميم أزياء بالحاسب 2', credits: 3, lecture_hours: 2, lab_hours: 2, department: 'تكنولوجيا الملابس الجاهزة', year_level: 2, requires_lab: true, difficulty: 'medium', sectionHours: 1, prerequisites: [] },
  { id: 'c198', code: 'MA2097', name_ar: 'أخالقيات المهنة وقانون سوق العمل المصري', name_en: 'أخالقيات المهنة وقانون سوق العمل المصري', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'تكنولوجيا الملابس الجاهزة', year_level: 2, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c199', code: 'MA2098', name_ar: 'تصميم أزياء المالبس النسائية', name_en: 'تصميم أزياء المالبس النسائية', credits: 3, lecture_hours: 2, lab_hours: 2, department: 'تكنولوجيا الملابس الجاهزة', year_level: 2, requires_lab: true, difficulty: 'medium', sectionHours: 1, prerequisites: [] },
  { id: 'c200', code: 'MA2099', name_ar: 'التشكيل على المانيكان 2', name_en: 'التشكيل على المانيكان 2', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'تكنولوجيا الملابس الجاهزة', year_level: 2, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c201', code: 'MA200', name_ar: 'طباعة وصباغة المالبس', name_en: 'طباعة وصباغة المالبس', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'تكنولوجيا الملابس الجاهزة', year_level: 2, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c202', code: 'MA201', name_ar: 'لغة إنجليزية متخصصة في الموضة 2', name_en: 'لغة إنجليزية متخصصة في الموضة 2', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'تكنولوجيا الملابس الجاهزة', year_level: 2, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c203', code: 'MA202', name_ar: 'حقوق اإلنسان', name_en: 'حقوق اإلنسان', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'تكنولوجيا الملابس الجاهزة', year_level: 2, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c204', code: 'MA203', name_ar: 'تخطيط اإلنتاج ومراقبة الجودة', name_en: 'تخطيط اإلنتاج ومراقبة الجودة', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'تكنولوجيا الملابس الجاهزة', year_level: 2, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c205', code: 'MA204', name_ar: 'تصميم األزياء وتطويرها', name_en: 'تصميم األزياء وتطويرها', credits: 3, lecture_hours: 2, lab_hours: 2, department: 'تكنولوجيا الملابس الجاهزة', year_level: 2, requires_lab: true, difficulty: 'medium', sectionHours: 1, prerequisites: [] },
  { id: 'c206', code: 'MA205', name_ar: 'إعداد باترونات المالبس الرسمية النسائية', name_en: 'إعداد باترونات المالبس الرسمية النسائية', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'تكنولوجيا الملابس الجاهزة', year_level: 2, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c207', code: 'MA206', name_ar: 'تدريب ميداني 1', name_en: 'تدريب ميداني 1', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'تكنولوجيا الملابس الجاهزة', year_level: 2, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c208', code: 'MA207', name_ar: 'مشروع تخرج 1', name_en: 'مشروع تخرج 1', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'تكنولوجيا الملابس الجاهزة', year_level: 2, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c209', code: 'MA308', name_ar: 'إدارة وتخطيط اإلنتاج باستخدام الحاسب', name_en: 'إدارة وتخطيط اإلنتاج باستخدام الحاسب', credits: 3, lecture_hours: 2, lab_hours: 2, department: 'تكنولوجيا الملابس الجاهزة', year_level: 3, requires_lab: true, difficulty: 'medium', sectionHours: 1, prerequisites: [] },
  { id: 'c210', code: 'MA309', name_ar: 'تصميم أزياء المالبس الرجالي', name_en: 'تصميم أزياء المالبس الرجالي', credits: 3, lecture_hours: 2, lab_hours: 2, department: 'تكنولوجيا الملابس الجاهزة', year_level: 3, requires_lab: true, difficulty: 'medium', sectionHours: 1, prerequisites: [] },
  { id: 'c211', code: 'MA3010', name_ar: 'إعداد باترونات المالبس الكاجوال الرجالي', name_en: 'إعداد باترونات المالبس الكاجوال الرجالي', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'تكنولوجيا الملابس الجاهزة', year_level: 3, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c212', code: 'MA3011', name_ar: 'لغة إيطالية متخصصة في صناعة المالبس', name_en: 'لغة إيطالية متخصصة في صناعة المالبس', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'تكنولوجيا الملابس الجاهزة', year_level: 3, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c213', code: 'MA3012', name_ar: 'لغة إنجليزية متخصصة في صناعة المالبس', name_en: 'لغة إنجليزية متخصصة في صناعة المالبس', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'تكنولوجيا الملابس الجاهزة', year_level: 3, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c214', code: 'MA3013', name_ar: 'مقرر تخصصي اختياري', name_en: 'مقرر تخصصي اختياري', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'تكنولوجيا الملابس الجاهزة', year_level: 3, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c215', code: 'MA3014', name_ar: 'إعداد الباترونات بإستخدام الحاسب', name_en: 'إعداد الباترونات بإستخدام الحاسب', credits: 3, lecture_hours: 2, lab_hours: 2, department: 'تكنولوجيا الملابس الجاهزة', year_level: 3, requires_lab: true, difficulty: 'medium', sectionHours: 1, prerequisites: [] },
  { id: 'c216', code: 'MA3015', name_ar: 'مبادئ التسويق', name_en: 'مبادئ التسويق', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'تكنولوجيا الملابس الجاهزة', year_level: 3, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c217', code: 'MA3016', name_ar: 'إعداد باترونات المالبس الرسمية الرجالي', name_en: 'إعداد باترونات المالبس الرسمية الرجالي', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'تكنولوجيا الملابس الجاهزة', year_level: 3, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c218', code: 'MA3017', name_ar: 'دراسة متقدمة في تقنيات الحياكة الراقية', name_en: 'دراسة متقدمة في تقنيات الحياكة الراقية', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'تكنولوجيا الملابس الجاهزة', year_level: 3, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c219', code: 'MA3018', name_ar: 'اللغة اإليطالية للكتابة األكاديمية المتخصصة', name_en: 'اللغة اإليطالية للكتابة األكاديمية المتخصصة', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'تكنولوجيا الملابس الجاهزة', year_level: 3, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c220', code: 'MA3019', name_ar: 'اللغة اإلنجليزية للكتابة األكاديمية المتخصصة', name_en: 'اللغة اإلنجليزية للكتابة األكاديمية المتخصصة', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'تكنولوجيا الملابس الجاهزة', year_level: 3, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c221', code: 'MA4020', name_ar: 'إعداد باترونات مالبس األطفال', name_en: 'إعداد باترونات مالبس األطفال', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'تكنولوجيا الملابس الجاهزة', year_level: 4, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c222', code: 'MA4021', name_ar: 'فن زخرفة األقمشة', name_en: 'فن زخرفة األقمشة', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'تكنولوجيا الملابس الجاهزة', year_level: 4, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c223', code: 'MA4022', name_ar: 'أسس تخطيط اإلدارة الهندسية', name_en: 'أسس تخطيط اإلدارة الهندسية', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'تكنولوجيا الملابس الجاهزة', year_level: 4, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c224', code: 'MA4023', name_ar: 'التنبوء بالموضة واتجاهاتها', name_en: 'التنبوء بالموضة واتجاهاتها', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'تكنولوجيا الملابس الجاهزة', year_level: 4, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c225', code: 'MA4024', name_ar: 'مشروع التخرج 2', name_en: 'مشروع التخرج 2', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'تكنولوجيا الملابس الجاهزة', year_level: 4, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c226', code: 'MA4025', name_ar: 'الكتابة الفنية والعرض الشفوي', name_en: 'الكتابة الفنية والعرض الشفوي', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'تكنولوجيا الملابس الجاهزة', year_level: 4, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c227', code: 'MA4026', name_ar: 'تصميم التعبئة والتغليف', name_en: 'تصميم التعبئة والتغليف', credits: 3, lecture_hours: 2, lab_hours: 2, department: 'تكنولوجيا الملابس الجاهزة', year_level: 4, requires_lab: true, difficulty: 'medium', sectionHours: 1, prerequisites: [] },
  { id: 'c228', code: 'MA4027', name_ar: 'تصميم البورتفوليو', name_en: 'تصميم البورتفوليو', credits: 3, lecture_hours: 2, lab_hours: 2, department: 'تكنولوجيا الملابس الجاهزة', year_level: 4, requires_lab: true, difficulty: 'medium', sectionHours: 1, prerequisites: [] },
  { id: 'c229', code: 'MA4028', name_ar: 'تدريب ميداني 2', name_en: 'تدريب ميداني 2', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'تكنولوجيا الملابس الجاهزة', year_level: 4, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c230', code: 'MA4029', name_ar: 'مشروع تخرج 3', name_en: 'مشروع تخرج 3', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'تكنولوجيا الملابس الجاهزة', year_level: 4, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c231', code: 'MA4030', name_ar: 'مقدمة في المالبس الرياضية', name_en: 'مقدمة في المالبس الرياضية', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'تكنولوجيا الملابس الجاهزة', year_level: 4, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c232', code: 'MA4031', name_ar: 'تصميم مالبس األطفال', name_en: 'تصميم مالبس األطفال', credits: 3, lecture_hours: 2, lab_hours: 2, department: 'تكنولوجيا الملابس الجاهزة', year_level: 4, requires_lab: true, difficulty: 'medium', sectionHours: 1, prerequisites: [] },
  { id: 'c233', code: 'MA4032', name_ar: 'تصميم المالبس الوظيفية', name_en: 'تصميم المالبس الوظيفية', credits: 3, lecture_hours: 2, lab_hours: 2, department: 'تكنولوجيا الملابس الجاهزة', year_level: 4, requires_lab: true, difficulty: 'medium', sectionHours: 1, prerequisites: [] },
  { id: 'c234', code: 'MA4033', name_ar: 'الموضة المستدامة', name_en: 'الموضة المستدامة', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'تكنولوجيا الملابس الجاهزة', year_level: 4, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c235', code: 'MA4034', name_ar: 'فلسفة الموضه', name_en: 'فلسفة الموضه', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'تكنولوجيا الملابس الجاهزة', year_level: 4, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c236', code: 'MA4035', name_ar: 'األزياء الشعبية', name_en: 'األزياء الشعبية', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'تكنولوجيا الملابس الجاهزة', year_level: 4, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c237', code: 'MA4036', name_ar: 'النقد والتذوق الفني للموضة', name_en: 'النقد والتذوق الفني للموضة', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'تكنولوجيا الملابس الجاهزة', year_level: 4, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c238', code: 'MA4037', name_ar: 'مقدمة في صحافة الموضة', name_en: 'مقدمة في صحافة الموضة', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'تكنولوجيا الملابس الجاهزة', year_level: 4, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c239', code: 'MA4038', name_ar: 'إعداد عروض األزياء', name_en: 'إعداد عروض األزياء', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'تكنولوجيا الملابس الجاهزة', year_level: 4, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c240', code: 'MA4039', name_ar: 'المنسوجات الذكية', name_en: 'المنسوجات الذكية', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'تكنولوجيا الملابس الجاهزة', year_level: 4, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c241', code: 'MA4040', name_ar: 'تصميم وتنفيذ مكمالت المالبس', name_en: 'تصميم وتنفيذ مكمالت المالبس', credits: 3, lecture_hours: 2, lab_hours: 2, department: 'تكنولوجيا الملابس الجاهزة', year_level: 4, requires_lab: true, difficulty: 'medium', sectionHours: 1, prerequisites: [] },
  { id: 'c242', code: 'MA4041', name_ar: 'الصحة والسالمة المهنية', name_en: 'الصحة والسالمة المهنية', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'تكنولوجيا الملابس الجاهزة', year_level: 4, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c243', code: 'ME1042', name_ar: 'اللغة الإنجليزية الفنية في مكان العمل 1', name_en: 'اللغة الإنجليزية الفنية في مكان العمل 1', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الميكاترونكس', year_level: 1, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c244', code: 'ME1043', name_ar: 'مهارات الاتصال في التكنولوجيا', name_en: 'مهارات الاتصال في التكنولوجيا', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الميكاترونكس', year_level: 1, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c245', code: 'ME1044', name_ar: 'رياضيات للفنيين', name_en: 'رياضيات للفنيين', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الميكاترونكس', year_level: 1, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c246', code: 'ME1045', name_ar: 'تطبيقات الرياضيات والعلوم في التكنولوجيا', name_en: 'تطبيقات الرياضيات والعلوم في التكنولوجيا', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الميكاترونكس', year_level: 1, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c247', code: 'ME1046', name_ar: 'الصحة والسلامة وتقييم المخاطر في أماكن العمل', name_en: 'الصحة والسلامة وتقييم المخاطر في أماكن العمل', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الميكاترونكس', year_level: 1, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c248', code: 'ME1047', name_ar: 'فيزياء للفنيين', name_en: 'فيزياء للفنيين', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الميكاترونكس', year_level: 1, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c249', code: 'ME1048', name_ar: 'اللغة الإنجليزية الفنية في مكان العمل 2', name_en: 'اللغة الإنجليزية الفنية في مكان العمل 2', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الميكاترونكس', year_level: 1, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c250', code: 'ME1049', name_ar: 'دراسات بيئية', name_en: 'دراسات بيئية', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الميكاترونكس', year_level: 1, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c251', code: 'ME1050', name_ar: 'ورشة عمل أساسيات الميكاترونكس', name_en: 'ورشة عمل أساسيات الميكاترونكس', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الميكاترونكس', year_level: 1, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c252', code: 'ME1051', name_ar: 'تكنولوجيا الحاسوب', name_en: 'تكنولوجيا الحاسوب', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الميكاترونكس', year_level: 1, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c253', code: 'ME1052', name_ar: 'دوائر كهربية', name_en: 'دوائر كهربية', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الميكاترونكس', year_level: 1, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c254', code: 'ME1053', name_ar: 'التصميم بمساعدة الحاسوب للفنيين', name_en: 'التصميم بمساعدة الحاسوب للفنيين', credits: 3, lecture_hours: 2, lab_hours: 2, department: 'الميكاترونكس', year_level: 1, requires_lab: true, difficulty: 'medium', sectionHours: 1, prerequisites: [] },
  { id: 'c255', code: 'ME1054', name_ar: 'علم الحركة بمساعدة الحاسوب', name_en: 'علم الحركة بمساعدة الحاسوب', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الميكاترونكس', year_level: 1, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c256', code: 'ME2055', name_ar: 'تدريب عملي على النيوماتيك والهيدروليك', name_en: 'تدريب عملي على النيوماتيك والهيدروليك', credits: 3, lecture_hours: 2, lab_hours: 2, department: 'الميكاترونكس', year_level: 2, requires_lab: true, difficulty: 'medium', sectionHours: 1, prerequisites: [] },
  { id: 'c257', code: 'ME2056', name_ar: 'برمجة لتطبيقات الميكاترونكس', name_en: 'برمجة لتطبيقات الميكاترونكس', credits: 3, lecture_hours: 2, lab_hours: 2, department: 'الميكاترونكس', year_level: 2, requires_lab: true, difficulty: 'medium', sectionHours: 1, prerequisites: [] },
  { id: 'c258', code: 'ME2057', name_ar: 'اختيار المواد للتطبيقات الفنية', name_en: 'اختيار المواد للتطبيقات الفنية', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الميكاترونكس', year_level: 2, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c259', code: 'ME2058', name_ar: 'أساسيات التحكم القائم على الحاسوب الشخصي', name_en: 'أساسيات التحكم القائم على الحاسوب الشخصي', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الميكاترونكس', year_level: 2, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c260', code: 'ME2059', name_ar: 'التحكم المنطقي المبرمج (PLC)', name_en: 'التحكم المنطقي المبرمج (PLC)', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الميكاترونكس', year_level: 2, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c261', code: 'ME2060', name_ar: 'ورشة عمل الكهرباء والإلكترونيات', name_en: 'ورشة عمل الكهرباء والإلكترونيات', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الميكاترونكس', year_level: 2, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c262', code: 'ME2061', name_ar: 'صيانة الأنظمة الكهروميكانيكية', name_en: 'صيانة الأنظمة الكهروميكانيكية', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الميكاترونكس', year_level: 2, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c263', code: 'ME2062', name_ar: 'تصميم مشروع تخرج', name_en: 'تصميم مشروع تخرج', credits: 3, lecture_hours: 2, lab_hours: 2, department: 'الميكاترونكس', year_level: 2, requires_lab: true, difficulty: 'medium', sectionHours: 1, prerequisites: [] },
  { id: 'c264', code: 'ME2063', name_ar: 'أنظمة الميكاترونكس للتكنولوجيين', name_en: 'أنظمة الميكاترونكس للتكنولوجيين', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الميكاترونكس', year_level: 2, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c265', code: 'ME2064', name_ar: 'مقرر اختياري 1', name_en: 'مقرر اختياري 1', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الميكاترونكس', year_level: 2, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c266', code: 'ME2065', name_ar: 'المشاريع وريادة الأعمال 1', name_en: 'المشاريع وريادة الأعمال 1', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الميكاترونكس', year_level: 2, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c267', code: 'ME3066', name_ar: 'رياضيات للتكنولوجيين', name_en: 'رياضيات للتكنولوجيين', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الميكاترونكس', year_level: 3, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c268', code: 'ME3067', name_ar: 'التصميم ثلاثي الأبعاد والنمذجة الميكانيكية', name_en: 'التصميم ثلاثي الأبعاد والنمذجة الميكانيكية', credits: 3, lecture_hours: 2, lab_hours: 2, department: 'الميكاترونكس', year_level: 3, requires_lab: true, difficulty: 'medium', sectionHours: 1, prerequisites: [] },
  { id: 'c269', code: 'ME3068', name_ar: 'التحكم الآلي', name_en: 'التحكم الآلي', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الميكاترونكس', year_level: 3, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c270', code: 'ME3069', name_ar: 'أنظمة الروبوتات', name_en: 'أنظمة الروبوتات', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الميكاترونكس', year_level: 3, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c271', code: 'ME3070', name_ar: 'الحساسات وأجهزة القياس', name_en: 'الحساسات وأجهزة القياس', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الميكاترونكس', year_level: 3, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c272', code: 'ME3071', name_ar: 'إلكترونيات القوى والمحركات', name_en: 'إلكترونيات القوى والمحركات', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الميكاترونكس', year_level: 3, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c273', code: 'ME3072', name_ar: 'تكنولوجيا التحكم الرقمي باستخدام الحاسوب (CNC)', name_en: 'تكنولوجيا التحكم الرقمي باستخدام الحاسوب (CNC)', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الميكاترونكس', year_level: 3, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c274', code: 'ME3073', name_ar: 'تصميم الآليات للتكنولوجيين', name_en: 'تصميم الآليات للتكنولوجيين', credits: 3, lecture_hours: 2, lab_hours: 2, department: 'الميكاترونكس', year_level: 3, requires_lab: true, difficulty: 'medium', sectionHours: 1, prerequisites: [] },
  { id: 'c275', code: 'ME3074', name_ar: 'تكنولوجيا المعالجات الدقيقة', name_en: 'تكنولوجيا المعالجات الدقيقة', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الميكاترونكس', year_level: 3, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c276', code: 'ME3075', name_ar: 'تخطيط ومراقبة نظم الإنتاج', name_en: 'تخطيط ومراقبة نظم الإنتاج', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الميكاترونكس', year_level: 3, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c277', code: 'ME4076', name_ar: 'اتصالات الأعمال والأخلاقيات ومهارات التوظيف', name_en: 'اتصالات الأعمال والأخلاقيات ومهارات التوظيف', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الميكاترونكس', year_level: 4, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c278', code: 'ME4077', name_ar: 'الأنظمة المدمجة', name_en: 'الأنظمة المدمجة', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الميكاترونكس', year_level: 4, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c279', code: 'ME4078', name_ar: 'معالجة الإشارات الرقمية', name_en: 'معالجة الإشارات الرقمية', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الميكاترونكس', year_level: 4, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c280', code: 'ME4079', name_ar: 'النظم الديناميكية: النمذجة والتصميم', name_en: 'النظم الديناميكية: النمذجة والتصميم', credits: 3, lecture_hours: 2, lab_hours: 2, department: 'الميكاترونكس', year_level: 4, requires_lab: true, difficulty: 'medium', sectionHours: 1, prerequisites: [] },
  { id: 'c281', code: 'ME4080', name_ar: 'القياس ومراقبة الجودة للتكنولوجيين', name_en: 'القياس ومراقبة الجودة للتكنولوجيين', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الميكاترونكس', year_level: 4, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c282', code: 'ME4081', name_ar: 'تكنولوجيا التفاعل بين الإنسان والآلة', name_en: 'تكنولوجيا التفاعل بين الإنسان والآلة', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الميكاترونكس', year_level: 4, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c283', code: 'ME4082', name_ar: 'مقرر اختياري 2', name_en: 'مقرر اختياري 2', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الميكاترونكس', year_level: 4, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c284', code: 'ME4083', name_ar: 'المشاريع وريادة الأعمال 2', name_en: 'المشاريع وريادة الأعمال 2', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الميكاترونكس', year_level: 4, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c285', code: 'ME4084', name_ar: 'التحكم المنطقي المبرمج المتقدم', name_en: 'التحكم المنطقي المبرمج المتقدم', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الميكاترونكس', year_level: 4, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c286', code: 'ME4085', name_ar: 'مشروع التخرج', name_en: 'مشروع التخرج', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الميكاترونكس', year_level: 4, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c287', code: 'ME4086', name_ar: 'تكنولوجيا التصنيع', name_en: 'تكنولوجيا التصنيع', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الميكاترونكس', year_level: 4, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c288', code: 'ME4087', name_ar: 'الإشارات والنظم', name_en: 'الإشارات والنظم', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الميكاترونكس', year_level: 4, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c289', code: 'ME4088', name_ar: 'معمل الرسم الميكانيكي بمساعدة الحاسوب', name_en: 'معمل الرسم الميكانيكي بمساعدة الحاسوب', credits: 3, lecture_hours: 2, lab_hours: 2, department: 'الميكاترونكس', year_level: 4, requires_lab: true, difficulty: 'medium', sectionHours: 1, prerequisites: [] },
  { id: 'c290', code: 'ME4089', name_ar: 'تطبيقات التحكم', name_en: 'تطبيقات التحكم', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الميكاترونكس', year_level: 4, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c291', code: 'ME4090', name_ar: 'الميكاترونكس الطبية', name_en: 'الميكاترونكس الطبية', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الميكاترونكس', year_level: 4, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c292', code: 'ME4091', name_ar: 'نظم التشغيل', name_en: 'نظم التشغيل', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الميكاترونكس', year_level: 4, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c293', code: 'ME4092', name_ar: 'تطبيقات الدوائر المتكاملة', name_en: 'تطبيقات الدوائر المتكاملة', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الميكاترونكس', year_level: 4, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c294', code: 'ME4093', name_ar: 'أنظمة الإشراف والتحكم وجمع البيانات (SCADA)', name_en: 'أنظمة الإشراف والتحكم وجمع البيانات (SCADA)', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'الميكاترونكس', year_level: 4, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c295', code: 'TA1094', name_ar: 'رياضيات 1', name_en: 'رياضيات 1', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'التحكم في الاليات الصناعية', year_level: 1, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c296', code: 'TA1095', name_ar: 'مبادئ الالكترونيات', name_en: 'مبادئ الالكترونيات', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'التحكم في الاليات الصناعية', year_level: 1, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c297', code: 'TA1096', name_ar: 'رسم كهربى', name_en: 'رسم كهربى', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'التحكم في الاليات الصناعية', year_level: 1, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c298', code: 'TA1097', name_ar: 'فيزياء', name_en: 'فيزياء', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'التحكم في الاليات الصناعية', year_level: 1, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c299', code: 'TA1098', name_ar: 'مبادئ تشغيل الآلات الكهربية', name_en: 'مبادئ تشغيل الآلات الكهربية', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'التحكم في الاليات الصناعية', year_level: 1, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c300', code: 'TA1099', name_ar: 'لغة ايطالية 1', name_en: 'لغة ايطالية 1', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'التحكم في الاليات الصناعية', year_level: 1, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c301', code: 'TA100', name_ar: 'رياضيات 2', name_en: 'رياضيات 2', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'التحكم في الاليات الصناعية', year_level: 1, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c302', code: 'TA101', name_ar: 'الكترونيات صناعية', name_en: 'الكترونيات صناعية', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'التحكم في الاليات الصناعية', year_level: 1, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c303', code: 'TA102', name_ar: 'علوم حاسب', name_en: 'علوم حاسب', credits: 3, lecture_hours: 2, lab_hours: 2, department: 'التحكم في الاليات الصناعية', year_level: 1, requires_lab: true, difficulty: 'medium', sectionHours: 1, prerequisites: [] },
  { id: 'c304', code: 'TA103', name_ar: 'أساسيات الدوائر المنطقية والتتابعية', name_en: 'أساسيات الدوائر المنطقية والتتابعية', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'التحكم في الاليات الصناعية', year_level: 1, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c305', code: 'TA104', name_ar: 'الحساسات والمشغالت', name_en: 'الحساسات والمشغالت', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'التحكم في الاليات الصناعية', year_level: 1, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c306', code: 'TA105', name_ar: 'لغة ايطالية 2', name_en: 'لغة ايطالية 2', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'التحكم في الاليات الصناعية', year_level: 1, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c307', code: 'TA206', name_ar: 'التحكم فى العمليات الصناعية', name_en: 'التحكم فى العمليات الصناعية', credits: 3, lecture_hours: 2, lab_hours: 2, department: 'التحكم في الاليات الصناعية', year_level: 2, requires_lab: true, difficulty: 'medium', sectionHours: 1, prerequisites: [] },
  { id: 'c308', code: 'TA207', name_ar: 'التحكم المنطقى المبرمج', name_en: 'التحكم المنطقى المبرمج', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'التحكم في الاليات الصناعية', year_level: 2, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c309', code: 'TA208', name_ar: 'نظم التحريك الكهربى فى العمليات الصناعية', name_en: 'نظم التحريك الكهربى فى العمليات الصناعية', credits: 3, lecture_hours: 2, lab_hours: 2, department: 'التحكم في الاليات الصناعية', year_level: 2, requires_lab: true, difficulty: 'medium', sectionHours: 1, prerequisites: [] },
  { id: 'c310', code: 'TA209', name_ar: 'نظم التسخين والتبريد الكهربية', name_en: 'نظم التسخين والتبريد الكهربية', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'التحكم في الاليات الصناعية', year_level: 2, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c311', code: 'TA2010', name_ar: 'ألية صناعية وميكاترونيكس', name_en: 'ألية صناعية وميكاترونيكس', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'التحكم في الاليات الصناعية', year_level: 2, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c312', code: 'TA2011', name_ar: 'لغة انجليزية 1', name_en: 'لغة انجليزية 1', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'التحكم في الاليات الصناعية', year_level: 2, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c313', code: 'TA2012', name_ar: 'أخالقيات المهنة وقانون سوق العمل المصري', name_en: 'أخالقيات المهنة وقانون سوق العمل المصري', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'التحكم في الاليات الصناعية', year_level: 2, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c314', code: 'TA2013', name_ar: 'النظم الهيدروليكية والهوائية وتنقية الهواء والماء', name_en: 'النظم الهيدروليكية والهوائية وتنقية الهواء والماء', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'التحكم في الاليات الصناعية', year_level: 2, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c315', code: 'TA2014', name_ar: 'صيانة خطوط االنتاج', name_en: 'صيانة خطوط االنتاج', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'التحكم في الاليات الصناعية', year_level: 2, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c316', code: 'TA2015', name_ar: 'مهارات الإشراف على فريق', name_en: 'مهارات الإشراف على فريق', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'التحكم في الاليات الصناعية', year_level: 2, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c317', code: 'TA2016', name_ar: 'التدريب الميدانى', name_en: 'التدريب الميدانى', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'التحكم في الاليات الصناعية', year_level: 2, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c318', code: 'TA2017', name_ar: 'مشروع تخرج', name_en: 'مشروع تخرج', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'التحكم في الاليات الصناعية', year_level: 2, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c319', code: 'TA2018', name_ar: 'لغة انجليزية 2', name_en: 'لغة انجليزية 2', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'التحكم في الاليات الصناعية', year_level: 2, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c320', code: 'TA3019', name_ar: 'إشارات ونظم', name_en: 'إشارات ونظم', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'التحكم في الاليات الصناعية', year_level: 3, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c321', code: 'TA3020', name_ar: 'التحكم فى عمليات االنتاج', name_en: 'التحكم فى عمليات االنتاج', credits: 3, lecture_hours: 2, lab_hours: 2, department: 'التحكم في الاليات الصناعية', year_level: 3, requires_lab: true, difficulty: 'medium', sectionHours: 1, prerequisites: [] },
  { id: 'c322', code: 'TA3021', name_ar: 'مدخل الى نظم االشراف والتحكم SCADA', name_en: 'مدخل الى نظم االشراف والتحكم SCADA', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'التحكم في الاليات الصناعية', year_level: 3, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c323', code: 'TA3022', name_ar: 'االحصاء ونظرية االحتماالت', name_en: 'االحصاء ونظرية االحتماالت', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'التحكم في الاليات الصناعية', year_level: 3, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c324', code: 'TA3023', name_ar: 'معالجة المياه فى النظم الصناعية', name_en: 'معالجة المياه فى النظم الصناعية', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'التحكم في الاليات الصناعية', year_level: 3, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c325', code: 'TA3024', name_ar: 'لغة أيطالية 3', name_en: 'لغة أيطالية 3', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'التحكم في الاليات الصناعية', year_level: 3, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c326', code: 'TA3025', name_ar: 'جودة التحكم', name_en: 'جودة التحكم', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'التحكم في الاليات الصناعية', year_level: 3, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c327', code: 'TA3026', name_ar: 'التحكم المنطقى المبرمج ونظم التحكم واالشراف', name_en: 'التحكم المنطقى المبرمج ونظم التحكم واالشراف', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'التحكم في الاليات الصناعية', year_level: 3, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c328', code: 'TA3027', name_ar: 'أجهزة القياس والتحكم الصناعية', name_en: 'أجهزة القياس والتحكم الصناعية', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'التحكم في الاليات الصناعية', year_level: 3, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c329', code: 'TA3028', name_ar: 'إعداد البرنامج والتشغيل والتوثيق', name_en: 'إعداد البرنامج والتشغيل والتوثيق', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'التحكم في الاليات الصناعية', year_level: 3, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c330', code: 'TA3029', name_ar: 'المنازل الذكية', name_en: 'المنازل الذكية', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'التحكم في الاليات الصناعية', year_level: 3, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c331', code: 'TA3030', name_ar: 'لغة أيطالية 4', name_en: 'لغة أيطالية 4', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'التحكم في الاليات الصناعية', year_level: 3, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c332', code: 'TA4031', name_ar: 'المتحكمات الدقيقة', name_en: 'المتحكمات الدقيقة', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'التحكم في الاليات الصناعية', year_level: 4, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c333', code: 'TA4032', name_ar: 'مراقبة وتقييم خطوط االنتاج', name_en: 'مراقبة وتقييم خطوط االنتاج', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'التحكم في الاليات الصناعية', year_level: 4, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c334', code: 'TA4033', name_ar: 'الشبكات الصناعية والبروتوكوالت', name_en: 'الشبكات الصناعية والبروتوكوالت', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'التحكم في الاليات الصناعية', year_level: 4, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c335', code: 'TA4034', name_ar: 'نظم الطاقة المتجددة', name_en: 'نظم الطاقة المتجددة', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'التحكم في الاليات الصناعية', year_level: 4, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c336', code: 'TA4035', name_ar: 'نظم التصنيع المتقدمة', name_en: 'نظم التصنيع المتقدمة', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'التحكم في الاليات الصناعية', year_level: 4, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c337', code: 'TA4036', name_ar: 'لغة أنجليزية 3', name_en: 'لغة أنجليزية 3', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'التحكم في الاليات الصناعية', year_level: 4, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c338', code: 'TA4037', name_ar: 'تقنيات اكتشاف األعطال وإصالحها والصيانة', name_en: 'تقنيات اكتشاف األعطال وإصالحها والصيانة', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'التحكم في الاليات الصناعية', year_level: 4, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c339', code: 'TA4038', name_ar: 'برمجة الخاليا الصناعية', name_en: 'برمجة الخاليا الصناعية', credits: 3, lecture_hours: 2, lab_hours: 2, department: 'التحكم في الاليات الصناعية', year_level: 4, requires_lab: true, difficulty: 'medium', sectionHours: 1, prerequisites: [] },
  { id: 'c340', code: 'TA4039', name_ar: 'مهارات االدارة', name_en: 'مهارات االدارة', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'التحكم في الاليات الصناعية', year_level: 4, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c341', code: 'TA4040', name_ar: 'التدريب الميدانى 2', name_en: 'التدريب الميدانى 2', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'التحكم في الاليات الصناعية', year_level: 4, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c342', code: 'TA4041', name_ar: 'مشروع التخرج 2', name_en: 'مشروع التخرج 2', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'التحكم في الاليات الصناعية', year_level: 4, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
  { id: 'c343', code: 'TA4042', name_ar: 'لغة انجليزية 4', name_en: 'لغة انجليزية 4', credits: 3, lecture_hours: 2, lab_hours: 0, department: 'التحكم في الاليات الصناعية', year_level: 4, requires_lab: false, difficulty: 'medium', sectionHours: 0, prerequisites: [] },
];

export const SAMPLE_GROUPS: StudentGroup[] = [
  { id: 'g1', department: 'الذكاء الاصطناعي', year: 1, section: 'A', student_count: 50, courseIds: ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'c10', 'c11', 'c12', 'c13', 'c14', 'c15', 'c16', 'c17', 'c18'] },
  { id: 'g2', department: 'الذكاء الاصطناعي', year: 1, section: 'B', student_count: 45, courseIds: ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'c10', 'c11', 'c12', 'c13', 'c14', 'c15', 'c16', 'c17', 'c18'] },
  { id: 'g3', department: 'الذكاء الاصطناعي', year: 2, section: 'A', student_count: 50, courseIds: ['c19', 'c20', 'c21', 'c22', 'c23', 'c24', 'c25', 'c26', 'c27', 'c28', 'c29', 'c30', 'c31', 'c32', 'c33'] },
  { id: 'g4', department: 'الذكاء الاصطناعي', year: 2, section: 'B', student_count: 45, courseIds: ['c19', 'c20', 'c21', 'c22', 'c23', 'c24', 'c25', 'c26', 'c27', 'c28', 'c29', 'c30', 'c31', 'c32', 'c33'] },
  { id: 'g5', department: 'الذكاء الاصطناعي', year: 3, section: 'A', student_count: 50, courseIds: ['c34', 'c35', 'c36', 'c37', 'c38', 'c39', 'c40', 'c41', 'c42', 'c43', 'c44', 'c45', 'c46'] },
  { id: 'g6', department: 'الذكاء الاصطناعي', year: 3, section: 'B', student_count: 45, courseIds: ['c34', 'c35', 'c36', 'c37', 'c38', 'c39', 'c40', 'c41', 'c42', 'c43', 'c44', 'c45', 'c46'] },
  { id: 'g7', department: 'الذكاء الاصطناعي', year: 4, section: 'A', student_count: 50, courseIds: ['c47', 'c48', 'c49', 'c50', 'c51', 'c52', 'c53', 'c54', 'c55', 'c56', 'c57'] },
  { id: 'g8', department: 'الذكاء الاصطناعي', year: 4, section: 'B', student_count: 45, courseIds: ['c47', 'c48', 'c49', 'c50', 'c51', 'c52', 'c53', 'c54', 'c55', 'c56', 'c57'] },
  { id: 'g9', department: 'الأمن السيبراني', year: 1, section: 'A', student_count: 50, courseIds: ['c58', 'c59', 'c60', 'c61', 'c62', 'c63', 'c64', 'c65', 'c66', 'c67', 'c68', 'c69', 'c70', 'c71', 'c72', 'c73', 'c74', 'c75'] },
  { id: 'g10', department: 'الأمن السيبراني', year: 1, section: 'B', student_count: 45, courseIds: ['c58', 'c59', 'c60', 'c61', 'c62', 'c63', 'c64', 'c65', 'c66', 'c67', 'c68', 'c69', 'c70', 'c71', 'c72', 'c73', 'c74', 'c75'] },
  { id: 'g11', department: 'الأمن السيبراني', year: 2, section: 'A', student_count: 50, courseIds: ['c76', 'c77', 'c78', 'c79', 'c80', 'c81', 'c82', 'c83', 'c84', 'c85', 'c86', 'c87', 'c88', 'c89', 'c90'] },
  { id: 'g12', department: 'الأمن السيبراني', year: 2, section: 'B', student_count: 45, courseIds: ['c76', 'c77', 'c78', 'c79', 'c80', 'c81', 'c82', 'c83', 'c84', 'c85', 'c86', 'c87', 'c88', 'c89', 'c90'] },
  { id: 'g13', department: 'الأمن السيبراني', year: 3, section: 'A', student_count: 50, courseIds: ['c91', 'c92', 'c93', 'c94', 'c95', 'c96', 'c97', 'c98', 'c99', 'c100', 'c101', 'c102', 'c103'] },
  { id: 'g14', department: 'الأمن السيبراني', year: 3, section: 'B', student_count: 45, courseIds: ['c91', 'c92', 'c93', 'c94', 'c95', 'c96', 'c97', 'c98', 'c99', 'c100', 'c101', 'c102', 'c103'] },
  { id: 'g15', department: 'الأمن السيبراني', year: 4, section: 'A', student_count: 50, courseIds: ['c104', 'c105', 'c106', 'c107', 'c108', 'c109', 'c110', 'c111', 'c112', 'c113', 'c114', 'c115', 'c116', 'c117', 'c118', 'c119', 'c120'] },
  { id: 'g16', department: 'الأمن السيبراني', year: 4, section: 'B', student_count: 45, courseIds: ['c104', 'c105', 'c106', 'c107', 'c108', 'c109', 'c110', 'c111', 'c112', 'c113', 'c114', 'c115', 'c116', 'c117', 'c118', 'c119', 'c120'] },
  { id: 'g17', department: 'علوم البيانات', year: 1, section: 'A', student_count: 50, courseIds: ['c121', 'c122', 'c123', 'c124', 'c125', 'c126', 'c127', 'c128', 'c129', 'c130', 'c131', 'c132', 'c133', 'c134', 'c135', 'c136', 'c137', 'c138'] },
  { id: 'g18', department: 'علوم البيانات', year: 1, section: 'B', student_count: 45, courseIds: ['c121', 'c122', 'c123', 'c124', 'c125', 'c126', 'c127', 'c128', 'c129', 'c130', 'c131', 'c132', 'c133', 'c134', 'c135', 'c136', 'c137', 'c138'] },
  { id: 'g19', department: 'علوم البيانات', year: 2, section: 'A', student_count: 50, courseIds: ['c139', 'c140', 'c141', 'c142', 'c143', 'c144', 'c145', 'c146', 'c147', 'c148', 'c149', 'c150', 'c151', 'c152', 'c153'] },
  { id: 'g20', department: 'علوم البيانات', year: 2, section: 'B', student_count: 45, courseIds: ['c139', 'c140', 'c141', 'c142', 'c143', 'c144', 'c145', 'c146', 'c147', 'c148', 'c149', 'c150', 'c151', 'c152', 'c153'] },
  { id: 'g21', department: 'علوم البيانات', year: 3, section: 'A', student_count: 50, courseIds: ['c154', 'c155', 'c156', 'c157', 'c158', 'c159', 'c160', 'c161', 'c162', 'c163', 'c164', 'c165', 'c166'] },
  { id: 'g22', department: 'علوم البيانات', year: 3, section: 'B', student_count: 45, courseIds: ['c154', 'c155', 'c156', 'c157', 'c158', 'c159', 'c160', 'c161', 'c162', 'c163', 'c164', 'c165', 'c166'] },
  { id: 'g23', department: 'علوم البيانات', year: 4, section: 'A', student_count: 50, courseIds: ['c167', 'c168', 'c169', 'c170', 'c171', 'c172', 'c173', 'c174', 'c175', 'c176', 'c177', 'c178', 'c179', 'c180', 'c181', 'c182', 'c183'] },
  { id: 'g24', department: 'علوم البيانات', year: 4, section: 'B', student_count: 45, courseIds: ['c167', 'c168', 'c169', 'c170', 'c171', 'c172', 'c173', 'c174', 'c175', 'c176', 'c177', 'c178', 'c179', 'c180', 'c181', 'c182', 'c183'] },
  { id: 'g25', department: 'تكنولوجيا الملابس الجاهزة', year: 1, section: 'A', student_count: 50, courseIds: ['c184', 'c185', 'c186', 'c187', 'c188', 'c189', 'c190', 'c191', 'c192', 'c193', 'c194', 'c195', 'c196'] },
  { id: 'g26', department: 'تكنولوجيا الملابس الجاهزة', year: 1, section: 'B', student_count: 45, courseIds: ['c184', 'c185', 'c186', 'c187', 'c188', 'c189', 'c190', 'c191', 'c192', 'c193', 'c194', 'c195', 'c196'] },
  { id: 'g27', department: 'تكنولوجيا الملابس الجاهزة', year: 2, section: 'A', student_count: 50, courseIds: ['c197', 'c198', 'c199', 'c200', 'c201', 'c202', 'c203', 'c204', 'c205', 'c206', 'c207', 'c208'] },
  { id: 'g28', department: 'تكنولوجيا الملابس الجاهزة', year: 2, section: 'B', student_count: 45, courseIds: ['c197', 'c198', 'c199', 'c200', 'c201', 'c202', 'c203', 'c204', 'c205', 'c206', 'c207', 'c208'] },
  { id: 'g29', department: 'تكنولوجيا الملابس الجاهزة', year: 3, section: 'A', student_count: 50, courseIds: ['c209', 'c210', 'c211', 'c212', 'c213', 'c214', 'c215', 'c216', 'c217', 'c218', 'c219', 'c220'] },
  { id: 'g30', department: 'تكنولوجيا الملابس الجاهزة', year: 3, section: 'B', student_count: 45, courseIds: ['c209', 'c210', 'c211', 'c212', 'c213', 'c214', 'c215', 'c216', 'c217', 'c218', 'c219', 'c220'] },
  { id: 'g31', department: 'تكنولوجيا الملابس الجاهزة', year: 4, section: 'A', student_count: 50, courseIds: ['c221', 'c222', 'c223', 'c224', 'c225', 'c226', 'c227', 'c228', 'c229', 'c230', 'c231', 'c232', 'c233', 'c234', 'c235', 'c236', 'c237', 'c238', 'c239', 'c240', 'c241', 'c242'] },
  { id: 'g32', department: 'تكنولوجيا الملابس الجاهزة', year: 4, section: 'B', student_count: 45, courseIds: ['c221', 'c222', 'c223', 'c224', 'c225', 'c226', 'c227', 'c228', 'c229', 'c230', 'c231', 'c232', 'c233', 'c234', 'c235', 'c236', 'c237', 'c238', 'c239', 'c240', 'c241', 'c242'] },
  { id: 'g33', department: 'الميكاترونكس', year: 1, section: 'A', student_count: 50, courseIds: ['c243', 'c244', 'c245', 'c246', 'c247', 'c248', 'c249', 'c250', 'c251', 'c252', 'c253', 'c254', 'c255'] },
  { id: 'g34', department: 'الميكاترونكس', year: 1, section: 'B', student_count: 45, courseIds: ['c243', 'c244', 'c245', 'c246', 'c247', 'c248', 'c249', 'c250', 'c251', 'c252', 'c253', 'c254', 'c255'] },
  { id: 'g35', department: 'الميكاترونكس', year: 2, section: 'A', student_count: 50, courseIds: ['c256', 'c257', 'c258', 'c259', 'c260', 'c261', 'c262', 'c263', 'c264', 'c265', 'c266'] },
  { id: 'g36', department: 'الميكاترونكس', year: 2, section: 'B', student_count: 45, courseIds: ['c256', 'c257', 'c258', 'c259', 'c260', 'c261', 'c262', 'c263', 'c264', 'c265', 'c266'] },
  { id: 'g37', department: 'الميكاترونكس', year: 3, section: 'A', student_count: 50, courseIds: ['c267', 'c268', 'c269', 'c270', 'c271', 'c272', 'c273', 'c274', 'c275', 'c276'] },
  { id: 'g38', department: 'الميكاترونكس', year: 3, section: 'B', student_count: 45, courseIds: ['c267', 'c268', 'c269', 'c270', 'c271', 'c272', 'c273', 'c274', 'c275', 'c276'] },
  { id: 'g39', department: 'الميكاترونكس', year: 4, section: 'A', student_count: 50, courseIds: ['c277', 'c278', 'c279', 'c280', 'c281', 'c282', 'c283', 'c284', 'c285', 'c286', 'c287', 'c288', 'c289', 'c290', 'c291', 'c292', 'c293', 'c294'] },
  { id: 'g40', department: 'الميكاترونكس', year: 4, section: 'B', student_count: 45, courseIds: ['c277', 'c278', 'c279', 'c280', 'c281', 'c282', 'c283', 'c284', 'c285', 'c286', 'c287', 'c288', 'c289', 'c290', 'c291', 'c292', 'c293', 'c294'] },
  { id: 'g41', department: 'التحكم في الاليات الصناعية', year: 1, section: 'A', student_count: 50, courseIds: ['c295', 'c296', 'c297', 'c298', 'c299', 'c300', 'c301', 'c302', 'c303', 'c304', 'c305', 'c306'] },
  { id: 'g42', department: 'التحكم في الاليات الصناعية', year: 1, section: 'B', student_count: 45, courseIds: ['c295', 'c296', 'c297', 'c298', 'c299', 'c300', 'c301', 'c302', 'c303', 'c304', 'c305', 'c306'] },
  { id: 'g43', department: 'التحكم في الاليات الصناعية', year: 2, section: 'A', student_count: 50, courseIds: ['c307', 'c308', 'c309', 'c310', 'c311', 'c312', 'c313', 'c314', 'c315', 'c316', 'c317', 'c318', 'c319'] },
  { id: 'g44', department: 'التحكم في الاليات الصناعية', year: 2, section: 'B', student_count: 45, courseIds: ['c307', 'c308', 'c309', 'c310', 'c311', 'c312', 'c313', 'c314', 'c315', 'c316', 'c317', 'c318', 'c319'] },
  { id: 'g45', department: 'التحكم في الاليات الصناعية', year: 3, section: 'A', student_count: 50, courseIds: ['c320', 'c321', 'c322', 'c323', 'c324', 'c325', 'c326', 'c327', 'c328', 'c329', 'c330', 'c331'] },
  { id: 'g46', department: 'التحكم في الاليات الصناعية', year: 3, section: 'B', student_count: 45, courseIds: ['c320', 'c321', 'c322', 'c323', 'c324', 'c325', 'c326', 'c327', 'c328', 'c329', 'c330', 'c331'] },
  { id: 'g47', department: 'التحكم في الاليات الصناعية', year: 4, section: 'A', student_count: 50, courseIds: ['c332', 'c333', 'c334', 'c335', 'c336', 'c337', 'c338', 'c339', 'c340', 'c341', 'c342', 'c343'] },
  { id: 'g48', department: 'التحكم في الاليات الصناعية', year: 4, section: 'B', student_count: 45, courseIds: ['c332', 'c333', 'c334', 'c335', 'c336', 'c337', 'c338', 'c339', 'c340', 'c341', 'c342', 'c343'] },
];

// Generate realistic sample timetable entries
export function generateSampleTimetable(): TimetableEntry[] {
  const entries: TimetableEntry[] = [];
  const days: Day[] = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء'];

  const assignments: { courseIdx: number; profIdx: number; roomIdx: number; groupIdx: number; day: number; slot: number }[] = [
    { courseIdx: 0, profIdx: 0, roomIdx: 3, groupIdx: 0, day: 0, slot: 0 },
    { courseIdx: 0, profIdx: 0, roomIdx: 0, groupIdx: 1, day: 0, slot: 1 },
    { courseIdx: 1, profIdx: 0, roomIdx: 1, groupIdx: 2, day: 1, slot: 0 },
    { courseIdx: 2, profIdx: 1, roomIdx: 4, groupIdx: 4, day: 1, slot: 2 },
    { courseIdx: 3, profIdx: 2, roomIdx: 3, groupIdx: 5, day: 2, slot: 0 },
    { courseIdx: 4, profIdx: 3, roomIdx: 2, groupIdx: 6, day: 2, slot: 1 },
    { courseIdx: 5, profIdx: 4, roomIdx: 4, groupIdx: 7, day: 3, slot: 0 },
    { courseIdx: 6, profIdx: 5, roomIdx: 5, groupIdx: 8, day: 3, slot: 2 },
    { courseIdx: 7, profIdx: 6, roomIdx: 5, groupIdx: 9, day: 4, slot: 0 },
    { courseIdx: 8, profIdx: 7, roomIdx: 1, groupIdx: 2, day: 4, slot: 1 },
    { courseIdx: 9, profIdx: 1, roomIdx: 0, groupIdx: 3, day: 0, slot: 2 },
    { courseIdx: 1, profIdx: 0, roomIdx: 2, groupIdx: 0, day: 1, slot: 1 },
    { courseIdx: 3, profIdx: 2, roomIdx: 1, groupIdx: 5, day: 3, slot: 1 },
    { courseIdx: 5, profIdx: 4, roomIdx: 3, groupIdx: 7, day: 4, slot: 2 },
    { courseIdx: 7, profIdx: 6, roomIdx: 4, groupIdx: 9, day: 2, slot: 3 },
    { courseIdx: 2, profIdx: 1, roomIdx: 0, groupIdx: 4, day: 4, slot: 3 },
    { courseIdx: 4, profIdx: 3, roomIdx: 2, groupIdx: 6, day: 0, slot: 3 },
    { courseIdx: 6, profIdx: 5, roomIdx: 5, groupIdx: 8, day: 1, slot: 3 },
    { courseIdx: 8, profIdx: 7, roomIdx: 1, groupIdx: 0, day: 2, slot: 2 },
    { courseIdx: 9, profIdx: 1, roomIdx: 0, groupIdx: 3, day: 3, slot: 3 },
  ];

  assignments.forEach((a, i) => {
    entries.push({
      id: `te${i + 1}`,
      day: days[a.day],
      slot_id: SAMPLE_TIME_SLOTS[a.slot].id,
      course: SAMPLE_COURSES[a.courseIdx],
      professor: SAMPLE_PROFESSORS[a.profIdx],
      room: SAMPLE_ROOMS[a.roomIdx],
      group: SAMPLE_GROUPS[a.groupIdx],
    });
  });

  return entries;
}
