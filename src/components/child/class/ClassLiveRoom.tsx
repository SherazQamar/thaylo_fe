"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
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
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import ClassLiveAvatar from "@/components/child/class/ClassLiveAvatar";
import {
  phaseForStepIndex,
  type ClassPhase,
} from "@/lib/class-lesson-content";
import { buildBlackboardSteps } from "@/lib/class-lesson-builder";
import {
  completeClassSession,
  fetchChildClassSession,
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
  const [chatOpen, setChatOpen] = useState(false);
  const [greetingDone, setGreetingDone] = useState(false);
  const [isGreeting, setIsGreeting] = useState(false);
  const [teachingPaused, setTeachingPaused] = useState(false);
  const [pushToTalkActive, setPushToTalkActive] = useState(false);
  const [pttStatus, setPttStatus] = useState<string | null>(null);
  const [faceStatus, setFaceStatus] = useState<FaceMonitorStatus | null>(null);
  const greetingStartedRef = useRef(false);
  const stepIndexRef = useRef(stepIndex);
  const pttBusyRef = useRef(false);

  const child = useChildAuthStore((state) => state.child);
  const studentName = child?.userName?.trim() || "Student";

  useEffect(() => {
    stepIndexRef.current = stepIndex;
  }, [stepIndex]);

  const [lessonTitleState, setLessonTitleState] = useState(
    session?.lessonTitle ?? "Live Class",
  );
  const [lessonScriptState, setLessonScriptState] = useState(
    session?.lessonScript ?? null,
  );

  useEffect(() => {
    setLessonTitleState(session?.lessonTitle ?? "Live Class");
    setLessonScriptState(session?.lessonScript ?? null);
  }, [session?.lessonTitle, session?.lessonScript]);

  const [lessonContentReady, setLessonContentReady] = useState(true);

  const lessonTitle = lessonTitleState;

  const isRetake = session?.isRetake ?? false;
  const moduleLabel = session
    ? isRetake
      ? `Retake · Lesson ${session.lessonOrder}`
      : `Lesson ${session.lessonOrder}`
    : "Class";
  const subtitle = session
    ? `${session.curriculumTitle} · ${session.subject} · ${session.gradeLevel}`
    : undefined;

  // Wait for verified interest personalization when pending — don't join on generic base.
  useEffect(() => {
    if (!session) return;
    const hasSegments = (session.lessonScript?.runtimePlan?.segments?.length ?? 0) > 0;
    const pending = session.interestPersonalizationPending === true;
    const alreadyPersonalized = !!(
      session.lessonScript?.runtimePlan as { interestPersonalized?: boolean } | null | undefined
    )?.interestPersonalized;
    setLessonContentReady(hasSegments && (!pending || alreadyPersonalized));
  }, [
    session?.sessionId,
    session?.interestPersonalizationPending,
    session?.lessonScript?.runtimePlan?.segments?.length,
    session?.lessonScript?.runtimePlan,
  ]);

  // Soft-upgrade: poll until interest-verified plan arrives (or timeout).
  useEffect(() => {
    if (!session || classJoined) return;
    const alreadyPersonalized = !!(
      session.lessonScript?.runtimePlan as { interestPersonalized?: boolean } | null | undefined
    )?.interestPersonalized;
    if (alreadyPersonalized && !session.interestPersonalizationPending) {
      setLessonContentReady(true);
      return;
    }

    let cancelled = false;
    let stopPolling = false;
    const startMs = Date.now();
    const shouldWaitForInterests =
      session.interestPersonalizationPending === true || !alreadyPersonalized;

    async function tick() {
      if (cancelled || stopPolling) return;
      try {
        const data = await fetchChildClassSession(session.sessionId);
        if (cancelled || stopPolling) return;

        const runtimePlan = data.lessonScript?.runtimePlan;
        const segmentsLen = runtimePlan?.segments?.length ?? 0;
        const interestPersonalized = !!(
          runtimePlan as { interestPersonalized?: boolean } | null | undefined
        )?.interestPersonalized;
        const stillPending = data.interestPersonalizationPending === true;

        if (interestPersonalized || (!stillPending && segmentsLen > 0)) {
          setLessonTitleState(data.lessonTitle ?? data.lessonTitle);
          setLessonScriptState(data.lessonScript ?? null);
          setLessonContentReady(segmentsLen > 0);
          if (interestPersonalized || !stillPending) {
            stopPolling = true;
          }
          return;
        }

        if (segmentsLen > 0 && !shouldWaitForInterests) {
          setLessonContentReady(true);
        }

        // Give interest AI time; then allow join with best available plan.
        if (Date.now() - startMs > 75_000) {
          if (segmentsLen > 0 || (session.lessonScript?.runtimePlan?.segments?.length ?? 0) > 0) {
            setLessonTitleState(data.lessonTitle ?? session.lessonTitle);
            setLessonScriptState(data.lessonScript ?? session.lessonScript ?? null);
            setLessonContentReady(true);
          }
          stopPolling = true;
        }
      } catch {
        if (Date.now() - startMs > 30_000) {
          const hasSegments =
            (session.lessonScript?.runtimePlan?.segments?.length ?? 0) > 0;
          setLessonContentReady(hasSegments);
          stopPolling = true;
        }
      }
    }

    void tick();
    const t = window.setInterval(() => {
      if (stopPolling) {
        window.clearInterval(t);
        return;
      }
      void tick();
    }, 2500);

    return () => {
      cancelled = true;
      stopPolling = true;
      window.clearInterval(t);
    };
  }, [classJoined, session]);

  const blackboardSteps = useMemo(
    () =>
      buildBlackboardSteps({
        lessonTitle: lessonTitleState,
        lessonScript: lessonScriptState,
      }),
    [lessonTitleState, lessonScriptState],
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
    beginPushToTalk,
    endPushToTalk,
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
    async (text: string) => {
      await speak(text);
    },
    [speak],
  );

  const handleQuestionFlow = useCallback(
    (phase: "start" | "end") => {
      if (phase === "start") {
        setTeachingPaused(true);
        try {
          stopSpeaking();
        } catch {
          // ignore
        }
        return;
      }
      setTeachingPaused(false);
    },
    [stopSpeaking],
  );

  const {
    supported: speechSupported,
    listening: speechListening,
    displayTranscript,
    start: startSpeech,
    stop: stopSpeech,
    reset: resetSpeech,
    transcript,
  } = useSpeechRecognition();

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
    paused: teachingPaused,
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
    sessionId: session?.sessionId,
    lessonTitle,
    stepTitle: currentStep?.title,
    stepPhase: currentStep?.phase,
    boardLines: currentStep?.lines,
    instructorName,
    onCalyxSpeak: handleCalyxSpeak,
    voiceEnabled: true,
    onQuestionFlow: handleQuestionFlow,
  });

  const handlePushToTalkStart = useCallback(async () => {
    if (!classJoined || pttBusyRef.current || isTyping || isGreeting) return;
    const micOk = await beginPushToTalk();
    if (!micOk) {
      setPttStatus("Allow microphone to ask a question.");
      return;
    }
    setPushToTalkActive(true);
    setTeachingPaused(true);
    try {
      stopSpeaking();
    } catch {
      // ignore
    }
    resetSpeech();
    if (speechSupported) {
      startSpeech({ continuous: true });
      setPttStatus("Listening… ask about today's lesson");
    } else {
      setPttStatus("Voice input isn't supported here — use Text Mode.");
    }
  }, [
    beginPushToTalk,
    classJoined,
    isGreeting,
    isTyping,
    resetSpeech,
    speechSupported,
    startSpeech,
    stopSpeaking,
  ]);

  const handlePushToTalkEnd = useCallback(async () => {
    if (!pushToTalkActive && !speechListening) {
      endPushToTalk();
      return;
    }
    setPushToTalkActive(false);
    endPushToTalk();
    stopSpeech();

    const spoken = (transcript || displayTranscript).trim();
    resetSpeech();

    if (!spoken) {
      setPttStatus(null);
      setTeachingPaused(false);
      return;
    }

    pttBusyRef.current = true;
    setPttStatus("Thinking…");
    try {
      await sendMessage(spoken);
      setPttStatus(null);
    } catch {
      setPttStatus("Could not ask that — try again.");
      setTeachingPaused(false);
    } finally {
      pttBusyRef.current = false;
    }
  }, [
    displayTranscript,
    endPushToTalk,
    pushToTalkActive,
    resetSpeech,
    sendMessage,
    speechListening,
    stopSpeech,
    transcript,
  ]);

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
      ? (interaction.correctFeedback?.trim() ||
          `Yes! ${option.label} is a strong choice. Great work!`)
      : (interaction.incorrectFeedback?.trim() ||
          `You picked ${option.label}. Let's keep going — you've got this.`);

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
      ? (interaction.correctFeedback?.trim() ||
          "Perfect! You put the Word Ladder in the right order. Excellent work!")
      : (interaction.incorrectFeedback?.trim() ||
          "Good try on the Word Ladder. Let's keep practicing this skill.");

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
      <div className="relative h-full">
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
          showJoinButton={lessonContentReady}
          loadingLessonLabel={
            !lessonContentReady
              ? session?.interestPersonalizationPending
                ? "Personalizing lesson for your interests…"
                : "Loading new lesson..."
              : null
          }
        />
      </div>
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

      <div
        className={
          "flex flex-1 min-h-0 px-3 md:px-5 pb-2 " +
          (chatOpen ? "flex-col lg:flex-row gap-2 lg:gap-3" : "flex-col")
        }
      >
        <div className="flex min-h-0 min-w-0 w-full flex-1 flex-col gap-2">
          <ClassLessonHeader
            moduleLabel={isLoading ? "Loading…" : moduleLabel}
            lessonTitle={isLoading ? "Starting class…" : lessonTitle}
            subtitle={subtitle}
            currentPhase={currentPhase}
            quickCheckLabel={
              currentPhase === "quick_check"
                ? "Quick Check now"
                : "Quick Check coming up"
            }
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
            rightSlot={
              <ClassChildVideo
                stream={stream}
                cameraEnabled={cameraEnabled}
                micEnabled={micEnabled}
                onEnableMedia={() => void startMedia()}
                faceMonitorEnabled={classJoined && cameraEnabled}
                onFaceStatusChange={setFaceStatus}
                variant="header"
              />
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
                        pushToTalkActive={pushToTalkActive || speechListening}
                        onPushToTalkStart={() => {
                          void handlePushToTalkStart();
                        }}
                        onPushToTalkEnd={() => {
                          void handlePushToTalkEnd();
                        }}
                        onToggleCamera={() => toggleCamera({ lockWhenOn: classJoined })}
                        onEndCall={handleEndCall}
                      />
                    }
                  />
                ) : (
                  <div className="absolute bottom-3 left-1/2 z-30 -translate-x-1/2">
                    <ClassMediaControls
                      variant="overlay"
                      micEnabled={micEnabled}
                      cameraEnabled={cameraEnabled}
                      cameraLocked={classJoined}
                      pushToTalkActive={pushToTalkActive || speechListening}
                      onPushToTalkStart={() => {
                        void handlePushToTalkStart();
                      }}
                      onPushToTalkEnd={() => {
                        void handlePushToTalkEnd();
                      }}
                      onToggleCamera={() => toggleCamera({ lockWhenOn: classJoined })}
                      onEndCall={handleEndCall}
                    />
                  </div>
                )}

                {(pttStatus || (pushToTalkActive && displayTranscript)) && (
                  <div
                    className="absolute left-1/2 bottom-16 z-30 w-[min(92%,420px)] -translate-x-1/2 rounded-[10px] border border-[#00CED1]/35 px-3 py-2 shadow-lg"
                    style={{ backgroundColor: "rgba(17,16,35,0.92)" }}
                  >
                    <p className="text-center text-xs font-medium leading-snug text-[#00CED1]" style={inter}>
                      {pttStatus}
                      {pushToTalkActive && displayTranscript
                        ? `${pttStatus ? " · " : ""}${displayTranscript}`
                        : ""}
                    </p>
                  </div>
                )}

                {showStayInViewNudge && (
                  <div
                    className="absolute left-1/2 top-16 z-30 w-[min(92%,420px)] -translate-x-1/2 rounded-[10px] border border-[#FF7B7B]/40 px-3 py-2 shadow-lg md:top-[4.5rem]"
                    style={{ backgroundColor: "rgba(20,12,12,0.92)" }}
                  >
                    <p className="text-center text-xs font-medium leading-snug text-[#FF7B7B]" style={inter}>
                      Please stay in view of your camera so {instructorName} can see you.
                    </p>
                  </div>
                )}

                {!showStayInViewNudge && showLookAtScreenNudge && (
                  <div
                    className="absolute left-1/2 top-16 z-30 w-[min(92%,420px)] -translate-x-1/2 rounded-[10px] border border-[#FBBF24]/30 px-3 py-2 shadow-lg md:top-[4.5rem]"
                    style={{ backgroundColor: "rgba(20,16,8,0.92)" }}
                  >
                    <p className="text-center text-xs font-medium leading-snug text-[#FBBF24]" style={inter}>
                      Look at the screen to stay focused.
                    </p>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>

        {/* Floating chat toggle when minimized — board uses full width */}
        {!chatOpen && (
          <button
            type="button"
            onClick={() => setChatOpen(true)}
            className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95"
            style={{ backgroundColor: "#00CED1", color: "#111023" }}
            aria-label="Open chat"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
            {messages.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {messages.length > 9 ? "9+" : messages.length}
              </span>
            )}
          </button>
        )}

        {/* Chat panel only mounts when open so it never reserves blank space */}
        {chatOpen && (
          <div
            className="w-full lg:w-[320px] xl:w-[340px] flex-shrink-0 flex flex-col min-h-[420px] lg:min-h-0 lg:h-full"
          >
            <div
              className="flex h-full flex-col rounded-[16px] min-h-[420px] lg:min-h-0 lg:h-full"
              style={{ backgroundColor: "#1a1930", border: "1px solid rgba(255,255,255,0.05)" } as CSSProperties}
            >
              <div className="px-4 py-3 border-b border-white/5 flex-shrink-0 flex items-center justify-between">
                <h3 style={{ ...inter, fontWeight: 700, fontSize: "16px", color: "#FFFFFF" }}>Text Mode</h3>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#00CED1]" style={inter}>
                    {instructorName}
                  </span>
                  <button
                    type="button"
                    onClick={() => setChatOpen(false)}
                    className="ml-1 flex h-7 w-7 items-center justify-center rounded-lg transition-colors hover:bg-white/10"
                    aria-label="Minimize chat"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="4 14 10 14 10 20" />
                      <polyline points="20 10 14 10 14 4" />
                      <line x1="14" y1="10" x2="21" y2="3" />
                      <line x1="3" y1="21" x2="10" y2="14" />
                    </svg>
                  </button>
                </div>
              </div>

              <ClassTextChat
                messages={messages}
                isTyping={isTyping}
                instructorName={instructorName}
                onSend={sendMessage}
                showQuickCheck={false}
                hideChrome
              />
            </div>
          </div>
        )}
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
