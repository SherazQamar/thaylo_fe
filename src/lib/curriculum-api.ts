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
  /** Skill family for the current / next lesson (4th ELA focus grouping). */
  focusArea?: string | null;
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
  runtimePlan?: {
    version: 1;
    totalMinutes: number;
    teachUntilMinute: number;
    segments: Array<{
      id: string;
      phase: "teach" | "practice" | "quick_check";
      title: string;
      narrationScript: string;
      lines?: string[];
      bulletPoints?: string[];
      interaction?: {
        id: string;
        prompt: string;
        type: "single_choice" | "word_pick" | "word_ladder";
        options: Array<{ id: string; label: string; correct?: boolean; hint?: string }>;
        correctOrder?: string[];
        correctFeedback?: string;
        incorrectFeedback?: string;
      };
    }>;
    generatedAt?: string;
    generationType?: "publish" | "retake";
  } | null;
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
  isRetake?: boolean;
  attemptNumber?: number;
  calyxIntro?: string | null;
  /** True while interest adapt is still running in the background. */
  interestPersonalizationPending?: boolean;
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

export async function askClassQuestion(
  sessionId: number,
  payload: {
    question: string;
    stepTitle?: string;
    stepPhase?: string;
    boardLines?: string[];
  },
) {
  const { data } = await api.post<
    ApiResponse<{ onTopic: boolean; reply: string }>
  >(`/child/classes/sessions/${sessionId}/ask`, payload, {
    authMode: "child",
  });
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
