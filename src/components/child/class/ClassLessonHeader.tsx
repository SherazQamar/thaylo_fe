"use client";

import {
  CLASS_PROGRESS_STEPS,
  type BlackboardStep,
  type ClassPhase,
} from "@/lib/class-lesson-content";

const inter = { fontFamily: "Inter, sans-serif" } as const;

type ClassLessonHeaderProps = {
  moduleLabel: string;
  lessonTitle: string;
  subtitle?: string;
  currentPhase: ClassPhase;
  quickCheckLabel?: string;
};

function phaseIndex(phase: ClassPhase) {
  return CLASS_PROGRESS_STEPS.findIndex((step) => step.id === phase);
}

export default function ClassLessonHeader({
  moduleLabel,
  lessonTitle,
  subtitle,
  currentPhase,
  quickCheckLabel = "Quick Check coming up",
}: ClassLessonHeaderProps) {
  const activeIndex = phaseIndex(currentPhase);
  const showQuickCheckHint = currentPhase !== "quick_check";

  return (
    <div
      className="rounded-[12px] px-4 py-3 md:px-5 md:py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
      style={{ backgroundColor: "#313044" }}
    >
      <div className="min-w-0">
        <p
          style={{
            ...inter,
            fontWeight: 500,
            fontSize: "11px",
            color: "rgba(255,255,255,0.5)",
            letterSpacing: "1px",
            textTransform: "uppercase",
          }}
        >
          {moduleLabel}
        </p>
        <p
          style={{
            ...inter,
            fontWeight: 700,
            fontSize: "18px",
            color: "#FFFFFF",
            marginTop: "2px",
          }}
        >
          {lessonTitle}
        </p>
        {subtitle && (
          <p
            style={{
              ...inter,
              fontWeight: 400,
              fontSize: "12px",
              color: "rgba(255,255,255,0.45)",
              marginTop: "4px",
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
        {showQuickCheckHint && (
          <span style={{ ...inter, fontWeight: 500, fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>
            {quickCheckLabel}
          </span>
        )}
        <div className="flex items-center gap-1">
          {CLASS_PROGRESS_STEPS.map((step, index) => {
            const isComplete = index < activeIndex;
            const isCurrent = index === activeIndex;
            return (
              <div key={step.id} className="flex items-center gap-1">
                <div
                  className="w-2.5 h-2.5 rounded-full transition-colors"
                  style={{
                    backgroundColor: isComplete
                      ? "#00CED1"
                      : isCurrent
                        ? "#F59E0B"
                        : "#525162",
                  }}
                  title={step.label}
                />
                {index < CLASS_PROGRESS_STEPS.length - 1 && (
                  <div
                    className="w-8 h-1 rounded-full transition-colors"
                    style={{ backgroundColor: isComplete ? "#00CED1" : "#525162" }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export type { BlackboardStep };
