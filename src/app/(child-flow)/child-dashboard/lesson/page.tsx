"use client";

import React, { useState } from "react";
import Image from "next/image";
import ChildUserDropdown from "@/components/child/ChildUserDropdown";

const inter = { fontFamily: "Inter, sans-serif" } as const;

const messages = [
  { sender: "ai", text: "Please tell me about antonyms.", time: "6:00 PM", avatar: true },
  { sender: "user", text: "Alright, let me explain it you again in a different way.", time: "6:05 PM" },
  { sender: "system", text: "Select the answer:", time: "" },
  {
    sender: "quiz",
    question: "Write your own sentences using new words.",
    options: ["Option 1", "Option 2", "Option 3"],
    time: "5:00 PM",
  },
];

export default function LessonPage() {
  const [selectedOption, setSelectedOption] = useState(0);
  const [messageInput, setMessageInput] = useState("");

  return (
    <div className="flex flex-col h-full overflow-y-auto lg:overflow-hidden scrollbar-hide">
      {/* Header */}
      <div className="flex items-center justify-end px-4 md:px-6 pt-4 pb-2 flex-shrink-0">
        <div className="hidden md:block">
          <ChildUserDropdown />
        </div>
      </div>

      {/* Two column layout */}
      <div className="flex flex-col lg:flex-row lg:flex-1 lg:min-h-0 px-4 md:px-6 pb-4 lg:overflow-hidden">
        {/* Left - Video Area */}
        <div className="flex-1 min-w-0 flex flex-col gap-3">
          {/* Module Header */}
          <div
            className="rounded-[12px] px-4 py-3 md:px-5 md:py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
            style={{ backgroundColor: "#313044" }}
          >
            <div>
              <p style={{ ...inter, fontWeight: 500, fontSize: "11px", color: "rgba(255,255,255,0.5)", letterSpacing: "1px", textTransform: "uppercase" }}>
                Module 1
              </p>
              <p style={{ ...inter, fontWeight: 700, fontSize: "18px", color: "#FFFFFF", marginTop: "2px" }}>
                Foundations of Reading
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <span style={{ ...inter, fontWeight: 500, fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>Quick Check coming up</span>
              {/* Progress dots */}
              <div className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-full bg-[#00CED1]" />
                <div className="w-8 h-1 rounded-full bg-[#00CED1]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                <div className="w-8 h-1 rounded-full bg-[#525162]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#525162]" />
              </div>
            </div>
          </div>

          {/* Video Container */}
          <div className="flex-1 rounded-[16px] overflow-hidden relative bg-[#1a1a2e] min-h-[250px]">
            {/* Placeholder classroom image */}
            <div className="w-full h-full bg-gradient-to-br from-[#2d1b4e] to-[#1a1a2e] flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-[#525162] mx-auto mb-4 flex items-center justify-center">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#00CED1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </div>
                <p style={{ ...inter, fontWeight: 600, fontSize: "16px", color: "rgba(255,255,255,0.5)" }}>
                  Grade 4 English Lesson
                </p>
                <p style={{ ...inter, fontWeight: 400, fontSize: "13px", color: "rgba(255,255,255,0.3)", marginTop: "4px" }}>
                  Foundations of Reading — Live Session
                </p>
              </div>
            </div>

            {/* Small self-view */}
            <div className="absolute bottom-4 right-4 w-[120px] h-[90px] rounded-[12px] bg-[#313044] border-2 border-[#525162] overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-[#3d2b5e] to-[#2a2a4e] flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
              </div>
            </div>
          </div>

          {/* Video Controls */}
          <div className="flex items-center justify-center gap-4 py-2 flex-shrink-0">
            {/* Mic */}
            <button className="w-12 h-12 rounded-full bg-[#313044] flex items-center justify-center cursor-pointer hover:bg-[#424056] transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="1" y1="1" x2="23" y2="23" />
                <path d="M9 9v3a3 3 0 005.12 2.12M15 9.34V4a3 3 0 00-5.94-.6" />
                <path d="M17 16.95A7 7 0 015 12v-2m14 0v2c0 .76-.13 1.49-.36 2.18" />
                <line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            </button>
            {/* Camera */}
            <button className="w-12 h-12 rounded-full bg-[#313044] flex items-center justify-center cursor-pointer hover:bg-[#424056] transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 7l-7 5 7 5V7z" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
              </svg>
            </button>
            {/* Screen share */}
            <button className="w-12 h-12 rounded-full bg-[#313044] flex items-center justify-center cursor-pointer hover:bg-[#424056] transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            </button>
            {/* End call */}
            <button className="w-14 h-12 rounded-full bg-[#EF4444] flex items-center justify-center cursor-pointer hover:bg-[#DC2626] transition-colors">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.68 13.31a16 16 0 003.41 2.6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7 2 2 0 011.72 2v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            </button>
          </div>
        </div>

        {/* Right - Text Chat */}
        <div className="w-full lg:w-[300px] flex-shrink-0 lg:ml-3 flex flex-col rounded-[16px] mt-4 lg:mt-0 min-h-[400px] lg:min-h-0" style={{ backgroundColor: "#1a1930", border: "1px solid rgba(255,255,255,0.05)" }}>
          {/* Chat Header */}
          <div className="px-4 py-3 border-b border-white/5 flex-shrink-0">
            <h3 style={{ ...inter, fontWeight: 700, fontSize: "16px", color: "#FFFFFF" }}>Text Mode</h3>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-3 flex flex-col gap-3">
            {/* AI Message */}
            <div className="flex items-start gap-2">
              <div className="w-7 h-7 rounded-full bg-[#00CED1] flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="12" cy="12" r="3" /></svg>
              </div>
              <div>
                <div className="rounded-[12px] rounded-tl-none px-3 py-2" style={{ backgroundColor: "#313044" }}>
                  <p style={{ ...inter, fontWeight: 400, fontSize: "13px", color: "rgba(255,255,255,0.8)" }}>Please tell me about antonyms.</p>
                </div>
                <p className="mt-1" style={{ ...inter, fontWeight: 400, fontSize: "10px", color: "#00CED1" }}>6:00 PM</p>
              </div>
            </div>

            {/* User Message */}
            <div className="flex flex-col items-end">
              <div className="flex items-start gap-2">
                <div>
                  <div className="rounded-[12px] rounded-tr-none px-3 py-2" style={{ backgroundColor: "#525162" }}>
                    <p style={{ ...inter, fontWeight: 400, fontSize: "13px", color: "rgba(255,255,255,0.8)" }}>Alright, let me explain it you again in a different way.</p>
                  </div>
                  <p className="mt-1 text-right" style={{ ...inter, fontWeight: 400, fontSize: "10px", color: "#00CED1" }}>6:05 PM</p>
                </div>
                <div className="w-7 h-7 rounded-full bg-[#525162] overflow-hidden flex-shrink-0 mt-0.5">
                  <Image src="/assets/wayfinder Em.png" alt="User" width={28} height={28} className="w-full h-full object-cover" />
                </div>
              </div>
            </div>

            {/* System prompt */}
            <div className="flex items-center justify-end gap-2">
              <span style={{ ...inter, fontWeight: 500, fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>Select the answer:</span>
              <div className="w-7 h-7 rounded-full bg-[#525162] overflow-hidden flex-shrink-0">
                <Image src="/assets/wayfinder Em.png" alt="User" width={28} height={28} className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Quiz Card */}
            <div className="rounded-[16px] p-4" style={{ backgroundColor: "#313044" }}>
              <p style={{ ...inter, fontWeight: 600, fontSize: "14px", color: "#FFFFFF", marginBottom: "12px" }}>
                Write your own sentences using new words.
              </p>
              <div className="flex flex-col gap-2.5 mb-4">
                {["Option 1", "Option 2", "Option 3"].map((opt, i) => (
                  <label
                    key={i}
                    className="flex items-center gap-2.5 cursor-pointer"
                    onClick={() => setSelectedOption(i)}
                  >
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        selectedOption === i ? "border-[#00CED1]" : "border-white/30"
                      }`}
                    >
                      {selectedOption === i && <div className="w-2 h-2 rounded-full bg-[#00CED1]" />}
                    </div>
                    <span style={{ ...inter, fontWeight: 400, fontSize: "13px", color: "rgba(255,255,255,0.8)" }}>{opt}</span>
                  </label>
                ))}
              </div>
              <button
                className="w-full py-3 rounded-[12px] cursor-pointer hover:opacity-90 transition-opacity"
                style={{ backgroundColor: "#00CED1", ...inter, fontWeight: 700, fontSize: "14px", color: "#FFFFFF" }}
              >
                Submit
              </button>
            </div>

            <p className="text-right" style={{ ...inter, fontWeight: 400, fontSize: "10px", color: "#00CED1" }}>5:00 PM</p>
          </div>

          {/* Message Input */}
          <div className="px-3 py-3 border-t border-white/5 flex items-center gap-2 flex-shrink-0 overflow-hidden">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Message"
              className="flex-1 min-w-0 px-3 py-2.5 rounded-[12px] bg-[#313044] text-white text-sm outline-none placeholder:text-white/30"
              style={inter}
            />
            {/* Send */}
            <button className="w-8 h-8 rounded-full bg-[#00CED1] flex items-center justify-center cursor-pointer hover:opacity-90 flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
            {/* Attach */}
            <button className="w-8 h-8 rounded-full bg-[#313044] flex items-center justify-center cursor-pointer hover:opacity-80 flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
              </svg>
            </button>
            {/* Check */}
            <button className="w-8 h-8 rounded-full bg-[#00CED1] flex items-center justify-center cursor-pointer hover:opacity-90 flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
