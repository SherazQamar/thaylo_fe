"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis";
import { useAiSettings } from "@/hooks/use-ai-settings";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { getChildToken, getUserToken } from "@/lib/auth-cookies";
import { applyVoiceToDraft } from "@/lib/onboarding-voice.util";
import {
  fetchOnboardingStatus,
  startOnboardingSession,
  type OnboardingWalkthroughProgress,
} from "@/lib/onboarding-api";
import {
  createOnboardingSocket,
  type OnboardingTurn,
} from "@/lib/onboarding-socket";
import type { Socket } from "socket.io-client";

type Portal = "parent" | "child";

interface OnboardingAssistantProps {
  portal: Portal;
  dashboardPath: string;
}

type AssistantStage =
  | "loading"
  | "combined-warning"
  | "connecting"
  | "speaking"
  | "awaiting-answer"
  | "processing"
  | "complete"
  | "error";

function getToken(portal: Portal) {
  return portal === "parent" ? getUserToken() : getChildToken();
}

const AI_AVATAR_SRC = "/assets/green-robot-hero.png";
const AI_NAME = "Calyx";

function buildAnswerValue(
  questionType: string,
  draft: {
    selectedOption?: string;
    text?: string;
    selectedOptions?: string[];
  },
): Record<string, unknown> | null {
  switch (questionType) {
    case "MCQ":
      return draft.selectedOption
        ? { selectedOption: draft.selectedOption }
        : null;
    case "OPEN_TEXT":
      return draft.text?.trim() ? { text: draft.text.trim() } : null;
    case "OPEN_THEN_MCQ":
      return draft.text?.trim() && draft.selectedOption
        ? { text: draft.text.trim(), selectedOption: draft.selectedOption }
        : null;
    case "ICON_MATRIX":
      return draft.selectedOptions?.length
        ? { selectedOptions: draft.selectedOptions }
        : null;
  }
  return Object.keys(draft).length ? draft : null;
}

function isVoiceAnswerReady(
  questionType: string,
  draft: {
    selectedOption?: string;
    text?: string;
    selectedOptions?: string[];
  },
): boolean {
  return buildAnswerValue(questionType, draft) != null;
}

