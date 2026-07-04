"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ChildUserDropdown from "@/components/child/ChildUserDropdown";
import { useChildAuthStore } from "@/stores/child-auth.store";
import ClassBlackboard from "@/components/child/class/ClassBlackboard";
import ClassChildVideo from "@/components/child/class/ClassChildVideo";
import ClassLessonHeader from "@/components/child/class/ClassLessonHeader";
import ClassMediaControls from "@/components/child/class/ClassMediaControls";
import ClassMediaSetupGate from "@/components/child/class/ClassMediaSetupGate";
import ClassScoreSummary from "@/components/child/class/ClassScoreSummary";
import ClassTextChat from "@/components/child/class/ClassTextChat";
import { useBlackboardNarration } from "@/hooks/use-blackboard-narration";
import { useAiSettings } from "@/hooks/use-ai-settings";
import { useClassChat } from "@/hooks/use-class-chat";
import { useClassMedia } from "@/hooks/use-class-media";
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis";
import {
  phaseForStepIndex,
  type ClassPhase,
} from "@/lib/class-lesson-content";
import { buildBlackboardSteps } from "@/lib/class-lesson-builder";
import {
  completeClassSession,
  submitClassAnswer,
  type ChildClassSession,
  type ClassSessionScore,
} from "@/lib/curriculum-api";
import { buildClassGreeting } from "@/lib/calyx-class-chat";
import { delay } from "@/lib/tts-word-sync";
import { navigateToChildClass } from "@/lib/start-child-class";

const inter = { fontFamily: "Inter, sans-serif" } as const;

type ClassLiveRoomProps = {
  session: ChildClassSession | null;
  isLoading: boolean;
  loadError: string | null;
};

