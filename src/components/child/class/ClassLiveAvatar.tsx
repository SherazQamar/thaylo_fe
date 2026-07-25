"use client";

import { useCallback, useEffect, useRef, type ReactNode } from "react";

import type { HeygenAgentStatus } from "@/hooks/use-heygen-agent";
import { setupChromaKey } from "@/lib/liveavatar-chroma-key";

const inter = { fontFamily: "Inter, sans-serif" } as const;

type ClassLiveAvatarProps = {
  instructorName: string;
  status: HeygenAgentStatus;
  speaking: boolean;
  errorMessage?: string | null;
  videoRef: (el: HTMLVideoElement | null) => void;
  variant?: "stage" | "tile";
  compact?: boolean;
  controls?: ReactNode;
  childCamera?: ReactNode;
};

/**
 * LiveAvatar stage — green screen keyed out so the blackboard shows through.
 * Official LiveAvatar approach: canvas chroma (docs/guides/change-background).
 * Video element stays in the DOM (hidden) so audio + SDK attach keep working.
 */
export default function ClassLiveAvatar({
  instructorName,
  status,
  speaking,
  errorMessage,
  videoRef,
  variant = "stage",
  compact = false,
  controls,
  childCamera,
}: ClassLiveAvatarProps) {
  const showLive = status === "connected" || status === "connecting";
  const isStage = variant === "stage";
  const videoElRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const setVideoNode = useCallback(
    (el: HTMLVideoElement | null) => {
      videoElRef.current = el;
      videoRef(el);
    },
    [videoRef],
  );

  useEffect(() => {
    if (!showLive || status === "connecting") return;
    const video = videoElRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    let stop: (() => void) | null = null;
    let started = false;

    const tryStart = () => {
      if (started || !video.videoWidth) return;
      started = true;
      stop = setupChromaKey(video, canvas, {
        minHue: 70,
        maxHue: 170,
        minSaturation: 0.18,
        threshold: 1.05,
        maxWidth: 640,
      });
    };

    tryStart();
    video.addEventListener("loadeddata", tryStart);
    video.addEventListener("playing", tryStart);

    return () => {
      video.removeEventListener("loadeddata", tryStart);
      video.removeEventListener("playing", tryStart);
      stop?.();
    };
  }, [showLive, status]);

  const mediaStack = (
    <>
      {/* Stream source stays full-size for decode; hidden so only keyed canvas shows. */}
      <video
        ref={setVideoNode}
        autoPlay
        playsInline
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[center_15%] opacity-0"
        aria-hidden
      />
      <canvas
        ref={canvasRef}
        className={`pointer-events-none absolute inset-0 h-full w-full object-cover object-[center_15%] transition-opacity duration-300 ${
          showLive && status === "connected" ? "opacity-100" : "opacity-0"
        }`}
      />
    </>
  );

  if (isStage) {
    return (
      <div
        className={
          "absolute z-20 bottom-0 right-0 flex flex-col items-stretch transition-all duration-300 " +
          (compact
            ? "w-[min(34%,200px)] md:w-[min(28%,220px)]"
            : "w-[min(48%,360px)] md:w-[min(42%,400px)]")
        }
        aria-label={`${instructorName} avatar`}
      >
        <div
          className={
            "relative w-full overflow-hidden rounded-tl-[22px] bg-transparent " +
            (compact ? "aspect-[3/4]" : "aspect-[3/4]")
          }
        >
          {mediaStack}

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
            <div className="absolute inset-0 flex items-center justify-center bg-black/25">
              <p className="text-xs text-white/90" style={inter}>
                Connecting avatar…
              </p>
            </div>
          )}

          {(controls || childCamera) && (
            <div className="absolute inset-x-0 bottom-0 z-30 flex items-end gap-2 bg-gradient-to-t from-black/80 via-black/45 to-transparent px-2.5 pb-2.5 pt-10">
              <div className="flex min-w-0 flex-1 items-center justify-start pl-6 md:pl-10">
                {controls}
              </div>
              {childCamera ? <div className="shrink-0">{childCamera}</div> : null}
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
          backgroundColor: "transparent",
        }}
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-transparent">
          {mediaStack}
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
        {controls ? <div className="px-2 py-2 bg-[#111023]">{controls}</div> : null}
      </div>
    </div>
  );
}
