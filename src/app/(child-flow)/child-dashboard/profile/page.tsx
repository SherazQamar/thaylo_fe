"use client";

import Link from "next/link";
import ChildUserDropdown from "@/components/child/ChildUserDropdown";

const inter = { fontFamily: "Inter, sans-serif" } as const;

const badges = [
  { name: "Wildfire", desc: "Reading Consistency", progress: 2, total: 3 },
  { name: "Sage", desc: "Vocabulary Mastery", progress: 2, total: 5 },
  { name: "Champion", desc: "Writing practice", progress: 2, total: 3 },
  { name: "Champion", desc: "Writing practice", progress: 3, total: 5 },
];

export default function ChildProfilePage() {
  return (
    <div className="p-4 md:p-5 lg:p-6 overflow-y-auto scrollbar-hide h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="uppercase" style={{ ...inter, fontWeight: 700, fontSize: "22px", letterSpacing: "0.8px", color: "#DCE6EC" }}>
          Profile
        </h1>
        <div className="hidden md:block">
          <ChildUserDropdown />
        </div>
      </div>

      {/* Profile Card */}
      <div className="rounded-[16px] p-6 mb-6" style={{ backgroundColor: "#313044" }}>
        {/* Avatar area */}
        <div className="relative mb-4">
          {/* Parent-managed + edit - top right */}
          <div className="flex items-center gap-2 justify-end mb-3">
            <span className="hidden sm:inline" style={{ ...inter, fontWeight: 400, fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>Parent-managed settings</span>
            <button className="w-8 h-8 rounded-[8px] bg-[#525162] flex items-center justify-center cursor-pointer hover:opacity-80">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
          </div>
          {/* Centered avatar */}
          <div className="flex justify-center">
            <div
              className="w-[100px] h-[100px] rounded-full flex items-center justify-center"
              style={{ border: "2px dashed #00CED1" }}
            >
              <div className="w-10 h-10 rounded-full bg-[#525162] flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* User info */}
        <div className="mt-2">
          <h2 style={{ ...inter, fontWeight: 700, fontSize: "22px", color: "#FFFFFF" }}>Allex Filler</h2>
          <p style={{ ...inter, fontWeight: 400, fontSize: "14px", color: "rgba(255,255,255,0.5)", marginTop: "2px" }}>AllexFiller705842</p>
          <p style={{ ...inter, fontWeight: 400, fontSize: "14px", color: "rgba(255,255,255,0.5)", marginTop: "2px" }}>Joined December 2025</p>
        </div>
      </div>

      {/* Statistics */}
      <div className="mb-6">
        <h3 style={{ ...inter, fontWeight: 700, fontSize: "20px", color: "#FFFFFF", marginBottom: "12px" }}>Statistics</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-[12px] py-3 flex items-center justify-center gap-2" style={{ border: "1px solid #525162" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00CED1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22V8" /><path d="M5 12H2a10 10 0 0020 0h-3" />
            </svg>
            <span style={{ ...inter, fontWeight: 700, fontSize: "16px", color: "#FFFFFF" }}>85 Lessons</span>
          </div>
          <div className="rounded-[12px] py-3 flex items-center justify-center gap-2" style={{ border: "1px solid #525162" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00CED1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 15l-2 5-3-1 1.5-4M12 15l2 5 3-1-1.5-4M6 9a6 6 0 1012 0 6 6 0 00-12 0z" />
            </svg>
            <span style={{ ...inter, fontWeight: 700, fontSize: "16px", color: "#FFFFFF" }}>14 Badges</span>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 style={{ ...inter, fontWeight: 700, fontSize: "20px", color: "#FFFFFF" }}>Badges</h3>
          <Link href="/child-dashboard/profile/badges" style={{ ...inter, fontWeight: 600, fontSize: "13px", color: "#00CED1", cursor: "pointer" }}>
            See all
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {badges.map((badge, i) => (
            <div key={i} className="rounded-[12px] px-4 py-3 flex items-center gap-3" style={{ backgroundColor: "#313044" }}>
              <div className="w-10 h-10 rounded-full bg-[#525162] flex items-center justify-center flex-shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00CED1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 15l-2 5-3-1 1.5-4M12 15l2 5 3-1-1.5-4M6 9a6 6 0 1012 0 6 6 0 00-12 0z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span style={{ ...inter, fontWeight: 600, fontSize: "14px", color: "#FFFFFF" }}>{badge.name}</span>
                  <span style={{ ...inter, fontWeight: 700, fontSize: "13px", color: "#00CED1" }}>{badge.progress}/{badge.total}</span>
                </div>
                <div className="w-full h-[4px] bg-[#525162] rounded-full overflow-hidden mb-1">
                  <div className="h-full bg-[#00CED1] rounded-full" style={{ width: `${(badge.progress / badge.total) * 100}%` }} />
                </div>
                <p style={{ ...inter, fontWeight: 400, fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>{badge.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
