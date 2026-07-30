"use client";

import type { ReactNode } from "react";
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
  sessionTimer?: {
    elapsedLabel: string;
    phaseLabel: string;
    phaseRemainingLabel: string;
    totalMinutes: number;
    teachUntilMinute: number;
  };
  /** Child camera card — shown on the far right next to teaching details. */
  rightSlot?: ReactNode;
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
  sessionTimer,
  rightSlot,
}: ClassLessonHeaderProps) {
  const activeIndex = phaseIndex(currentPhase);
  const showQuickCheckHint = currentPhase !== "quick_check";

  return (
    <div
      className="rounded-[12px] px-3 py-3 md:px-5 md:py-4"
      style={{ backgroundColor: "#313044" }}
    >
      {/* Mobile: title on top, then teaching + camera aligned in one row */}
      <div className="flex flex-col gap-3 sm:hidden">
        <div className="min-w-0">
          <p
            style={{
              ...inter,
              fontWeight: 500,
              fontSize: "10px",
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
              fontSize: "16px",
              color: "#FFFFFF",
              marginTop: "2px",
            }}
          >
            {lessonTitle}
          </p>
          {subtitle && (
            <p
              className="line-clamp-2"
              style={{
                ...inter,
                fontWeight: 400,
                fontSize: "11px",
                color: "rgba(255,255,255,0.45)",
                marginTop: "2px",
              }}
            >
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            {sessionTimer ? (
              <>
                <p style={{ ...inter, fontWeight: 600, fontSize: "11px", color: "#00CED1" }}>
                  {sessionTimer.phaseLabel} · {sessionTimer.phaseRemainingLabel} left
                </p>
                <p
                  style={{
                    ...inter,
                    fontWeight: 400,
                    fontSize: "10px",
                    color: "rgba(255,255,255,0.45)",
                  }}
                >
                  {sessionTimer.elapsedLabel} / {sessionTimer.totalMinutes}:00 · assess at{" "}
                  {sessionTimer.teachUntilMinute}:00
                </p>
              </>
            ) : (
              <p style={{ ...inter, fontWeight: 500, fontSize: "11px", color: "rgba(255,255,255,0.45)" }}>
                Getting class ready…
              </p>
            )}
            {showQuickCheckHint && (
              <p
                className="mt-0.5"
                style={{ ...inter, fontWeight: 500, fontSize: "11px", color: "rgba(255,255,255,0.6)" }}
              >
                {quickCheckLabel}
              </p>
            )}
            <div className="mt-1.5 flex items-center gap-1">
              {CLASS_PROGRESS_STEPS.map((step, index) => {
                const isComplete = index < activeIndex;
                const isCurrent = index === activeIndex;
                return (
                  <div key={step.id} className="flex items-center gap-1">
                    <div
                      className="h-2 w-2 rounded-full transition-colors"
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
                        className="h-1 w-5 rounded-full transition-colors"
                        style={{
                          backgroundColor: isComplete ? "#00CED1" : "#525162",
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          {rightSlot}
        </div>
      </div>

      {/* Desktop / tablet */}
      <div className="hidden sm:flex sm:items-center sm:justify-between sm:gap-4">
        <div className="min-w-0 flex-1">
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

        <div className="flex shrink-0 items-center gap-3">
          <div className="flex flex-col items-end justify-center gap-1.5 text-right">
            {sessionTimer ? (
              <>
                <p style={{ ...inter, fontWeight: 600, fontSize: "12px", color: "#00CED1" }}>
                  {sessionTimer.phaseLabel} · {sessionTimer.phaseRemainingLabel} left
                </p>
                <p
                  style={{
                    ...inter,
                    fontWeight: 400,
                    fontSize: "11px",
                    color: "rgba(255,255,255,0.45)",
                  }}
                >
                  {sessionTimer.elapsedLabel} / {sessionTimer.totalMinutes}:00 · assess at{" "}
                  {sessionTimer.teachUntilMinute}:00
                </p>
              </>
            ) : (
              <p style={{ ...inter, fontWeight: 500, fontSize: "12px", color: "rgba(255,255,255,0.45)" }}>
                Getting class ready…
              </p>
            )}

            {showQuickCheckHint && (
              <span
                style={{
                  ...inter,
                  fontWeight: 500,
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.6)",
                }}
              >
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
                      className="h-2.5 w-2.5 rounded-full transition-colors"
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
                        className="h-1 w-8 rounded-full transition-colors"
                        style={{
                          backgroundColor: isComplete ? "#00CED1" : "#525162",
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          {rightSlot}
        </div>
      </div>
    </div>
  );
}

export type { BlackboardStep };
