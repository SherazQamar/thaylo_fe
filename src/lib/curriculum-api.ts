import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api";

export interface TutorBrainExplanation {
  summary: string;
  reasons: string[];
  whyKind: "first" | "advance" | "retake" | "personalized" | "in_lesson" | string;
  focusArea: string | null;
  lessonTitle: string | null;
  interestPersonalized: boolean;
  interestAreas: string[];
}

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
  tutorBrain?: TutorBrainExplanation | null;
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
  tutorBrain?: TutorBrainExplanation | null;
}

export interface ClassSessionAnswerRecord {
  stepId: string;
  interactionId: string;
  optionId: string;
  optionLabel: string;
  isCorrect: boolean;
  answeredAt: string;
  phase?: "teach" | "practice" | "quick_check";
  checkKind?: "formative" | "summative";
  rubricScore?: {
    dimensions: Array<{ id: string; label: string; score: number; max: number }>;
    total: number;
    maxTotal: number;
    percent: number;
  };
  decision?: "ADVANCE" | "SHORT_RETEACH" | "FULL_RETEACH";
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
  badgesAwarded?: Array<{ kind: string; name: string }>;
  masteredViaPretest?: boolean;
  decision?: "ADVANCE" | "SHORT_RETEACH" | "FULL_RETEACH";
  rubricScore?: ClassSessionAnswerRecord["rubricScore"];
  summativeUnlocked?: boolean;
  masterySource?: "summative" | "all";
}

export type SubmitClassAnswerPayload = {
  stepId: string;
  interactionId: string;
  optionId: string;
  optionLabel: string;
  isCorrect: boolean;
  phase?: "teach" | "practice" | "quick_check";
  checkKind?: "formative" | "summative";
};

export async function submitClassAnswer(
  sessionId: number,
  payload: SubmitClassAnswerPayload,
) {
  const { data } = await api.post<ApiResponse<ClassSessionScore>>(
    `/child/classes/sessions/${sessionId}/answers`,
    payload,
    { authMode: "child" },
  );
  return data.data;
}

export async function fetchChildAssignedClasses() {
  const { data } = await api.get<ApiResponse<ChildAssignedClass[]>>("/child/classes", {
    authMode: "child",
  });
  return data.data;
}

export type ChildModuleLessonStatus =
  | "mastered"
  | "current"
  | "available"
  | "locked";

export interface ChildModuleLesson {
  order: number;
  key: string;
  title: string;
  status: ChildModuleLessonStatus;
  estimatedMinutes: number;
}

export interface ChildModuleFamily {
  name: string;
  masteredCount: number;
  lessonCount: number;
  progressPercent: number;
  lessons: ChildModuleLesson[];
}

export interface ChildModulesOverview {
  curriculumId: number | null;
  title: string;
  subject: string;
  gradeLevel: string;
  publishedLessonCount: number;
  catalogLessonCount: number;
  completedLessonCount: number;
  overallProgressPercent: number;
  nextLessonKey: string | null;
  nextLessonTitle: string | null;
  focusArea: string | null;
  needsRetake: boolean;
  estimatedMinutes: number | null;
  families: ChildModuleFamily[];
}

export async function fetchChildModulesOverview() {
  const { data } = await api.get<ApiResponse<ChildModulesOverview>>(
    "/child/classes/modules",
    { authMode: "child" },
  );
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

export async function abandonClassSession(
  sessionId: number,
  reason: "CAMERA_ABSENCE" = "CAMERA_ABSENCE",
) {
  const { data } = await api.post<
    ApiResponse<{
      sessionId: number;
      status: string;
      reason: string;
      abandoned: boolean;
      lessonTitle?: string;
    }>
  >(
    `/child/classes/sessions/${sessionId}/abandon`,
    { reason },
    { authMode: "child" },
  );
  return data.data;
}
