import type {
  BlackboardInteraction,
  BlackboardStep,
  CheckKind,
  ClassPhase,
} from "@/lib/class-lesson-content";

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
  checkKind?: CheckKind;
  /** Demo rubric dims this QC targets (Blueprint M3). */
  rubricDimensionIds?: string[];
};

export type LessonRuntimePlan = {
  version: 1;
  totalMinutes: number;
  teachUntilMinute: number;
  segments: LessonRuntimeSegment[];
  generatedAt?: string;
  generationType?: "publish" | "retake";
};

/**
 * Tag check kinds for T4:
 * - practice → formative
 * - quick_check: earlier ones formative; last 1 (or last 2 if ≥3 QCs) summative
 */
export function resolveCheckKindForIndex(
  steps: Array<{ phase: ClassPhase; checkKind?: CheckKind }>,
  index: number,
): CheckKind | undefined {
  const step = steps[index];
  if (!step) return undefined;
  if (step.checkKind) return step.checkKind;
  if (step.phase === "practice") return "formative";
  if (step.phase !== "quick_check") return undefined;

  const qcIndexes = steps
    .map((item, i) => ({ phase: item.phase, i }))
    .filter(({ phase }) => phase === "quick_check")
    .map(({ i }) => i);
  const summativeCount = qcIndexes.length >= 3 ? 2 : Math.min(1, qcIndexes.length);
  const summativeIndexSet = new Set(qcIndexes.slice(-summativeCount));
  return summativeIndexSet.has(index) ? "summative" : "formative";
}

export function tagSegmentCheckKinds(
  segments: LessonRuntimeSegment[],
): LessonRuntimeSegment[] {
  return segments.map((segment, index) => {
    if (segment.checkKind) return segment;
    const checkKind = resolveCheckKindForIndex(segments, index);
    return checkKind ? { ...segment, checkKind } : segment;
  });
}

export function tagBlackboardCheckKinds(steps: BlackboardStep[]): BlackboardStep[] {
  return steps.map((step, index) => {
    if (step.checkKind) return step;
    const checkKind = resolveCheckKindForIndex(steps, index);
    return checkKind ? { ...step, checkKind } : step;
  });
}

export function buildBlackboardStepsFromRuntimePlan(
  runtimePlan: LessonRuntimePlan,
): BlackboardStep[] {
  const tagged = tagSegmentCheckKinds(runtimePlan.segments);
  return tagged.map((segment) => ({
    id: segment.id,
    phase: segment.phase,
    title: segment.title,
    lines: segment.lines ?? [],
    bulletPoints: segment.bulletPoints,
    interaction: segment.interaction,
    narrationScript: segment.narrationScript,
    checkKind: segment.checkKind,
    rubricDimensionIds: segment.rubricDimensionIds,
  }));
}

export function isLessonRuntimePlan(value: unknown): value is LessonRuntimePlan {
  if (!value || typeof value !== "object") return false;
  const plan = value as LessonRuntimePlan;
  return plan.version === 1 && Array.isArray(plan.segments) && plan.segments.length > 0;
}
