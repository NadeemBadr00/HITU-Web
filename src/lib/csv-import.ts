'use client';

import {
  type Professor, type Room, type Course, type StudentGroup,
  DEPARTMENTS, type Department,
  ROOM_TYPES, type RoomType,
  YEAR_LEVELS, type YearLevel,
  SECTIONS, type Section,
} from '@/lib/timetable-types';

// ==========================================
// CSV Import Utilities
// ==========================================

const genId = () => Math.random().toString(36).slice(2, 10);

export type ImportType = 'professors' | 'rooms' | 'courses' | 'groups';

export interface ImportResult<T> {
  data: T[];
  errors: string[];
  warnings: string[];
}

// Expected CSV headers for each type
export const CSV_HEADERS: Record<ImportType, { required: string[]; optional: string[] }> = {
  professors: {
    required: ['name', 'department', 'specialization', 'max_hours'],
    optional: [],
  },
  rooms: {
    required: ['name', 'building', 'capacity', 'type'],
    optional: [],
  },
  courses: {
    required: ['code', 'name_ar', 'credits', 'lecture_hours', 'lab_hours', 'department'],
    optional: ['name_en', 'year_level', 'requires_lab'],
  },
  groups: {
    required: ['department', 'year', 'section', 'student_count'],
    optional: [],
  },
};

export const CSV_FORMAT_HELP: Record<ImportType, string> = {
  professors: 'name,department,specialization,max_hours\nØ¯. Ø£Ø­Ù…Ø¯ Ù…Ø­Ù…ÙˆØ¯,Ø¹Ù„ÙˆÙ… Ø§Ù„Ø­Ø§Ø³Ø¨,Ø®ÙˆØ§Ø±Ø²Ù…ÙŠØ§Øª,18',
  rooms: 'name,building,capacity,type\nH101,Ø§Ù„Ù…Ø¨Ù†Ù‰ Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠ,120,Ù‚Ø§Ø¹Ø© Ù…Ø­Ø§Ø¶Ø±Ø§Øª',
  courses: 'code,name_ar,credits,lecture_hours,lab_hours,department\nCS101,Ù…Ù‚Ø¯Ù…Ø© ÙÙŠ Ø§Ù„Ø¨Ø±Ù…Ø¬Ø©,3,2,2,Ø¹Ù„ÙˆÙ… Ø§Ù„Ø­Ø§Ø³Ø¨',
  groups: 'department,year,section,student_count\nØ¹Ù„ÙˆÙ… Ø§Ù„Ø­Ø§Ø³Ø¨,1,A,45',
};

// ==========================================
// Parse raw CSV text into rows
// ==========================================
function parseCSVText(text: string): string[][] {
  const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
  return lines.map(line => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
    result.push(current.trim());
    return result;
  });
}

// ==========================================
// Read file as text
// ==========================================
function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('ÙØ´Ù„ ÙÙŠ Ù‚Ø±Ø§Ø¡Ø© Ø§Ù„Ù…Ù„Ù'));
    reader.readAsText(file, 'UTF-8');
  });
}

// ==========================================
// Validate department value
// ==========================================
function validateDepartment(val: string): Department | null {
  const d = DEPARTMENTS.find(d => d === val);
  return d ?? null;
}

// ==========================================
// Parse Professors CSV
// ==========================================
function parseProfessorsCSV(headers: string[], rows: string[][]): ImportResult<Professor> {
  const data: Professor[] = [];
  const errors: string[] = [];
  const warnings: string[] = [];

  const nameIdx = headers.indexOf('name');
  const deptIdx = headers.indexOf('department');
  const specIdx = headers.indexOf('specialization');
  const hoursIdx = headers.indexOf('max_hours');

  rows.forEach((row, i) => {
    const rowNum = i + 2;
    const name = row[nameIdx]?.trim();
    const dept = row[deptIdx]?.trim();
    const spec = row[specIdx]?.trim() || '';
    const hours = parseInt(row[hoursIdx]?.trim());

    if (!name) { errors.push(`ØµÙ ${rowNum}: Ø§Ù„Ø§Ø³Ù… Ù…Ø·Ù„ÙˆØ¨`); return; }

    const validDept = validateDepartment(dept);
    if (!validDept) {
      errors.push(`ØµÙ ${rowNum}: Ø§Ù„Ù‚Ø³Ù… "${dept}" ØºÙŠØ± ØµØ§Ù„Ø­`);
      return;
    }

    data.push({
      id: genId(),
      name,
      department: validDept,
      specialization: spec,
      max_hours: isNaN(hours) ? 18 : hours,
      unavailable: [],
      preferences: [],
    });
  });

  return { data, errors, warnings };
}

