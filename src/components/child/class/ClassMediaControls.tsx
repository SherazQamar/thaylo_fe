"use client";

import type { ReactNode } from "react";

type ClassMediaControlsProps = {
  micEnabled: boolean;
  cameraEnabled: boolean;
  cameraLocked?: boolean;
  onToggleMic: () => void;
  onToggleCamera: () => void;
  onEndCall: () => void;
};

function ControlButton({
  active,
  danger,
  disabled,
  onClick,
  label,
  children,
}: {
  active?: boolean;
  danger?: boolean;
  disabled?: boolean;
  onClick: () => void;
  label: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={
        "flex items-center justify-center transition-colors " +
        (disabled
          ? "w-12 h-12 rounded-full bg-[#313044] opacity-50 cursor-not-allowed"
          : "cursor-pointer " +
            (danger
              ? "w-14 h-12 rounded-full bg-[#EF4444] hover:bg-[#DC2626]"
              : "w-12 h-12 rounded-full " +
                (active ? "bg-[#00CED1]/20 border border-[#00CED1]/50" : "bg-[#313044] hover:bg-[#424056]")))
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
  onToggleMic,
  onToggleCamera,
  onEndCall,
}: ClassMediaControlsProps) {
  const stroke = "rgba(255,255,255,0.75)";
  const cameraOffBlocked = cameraLocked && cameraEnabled;

  return (
    <div className="flex items-center justify-center gap-3 md:gap-4 py-2 flex-shrink-0 flex-wrap">
      <ControlButton active={micEnabled} onClick={onToggleMic} label={micEnabled ? "Mute microphone" : "Unmute microphone"}>
        {micEnabled ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
            <path d="M19 10v2a7 7 0 01-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF7B7B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="1" y1="1" x2="23" y2="23" />
            <path d="M9 9v3a3 3 0 005.12 2.12M15 9.34V4a3 3 0 00-5.94-.6" />
            <path d="M17 16.95A7 7 0 015 12v-2m14 0v2c0 .76-.13 1.49-.36 2.18" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
          </svg>
        )}
      </ControlButton>

      <ControlButton
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
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 7l-7 5 7 5V7z" />
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF7B7B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 16v1a2 2 0 01-2 2H3a2 2 0 01-2-2V7a2 2 0 012-2h2m5.66 0H14a2 2 0 012 2v3.34l1 1L23 7v10" />
            <line x1="1" y1="1" x2="23" y2="23" />
          </svg>
        )}
      </ControlButton>

      <ControlButton danger onClick={onEndCall} label="Leave class">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.68 13.31a16 16 0 003.41 2.6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7 2 2 0 011.72 2v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
      </ControlButton>
    </div>
  );
}
