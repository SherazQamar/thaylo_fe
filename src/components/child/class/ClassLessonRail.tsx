"use client";

import type { ClassPhase } from "@/lib/class-lesson-content";

const inter = { fontFamily: "Inter, sans-serif" } as const;

export type LessonRailStage =
  | "teach"
  | "practice"
  | "quick_check"
  | "reteach"
  | "mastery";

export type LessonConfidence = "Low" | "Medium" | "High";

const RAIL_STAGES: Array<{ id: LessonRailStage; label: string }> = [
  { id: "teach", label: "Teach" },
  { id: "practice", label: "Practice" },
  { id: "quick_check", label: "Quick Check" },
  { id: "reteach", label: "Reteach" },
  { id: "mastery", label: "Mastery" },
];

type ClassLessonRailProps = {
  currentPhase: ClassPhase;
  answerFlowMode?: "idle" | "reteaching" | "recheck";
  confidence: LessonConfidence;
  lessonComplete?: boolean;
  whyThisLesson?: string;
  /** Tutor Brain reason bullets (explainability). */
  tutorReasons?: string[];
  interestPersonalized?: boolean;
};

function activeRailStage(
  phase: ClassPhase,
  answerFlowMode: "idle" | "reteaching" | "recheck",
  lessonComplete: boolean,
): LessonRailStage {
  if (lessonComplete) return "mastery";
  if (answerFlowMode === "reteaching" || answerFlowMode === "recheck") {
    return "reteach";
  }
  if (phase === "quick_check") return "quick_check";
  if (phase === "practice") return "practice";
  return "teach";
}

function stageIndex(id: LessonRailStage) {
  return RAIL_STAGES.findIndex((s) => s.id === id);
}

export default function ClassLessonRail({
  currentPhase,
  answerFlowMode = "idle",
  confidence,
  lessonComplete = false,
  whyThisLesson,
  tutorReasons,
  interestPersonalized = false,
}: ClassLessonRailProps) {
  const active = activeRailStage(currentPhase, answerFlowMode, lessonComplete);
  const activeIdx = stageIndex(active);
  const confidenceColor =
    confidence === "High" ? "#60D624" : confidence === "Low" ? "#FF7B7B" : "#F59E0B";
  const reasons = (tutorReasons ?? []).filter(Boolean).slice(0, 3);

  return (
    <aside
      className="hidden lg:flex w-[148px] shrink-0 flex-col gap-3 rounded-[14px] border border-white/10 px-3 py-3"
      style={{ backgroundColor: "#313044" }}
      aria-label="Lesson progress rail"
    >
      <div>
        <p
          style={{
            ...inter,
            fontWeight: 600,
            fontSize: "10px",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.45)",
          }}
        >
          Lesson track
        </p>
        <ul className="mt-3 space-y-2.5">
          {RAIL_STAGES.map((stage, index) => {
            const done = index < activeIdx;
            const current = index === activeIdx;
            return (
              <li key={stage.id} className="flex items-center gap-2">
                <span
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                  style={{
                    backgroundColor: done
                      ? "rgba(0,206,209,0.25)"
                      : current
                        ? "#00CED1"
                        : "rgba(255,255,255,0.08)",
                    color: done || current ? (current ? "#111023" : "#00CED1") : "rgba(255,255,255,0.35)",
                  }}
                >
                  {done ? "✓" : index + 1}
                </span>
                <span
                  style={{
                    ...inter,
                    fontWeight: current ? 700 : 500,
                    fontSize: "12px",
                    color: current
                      ? "#FFFFFF"
                      : done
                        ? "rgba(255,255,255,0.7)"
                        : "rgba(255,255,255,0.35)",
                  }}
                >
                  {stage.label}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.03] px-2.5 py-2">
        <p
          style={{
            ...inter,
            fontSize: "10px",
            fontWeight: 600,
            color: "rgba(255,255,255,0.45)",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          Confidence
        </p>
        <p
          className="mt-1"
          style={{ ...inter, fontWeight: 700, fontSize: "14px", color: confidenceColor }}
        >
          {confidence}
        </p>
      </div>

      {whyThisLesson ? (
        <div className="rounded-xl border border-[#00CED1]/25 bg-[#00CED1]/5 px-2.5 py-2">
          <p
            style={{
              ...inter,
              fontSize: "10px",
              fontWeight: 600,
              color: "#00CED1",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Tutor Brain
            {interestPersonalized ? " · personalized" : ""}
          </p>
          <p
            className="mt-1 line-clamp-4"
            style={{
              ...inter,
              fontSize: "11px",
              lineHeight: 1.35,
              color: "rgba(255,255,255,0.75)",
            }}
          >
            {whyThisLesson}
          </p>
          {reasons.length > 0 ? (
            <ul className="mt-2 space-y-1">
              {reasons.map((reason) => (
                <li
                  key={reason}
                  className="line-clamp-2"
                  style={{
                    ...inter,
                    fontSize: "10px",
                    lineHeight: 1.3,
                    color: "rgba(255,255,255,0.55)",
                  }}
                >
                  • {reason}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </aside>
  );
}
