"use client";

import { useEffect, useRef } from "react";
import { useChildAuthStore } from "@/stores/child-auth.store";
import type { ClassMediaError } from "@/lib/class-media-request";

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
  lessonTitle?: string;
};

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
  lessonTitle = "your class",
}: ClassMediaSetupGateProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const child = useChildAuthStore((state) => state.child);
  const displayName = child?.userName?.trim() || "Student";

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

  const showPreview = !!stream && (hasVideo || hasAudio);

  return (
    <div className="flex flex-col items-center justify-center h-full px-4 py-8">
      <div
        className="w-full max-w-lg rounded-[20px] p-6 md:p-8 border border-white/10"
        style={{ backgroundColor: "#313044" }}
      >
        <div className="text-center mb-6">
          <div
            className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
            style={{ backgroundColor: "rgba(0,206,209,0.15)" }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00CED1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 7l-7 5 7 5V7z" />
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
            </svg>
          </div>
          <h2 style={{ ...inter, fontWeight: 700, fontSize: "22px", color: "#FFFFFF" }}>
            Get ready for class
          </h2>
          <p style={{ ...inter, fontWeight: 400, fontSize: "14px", color: "rgba(255,255,255,0.55)", marginTop: "8px" }}>
            Turn on your camera and microphone before joining {lessonTitle}.
          </p>
        </div>

        {isRequesting && (
          <div
            className="rounded-[10px] px-3 py-2.5 mb-4 text-xs text-[#00CED1] border border-[#00CED1]/30"
            style={{ backgroundColor: "rgba(0,206,209,0.08)", ...inter }}
          >
            <strong>Check your browser</strong> — a permission popup should appear at the top of the window.
            Choose <strong>Allow</strong> for camera and microphone.
          </div>
        )}

        {(permissionHint || permissionError) && !isRequesting && (
          <div
            className="rounded-[10px] px-3 py-2.5 mb-4 text-xs text-[#FFC542]"
            style={{ backgroundColor: "rgba(255,197,66,0.12)", ...inter }}
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

        <div
          className="relative aspect-video rounded-[14px] overflow-hidden mb-5 border-2"
          style={{
            borderColor: showPreview ? "#00CED1" : "#525162",
            backgroundColor: "#1a1830",
          }}
        >
          {showPreview && hasVideo ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              style={{ transform: "scaleX(-1)" }}
            />
          ) : showPreview && hasAudio && !hasVideo ? (
            <div className="w-full h-full flex flex-col items-center justify-center gap-3 px-4">
              <div className="w-16 h-16 rounded-full bg-[#00CED1]/20 flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00CED1" strokeWidth="1.5">
                  <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
                  <path d="M19 10v2a7 7 0 01-14 0v-2" />
                </svg>
              </div>
              <p className="text-[#00CED1] text-sm text-center" style={inter}>
                Microphone is on. No camera detected — you can still join.
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
            <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-black/50 px-3 py-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00CED1] animate-pulse" />
              <span style={{ ...inter, fontSize: "11px", color: "#FFFFFF" }}>{displayName}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          {!canJoinClass ? (
            <button
              type="button"
              onClick={() => void onEnableMedia()}
              disabled={isRequesting}
              className="w-full py-3.5 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90 disabled:opacity-60"
              style={{ backgroundColor: "#00CED1", color: "#111023", ...inter }}
            >
              {isRequesting ? "Waiting for browser permission…" : permissionError ? "Try again" : "Turn on camera & microphone"}
            </button>
          ) : (
            <button
              type="button"
              onClick={onJoinClass}
              className="w-full py-3.5 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#00CED1", color: "#111023", ...inter }}
            >
              Join class
            </button>
          )}

          <button
            type="button"
            onClick={onBack}
            className="w-full py-3 rounded-xl text-sm text-white/50 hover:text-white/80"
            style={inter}
          >
            Back to Progress
          </button>
        </div>

        <p className="text-center text-[11px] text-white/30 mt-5 leading-relaxed" style={inter}>
          If no popup appears, click the lock icon left of the address bar and set Camera + Microphone to Allow.
        </p>
      </div>
    </div>
  );
}
