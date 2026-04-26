"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Semester } from "@/lib/types";
import styles from "./Sidebar.module.css";

interface SidebarProps {
  semesters: Semester[];
}

export default function Sidebar({ semesters }: SidebarProps) {
  const pathname = usePathname();

  const isHome = pathname === "/";
  const isSchedule = pathname === "/schedule";

  return (
    <aside className={styles.sidebar}>
      {/* ── Identity ── */}
      <Link href="/" className={styles.identity}>
        <img src="/kitty.png" alt="Logo" className={styles.logo} />
        <div>
          <div className={styles.appName}>EVAL.CORE</div>
          <div className={styles.appTag}>Academic Dashboard</div>
        </div>
      </Link>

      {/* ── Primary Nav ── */}
      <nav className={styles.nav}>
        <Link
          href="/"
          className={`${styles.navItem} ${isHome ? styles.active : ""}`}
        >
          <span className={styles.navDot} style={{ background: "var(--accent)" }} />
          <span>Home</span>
        </Link>
        <Link
          href="/schedule"
          className={`${styles.navItem} ${isSchedule ? styles.active : ""}`}
        >
          <span className={styles.navDot} style={{ background: "var(--accent-2)" }} />
          <span>Master Schedule</span>
        </Link>
      </nav>

      <div className={styles.divider} />

      {/* ── Semesters + Subjects ── */}
      <div className={styles.subjectList}>
        {semesters.map((sem) => (
          <div key={sem.id} className={styles.semGroup}>
            <div className={styles.semLabel}>
              {sem.label}
              <span className={styles.semYear}>{sem.academicYear}</span>
            </div>
            {sem.subjects.map((subj) => {
              const href = `/subject/${subj.id}`;
              const isActive = pathname === href;
              return (
                <motion.div
                  key={subj.id}
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <Link
                    href={href}
                    className={`${styles.subjectItem} ${isActive ? styles.active : ""}`}
                  >
                    <span
                      className={styles.subjectDot}
                      style={{ background: subj.color }}
                    />
                    <div className={styles.subjectInfo}>
                      <span className={styles.subjectName}>{subj.label}</span>
                      <span className={styles.subjectCode}>{subj.code}</span>
                    </div>
                    {subj.page ? (
                      <span className={styles.pageBadge}>PAGE</span>
                    ) : (
                      <span className={styles.noPageBadge}>--</span>
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>

      <div className={styles.divider} />

      {/* ── Stub Actions ── */}
      <div className={styles.actions}>
        <button className={styles.actionBtn} disabled title="Coming soon">
          + Add Subject
        </button>
        <button className={styles.actionBtn} disabled title="Coming soon">
          + Add Semester
        </button>
      </div>

      {/* ── Footer ── */}
      <div className={styles.footer}>
        <div className={styles.footerLine}>
          <span className={styles.statusDot} />
          SYSTEM ACTIVE
        </div>
      </div>
    </aside>
  );
}
