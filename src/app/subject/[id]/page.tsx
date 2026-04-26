import { notFound } from "next/navigation";
import { SEMESTERS } from "@/lib/semesters";
import SubjectFrame from "@/components/SubjectFrame/SubjectFrame";
import SubjectPlaceholder from "@/components/SubjectPlaceholder/SubjectPlaceholder";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SubjectPage({ params }: PageProps) {
  const { id } = await params;
  
  let subject = null;
  let semester = null;
  
  for (const sem of SEMESTERS) {
    const found = sem.subjects.find((s) => s.id === id);
    if (found) {
      subject = found;
      semester = sem;
      break;
    }
  }

  if (!subject || !semester) {
    notFound();
  }

  return (
    <>
      {subject.page ? (
        <SubjectFrame subject={subject} semester={semester} />
      ) : (
        <SubjectPlaceholder subject={subject} />
      )}
    </>
  );
}

// Generate static paths for all known subjects
export async function generateStaticParams() {
  const paths = [];
  for (const sem of SEMESTERS) {
    for (const subj of sem.subjects) {
      paths.push({ id: subj.id });
    }
  }
  return paths;
}
