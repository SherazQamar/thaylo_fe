"use client";

import { useEffect, useRef } from "react";
import { useChildAuthStore } from "@/stores/child-auth.store";
import FaceTrackingOverlay from "@/components/child/class/FaceTrackingOverlay";
import { useClassFaceMonitor } from "@/hooks/use-class-face-monitor";
import type { FaceMonitorStatus } from "@/lib/face-monitor/types";

const inter = { fontFamily: "Inter, sans-serif" } as const;

type ClassChildVideoProps = {
  stream: MediaStream | null;
  cameraEnabled: boolean;
  micEnabled: boolean;
  permissionError?: string | null;
  onEnableMedia?: () => void;
  faceMonitorEnabled?: boolean;
  onFaceStatusChange?: (status: FaceMonitorStatus) => void;
};

export default function ClassChildVideo({
  stream,
  cameraEnabled,
  micEnabled,
  permissionError,
  onEnableMedia,
  faceMonitorEnabled = false,
  onFaceStatusChange,
}: ClassChildVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const child = useChildAuthStore((state) => state.child);
  const displayName = child?.userName?.trim() || "You";

  const { status: faceStatus } = useClassFaceMonitor(videoRef, {
    enabled: faceMonitorEnabled && Boolean(stream && cameraEnabled),
    onStatusChange: onFaceStatusChange,
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.srcObject = stream;
  }, [stream]);

  const showVideo = stream && cameraEnabled;

  return (
    <div className="absolute bottom-4 right-4 z-20 w-[130px] md:w-[150px]">
      <div
        className="rounded-[12px] overflow-hidden border-2 shadow-xl"
        style={{ borderColor: micEnabled ? "#00CED1" : "#525162", backgroundColor: "#313044" }}
      >
        <div ref={containerRef} className="relative aspect-[4/3] bg-[#1a1830]">
          {showVideo ? (
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
                strokeWidth={2}
              />
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 px-2">
              <div className="w-10 h-10 rounded-full bg-[#525162] flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              {permissionError ? (
                <button
                  type="button"
                  onClick={onEnableMedia}
                  className="text-[10px] text-[#00CED1] underline"
                  style={inter}
                >
                  Enable camera
                </button>
              ) : (
                <span className="text-[10px] text-white/40 text-center" style={inter}>
                  Camera off
                </span>
              )}
            </div>
          )}

          <div className="absolute top-1.5 left-1.5 flex items-center gap-1 z-20">
            {micEnabled ? (
              <span className="w-2 h-2 rounded-full bg-[#00CED1] animate-pulse" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-[#FF7B7B]" />
            )}
          </div>
        </div>

        <div className="px-2 py-1.5 border-t border-white/10">
          <p className="truncate text-[10px] font-semibold text-white/80" style={inter}>
            {displayName}
          </p>
        </div>
      </div>
    </div>
  );
}
