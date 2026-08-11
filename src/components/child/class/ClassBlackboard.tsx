"use client";

import { useMemo } from "react";
import type { BlackboardInteraction, BlackboardStep } from "@/lib/class-lesson-content";
import type { BlackboardReveal } from "@/hooks/use-blackboard-narration";
import { KaraokeText } from "@/components/child/class/ClassInstructorCaption";
import WordLadderDragDrop from "@/components/child/class/WordLadderDragDrop";
import OptionHintButton from "@/components/child/class/OptionHintButton";
import {
  CLASS_BLACKBOARD_BG,
  CLASS_BLACKBOARD_BORDER,
} from "@/lib/class-blackboard-theme";
import { shuffleArray } from "@/lib/shuffle";

const inter = { fontFamily: "Inter, sans-serif" } as const;

type ClassBlackboardProps = {
  step: BlackboardStep;
  reveal: BlackboardReveal;
  isNarrating?: boolean;
  instructorName?: string;
  greeting?: { studentName: string; inProgress: boolean };
  interaction?: BlackboardInteraction;
  selectedOptionId?: string | null;
  answeredCorrectly?: boolean | null;
  onSelectOption?: (optionId: string) => void;
  onSubmitWordLadder?: (orderedIds: string[]) => void;
  /** Keep board text/questions clear of the LiveAvatar stage. */
  avatarPresent?: boolean;
  /** Avatar is shrunk for quiz mode — still reserve a right lane. */
  avatarCompact?: boolean;
  /** After a wrong answer: highlight the correct choice. */
  revealCorrectAnswer?: boolean;
  /** In-lesson short reteach → re-check UI mode. */
  answerFlowMode?: "idle" | "reteaching" | "recheck";
  /** Force option hints visible (Need a hint? CTA). */
  forceShowHints?: boolean;
  /** Summative locked until formative checks are secure (Blueprint T4). */
  interactionLocked?: boolean;
};

function renderPartialText(text: string, visibleWords: number, keyPrefix: string) {
  const words = text.split(/\s+/).filter(Boolean);
  const shown = words.slice(0, visibleWords);

  return (
    <>
      {shown.map((word, index) => (
        <span key={`${keyPrefix}-${index}`} className="inline">
          {word}
          {index < shown.length - 1 ? " " : ""}
        </span>
      ))}
    </>
  );
}

