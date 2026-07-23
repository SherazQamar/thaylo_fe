"use client";

import { useMemo, useState } from "react";
import type { BadgeIconStyle } from "@/lib/badge-api";
import { badgeImageCandidates } from "@/lib/badge-image-fallback";

const stroke = "currentColor";

/** Repeatable badges: open book. Milestone badges: unique plant symbols. */
export default function BadgeArtwork({
  iconStyle,
  size = 22,
  className,
}: {
  iconStyle: BadgeIconStyle;
  size?: number;
  className?: string;
}) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke,
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
  };

  if (iconStyle === "open_book") {
    return (
      <svg {...common}>
        <path d="M2 4h7a3 3 0 013 3v13a2 2 0 00-2-2H2V4z" />
        <path d="M22 4h-7a3 3 0 00-3 3v13a2 2 0 012-2h8V4z" />
      </svg>
    );
  }

  if (iconStyle === "plant") {
    return (
      <svg {...common}>
        <path d="M12 22v-8" />
        <path d="M9 22h6" />
        <path d="M12 14c-3-1-5-4-5-7 3 0 5 2 5 5" />
        <path d="M12 14c3-1 5-4 5-7-3 0-5 2-5 5" />
      </svg>
    );
  }

  if (iconStyle === "branch") {
    return (
      <svg {...common}>
        <path d="M4 20c4-2 7-6 8-12" />
        <path d="M12 8c2 1 4 1 6 0" />
        <path d="M12 12c2 .5 3.5 2 5 4" />
        <circle cx="18" cy="7.5" r="1.2" fill={stroke} stroke="none" />
        <circle cx="17.5" cy="16" r="1.2" fill={stroke} stroke="none" />
      </svg>
    );
  }

  if (iconStyle === "flower") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="2.2" />
        <path d="M12 4.5c1.2 1.8 1.2 3.5 0 5.2-1.2-1.7-1.2-3.4 0-5.2z" />
        <path d="M12 14.3c1.2 1.8 1.2 3.5 0 5.2-1.2-1.7-1.2-3.4 0-5.2z" />
        <path d="M4.5 12c1.8-1.2 3.5-1.2 5.2 0-1.7 1.2-3.4 1.2-5.2 0z" />
        <path d="M14.3 12c1.8-1.2 3.5-1.2 5.2 0-1.7 1.2-3.4 1.2-5.2 0z" />
      </svg>
    );
  }

  // oak
  return (
    <svg {...common}>
      <path d="M12 22v-7" />
      <path d="M9 22h6" />
      <path d="M7 10c0-3.5 2.2-6 5-6s5 2.5 5 6c0 2.2-1.2 3.5-2.6 4.4-.7.5-1.5.8-2.4 1.1-.9-.3-1.7-.6-2.4-1.1C8.2 13.5 7 12.2 7 10z" />
      <path d="M9.5 9.5c.6-.8 1.5-1.3 2.5-1.3" />
    </svg>
  );
}

export function BadgeShield({
  iconStyle,
  earned = true,
  size = 44,
  imageUrl,
  alt,
}: {
  iconStyle: BadgeIconStyle;
  earned?: boolean;
  size?: number;
  imageUrl?: string;
  alt?: string;
}) {
  const iconSize = Math.round(size * 0.48);
  const candidates = useMemo(() => badgeImageCandidates(imageUrl), [imageUrl]);
  const [imageIndex, setImageIndex] = useState(0);
  const imageSrc = candidates[imageIndex];

  return (
    <div
      className="flex items-center justify-center flex-shrink-0 overflow-hidden"
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.28,
        backgroundColor: earned ? "#2A4A52" : "#525162",
        color: earned ? "#00CED1" : "rgba(255,255,255,0.35)",
        border: earned
          ? "1px solid rgba(0,206,209,0.35)"
          : "1px solid transparent",
        opacity: earned || imageUrl ? 1 : 0.55,
      }}
      aria-hidden={!alt}
    >
      {imageSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageSrc}
          alt={alt ?? ""}
          width={size}
          height={size}
          className="w-full h-full object-contain"
          style={{ opacity: earned ? 1 : 0.45 }}
          onError={() => {
            setImageIndex((current) =>
              current + 1 < candidates.length ? current + 1 : current,
            );
          }}
        />
      ) : (
        <BadgeArtwork iconStyle={iconStyle} size={iconSize} />
      )}
    </div>
  );
}
