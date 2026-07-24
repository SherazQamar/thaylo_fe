"use client";

import { useMemo, useState } from "react";
import { badgeImageCandidates } from "@/lib/badge-image-fallback";

const inter = { fontFamily: "Inter, sans-serif" } as const;

export type BadgePreviewItem = {
  kind: string;
  name: string;
  imageUrl: string;
  count?: number;
};

/** Max unique badge images before +N overflow. */
export const BADGE_PREVIEW_MAX_VISIBLE = 3;
/** Fixed preview size for child cards + Growth Garden. */
export const BADGE_PREVIEW_SIZE_PX = 35;

type BadgePreviewStripProps = {
  previews: BadgePreviewItem[];
  /** Total badge awards earned. When set, +N is remaining toward this total (not remaining kinds). */
  totalEarned?: number;
  size?: number;
  maxVisible?: number;
  className?: string;
};

/**
 * Shows up to `maxVisible` unique badge images (object-contain, no crop),
 * then a +N circle for remaining awards (or remaining kinds if totalEarned omitted).
 * Hover reveals the badge name.
 */
export default function BadgePreviewStrip({
  previews,
  totalEarned,
  size = BADGE_PREVIEW_SIZE_PX,
  maxVisible = BADGE_PREVIEW_MAX_VISIBLE,
  className,
}: BadgePreviewStripProps) {
  const unique = previews.filter((p) => (p.count ?? 1) > 0);
  const visible = unique.slice(0, maxVisible);
  const remainingKinds = Math.max(0, unique.length - maxVisible);
  const remaining =
    totalEarned != null
      ? Math.max(0, totalEarned - visible.length)
      : remainingKinds;

  if (unique.length === 0) {
    return null;
  }

  return (
    <div
      className={`flex items-center justify-center gap-2 flex-wrap ${className ?? ""}`}
    >
      {visible.map((badge) => (
        <div key={badge.kind} className="relative group">
          <div
            className="flex items-center justify-center transition-transform group-hover:scale-105"
            style={{ width: size, height: size }}
          >
            <PreviewBadgeImage
              src={badge.imageUrl}
              alt={badge.name}
              size={size}
            />
          </div>
          <span
            className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-[calc(100%+8px)] z-20 whitespace-nowrap rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity"
            style={{
              ...inter,
              fontWeight: 600,
              fontSize: "11px",
              lineHeight: "14px",
              color: "#111023",
              backgroundColor: "#00CED1",
              boxShadow: "0 4px 12px rgba(0,0,0,0.35)",
            }}
            role="tooltip"
          >
            {badge.name}
            {(badge.count ?? 1) > 1 ? ` ×${badge.count}` : ""}
          </span>
        </div>
      ))}
      {remaining > 0 && (
        <div
          className="rounded-full flex items-center justify-center"
          style={{
            width: size,
            height: size,
            backgroundColor: "rgba(82, 81, 98, 0.85)",
          }}
          title={`${remaining} more badge${remaining === 1 ? "" : "s"}`}
        >
          <span
            style={{
              ...inter,
              fontWeight: 700,
              fontSize: remaining > 9 ? "11px" : "13px",
              color: "#00CED1",
            }}
          >
            +{remaining}
          </span>
        </div>
      )}
    </div>
  );
}

function PreviewBadgeImage({
  src,
  alt,
  size,
}: {
  src: string;
  alt: string;
  size: number;
}) {
  const candidates = useMemo(
    () => badgeImageCandidates(src, { preferSmall: true }),
    [src],
  );
  const [imageIndex, setImageIndex] = useState(0);
  const imageSrc = candidates[imageIndex];

  if (!imageSrc) {
    return null;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imageSrc}
      alt={alt}
      width={size}
      height={size}
      className="w-full h-full object-contain"
      onError={() => {
        setImageIndex((current) =>
          current + 1 < candidates.length ? current + 1 : current,
        );
      }}
    />
  );
}
