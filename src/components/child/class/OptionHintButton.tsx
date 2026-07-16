"use client";

import { useId, useState } from "react";

const inter = { fontFamily: "Inter, sans-serif" } as const;

type OptionHintButtonProps = {
  hint: string;
  label?: string;
  compact?: boolean;
  placement?: "above" | "below";
};

export default function OptionHintButton({
  hint,
  label = "See a clue to help you think",
  compact = false,
  placement = compact ? "above" : "below",
}: OptionHintButtonProps) {
  const popoverId = useId();
  const [open, setOpen] = useState(false);

  return (
    <span className="relative inline-flex shrink-0">
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        aria-controls={popoverId}
        className={`inline-flex items-center justify-center rounded-full border transition-colors ${
          compact ? "h-6 w-6 text-[11px]" : "h-7 w-7 text-xs"
        } ${open ? "border-[#00CED1] text-[#00CED1] bg-[#00CED1]/10" : "border-white/30 text-white/60 hover:border-[#00CED1]/60 hover:text-[#00CED1]"}`}
        style={{ ...inter, fontWeight: 700 }}
        onClick={(event) => {
          event.stopPropagation();
          event.preventDefault();
          setOpen((prev) => !prev);
        }}
      >
        <svg
          width={compact ? 14 : 16}
          height={compact ? 14 : 16}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          aria-hidden
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 11v5" strokeLinecap="round" />
          <circle cx="12" cy="8" r="0.75" fill="currentColor" stroke="none" />
        </svg>
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close clue"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpen(false)}
          />
          <span
            id={popoverId}
            role="dialog"
            className={`absolute z-[60] rounded-xl border border-[#00CED1]/30 bg-[#0f2922] shadow-xl ${
              placement === "above"
                ? `bottom-full mb-1.5 right-0 ${compact ? "w-[min(240px,70vw)] px-2.5 py-2" : "w-[min(260px,75vw)] px-3 py-2.5"}`
                : `top-full mt-2 right-0 ${compact ? "w-[min(240px,70vw)] px-2.5 py-2" : "w-[min(260px,75vw)] px-3 py-2.5"}`
            }`}
          >
            <p
              className="text-[10px] font-semibold uppercase tracking-wide text-[#00CED1]/80 mb-1"
              style={inter}
            >
              Think about this
            </p>
            <p
              className={compact ? "text-[11px] leading-snug" : "text-xs leading-relaxed"}
              style={{ ...inter, color: "rgba(232,245,233,0.9)" }}
            >
              {hint}
            </p>
          </span>
        </>
      )}
    </span>
  );
}
