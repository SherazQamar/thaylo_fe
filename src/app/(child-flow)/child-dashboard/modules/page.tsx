"use client";

import React, { useState } from "react";
import ChildUserDropdown from "@/components/child/ChildUserDropdown";

const inter = { fontFamily: "Inter, sans-serif" } as const;

const filters = ["All Modules", "In Progress", "Completed"];

const completedModules = [
  { num: 1, title: "Foundations of Reading", desc: "Review short stories, main ideas, and key details.", time: "15m" },
  { num: 2, title: "Grammar Basics", desc: "Learn nouns, verbs, adjectives, and sentence structure.", time: "15m" },
];

const currentModule = {
  num: 3,
  title: "Vocabulary & Word Meaning",
  desc: "Understand word meanings, synonyms, antonyms, and context clues.",
  progress: 60,
  levels: [
    { num: 1, title: "Word Meanings", desc: "Learn new words", status: "completed" },
    { num: 2, title: "Assignment", desc: "Write your own sentences using new words.", status: "not-mastered" },
  ],
};

const lockedModule = {
  num: 4,
  title: "Writing Skills",
  desc: "Practice paragraph writing, creative writing, and opinion sentences.",
};

export default function ModulesPage() {
  const [activeFilter, setActiveFilter] = useState("All Modules");

  return (
    <div className="p-4 md:p-5 lg:p-6 overflow-y-auto scrollbar-hide h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="uppercase" style={{ ...inter, fontWeight: 700, fontSize: "22px", letterSpacing: "0.8px", color: "#DCE6EC" }}>
          Modules
        </h1>
        <div className="hidden md:block">
          <ChildUserDropdown />
        </div>
      </div>

      {/* Hero Card */}
      <div className="rounded-[16px] p-6 md:p-8 mb-6" style={{ backgroundColor: "#313044" }}>
        <span
          className="inline-block rounded-full px-4 py-1 mb-4"
          style={{ backgroundColor: "#00CED1", ...inter, fontWeight: 700, fontSize: "12px", color: "#111023", letterSpacing: "1px" }}
        >
          GRADE 04
        </span>
        <h2 style={{ ...inter, fontWeight: 700, fontSize: "32px", lineHeight: "40px", color: "#FFFFFF", marginBottom: "6px" }}>
          English Language Arts
        </h2>
        <p style={{ ...inter, fontWeight: 600, fontSize: "16px", color: "rgba(255,255,255,0.7)", marginBottom: "20px" }}>
          Reading, Grammar &amp; Writing
        </p>

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="flex-1 max-w-[300px]">
            <div className="flex items-center justify-between mb-1.5">
              <span style={{ ...inter, fontWeight: 500, fontSize: "13px", color: "rgba(255,255,255,0.6)" }}>Overall Progress</span>
              <span style={{ ...inter, fontWeight: 700, fontSize: "14px", color: "#00CED1" }}>42%</span>
            </div>
            <div className="w-full h-[6px] bg-[#525162] rounded-full overflow-hidden mb-2">
              <div className="h-full w-[42%] bg-[#00CED1] rounded-full" />
            </div>
            <p style={{ ...inter, fontWeight: 400, fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>
              You are doing great. Keep practicing every day.
            </p>
          </div>
          <button
            className="rounded-full px-6 py-3 flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity flex-shrink-0"
            style={{ backgroundColor: "#00CED1", ...inter, fontWeight: 700, fontSize: "15px", color: "#FFFFFF" }}
          >
            Continue Module 3
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`rounded-full px-5 py-2 text-sm font-medium cursor-pointer transition-colors ${
              activeFilter === f
                ? "bg-[#00CED1] text-[#111023]"
                : "bg-[#313044] text-white/60 hover:text-white"
            }`}
            style={inter}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Completed Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {completedModules.map((mod) => (
          <div key={mod.num} className="rounded-[16px] p-5" style={{ backgroundColor: "#313044" }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-[#00CED1] flex items-center justify-center flex-shrink-0">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <span style={{ ...inter, fontWeight: 500, fontSize: "12px", color: "rgba(255,255,255,0.5)", letterSpacing: "0.5px", textTransform: "uppercase" }}>
                Module {mod.num}
              </span>
            </div>
            <h3 style={{ ...inter, fontWeight: 700, fontSize: "18px", color: "#FFFFFF", marginBottom: "6px" }}>{mod.title}</h3>
            <p style={{ ...inter, fontWeight: 400, fontSize: "13px", lineHeight: "18px", color: "rgba(255,255,255,0.5)", marginBottom: "16px" }}>
              {mod.desc}
            </p>
            <div className="flex items-center gap-1.5 mb-3">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
              <span style={{ ...inter, fontWeight: 500, fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>{mod.time}</span>
            </div>
            <div className="w-full h-[4px] bg-[#525162] rounded-full overflow-hidden mb-4">
              <div className="h-full w-full bg-[#00CED1] rounded-full" />
            </div>
            <button
              className="w-full rounded-full py-2.5 cursor-pointer hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "transparent", border: "1px solid #00CED1", ...inter, fontWeight: 600, fontSize: "14px", color: "#FFFFFF" }}
            >
              Review Module
            </button>
          </div>
        ))}
      </div>

      {/* Current Module */}
      <div className="rounded-[16px] p-5 md:p-6 mb-6" style={{ backgroundColor: "#313044" }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span style={{ ...inter, fontWeight: 600, fontSize: "12px", color: "rgba(255,255,255,0.5)", letterSpacing: "0.5px", textTransform: "uppercase" }}>
              Current Module
            </span>
            <span
              className="rounded-full px-2.5 py-0.5"
              style={{ backgroundColor: "#F59E0B", ...inter, fontWeight: 600, fontSize: "10px", color: "#111023" }}
            >
              IN PROGRESS
            </span>
          </div>
          <div className="text-right">
            <p style={{ ...inter, fontWeight: 700, fontSize: "24px", color: "#00CED1" }}>{currentModule.progress}%</p>
            <p style={{ ...inter, fontWeight: 400, fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>Completed</p>
          </div>
        </div>

        <h3 style={{ ...inter, fontWeight: 700, fontSize: "20px", color: "#FFFFFF", marginBottom: "6px" }}>
          Module {currentModule.num}: {currentModule.title}
        </h3>
        <p style={{ ...inter, fontWeight: 400, fontSize: "14px", color: "rgba(255,255,255,0.5)", marginBottom: "16px" }}>
          {currentModule.desc}
        </p>

        {/* Levels */}
        <div className="flex flex-col gap-3">
          {currentModule.levels.map((lvl) => (
            <div
              key={lvl.num}
              className="rounded-[12px] px-4 py-3 flex items-center justify-between"
              style={{
                backgroundColor: lvl.status === "completed" ? "rgba(0,206,209,0.08)" : "rgba(239,68,68,0.06)",
                border: lvl.status === "completed" ? "1px solid rgba(0,206,209,0.3)" : "1px solid rgba(239,68,68,0.25)",
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: lvl.status === "completed" ? "#00CED1" : "rgba(239,68,68,0.15)" }}
                >
                  {lvl.status === "completed" ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="4" />
                    </svg>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span style={{ ...inter, fontWeight: 700, fontSize: "14px", color: "#FFFFFF" }}>
                      Lvl {lvl.num}: {lvl.title}
                    </span>
                    {lvl.status === "not-mastered" && (
                      <span className="rounded-full px-2 py-0.5" style={{ backgroundColor: "#EF4444", ...inter, fontWeight: 600, fontSize: "9px", color: "#FFFFFF" }}>
                        Not yet mastered
                      </span>
                    )}
                  </div>
                  <p style={{ ...inter, fontWeight: 400, fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>{lvl.desc}</p>
                </div>
              </div>
              {lvl.status === "not-mastered" && (
                <button
                  className="rounded-[10px] px-5 py-2 cursor-pointer hover:opacity-90 transition-opacity flex-shrink-0 ml-3"
                  style={{ backgroundColor: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", ...inter, fontWeight: 600, fontSize: "13px", color: "#EF4444" }}
                >
                  Start Again
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Locked Module */}
      <div className="rounded-[16px] p-5" style={{ backgroundColor: "#313044", opacity: 0.7 }}>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full bg-[#525162] flex items-center justify-center flex-shrink-0">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
          </div>
          <span style={{ ...inter, fontWeight: 500, fontSize: "12px", color: "rgba(255,255,255,0.4)", letterSpacing: "0.5px", textTransform: "uppercase" }}>
            Module {lockedModule.num}
          </span>
        </div>
        <h3 style={{ ...inter, fontWeight: 700, fontSize: "18px", color: "rgba(255,255,255,0.7)", marginBottom: "6px" }}>{lockedModule.title}</h3>
        <p style={{ ...inter, fontWeight: 400, fontSize: "13px", lineHeight: "18px", color: "rgba(255,255,255,0.4)" }}>
          {lockedModule.desc}
        </p>
      </div>
    </div>
  );
}