// ==========================================
// Parse Rooms CSV
// ==========================================
function parseRoomsCSV(headers: string[], rows: string[][]): ImportResult<Room> {
  const data: Room[] = [];
  const errors: string[] = [];
  const warnings: string[] = [];

  const nameIdx = headers.indexOf('name');
  const buildIdx = headers.indexOf('building');
  const capIdx = headers.indexOf('capacity');
  const typeIdx = headers.indexOf('type');

  rows.forEach((row, i) => {
    const rowNum = i + 2;
    const name = row[nameIdx]?.trim();
    const building = row[buildIdx]?.trim() || '';
    const capacity = parseInt(row[capIdx]?.trim());
    const type = row[typeIdx]?.trim() as RoomType;

    if (!name) { errors.push(`ØµÙ ${rowNum}: Ø§Ø³Ù… Ø§Ù„Ù‚Ø§Ø¹Ø© Ù…Ø·Ù„ÙˆØ¨`); return; }

    const validType = ROOM_TYPES.includes(type) ? type : 'Ù‚Ø§Ø¹Ø© Ù…Ø­Ø§Ø¶Ø±Ø§Øª' as RoomType;
    if (!ROOM_TYPES.includes(type)) {
      warnings.push(`ØµÙ ${rowNum}: Ø§Ù„Ù†ÙˆØ¹ "${type}" ØºÙŠØ± Ù…Ø¹Ø±ÙˆÙØŒ ØªÙ… Ø§Ø³ØªØ®Ø¯Ø§Ù… "Ù‚Ø§Ø¹Ø© Ù…Ø­Ø§Ø¶Ø±Ø§Øª"`);
    }

    data.push({
      id: genId(),
      name,
      building,
      capacity: isNaN(capacity) ? 60 : capacity,
      type: validType,
      equipment: [],
    });
  });

  return { data, errors, warnings };
}

// ==========================================
// Parse Courses CSV
// ==========================================
function parseCoursesCSV(headers: string[], rows: string[][]): ImportResult<Course> {
  const data: Course[] = [];
  const errors: string[] = [];
  const warnings: string[] = [];

  const codeIdx = headers.indexOf('code');
  const nameArIdx = headers.indexOf('name_ar');
  const nameEnIdx = headers.indexOf('name_en');
  const creditsIdx = headers.indexOf('credits');
  const lectIdx = headers.indexOf('lecture_hours');
  const labIdx = headers.indexOf('lab_hours');
  const deptIdx = headers.indexOf('department');
  const yearIdx = headers.indexOf('year_level');
  const requiresLabIdx = headers.indexOf('requires_lab');

  rows.forEach((row, i) => {
    const rowNum = i + 2;
    const code = row[codeIdx]?.trim();
    const name_ar = row[nameArIdx]?.trim();
    const name_en = nameEnIdx >= 0 ? (row[nameEnIdx]?.trim() || '') : '';
    const credits = parseInt(row[creditsIdx]?.trim());
    const lecture_hours = parseInt(row[lectIdx]?.trim());
    const lab_hours = parseInt(row[labIdx]?.trim());
    const dept = row[deptIdx]?.trim();
    const yearVal = yearIdx >= 0 ? parseInt(row[yearIdx]?.trim()) : 1;
    const requiresLab = requiresLabIdx >= 0 ? ['true', '1', 'Ù†Ø¹Ù…', 'yes'].includes(row[requiresLabIdx]?.trim().toLowerCase()) : false;

    if (!code) { errors.push(`ØµÙ ${rowNum}: ÙƒÙˆØ¯ Ø§Ù„Ù…Ø§Ø¯Ø© Ù…Ø·Ù„ÙˆØ¨`); return; }
    if (!name_ar) { errors.push(`ØµÙ ${rowNum}: Ø§Ø³Ù… Ø§Ù„Ù…Ø§Ø¯Ø© Ù…Ø·Ù„ÙˆØ¨`); return; }

    const validDept = validateDepartment(dept);
    if (!validDept) {
      errors.push(`ØµÙ ${rowNum}: Ø§Ù„Ù‚Ø³Ù… "${dept}" ØºÙŠØ± ØµØ§Ù„Ø­`);
      return;
    }

    const validYear = (YEAR_LEVELS as readonly number[]).includes(yearVal) ? yearVal as YearLevel : 1 as YearLevel;

    data.push({
      id: genId(),
      code,
      name_ar,
      name_en,
      credits: isNaN(credits) ? 3 : credits,
      lecture_hours: isNaN(lecture_hours) ? 2 : lecture_hours,
      lab_hours: isNaN(lab_hours) ? 0 : lab_hours,
      sectionHours: 0,
      department: validDept,
      year_level: validYear,
      requires_lab: requiresLab || lab_hours > 0,
      difficulty: 'medium' as const,
      prerequisites: [],
    });
  });

  return { data, errors, warnings };
}

