"use client";

import { useEffect, useRef, useState } from "react";
import type { ClassChatMessage } from "@/lib/calyx-class-chat";

const inter = { fontFamily: "Inter, sans-serif" } as const;

type ClassTextChatProps = {
  messages: ClassChatMessage[];
  isTyping: boolean;
  onSend: (text: string) => void;
  showQuickCheck?: boolean;
  onQuickCheckSubmit?: (answerIndex: number) => void;
};

const QUICK_CHECK_OPTIONS = ["Glad", "Happy", "Thrilled", "Ecstatic"];

export default function ClassTextChat({
  messages,
  isTyping,
  onSend,
  showQuickCheck = false,
  onQuickCheckSubmit,
}: ClassTextChatProps) {
  const [input, setInput] = useState("");
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quickCheckSubmitted, setQuickCheckSubmitted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping, showQuickCheck]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    onSend(text);
    setInput("");
  };

  const handleQuickCheck = () => {
    if (selectedOption === null || quickCheckSubmitted) return;
    setQuickCheckSubmitted(true);
    onQuickCheckSubmit?.(selectedOption);
  };

  return (
    <div
      className="w-full lg:w-[320px] xl:w-[340px] flex-shrink-0 flex flex-col rounded-[16px] min-h-[420px] lg:min-h-0 lg:h-full"
      style={{ backgroundColor: "#1a1930", border: "1px solid rgba(255,255,255,0.05)" }}
    >
      <div className="px-4 py-3 border-b border-white/5 flex-shrink-0 flex items-center justify-between">
        <h3 style={{ ...inter, fontWeight: 700, fontSize: "16px", color: "#FFFFFF" }}>Text Mode</h3>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#00CED1]" style={inter}>
          Calyx
        </span>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-hide px-4 py-3 flex flex-col gap-3 min-h-0">
        {messages.map((message) => (
          <ChatBubble key={message.id} message={message} />
        ))}

        {isTyping && (
          <div className="flex items-start gap-2">
            <CalyxAvatar />
            <div className="rounded-[12px] rounded-tl-none px-3 py-2.5" style={{ backgroundColor: "#313044" }}>
              <div className="flex gap-1">
                {[0, 1, 2].map((dot) => (
                  <span
                    key={dot}
                    className="w-1.5 h-1.5 rounded-full bg-[#00CED1] animate-pulse"
                    style={{ animationDelay: `${dot * 150}ms` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {showQuickCheck && (
          <div className="rounded-[16px] p-4" style={{ backgroundColor: "#313044" }}>
            <p style={{ ...inter, fontWeight: 600, fontSize: "14px", color: "#FFFFFF", marginBottom: "4px" }}>
              Quick Check
            </p>
            <p style={{ ...inter, fontWeight: 400, fontSize: "12px", color: "rgba(255,255,255,0.55)", marginBottom: "12px" }}>
              Which word shows the strongest feeling?
            </p>
            <div className="flex flex-col gap-2 mb-4">
              {QUICK_CHECK_OPTIONS.map((opt, index) => (
                <label
                  key={opt}
                  className={
                    "flex items-center gap-2.5 cursor-pointer rounded-lg px-2 py-1.5 " +
                    (quickCheckSubmitted ? "opacity-80" : "hover:bg-white/5")
                  }
                  onClick={() => !quickCheckSubmitted && setSelectedOption(index)}
                >
                  <div
                    className={
                      "w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 " +
                      (selectedOption === index ? "border-[#00CED1]" : "border-white/30")
                    }
                  >
                    {selectedOption === index && <div className="w-2 h-2 rounded-full bg-[#00CED1]" />}
                  </div>
                  <span style={{ ...inter, fontWeight: 400, fontSize: "13px", color: "rgba(255,255,255,0.85)" }}>
                    {opt}
                  </span>
                </label>
              ))}
            </div>
            <button
              type="button"
              disabled={selectedOption === null || quickCheckSubmitted}
              onClick={handleQuickCheck}
              className="w-full py-3 rounded-[12px] cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#00CED1", ...inter, fontWeight: 700, fontSize: "14px", color: "#111023" }}
            >
              {quickCheckSubmitted ? "Submitted" : "Submit"}
            </button>
          </div>
        )}
      </div>

      <div className="px-3 py-3 border-t border-white/5 flex items-center gap-2 flex-shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Message Calyx…"
          className="flex-1 min-w-0 px-3 py-2.5 rounded-[12px] bg-[#313044] text-white text-sm outline-none placeholder:text-white/30 border border-transparent focus:border-[#00CED1]/40"
          style={inter}
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={!input.trim() || isTyping}
          className="w-9 h-9 rounded-full bg-[#00CED1] flex items-center justify-center cursor-pointer hover:opacity-90 flex-shrink-0 disabled:opacity-40"
          aria-label="Send message"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#111023" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function CalyxAvatar() {
  return (
    <div className="w-7 h-7 rounded-full bg-[#00CED1] flex items-center justify-center flex-shrink-0 mt-0.5">
      <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "11px", color: "#111023" }}>C</span>
    </div>
  );
}

function ChildAvatar() {
  return (
    <div className="w-7 h-7 rounded-full bg-[#525162] flex items-center justify-center flex-shrink-0 mt-0.5">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    </div>
  );
}

function ChatBubble({ message }: { message: ClassChatMessage }) {
  const isChild = message.role === "child";

  if (isChild) {
    return (
      <div className="flex flex-col items-end">
        <div className="flex items-start gap-2 max-w-[92%]">
          <div className="min-w-0">
            <div className="rounded-[12px] rounded-tr-none px-3 py-2" style={{ backgroundColor: "#525162" }}>
              <p style={{ ...inter, fontWeight: 400, fontSize: "13px", color: "rgba(255,255,255,0.9)" }}>
                {message.text}
              </p>
            </div>
            <p className="mt-1 text-right" style={{ ...inter, fontWeight: 400, fontSize: "10px", color: "#00CED1" }}>
              {message.time}
            </p>
          </div>
          <ChildAvatar />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2 max-w-[92%]">
      <CalyxAvatar />
      <div>
        <div className="rounded-[12px] rounded-tl-none px-3 py-2" style={{ backgroundColor: "#313044" }}>
          <p style={{ ...inter, fontWeight: 400, fontSize: "13px", color: "rgba(255,255,255,0.88)" }}>
            {message.text}
          </p>
        </div>
        <p className="mt-1" style={{ ...inter, fontWeight: 400, fontSize: "10px", color: "#00CED1" }}>
          {message.time}
        </p>
      </div>
    </div>
  );
}
