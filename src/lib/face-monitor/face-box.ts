import type { FaceBoundingBox, FaceMonitorStatus } from "@/lib/face-monitor/types";

type Point = { x: number; y: number };

export const FACE_FRAME_COLORS = {
  focused: "#4ADE80",
  away: "#FBBF24",
  missing: "#FF7B7B",
  loading: "rgba(255,255,255,0.35)",
} as const;

export function landmarksToFaceBox(
  landmarks: Point[],
  padding = 0.12,
): FaceBoundingBox {
  if (!landmarks.length) return null;

  let minX = 1;
  let minY = 1;
  let maxX = 0;
  let maxY = 0;

  for (const point of landmarks) {
    minX = Math.min(minX, point.x);
    minY = Math.min(minY, point.y);
    maxX = Math.max(maxX, point.x);
    maxY = Math.max(maxY, point.y);
  }

  const padX = (maxX - minX) * padding;
  const padY = (maxY - minY) * padding;

  const x = Math.max(0, minX - padX);
  const y = Math.max(0, minY - padY);

  return {
    x,
    y,
    width: Math.min(1 - x, maxX - minX + padX * 2),
    height: Math.min(1 - y, maxY - minY + padY * 2),
  };
}

export function lerpFaceBox(
  current: FaceBoundingBox,
  target: FaceBoundingBox,
  factor: number,
): FaceBoundingBox {
  if (!target) return current;
  if (!current) return target;

  const t = Math.min(Math.max(factor, 0), 1);
  return {
    x: current.x + (target.x - current.x) * t,
    y: current.y + (target.y - current.y) * t,
    width: current.width + (target.width - current.width) * t,
    height: current.height + (target.height - current.height) * t,
  };
}

export function faceFrameColor(status: FaceMonitorStatus): string {
  if (!status.ready) return FACE_FRAME_COLORS.loading;
  if (!status.facePresent) return FACE_FRAME_COLORS.missing;
  if (status.engagement === "away") return FACE_FRAME_COLORS.away;
  return FACE_FRAME_COLORS.focused;
}

export type DisplayRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

/** Map normalized video-space box to pixel rect inside an object-cover container. */
export function mapFaceBoxToDisplay(
  box: FaceBoundingBox,
  video: HTMLVideoElement,
  containerWidth: number,
  containerHeight: number,
  mirrored: boolean,
): DisplayRect | null {
  if (!box || video.videoWidth === 0 || video.videoHeight === 0) return null;

  const videoAspect = video.videoWidth / video.videoHeight;
  const containerAspect = containerWidth / containerHeight;

  let scale: number;
  let offsetX: number;
  let offsetY: number;

  if (videoAspect > containerAspect) {
    scale = containerHeight / video.videoHeight;
    offsetX = (containerWidth - video.videoWidth * scale) / 2;
    offsetY = 0;
  } else {
    scale = containerWidth / video.videoWidth;
    offsetX = 0;
    offsetY = (containerHeight - video.videoHeight * scale) / 2;
  }

  let x = box.x;
  if (mirrored) {
    x = 1 - box.x - box.width;
  }

  return {
    left: offsetX + x * video.videoWidth * scale,
    top: offsetY + box.y * video.videoHeight * scale,
    width: box.width * video.videoWidth * scale,
    height: box.height * video.videoHeight * scale,
  };
}
