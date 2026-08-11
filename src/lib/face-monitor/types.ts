export type FaceBoundingBox = {
  x: number;
  y: number;
  width: number;
  height: number;
} | null;

export type FaceEngagement = "focused" | "away" | "unknown";

export type FaceMonitorStatus = {
  supported: boolean;
  ready: boolean;
  facePresent: boolean;
  faceMissingSeconds: number;
  engagement: FaceEngagement;
  confidence: number;
  faceBox: FaceBoundingBox;
};

export const FACE_MONITOR_DEFAULTS = {
  sampleIntervalMs: 120,
  /** Show stay-in-view nudge after this long without a face. */
  missingThresholdMs: 10_000,
  /** End the live class after this long without a face. */
  absenceEndClassMs: 30_000,
  engagementDebounceCount: 2,
  boxLerpFactor: 0.28,
} as const;

export const INITIAL_FACE_MONITOR_STATUS: FaceMonitorStatus = {
  supported: true,
  ready: false,
  facePresent: false,
  faceMissingSeconds: 0,
  engagement: "unknown",
  confidence: 0,
  faceBox: null,
};
