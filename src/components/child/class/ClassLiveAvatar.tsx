"use client";

import { useCallback } from "react";

import type { HeygenAgentStatus } from "@/hooks/use-heygen-agent";

const inter = { fontFamily: "Inter, sans-serif" } as const;

/** Matches ClassBlackboard mid-tone. */
const BLACKBOARD_FILL = "#0f2922";

type ClassLiveAvatarProps = {
  instructorName: string;
  status: HeygenAgentStatus;
  speaking: boolean;
  errorMessage?: string | null;
  videoRef: (el: HTMLVideoElement | null) => void;
  /**
   * `stage` — Phase 1: large borderless hero on the board.
   * `tile` — compact floating card (legacy / fallback).
   */
  variant?: "stage" | "tile";
  /** Shrink slightly when quiz/interaction UI needs board space. */
  compact?: boolean;
};

function statusLabel(status: HeygenAgentStatus, speaking: boolean) {
  if (speaking) return "Speaking";
  if (status === "connected") return "Ready";
  if (status === "connecting") return "Connecting…";
  if (status === "error") return "Unavailable";
  if (status === "disconnected") return "Offline";
  return "Off";
}

export default function ClassLiveAvatar({
  instructorName,
  status,
  speaking,
  errorMessage,
  videoRef,
  variant = "stage",
  compact = false,
}: ClassLiveAvatarProps) {
  const showLive = status === "connected" || status === "connecting";
  const isStage = variant === "stage";

  const setVideoNode = useCallback(
    (el: HTMLVideoElement | null) => {
      videoRef(el);
    },
    [videoRef],
  );

  if (isStage) {
    return (
      <div
        className={
          "pointer-events-none absolute z-20 bottom-3 right-3 md:bottom-4 md:right-[148px] transition-all duration-300 " +
          (compact
            ? "w-[min(32%,200px)] md:w-[min(28%,240px)]"
            : "w-[min(42%,280px)] md:w-[min(38%,340px)]")
        }
        aria-label={`${instructorName} avatar`}
      >
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[20px]">
          <div
            className="absolute inset-0"
            style={{ backgroundColor: BLACKBOARD_FILL }}
          />
          <video
            ref={setVideoNode}
            autoPlay
            playsInline
            className={`absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-300 ${
              showLive ? "opacity-100" : "opacity-0"
            }`}
            style={{
              WebkitMaskImage:
                "radial-gradient(ellipse 88% 92% at 50% 40%, #000 52%, transparent 100%)",
              maskImage:
                "radial-gradient(ellipse 88% 92% at 50% 40%, #000 52%, transparent 100%)",
            }}
          />
          {!showLive && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4 text-center">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-full text-xl font-bold"
                style={{ backgroundColor: "#00CED1", color: "#111023" }}
              >
                {instructorName.slice(0, 1).toUpperCase()}
              </div>
              <p className="text-xs text-white/55" style={inter}>
                {errorMessage?.trim() || "Avatar standby"}
              </p>
            </div>
          )}
          {status === "connecting" && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <p className="text-xs text-white/85" style={inter}>
                Connecting avatar…
              </p>
            </div>
          )}
          {showLive && (
            <div className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2">
              <span
                className={
                  "rounded-full px-2.5 py-1 text-[10px] font-semibold backdrop-blur-sm " +
                  (speaking
                    ? "bg-[#00CED1]/25 text-[#00CED1]"
                    : "bg-black/45 text-white/70")
                }
                style={inter}
              >
                {statusLabel(status, speaking)}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="absolute z-20 top-3 right-[140px] md:right-[160px] w-[128px] md:w-[158px]">
      <div
        className="overflow-hidden rounded-[12px] border-2 shadow-xl"
        style={{
          borderColor: speaking ? "#00CED1" : "#525162",
          backgroundColor: "#313044",
        }}
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-[#1a1830]">
          <video
            ref={setVideoNode}
            autoPlay
            playsInline
            className={`absolute inset-0 h-full w-full object-cover object-top ${
              showLive ? "opacity-100" : "opacity-0"
            }`}
          />
          {!showLive && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-3 text-center">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold"
                style={{ backgroundColor: "#00CED1", color: "#111023" }}
              >
                {instructorName.slice(0, 1).toUpperCase()}
              </div>
              <p className="text-[11px] text-white/55" style={inter}>
                {errorMessage?.trim() || "Avatar standby"}
              </p>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between gap-1 bg-[#111023]/90 px-2 py-1.5">
          <p className="truncate text-[11px] font-semibold text-white" style={inter}>
            {instructorName}
          </p>
          <span
            className={
              "shrink-0 text-[10px] font-medium " +
              (speaking ? "text-[#00CED1]" : "text-white/45")
            }
            style={inter}
          >
            {statusLabel(status, speaking)}
          </span>
        </div>
      </div>
    </div>
  );
}
