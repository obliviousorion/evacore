"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameMonth, isToday, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from "date-fns";
import { ScheduleEvent } from "@/lib/types";
import { SEMESTERS } from "@/lib/semesters";
import styles from "./ScheduleView.module.css";

const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const EVENT_TYPES = ["Quiz", "Tutorial Test", "Design Test", "Lab Test", "Assignment", "Viva", "Comprehensive Exam", "Other"];

const SUBJECT_MAP = new Map<string, { label: string; color: string; code: string }>();
for (const sem of SEMESTERS) {
  for (const s of sem.subjects) {
    SUBJECT_MAP.set(s.id, { label: s.label, color: s.color, code: s.code });
  }
}

function genId() {
  return "e" + Date.now() + Math.random().toString(36).slice(2, 6);
}

interface EventModalProps {
  date: Date | null;
  event: ScheduleEvent | null;
  onSave: (ev: ScheduleEvent) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

function EventModal({ date, event, onSave, onDelete, onClose }: EventModalProps) {
  const isEdit = !!event;
  const [type, setType] = useState(event?.type ?? "Quiz");
  const [course, setCourse] = useState(event?.course ?? "");
  const [subjectId, setSubjectId] = useState<string>(event?.subjectId ?? "");
  const [details, setDetails] = useState(event?.details ?? "");
  const [time, setTime] = useState(event?.time ?? "");
  const [customType, setCustomType] = useState("");

  const subjects = SEMESTERS.flatMap((s) => s.subjects);

  function handleSubjectChange(id: string) {
    setSubjectId(id);
    const s = SUBJECT_MAP.get(id);
    if (s) setCourse(s.label.split(" ").map(w => w[0]).join("").slice(0, 4));
  }

  function handleSave() {
    const finalType = type === "Other" ? customType : type;
    if (!finalType.trim() || !date) return;
    onSave({
      id: event?.id ?? genId(),
      date: format(date, "yyyy-MM-dd"),
      type: finalType.trim(),
      course: course.trim(),
      subjectId: subjectId || null,
      details: details.trim(),
      time: time,
    });
  }

  const overlayRef = useRef<HTMLDivElement>(null);

  return (
    <div className={styles.modalOverlay} ref={overlayRef} onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <div className={styles.modalTitle}>
            {isEdit ? "Edit Event" : "Add Event"}
            <span className={styles.modalDate}>
              {date ? format(date, "EEE, d MMM yyyy") : ""}
            </span>
          </div>
          <button className={styles.modalClose} onClick={onClose}>✕</button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Event Type</label>
            <div className={styles.typeGrid}>
              {EVENT_TYPES.map((t) => (
                <button
                  key={t}
                  className={`${styles.typeChip} ${type === t ? styles.typeChipActive : ""}`}
                  onClick={() => setType(t)}
                >
                  {t}
                </button>
              ))}
            </div>
            {type === "Other" && (
              <input
                className={styles.input}
                placeholder="Custom type..."
                value={customType}
                onChange={(e) => setCustomType(e.target.value)}
              />
            )}
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Subject</label>
              <select
                className={styles.select}
                value={subjectId}
                onChange={(e) => handleSubjectChange(e.target.value)}
              >
                <option value="">— None —</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Course Label</label>
              <input
                className={styles.input}
                placeholder="e.g. MuP, SaS"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Time (optional)</label>
              <input
                type="time"
                className={styles.input}
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Details / Notes</label>
            <textarea
              className={styles.textarea}
              placeholder="Topic, venue, duration..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <div className={styles.modalFooter}>
          {isEdit && (
            <button className={styles.deleteBtn} onClick={() => onDelete(event!.id)}>
              Delete
            </button>
          )}
          <div className={styles.footerRight}>
            <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
            <button className={styles.saveBtn} onClick={handleSave}>
              {isEdit ? "Update" : "Add Event"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ScheduleViewProps {
  initialEvents: ScheduleEvent[];
}

export default function ScheduleView({ initialEvents }: ScheduleViewProps) {
  const [events, setEvents] = useState<ScheduleEvent[]>(initialEvents);
  const [viewDate, setViewDate] = useState(() => {
    const now = new Date();
    // Default to the current month unless all upcoming events are in a future month
    const currentMonthStr = format(now, "yyyy-MM");
    const hasEventsThisMonth = initialEvents.some(e => e.date.startsWith(currentMonthStr) && new Date(e.date) >= now);
    
    if (!hasEventsThisMonth) {
      // Find the first future event
      const futureEvents = initialEvents
        .filter(e => new Date(e.date) >= now)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
      if (futureEvents.length > 0) {
        const firstFuture = new Date(futureEvents[0].date);
        return new Date(firstFuture.getFullYear(), firstFuture.getMonth(), 1);
      }
    }
    
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "error">("saved");
  const [modal, setModal] = useState<{ date: Date; event: ScheduleEvent | null } | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const saveTimer = useRef<NodeJS.Timeout | null>(null);

  // Persist to API
  const persist = useCallback((evs: ScheduleEvent[]) => {
    setSaveStatus("saving");
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try {
        const res = await fetch("/api/schedule", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ events: evs }),
        });
        setSaveStatus(res.ok ? "saved" : "error");
      } catch {
        setSaveStatus("error");
      }
    }, 600);
  }, []);

  function handleSaveEvent(ev: ScheduleEvent) {
    setEvents((prev) => {
      const idx = prev.findIndex((e) => e.id === ev.id);
      const next = idx >= 0 ? prev.map((e) => (e.id === ev.id ? ev : e)) : [...prev, ev];
      persist(next);
      return next;
    });
    setModal(null);
  }

  function handleDeleteEvent(id: string) {
    setEvents((prev) => {
      const next = prev.filter((e) => e.id !== id);
      persist(next);
      return next;
    });
    setModal(null);
  }

  // Build calendar grid
  const monthStart = startOfMonth(viewDate);
  const monthEnd = endOfMonth(viewDate);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const calDays = eachDayOfInterval({ start: gridStart, end: gridEnd });

  function getEventsForDay(day: Date): ScheduleEvent[] {
    const dayStr = format(day, "yyyy-MM-dd");
    return events.filter((ev) => {
      if (ev.date !== dayStr) return false;
      if (filter !== "all") {
        if (filter === "comp") return ev.type === "Comprehensive Exam";
        return ev.subjectId === filter;
      }
      return true;
    });
  }

  function getSubjectColor(subjectId: string | null): string {
    if (!subjectId) return "var(--text-muted)";
    return SUBJECT_MAP.get(subjectId)?.color ?? "var(--text-muted)";
  }

  function getTypeStyle(type: string): string {
    if (type === "Comprehensive Exam") return styles.typeComp;
    if (type === "Quiz") return styles.typeQuiz;
    if (type === "Lab Test") return styles.typeLab;
    if (type === "Assignment") return styles.typeAssign;
    return styles.typeDefault;
  }

  const subjects = SEMESTERS.flatMap((s) => s.subjects);

  // Comprehensive exam count badge
  const compCount = events.filter(e => e.type === "Comprehensive Exam" && new Date(e.date) >= new Date()).length;

  return (
    <div className={styles.container}>
      {/* ── Header ── */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Master Schedule</h1>
          {compCount > 0 && (
            <span className={styles.compBadge}>{compCount} Comprehensives</span>
          )}
        </div>
        <div className={styles.headerRight}>
          <span className={`${styles.statusDot} ${styles[saveStatus]}`} />
          <span className={styles.statusText}>
            {saveStatus === "saved" ? "SYNCED" : saveStatus === "saving" ? "SAVING..." : "ERROR"}
          </span>
        </div>
      </div>

      {/* ── Filter Bar ── */}
      <div className={styles.filterBar}>
        <button
          className={`${styles.filterChip} ${filter === "all" ? styles.filterActive : ""}`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={`${styles.filterChip} ${filter === "comp" ? styles.filterActive : ""}`}
          style={filter === "comp" ? { borderColor: "#f97c6b", color: "#f97c6b", background: "rgba(249,124,107,0.1)" } : {}}
          onClick={() => setFilter("comp")}
        >
          🎓 Comprehensives
        </button>
        {subjects.map((s) => (
          <button
            key={s.id}
            className={`${styles.filterChip} ${filter === s.id ? styles.filterActive : ""}`}
            style={filter === s.id ? { borderColor: s.color, color: s.color, background: s.color + "18" } : {}}
            onClick={() => setFilter(s.id)}
          >
            {s.code}
          </button>
        ))}
      </div>

      {/* ── Month Nav ── */}
      <div className={styles.calHeader}>
        <button className={styles.navBtn} onClick={() => setViewDate(subMonths(viewDate, 1))}>
          ‹
        </button>
        <span className={styles.monthLabel}>
          {format(viewDate, "MMMM yyyy")}
        </span>
        <button className={styles.navBtn} onClick={() => setViewDate(addMonths(viewDate, 1))}>
          ›
        </button>
      </div>

      {/* ── Day Headers ── */}
      <div className={styles.dayHeaders}>
        {DAYS.map((d) => (
          <div key={d} className={styles.dayHeader}>{d}</div>
        ))}
      </div>

      {/* ── Calendar Grid ── */}
      <div className={styles.calGrid}>
        {calDays.map((day, i) => {
          const dayEvents = getEventsForDay(day);
          const inMonth = isSameMonth(day, viewDate);
          const today = isToday(day);
          const isWeekend = getDay(day) === 0 || getDay(day) === 6;

          return (
            <div
              key={i}
              className={`${styles.cell} ${!inMonth ? styles.cellOut : ""} ${today ? styles.cellToday : ""} ${isWeekend ? styles.cellWeekend : ""}`}
              onClick={() => inMonth && setModal({ date: day, event: null })}
            >
              <div className={styles.cellDate}>
                <span className={today ? styles.todayNum : ""}>{format(day, "d")}</span>
              </div>
              <div className={styles.cellEvents}>
                {dayEvents.map((ev) => {
                  const color = getSubjectColor(ev.subjectId);
                  const isComp = ev.type === "Comprehensive Exam";
                  return (
                    <div
                      key={ev.id}
                      className={`${styles.eventPill} ${isComp ? styles.eventPillComp : ""}`}
                      style={{ background: color + (isComp ? "30" : "20"), borderColor: color + (isComp ? "cc" : "60") }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setModal({ date: day, event: ev });
                      }}
                      title={`${ev.type} — ${ev.course}${ev.time ? " @ " + ev.time : ""}${ev.details ? "\n" + ev.details : ""}`}
                    >
                      <span className={styles.pillDot} style={{ background: color }} />
                      <span className={styles.pillLabel}>
                        {isComp ? "📋 " : ""}{ev.course || ev.type}
                      </span>
                      {ev.time && <span className={styles.pillTime}>{ev.time}</span>}
                    </div>
                  );
                })}
                {inMonth && dayEvents.length === 0 && (
                  <div className={styles.addHint}>+</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Legend ── */}
      <div className={styles.legend}>
        {subjects.map((s) => (
          <div key={s.id} className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: s.color }} />
            <span className={styles.legendLabel}>{s.code}</span>
          </div>
        ))}
        <div className={styles.legendItem}>
          <span className={styles.legendDot} style={{ background: "#f97c6b" }} />
          <span className={styles.legendLabel}>Comprehensive</span>
        </div>
      </div>

      {/* ── Modal ── */}
      {modal && (
        <EventModal
          date={modal.date}
          event={modal.event}
          onSave={handleSaveEvent}
          onDelete={handleDeleteEvent}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
