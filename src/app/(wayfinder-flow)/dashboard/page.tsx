"use client";

import Image from "next/image";
import Link from "next/link";
import UserDropdown from "@/components/wayfinder/UserDropdown";
import Breadcrumbs from "@/components/shared/Breadcrumbs";

const inter = { fontFamily: "Inter, sans-serif" } as const;

const stats = [
  { label: "Mastery Trend", value: "Improving", change: "+11.01%", positive: true },
  { label: "Time this week", value: "42 min", change: "-2%", positive: false },
  { label: "Sel Summary", value: "Amber", change: "+11.01%", positive: true },
];

const students = [
  {
    name: "Alex Filler",
    grade: "Grade 4",
    plantStage: "Plant stage 3",
    mastered: "3 of 5 mastered",
    focus: "Focus: Inference",
    confidence: "Medium",
    confidenceColor: "bg-[#F59E0B]",
  },
  {
    name: "Alex Filler",
    grade: "Grade 4",
    plantStage: "Plant stage 3",
    mastered: "3 of 5 mastered",
    focus: "Focus: Inference",
    confidence: "low",
    confidenceColor: "bg-[#EF4444]",
  },
  {
    name: "Alex Filler",
    grade: "Grade 4",
    plantStage: "Plant stage 3",
    mastered: "3 of 5 mastered",
    focus: "Focus: Inference",
    confidence: "Medium",
    confidenceColor: "bg-[#F59E0B]",
  },
  {
    name: "Alex Filler",
    grade: "Grade 4",
    plantStage: "Plant stage 3",
    mastered: "3 of 5 mastered",
    focus: "Focus: Inference",
    confidence: "Medium",
    confidenceColor: "bg-[#F59E0B]",
  },
];

