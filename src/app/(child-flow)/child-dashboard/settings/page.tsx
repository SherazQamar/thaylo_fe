"use client";

import React, { useState } from "react";
import ChildUserDropdown from "@/components/child/ChildUserDropdown";

const inter = { fontFamily: "Inter, sans-serif" } as const;

export default function ChildSettingsPage() {
  const [activeTab, setActiveTab] = useState<"general" | "preferences">("general");
  const [soundEffects, setSoundEffects] = useState(true);
  const [speakingExercises, setSpeakingExercises] = useState(true);

  return (
    <div className="p-4 md:p-5 lg:p-6 overflow-y-auto scrollbar-hide h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="uppercase" style={{ ...inter, fontWeight: 700, fontSize: "22px", letterSpacing: "0.8px", color: "#DCE6EC" }}>
          Settings
        </h1>
        <div className="hidden md:block">
          <ChildUserDropdown />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 mb-6 border-b border-white/10">
        <button
          onClick={() => setActiveTab("general")}
          className={`pb-2.5 cursor-pointer transition-colors ${activeTab === "general" ? "border-b-2 border-[#00CED1] text-[#00CED1]" : "text-white/40 hover:text-white/60"}`}
          style={{ ...inter, fontWeight: 500, fontSize: "14px" }}
        >
          General Settings
        </button>
        <button
          onClick={() => setActiveTab("preferences")}
          className={`pb-2.5 cursor-pointer transition-colors ${activeTab === "preferences" ? "border-b-2 border-[#00CED1] text-[#00CED1]" : "text-white/40 hover:text-white/60"}`}
          style={{ ...inter, fontWeight: 500, fontSize: "14px" }}
        >
          Learning Preferences
        </button>
      </div>

      {activeTab === "general" ? (
        <>
          {/* General Settings */}
          <div className="mb-6">
            <h2 style={{ ...inter, fontWeight: 700, fontSize: "20px", color: "#FFFFFF", marginBottom: "4px" }}>General Settings</h2>
            <p style={{ ...inter, fontWeight: 400, fontSize: "14px", color: "rgba(255,255,255,0.5)" }}>
              Customize your daily goals, difficulty settings, and study focus.
            </p>
          </div>

          {/* Profile Card */}
          <div className="rounded-[16px] p-5 mb-6" style={{ backgroundColor: "#313044" }}>
            <div className="flex items-center gap-4">
              <div
                className="w-[80px] h-[80px] rounded-full flex items-center justify-center flex-shrink-0"
                style={{ border: "2px dashed #00CED1" }}
              >
                <div className="w-8 h-8 rounded-full bg-[#525162] flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </div>
              </div>
              <div>
                <p style={{ ...inter, fontWeight: 700, fontSize: "18px", color: "#FFFFFF" }}>Allex Filler</p>
                <p style={{ ...inter, fontWeight: 400, fontSize: "14px", color: "rgba(255,255,255,0.5)", marginTop: "2px" }}>AllexFiller705842@gmail.com</p>
                <button
                  className="rounded-full px-4 py-1.5 mt-2 cursor-pointer hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: "#00CED1", ...inter, fontWeight: 600, fontSize: "12px", color: "#111023" }}
                >
                  Upload Photo
                </button>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 style={{ ...inter, fontWeight: 700, fontSize: "16px", color: "#FFFFFF" }}>Personal Information</h3>
            </div>
            <div className="flex items-center gap-1.5 mb-5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              <span style={{ ...inter, fontWeight: 400, fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>Managed by parent</span>
            </div>

            <div className="border-t border-white/10 pt-5">
              {/* First Name + Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label style={{ ...inter, fontWeight: 500, fontSize: "13px", color: "rgba(255,255,255,0.7)", display: "block", marginBottom: "6px" }}>
                    First Name
                  </label>
                  <input
                    type="text"
                    defaultValue="Allex"
                    className="w-full rounded-full px-5 py-3 outline-none text-white/50"
                    style={{ backgroundColor: "#313044", border: "1px solid #525162", ...inter, fontSize: "14px" }}
                    readOnly
                  />
                </div>
                <div>
                  <label style={{ ...inter, fontWeight: 500, fontSize: "13px", color: "rgba(255,255,255,0.7)", display: "block", marginBottom: "6px" }}>
                    Last Name
                  </label>
                  <input
                    type="text"
                    defaultValue="Filler"
                    className="w-full rounded-full px-5 py-3 outline-none text-white/50"
                    style={{ backgroundColor: "#313044", border: "1px solid #525162", ...inter, fontSize: "14px" }}
                    readOnly
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label style={{ ...inter, fontWeight: 500, fontSize: "13px", color: "rgba(255,255,255,0.7)", display: "block", marginBottom: "6px" }}>
                  Email Address
                </label>
                <input
                  type="email"
                  defaultValue="AllexFiller705842@gmail.com"
                  className="w-full rounded-full px-5 py-3 outline-none text-white/50"
                  style={{ backgroundColor: "#313044", border: "1px solid #525162", ...inter, fontSize: "14px" }}
                  readOnly
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Learning Preferences */}
          <div className="mb-6">
            <h2 style={{ ...inter, fontWeight: 700, fontSize: "20px", color: "#FFFFFF", marginBottom: "12px" }}>Preferences</h2>
            <div className="flex items-center gap-2 rounded-[10px] px-4 py-2.5 mb-6" style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              <span style={{ ...inter, fontWeight: 400, fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>
                Some settings are managed by parents
              </span>
            </div>

            <div className="rounded-[16px] p-5" style={{ backgroundColor: "#313044" }}>
              {/* Sound Effects */}
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#111023] flex items-center justify-center flex-shrink-0">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00CED1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" />
                    </svg>
                  </div>
                  <div>
                    <p style={{ ...inter, fontWeight: 600, fontSize: "14px", color: "#FFFFFF" }}>Sound Effects</p>
                    <p style={{ ...inter, fontWeight: 400, fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>Play sounds for correct answers and streaks.</p>
                  </div>
                </div>
                <button
                  onClick={() => setSoundEffects(!soundEffects)}
                  className="w-[44px] h-[24px] rounded-full relative cursor-pointer transition-colors flex-shrink-0"
                  style={{ backgroundColor: soundEffects ? "#00CED1" : "#525162" }}
                >
                  <div
                    className="w-[20px] h-[20px] rounded-full bg-white absolute top-[2px] transition-all"
                    style={{ left: soundEffects ? "22px" : "2px" }}
                  />
                </button>
              </div>

              <div className="border-t border-white/5" />

              {/* Speaking Exercises */}
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#111023] flex items-center justify-center flex-shrink-0">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00CED1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" /><path d="M19 10v2a7 7 0 01-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" />
                    </svg>
                  </div>
                  <div>
                    <p style={{ ...inter, fontWeight: 600, fontSize: "14px", color: "#FFFFFF" }}>Speaking Exercises</p>
                    <p style={{ ...inter, fontWeight: 400, fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>Use microphone for pronunciation practice</p>
                    <div className="flex items-center gap-1 mt-1">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
                      </svg>
                      <span style={{ ...inter, fontWeight: 400, fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>Requires parent approval. Audio is not stored.</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSpeakingExercises(!speakingExercises)}
                  className="w-[44px] h-[24px] rounded-full relative cursor-pointer transition-colors flex-shrink-0"
                  style={{ backgroundColor: speakingExercises ? "#00CED1" : "#525162" }}
                >
                  <div
                    className="w-[20px] h-[20px] rounded-full bg-white absolute top-[2px] transition-all"
                    style={{ left: speakingExercises ? "22px" : "2px" }}
                  />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
