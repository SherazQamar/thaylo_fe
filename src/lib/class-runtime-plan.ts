import type {
  BlackboardInteraction,
  BlackboardStep,
  ClassPhase,
} from "@/lib/class-lesson-content";
import type { ChildClassLessonScript } from "@/lib/curriculum-api";

export type LessonRuntimeSegment = {
  id: string;
  phase: ClassPhase;
  title: string;
  startMinute?: number;
  endMinute?: number;
  narrationScript: string;
  lines?: string[];
  bulletPoints?: string[];
  interaction?: BlackboardInteraction;
};

export type LessonRuntimePlan = {
  version: 1;
  totalMinutes: number;
  teachUntilMinute: number;
  segments: LessonRuntimeSegment[];
  generatedAt?: string;
  generationType?: "publish" | "retake";
};

export function buildBlackboardStepsFromRuntimePlan(
  runtimePlan: LessonRuntimePlan,
): BlackboardStep[] {
  return runtimePlan.segments.map((segment) => ({
    id: segment.id,
    phase: segment.phase,
    title: segment.title,
    lines: segment.lines ?? [],
    bulletPoints: segment.bulletPoints,
    interaction: segment.interaction,
    narrationScript: segment.narrationScript,
  }));
}

export function isLessonRuntimePlan(value: unknown): value is LessonRuntimePlan {
  if (!value || typeof value !== "object") return false;
  const plan = value as LessonRuntimePlan;
  return plan.version === 1 && Array.isArray(plan.segments) && plan.segments.length > 0;
}
