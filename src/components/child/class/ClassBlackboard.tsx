"use client";

import type { BlackboardInteraction, BlackboardStep } from "@/lib/class-lesson-content";
import type { BlackboardReveal } from "@/hooks/use-blackboard-narration";

const inter = { fontFamily: "Inter, sans-serif" } as const;

type ClassBlackboardProps = {
  step: BlackboardStep;
  reveal: BlackboardReveal;
  isNarrating?: boolean;
  interaction?: BlackboardInteraction;
  selectedOptionId?: string | null;
  answeredCorrectly?: boolean | null;
  onSelectOption?: (optionId: string) => void;
};

export default function ClassBlackboard({
  step,
  reveal,
  isNarrating = false,
  interaction,
  selectedOptionId,
  answeredCorrectly,
  onSelectOption,
}: ClassBlackboardProps) {
  const visibleLines = step.lines.slice(0, reveal.visibleLines);
  const visibleBullets = (step.bulletPoints ?? []).slice(0, reveal.visibleBullets);
  const showInteraction = reveal.interactionVisible && interaction;

  return (
    <div className="relative w-full h-full min-h-[280px] rounded-[16px] overflow-hidden border border-[#2d4a3e]">
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, #1a3d32 0%, #0f2922 45%, #0a1f1a 100%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.08) 0%, transparent 40%), radial-gradient(circle at 80% 60%, rgba(255,255,255,0.05) 0%, transparent 35%)",
        }}
      />

      <div className="relative z-10 h-full flex flex-col p-5 md:p-8 overflow-y-auto scrollbar-hide">
        <div className="flex items-center gap-3 mb-5">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
            style={{ backgroundColor: "rgba(0,206,209,0.2)", border: "2px solid rgba(0,206,209,0.4)" }}
          >
            <span style={{ ...inter, fontWeight: 800, fontSize: "14px", color: "#00CED1" }}>C</span>
          </div>
          <div>
            <p style={{ ...inter, fontWeight: 600, fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>
              Calyx — Blackboard
              {isNarrating && <span className="ml-2 text-[#00CED1]">speaking…</span>}
            </p>
            <p style={{ ...inter, fontWeight: 700, fontSize: "20px", color: "#E8F5E9" }}>
              {step.title}
            </p>
          </div>
        </div>

        <div className="space-y-3 flex-1">
          {visibleLines.length === 0 && visibleBullets.length === 0 && !showInteraction && (
            <p style={{ ...inter, fontSize: "14px", color: "rgba(255,255,255,0.35)", fontStyle: "italic" }}>
              Calyx is writing on the board…
            </p>
          )}

          {visibleLines.map((line, index) => (
            <p
              key={`line-${index}`}
              style={{
                ...inter,
                fontWeight: index === 0 ? 600 : 400,
                fontSize: index === 0 ? "16px" : "15px",
                color: "rgba(232,245,233,0.92)",
                lineHeight: "1.5",
                animation: "fadeIn 0.5s ease",
              }}
            >
              {line}
            </p>
          ))}

          {visibleBullets.length > 0 && (
            <ul className="mt-2 space-y-2.5 pl-1">
              {visibleBullets.map((point) => (
                <li key={point} className="flex items-start gap-2.5">
                  <span className="text-[#7dd3a8] mt-1.5 text-xs">●</span>
                  <span
                    style={{
                      ...inter,
                      fontWeight: 400,
                      fontSize: "14px",
                      color: "rgba(232,245,233,0.85)",
                      lineHeight: "1.45",
                      animation: "fadeIn 0.5s ease",
                    }}
                  >
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {showInteraction && interaction && (
            <div className="mt-5 pt-4 border-t border-white/10">
              <p
                style={{
                  ...inter,
                  fontWeight: 600,
                  fontSize: "14px",
                  color: "#E8F5E9",
                  marginBottom: "12px",
                }}
              >
                {interaction.prompt}
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                {interaction.options.map((option) => {
                  const isSelected = selectedOptionId === option.id;
                  const showResult = selectedOptionId != null;
                  const isCorrect = option.correct === true;
                  let borderColor = "rgba(255,255,255,0.2)";
                  let bg = "rgba(0,0,0,0.2)";

                  if (showResult && isSelected) {
                    borderColor = answeredCorrectly ? "#00CED1" : "#FF7B7B";
                    bg = answeredCorrectly ? "rgba(0,206,209,0.15)" : "rgba(255,123,123,0.12)";
                  } else if (showResult && isCorrect && !answeredCorrectly) {
                    borderColor = "#00CED1";
                    bg = "rgba(0,206,209,0.1)";
                  }

                  return (
                    <button
                      key={option.id}
                      type="button"
                      disabled={selectedOptionId != null}
                      onClick={() => onSelectOption?.(option.id)}
                      className="rounded-xl px-4 py-3 text-left transition-transform hover:scale-[1.02] disabled:cursor-default"
                      style={{
                        border: `2px solid ${borderColor}`,
                        backgroundColor: bg,
                        ...inter,
                        fontWeight: 600,
                        fontSize: "14px",
                        color: "#E8F5E9",
                      }}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
              {selectedOptionId != null && (
                <p
                  className="mt-3 text-sm"
                  style={{
                    ...inter,
                    color: answeredCorrectly ? "#00CED1" : "#FFC542",
                  }}
                >
                  {answeredCorrectly
                    ? "Great job! That's the strongest word."
                    : "Good try — pick the word with the most energy."}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
