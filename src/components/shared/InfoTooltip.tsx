"use client";

import { useId, useState } from "react";

type InfoTooltipProps = {
  content: string;
  label?: string;
  className?: string;
  /** Tooltip position relative to the icon. */
  align?: "left" | "center" | "right";
  /** Use `light` on pale surfaces (e.g. parent reports). */
  tone?: "dark" | "light";
};

export default function InfoTooltip({
  content,
  label = "More information",
  className = "",
  align = "center",
  tone = "dark",
}: InfoTooltipProps) {
  const tooltipId = useId();
  const [open, setOpen] = useState(false);

  if (!content?.trim()) return null;

  const alignClass =
    align === "left"
      ? "left-0 translate-x-0"
      : align === "right"
        ? "right-0 translate-x-0"
        : "left-1/2 -translate-x-1/2";

  const buttonClass =
    tone === "light"
      ? "inline-flex h-4 w-4 items-center justify-center rounded-full border border-[#00334D]/25 text-[10px] font-bold leading-none text-[#00334D]/55 hover:border-[#00CED1] hover:text-[#00A8AB] transition-colors"
      : "inline-flex h-4 w-4 items-center justify-center rounded-full border border-white/25 text-[10px] font-bold leading-none text-white/55 hover:border-[#00CED1]/50 hover:text-[#00CED1] transition-colors";

  return (
    <span
      className={`relative inline-flex align-middle shrink-0 ${className}`}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        aria-label={label}
        aria-describedby={open ? tooltipId : undefined}
        className={buttonClass}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
      >
        i
      </button>
      {open && (
        <span
          id={tooltipId}
          role="tooltip"
          className={`absolute top-full z-50 mt-2 w-[min(280px,calc(100vw-2rem))] rounded-xl border border-white/10 bg-[#252338] px-3 py-2.5 text-left text-xs leading-relaxed text-white/80 shadow-xl ${alignClass}`}
        >
          {content}
        </span>
      )}
    </span>
  );
}
