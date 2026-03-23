"use client";

import React, { useState } from "react";
import Image from "next/image";
import ChildUserDropdown from "@/components/child/ChildUserDropdown";

const inter = { fontFamily: "Inter, sans-serif" } as const;

export default function ChildMessagePage() {
  const [message, setMessage] = useState("");

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 md:px-6 pt-4 pb-2 flex-shrink-0">
        <h1 className="uppercase" style={{ ...inter, fontWeight: 700, fontSize: "22px", letterSpacing: "0.8px", color: "#DCE6EC" }}>
          Message
        </h1>
        <div className="hidden md:block">
          <ChildUserDropdown />
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-h-0 mx-4 md:mx-6 mb-4 rounded-[16px] overflow-hidden" style={{ backgroundColor: "#1a1930" }}>
        {/* Chat Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 flex-shrink-0">
          <div>
            <h2 style={{ ...inter, fontWeight: 700, fontSize: "16px", color: "#FFFFFF" }}>Group Chat</h2>
            <p style={{ ...inter, fontWeight: 400, fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>Wayfinder, Mom, Alex</p>
          </div>
          <div className="flex items-center gap-2 rounded-[10px] px-3 py-2" style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <span style={{ ...inter, fontWeight: 400, fontSize: "11px", color: "rgba(255,255,255,0.4)", lineHeight: "14px" }}>
              This chat is for lesson updates and<br />learning-related discussion only.
            </span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto scrollbar-hide px-5 py-4 flex flex-col gap-5">
          {/* Date */}
          <p className="text-center" style={{ ...inter, fontWeight: 500, fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>
            Today 10:27am
          </p>

          {/* Mom message */}
          <div className="flex items-start gap-2.5 max-w-[80%]">
            <div className="w-9 h-9 rounded-full bg-[#525162] overflow-hidden flex-shrink-0">
              <Image src="/assets/wayfinder Em.png" alt="Mom" width={36} height={36} className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="inline-block rounded-full px-2.5 py-0.5 mb-1" style={{ backgroundColor: "#313044", ...inter, fontWeight: 600, fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>
                Mom
              </span>
              <div className="rounded-[16px] rounded-tl-[4px] px-4 py-2.5" style={{ backgroundColor: "#00CED1" }}>
                <p style={{ ...inter, fontWeight: 400, fontSize: "14px", color: "#FFFFFF" }}>
                  Alex, how&apos;s your 4th Grade English going? What did you learn today?
                </p>
              </div>
            </div>
          </div>

          {/* User reply */}
          <div className="flex justify-end">
            <div className="rounded-[16px] rounded-tr-[4px] px-4 py-2.5 max-w-[70%]" style={{ backgroundColor: "#313044" }}>
              <p style={{ ...inter, fontWeight: 400, fontSize: "14px", color: "rgba(255,255,255,0.85)" }}>
                Hi Mom! I learned about main ideas and new vocabulary words.
              </p>
            </div>
          </div>

          {/* Wayfinder message */}
          <div className="flex items-start gap-2.5 max-w-[80%]">
            <div className="w-9 h-9 rounded-full bg-[#00CED1]/20 flex items-center justify-center flex-shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00CED1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            </div>
            <div>
              <span className="inline-block rounded-full px-2.5 py-0.5 mb-1" style={{ backgroundColor: "#313044", ...inter, fontWeight: 600, fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>
                Wayfinder
              </span>
              <div className="rounded-[16px] rounded-tl-[4px] px-4 py-2.5" style={{ backgroundColor: "#00CED1" }}>
                <p style={{ ...inter, fontWeight: 400, fontSize: "14px", color: "#FFFFFF" }}>
                  That sounds great! Alex did very well today. Do you remember the main idea of the story?
                </p>
              </div>
            </div>
          </div>

          {/* User reply */}
          <div className="flex justify-end">
            <div className="rounded-[16px] rounded-tr-[4px] px-4 py-2.5 max-w-[70%]" style={{ backgroundColor: "#313044" }}>
              <p style={{ ...inter, fontWeight: 400, fontSize: "14px", color: "rgba(255,255,255,0.85)" }}>
                The main idea was about a magical garden. My favorite new word is &quot;gleaming&quot;!
              </p>
            </div>
          </div>

          {/* Help Bot */}
          <div className="flex justify-center mt-4">
            <div className="flex items-center gap-2.5 rounded-full px-4 py-2 relative" style={{ backgroundColor: "#313044" }}>
              <div className="w-10 h-10 rounded-full bg-[#00CED1]/20 flex items-center justify-center flex-shrink-0">
                <span className="text-xl">🤖</span>
              </div>
              <span style={{ ...inter, fontWeight: 500, fontSize: "14px", color: "rgba(255,255,255,0.7)" }}>
                Need help? Say &quot;<span className="text-[#00CED1] font-bold">WayFinder</span>&quot;
              </span>
              <button className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#525162] flex items-center justify-center cursor-pointer">
                <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                  <path d="M1 1l8 8M9 1l-8 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Message Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-t border-white/5 flex-shrink-0">
          <button className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer flex-shrink-0 text-[#00CED1]">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
            </svg>
          </button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message"
            className="flex-1 px-4 py-2.5 rounded-[12px] bg-[#313044] text-white text-sm outline-none placeholder:text-white/30"
            style={inter}
          />
          <button className="flex-shrink-0 text-[#00CED1] cursor-pointer hover:opacity-80">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
