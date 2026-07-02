"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ChildUserDropdown from "@/components/child/ChildUserDropdown";
import ClassBlackboard from "@/components/child/class/ClassBlackboard";
import ClassChildVideo from "@/components/child/class/ClassChildVideo";
import ClassLessonHeader from "@/components/child/class/ClassLessonHeader";
import ClassMediaControls from "@/components/child/class/ClassMediaControls";
import ClassMediaSetupGate from "@/components/child/class/ClassMediaSetupGate";
import ClassTextChat from "@/components/child/class/ClassTextChat";
import { useBlackboardNarration } from "@/hooks/use-blackboard-narration";
import { useAiSettings } from "@/hooks/use-ai-settings";
import { useClassChat } from "@/hooks/use-class-chat";
import { useClassMedia } from "@/hooks/use-class-media";
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis";
import {
  getBlackboardSteps,
  phaseForStepIndex,
  type ClassPhase,
} from "@/lib/class-lesson-content";
import type { ChildClassSession } from "@/lib/curriculum-api";

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
  const [ccEnabled, setCcEnabled] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [activeCaption, setActiveCaption] = useState<string | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<boolean | null>(null);
  const [chatInitialized, setChatInitialized] = useState(false);

  const lessonTitle = session?.lessonTitle ?? "Live Class";
  const moduleLabel = session ? `Lesson ${session.lessonOrder}` : "Class";
  const subtitle = session
    ? `${session.curriculumTitle} · ${session.subject} · ${session.gradeLevel}`
    : undefined;

  const blackboardSteps = useMemo(
    () => getBlackboardSteps(session?.lessonTitle),
    [session?.lessonTitle],
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

  const { speak, stop: stopSpeaking } = useSpeechSynthesis(aiSettings.voice, "child");

  const handleCaption = useCallback((text: string) => {
    setActiveCaption(text);
  }, []);

  const handleCalyxSpeak = useCallback(
    (text: string) => {
      setActiveCaption(text);
      if (voiceEnabled) {
        void speak(text);
      }
    },
    [speak, voiceEnabled],
  );

  const advanceStep = useCallback(() => {
    setSelectedOptionId(null);
    setAnsweredCorrectly(null);
    setStepIndex((prev) => Math.min(prev + 1, blackboardSteps.length - 1));
  }, [blackboardSteps.length]);

  const handleNarrationComplete = useCallback(() => {
    if (!currentStep?.interaction && stepIndex < blackboardSteps.length - 1) {
      window.setTimeout(() => advanceStep(), 1200);
    }
  }, [currentStep?.interaction, stepIndex, blackboardSteps.length, advanceStep]);

  const { reveal, isNarrating } = useBlackboardNarration({
    step: currentStep,
    enabled: classJoined && !!session,
    voiceEnabled,
    speak,
    onCaption: handleCaption,
    onNarrationComplete: handleNarrationComplete,
    pacing: aiSettings.pacing,
  });

  const { messages, isTyping, sendMessage, initializeChat, pushCalyxMessage } = useClassChat({
    lessonTitle,
    stepTitle: currentStep?.title,
    onCalyxSpeak: handleCalyxSpeak,
    voiceEnabled,
  });

  useEffect(() => {
    if (classJoined && session && !chatInitialized) {
      initializeChat();
      setChatInitialized(true);
    }
  }, [classJoined, session, chatInitialized, initializeChat]);

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

  const handleBlackboardSelect = (optionId: string) => {
    const interaction = currentStep?.interaction;
    if (!interaction || selectedOptionId) return;

    const option = interaction.options.find((o) => o.id === optionId);
    const isCorrect = option?.correct === true;
    setSelectedOptionId(optionId);
    setAnsweredCorrectly(isCorrect);

    const feedback = isCorrect
      ? `Yes! ${option?.label} is the strongest. Great work!`
      : `Not quite — look for the word with the most energy. Try thinking about the volume knob turned all the way up.`;

    setTimeout(() => {
      pushCalyxMessage(feedback);
      if (isCorrect && stepIndex < blackboardSteps.length - 1) {
        setTimeout(() => advanceStep(), 2000);
      } else if (!isCorrect) {
        setTimeout(() => {
          setSelectedOptionId(null);
          setAnsweredCorrectly(null);
        }, 2500);
      }
    }, 600);
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

          <div className="flex-1 min-h-[300px] relative flex flex-col gap-2">
            {currentStep && (
              <div className="flex-1 min-h-0 relative">
                <ClassBlackboard
                  step={currentStep}
                  reveal={reveal}
                  isNarrating={isNarrating}
                  interaction={currentStep.interaction}
                  selectedOptionId={selectedOptionId}
                  answeredCorrectly={answeredCorrectly}
                  onSelectOption={handleBlackboardSelect}
                />
                <ClassChildVideo
                  stream={stream}
                  cameraEnabled={cameraEnabled}
                  micEnabled={micEnabled}
                  onEnableMedia={() => void startMedia()}
                />
              </div>
            )}

            {ccEnabled && activeCaption && (
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
              {isNarrating ? "Calyx is teaching…" : reveal.interactionVisible ? "Tap an answer on the board" : "Listen and follow along"}
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
            ccEnabled={ccEnabled}
            voiceEnabled={voiceEnabled}
            onToggleMic={toggleMic}
            onToggleCamera={toggleCamera}
            onToggleCc={() => setCcEnabled((prev) => !prev)}
            onToggleVoice={() => {
              setVoiceEnabled((prev) => {
                if (prev) stopSpeaking();
                return !prev;
              });
            }}
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
    </div>
  );
}