export default function OnboardingAssistant({
  portal,
  dashboardPath,
}: OnboardingAssistantProps) {
  const router = useRouter();
  const { settings: aiSettings } = useAiSettings(portal === "child" ? "child" : "user");
  const { speak, stop: stopSpeaking, speaking, supported: ttsSupported } =
    useSpeechSynthesis(aiSettings.voice, portal === "child" ? "child" : "user");
  const {
    supported: sttSupported,
    listening,
    displayTranscript,
    toggle: toggleListening,
    stop: stopListening,
    reset: resetVoice,
    transcript: voiceTranscript,
  } = useSpeechRecognition();
  const socketRef = useRef<Socket | null>(null);
  const spokenTurnRef = useRef<string | null>(null);
  const lastAppliedTranscriptRef = useRef("");
  const submitAnswerRef = useRef<() => void>(() => {});
  const autoSubmittedQuestionKeyRef = useRef<string | null>(null);
  const usedVoiceForQuestionRef = useRef(false);

  const [stage, setStage] = useState<AssistantStage>("loading");
  const [error, setError] = useState<string | null>(null);
  const [turn, setTurn] = useState<OnboardingTurn | null>(null);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [draft, setDraft] = useState<{
    selectedOption?: string;
    text?: string;
    selectedOptions?: string[];
  }>({});
  const [activeSection, setActiveSection] = useState<"student" | "parent">(
    "student",
  );
  const [combinedWalkthrough, setCombinedWalkthrough] =
    useState<OnboardingWalkthroughProgress | null>(null);

  const emit = useCallback((event: string, payload: Record<string, unknown>) => {
    socketRef.current?.emit(event, payload);
  }, []);

  const beginWalkthroughRef = useRef<() => Promise<void>>(async () => {});
  const startSessionRef = useRef<() => Promise<void>>(async () => {});
  const handleTurnRef = useRef<(turn: OnboardingTurn) => Promise<void>>(
    async () => {},
  );
  const connectedPortalRef = useRef<Portal | null>(null);
  const pendingWalkthroughIdRef = useRef<number | null>(null);

  const setupSocket = useCallback((authPortal: Portal) => {
    socketRef.current?.removeAllListeners();
    socketRef.current?.disconnect();

    const token = getToken(authPortal);
    if (!token) {
      return false;
    }

    const socket = createOnboardingSocket(token);
    socketRef.current = socket;
    connectedPortalRef.current = authPortal;

    socket.on("onboarding:connected", () => {
      void startSessionRef.current();
    });

    socket.on("onboarding:turn", (payload: OnboardingTurn) => {
      void handleTurnRef.current(payload);
    });

    socket.on("onboarding:error", (payload: { message?: string }) => {
      setError(payload?.message ?? "Onboarding connection error");
      setStage("error");
    });

    socket.on("connect_error", () => {
      setError(
        `Could not connect to ${AI_NAME}. Make sure thaylo-ai is running on port 3002.`,
      );
      setStage("error");
    });

    return true;
  }, []);

  const startSession = useCallback(async () => {
    const walkthroughId = pendingWalkthroughIdRef.current;
    if (!walkthroughId) {
      return;
    }

    const session = await startOnboardingSession(portal, walkthroughId);
    setSessionId(session.id);
    setStage("connecting");
    emit("onboarding:start", { sessionId: session.id });
  }, [emit, portal]);

  startSessionRef.current = startSession;

  const proceedToSession = useCallback(async () => {
    if (connectedPortalRef.current !== portal) {
      if (!setupSocket(portal)) {
        setError("You are not signed in.");
        setStage("error");
        return;
      }
      return;
    }

    if (socketRef.current?.connected) {
      await startSession();
    }
  }, [portal, setupSocket, startSession]);

  const beginWalkthrough = useCallback(async () => {
    setStage("loading");
    setError(null);
    setDraft({});
    setCombinedWalkthrough(null);

    const statusPortal = portal === "parent" ? "parent" : "child";
    const status = await fetchOnboardingStatus(statusPortal);
    if (status.isComplete) {
      router.replace(dashboardPath);
      return;
    }

    const currentWalkthrough =
      status.walkthroughs.find(
        (item) => item.id === status.currentWalkthroughId,
      ) ?? status.walkthroughs.find((item) => item.progressStatus !== "completed");

    const walkthroughId =
      status.currentWalkthroughId ?? currentWalkthrough?.id ?? status.walkthroughs[0]?.id;

    if (!walkthroughId || !currentWalkthrough) {
      router.replace(dashboardPath);
      return;
    }

    const isCombined = currentWalkthrough.deliveryMode === "combined";
    const isParentSection = status.currentWalkthroughPortal === "parent";

    if (isParentSection) {
      setActiveSection("parent");
    } else if (isCombined) {
      setActiveSection("student");
    }

    pendingWalkthroughIdRef.current = walkthroughId;

    if (
      portal === "child" &&
      isCombined &&
      currentWalkthrough.combinedPhase === "student" &&
      currentWalkthrough.progressStatus === "pending"
    ) {
      setCombinedWalkthrough(currentWalkthrough);
      setStage("combined-warning");
      return;
    }

    await proceedToSession();
  }, [portal, dashboardPath, router, proceedToSession]);

  const confirmCombinedStart = useCallback(async () => {
    setStage("loading");
    await proceedToSession();
  }, [proceedToSession]);

  beginWalkthroughRef.current = beginWalkthrough;

  const handleTurn = useCallback(
    async (nextTurn: OnboardingTurn) => {
      setTurn(nextTurn);
      setSessionId(nextTurn.sessionId);
      setDraft({});
      spokenTurnRef.current = null;
      lastAppliedTranscriptRef.current = "";
      autoSubmittedQuestionKeyRef.current = null;
      usedVoiceForQuestionRef.current = false;
      stopListening();
      resetVoice();
      setStage("speaking");

      const speechKey = `${nextTurn.phase}:${nextTurn.sessionId}:${nextTurn.speechText}`;
      spokenTurnRef.current = speechKey;
      await speak(nextTurn.speechText);

      if (nextTurn.phase === "complete" || nextTurn.isSessionComplete) {
        setStage("complete");
        if (nextTurn.onboardingComplete) {
          setTimeout(() => router.replace(dashboardPath), 2200);
          return;
        }

        if (portal === "child") {
          const status = await fetchOnboardingStatus("child");
          const waitingForParent =
            status.currentWalkthroughPortal === "parent" ||
            status.walkthroughs.some(
              (item) =>
                item.deliveryMode === "combined" &&
                item.combinedPhase === "parent" &&
                item.progressStatus !== "completed",
            );

          if (waitingForParent) {
            setTimeout(() => router.replace(dashboardPath), 3200);
            return;
          }
        }

        setActiveSection("parent");
        setTimeout(() => void beginWalkthrough(), 2200);
        return;
      }

      if (nextTurn.phase === "greeting") {
        emit("onboarding:continue", { sessionId: nextTurn.sessionId });
        return;
      }

      if (nextTurn.awaitAnswer && nextTurn.question) {
        setStage("awaiting-answer");
      } else if (nextTurn.question) {
        emit("onboarding:continue", { sessionId: nextTurn.sessionId });
      }
    },
    [speak, emit, router, dashboardPath, beginWalkthrough, stopListening, resetVoice],
  );

  handleTurnRef.current = handleTurn;

  useEffect(() => {
    if (!setupSocket(portal)) {
      setError("You are not signed in.");
      setStage("error");
      return;
    }

    void beginWalkthroughRef.current().catch((err) => {
      setError(
        isAxiosError(err)
          ? ((err.response?.data?.message as string) ?? "Failed to start onboarding")
          : "Failed to start onboarding",
      );
      setStage("error");
    });

    return () => {
      socketRef.current?.removeAllListeners();
      socketRef.current?.disconnect();
      socketRef.current = null;
      connectedPortalRef.current = null;
    };
  }, [portal, setupSocket]);

  useEffect(() => {
    if (stage !== "awaiting-answer" || !turn?.question || !voiceTranscript) {
      return;
    }
    if (voiceTranscript === lastAppliedTranscriptRef.current) {
      return;
    }

    usedVoiceForQuestionRef.current = true;
    lastAppliedTranscriptRef.current = voiceTranscript;
    const options = turn.question.options ?? [];
    const matrixItems = turn.question.subItems ?? turn.question.options ?? [];

    setDraft((prev) =>
      applyVoiceToDraft(
        voiceTranscript,
        turn.question!.type,
        prev,
        options,
        matrixItems,
      ),
    );
  }, [voiceTranscript, stage, turn?.question]);

  useEffect(() => {
    if (speaking || stage === "speaking" || stage === "processing") {
      stopListening();
    }
  }, [speaking, stage, stopListening]);

  const submitAnswer = useCallback(async () => {
    if (!turn?.question || !sessionId) return;
    if (stage === "processing") return;

    const value = buildAnswerValue(turn.question.type, draft);
    if (!value) {
      setError("Please choose or type an answer before continuing.");
      return;
    }

    setError(null);
    setStage("processing");
    stopListening();

    emit("onboarding:submit-answer", {
      sessionId,
      questionKey: turn.question.key,
      questionTitle: turn.question.prompt,
      questionType: turn.question.type,
      value,
      transcript: voiceTranscript || displayTranscript || undefined,
    });
  }, [
    turn?.question,
    sessionId,
    stage,
    draft,
    stopListening,
    emit,
    voiceTranscript,
    displayTranscript,
  ]);

  submitAnswerRef.current = () => {
    void submitAnswer();
  };

  useEffect(() => {
    const question = turn?.question;
    if (stage !== "awaiting-answer" || !question || listening) {
      return;
    }
    if (!usedVoiceForQuestionRef.current) {
      return;
    }
    if (autoSubmittedQuestionKeyRef.current === question.key) {
      return;
    }
    if (!isVoiceAnswerReady(question.type, draft)) {
      return;
    }

    const timer = window.setTimeout(() => {
      if (autoSubmittedQuestionKeyRef.current === question.key) {
        return;
      }
      autoSubmittedQuestionKeyRef.current = question.key;
      submitAnswerRef.current();
    }, 500);

    return () => window.clearTimeout(timer);
  }, [listening, draft, stage, turn?.question]);

  function handleVoiceToggle() {
    if (listening) {
      stopListening();
      return;
    }
    stopSpeaking();
    resetVoice();
    lastAppliedTranscriptRef.current = "";
    toggleListening();
  }

  const progressPercent = turn?.progress.total
    ? Math.round((turn.progress.current / turn.progress.total) * 100)
    : 0;

  if (stage === "combined-warning") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#111023] px-6">
        <div className="max-w-lg w-full space-y-6">
          <div className="rounded-[24px] border border-[#00CED1]/30 bg-[#313044] p-8 space-y-4">
            <p className="text-[#00CED1] text-xs uppercase tracking-widest">
              Before you begin
            </p>
            <h1
              className="text-white text-xl font-semibold"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              {combinedWalkthrough?.title ?? "Assessment"}
            </h1>
            <p className="text-white/70 text-sm leading-relaxed">
              You will answer the student questions first. When you finish, your parent
              must sign in on the parent dashboard to complete the parent questions.
            </p>
            <ul className="text-white/60 text-sm space-y-2 list-disc pl-5">
              <li>Student questions appear on the student dashboard</li>
              <li>Parent questions appear on the parent dashboard</li>
            </ul>
          </div>
          <button
            type="button"
            onClick={() => void confirmCombinedStart()}
            className="w-full px-6 py-4 rounded-full bg-[#00CED1] text-[#111023] text-sm font-semibold hover:bg-[#00B8BB] transition-colors"
          >
            I understand — let&apos;s begin
          </button>
        </div>
      </div>
    );
  }

  if (stage === "loading" || stage === "connecting") {
    return (
      <LoadingScreen
        label={
          stage === "connecting"
            ? `Connecting to ${AI_NAME}…`
            : "Preparing your onboarding…"
        }
      />
    );
  }

  if (stage === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#111023] px-6">
        <div className="max-w-md text-center space-y-4">
          <p className="text-white/70">{error ?? "Something went wrong."}</p>
          <button
            type="button"
            onClick={() => void beginWalkthrough()}
            className="px-6 py-3 rounded-full bg-[#00CED1] text-[#111023] text-sm font-semibold"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111023] flex flex-col">
      <header className="px-6 py-4 border-b border-white/10">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div>
            <p className="text-[#00CED1] text-xs uppercase tracking-widest">
              {activeSection === "parent"
                ? "Parent questions"
                : portal === "parent"
                  ? "Parent onboarding"
                  : "Student questions"}
            </p>
            <h1
              className="text-white text-lg font-semibold"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              {turn?.walkthroughTitle ?? AI_NAME}
            </h1>
          </div>
          {turn?.progress.total ? (
            <p className="text-white/40 text-sm">
              {turn.progress.current} / {turn.progress.total}
            </p>
          ) : null}
        </div>
        {turn?.progress.total ? (
          <div className="max-w-4xl mx-auto mt-3 h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-[#00CED1] transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        ) : null}
      </header>

      <main className="flex-1 px-4 sm:px-6 py-6 sm:py-10">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 items-start">
          <div className="flex flex-col items-center">
            <Image
              src={AI_AVATAR_SRC}
              alt={`${AI_NAME}, your Bloom Buddy`}
              width={240}
              height={240}
              className={`w-[200px] h-[200px] sm:w-[240px] sm:h-[240px] object-contain transition-transform duration-300 ${
                speaking || listening ? "scale-105" : "scale-100"
              }`}
              unoptimized
            />
            <p className="mt-4 text-sm font-medium text-[#00CED1]">
              {speaking || stage === "speaking"
                ? "Speaking…"
                : listening
                  ? "Listening…"
                : stage === "processing"
                  ? "Saving your answer…"
                  : stage === "complete"
                    ? "All done!"
                    : stage === "awaiting-answer"
                      ? "Tap the mic and speak"
                      : AI_NAME}
            </p>
            {stage === "awaiting-answer" && sttSupported && (
              <button
                type="button"
                onClick={handleVoiceToggle}
                className={`mt-4 w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                  listening
                    ? "bg-red-500/90 text-white animate-pulse"
                    : "bg-[#00CED1] text-[#111023] hover:bg-[#00B8BB]"
                }`}
                aria-label={listening ? "Stop listening" : "Start voice input"}
              >
                <MicIcon listening={listening} />
              </button>
            )}
            {stage === "awaiting-answer" && displayTranscript && (
              <p className="mt-3 text-xs text-white/50 text-center max-w-[240px]">
                You said: &ldquo;{displayTranscript}&rdquo;
              </p>
            )}
            {!ttsSupported && (
              <p className="mt-2 text-xs text-white/40 text-center max-w-[220px]">
                Voice playback is unavailable — read the message below.
              </p>
            )}
            {!sttSupported && stage === "awaiting-answer" && (
              <p className="mt-2 text-xs text-white/40 text-center max-w-[220px]">
                Voice input is unavailable — use the options below.
              </p>
            )}
          </div>

          <div className="space-y-5">
            {activeSection === "parent" && portal === "child" && (
              <div className="rounded-2xl border border-[#00CED1]/30 bg-[#00CED1]/10 px-5 py-4">
                <p className="text-[#00CED1] text-sm font-medium">
                  Parent section
                </p>
                <p className="text-white/60 text-sm mt-1">
                  Great job! A parent should now answer the remaining questions.
                </p>
              </div>
            )}
            <div className="rounded-[24px] border border-[#525162]/50 bg-[#313044] p-6 sm:p-8 min-h-[160px]">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-[#00CED1]/20 flex items-center justify-center shrink-0">
                  <span className="text-[#00CED1] text-[10px] font-bold">{AI_NAME}</span>
                </div>
                <p
                  className="text-white/90 text-base sm:text-lg leading-relaxed whitespace-pre-line"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {turn?.displayText ?? "Hello! I'm getting things ready for you."}
                </p>
              </div>

              {turn?.question && stage === "awaiting-answer" && (
                <p className="text-white/50 text-sm mt-4 border-t border-white/10 pt-4">
                  {turn.question.prompt}
                </p>
              )}

              {error && (
                <p className="text-red-400 text-sm mt-4" role="alert">
                  {error}
                </p>
              )}
            </div>

            {turn?.question && stage === "awaiting-answer" && (
              <AnswerPanel
                question={turn.question}
                draft={draft}
                onChange={setDraft}
                onSubmit={() => void submitAnswer()}
                disabled={stage !== "awaiting-answer"}
                voiceTranscript={displayTranscript}
                onVoiceToggle={handleVoiceToggle}
                listening={listening}
                voiceSupported={sttSupported}
              />
            )}

            {stage === "complete" && (
              <div className="rounded-2xl border border-[#00CED1]/30 bg-[#00CED1]/10 px-6 py-4 text-center">
                <p className="text-[#00CED1] text-sm font-medium">
                  {turn?.onboardingComplete
                    ? "Redirecting to your dashboard…"
                    : portal === "child"
                      ? "Student section complete! Ask your parent to sign in and finish the parent questions on the parent dashboard."
                      : "Great progress! Moving to the next section…"}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function LoadingScreen({ label }: { label: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#111023]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-2 border-[#00CED1] border-t-transparent rounded-full animate-spin" />
        <p className="text-white/50 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
          {label}
        </p>
      </div>
    </div>
  );
}

function MicIcon({ listening }: { listening: boolean }) {
  if (listening) {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <rect x="6" y="6" width="12" height="12" rx="2" />
      </svg>
    );
  }
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M12 1a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
      <path d="M12 18v4" />
      <path d="M8 22h8" />
    </svg>
  );
}

function AnswerPanel({
  question,
  draft,
  onChange,
  onSubmit,
  disabled,
  voiceTranscript,
  onVoiceToggle,
  listening,
  voiceSupported,
}: {
  question: NonNullable<OnboardingTurn["question"]>;
  draft: {
    selectedOption?: string;
    text?: string;
    selectedOptions?: string[];
  };
  onChange: (value: {
    selectedOption?: string;
    text?: string;
    selectedOptions?: string[];
  }) => void;
  onSubmit: () => void;
  disabled: boolean;
  voiceTranscript?: string;
  onVoiceToggle: () => void;
  listening: boolean;
  voiceSupported: boolean;
}) {
  const options = question.options ?? [];
  const matrixItems = question.subItems ?? question.options ?? [];

  return (
    <div className="space-y-3">
      {voiceSupported && (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#252436] px-4 py-3">
          <div className="min-w-0">
            <p className="text-white/80 text-sm font-medium">Voice answer</p>
            <p className="text-white/40 text-xs truncate">
              {listening
                ? "Listening… speak now"
                : voiceTranscript
                  ? `Heard: ${voiceTranscript}`
                  : "Tap mic and say your answer, or pick an option below"}
            </p>
          </div>
          <button
            type="button"
            disabled={disabled}
            onClick={onVoiceToggle}
            className={`shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-colors ${
              listening
                ? "bg-red-500 text-white"
                : "bg-[#00CED1] text-[#111023]"
            }`}
            aria-label={listening ? "Stop listening" : "Start voice input"}
          >
            <MicIcon listening={listening} />
          </button>
        </div>
      )}

      {(question.type === "MCQ" ||
        (question.type === "OPEN_THEN_MCQ" && options.length > 0)) &&
        options.map((option) => (
          <button
            key={option}
            type="button"
            disabled={disabled}
            onClick={() =>
              onChange({
                ...draft,
                selectedOption: option,
              })
            }
            className={`w-full rounded-2xl px-5 py-4 text-left text-sm border transition-all ${
              draft.selectedOption === option
                ? "border-[#00CED1] bg-[#00CED1]/15 text-white scale-[1.01]"
                : "border-white/10 bg-[#313044] text-white/85 hover:border-white/25"
            }`}
          >
            {option}
          </button>
        ))}

      {(question.type === "OPEN_TEXT" || question.type === "OPEN_THEN_MCQ") && (
        <textarea
          value={draft.text ?? ""}
          disabled={disabled}
          onChange={(event) => onChange({ ...draft, text: event.target.value })}
          rows={3}
          placeholder="Type your answer, or use the mic above…"
          className="w-full rounded-2xl bg-[#313044] border border-white/10 px-4 py-3 text-white text-sm outline-none focus:border-[#00CED1]/40"
        />
      )}

      {question.type === "ICON_MATRIX" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {matrixItems.map((item) => {
            const selected = draft.selectedOptions ?? [];
            const isSelected = selected.includes(item);
            return (
              <button
                key={item}
                type="button"
                disabled={disabled}
                onClick={() => {
                  const next = isSelected
                    ? selected.filter((entry) => entry !== item)
                    : [...selected, item];
                  onChange({ ...draft, selectedOptions: next });
                }}
                className={`rounded-2xl px-4 py-4 text-left text-sm border transition-colors ${
                  isSelected
                    ? "border-[#00CED1] bg-[#00CED1]/10 text-white"
                    : "border-white/10 bg-[#313044] text-white/80"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>
      )}

      <div className="flex justify-end pt-2">
        <button
          type="button"
          disabled={disabled}
          onClick={onSubmit}
          className="px-8 py-3 rounded-full bg-[#00CED1] text-[#111023] text-sm font-semibold disabled:opacity-50"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
