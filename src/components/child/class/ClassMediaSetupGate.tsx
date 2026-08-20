"use client";

import { useEffect, useRef } from "react";
import { useChildAuthStore } from "@/stores/child-auth.store";
import FaceTrackingOverlay from "@/components/child/class/FaceTrackingOverlay";
import { useClassFaceMonitor } from "@/hooks/use-class-face-monitor";
import { faceFrameColor } from "@/lib/face-monitor/face-box";
import type { ClassMediaError } from "@/lib/class-media-request";
import type { HeygenAgentStatus } from "@/hooks/use-heygen-agent";

const inter = { fontFamily: "Inter, sans-serif" } as const;

type ClassMediaSetupGateProps = {
  stream: MediaStream | null;
  isRequesting: boolean;
  permissionError: ClassMediaError | null;
  permissionHint: string | null;
  hasActiveMedia: boolean;
  canJoinClass: boolean;
  hasVideo: boolean;
  hasAudio: boolean;
  onEnableMedia: () => void | Promise<void>;
  onJoinClass: () => void;
  onBack: () => void;
  /** Hide the "Join" primary action (used for Bloom Buddy overlay screen). */
  showJoinButton?: boolean;
  /** Hide the "Turn on camera" primary action. */
  showTurnOnCameraButton?: boolean;
  /** Hide the "Back to Pathway" secondary action. */
  showBackButton?: boolean;
  lessonTitle?: string;
  isRetake?: boolean;
  instructorName?: string;
  /** LiveAvatar warm-up status while on the camera gate (null = avatar off). */
  avatarStatus?: HeygenAgentStatus | null;
  avatarError?: string | null;
  /** Optional loader badge shown above preview card. */
  loadingLessonLabel?: string | null;
};

function positioningHint(status: ReturnType<typeof useClassFaceMonitor>["status"]): string {
  if (!status.ready) return "Loading face tracking…";
  if (!status.facePresent) return "Move into view so your face appears in the frame";
  if (status.engagement === "away") return "Look at the screen — center your face in the green box";
  return "Great! You're in position — join when ready";
}

function avatarWarmHint(
  status: HeygenAgentStatus | null | undefined,
  instructorName: string,
  errorMessage?: string | null,
): { text: string; tone: "warm" | "ready" | "error" } | null {
  if (!status || status === "disabled") return null;
  if (status === "connected") {
    return { text: `${instructorName} is ready`, tone: "ready" };
  }
  if (status === "error" || status === "disconnected") {
    return {
      text: errorMessage?.trim() || `${instructorName} unavailable — class can still use voice`,
      tone: "error",
    };
  }
  return { text: `Warming up ${instructorName}’s voice…`, tone: "warm" };
}

