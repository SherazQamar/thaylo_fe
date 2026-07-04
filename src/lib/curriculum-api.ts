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
  needsRetake?: boolean;
}

export interface ChildClassLessonScript {
  studentLanguage?: string;
  instructionalCore?: {
    concept?: string;
    terms?: string[];
    howTo?: string[];
    practiceExamples?: string[];
    masteryMarker?: string;
  };
  assessments?: Array<{
    key: string;
    prompt: string;
    type: string;
    options?: string[];
  }>;
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
  scoreCorrect?: number | null;
  scoreTotal?: number | null;
  lessonScript?: ChildClassLessonScript | null;
}

export interface ClassSessionAnswerRecord {
  stepId: string;
  interactionId: string;
  optionId: string;
  optionLabel: string;
  isCorrect: boolean;
  answeredAt: string;
}

export interface ClassSessionScore {
  sessionId: number;
  scoreCorrect: number;
  scoreTotal: number;
  scorePercent: number;
  passed: boolean;
  passThreshold: number;
  needsRetake: boolean;
  answers: ClassSessionAnswerRecord[];
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

export async function submitClassAnswer(
  sessionId: number,
  payload: Omit<ClassSessionAnswerRecord, "answeredAt">,
) {
  const { data } = await api.post<ApiResponse<ClassSessionScore>>(
    `/child/classes/sessions/${sessionId}/answers`,
    payload,
    { authMode: "child" },
  );
  return data.data;
}

export async function completeClassSession(sessionId: number) {
  const { data } = await api.post<ApiResponse<ClassSessionScore>>(
    `/child/classes/sessions/${sessionId}/complete`,
    {},
    { authMode: "child" },
  );
  return data.data;
}
