import type { WayfinderStudent } from "@/lib/wayfinder-api";

export function formatWayfinderStudentName(student: Pick<WayfinderStudent, "firstName" | "secondName" | "userName">) {
  const fullName = [student.firstName, student.secondName].filter(Boolean).join(" ").trim();
  return fullName || student.userName;
}

export function formatStudentGrade(grade: string | null | undefined): string {
  if (!grade?.trim()) return "—";
  if (/^grade\s/i.test(grade.trim())) return grade.trim();
  return `Grade ${grade.trim()}`;
}

export function formatAssignedDate(assignedAt: string | null | undefined): string {
  if (!assignedAt) return "—";
  return new Date(assignedAt).toLocaleDateString();
}