export default function ClassMediaSetupGate({
  stream,
  isRequesting,
  permissionError,
  permissionHint,
  hasActiveMedia,
  canJoinClass,
  hasVideo,
  hasAudio,
  onEnableMedia,
  onJoinClass,
  onBack,
  showJoinButton = true,
  showTurnOnCameraButton = true,
  showBackButton = true,
  lessonTitle = "your class",
  isRetake = false,
  instructorName = "AI Instructor",
  avatarStatus = null,
  avatarError = null,
  loadingLessonLabel = null,
}: ClassMediaSetupGateProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const child = useChildAuthStore((state) => state.child);
  const displayName = child?.userName?.trim() || "Student";

  const showPreview = !!stream && (hasVideo || hasAudio);
  const { status: faceStatus } = useClassFaceMonitor(videoRef, {
    enabled: showPreview && hasVideo,
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.srcObject = stream;
    if (stream) {
      void video.play().catch(() => {
        // Autoplay may need user gesture; preview is on same screen after click.
      });
    }
  }, [stream]);

  const hint = showPreview && hasVideo ? positioningHint(faceStatus) : null;
  const hintColor = showPreview && hasVideo ? faceFrameColor(faceStatus) : undefined;
  const avatarHint = avatarWarmHint(avatarStatus, instructorName, avatarError);

  return (
    <div className="flex flex-col items-center justify-center h-full px-3 py-4 sm:px-4 sm:py-8">
      <div
        className="w-full max-w-lg rounded-2xl p-4 sm:p-6 md:p-8 border border-white/10 max-h-[100dvh] overflow-y-hidden sm:max-h-none sm:overflow-y-visible"
        style={{ backgroundColor: "#313044" }}
      >
        <div className="text-center mb-4 sm:mb-6">
          <div
            className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl mx-auto mb-3 sm:mb-4 flex items-center justify-center"
            style={{ backgroundColor: "rgba(0,206,209,0.15)" }}
          >
            <svg className="w-5 h-5 sm:w-7 sm:h-7" viewBox="0 0 24 24" fill="none" stroke="#00CED1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 7l-7 5 7 5V7z" />
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
            </svg>
          </div>
          <h2 className="text-lg sm:text-[22px]" style={{ ...inter, fontWeight: 700, color: "#FFFFFF" }}>
            {isRetake ? "Get ready to strengthen this skill" : "Get ready for class"}
          </h2>
          <p className="text-[13px] sm:text-sm mt-1.5 sm:mt-2" style={{ ...inter, fontWeight: 400, color: "rgba(255,255,255,0.55)" }}>
            {isRetake
              ? `${instructorName} prepared a new picture and new examples for ${lessonTitle}. Turn on your camera before joining.`
              : `Turn on your camera before joining ${lessonTitle}. You can ask questions with the mic after class starts.`}
          </p>
        </div>

        {isRequesting && (
          <div
            className="rounded-[10px] px-3 py-2.5 mb-4 text-xs text-[#00CED1] border border-[#00CED1]/30"
            style={{ backgroundColor: "rgba(0,206,209,0.08)", ...inter }}
          >
            <strong>Check your browser</strong> — allow <strong>Camera</strong> when prompted.
          </div>
        )}

        {(permissionHint || permissionError) && !isRequesting && (
          <div
            className={`rounded-[10px] px-3 py-2.5 mb-4 text-xs border ${permissionError ? "text-[#FFC542] border-[#FFC542]/30" : "text-[#00CED1] border-[#00CED1]/30"}`}
            style={{
              backgroundColor: permissionError
                ? "rgba(255,197,66,0.12)"
                : "rgba(0,206,209,0.08)",
              ...inter,
            }}
          >
            {permissionError ? (
              <>
                <p className="font-semibold mb-1">{permissionError.message}</p>
                <p className="text-white/60 leading-relaxed">{permissionError.guidance}</p>
              </>
            ) : (
              <p>{permissionHint}</p>
            )}
          </div>
        )}

        {avatarHint && (
          <div
            className={
              "rounded-[10px] px-3 py-2.5 mb-4 text-xs border " +
              (avatarHint.tone === "error"
                ? "text-[#FFC542] border-[#FFC542]/30"
                : avatarHint.tone === "ready"
                  ? "text-[#60D624] border-[#60D624]/30"
                  : "text-[#00CED1] border-[#00CED1]/30")
            }
            style={{
              backgroundColor:
                avatarHint.tone === "error"
                  ? "rgba(255,197,66,0.12)"
                  : avatarHint.tone === "ready"
                    ? "rgba(96,214,36,0.1)"
                    : "rgba(0,206,209,0.08)",
              ...inter,
            }}
          >
            {avatarHint.text}
          </div>
        )}

        {loadingLessonLabel ? (
          <div className="mb-3 sm:mb-4 flex justify-center pointer-events-none">
            <div className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-[#111023]/70 px-4 py-2.5 text-white/70 sm:gap-3 sm:px-5 sm:py-3">
              <span className="inline-block h-2 w-2 rounded-full bg-[#00CED1] animate-pulse" />
              <span>{loadingLessonLabel}</span>
            </div>
          </div>
        ) : null}

        <div
          ref={containerRef}
          className="relative aspect-video rounded-xl sm:rounded-[14px] overflow-hidden mb-2 sm:mb-3 border-2"
          style={{
            borderColor: showPreview ? "#00CED1" : "#525162",
            backgroundColor: "#1a1830",
          }}
        >
          {showPreview && hasVideo ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
                style={{ transform: "scaleX(-1)" }}
              />
              <FaceTrackingOverlay
                videoRef={videoRef}
                containerRef={containerRef}
                status={faceStatus}
                mirrored
                strokeWidth={3}
              />
            </>
          ) : showPreview && hasAudio && !hasVideo ? (
            <div className="w-full h-full flex flex-col items-center justify-center gap-3 px-4">
              <p className="text-[#FFC542] text-sm text-center" style={inter}>
                No camera detected. A camera is required to join class.
              </p>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-3 px-4">
              <div className="w-16 h-16 rounded-full bg-[#525162] flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <p className="text-white/40 text-sm text-center" style={inter}>
                Camera preview will appear here after you allow access
              </p>
            </div>
          )}

          {showPreview && (
            <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-black/50 px-3 py-1.5 z-20">
              <span className="w-2 h-2 rounded-full bg-[#00CED1] animate-pulse" />
              <span style={{ ...inter, fontSize: "11px", color: "#FFFFFF" }}>{displayName}</span>
            </div>
          )}
        </div>

        {hint && (
          <p
            className="text-center text-xs font-medium mb-4 transition-colors duration-300"
            style={{ ...inter, color: hintColor }}
          >
            {hint}
          </p>
        )}

        <div className="flex flex-col gap-3">
          {!canJoinClass ? (
            showTurnOnCameraButton ? (
              <button
                type="button"
                onClick={() => void onEnableMedia()}
                disabled={isRequesting}
                className="w-full py-3.5 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90 disabled:opacity-60"
                style={{ backgroundColor: "#00CED1", color: "#111023", ...inter }}
              >
                {isRequesting
                  ? "Waiting for browser permission…"
                  : permissionError
                    ? "Try again"
                    : "Turn on camera"}
              </button>
            ) : null
          ) : (
            showJoinButton ? (
              <button
                type="button"
                onClick={onJoinClass}
                className="w-full py-3.5 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#00CED1", color: "#111023", ...inter }}
              >
                Join class
              </button>
            ) : null
          )}

          {showBackButton ? (
            <button
              type="button"
              onClick={onBack}
              className="w-full py-3 rounded-xl text-sm text-white/50 hover:text-white/80"
              style={inter}
            >
              Back to Pathway
            </button>
          ) : null}
        </div>

        <p className="text-center text-[10px] sm:text-[11px] text-white/30 mt-3 sm:mt-5 leading-relaxed" style={inter}>
          If no popup appears, click the lock icon left of the address bar and set Camera to Allow.
        </p>
      </div>
    </div>
  );
}
