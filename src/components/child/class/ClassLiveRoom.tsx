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
import { useClassSessionClock } from "@/hooks/use-class-session-clock";
import { useAiSettings } from "@/hooks/use-ai-settings";
import { useClassChat } from "@/hooks/use-class-chat";
import { useClassMedia } from "@/hooks/use-class-media";
import { useInstructorSpeech } from "@/hooks/use-instructor-speech";
import ClassLiveAvatar from "@/components/child/class/ClassLiveAvatar";
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
import { buildClassGreeting, buildRetakeClassGreeting } from "@/lib/calyx-class-chat";
import { delay } from "@/lib/tts-word-sync";
import { navigateToChildClass, navigateAfterChildClass } from "@/lib/start-child-class";
import { computeTeachUntilMinute } from "@/lib/class-duration";
import { FACE_MONITOR_DEFAULTS, type FaceMonitorStatus } from "@/lib/face-monitor/types";

const inter = { fontFamily: "Inter, sans-serif" } as const;
const NOOP_CAPTION = () => undefined;

type ClassLiveRoomProps = {
  session: ChildClassSession | null;
  isLoading: boolean;
  loadError: string | null;
};

export default function ClassLiveRoom({ session, isLoading, loadError }: ClassLiveRoomProps) {
  const router = useRouter();
  const [classJoined, setClassJoined] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<boolean | null>(null);
  const [answerLocked, setAnswerLocked] = useState(false);
  const [classScore, setClassScore] = useState<ClassSessionScore | null>(null);
  const [retakeBlocked, setRetakeBlocked] = useState(false);
  const [chatInitialized, setChatInitialized] = useState(false);
  const [greetingDone, setGreetingDone] = useState(false);
  const [isGreeting, setIsGreeting] = useState(false);
  const [faceStatus, setFaceStatus] = useState<FaceMonitorStatus | null>(null);
  const greetingStartedRef = useRef(false);
  const stepIndexRef = useRef(stepIndex);

  const child = useChildAuthStore((state) => state.child);
  const studentName = child?.userName?.trim() || "Student";

  useEffect(() => {
    stepIndexRef.current = stepIndex;
  }, [stepIndex]);

  const lessonTitle = session?.lessonTitle ?? "Live Class";
  const isRetake = session?.isRetake ?? false;
  const moduleLabel = session
    ? isRetake
      ? `Retake · Lesson ${session.lessonOrder}`
      : `Lesson ${session.lessonOrder}`
    : "Class";
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
  const firstAssessmentStepIndex = useMemo(
    () => blackboardSteps.findIndex((step) => step.phase === "quick_check"),
    [blackboardSteps],
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

  const faceMissingLong =
    faceStatus != null &&
    faceStatus.faceMissingSeconds * 1000 >= FACE_MONITOR_DEFAULTS.missingThresholdMs;
  const showLookAtScreenNudge =
    classJoined &&
    cameraEnabled &&
    faceStatus?.ready &&
    faceStatus.facePresent &&
    faceStatus.engagement === "away";
  const showStayInViewNudge = classJoined && cameraEnabled && faceMissingLong;

  const { settings: aiSettings } = useAiSettings("child");
  const instructorName = aiSettings.instructor?.name?.trim() || "AI Instructor";
  const totalClassMinutes = aiSettings.pacing.classDurationMinutes ?? 15;
  const teachUntilMinute = computeTeachUntilMinute(totalClassMinutes);

  const sessionClock = useClassSessionClock({
    active: classJoined && greetingDone && !classScore,
    totalMinutes: totalClassMinutes,
    teachUntilMinute,
  });

  const avatarRequested = Boolean(
    aiSettings.avatar?.provider !== "none" && aiSettings.avatar?.enabled,
  );
  // Prefetch LiveAvatar on the camera gate so Join Class is warm (not cold on blackboard).
  const liveAvatarConfig = useMemo(() => {
    if (!avatarRequested) return null;
    return {
      enabled: true,
      provider: aiSettings.avatar?.provider ?? "none",
      heygenAvatarId: aiSettings.avatar?.heygenAvatarId ?? "",
      heygenVoiceId: aiSettings.avatar?.heygenVoiceId ?? "",
    };
  }, [
    avatarRequested,
    aiSettings.avatar?.provider,
    aiSettings.avatar?.heygenAvatarId,
    aiSettings.avatar?.heygenVoiceId,
  ]);

  const {
    speak,
    speakProgress,
    stop: stopSpeaking,
    avatar: liveAvatar,
  } = useInstructorSpeech(aiSettings.voice, liveAvatarConfig, "child");

  const avatarReady =
    !avatarRequested || !liveAvatar || liveAvatar.isReady || Boolean(liveAvatar.errorMessage);

  const handleCalyxSpeak = useCallback(
    (text: string) => {
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
      setRetakeBlocked(!score.passed && (session.attemptNumber ?? 1) >= 3);
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

  const finishClassRef = useRef(finishClass);
  useEffect(() => {
    finishClassRef.current = finishClass;
  }, [finishClass]);

  useEffect(() => {
    if (!sessionClock.isTeachWindowOver || classScore) return;
    if (firstAssessmentStepIndex < 0) return;
    if (stepIndexRef.current >= firstAssessmentStepIndex) return;

    stopSpeaking();
    setSelectedOptionId(null);
    setAnsweredCorrectly(null);
    setAnswerLocked(false);
    setStepIndex(firstAssessmentStepIndex);
  }, [sessionClock.isTeachWindowOver, firstAssessmentStepIndex, classScore, stopSpeaking]);

  useEffect(() => {
    if (!sessionClock.isClassTimeOver || classScore) return;
    stopSpeaking();
    void finishClassRef.current();
  }, [sessionClock.isClassTimeOver, classScore, stopSpeaking]);

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
    enabled: classJoined && !!session && greetingDone && avatarReady,
    voiceEnabled: true,
    speakProgress,
    onCaption: NOOP_CAPTION,
    onNarrationComplete: handleNarrationComplete,
    // Child lesson pace: breath between lines without making class feel stuck.
    pacing: {
      ...aiSettings.pacing,
      pauseMs: Math.max(aiSettings.pacing?.pauseMs ?? 700, 650),
      wordMs: Math.max(aiSettings.pacing?.wordMs ?? 80, 75),
    },
  });

  const interactionActive = Boolean(reveal.interactionVisible && currentStep?.interaction);

  const { messages, isTyping, sendMessage, pushCalyxMessage } = useClassChat({
    lessonTitle,
    stepTitle: currentStep?.title,
    instructorName,
    onCalyxSpeak: handleCalyxSpeak,
    voiceEnabled: true,
  });

  useEffect(() => {
    if (!classJoined || !session || greetingStartedRef.current) return;
    if (avatarRequested && liveAvatar && !liveAvatar.isReady && !liveAvatar.errorMessage) return;
    greetingStartedRef.current = true;

    async function runGreeting() {
      if (!session) return;
      setIsGreeting(true);
      const greeting = session.isRetake
        ? buildRetakeClassGreeting(studentName, lessonTitle, session.calyxIntro)
        : buildClassGreeting(studentName, lessonTitle, instructorName);
      try {
        await speakProgress(greeting, {
          wordMs: aiSettings.pacing.wordMs,
        });
      } catch {
        // Greeting speak failed — still continue into the lesson.
      }
      if (!chatInitialized) {
        pushCalyxMessage(greeting, { speak: false });
        setChatInitialized(true);
      }
      setIsGreeting(false);
      setGreetingDone(true);
    }

    void runGreeting();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once when class is ready for greeting
  }, [
    classJoined,
    session?.sessionId,
    avatarRequested,
    liveAvatar?.isReady,
    liveAvatar?.errorMessage,
  ]);

  useEffect(() => {
    return () => stopStream();
  }, [stopStream]);

  const handleJoinClass = () => {
    if (!canJoinClass) return;
    setClassJoined(true);
  };

  const handleEndCall = () => {
    greetingStartedRef.current = false;
    // Never block hang-up on avatar/TTS teardown.
    try {
      stopSpeaking();
    } catch {
      // ignore
    }
    try {
      stopStream();
    } catch {
      // ignore
    }
    void navigateAfterChildClass(router);
  };

  const advanceAfterFeedback = useCallback(
    async (feedback: string, answeredStepIndex: number) => {
      pushCalyxMessage(feedback, { speak: false });
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

  const handleBlackboardSelect = async (optionId: string) => {
    const interaction = currentStep?.interaction;
    if (!interaction || selectedOptionId || answerLocked || !session || !currentStep) return;

    const option = interaction.options.find((o) => o.id === optionId);
    if (!option) return;

    const isCorrect = option.correct === true;
    const answeredStepIndex = stepIndexRef.current;

    setAnswerLocked(true);
    setSelectedOptionId(optionId);
    setAnsweredCorrectly(isCorrect);

    try {
      await submitClassAnswer(session.sessionId, {
        stepId: currentStep.id,
        interactionId: interaction.id,
        optionId: option.id,
        optionLabel: option.label,
        isCorrect,
      });
    } catch {
      // Keep local flow even if persistence fails temporarily.
    }

    const feedback = isCorrect
      ? `Yes! ${option.label} is the strongest. Great work!`
      : `You picked ${option.label}. Let's move on to the next part.`;

    void advanceAfterFeedback(feedback, answeredStepIndex);
  };

  const handleWordLadderSubmit = async (orderedIds: string[]) => {
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

    try {
      await submitClassAnswer(session.sessionId, {
        stepId: currentStep.id,
        interactionId: interaction.id,
        optionId: "word-ladder-order",
        optionLabel: labels.join(" → "),
        isCorrect,
      });
    } catch {
      // Keep local flow even if persistence fails temporarily.
    }

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
          Back to Pathway
        </Link>
      </div>
    );
  }

  if (!classJoined) {
    return (
      <>
        {/* Keep stream attached while warming on the camera gate. */}
        {avatarRequested && liveAvatar ? (
          <video
            ref={liveAvatar.videoRef}
            autoPlay
            playsInline
            muted
            className="pointer-events-none fixed h-px w-px opacity-0"
            aria-hidden
          />
        ) : null}
        <ClassMediaSetupGate
          stream={stream}
          isRequesting={isRequesting}
          permissionError={permissionError}
          permissionHint={permissionHint}
          hasActiveMedia={hasActiveMedia}
          canJoinClass={canJoinClass}
          hasVideo={hasVideo}
          hasAudio={hasAudio}
          instructorName={instructorName}
          avatarStatus={avatarRequested ? liveAvatar?.status ?? "connecting" : null}
          avatarError={liveAvatar?.errorMessage ?? null}
          onEnableMedia={() => void startMedia()}
          onJoinClass={handleJoinClass}
          onBack={() => router.push("/child-dashboard")}
          lessonTitle={lessonTitle}
          isRetake={isRetake}
        />
      </>
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
          Pathway
        </Link>
        <div className="hidden md:block">
          <ChildUserDropdown />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row flex-1 min-h-0 px-3 md:px-5 pb-2 gap-2 lg:gap-3">
        <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-2">
          <ClassLessonHeader
            moduleLabel={isLoading ? "Loading…" : moduleLabel}
            lessonTitle={isLoading ? "Starting class…" : lessonTitle}
            subtitle={subtitle}
            currentPhase={currentPhase}
            quickCheckLabel={currentPhase === "quick_check" ? "Quick Check now" : "Quick Check coming up"}
            sessionTimer={
              classJoined && greetingDone && !classScore
                ? {
                    elapsedLabel: sessionClock.elapsedLabel,
                    phaseLabel: sessionClock.phaseLabel,
                    phaseRemainingLabel: sessionClock.phaseRemainingLabel,
                    totalMinutes: totalClassMinutes,
                    teachUntilMinute,
                  }
                : undefined
            }
          />

          {/* Blackboard fills all remaining height — no page footer under it. */}
          <div className="relative min-h-0 flex-1 overflow-hidden rounded-[16px]">
            {currentStep ? (
              <div className="absolute inset-0">
                <ClassBlackboard
                  step={currentStep}
                  reveal={reveal}
                  isNarrating={isNarrating || isGreeting}
                  instructorName={instructorName}
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
                  avatarPresent={Boolean(liveAvatar?.enabled)}
                  avatarCompact={interactionActive}
                />
                {liveAvatar?.enabled ? (
                  <ClassLiveAvatar
                    instructorName={instructorName}
                    status={liveAvatar.status}
                    speaking={liveAvatar.speaking}
                    errorMessage={liveAvatar.errorMessage}
                    videoRef={liveAvatar.videoRef}
                    variant="stage"
                    compact={interactionActive}
                    controls={
                      <ClassMediaControls
                        variant="overlay"
                        micEnabled={micEnabled}
                        cameraEnabled={cameraEnabled}
                        cameraLocked={classJoined}
                        onToggleMic={toggleMic}
                        onToggleCamera={() => toggleCamera({ lockWhenOn: classJoined })}
                        onEndCall={handleEndCall}
                      />
                    }
                    childCamera={
                      <ClassChildVideo
                        stream={stream}
                        cameraEnabled={cameraEnabled}
                        micEnabled={micEnabled}
                        onEnableMedia={() => void startMedia()}
                        faceMonitorEnabled={classJoined && cameraEnabled}
                        onFaceStatusChange={setFaceStatus}
                        variant="avatarDock"
                      />
                    }
                  />
                ) : (
                  <>
                    <div className="absolute bottom-3 left-1/2 z-30 -translate-x-1/2">
                      <ClassMediaControls
                        variant="overlay"
                        micEnabled={micEnabled}
                        cameraEnabled={cameraEnabled}
                        cameraLocked={classJoined}
                        onToggleMic={toggleMic}
                        onToggleCamera={() => toggleCamera({ lockWhenOn: classJoined })}
                        onEndCall={handleEndCall}
                      />
                    </div>
                    <ClassChildVideo
                      stream={stream}
                      cameraEnabled={cameraEnabled}
                      micEnabled={micEnabled}
                      onEnableMedia={() => void startMedia()}
                      faceMonitorEnabled={classJoined && cameraEnabled}
                      onFaceStatusChange={setFaceStatus}
                      variant="pip"
                      dock="bottom"
                    />
                  </>
                )}

                {showStayInViewNudge && (
                  <div
                    className="absolute top-3 left-3 right-[48%] z-30 rounded-[10px] border border-[#FF7B7B]/40 px-3 py-2"
                    style={{ backgroundColor: "rgba(255,123,123,0.15)" }}
                  >
                    <p className="text-xs font-medium text-[#FF7B7B]" style={inter}>
                      Please stay in view of your camera so {instructorName} can see you.
                    </p>
                  </div>
                )}

                {!showStayInViewNudge && showLookAtScreenNudge && (
                  <div
                    className="absolute top-3 left-3 right-[48%] z-30 rounded-[10px] border border-[#FBBF24]/30 px-3 py-2"
                    style={{ backgroundColor: "rgba(251,191,36,0.12)" }}
                  >
                    <p className="text-xs font-medium text-[#FBBF24]" style={inter}>
                      Look at the screen to stay focused.
                    </p>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>

        <ClassTextChat
          messages={messages}
          isTyping={isTyping}
          instructorName={instructorName}
          onSend={sendMessage}
          showQuickCheck={false}
        />
      </div>

      {classScore && (
        <ClassScoreSummary
          scoreCorrect={classScore.scoreCorrect}
          scoreTotal={classScore.scoreTotal}
          lessonTitle={lessonTitle}
          instructorName={instructorName}
          passed={classScore.passed}
          passThreshold={classScore.passThreshold}
          wayfinderBlocked={retakeBlocked}
          onContinue={handleEndCall}
          onRetake={async () => {
            stopSpeaking();
            stopStream();
            try {
              await navigateToChildClass(router, true);
            } catch (error) {
              const message = error instanceof Error ? error.message : "";
              if (message.toLowerCase().includes("wayfinder")) {
                setRetakeBlocked(true);
              } else {
                router.push("/child-dashboard");
              }
            }
          }}
        />
      )}
    </div>
  );
}
