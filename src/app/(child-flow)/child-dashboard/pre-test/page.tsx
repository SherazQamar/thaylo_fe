"use client";

import { useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import WordLadderDragDrop from "@/components/child/class/WordLadderDragDrop";
import OptionHintButton from "@/components/child/class/OptionHintButton";
import { getApiErrorMessage } from "@/lib/auth-api";
import {
  fetchChildPretest,
  submitChildPretest,
  type PretestQuestion,
} from "@/lib/badge-api";
import { startChildClass } from "@/lib/curriculum-api";
import { getStartClassErrorMessage } from "@/lib/child-class-messages";
import { shuffleArray } from "@/lib/shuffle";
import ClassMediaSetupGate from "@/components/child/class/ClassMediaSetupGate";
import { useClassMedia } from "@/hooks/use-class-media";

const inter = { fontFamily: "Inter, sans-serif" } as const;

type AnswerState = {
  optionId?: string;
  orderedIds?: string[];
  locked?: boolean;
};

const titleStyle: CSSProperties = {
  ...inter,
  fontWeight: 700,
  color: "#FFFFFF",
  marginBottom: 4,
};

const primaryBtnStyle: CSSProperties = {
  ...inter,
  fontWeight: 600,
  fontSize: 14,
  backgroundColor: "#00CED1",
  color: "#111023",
};

const secondaryBtnStyle: CSSProperties = {
  ...inter,
  fontWeight: 600,
  fontSize: 14,
  backgroundColor: "rgba(255,255,255,0.08)",
  color: "#FFFFFF",
};

export default function ChildPretestPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerState>>({});
  const [localFeedback, setLocalFeedback] = useState<string | null>(null);
  const [resultBanner, setResultBanner] = useState<{
    passed: boolean;
    scorePercent: number;
    badges: string[];
  } | null>(null);

  const pretestQuery = useQuery({
    queryKey: ["child", "pretest"],
    queryFn: () => fetchChildPretest(),
    staleTime: 0,
    refetchOnMount: "always",
  });

  const questions = pretestQuery.data?.questions ?? [];
  const current = questions[index] as PretestQuestion | undefined;
  const choiceOptionsKey =
    current && current.type !== "word_ladder"
      ? `${current.id}:${current.options.map((o) => o.id).join(",")}`
      : "";
  const shuffledCurrentOptions = useMemo(() => {
    if (!current || current.type === "word_ladder") return [];
    return shuffleArray(current.options);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reshuffle only when question identity changes
  }, [choiceOptionsKey]);
  const allAnswered =
    questions.length > 0 &&
    questions.every((q) => {
      const a = answers[q.id];
      if (!a) return false;
      if (q.type === "word_ladder") return (a.orderedIds?.length ?? 0) >= 2;
      return Boolean(a.optionId);
    });

  const startLessonMutation = useMutation({
    mutationFn: async () => {
      const curriculumId = pretestQuery.data?.curriculumId ?? undefined;
      return startChildClass(curriculumId ?? undefined);
    },
    onSuccess: (session) => {
      router.replace(`/child-dashboard/lesson?sessionId=${session.sessionId}`);
    },
  });

  const submitMutation = useMutation({
    mutationFn: async () => {
      const curriculumId = pretestQuery.data?.curriculumId ?? undefined;
      return submitChildPretest({
        curriculumId: curriculumId ?? undefined,
        answers: questions.map((q) => ({
          questionId: q.id,
          optionId: answers[q.id]?.optionId,
          orderedIds: answers[q.id]?.orderedIds,
        })),
      });
    },
    onSuccess: async (result) => {
      await queryClient.invalidateQueries({ queryKey: ["child", "badges"] });
      await queryClient.invalidateQueries({
        queryKey: ["child", "assigned-classes"],
      });

      setResultBanner({
        passed: result.passed,
        scorePercent: result.scorePercent,
        badges: (result.skip?.badgesAwarded ?? []).map((b) => b.name),
      });

      if (result.passed) {
        window.setTimeout(() => {
          router.replace("/child-dashboard");
        }, 2200);
        return;
      }

      window.setTimeout(() => {
        startLessonMutation.mutate();
      }, 1600);
    },
  });

  const progressLabel = useMemo(() => {
    if (!questions.length) return "";
    return `Question ${Math.min(index + 1, questions.length)} of ${questions.length}`;
  }, [index, questions.length]);

  function goNext() {
    setLocalFeedback(null);
    if (index < questions.length - 1) {
      setIndex((v) => v + 1);
      return;
    }
    if (allAnswered) {
      submitMutation.mutate();
    }
  }

  function selectOption(question: PretestQuestion, optionId: string) {
    if (answers[question.id]?.locked) return;
    setAnswers((prev) => ({
      ...prev,
      [question.id]: { optionId, locked: true },
    }));
    setLocalFeedback("Answer saved");
  }

  function submitLadder(question: PretestQuestion, orderedIds: string[]) {
    setAnswers((prev) => ({
      ...prev,
      [question.id]: { orderedIds, locked: true },
    }));
    setLocalFeedback("Saved");
  }

  async function takeLessonInstead() {
    try {
      const session = await startChildClass(
        pretestQuery.data?.curriculumId ?? undefined,
      );
      router.replace(`/child-dashboard/lesson?sessionId=${session.sessionId}`);
    } catch (error) {
      setLocalFeedback(getStartClassErrorMessage(error));
    }
  }

  if (pretestQuery.isLoading) {
    return (
      <Shell>
        <p style={{ ...inter, color: "rgba(255,255,255,0.6)" }}>Loading pre-test…</p>
      </Shell>
    );
  }

  if (pretestQuery.isError) {
    return (
      <Shell>
        <p style={{ ...inter, color: "#F87171", marginBottom: 12 }}>
          {getApiErrorMessage(pretestQuery.error)}
        </p>
        <button
          type="button"
          onClick={() => void takeLessonInstead()}
          className="rounded-full px-5 py-2.5"
          style={secondaryBtnStyle}
        >
          Start the lesson instead
        </button>
      </Shell>
    );
  }

  if (!pretestQuery.data?.available || questions.length === 0) {
    return (
      <Shell>
        <h1 style={titleStyle}>Pre-test</h1>
        <p style={{ ...inter, color: "rgba(255,255,255,0.65)", marginBottom: 16 }}>
          No pre-test for this lesson
          {pretestQuery.data?.reason === "retake"
            ? " (retake in progress)."
            : "."}{" "}
          You’ll go straight into class.
        </p>
        <button
          type="button"
          onClick={() => void takeLessonInstead()}
          className="rounded-full px-5 py-2.5 disabled:opacity-50"
          style={primaryBtnStyle}
          disabled={startLessonMutation.isPending}
        >
          {startLessonMutation.isPending ? "Starting…" : "Start lesson"}
        </button>
      </Shell>
    );
  }

  if (resultBanner) {
    return (
      <Shell>
        <div
          className="rounded-2xl p-4 sm:p-6 text-center"
          style={{ backgroundColor: "#313044" }}
        >
          <p
            className="text-lg sm:text-[22px]"
            style={{
              ...inter,
              fontWeight: 700,
              color: resultBanner.passed ? "#00CED1" : "#FFC542",
              marginBottom: 8,
            }}
          >
            {resultBanner.passed ? "Bloom Ahead!" : "Nice try"}
          </p>
          <p className="text-[13px] sm:text-base" style={{ ...inter, color: "rgba(255,255,255,0.7)", marginBottom: 12 }}>
            Score {resultBanner.scorePercent}%
            {resultBanner.passed
              ? " — you showed mastery and can skip this lesson."
              : " — let’s learn it together in class."}
          </p>
          {resultBanner.badges.length > 0 && (
            <p style={{ ...inter, color: "#00CED1", fontSize: 13 }}>
              Earned: {resultBanner.badges.join(", ")}
            </p>
          )}
          <p
            style={{
              ...inter,
              color: "rgba(255,255,255,0.4)",
              fontSize: 12,
              marginTop: 16,
            }}
          >
            {resultBanner.passed
              ? "Returning to your pathway…"
              : "Opening the lesson…"}
          </p>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="flex items-start justify-between gap-2 mb-3 sm:mb-4 sm:gap-3">
        <div className="min-w-0">
          <p
            className="text-[10px] sm:text-xs"
            style={{
              ...inter,
              letterSpacing: "0.6px",
              textTransform: "uppercase",
              color: "#00CED1",
              fontWeight: 700,
            }}
          >
            Pre-test · Bloom Ahead
          </p>
          <h1 className="text-lg sm:text-2xl truncate" style={titleStyle}>
            {pretestQuery.data.lessonTitle ?? "Next lesson"}
          </h1>
          <p className="text-[11px] sm:text-[13px]" style={{ ...inter, color: "rgba(255,255,255,0.5)" }}>
            Pass with {pretestQuery.data.passThreshold}%+ to skip the lesson.{" "}
            {progressLabel}
          </p>
        </div>
        <button
          type="button"
          onClick={() => void takeLessonInstead()}
          className="shrink-0 rounded-full px-2.5 py-1 text-[12px] hover:bg-white/10 sm:px-3 sm:py-1.5 sm:text-sm"
          style={{ ...inter, color: "rgba(255,255,255,0.7)" }}
        >
          Skip
        </button>
      </div>

      {current && (
        <div
          className="rounded-[16px] overflow-hidden border border-[#2d4a3e] mb-4"
          style={{
            background:
              "linear-gradient(180deg, #1a3d32 0%, #0f2922 45%, #0a1f1a 100%)",
          }}
        >
          <div className="p-3 sm:p-4 md:p-5">
            <p
              className="text-[13px] sm:text-[15px]"
              style={{
                ...inter,
                fontWeight: 600,
                color: "#E8F5E9",
                marginBottom: 12,
                lineHeight: 1.4,
              }}
            >
              {current.prompt}
            </p>

            {current.type === "word_ladder" ? (
              <WordLadderDragDrop
                words={current.options}
                showHints
                submitted={Boolean(answers[current.id]?.locked)}
                isCorrect={null}
                onSubmit={(orderedIds) => submitLadder(current, orderedIds)}
              />
            ) : (
              <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 sm:gap-2">
                {shuffledCurrentOptions.map((option) => {
                  const selected = answers[current.id]?.optionId === option.id;
                  return (
                    <div key={option.id} className="flex items-stretch gap-1.5">
                      <button
                        type="button"
                        disabled={Boolean(answers[current.id]?.locked)}
                        onClick={() => selectOption(current, option.id)}
                        className="flex-1 rounded-xl px-2.5 py-2.5 text-left transition-transform hover:scale-[1.01] disabled:cursor-default sm:px-3 sm:py-3"
                        style={{
                          border: `2px solid ${
                            selected ? "#00CED1" : "rgba(255,255,255,0.2)"
                          }`,
                          backgroundColor: selected
                            ? "rgba(0,206,209,0.15)"
                            : "rgba(0,0,0,0.2)",
                          ...inter,
                          fontWeight: 600,
                          fontSize: 14,
                          color: "#E8F5E9",
                        }}
                      >
                        {option.label}
                      </button>
                      {option.hint?.trim() && (
                        <div className="flex items-center">
                          <OptionHintButton hint={option.hint.trim()} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {(localFeedback || submitMutation.isError) && (
        <p
          className="mb-3 text-sm"
          style={{
            ...inter,
            color: submitMutation.isError ? "#F87171" : "rgba(255,255,255,0.55)",
          }}
        >
          {submitMutation.isError
            ? getApiErrorMessage(submitMutation.error)
            : localFeedback}
        </p>
      )}

      <div className="flex flex-wrap gap-2 sm:gap-3">
        <button
          type="button"
          disabled={index === 0 || submitMutation.isPending}
          onClick={() => {
            setLocalFeedback(null);
            setIndex((v) => Math.max(0, v - 1));
          }}
          className="rounded-full px-4 py-2 text-[13px] disabled:opacity-50 sm:px-5 sm:py-2.5 sm:text-sm"
          style={secondaryBtnStyle}
        >
          Back
        </button>
        <button
          type="button"
          disabled={
            submitMutation.isPending ||
            startLessonMutation.isPending ||
            (index < questions.length - 1
              ? !answers[current?.id ?? ""]
              : !allAnswered)
          }
          onClick={goNext}
          className="rounded-full px-4 py-2 text-[13px] disabled:opacity-50 sm:px-5 sm:py-2.5 sm:text-sm"
          style={primaryBtnStyle}
        >
          {submitMutation.isPending
            ? "Checking…"
            : index < questions.length - 1
              ? "Next"
              : "Submit pre-test"}
        </button>
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: ReactNode }) {
  const {
    stream,
    isRequesting,
    permissionError,
    permissionHint,
    hasActiveMedia,
    canJoinClass,
    hasVideo,
    hasAudio,
    startMedia,
  } = useClassMedia(false);

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-transparent px-2 py-4 sm:px-4 sm:py-8">
      <div className="absolute inset-0 z-0 pointer-events-none">
        {(hasActiveMedia || isRequesting || permissionError) ? (
          <ClassMediaSetupGate
            stream={stream}
            isRequesting={isRequesting}
            permissionError={permissionError}
            permissionHint={permissionHint}
            hasActiveMedia={hasActiveMedia}
            canJoinClass={canJoinClass}
            hasVideo={hasVideo}
            hasAudio={hasAudio}
            onEnableMedia={() => void startMedia()}
            onJoinClass={() => undefined}
            onBack={() => undefined}
            showJoinButton={false}
            showBackButton={false}
            showTurnOnCameraButton={false}
            lessonTitle="your lesson"
            isRetake={false}
          />
        ) : null}
      </div>

      {!hasActiveMedia && !isRequesting && !permissionError ? (
        <div className="absolute inset-x-0 top-2 z-10 flex justify-center px-3 sm:top-4 sm:px-4">
          <button
            type="button"
            onClick={() => void startMedia()}
            className="rounded-full px-4 py-2 text-[13px] font-semibold text-[#111023] sm:px-5 sm:py-2.5 sm:text-sm"
            style={{ backgroundColor: "#00CED1" }}
          >
            Enable camera background
          </button>
        </div>
      ) : null}

      <div className="relative z-10 max-w-2xl mx-auto overflow-y-auto max-h-[calc(100dvh-2rem)]">{children}</div>
    </div>
  );
}
