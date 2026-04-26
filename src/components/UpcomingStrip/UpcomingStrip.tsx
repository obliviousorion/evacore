"use client";

import { motion } from "framer-motion";
import { format, isToday, isBefore, startOfDay } from "date-fns";
import { SEMESTERS } from "@/lib/semesters";
import { EvalEntry } from "@/lib/types";
import styles from "./UpcomingStrip.module.css";

interface UpcomingStripProps {
  evals: EvalEntry[];
}

export default function UpcomingStrip({ evals }: UpcomingStripProps) {
  // Build 14-day window from today
  const today = startOfDay(new Date());
  const days: { date: Date; evals: EvalEntry[] }[] = [];

  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    const dayEvals = evals.filter((e) => {
      const evalDate = startOfDay(new Date(e.date));
      return evalDate.getTime() === d.getTime();
    });
    days.push({ date: d, evals: dayEvals });
  }

  function getSubjectColor(subjectId: string | null): string {
    if (!subjectId) return "var(--text-muted)";
    for (const sem of SEMESTERS) {
      const found = sem.subjects.find((s) => s.id === subjectId);
      if (found) return found.color;
    }
    return "var(--text-muted)";
  }

  // Filter out purely past evals (keep today and future)
  const relevantDays = days.filter(
    (d) => !isBefore(d.date, today)
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Upcoming Evaluations</h2>
        <span className={styles.range}>
          Next 14 days
        </span>
      </div>
      <div className={styles.strip}>
        {relevantDays.map((d, i) => {
          const isT = isToday(d.date);
          const hasEvals = d.evals.length > 0;
          return (
            <motion.div
              key={i}
              className={`${styles.daySlot} ${isT ? styles.today : ""} ${hasEvals ? styles.hasEval : ""}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03, duration: 0.3 }}
            >
              <div className={styles.dayName}>{format(d.date, "EEE")}</div>
              <div className={styles.dayNum}>{format(d.date, "d")}</div>
              <div className={styles.dayMonth}>{format(d.date, "MMM")}</div>
              {isT && <div className={styles.todayBadge}>TODAY</div>}
              {d.evals.map((ev, j) => (
                <div
                  key={j}
                  className={styles.evalPill}
                  style={{
                    borderColor: getSubjectColor(ev.subjectId),
                    background: `${getSubjectColor(ev.subjectId)}15`,
                  }}
                >
                  <span
                    className={styles.evalDot}
                    style={{ background: getSubjectColor(ev.subjectId) }}
                  />
                  <div className={styles.evalInfo}>
                    <span className={styles.evalType}>{ev.type}</span>
                    <span className={styles.evalCourse}>{ev.course}</span>
                  </div>
                </div>
              ))}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
