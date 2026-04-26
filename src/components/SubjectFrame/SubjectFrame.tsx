"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Subject, Semester } from "@/lib/types";
import styles from "./SubjectFrame.module.css";

interface SubjectFrameProps {
  subject: Subject;
  semester: Semester;
}

export default function SubjectFrame({ subject, semester }: SubjectFrameProps) {
  if (!subject.page) return null;

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.header}>
        <div className={styles.breadcrumb}>
          <Link href="/" className={styles.crumbLink}>Home</Link>
          <span className={styles.crumbSep}>/</span>
          <span className={styles.crumbSem}>{semester.label}</span>
          <span className={styles.crumbSep}>/</span>
          <span className={styles.crumbCurr} style={{ color: subject.color }}>
            {subject.label}
          </span>
        </div>
        
        <div className={styles.controls}>
          <a
            href={subject.page}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.openBtn}
          >
            Open in new tab
          </a>
        </div>
      </div>
      
      <div className={styles.frameWrapper}>
        <iframe
          src={subject.page}
          className={styles.iframe}
          title={subject.label}
        />
      </div>
    </motion.div>
  );
}