// ==========================================
// Parse Groups CSV
// ==========================================
function parseGroupsCSV(headers: string[], rows: string[][]): ImportResult<StudentGroup> {
  const data: StudentGroup[] = [];
  const errors: string[] = [];
  const warnings: string[] = [];

  const deptIdx = headers.indexOf('department');
  const yearIdx = headers.indexOf('year');
  const sectionIdx = headers.indexOf('section');
  const countIdx = headers.indexOf('student_count');

  rows.forEach((row, i) => {
    const rowNum = i + 2;
    const dept = row[deptIdx]?.trim();
    const year = parseInt(row[yearIdx]?.trim());
    const section = row[sectionIdx]?.trim().toUpperCase() as Section;
    const count = parseInt(row[countIdx]?.trim());

    const validDept = validateDepartment(dept);
    if (!validDept) {
      errors.push(`ØµÙ ${rowNum}: Ø§Ù„Ù‚Ø³Ù… "${dept}" ØºÙŠØ± ØµØ§Ù„Ø­`);
      return;
    }

    const validYear = (YEAR_LEVELS as readonly number[]).includes(year) ? year as YearLevel : 1 as YearLevel;
    const validSection = (SECTIONS as readonly string[]).includes(section) ? section : 'A' as Section;

    if (!(SECTIONS as readonly string[]).includes(section)) {
      warnings.push(`ØµÙ ${rowNum}: Ø§Ù„Ø´Ø¹Ø¨Ø© "${section}" ØºÙŠØ± Ù…Ø¹Ø±ÙˆÙØ©ØŒ ØªÙ… Ø§Ø³ØªØ®Ø¯Ø§Ù… "A"`);
    }

    data.push({
      id: genId(),
      department: validDept,
      year: validYear,
      section: validSection,
      student_count: isNaN(count) ? 40 : count,
      courseIds: [],
    });
  });

  return { data, errors, warnings };
}

// ==========================================
// Main parse function
// ==========================================
export async function parseCSV<T>(
  file: File,
  type: ImportType
): Promise<ImportResult<T>> {
  // Validate file extension
  const ext = file.name.split('.').pop()?.toLowerCase();
  if (ext !== 'csv') {
    return {
      data: [],
      errors: ['ÙŠØ±Ø¬Ù‰ Ø§Ø³ØªØ®Ø¯Ø§Ù… Ù…Ù„Ù Ø¨ØµÙŠØºØ© CSV (.csv)'],
      warnings: [],
    };
  }

  try {
    const text = await readFileAsText(file);
    const rows = parseCSVText(text);

    if (rows.length < 2) {
      return {
        data: [],
        errors: ['Ø§Ù„Ù…Ù„Ù ÙØ§Ø±Øº Ø£Ùˆ Ù„Ø§ ÙŠØ­ØªÙˆÙŠ Ø¹Ù„Ù‰ Ø¨ÙŠØ§Ù†Ø§Øª'],
        warnings: [],
      };
    }

    const headers = rows[0].map(h => h.toLowerCase().trim());
    const dataRows = rows.slice(1);

    // Check required headers
    const requiredHeaders = CSV_HEADERS[type].required;
    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
    if (missingHeaders.length > 0) {
      return {
        data: [],
        errors: [`Ø£Ø¹Ù…Ø¯Ø© Ù…Ø·Ù„ÙˆØ¨Ø© Ù…ÙÙ‚ÙˆØ¯Ø©: ${missingHeaders.join(', ')}`],
        warnings: [],
      };
    }

    switch (type) {
      case 'professors':
        return parseProfessorsCSV(headers, dataRows) as ImportResult<T>;
      case 'rooms':
        return parseRoomsCSV(headers, dataRows) as ImportResult<T>;
      case 'courses':
        return parseCoursesCSV(headers, dataRows) as ImportResult<T>;
      case 'groups':
        return parseGroupsCSV(headers, dataRows) as ImportResult<T>;
      default:
        return { data: [], errors: ['Ù†ÙˆØ¹ ØºÙŠØ± Ù…Ø¹Ø±ÙˆÙ'], warnings: [] };
    }
  } catch (err) {
    return {
      data: [],
      errors: [`Ø®Ø·Ø£ ÙÙŠ Ù‚Ø±Ø§Ø¡Ø© Ø§Ù„Ù…Ù„Ù: ${err instanceof Error ? err.message : 'Ø®Ø·Ø£ ØºÙŠØ± Ù…Ø¹Ø±ÙˆÙ'}`],
      warnings: [],
    };
  }
}

// ==========================================
// CSV Export Utility
// ==========================================
export function exportToCSV(type: ImportType, data: any[]) {
  if (data.length === 0) return;
  const headers = [...CSV_HEADERS[type].required, ...CSV_HEADERS[type].optional];
  
  // Format rows
  const rows = data.map(item => {
    return headers.map(header => {
      let val = item[header];
      if (val === undefined || val === null) val = '';
      if (typeof val === 'string' && (val.includes(',') || val.includes('"') || val.includes('\n'))) {
        val = "";
      }
      return val;
    }).join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\n');
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `hitu_${type}_export.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
