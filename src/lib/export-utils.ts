/**
 * Export Utilities for HITU Web App
 * 
 * Provides PDF and Excel export functionality for:
 * - Timetable schedules
 * - Student rankings
 * - Student results / transcripts
 * 
 * NOTE: Arabic / RTL text in jsPDF may not render perfectly because jsPDF's
 * built-in fonts have limited Arabic glyph support.  For production use,
 * embed a full Arabic-capable font (e.g. Amiri, Cairo) via addFileToVFS.
 * The current implementation uses the default Helvetica font, so Arabic
 * characters will appear but may lack correct shaping/ligatures.
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import type { TimetableEntry } from '@/lib/timetable-types';

// ─── Color palette per department (RGB tuples) ───────────────────────────
const DEPT_COLORS: Record<string, [number, number, number]> = {
  'علوم الحاسب':       [59, 130, 246],   // blue-500
  'الذكاء الاصطناعي':  [168, 85, 247],   // purple-500
  'علوم البيانات':     [16, 185, 129],   // emerald-500
  'الأمن السيبراني':   [239, 68, 68],    // red-500
  'نظم المعلومات':     [245, 158, 11],   // amber-500
  'الميكاترونكس':      [6, 182, 212],    // cyan-500
  'الأوتوترونكس':      [236, 72, 153],   // pink-500
};

function deptColor(dept: string): [number, number, number] {
  return DEPT_COLORS[dept] ?? [100, 116, 139]; // slate-500 fallback
}

/** Date string for footers – e.g. "02/07/2026" */
function dateStamp(): string {
  const d = new Date();
  return d.toLocaleDateString('en-GB');
}

/**
 * Adds a branded HITU footer to the current page of a jsPDF document.
 */
function addFooter(doc: jsPDF) {
  const pageH = doc.internal.pageSize.getHeight();
  const pageW = doc.internal.pageSize.getWidth();
  doc.setFontSize(8);
  doc.setTextColor(120);
  doc.text(`HITU — Helwan International Technological University`, 14, pageH - 10);
  doc.text(dateStamp(), pageW - 14, pageH - 10, { align: 'right' });
}

// ═══════════════════════════════════════════════════════════════════════════
//  TIMETABLE  EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

interface TimetableFilters {
  department?: string;
  year?: string;
  professor?: string;
  room?: string;
}

/**
 * Export timetable data as a styled PDF document.
 */
export function exportTimetablePDF(
  entries: TimetableEntry[],
  filters?: TimetableFilters,
) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

  // Title
  doc.setFontSize(18);
  doc.setTextColor(30, 41, 59);
  // NOTE: Arabic text may not render with full shaping in default fonts
  doc.text('HITU — الجدول الدراسي', doc.internal.pageSize.getWidth() / 2, 16, { align: 'center' });

  // Subtitle with active filters
  doc.setFontSize(10);
  doc.setTextColor(100);
  const filterParts: string[] = [];
  if (filters?.department && filters.department !== 'الكل') filterParts.push(filters.department);
  if (filters?.year && filters.year !== 'الكل') filterParts.push(`Year ${filters.year}`);
  if (filters?.professor && filters.professor !== 'الكل') filterParts.push(filters.professor);
  if (filters?.room && filters.room !== 'الكل') filterParts.push(filters.room);
  const subtitle = filterParts.length > 0
    ? `Filters: ${filterParts.join(' | ')}`
    : 'All departments';
  doc.text(subtitle, doc.internal.pageSize.getWidth() / 2, 23, { align: 'center' });

  // Build table data
  const head = [['Day', 'Time', 'Course', 'Professor', 'Room', 'Dept / Group']];
  const body = entries.map(e => [
    e.day,
    `${e.course.name_ar}`,
    e.course.code,
    e.professor.name,
    e.room.name,
    `${e.course.department} — ${e.group.section}`,
  ]);

  autoTable(doc, {
    startY: 28,
    head,
    body,
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: {
      fillColor: [30, 41, 59],
      textColor: 255,
      fontStyle: 'bold',
    },
    didParseCell(data) {
      // Color-code body rows by department
      if (data.section === 'body') {
        const dept = entries[data.row.index]?.course?.department;
        if (dept) {
          const [r, g, b] = deptColor(dept);
          data.cell.styles.fillColor = [r, g, b, 0.08 * 255] as unknown as [number, number, number];
          // Lighter tint for the row background
          data.cell.styles.fillColor = [
            Math.round(255 - (255 - r) * 0.12),
            Math.round(255 - (255 - g) * 0.12),
            Math.round(255 - (255 - b) * 0.12),
          ];
        }
      }
    },
    didDrawPage() {
      addFooter(doc);
    },
  });

  doc.save('HITU_Timetable.pdf');
}

