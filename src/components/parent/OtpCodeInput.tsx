"use client";

import React, { useRef } from "react";

const inter = { fontFamily: "Inter, sans-serif" } as const;

interface OtpCodeInputProps {
  digits: string[];
  onChange: (digits: string[]) => void;
  disabled?: boolean;
}

export default function OtpCodeInput({
  digits,
  onChange,
  disabled = false,
}: OtpCodeInputProps) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  function updateDigit(index: number, value: string) {
    if (!/^\d?$/.test(value)) return;
    const next = [...digits];
    next[index] = value;
    onChange(next);
    if (value && index < digits.length - 1) {
      refs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const next = [...digits];
    for (let i = 0; i < 6; i++) {
      next[i] = pasted[i] ?? "";
    }
    onChange(next);
    const focusIndex = Math.min(pasted.length, 5);
    refs.current[focusIndex]?.focus();
  }

  return (
    <div
      className="rounded-[16px] bg-[#111023] px-4 py-5 border border-[#525162]/40"
      onPaste={handlePaste}
    >
      <div className="grid grid-cols-6 gap-2 sm:gap-3">
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            disabled={disabled}
            onChange={(e) => updateDigit(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            aria-label={`Digit ${i + 1}`}
            className="w-full text-center rounded-[10px] bg-transparent text-[#60D624] text-xl sm:text-2xl font-bold outline-none border border-[#525162]/60 focus:border-[#00CED1]/60 transition-colors disabled:opacity-50"
            style={{ ...inter, padding: "12px 0", height: "52px" }}
          />
        ))}
      </div>
    </div>
  );
}
