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
  /**
   * `pip` — floating picture-in-picture on the board.
   * `avatarDock` — compact camera for the LiveAvatar card footer.
   * `tile` — legacy floating card with name bar.
   * `header` — inline camera for the lesson header (right side).
   */
  variant?: "pip" | "tile" | "avatarDock" | "header";
  dock?: "top" | "bottom";
};

export default function ClassChildVideo({
  stream,
  cameraEnabled,
  micEnabled,
  permissionError,
  onEnableMedia,
  faceMonitorEnabled = false,
  onFaceStatusChange,
  variant = "pip",
  dock = "bottom",
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
  const isPip = variant === "pip";
  const isAvatarDock = variant === "avatarDock";
  const isHeader = variant === "header";

  if (isHeader) {
    return (
      <div className="w-[72px] sm:w-[88px] md:w-[112px] shrink-0">
        <div
          className="overflow-hidden rounded-[10px] shadow-lg sm:rounded-[12px]"
          style={{
            border: `1.5px solid ${micEnabled ? "rgba(0,206,209,0.65)" : "rgba(255,255,255,0.25)"}`,
            backgroundColor: "#1a1830",
          }}
        >
          <div ref={containerRef} className="relative aspect-[4/3] bg-[#1a1830]">
            {showVideo ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="h-full w-full object-cover"
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
              <div className="flex h-full w-full flex-col items-center justify-center gap-1 px-1">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#525162]">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                {permissionError ? (
                  <button
                    type="button"
                    onClick={onEnableMedia}
                    className="text-[9px] text-[#00CED1] underline"
                    style={inter}
                  >
                    Enable
                  </button>
                ) : (
                  <span className="text-center text-[9px] text-white/40" style={inter}>
                    Off
                  </span>
                )}
              </div>
            )}
            <div className="absolute left-1 top-1 z-20">
              <span
                className={
                  "h-1.5 w-1.5 rounded-full " +
                  (micEnabled ? "animate-pulse bg-[#00CED1]" : "bg-[#FF7B7B]")
                }
              />
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-1 pb-0.5 pt-3">
              <p className="truncate text-[9px] font-semibold text-white/90" style={inter}>
                {displayName}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isAvatarDock) {
    return (
      <div className="pointer-events-auto w-[72px] md:w-[88px] shrink-0">
        <div
          className="overflow-hidden rounded-[12px] shadow-lg"
          style={{
            border: `1.5px solid ${micEnabled ? "rgba(0,206,209,0.65)" : "rgba(255,255,255,0.25)"}`,
            backgroundColor: "#1a1830",
          }}
        >
          <div ref={containerRef} className="relative aspect-[4/3] bg-[#1a1830]">
            {showVideo ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="h-full w-full object-cover"
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
              <div className="flex h-full w-full flex-col items-center justify-center gap-1 px-1">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#525162]">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                {permissionError ? (
                  <button
                    type="button"
                    onClick={onEnableMedia}
                    className="text-[9px] text-[#00CED1] underline"
                    style={inter}
                  >
                    Enable
                  </button>
                ) : (
                  <span className="text-center text-[9px] text-white/40" style={inter}>
                    Off
                  </span>
                )}
              </div>
            )}
            <div className="absolute left-1 top-1 z-20">
              <span
                className={
                  "h-1.5 w-1.5 rounded-full " +
                  (micEnabled ? "animate-pulse bg-[#00CED1]" : "bg-[#FF7B7B]")
                }
              />
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-1 pb-0.5 pt-3">
              <p className="truncate text-[9px] font-semibold text-white/90" style={inter}>
                {displayName}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isPip) {
    return (
      <div
        className={
          "absolute z-30 w-[104px] md:w-[124px] " +
          (dock === "top"
            ? "top-3 left-3 md:top-4 md:left-4"
            : "bottom-3 right-3 md:bottom-4 md:right-4")
        }
      >
        <div
          className="overflow-hidden rounded-[14px] shadow-xl"
          style={{
            border: `1.5px solid ${micEnabled ? "rgba(0,206,209,0.65)" : "rgba(255,255,255,0.18)"}`,
            backgroundColor: "#1a1830",
          }}
        >
          <div ref={containerRef} className="relative aspect-[4/3] bg-[#1a1830]">
            {showVideo ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="h-full w-full object-cover"
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
              <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 px-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#525162]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2">
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
                    Enable
                  </button>
                ) : (
                  <span className="text-center text-[10px] text-white/40" style={inter}>
                    Camera off
                  </span>
                )}
              </div>
            )}

            <div className="absolute left-1.5 top-1.5 z-20 flex items-center gap-1">
              <span
                className={
                  "h-2 w-2 rounded-full " +
                  (micEnabled ? "animate-pulse bg-[#00CED1]" : "bg-[#FF7B7B]")
                }
              />
            </div>

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-1.5 pb-1 pt-4">
              <p className="truncate text-[10px] font-semibold text-white/90" style={inter}>
                {displayName}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`absolute z-20 w-[112px] md:w-[132px] ${
        dock === "top" ? "top-3 right-3" : "bottom-4 right-4"
      }`}
    >
      <div
        className="overflow-hidden rounded-[12px] border-2 shadow-xl"
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
                className="h-full w-full object-cover"
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
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 px-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#525162]">
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
                <span className="text-center text-[10px] text-white/40" style={inter}>
                  Camera off
                </span>
              )}
            </div>
          )}

          <div className="absolute left-1.5 top-1.5 z-20 flex items-center gap-1">
            {micEnabled ? (
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#00CED1]" />
            ) : (
              <span className="h-2 w-2 rounded-full bg-[#FF7B7B]" />
            )}
          </div>
        </div>

        <div className="border-t border-white/10 px-2 py-1.5">
          <p className="truncate text-[10px] font-semibold text-white/80" style={inter}>
            {displayName}
          </p>
        </div>
      </div>
    </div>
  );
}
