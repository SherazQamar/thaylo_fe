"use client";

import type { PointerEvent, ReactNode } from "react";

type ClassMediaControlsProps = {
  micEnabled: boolean;
  cameraEnabled: boolean;
  cameraLocked?: boolean;
  pushToTalkActive?: boolean;
  onPushToTalkStart: () => void;
  onPushToTalkEnd: () => void;
  onToggleCamera: () => void;
  onEndCall: () => void;
  variant?: "bar" | "overlay";
};

function ControlButton({
  active,
  danger,
  disabled,
  onClick,
  onPointerDown,
  onPointerUp,
  onPointerLeave,
  label,
  compact,
  children,
}: {
  active?: boolean;
  danger?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  onPointerDown?: (event: PointerEvent<HTMLButtonElement>) => void;
  onPointerUp?: () => void;
  onPointerLeave?: () => void;
  label: string;
  compact?: boolean;
  children: ReactNode;
}) {
  const size = compact ? "w-10 h-10" : "w-12 h-12";
  const dangerSize = compact ? "w-11 h-10" : "w-14 h-12";

  return (
    <button
      type="button"
      onClick={onClick}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerLeave}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={
        "flex items-center justify-center transition-colors select-none touch-none " +
        (disabled
          ? `${size} rounded-full bg-[#313044] opacity-50 cursor-not-allowed`
          : "cursor-pointer " +
            (danger
              ? `${dangerSize} rounded-full bg-[#EF4444] hover:bg-[#DC2626]`
              : `${size} rounded-full ` +
                (active
                  ? "bg-[#00CED1]/25 border border-[#00CED1]/55"
                  : "bg-black/55 hover:bg-black/70 border border-white/15")))
      }
    >
      {children}
    </button>
  );
}

export default function ClassMediaControls({
  micEnabled,
  cameraEnabled,
  cameraLocked = false,
  pushToTalkActive = false,
  onPushToTalkStart,
  onPushToTalkEnd,
  onToggleCamera,
  onEndCall,
  variant = "bar",
}: ClassMediaControlsProps) {
  const stroke = "rgba(255,255,255,0.85)";
  const cameraOffBlocked = cameraLocked && cameraEnabled;
  const compact = variant === "overlay";
  const listening = pushToTalkActive || micEnabled;

  return (
    <div
      className={
        compact
          ? "pointer-events-auto flex items-center justify-start gap-1.5"
          : "flex items-center justify-center gap-3 md:gap-4 py-2 flex-shrink-0 flex-wrap"
      }
    >
      <ControlButton
        compact={compact}
        active={listening}
        onPointerDown={(event) => {
          event.preventDefault();
          onPushToTalkStart();
        }}
        onPointerUp={onPushToTalkEnd}
        onPointerLeave={() => {
          if (listening) onPushToTalkEnd();
        }}
        label={listening ? "Release to send question" : "Hold to ask a question"}
      >
        {listening ? (
          <svg
            width={compact ? 18 : 20}
            height={compact ? 18 : 20}
            viewBox="0 0 24 24"
            fill="none"
            stroke="#00CED1"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
            <path d="M19 10v2a7 7 0 01-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
          </svg>
        ) : (
          <svg
            width={compact ? 18 : 20}
            height={compact ? 18 : 20}
            viewBox="0 0 24 24"
            fill="none"
            stroke={stroke}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
            <path d="M19 10v2a7 7 0 01-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
          </svg>
        )}
      </ControlButton>

      <ControlButton
        compact={compact}
        active={cameraEnabled}
        disabled={cameraOffBlocked}
        onClick={onToggleCamera}
        label={
          cameraOffBlocked
            ? "Camera must stay on during class"
            : cameraEnabled
              ? "Turn off camera"
              : "Turn on camera"
        }
      >
        {cameraEnabled ? (
          <svg
            width={compact ? 18 : 20}
            height={compact ? 18 : 20}
            viewBox="0 0 24 24"
            fill="none"
            stroke={stroke}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M23 7l-7 5 7 5V7z" />
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
          </svg>
        ) : (
          <svg
            width={compact ? 18 : 20}
            height={compact ? 18 : 20}
            viewBox="0 0 24 24"
            fill="none"
            stroke="#FF7B7B"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M16 16v1a2 2 0 01-2 2H3a2 2 0 01-2-2V7a2 2 0 012-2h2m5.66 0H14a2 2 0 012 2v3.34l1 1L23 7v10" />
            <line x1="1" y1="1" x2="23" y2="23" />
          </svg>
        )}
      </ControlButton>

      <ControlButton compact={compact} danger onClick={onEndCall} label="Leave class">
        <svg
          width={compact ? 18 : 22}
          height={compact ? 18 : 22}
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M10.68 13.31a16 16 0 003.41 2.6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7 2 2 0 011.72 2v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
      </ControlButton>
    </div>
  );
}
