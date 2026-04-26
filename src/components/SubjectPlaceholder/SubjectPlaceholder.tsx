"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Subject } from "@/lib/types";
import styles from "./SubjectPlaceholder.module.css";

interface SubjectPlaceholderProps {
  subject: Subject;
}

export default function SubjectPlaceholder({ subject }: SubjectPlaceholderProps) {
  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className={styles.card} style={{ borderColor: subject.color }}>
        <div 
          className={styles.glow} 
          style={{ background: subject.color }} 
        />
        
        <div className={styles.content}>
          <div className={styles.badge} style={{ background: `${subject.color}20`, color: subject.color }}>
            {subject.code}
          </div>
          
          <h2 className={styles.title}>{subject.label}</h2>
          
          <p className={styles.desc}>
            No study page has been created for this subject yet.
          </p>
          
          <Link href="/" className={styles.backBtn}>
            Return to Dashboard
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
