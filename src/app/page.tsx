import { SEMESTERS } from "@/lib/semesters";
import { parseEvals } from "@/lib/parseEvals";
import UpcomingStrip from "@/components/UpcomingStrip/UpcomingStrip";
import SubjectCard from "@/components/SubjectCard/SubjectCard";
import { startOfDay, isBefore } from "date-fns";
import styles from "./page.module.css";

export default function Home() {
  const evals = parseEvals();
  const today = startOfDay(new Date());

  // Extract all subjects from all semesters
  const allSubjects = SEMESTERS.flatMap((sem) => sem.subjects);

  // Find the next upcoming eval for each subject
  const nextEvalsBySubject = new Map();
  
  for (const ev of evals) {
    if (!ev.subjectId) continue;
    const evalDate = startOfDay(new Date(ev.date));
    
    // Skip past evals
    if (isBefore(evalDate, today)) continue;

    const currentNext = nextEvalsBySubject.get(ev.subjectId);
    if (!currentNext || isBefore(evalDate, new Date(currentNext.date))) {
      nextEvalsBySubject.set(ev.subjectId, ev);
    }
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
      </header>
      
      <UpcomingStrip evals={evals} />

      <section className={styles.subjectsSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>My Subjects</h2>
        </div>
        
        <div className={styles.grid}>
          {allSubjects.map((subject, idx) => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              index={idx}
              nextEval={nextEvalsBySubject.get(subject.id) || null}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
