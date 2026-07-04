"use client";

import { useEffect, useRef, useState } from "react";
import {
  faceFrameColor,
  lerpFaceBox,
  mapFaceBoxToDisplay,
  type DisplayRect,
} from "@/lib/face-monitor/face-box";
import { FACE_MONITOR_DEFAULTS, type FaceBoundingBox, type FaceMonitorStatus } from "@/lib/face-monitor/types";

type FaceTrackingOverlayProps = {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  containerRef: React.RefObject<HTMLElement | null>;
  status: FaceMonitorStatus;
  mirrored?: boolean;
  strokeWidth?: number;
};

export default function FaceTrackingOverlay({
  videoRef,
  containerRef,
  status,
  mirrored = true,
  strokeWidth = 3,
}: FaceTrackingOverlayProps) {
  const [frame, setFrame] = useState<{ rect: DisplayRect; color: string; opacity: number } | null>(null);
  const smoothedBoxRef = useRef<FaceBoundingBox>(null);
  const lastKnownBoxRef = useRef<FaceBoundingBox>(null);
  const statusRef = useRef(status);
  const rafRef = useRef<number | null>(null);

  statusRef.current = status;

  useEffect(() => {
    const animate = () => {
      const currentStatus = statusRef.current;
      const video = videoRef.current;
      const container = containerRef.current;

      if (!currentStatus.ready || !video || !container) {
        setFrame(null);
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      if (currentStatus.facePresent && currentStatus.faceBox) {
        lastKnownBoxRef.current = currentStatus.faceBox;
      }

      const targetBox = currentStatus.facePresent
        ? currentStatus.faceBox
        : lastKnownBoxRef.current;

      if (targetBox) {
        smoothedBoxRef.current = lerpFaceBox(
          smoothedBoxRef.current,
          targetBox,
          FACE_MONITOR_DEFAULTS.boxLerpFactor,
        );

        const rect = mapFaceBoxToDisplay(
          smoothedBoxRef.current,
          video,
          container.clientWidth,
          container.clientHeight,
          mirrored,
        );

        if (rect) {
          setFrame({
            rect,
            color: faceFrameColor(currentStatus),
            opacity: currentStatus.facePresent ? 1 : 0.85,
          });
        }
      } else {
        smoothedBoxRef.current = null;
        setFrame(null);
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [containerRef, mirrored, videoRef]);

  if (!frame) return null;

  return (
    <div
      className="absolute pointer-events-none z-10 rounded-md"
      style={{
        left: frame.rect.left,
        top: frame.rect.top,
        width: frame.rect.width,
        height: frame.rect.height,
        border: `${strokeWidth}px solid ${frame.color}`,
        boxShadow: `0 0 12px ${frame.color}55, inset 0 0 8px ${frame.color}22`,
        opacity: frame.opacity,
        transition: "border-color 0.25s ease, box-shadow 0.25s ease, opacity 0.25s ease",
      }}
    />
  );
}
