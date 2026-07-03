'use client';

// ==========================================
// HITU Timetable Engine — API Client
// Connects the Next.js frontend to the Rust scheduling engine
// ==========================================

import type {
  Professor, Room, Course, StudentGroup, TimeSettings, TimetableEntry, Day, TimeSlot,
} from './timetable-types';
import { SAMPLE_TIME_SLOTS } from './timetable-types';

// ==========================================
// Configuration
// ==========================================

export const TIMETABLE_API_URL =
  process.env.NEXT_PUBLIC_TIMETABLE_API_URL || 'https://hitu-timetable.azurecontainerapps.io';

// ==========================================
// Rust-side type definitions (mirrors models.rs)
// ==========================================

type RustDay = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday';

interface RustUnavailability {
  day: RustDay;
  period: number | null; // None = whole day
  reason: string | null;
}

interface RustPreference {
  preference_type: RustPreferenceType;
  weight: number;
}

type RustPreferenceType =
  | 'Morning'
  | 'Afternoon'
  | { SpecificDay: RustDay }
  | 'AvoidConsecutive';

interface RustProfessor {
  id: string;
  name: string;
  department_id: string;
  max_hours_per_day: number;
  max_hours_per_week: number;
  unavailabilities: RustUnavailability[];
  preferences: RustPreference[];
}

interface RustTeachingAssistant {
  id: string;
  name: string;
  department_id: string;
  supervisor_id: string;
  lab_ids: string[];
  max_hours_per_day: number;
  max_hours_per_week: number;
  unavailabilities: RustUnavailability[];
}

interface RustBuilding {
  id: string;
  name: string;
  distance_matrix: Record<string, number>;
}

type RustRoomType = 'LectureHall' | 'SmartRoom' | 'ComputerLab' | 'ScienceLab' | 'Workshop' | 'Amphitheater';

interface RustRoom {
  id: string;
  name: string;
  building_id: string;
  capacity: number;
  room_type: RustRoomType;
  equipment: string[];
}

type RustDifficulty = 'Easy' | 'Medium' | 'Hard';

interface RustCourse {
  id: string;
  code: string;
  name: string;
  department_id: string;
  lecture_hours_per_week: number;
  lab_hours_per_week: number;
  section_hours_per_week: number;
  requires_lab: boolean;
  lab_type: RustRoomType | null;
  difficulty: RustDifficulty;
}

interface RustAcademicGroup {
  id: string;
  year: number;
  department_id: string;
  section: string | null;
  student_count: number;
  course_ids: string[];
}

interface RustTimeSlot {
  id: string;
  day: RustDay;
  period: number;
  start_time: string;
  end_time: string;
}

interface RustConstraintWeights {
  gap_minimization: number;
  workday_distribution: number;
  difficulty_timing: number;
  travel_minimization: number;
  staff_preferences: number;
  workload_balance: number;
}

interface RustSchedulingInput {
  institution_id: string;
  term_id: string;
  professors: RustProfessor[];
  teaching_assistants: RustTeachingAssistant[];
  rooms: RustRoom[];
  buildings: RustBuilding[];
  courses: RustCourse[];
  groups: RustAcademicGroup[];
  time_slots: RustTimeSlot[];
  constraint_weights: RustConstraintWeights;
}

type RustEventType = 'Lecture' | 'Section' | 'Lab' | 'Exam';

interface RustScheduledEvent {
  id: string;
  course_id: string;
  group_id: string;
  professor_id: string | null;
  ta_id: string | null;
  room_id: string;
  time_slot: RustTimeSlot;
  event_type: RustEventType;
  is_pinned: boolean;
}

interface RustTimetable {
  id: string;
  events: RustScheduledEvent[];
  fitness: number;
  hard_violations: number;
  soft_score: number;
  generation: number;
}

interface RustGenerationStats {
  total_generations: number;
  best_fitness: number;
  hard_violations: number;
  soft_score: number;
  elapsed_ms: number;
  population_size: number;
}

interface RustSchedulingResult {
  timetable: RustTimetable;
  stats: RustGenerationStats;
  unscheduled_events: string[];
  warnings: string[];
}

interface RustApiResponse<T> {
  success: boolean;
  data: T | null;
  error: string | null;
}

interface RustGenerateRequest {
  input: RustSchedulingInput;
  config?: {
    population_size?: number;
    max_generations?: number;
    mutation_rate?: number;
    crossover_rate?: number;
    elite_count?: number;
    tabu_tenure?: number;
    time_limit_ms?: number;
  } | null;
}

// ==========================================
// Public types for the frontend
// ==========================================

export interface GenerationResult {
  entries: TimetableEntry[];
  stats: {
    totalGenerations: number;
    bestFitness: number;
    hardViolations: number;
    softScore: number;
    elapsedMs: number;
    populationSize: number;
  };
  unscheduledEvents: string[];
  warnings: string[];
  timetableId: string;
}

export interface ApiError {
  message: string;
  type: 'network' | 'timeout' | 'server' | 'parse' | 'unknown';
}

