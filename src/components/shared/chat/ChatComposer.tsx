"use client";
import { useRef, useState } from "react";

import { notify } from "@/lib/notify";

const inter = { fontFamily: "Inter, sans-serif" } as const;

type ChatComposerProps = {
  value: string;
  onChange: (value: string) => void;
  onSend: (file?: File | null) => void;
  onTyping?: () => void;
  disabled?: boolean;
  placeholder?: string;
};

function PlusIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="#00CED1" strokeWidth="1.75" />
      <path d="M12 8v8M8 12h8" stroke="#00CED1" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function SendIcon({ disabled }: { disabled?: boolean }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={disabled ? "opacity-40" : ""}
    >
      <path
        d="M22 2L11 13"
        stroke="#00CED1"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 2L15 22L11 13L2 9L22 2Z"
        stroke="#00CED1"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ChatComposer({
  value,
  onChange,
  onSend,
  onTyping,
  disabled = false,
  placeholder = "Message",
}: ChatComposerProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const canSend = !disabled && (value.trim().length > 0 || !!file);

  const allowedTypes = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ]);

  const validateFile = (nextFile: File) => {
    if (nextFile.size > 2 * 1024 * 1024) {
      return "Max file size is 2MB.";
    }
    if (!allowedTypes.has(nextFile.type)) {
      return "Only image, PDF, and Word files are allowed.";
    }
    return null;
  };

  return (
    <form
      className="relative flex items-center gap-2 sm:gap-3 px-3 sm:px-4 md:px-5 py-3 sm:py-4 border-t border-white/10 flex-shrink-0 min-w-0"
      onSubmit={(event) => {
        event.preventDefault();
        if (!canSend) return;
        onSend(file);
        setFile(null);
        if (inputRef.current) inputRef.current.value = "";
      }}
    >
      <button
        type="button"
        disabled={disabled}
        className="shrink-0 flex h-10 w-10 items-center justify-center rounded-full disabled:opacity-40"
        aria-label="Add attachment"
        onClick={() => inputRef.current?.click()}
      >
        <PlusIcon />
      </button>

      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept="image/*,.pdf,.doc,.docx"
        onChange={(event) => {
          const nextFile = event.target.files?.[0];
          if (!nextFile) return;
          const validation = validateFile(nextFile);
          if (validation) {
            notify.error(validation);
            setFile(null);
            event.target.value = "";
            return;
          }
          setFile(nextFile);
        }}
      />

      <input
        type="text"
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
          onTyping?.();
        }}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 min-w-[120px] w-full rounded-full bg-white px-4 sm:px-5 py-2.5 sm:py-3 text-sm text-[#111023] placeholder:text-[#757575] outline-none disabled:opacity-50"
        style={inter}
      />

      <button
        type="submit"
        disabled={!canSend}
        className="shrink-0 flex h-10 w-10 items-center justify-center disabled:cursor-not-allowed"
        aria-label="Send message"
      >
        <SendIcon disabled={!canSend} />
      </button>
      {file ? (
        <div className="absolute -top-7 left-16 text-[11px] text-[#00CED1]" style={inter}>
          {file.name}
        </div>
      ) : null}
    </form>
  );
}