/**
 * Export timetable data as an Excel workbook with one sheet per department.
 */
export function exportTimetableExcel(entries: TimetableEntry[]) {
  const wb = XLSX.utils.book_new();

  // Group entries by department
  const deptMap = new Map<string, TimetableEntry[]>();
  entries.forEach(e => {
    const dept = e.course.department;
    if (!deptMap.has(dept)) deptMap.set(dept, []);
    deptMap.get(dept)!.push(e);
  });

  deptMap.forEach((deptEntries, dept) => {
    const rows = deptEntries.map(e => ({
      Day: e.day,
      Time: `${e.course.name_ar}`,
      Course: e.course.code + ' — ' + e.course.name_ar,
      Professor: e.professor.name,
      Room: e.room.name,
      Group: `Year ${e.group.year} — ${e.group.section}`,
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    // Truncate sheet name to 31 chars (Excel limit)
    const sheetName = dept.length > 31 ? dept.slice(0, 31) : dept;
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
  });

  const wbOut = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  saveAs(new Blob([wbOut], { type: 'application/octet-stream' }), 'HITU_Timetable.xlsx');
}

// ═══════════════════════════════════════════════════════════════════════════
//  RANKINGS  EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export interface RankingStudent {
  rank: number;
  name: string;
  totalScore: number;
  percentage: number;
  grade: string;
}

/**
 * Export student rankings as a styled PDF with gold/silver/bronze markers.
 */
export function exportRankingsPDF(
  students: RankingStudent[],
  department: string,
  year: string,
) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  // Title
  doc.setFontSize(18);
  doc.setTextColor(30, 41, 59);
  doc.text('HITU — أوائل الطلبة', doc.internal.pageSize.getWidth() / 2, 18, { align: 'center' });

  // Subtitle
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`${department}  |  ${year}`, doc.internal.pageSize.getWidth() / 2, 26, { align: 'center' });

  const head = [['Rank', 'Name', 'Score', 'Percentage', 'Grade']];
  const body = students.map(s => {
    let medal = '';
    if (s.rank === 1) medal = '🥇 ';
    else if (s.rank === 2) medal = '🥈 ';
    else if (s.rank === 3) medal = '🥉 ';
    return [
      `${medal}${s.rank}`,
      s.name,
      s.totalScore.toString(),
      `${s.percentage}%`,
      s.grade,
    ];
  });

  autoTable(doc, {
    startY: 32,
    head,
    body,
    styles: { fontSize: 10, cellPadding: 4 },
    headStyles: {
      fillColor: [30, 41, 59],
      textColor: 255,
      fontStyle: 'bold',
    },
    didParseCell(data) {
      if (data.section === 'body') {
        const rank = students[data.row.index]?.rank;
        // Gold, silver, bronze highlights for top 3
        if (rank === 1) {
          data.cell.styles.fillColor = [255, 243, 205]; // gold tint
          data.cell.styles.fontStyle = 'bold';
        } else if (rank === 2) {
          data.cell.styles.fillColor = [233, 236, 239]; // silver tint
          data.cell.styles.fontStyle = 'bold';
        } else if (rank === 3) {
          data.cell.styles.fillColor = [253, 230, 210]; // bronze tint
          data.cell.styles.fontStyle = 'bold';
        }
      }
    },
    didDrawPage() {
      addFooter(doc);
    },
  });

  doc.save(`HITU_Rankings_${department}.pdf`);
}

