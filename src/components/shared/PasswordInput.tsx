"use client";

import React, { useState } from "react";

type PasswordVisibilityToggleProps = {
  visible: boolean;
  onToggle: () => void;
  label: string;
  className?: string;
};

export function PasswordVisibilityToggle({
  visible,
  onToggle,
  label,
  className = "absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors",
}: PasswordVisibilityToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={label}
      className={className}
    >
      {visible ? (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
          <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
      ) : (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )}
    </button>
  );
}

type PasswordInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  containerClassName?: string;
  toggleClassName?: string;
  toggleLabel?: string;
};

export default function PasswordInput({
  className = "",
  containerClassName = "relative",
  toggleClassName,
  toggleLabel = "Toggle password visibility",
  style,
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className={containerClassName}>
      <input
        {...props}
        type={visible ? "text" : "password"}
        className={`${className} pr-12`.trim()}
        style={style}
      />
      <PasswordVisibilityToggle
        visible={visible}
        onToggle={() => setVisible((v) => !v)}
        label={toggleLabel}
        className={toggleClassName}
      />
    </div>
  );
}
