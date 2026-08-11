export type WeeklyGuidanceTone = "teal" | "coral" | "amber";

export interface WeeklyGuidanceSession {
  sessionId: number;
  lessonKey: string;
  lessonTitle: string;
  lessonOrder: number;
  status: string;
  passed: boolean | null;
  attemptNumber: number;
  isRetake: boolean;
  scoreCorrect: number | null;
  scoreTotal: number | null;
  scorePercent: number | null;
  startedAt: string;
  completedAt: string | null;
  skillFamily: string | null;
}

export interface WeeklyGuidanceNextStep {
  text: string;
  why: string;
  skillFamily: string | null;
  lessonKey: string | null;
  lessonTitle: string | null;
  source: "ai" | "fallback";
}

export interface WeeklyGuidance {
  weekStart: string;
  weekEnd: string;
  hasAnySessionThisWeek: boolean;
  emptyStateMessage: string | null;
  weekAlert: {
    tone: WeeklyGuidanceTone;
    text: string;
    kind: "reteach" | "on_track" | "no_lessons";
  };
  recommendedNextStep: WeeklyGuidanceNextStep;
  sessionsThisWeek: WeeklyGuidanceSession[];
}