// ==========================================
// Day Mapping (Arabic ↔ Rust Enum)
// ==========================================

const ARABIC_TO_RUST_DAY: Record<string, RustDay> = {
  'الأحد': 'Sunday',
  'الاثنين': 'Monday',
  'الثلاثاء': 'Tuesday',
  'الأربعاء': 'Wednesday',
  'الخميس': 'Thursday',
  'السبت': 'Sunday', // Map السبت to Sunday as fallback since Rust doesn't have Saturday
};

const RUST_TO_ARABIC_DAY: Record<RustDay, Day> = {
  'Sunday': 'الأحد',
  'Monday': 'الاثنين',
  'Tuesday': 'الثلاثاء',
  'Wednesday': 'الأربعاء',
  'Thursday': 'الخميس',
};

// Department name → ID mapping
const DEPARTMENT_ID_MAP: Record<string, string> = {
  'علوم الحاسب': 'cs',
  'الذكاء الاصطناعي': 'ai',
  'علوم البيانات': 'ds',
  'الأمن السيبراني': 'cy',
  'نظم المعلومات': 'is',
  'الميكاترونكس': 'mx',
  'الأوتوترونكس': 'at',
};

const DEPARTMENT_NAME_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(DEPARTMENT_ID_MAP).map(([name, id]) => [id, name])
);

// Room type mapping
const ROOM_TYPE_TO_RUST: Record<string, RustRoomType> = {
  'قاعة محاضرات': 'LectureHall',
  'معمل': 'ComputerLab',
};

const RUST_ROOM_TYPE_TO_AR: Record<RustRoomType, string> = {
  'LectureHall': 'قاعة محاضرات',
  'SmartRoom': 'قاعة محاضرات',
  'ComputerLab': 'معمل',
  'ScienceLab': 'معمل',
  'Workshop': 'معمل',
  'Amphitheater': 'قاعة محاضرات',
};

// ==========================================
// Mapper: Frontend → Rust (mapToRustInput)
// ==========================================

export function mapToRustInput(
  professors: Professor[],
  rooms: Room[],
  courses: Course[],
  groups: StudentGroup[],
  timeSettings: TimeSettings,
): RustSchedulingInput {
  // Build unique buildings from rooms
  const buildingNames = [...new Set(rooms.map(r => r.building))];
  const buildings: RustBuilding[] = buildingNames.map((name, i) => ({
    id: `bldg_${i}`,
    name,
    distance_matrix: {},
  }));
  const buildingNameToId: Record<string, string> = {};
  buildings.forEach(b => { buildingNameToId[b.name] = b.id; });

  // Map professors
  const rustProfessors: RustProfessor[] = professors.map(p => ({
    id: p.id,
    name: p.name,
    department_id: DEPARTMENT_ID_MAP[p.department] || p.department,
    max_hours_per_day: 6, // reasonable default
    max_hours_per_week: p.max_hours,
    unavailabilities: p.unavailable.map(u => ({
      day: ARABIC_TO_RUST_DAY[u.day] || 'Sunday',
      period: u.period,
      reason: null,
    })),
    preferences: [],
  }));

  // Map rooms
  const rustRooms: RustRoom[] = rooms.map(r => ({
    id: r.id,
    name: r.name,
    building_id: buildingNameToId[r.building] || 'bldg_0',
    capacity: r.capacity,
    room_type: ROOM_TYPE_TO_RUST[r.type] || 'LectureHall',
    equipment: r.equipment,
  }));

  // Map courses
  const rustCourses: RustCourse[] = courses.map(c => ({
    id: c.id,
    code: c.code,
    name: c.name_ar, // Use Arabic name as the primary name
    department_id: DEPARTMENT_ID_MAP[c.department] || c.department,
    lecture_hours_per_week: c.lecture_hours,
    lab_hours_per_week: c.lab_hours,
    section_hours_per_week: 0,
    requires_lab: c.requires_lab,
    lab_type: c.requires_lab ? 'ComputerLab' : null,
    difficulty: 'Medium' as RustDifficulty,
  }));

  // Map groups — link courses to groups by matching department + year
  const rustGroups: RustAcademicGroup[] = groups.map(g => {
    const deptId = DEPARTMENT_ID_MAP[g.department] || g.department;
    // Find courses matching this group's department and year level
    const matchingCourseIds = courses
      .filter(c => (DEPARTMENT_ID_MAP[c.department] || c.department) === deptId && c.year_level === g.year)
      .map(c => c.id);

    return {
      id: g.id,
      year: g.year,
      department_id: deptId,
      section: g.section,
      student_count: g.student_count,
      course_ids: matchingCourseIds,
    };
  });

  // Map time slots — expand each slot across all working days
  const rustTimeSlots: RustTimeSlot[] = [];
  const workingDays = timeSettings.working_days;
  const slots = timeSettings.slots;

  for (const day of workingDays) {
    const rustDay = ARABIC_TO_RUST_DAY[day];
    if (!rustDay) continue;

    for (let period = 0; period < slots.length; period++) {
      const slot = slots[period];
      rustTimeSlots.push({
        id: `${rustDay}_${period}`,
        day: rustDay,
        period,
        start_time: slot.start_time,
        end_time: slot.end_time,
      });
    }
  }

  return {
    institution_id: 'hitu',
    term_id: timeSettings.semester_name,
    professors: rustProfessors,
    teaching_assistants: [],
    rooms: rustRooms,
    buildings,
    courses: rustCourses,
    groups: rustGroups,
    time_slots: rustTimeSlots,
    constraint_weights: {
      gap_minimization: 0.25,
      workday_distribution: 0.15,
      difficulty_timing: 0.10,
      travel_minimization: 0.20,
      staff_preferences: 0.10,
      workload_balance: 0.20,
    },
  };
}

