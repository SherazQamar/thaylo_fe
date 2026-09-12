"use client";

import { useId } from "react";

const inter = { fontFamily: "Inter, sans-serif" } as const;

type OptionHintButtonProps = {
  hint: string;
  label?: string;
  compact?: boolean;
  placement?: "above" | "below";
  /** Dictionary meaning vs scaffold clue */
  variant?: "hint" | "definition";
};

/**
 * Hint / definition "i" icon — shows text on hover / keyboard focus (not click).
 */
export default function OptionHintButton({
  hint,
  label,
  compact = false,
  placement = compact ? "above" : "below",
  variant = "hint",
}: OptionHintButtonProps) {
  const popoverId = useId();
  const isDefinition = variant === "definition";
  const ariaLabel =
    label ?? (isDefinition ? "See the definition" : "See a clue to help you think");
  const heading = isDefinition ? "Definition" : "Think about this";

  return (
    <span className="group/hint relative inline-flex shrink-0">
      <button
        type="button"
        aria-label={ariaLabel}
        aria-describedby={popoverId}
        title={hint}
        className={`inline-flex items-center justify-center rounded-full border transition-colors focus-visible:border-[#00CED1] focus-visible:text-[#00CED1] ${
          isDefinition
            ? "border-[#00CED1]/35 text-[#00CED1]/90 hover:border-[#00CED1]/70 hover:text-[#00CED1]"
            : "border-white/30 text-white/60 hover:border-[#00CED1]/60 hover:text-[#00CED1]"
        } ${compact ? "h-6 w-6 text-[11px]" : "h-7 w-7 text-xs"}`}
        style={{ ...inter, fontWeight: 700 }}
        onClick={(event) => {
          // Keep click from selecting the quiz option; hint opens on hover/focus only.
          event.stopPropagation();
          event.preventDefault();
        }}
        onMouseDown={(event) => {
          // Avoid starting a drag when pressing the definition control.
          event.stopPropagation();
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

      <span
        id={popoverId}
        role="tooltip"
        className={`pointer-events-none absolute z-[60] rounded-xl border border-[#00CED1]/30 bg-[#0f2922] opacity-0 shadow-xl transition-opacity duration-150 group-hover/hint:opacity-100 group-focus-within/hint:opacity-100 ${
          placement === "above"
            ? `bottom-full mb-1.5 right-0 ${compact ? "w-[min(240px,70vw)] px-2.5 py-2" : "w-[min(260px,75vw)] px-3 py-2.5"}`
            : `top-full mt-2 right-0 ${compact ? "w-[min(240px,70vw)] px-2.5 py-2" : "w-[min(260px,75vw)] px-3 py-2.5"}`
        }`}
      >
        <p
          className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-[#00CED1]/80"
          style={inter}
        >
          {heading}
        </p>
        <p
          className={compact ? "text-[11px] leading-snug" : "text-xs leading-relaxed"}
          style={{ ...inter, color: "rgba(232,245,233,0.9)" }}
        >
          {hint}
        </p>
      </span>
    </span>
  );
}
