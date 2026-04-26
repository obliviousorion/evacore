import fs from "fs";
import path from "path";
import { EvalEntry, ScheduleEvent } from "./types";
import { SEMESTERS } from "./semesters";

const SCHEDULE_PATH = path.join(process.cwd(), "data", "schedule.json");

export function getScheduleEvents(): ScheduleEvent[] {
  try {
    const raw = fs.readFileSync(SCHEDULE_PATH, "utf-8");
    const json = JSON.parse(raw);
    return (json.events ?? []) as ScheduleEvent[];
  } catch {
    return [];
  }
}

export function saveScheduleEvents(events: ScheduleEvent[]): void {
  fs.writeFileSync(SCHEDULE_PATH, JSON.stringify({ events }, null, 2), "utf-8");
}

export function parseEvals(): EvalEntry[] {
  const events = getScheduleEvents();

  // Build a lookup of subject label/code → subject id
  const subjectById = new Map<string, string>();
  for (const sem of SEMESTERS) {
    for (const s of sem.subjects) {
      subjectById.set(s.id.toLowerCase(), s.id);
    }
  }

  return events.map((ev) => {
    const dateObj = new Date(ev.date + "T00:00:00");
    return {
      date: dateObj,
      dateStr: dateObj.toLocaleDateString("en-GB", { day: "numeric", month: "long" }),
      day: dateObj.toLocaleDateString("en-US", { weekday: "short" }),
      type: ev.type,
      course: ev.course,
      details: ev.details,
      subjectId: ev.subjectId,
    };
  });
}

// Legacy — kept so old imports don't break
export function getRawMarkdown(): string {
  return "";
}