/**
 * Export rankings as an Excel workbook.
 * Receives a map of yearLabel -> students array so we can produce one sheet per year.
 */
export function exportRankingsExcel(
  yearData: Record<string, { department: string; students: RankingStudent[] }[]>,
) {
  const wb = XLSX.utils.book_new();

  Object.entries(yearData).forEach(([yearLabel, departments]) => {
    const rows: Record<string, string | number>[] = [];
    departments.forEach(({ department, students }) => {
      students.forEach(s => {
        rows.push({
          Rank: s.rank,
          Name: s.name,
          Department: department,
          Score: s.totalScore,
          Percentage: `${s.percentage}%`,
          Grade: s.grade,
        });
      });
    });

    const ws = XLSX.utils.json_to_sheet(rows);
    const sheetName = yearLabel.length > 31 ? yearLabel.slice(0, 31) : yearLabel;
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
  });

  const wbOut = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  saveAs(new Blob([wbOut], { type: 'application/octet-stream' }), 'HITU_Rankings.xlsx');
}

// ═══════════════════════════════════════════════════════════════════════════
//  RESULTS  EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export interface StudentInfo {
  id: string;
  name: string;
  department: string;
  level: string;
  status: string;
  enrollDate: string;
}

export interface CourseGradeExport {
  code: string;
  name: string;
  credits: number;
  score: number;
  points: number;
  grade: string;
}

export interface SemesterExport {
  label: string;
  gpa: number;
  courses: CourseGradeExport[];
}

/**
 * Export student results / transcript as a PDF document.
 */
export function exportResultsPDF(
  student: StudentInfo,
  semesters: SemesterExport[],
  cumulativeGPA: number,
) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  // Title
  doc.setFontSize(18);
  doc.setTextColor(30, 41, 59);
  doc.text('HITU — كشف النتائج', doc.internal.pageSize.getWidth() / 2, 18, { align: 'center' });

  // Student info block
  doc.setFontSize(10);
  doc.setTextColor(60);
  const infoY = 28;
  const leftCol = 14;
  const rightCol = doc.internal.pageSize.getWidth() / 2 + 10;

  doc.text(`Student ID: ${student.id}`, leftCol, infoY);
  doc.text(`Name: ${student.name}`, leftCol, infoY + 6);
  doc.text(`Department: ${student.department}`, rightCol, infoY);
  doc.text(`Level: ${student.level}`, rightCol, infoY + 6);
  doc.text(`Status: ${student.status}`, leftCol, infoY + 12);
  doc.text(`Cumulative GPA: ${cumulativeGPA.toFixed(2)} / 4.0`, rightCol, infoY + 12);

  // Separator line
  doc.setDrawColor(200);
  doc.line(14, infoY + 16, doc.internal.pageSize.getWidth() - 14, infoY + 16);

  let currentY = infoY + 22;

  // One table per semester
  semesters.forEach((sem) => {
    doc.setFontSize(12);
    doc.setTextColor(30, 41, 59);
    doc.text(sem.label, 14, currentY);
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(`Semester GPA: ${sem.gpa.toFixed(2)}`, doc.internal.pageSize.getWidth() - 14, currentY, { align: 'right' });

    const head = [['Code', 'Course', 'Credits', 'Score', 'Points', 'Grade']];
    const body = sem.courses.map(c => [
      c.code,
      c.name,
      c.credits.toString(),
      c.score.toString(),
      c.points.toFixed(1),
      c.grade,
    ]);

    autoTable(doc, {
      startY: currentY + 3,
      head,
      body,
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: {
        fillColor: [30, 41, 59],
        textColor: 255,
        fontStyle: 'bold',
      },
      didParseCell(data) {
        if (data.section === 'body' && data.column.index === 5) {
          const grade = sem.courses[data.row.index]?.grade ?? '';
          if (grade.startsWith('A')) {
            data.cell.styles.textColor = [16, 185, 129];
            data.cell.styles.fontStyle = 'bold';
          }
        }
      },
      didDrawPage() {
        addFooter(doc);
      },
    });

    // Update currentY after the table
    currentY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 12;
  });

  doc.save(`HITU_Results_${student.id}.pdf`);
}
