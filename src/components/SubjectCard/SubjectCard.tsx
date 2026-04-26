"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Subject, EvalEntry } from "@/lib/types";
import styles from "./SubjectCard.module.css";

interface SubjectCardProps {
  subject: Subject;
  nextEval: EvalEntry | null;
  index: number;
}

export default function SubjectCard({ subject, nextEval, index }: SubjectCardProps) {
  const daysAway = nextEval
    ? Math.max(
        0,
        Math.ceil(
          (new Date(nextEval.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        )
      )
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link href={`/subject/${subject.id}`} className={styles.card}>
        <div
          className={styles.accentBar}
          style={{ background: subject.color }}
        />
        <div className={styles.content}>
          <div className={styles.top}>
            <h3 className={styles.name}>{subject.label}</h3>
            <span className={styles.code}>{subject.code}</span>
          </div>

          <div className={styles.bottom}>
            {nextEval ? (
              <div className={styles.evalPreview}>
                <span
                  className={styles.evalDot}
                  style={{ background: subject.color }}
                />
                <span className={styles.evalText}>
                  {nextEval.type}
                  {daysAway !== null && (
                    <span className={styles.evalDays}>
                      {daysAway === 0
                        ? " -- today"
                        : daysAway === 1
                        ? " -- tomorrow"
                        : ` -- in ${daysAway} days`}
                    </span>
                  )}
                </span>
              </div>
            ) : (
              <span className={styles.noEval}>No upcoming evals</span>
            )}

            {subject.page ? (
              <span className={styles.pageTag}>Study Page</span>
            ) : (
              <span className={styles.noPageTag}>No Page</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
