"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";

const inter = { fontFamily: "Inter, sans-serif" } as const;

interface ChatMessage {
  sender: string;
  role: "parent" | "wayfinder";
  text: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    sender: "Martha",
    role: "parent",
    text: "Hi, I wanted to discuss Alice's progress in the Math module. She seems to be struggling a bit.",
  },
  {
    sender: "Wayfinder",
    role: "wayfinder",
    text: "Hi Martha! Thanks for reaching out. I've reviewed Alice's recent sessions and noticed the same. Let's set up a call?",
  },
  {
    sender: "Martha",
    role: "parent",
    text: "That would be great! When are you available this week?",
  },
];

interface AlertChatDrawerProps {
  open: boolean;
  onClose: () => void;
}

function MessageRow({ message }: { message: ChatMessage }) {
  const isWayfinder = message.role === "wayfinder";

  return (
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-full shrink-0 overflow-hidden bg-[#525162] flex items-center justify-center">
        {isWayfinder ? (
          <Image src="/assets/wayfinder-symbol.png" alt="" width={40} height={40} className="w-full h-full object-cover" />
        ) : (
          <Image src="/assets/wayfinder Em.png" alt="" width={40} height={40} className="w-full h-full object-cover" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white/70 text-xs font-medium mb-1.5">{message.sender}</p>
        <div
          className="rounded-2xl px-4 py-2.5 text-sm leading-relaxed max-w-[95%]"
          style={{
            backgroundColor: isWayfinder ? "#00CED1" : "#525162",
            color: isWayfinder ? "#111023" : "#FFFFFF",
          }}
        >
          {message.text}
        </div>
      </div>
    </div>
  );
}

export default function AlertChatDrawer({ open, onClose }: AlertChatDrawerProps) {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [draft, setDraft] = useState("");

  function handleSend(e: FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { sender: "Wayfinder", role: "wayfinder", text }]);
    setDraft("");
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-200 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-[400px] flex flex-col transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ backgroundColor: "#313044", ...inter }}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
          <h2 className="text-white text-lg font-bold">Chat</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center text-white/60 hover:text-white cursor-pointer"
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-5 pt-5">
          <div className="rounded-2xl px-4 py-3 flex items-center justify-between" style={{ backgroundColor: "#1c1b2e" }}>
            <div className="flex items-center gap-3 min-w-0">
              <Image src="/assets/wayfinder Em.png" alt="" width={40} height={40} className="w-10 h-10 rounded-full object-cover" />
              <p className="text-white text-sm font-semibold truncate">Martha Johnson</p>
            </div>
            <span className="text-[#00CED1] text-xs font-medium shrink-0">Online</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-4">
          {messages.map((message, index) => (
            <MessageRow key={`${message.sender}-${index}`} message={message} />
          ))}
        </div>

        <form onSubmit={handleSend} className="px-5 pb-5 pt-1 flex items-center gap-3">
          <button
            type="button"
            className="w-9 h-9 rounded-full bg-[#00CED1]/15 border border-[#00CED1]/40 flex items-center justify-center text-[#00CED1] shrink-0 hover:bg-[#00CED1]/25 cursor-pointer"
            aria-label="Attach"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Message"
              className="w-full pl-4 pr-11 py-2.5 rounded-full bg-white text-[#111023] text-sm outline-none border border-transparent focus:border-[#00CED1]/40 placeholder:text-[#111023]/40"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-[#00CED1] hover:bg-[#00CED1]/10 cursor-pointer"
              aria-label="Send"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </button>
          </div>
        </form>
      </aside>
    </>
  );
}