// ==========================================
// Mapper: Rust → Frontend (mapFromRustOutput)
// ==========================================

export function mapFromRustOutput(
  result: RustSchedulingResult,
  professors: Professor[],
  rooms: Room[],
  courses: Course[],
  groups: StudentGroup[],
  timeSettings: TimeSettings,
): GenerationResult {
  // Build lookup maps for quick access
  const profMap = new Map(professors.map(p => [p.id, p]));
  const roomMap = new Map(rooms.map(r => [r.id, r]));
  const courseMap = new Map(courses.map(c => [c.id, c]));
  const groupMap = new Map(groups.map(g => [g.id, g]));

  // Map slot period → TimeSlot from settings
  const slotsArr = timeSettings.slots;

  const entries: TimetableEntry[] = result.timetable.events
    .map((event, index) => {
      const course = courseMap.get(event.course_id);
      const professor = event.professor_id ? profMap.get(event.professor_id) : null;
      const room = roomMap.get(event.room_id);
      const group = groupMap.get(event.group_id);

      // Skip events we can't fully resolve (missing entities)
      if (!course || !room || !group) return null;

      // Resolve the Arabic day
      const arabicDay = RUST_TO_ARABIC_DAY[event.time_slot.day] || 'الأحد';

      // Resolve the time slot ID from the period
      const period = event.time_slot.period;
      const slotId = period < slotsArr.length ? slotsArr[period].id : `ts${period + 1}`;

      // Use a placeholder professor if none assigned
      const resolvedProfessor: Professor = professor || {
        id: event.professor_id || 'unknown',
        name: 'غير محدد',
        department: course.department,
        specialization: '',
        max_hours: 0,
        unavailable: [],
        preferences: [],
      };

      return {
        id: event.id || `gen_${index}`,
        day: arabicDay as Day,
        slot_id: slotId,
        course,
        professor: resolvedProfessor,
        room,
        group,
      };
    })
    .filter((e): e is TimetableEntry => e !== null);

  return {
    entries,
    stats: {
      totalGenerations: result.stats.total_generations,
      bestFitness: result.stats.best_fitness,
      hardViolations: result.stats.hard_violations,
      softScore: result.stats.soft_score,
      elapsedMs: result.stats.elapsed_ms,
      populationSize: result.stats.population_size,
    },
    unscheduledEvents: result.unscheduled_events,
    warnings: result.warnings,
    timetableId: result.timetable.id,
  };
}

// ==========================================
// API Functions
// ==========================================

/**
 * Check if the timetable engine is reachable and healthy.
 */
export async function checkHealth(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${TIMETABLE_API_URL}/api/health`, {
      method: 'GET',
      signal: controller.signal,
    });

    clearTimeout(timeout);
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Generate a timetable using the Rust scheduling engine.
 */
export async function generateTimetable(
  input: RustSchedulingInput,
): Promise<RustApiResponse<RustSchedulingResult>> {
  const controller = new AbortController();
  // 2 minute timeout for generation
  const timeout = setTimeout(() => controller.abort(), 120_000);

  try {
    const requestBody: RustGenerateRequest = {
      input,
      config: null, // Use server defaults
    };

    const response = await fetch(`${TIMETABLE_API_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      // Try to parse error body
      let errorMessage = `Server error: ${response.status} ${response.statusText}`;
      try {
        const errorBody = await response.json();
        if (errorBody.error) {
          errorMessage = errorBody.error;
        }
      } catch {
        // ignore parse error
      }

      return {
        success: false,
        data: null,
        error: errorMessage,
      };
    }

    const result: RustApiResponse<RustSchedulingResult> = await response.json();
    return result;
  } catch (err: unknown) {
    clearTimeout(timeout);

    if (err instanceof DOMException && err.name === 'AbortError') {
      return {
        success: false,
        data: null,
        error: 'انتهت مهلة الاتصال — المحرك يستغرق وقتاً طويلاً. حاول تقليل البيانات المدخلة.',
      };
    }

    if (err instanceof TypeError && (err.message.includes('fetch') || err.message.includes('network'))) {
      return {
        success: false,
        data: null,
        error: 'خطأ في الشبكة — تأكد من اتصالك بالإنترنت وأن المحرك يعمل.',
      };
    }

    return {
      success: false,
      data: null,
      error: `خطأ غير متوقع: ${err instanceof Error ? err.message : 'unknown'}`,
    };
  }
}
