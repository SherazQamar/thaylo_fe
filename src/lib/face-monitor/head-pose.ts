type Point = { x: number; y: number; z?: number };

/** MediaPipe Face Mesh landmark indices (subset). */
const NOSE_TIP = 1;
const LEFT_EYE = 33;
const RIGHT_EYE = 263;
const CHIN = 152;

function landmarkPoint(landmarks: Point[], index: number): Point {
  return landmarks[index] ?? { x: 0, y: 0, z: 0 };
}

function midpoint(a: Point, b: Point): Point {
  return {
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2,
    z: ((a.z ?? 0) + (b.z ?? 0)) / 2,
  };
}

function distance(a: Point, b: Point) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export type HeadPoseEstimate = {
  engagement: "focused" | "away";
  confidence: number;
  yawDeg: number;
  pitchDeg: number;
};

const YAW_AWAY_DEG = 22;
const PITCH_AWAY_DEG = 28;

/**
 * Estimate whether the student is looking toward the camera from 468 face landmarks.
 */
export function estimateHeadPose(landmarks: Point[]): HeadPoseEstimate {
  const nose = landmarkPoint(landmarks, NOSE_TIP);
  const leftEye = landmarkPoint(landmarks, LEFT_EYE);
  const rightEye = landmarkPoint(landmarks, RIGHT_EYE);
  const chin = landmarkPoint(landmarks, CHIN);
  const eyeMid = midpoint(leftEye, rightEye);

  const eyeSpan = Math.max(distance(leftEye, rightEye), 0.01);
  const yawRatio = (nose.x - eyeMid.x) / eyeSpan;
  const yawDeg = Math.atan(yawRatio) * (180 / Math.PI);

  const eyeToChin = chin.y - eyeMid.y;
  const noseDrop = nose.y - eyeMid.y;
  const pitchRatio = eyeToChin > 0.01 ? noseDrop / eyeToChin : 0;
  const pitchDeg = (pitchRatio - 0.45) * 90;

  const lookingAway =
    Math.abs(yawDeg) > YAW_AWAY_DEG || Math.abs(pitchDeg) > PITCH_AWAY_DEG;

  const yawConfidence = 1 - Math.min(Math.abs(yawDeg) / YAW_AWAY_DEG, 1);
  const pitchConfidence = 1 - Math.min(Math.abs(pitchDeg) / PITCH_AWAY_DEG, 1);
  const confidence = Math.round(Math.min(yawConfidence, pitchConfidence) * 100) / 100;

  return {
    engagement: lookingAway ? "away" : "focused",
    confidence,
    yawDeg,
    pitchDeg,
  };
}
