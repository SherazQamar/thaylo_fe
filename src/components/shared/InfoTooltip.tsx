"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

type InfoTooltipProps = {
  content: string;
  label?: string;
  className?: string;
  /** Preferred horizontal alignment; still clamped to the viewport on small screens. */
  align?: "left" | "center" | "right";
  /** Use `light` on pale surfaces (e.g. parent reports). */
  tone?: "dark" | "light";
};

const VIEWPORT_MARGIN = 16;
const GAP = 8;
const CLOSE_DELAY_MS = 140;

export default function InfoTooltip({
  content,
  label = "More information",
  className = "",
  align = "center",
  tone = "dark",
}: InfoTooltipProps) {
  const tooltipId = useId();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(
    null,
  );
  const buttonRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const rootRef = useRef<HTMLSpanElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const openTooltip = useCallback(() => {
    clearCloseTimer();
    setOpen(true);
  }, [clearCloseTimer]);

  const scheduleClose = useCallback(() => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      setOpen(false);
      closeTimerRef.current = null;
    }, CLOSE_DELAY_MS);
  }, [clearCloseTimer]);

  useEffect(() => () => clearCloseTimer(), [clearCloseTimer]);

  const updatePosition = useCallback(() => {
    const button = buttonRef.current;
    const tip = tooltipRef.current;
    if (!button || !tip) return;

    const btn = button.getBoundingClientRect();
    const tipWidth = tip.offsetWidth;
    const tipHeight = tip.offsetHeight;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let left: number;
    if (align === "left") {
      left = btn.left;
    } else if (align === "right") {
      left = btn.right - tipWidth;
    } else {
      left = btn.left + btn.width / 2 - tipWidth / 2;
    }
    left = Math.max(
      VIEWPORT_MARGIN,
      Math.min(left, vw - tipWidth - VIEWPORT_MARGIN),
    );

    const spaceBelow = vh - btn.bottom - GAP - VIEWPORT_MARGIN;
    const spaceAbove = btn.top - GAP - VIEWPORT_MARGIN;
    let top: number;
    if (spaceBelow >= tipHeight || spaceBelow >= spaceAbove) {
      top = btn.bottom + GAP;
      if (top + tipHeight > vh - VIEWPORT_MARGIN) {
        top = Math.max(VIEWPORT_MARGIN, vh - tipHeight - VIEWPORT_MARGIN);
      }
    } else {
      top = btn.top - GAP - tipHeight;
      if (top < VIEWPORT_MARGIN) {
        top = VIEWPORT_MARGIN;
      }
    }

    setCoords({ top, left });
  }, [align]);

  useLayoutEffect(() => {
    if (!open) {
      setCoords(null);
      return;
    }

    updatePosition();
    const frame = requestAnimationFrame(updatePosition);
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (rootRef.current?.contains(target)) return;
      if (tooltipRef.current?.contains(target)) return;
      clearCloseTimer();
      setOpen(false);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        clearCloseTimer();
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, clearCloseTimer]);

  if (!content?.trim()) return null;

  const buttonClass =
    tone === "light"
      ? "inline-flex h-4 w-4 items-center justify-center rounded-full border border-[#00334D]/25 text-[10px] font-bold leading-none text-[#00334D]/55 hover:border-[#00CED1] hover:text-[#00A8AB] transition-colors"
      : "inline-flex h-4 w-4 items-center justify-center rounded-full border border-white/25 text-[10px] font-bold leading-none text-white/55 hover:border-[#00CED1]/50 hover:text-[#00CED1] transition-colors";

  const tooltip =
    open && mounted
      ? createPortal(
          <span
            ref={tooltipRef}
            id={tooltipId}
            role="tooltip"
            className="fixed z-[9999] max-w-[min(320px,calc(100vw-2rem))] w-[min(320px,calc(100vw-2rem))] rounded-xl border border-white/10 bg-[#252338] px-3 py-2.5 text-left text-xs leading-relaxed text-white/80 shadow-xl"
            style={{
              top: coords?.top ?? -9999,
              left: coords?.left ?? -9999,
              visibility: coords ? "visible" : "hidden",
            }}
            onMouseEnter={openTooltip}
            onMouseLeave={scheduleClose}
          >
            {content}
          </span>,
          document.body,
        )
      : null;

  return (
    <span
      ref={rootRef}
      className={`relative inline-flex align-middle shrink-0 ${className}`}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <button
        ref={buttonRef}
        type="button"
        data-snapshot-ignore="true"
        aria-label={label}
        aria-expanded={open}
        aria-describedby={open ? tooltipId : undefined}
        className={buttonClass}
        onMouseEnter={openTooltip}
        onMouseLeave={scheduleClose}
        onFocus={openTooltip}
        onClick={(e) => {
          e.stopPropagation();
          clearCloseTimer();
          setOpen((v) => !v);
        }}
      >
        i
      </button>
      {tooltip}
    </span>
  );
}