export default function DashboardPage() {
  return (
    <div className="p-4 md:p-6 lg:p-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 md:mb-3">
        <h1
          className="uppercase"
          style={{ ...inter, fontWeight: 700, fontSize: "24px", lineHeight: "25px", letterSpacing: "0.8px", color: "#DCE6EC" }}
        >
          Wayfinder Dashboard
        </h1>
        <div className="hidden md:block">
          <UserDropdown />
        </div>
      </div>

      <Breadcrumbs
        showHome={false}
        items={[{ href: "/dashboard", label: "Wayfinder Dashboard" }]}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-8 md:mb-10">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="flex items-center gap-4 rounded-[24px] px-5 md:px-6 py-[10px] h-[72px]"
            style={{ backgroundColor: "#525162" }}
          >
            <div className="w-10 h-10 rounded-full bg-[#00CED1]/20 flex items-center justify-center flex-shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00CED1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 2L11 13" />
                <path d="M22 2L15 22L11 13L2 9L22 2Z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p style={{ ...inter, fontWeight: 500, fontSize: "11px", lineHeight: "16px", color: "rgba(255,255,255,0.5)" }}>{stat.label}</p>
              <p style={{ ...inter, fontWeight: 600, fontSize: "20px", lineHeight: "28px", color: "#FFFFFF" }}>{stat.value}</p>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500, fontSize: "13px", lineHeight: "20px", color: stat.positive ? "#00DCAB" : "#EF4444" }}>{stat.change}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={stat.positive ? "#00DCAB" : "#EF4444"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {stat.positive ? <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /> : <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />}
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* Student List */}
      <div className="rounded-[12px] p-4 md:p-6" style={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}>
        <div className="flex items-center justify-between mb-4 md:mb-5">
          <h2 style={{ ...inter, fontWeight: 700, fontSize: "22px", lineHeight: "22px", color: "#FFFFFF" }}>Student List</h2>
          <button className="uppercase cursor-pointer hover:opacity-80 transition-opacity" style={{ ...inter, fontWeight: 700, fontSize: "13.5px", lineHeight: "18px", letterSpacing: "0.8px", color: "#00CED1" }}>
            View All
          </button>
        </div>

        {/* Mobile: Search + Filters */}
        <div className="md:hidden mb-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="rounded-full px-5 py-3 flex items-center gap-2.5 flex-1" style={{ backgroundColor: "#313044", border: "1px solid #525162" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              <input type="text" placeholder="Search Students" className="bg-transparent outline-none text-white/80 placeholder-white/40 w-full" style={{ ...inter, fontWeight: 400, fontSize: "14px" }} />
            </div>
            <button className="rounded-full px-5 py-2.5 flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0" style={{ backgroundColor: "#313044", border: "1px solid #525162" }}>
              <span style={{ ...inter, fontWeight: 500, fontSize: "14px", color: "rgba(255,255,255,0.7)" }}>Risk</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
            </button>
            <button className="rounded-full px-5 py-2.5 flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0" style={{ backgroundColor: "#313044", border: "1px solid #525162" }}>
              <span style={{ ...inter, fontWeight: 500, fontSize: "14px", color: "rgba(255,255,255,0.7)" }}>Grade</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {students.map((student, i) => (
            <Link
              href="/dashboard/student"
              key={i}
              className="md:grid md:grid-cols-[1fr_1fr_1fr_auto] items-center rounded-[12px] px-4 md:px-5 py-3 gap-3 md:gap-4 hover:bg-white/10 transition-colors flex flex-col"
              style={{ backgroundColor: "#313044" }}
            >
              {/* Student Info */}
              <div className="flex items-center gap-2.5 w-full">
                <div className="w-9 h-9 rounded-full bg-[#525162] overflow-hidden flex-shrink-0">
                  <Image src="/assets/wayfinder Em.png" alt={student.name} width={36} height={36} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p style={{ ...inter, fontWeight: 600, fontSize: "15px", lineHeight: "20px", color: "#FFFFFF" }}>{student.name}</p>
                  <p style={{ ...inter, fontWeight: 500, fontSize: "12px", lineHeight: "16px", color: "#858C94" }}>{student.grade}</p>
                </div>
              </div>

              {/* Plant Stage */}
              <div className="flex items-center gap-2.5 w-full mt-2 md:mt-0">
                <div className="w-9 h-9 rounded-full bg-[#313044] border border-[#00CED1]/30 flex items-center justify-center flex-shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00CED1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22V8" /><path d="M5 12H2a10 10 0 0020 0h-3" /><path d="M8 5.2C9.2 3.6 10.5 3 12 3c1.5 0 2.8.6 4 2.2" />
                  </svg>
                </div>
                <div>
                  <p style={{ ...inter, fontWeight: 600, fontSize: "15px", lineHeight: "20px", color: "#FFFFFF" }}>{student.plantStage}</p>
                  <p style={{ ...inter, fontWeight: 500, fontSize: "11px", lineHeight: "14px", color: "#00CED1" }}>{student.mastered}</p>
                </div>
              </div>

              {/* Focus */}
              <div className="rounded-[20px] w-full mt-2 md:mt-0" style={{ backgroundColor: "#525162", padding: "8px 16px" }}>
                <p style={{ ...inter, fontWeight: 600, fontSize: "15px", lineHeight: "20px", color: "#FFFFFF" }}>{student.focus}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span style={{ ...inter, fontWeight: 400, fontSize: "12px", lineHeight: "16px", color: "#FFFFFF" }}>Confidence</span>
                  <span className={`px-2 py-0.5 rounded-full ${student.confidenceColor}`} style={{ ...inter, fontWeight: 500, fontSize: "10px", lineHeight: "10px", color: "#111023" }}>{student.confidence}</span>
                </div>
              </div>

              {/* Timer card - mobile */}
              <div className="md:hidden rounded-[20px] w-full mt-2 flex items-center h-[60px]" style={{ backgroundColor: "#525162", padding: "8px 16px" }}>
                <div>
                  <p style={{ ...inter, fontWeight: 600, fontSize: "15px", lineHeight: "20px", color: "#FFFFFF" }}>Timer: 08:42</p>
                  <p style={{ ...inter, fontWeight: 400, fontSize: "12px", lineHeight: "16px", color: "rgba(255,255,255,0.5)" }}>Last active: Today</p>
                </div>
              </div>

              {/* Open Chat */}
              <button className="uppercase flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity whitespace-nowrap mt-2 md:mt-0 self-start md:self-center" style={{ ...inter, fontWeight: 700, fontSize: "13.5px", lineHeight: "18px", letterSpacing: "0.8px", color: "#00CED1" }}>
                Open Chat
              </button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
