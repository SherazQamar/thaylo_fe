import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api";

export interface ChildAssignedClass {
  assignmentId: number;
  curriculumId: number;
  title: string;
  subject: string;
  gradeLevel: string;
  lessonCount: number;
  completedLessonCount: number;
  nextLessonKey: string | null;
  nextLessonTitle: string | null;
  estimatedMinutes: number | null;
}

export interface ChildClassSession {
  sessionId: number;
  assignmentId: number;
  curriculumId: number;
  curriculumTitle: string;
  subject: string;
  gradeLevel: string;
  lessonKey: string;
  lessonOrder: number;
  lessonTitle: string;
  lessonCount: number;
  estimatedMinutes: number | null;
  status: string;
  startedAt: string;
}

export async function fetchChildAssignedClasses() {
  const { data } = await api.get<ApiResponse<ChildAssignedClass[]>>("/child/classes", {
    authMode: "child",
  });
  return data.data;
}

export async function startChildClass(curriculumId?: number) {
  const { data } = await api.post<ApiResponse<ChildClassSession>>(
    "/child/classes/start",
    curriculumId !== undefined ? { curriculumId } : {},
    { authMode: "child" },
  );
  return data.data;
}

export async function fetchChildClassSession(sessionId: number) {
  const { data } = await api.get<ApiResponse<ChildClassSession>>(
    `/child/classes/sessions/${sessionId}`,
    { authMode: "child" },
  );
  return data.data;
}
