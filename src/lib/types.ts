export interface Subject {
  id: string;
  label: string;
  code: string;
  color: string;
  page: string | null;
}

export interface Semester {
  id: string;
  label: string;
  academicYear: string;
  subjects: Subject[];
}

export interface ScheduleEvent {
  id: string;
  date: string;       // "YYYY-MM-DD"
  type: string;
  course: string;
  subjectId: string | null;
  details: string;
  time: string;       // "HH:MM" or ""
}

// Legacy EvalEntry kept for compatibility
export interface EvalEntry {
  date: Date;
  dateStr: string;
  day: string;
  type: string;
  course: string;
  details: string;
  subjectId: string | null;
}