export default function ClassLiveRoom({ session, isLoading, loadError }: ClassLiveRoomProps) {
  const router = useRouter();
  const [classJoined, setClassJoined] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [activeCaption, setActiveCaption] = useState<string | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<boolean | null>(null);
  const [answerLocked, setAnswerLocked] = useState(false);
  const [classScore, setClassScore] = useState<ClassSessionScore | null>(null);
  const [chatInitialized, setChatInitialized] = useState(false);
  const [greetingDone, setGreetingDone] = useState(false);
  const [isGreeting, setIsGreeting] = useState(false);
  const greetingStartedRef = useRef(false);
  const stepIndexRef = useRef(stepIndex);

  const child = useChildAuthStore((state) => state.child);
  const studentName = child?.userName?.trim() || "Student";

  useEffect(() => {
    stepIndexRef.current = stepIndex;
  }, [stepIndex]);

  const lessonTitle = session?.lessonTitle ?? "Live Class";
  const moduleLabel = session ? `Lesson ${session.lessonOrder}` : "Class";
  const subtitle = session
    ? `${session.curriculumTitle} · ${session.subject} · ${session.gradeLevel}`
    : undefined;

  const blackboardSteps = useMemo(
    () =>
      buildBlackboardSteps({
        lessonTitle: session?.lessonTitle,
        lessonScript: session?.lessonScript,
      }),
    [session?.lessonTitle, session?.lessonScript],
  );
  const currentStep = blackboardSteps[stepIndex] ?? blackboardSteps[0];
  const currentPhase: ClassPhase = currentStep
    ? phaseForStepIndex(stepIndex, blackboardSteps)
    : "teach";

  const {
    stream,
    micEnabled,
    cameraEnabled,
    permissionError,
    permissionHint,
    isRequesting,
    hasActiveMedia,
    canJoinClass,
    hasVideo,
    hasAudio,
    startMedia,
    stopStream,
    toggleMic,
    toggleCamera,
  } = useClassMedia(false);

  const { settings: aiSettings } = useAiSettings("child");

  const { speak, speakProgress, stop: stopSpeaking } = useSpeechSynthesis(aiSettings.voice, "child");

  const handleCaption = useCallback((text: string) => {
    setActiveCaption(text);
  }, []);

  const handleCalyxSpeak = useCallback(
    (text: string) => {
      setActiveCaption(text);
      void speak(text);
    },
    [speak],
  );

  const advanceStep = useCallback(() => {
    setSelectedOptionId(null);
    setAnsweredCorrectly(null);
    setAnswerLocked(false);
    setStepIndex((prev) => Math.min(prev + 1, blackboardSteps.length - 1));
  }, [blackboardSteps.length]);

  const finishClass = useCallback(async () => {
    if (!session) return;
    try {
      const score = await completeClassSession(session.sessionId);
      setClassScore(score);
    } catch {
      setClassScore({
        sessionId: session.sessionId,
        scoreCorrect: 0,
        scoreTotal: 0,
        scorePercent: 0,
        passed: false,
        passThreshold: 85,
        needsRetake: true,
        answers: [],
      });
    }
  }, [session]);

  const handleNarrationComplete = useCallback(() => {
    const completedStepIndex = stepIndexRef.current;
    const completedStep = blackboardSteps[completedStepIndex];
    if (!completedStep) return;

    if (completedStep.interaction) {
      return;
    }

    const isLastStep = completedStepIndex >= blackboardSteps.length - 1;
    window.setTimeout(() => {
      if (stepIndexRef.current !== completedStepIndex) {
        return;
      }

      if (isLastStep) {
        void finishClass();
        return;
      }

      advanceStep();
    }, 1200);
  }, [blackboardSteps, advanceStep, finishClass]);

  const { reveal, isNarrating } = useBlackboardNarration({
    step: currentStep,
    enabled: classJoined && !!session && greetingDone,
    voiceEnabled: true,
    speakProgress,
    onCaption: handleCaption,
    onNarrationComplete: handleNarrationComplete,
    pacing: aiSettings.pacing,
  });

  const { messages, isTyping, sendMessage, pushCalyxMessage } = useClassChat({
    lessonTitle,
    stepTitle: currentStep?.title,
    onCalyxSpeak: handleCalyxSpeak,
    voiceEnabled: true,
  });

  useEffect(() => {
    if (!classJoined || !session || greetingStartedRef.current) return;
    greetingStartedRef.current = true;

    async function runGreeting() {
      setIsGreeting(true);
      const greeting = buildClassGreeting(studentName, lessonTitle);
      setActiveCaption(greeting);
      await speakProgress(greeting, { wordMs: aiSettings.pacing.wordMs });
      if (!chatInitialized) {
        pushCalyxMessage(greeting, { speak: false });
        setChatInitialized(true);
      }
      setIsGreeting(false);
      setGreetingDone(true);
    }

    void runGreeting();
  }, [
    aiSettings.pacing.wordMs,
    chatInitialized,
    classJoined,
    lessonTitle,
    pushCalyxMessage,
    session,
    speakProgress,
    studentName,
  ]);

  useEffect(() => {
    return () => stopStream();
  }, [stopStream]);

  const handleJoinClass = () => {
    if (!canJoinClass) return;
    setClassJoined(true);
  };

  const handleEndCall = () => {
    stopSpeaking();
    stopStream();
    router.push("/child-dashboard");
  };

  const advanceAfterFeedback = useCallback(
    async (feedback: string, answeredStepIndex: number) => {
      pushCalyxMessage(feedback, { speak: false });
      setActiveCaption(feedback);
      await speak(feedback);
      await delay(600);

      if (stepIndexRef.current !== answeredStepIndex) {
        return;
      }

      const isLastStep = answeredStepIndex >= blackboardSteps.length - 1;
      if (isLastStep) {
        await finishClass();
        return;
      }

      advanceStep();
    },
    [advanceStep, blackboardSteps.length, finishClass, pushCalyxMessage, speak],
  );

  const handleBlackboardSelect = (optionId: string) => {
    const interaction = currentStep?.interaction;
    if (!interaction || selectedOptionId || answerLocked || !session || !currentStep) return;

    const option = interaction.options.find((o) => o.id === optionId);
    if (!option) return;

    const isCorrect = option.correct === true;
    const answeredStepIndex = stepIndexRef.current;

    setAnswerLocked(true);
    setSelectedOptionId(optionId);
    setAnsweredCorrectly(isCorrect);

    void submitClassAnswer(session.sessionId, {
      stepId: currentStep.id,
      interactionId: interaction.id,
      optionId: option.id,
      optionLabel: option.label,
      isCorrect,
    }).catch(() => {
      // Keep local flow even if persistence fails temporarily.
    });

    const feedback = isCorrect
      ? `Yes! ${option.label} is the strongest. Great work!`
      : `You picked ${option.label}. Let's move on to the next part.`;

    void advanceAfterFeedback(feedback, answeredStepIndex);
  };

  const handleWordLadderSubmit = (orderedIds: string[]) => {
    const interaction = currentStep?.interaction;
    if (!interaction || interaction.type !== "word_ladder" || selectedOptionId || answerLocked || !session || !currentStep) {
      return;
    }

    const correctOrder = interaction.correctOrder ?? [];
    const isCorrect =
      orderedIds.length === correctOrder.length &&
      orderedIds.every((id, index) => id === correctOrder[index]);

    const labels = orderedIds.map(
      (id) => interaction.options.find((option) => option.id === id)?.label ?? id,
    );
    const answeredStepIndex = stepIndexRef.current;

    setAnswerLocked(true);
    setSelectedOptionId("word-ladder-submitted");
    setAnsweredCorrectly(isCorrect);

    void submitClassAnswer(session.sessionId, {
      stepId: currentStep.id,
      interactionId: interaction.id,
      optionId: "word-ladder-order",
      optionLabel: labels.join(" → "),
      isCorrect,
    }).catch(() => {
      // Keep local flow even if persistence fails temporarily.
    });

    const feedback = isCorrect
      ? "Perfect! You put the Word Ladder in the right order. Excellent work!"
      : "Good try on the Word Ladder. Let's finish up this lesson.";

    void advanceAfterFeedback(feedback, answeredStepIndex);
  };

  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 text-center gap-4">
        <p className="text-[#FF7B7B] text-sm" style={inter}>{loadError}</p>
        <Link href="/child-dashboard" className="text-[#00CED1] text-sm font-semibold underline">
          Back to Progress
        </Link>
      </div>
    );
  }

  if (!classJoined) {
    return (
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
        onJoinClass={handleJoinClass}
        onBack={() => router.push("/child-dashboard")}
        lessonTitle={lessonTitle}
      />
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between px-4 md:px-6 pt-4 pb-2 flex-shrink-0">
        <Link
          href="/child-dashboard"
          className="text-white/50 hover:text-white text-sm flex items-center gap-1.5"
          style={inter}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Progress
        </Link>
        <div className="hidden md:block">
          <ChildUserDropdown />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row flex-1 min-h-0 px-4 md:px-6 pb-4 gap-3 lg:gap-4">
        <div className="flex-1 min-w-0 flex flex-col gap-3 min-h-0">
          <ClassLessonHeader
            moduleLabel={isLoading ? "Loading…" : moduleLabel}
            lessonTitle={isLoading ? "Starting class…" : lessonTitle}
            subtitle={subtitle}
            currentPhase={currentPhase}
            quickCheckLabel={currentPhase === "quick_check" ? "Quick Check now" : "Quick Check coming up"}
          />

          <div className="flex-1 min-h-0 relative flex flex-col gap-2 overflow-hidden">
            {currentStep && (
              <div className="flex-1 min-h-0 relative overflow-hidden">
                <ClassBlackboard
                  step={currentStep}
                  reveal={reveal}
                  isNarrating={isNarrating || isGreeting}
                  greeting={
                    isGreeting || !greetingDone
                      ? { studentName, inProgress: isGreeting }
                      : undefined
                  }
                  interaction={currentStep.interaction}
                  selectedOptionId={selectedOptionId}
                  answeredCorrectly={answeredCorrectly}
                  onSelectOption={handleBlackboardSelect}
                  onSubmitWordLadder={handleWordLadderSubmit}
                />
                <ClassChildVideo
                  stream={stream}
                  cameraEnabled={cameraEnabled}
                  micEnabled={micEnabled}
                  onEnableMedia={() => void startMedia()}
                />
              </div>
            )}

            {activeCaption && (
              <div
                className="shrink-0 rounded-[10px] px-4 py-2.5 border border-[#00CED1]/20"
                style={{ backgroundColor: "rgba(0,206,209,0.08)" }}
              >
                <p style={{ ...inter, fontWeight: 500, fontSize: "13px", color: "rgba(255,255,255,0.85)", textAlign: "center" }}>
                  {activeCaption}
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 flex-wrap">
            <span className="text-xs text-white/40" style={inter}>
              {isGreeting
                ? "Calyx is greeting you…"
                : isNarrating
                  ? "Calyx is teaching…"
                  : reveal.interactionVisible
                    ? currentStep?.interaction?.type === "word_ladder"
                      ? "Drag words into order on the board"
                      : "Tap an answer on the board"
                    : "Listen and follow along"}
            </span>
            {session && (
              <span className="text-[11px] text-white/35" style={inter}>
                Session #{session.sessionId}
              </span>
            )}
          </div>

          <ClassMediaControls
            micEnabled={micEnabled}
            cameraEnabled={cameraEnabled}
            cameraLocked={classJoined}
            onToggleMic={toggleMic}
            onToggleCamera={() => toggleCamera({ lockWhenOn: classJoined })}
            onEndCall={handleEndCall}
          />
        </div>

        <ClassTextChat
          messages={messages}
          isTyping={isTyping}
          onSend={sendMessage}
          showQuickCheck={false}
        />
      </div>

      {classScore && (
        <ClassScoreSummary
          scoreCorrect={classScore.scoreCorrect}
          scoreTotal={classScore.scoreTotal}
          lessonTitle={lessonTitle}
          passed={classScore.passed}
          passThreshold={classScore.passThreshold}
          onContinue={handleEndCall}
          onRetake={async () => {
            stopSpeaking();
            stopStream();
            try {
              await navigateToChildClass(router, true);
            } catch {
              router.push("/child-dashboard");
            }
          }}
        />
      )}
    </div>
  );
}
