"use client";

import { useId, useState } from "react";

type InfoTooltipProps = {
  content: string;
  label?: string;
  className?: string;
};

export default function InfoTooltip({
  content,
  label = "More information",
  className = "",
}: InfoTooltipProps) {
  const tooltipId = useId();
  const [open, setOpen] = useState(false);

  return (
    <span className={`relative inline-flex align-middle ${className}`}>
      <button
        type="button"
        aria-label={label}
        aria-describedby={open ? tooltipId : undefined}
        className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-white/25 text-[10px] font-bold leading-none text-white/55 hover:border-[#00CED1]/50 hover:text-[#00CED1] transition-colors"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      >
        i
      </button>
      {open && (
        <span
          id={tooltipId}
          role="tooltip"
          className="absolute left-1/2 top-full z-50 mt-2 w-[min(280px,calc(100vw-2rem))] -translate-x-1/2 rounded-xl border border-white/10 bg-[#252338] px-3 py-2.5 text-left text-xs leading-relaxed text-white/80 shadow-xl"
        >
          {content}
        </span>
      )}
    </span>
  );
}
