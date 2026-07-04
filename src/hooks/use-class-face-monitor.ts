"use client";

import { useEffect, useRef, useState } from "react";
import { estimateHeadPose } from "@/lib/face-monitor/head-pose";
import { landmarksToFaceBox } from "@/lib/face-monitor/face-box";
import {
  acquireFaceLandmarker,
  releaseFaceLandmarkerConsumer,
  type FaceLandmarkerInstance,
} from "@/lib/face-monitor/mediapipe-runtime";
import {
  FACE_MONITOR_DEFAULTS,
  INITIAL_FACE_MONITOR_STATUS,
  type FaceBoundingBox,
  type FaceMonitorStatus,
} from "@/lib/face-monitor/types";

type UseClassFaceMonitorOptions = {
  enabled?: boolean;
  sampleIntervalMs?: number;
  missingThresholdMs?: number;
  onStatusChange?: (status: FaceMonitorStatus) => void;
};

export function useClassFaceMonitor(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  {
    enabled = false,
    sampleIntervalMs = FACE_MONITOR_DEFAULTS.sampleIntervalMs,
    missingThresholdMs = FACE_MONITOR_DEFAULTS.missingThresholdMs,
    onStatusChange,
  }: UseClassFaceMonitorOptions = {},
) {
  const [status, setStatus] = useState<FaceMonitorStatus>(INITIAL_FACE_MONITOR_STATUS);
  const landmarkerRef = useRef<FaceLandmarkerInstance | null>(null);
  const onStatusChangeRef = useRef(onStatusChange);
  const awayStreakRef = useRef(0);
  const lastFaceSeenRef = useRef<number | null>(null);
  const lastFaceBoxRef = useRef<FaceBoundingBox>(null);
  const acquiredRef = useRef(false);

  useEffect(() => {
    onStatusChangeRef.current = onStatusChange;
  }, [onStatusChange]);

  const publish = (next: FaceMonitorStatus) => {
    setStatus(next);
    onStatusChangeRef.current?.(next);
  };

  useEffect(() => {
    if (!enabled) {
      awayStreakRef.current = 0;
      lastFaceSeenRef.current = null;
      lastFaceBoxRef.current = null;
      publish(INITIAL_FACE_MONITOR_STATUS);
      return;
    }

    let cancelled = false;
    let intervalId: ReturnType<typeof setInterval> | null = null;

    async function initLandmarker() {
      try {
        const landmarker = await acquireFaceLandmarker();

        if (cancelled) {
          releaseFaceLandmarkerConsumer();
          return;
        }

        acquiredRef.current = true;
        landmarkerRef.current = landmarker;
        publish({ ...INITIAL_FACE_MONITOR_STATUS, ready: true });
      } catch {
        if (!cancelled) {
          publish({ ...INITIAL_FACE_MONITOR_STATUS, supported: false });
        }
      }
    }

    void initLandmarker();

    intervalId = setInterval(() => {
      const video = videoRef.current;
      const landmarker = landmarkerRef.current;
      if (!video || !landmarker || video.readyState < 2 || video.videoWidth === 0) return;

      const now = performance.now();
      let facePresent = false;
      let engagement: FaceMonitorStatus["engagement"] = "unknown";
      let confidence = 0;
      let faceBox: FaceBoundingBox = null;

      try {
        const result = landmarker.detectForVideo(video, now);
        const landmarks = result.faceLandmarks?.[0];
        facePresent = Boolean(landmarks?.length);

        if (facePresent && landmarks) {
          lastFaceSeenRef.current = Date.now();
          faceBox = landmarksToFaceBox(landmarks);
          lastFaceBoxRef.current = faceBox;
          const pose = estimateHeadPose(landmarks);
          confidence = pose.confidence;

          if (pose.engagement === "away") {
            awayStreakRef.current += 1;
          } else {
            awayStreakRef.current = 0;
          }

          engagement =
            awayStreakRef.current >= FACE_MONITOR_DEFAULTS.engagementDebounceCount
              ? "away"
              : "focused";
        } else {
          awayStreakRef.current = 0;
          engagement = "unknown";
          faceBox = lastFaceBoxRef.current;
        }
      } catch {
        facePresent = false;
        engagement = "unknown";
        faceBox = lastFaceBoxRef.current;
      }

      const lastSeen = lastFaceSeenRef.current;
      const faceMissingSeconds =
        facePresent || lastSeen === null
          ? 0
          : Math.floor((Date.now() - lastSeen) / 1000);

      publish({
        supported: true,
        ready: true,
        facePresent,
        faceMissingSeconds,
        engagement,
        confidence,
        faceBox,
      });
    }, sampleIntervalMs);

    return () => {
      cancelled = true;
      if (intervalId) clearInterval(intervalId);
      landmarkerRef.current = null;
      if (acquiredRef.current) {
        acquiredRef.current = false;
        releaseFaceLandmarkerConsumer();
      }
    };
  }, [enabled, sampleIntervalMs, videoRef]);

  return {
    status,
    faceMissingLong: status.faceMissingSeconds * 1000 >= missingThresholdMs,
  };
}