export default function ClassBlackboard({
  step,
  reveal,
  isNarrating = false,
  instructorName = "AI Instructor",
  greeting,
  interaction,
  selectedOptionId,
  answeredCorrectly,
  onSelectOption,
  onSubmitWordLadder,
  avatarPresent = false,
  avatarCompact = false,
  revealCorrectAnswer = false,
  answerFlowMode = "idle",
  forceShowHints = false,
  interactionLocked = false,
}: ClassBlackboardProps) {
  const instructorInitial = instructorName.trim().charAt(0).toUpperCase() || "A";
  const completedLines = step.lines.slice(0, reveal.completedLines);
  const completedBullets = (step.bulletPoints ?? []).slice(0, reveal.completedBullets);
  const showInteraction = reveal.interactionVisible && interaction;
  const hasInteraction = Boolean(showInteraction);
  const hasContent =
    completedLines.length > 0 ||
    completedBullets.length > 0 ||
    reveal.activeLineIndex != null ||
    reveal.activeBulletIndex != null ||
    hasInteraction;

  const isWordLadder = interaction?.type === "word_ladder";
  const showChoiceOptions = hasInteraction && !isWordLadder;
  const showWordLadder = hasInteraction && isWordLadder;
  const showOptionHints =
    forceShowHints ||
    step.phase === "quick_check" ||
    answerFlowMode === "recheck" ||
    (revealCorrectAnswer && answeredCorrectly === false);
  const compact = hasInteraction || (step.bulletPoints?.length ?? 0) > 2;
  const interactionRemountKey = `${interaction?.id ?? "none"}:${answerFlowMode}`;

  // AI/curriculum often lists the correct answer last — shuffle once per question.
  const choiceOptionsKey =
    interaction && !isWordLadder
      ? `${interaction.id}:${interaction.options.map((o) => o.id).join(",")}:${answerFlowMode}`
      : "";
  const shuffledChoiceOptions = useMemo(() => {
    if (!interaction || isWordLadder) return [];
    return shuffleArray(interaction.options);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reshuffle only when question identity changes
  }, [choiceOptionsKey]);

  // Always keep content left of the avatar — especially quiz options.
  // On mobile, leave less right pad and extra bottom pad so submit clears media controls.
  const contentPadClass = !avatarPresent
    ? hasInteraction
      ? "pb-20"
      : ""
    : avatarCompact || hasInteraction
      ? "pr-[min(28%,160px)] sm:pr-[min(36%,230px)] md:pr-[min(32%,250px)] pb-24 sm:pb-20"
      : "pr-[min(40%,200px)] sm:pr-[min(48%,380px)] md:pr-[min(44%,420px)] pb-16";

  return (
    <div
      className="relative w-full h-full rounded-[16px] overflow-hidden border"
      style={{ borderColor: CLASS_BLACKBOARD_BORDER }}
    >
      <div className="absolute inset-0" style={{ background: CLASS_BLACKBOARD_BG }} />
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.08) 0%, transparent 40%), radial-gradient(circle at 80% 60%, rgba(255,255,255,0.05) 0%, transparent 35%)",
        }}
      />

      <div
        className={`relative z-10 flex h-full flex-col overflow-hidden px-4 py-3 md:px-5 md:py-4 ${contentPadClass}`}
      >
        <div className={`flex items-center gap-2.5 shrink-0 ${compact ? "mb-2" : "mb-3"}`}>
          <div
            className={`rounded-full flex items-center justify-center shrink-0 ${compact ? "w-8 h-8" : "w-10 h-10"}`}
            style={{ backgroundColor: "rgba(0,206,209,0.2)", border: "2px solid rgba(0,206,209,0.4)" }}
          >
            <span style={{ ...inter, fontWeight: 800, fontSize: compact ? "12px" : "14px", color: "#00CED1" }}>{instructorInitial}</span>
          </div>
          <div className="min-w-0">
            <p style={{ ...inter, fontWeight: 600, fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>
              {instructorName} — Blackboard
              {isNarrating && <span className="ml-2 text-[#00CED1]">speaking…</span>}
            </p>
            <p
              className="truncate"
              style={{
                ...inter,
                fontWeight: 700,
                fontSize: compact ? "clamp(14px, 2.2vh, 17px)" : "clamp(16px, 2.6vh, 20px)",
                color: "#E8F5E9",
              }}
            >
              {step.title}
            </p>
          </div>
        </div>

        <div
          className={`flex min-h-0 flex-1 flex-col ${
            hasInteraction ? "justify-start overflow-y-auto pr-1" : "justify-center overflow-hidden"
          }`}
        >
          <div
            className={`${compact ? "space-y-1.5" : "space-y-2.5"} ${hasInteraction ? "pb-4" : "overflow-hidden"}`}
            style={{ fontSize: compact ? "clamp(12px, 1.9vh, 14px)" : "clamp(13px, 2.1vh, 15px)" }}
          >
            {greeting && (
              <div className="flex flex-col items-center justify-center text-center py-4 px-2">
                <p style={{ ...inter, fontWeight: 700, fontSize: "clamp(16px, 2.8vh, 20px)", color: "#E8F5E9", marginBottom: "8px" }}>
                  Hello, {greeting.studentName}!
                </p>
                <p style={{ ...inter, fontWeight: 400, fontSize: "clamp(12px, 2vh, 14px)", color: "rgba(232,245,233,0.75)", lineHeight: "1.4" }}>
                  {greeting.inProgress ? `${instructorName} is welcoming you to class…` : "Getting your lesson ready…"}
                </p>
              </div>
            )}

            {!greeting && !hasContent && (
              <p style={{ ...inter, fontSize: "13px", color: "rgba(255,255,255,0.35)", fontStyle: "italic" }}>
                {instructorName} is writing on the board…
              </p>
            )}

            {!greeting && completedLines.map((line, index) => (
              <p
                key={`line-${index}`}
                style={{
                  ...inter,
                  fontWeight: index === 0 ? 600 : 400,
                  color: "rgba(232,245,233,0.92)",
                  lineHeight: 1.35,
                }}
              >
                {line}
              </p>
            ))}

            {!greeting && reveal.activeLineIndex != null && (
              <p style={{ ...inter, fontWeight: 400, color: "rgba(232,245,233,0.92)", lineHeight: 1.35 }}>
                {renderPartialText(
                  step.lines[reveal.activeLineIndex] ?? "",
                  reveal.activeLineWords,
                  `active-line-${reveal.activeLineIndex}`,
                )}
              </p>
            )}

            {!greeting && completedBullets.length > 0 && (
              <ul className={`pl-1 ${compact ? "space-y-1" : "space-y-1.5"}`}>
                {completedBullets.map((point) => (
                  <li key={point} className="flex items-start gap-2">
                    <span className="text-[#7dd3a8] mt-0.5 text-[10px] shrink-0">●</span>
                    <span style={{ ...inter, fontWeight: 400, color: "rgba(232,245,233,0.85)", lineHeight: 1.35 }}>
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            {!greeting && reveal.activeBulletIndex != null && (
              <ul className="pl-1">
                <li className="flex items-start gap-2">
                  <span className="text-[#7dd3a8] mt-0.5 text-[10px] shrink-0">●</span>
                  <span style={{ ...inter, fontWeight: 400, color: "rgba(232,245,233,0.85)", lineHeight: 1.35 }}>
                    {renderPartialText(
                      (step.bulletPoints ?? [])[reveal.activeBulletIndex] ?? "",
                      reveal.activeBulletWords,
                      `active-bullet-${reveal.activeBulletIndex}`,
                    )}
                  </span>
                </li>
              </ul>
            )}

            {hasInteraction && interaction && (
              <div className={`border-t border-white/10 ${compact ? "pt-2 mt-1" : "pt-3 mt-2"}`}>
                {answerFlowMode === "reteaching" || answerFlowMode === "recheck" ? (
                  <p
                    className="mb-2 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold"
                    style={{
                      ...inter,
                      color: "#FFC542",
                      backgroundColor: "rgba(255,197,66,0.12)",
                      border: "1px solid rgba(255,197,66,0.35)",
                    }}
                  >
                    {answerFlowMode === "reteaching"
                      ? "Quick reteach — listen, then try again."
                      : "Re-check — use what you just learned."}
                  </p>
                ) : null}
                <p
                  style={{
                    ...inter,
                    fontWeight: 600,
                    fontSize: compact ? "clamp(12px, 1.9vh, 13px)" : "14px",
                    color: "#E8F5E9",
                    marginBottom: compact ? "8px" : "10px",
                    lineHeight: 1.35,
                  }}
                >
                  {reveal.interactionWords > 0 ? (
                    <KaraokeText
                      text={interaction.prompt}
                      visibleWords={reveal.interactionWords}
                      keyPrefix="interaction-prompt"
                    />
                  ) : (
                    interaction.prompt
                  )}
                </p>

                {showChoiceOptions && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-xl">
                      {shuffledChoiceOptions.map((option) => {
                        const isSelected = selectedOptionId === option.id;
                        const showResult = selectedOptionId != null;
                        const isCorrectOption = option.correct === true;
                        let borderColor = "rgba(255,255,255,0.2)";
                        let bg = "rgba(0,0,0,0.2)";

                        if (showResult && isSelected) {
                          borderColor = answeredCorrectly ? "#00CED1" : "#FF7B7B";
                          bg = answeredCorrectly ? "rgba(0,206,209,0.15)" : "rgba(255,123,123,0.12)";
                        } else if (
                          showResult &&
                          revealCorrectAnswer &&
                          answeredCorrectly === false &&
                          isCorrectOption
                        ) {
                          borderColor = "#60D624";
                          bg = "rgba(96,214,36,0.14)";
                        }

                        return (
                          <div key={option.id} className="flex items-stretch gap-1.5">
                            <button
                              type="button"
                              disabled={
                                interactionLocked ||
                                selectedOptionId != null ||
                                answerFlowMode === "reteaching"
                              }
                              onClick={() => onSelectOption?.(option.id)}
                              className="flex-1 rounded-xl px-3 py-2 text-left transition-transform hover:scale-[1.02] disabled:cursor-default"
                              style={{
                                border: `2px solid ${borderColor}`,
                                backgroundColor: bg,
                                ...inter,
                                fontWeight: 600,
                                fontSize: "clamp(12px, 1.9vh, 14px)",
                                color: "#E8F5E9",
                              }}
                            >
                              {option.label}
                              {showResult &&
                              revealCorrectAnswer &&
                              answeredCorrectly === false &&
                              isCorrectOption
                                ? " ✓"
                                : ""}
                            </button>
                            {showOptionHints && option.hint?.trim() && (
                              <div className="flex items-center">
                                <OptionHintButton hint={option.hint.trim()} compact={compact} />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    {selectedOptionId != null && (
                      <p
                        className="mt-2 text-xs"
                        style={{
                          ...inter,
                          color: answeredCorrectly ? "#00CED1" : "#FFC542",
                        }}
                      >
                        {answeredCorrectly
                          ? "Great job! That's the strongest choice."
                          : answerFlowMode === "recheck"
                            ? "Not quite — the green choice is stronger. We'll keep practicing."
                            : revealCorrectAnswer
                              ? "Not quite — the green choice is stronger. We'll reteach, then re-check."
                              : "Not quite — let's look at this together."}
                      </p>
                    )}
                    {answerFlowMode === "recheck" && selectedOptionId == null && (
                      <p className="mt-2 text-xs" style={{ ...inter, color: "#00CED1" }}>
                        Your turn again — pick the strongest answer.
                      </p>
                    )}
                  </>
                )}

                {showWordLadder && (
                  <WordLadderDragDrop
                    key={interactionRemountKey}
                    words={interaction.options}
                    showHints={showOptionHints}
                    disabled={
                      interactionLocked || isNarrating || answerFlowMode === "reteaching"
                    }
                    submitted={selectedOptionId != null}
                    isCorrect={answeredCorrectly}
                    compact
                    onSubmit={onSubmitWordLadder ?? (() => undefined)}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
