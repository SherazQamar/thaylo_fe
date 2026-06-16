"use client";

import Image from "next/image";
import UserDropdown from "@/components/wayfinder/UserDropdown";
import Breadcrumbs from "@/components/shared/Breadcrumbs";

const inter = { fontFamily: "Inter, sans-serif" } as const;

const students = [
  {
    name: "Alex Filler",
    grade: "Grade 4",
    plantStage: "Plant stage 3",
    mastered: "3 of 5 mastered",
    status: "In Lesson",
    risk: "Amber",
    timer: "08:42",
    lastActive: "Last active: Today",
  },
  {
    name: "Amenda",
    grade: "Grade 1",
    plantStage: "Plant stage 3",
    mastered: "3 of 5 mastered",
    status: "In Lesson",
    risk: "Amber",
    timer: "08:42",
    lastActive: "Last active: Today",
  },
  {
    name: "Filler Charl",
    grade: "Grade 2",
    plantStage: "Plant stage 3",
    mastered: "3 of 5 mastered",
    status: "In Lesson",
    risk: "Amber",
    timer: "08:42",
    lastActive: "Last active: Today",
  },
];

export default function LiveSessionsPage() {
  return (
    <div className="p-4 md:p-6 lg:p-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 md:mb-3">
        <h1
          className="uppercase"
          style={{ ...inter, fontWeight: 700, fontSize: "24px", lineHeight: "25px", letterSpacing: "0.8px", color: "#DCE6EC" }}
        >
          Live Sessions
        </h1>
        <div className="hidden md:block">
          <UserDropdown />
        </div>
      </div>

      <Breadcrumbs
        showHome={false}
        items={[
          { href: "/dashboard", label: "Wayfinder Dashboard" },
          { href: "/dashboard/live-sessions", label: "Live Sessions" },
        ]}
      />

      {/* Student List Card */}
      <div className="rounded-[12px] p-4 md:p-6 mt-6 md:mt-8" style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
        {/* List Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4 md:mb-5">
          <h2 style={{ ...inter, fontWeight: 700, fontSize: "20px", lineHeight: "24px", color: "#FFFFFF" }}>
            Student List
          </h2>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 md:gap-3">
            <div className="rounded-full px-5 py-3 flex items-center gap-2.5 flex-1 sm:flex-none" style={{ backgroundColor: "#313044", border: "1px solid #525162" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input type="text" placeholder="Search Students" className="bg-transparent outline-none text-white/80 placeholder-white/40 w-full md:w-[220px]" style={{ ...inter, fontWeight: 400, fontSize: "14px" }} />
            </div>
            <div className="flex gap-2">
              <button className="rounded-full px-5 py-2.5 flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity flex-1 sm:flex-none" style={{ backgroundColor: "#313044", border: "1px solid #525162" }}>
                <span style={{ ...inter, fontWeight: 500, fontSize: "14px", color: "rgba(255,255,255,0.7)" }}>Risk</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
              </button>
              <button className="rounded-full px-5 py-2.5 flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity flex-1 sm:flex-none" style={{ backgroundColor: "#313044", border: "1px solid #525162" }}>
                <span style={{ ...inter, fontWeight: 500, fontSize: "14px", color: "rgba(255,255,255,0.7)" }}>Grade</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
              </button>
            </div>
          </div>
        </div>

        {/* Student Rows */}
        <div className="flex flex-col gap-3 md:gap-2">
          {students.map((student, i) => (
            <div
              key={i}
              className="md:grid md:grid-cols-[1fr_1fr_1fr_1fr_auto] md:items-center rounded-[12px] px-4 md:px-5 py-3 gap-3 md:gap-4 flex flex-col"
              style={{ backgroundColor: "#313044" }}
            >
              {/* Student Info */}
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#525162] overflow-hidden flex-shrink-0">
                  <Image src="/assets/wayfinder Em.png" alt={student.name} width={36} height={36} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p style={{ ...inter, fontWeight: 600, fontSize: "15px", lineHeight: "20px", color: "#FFFFFF" }}>{student.name}</p>
                  <p style={{ ...inter, fontWeight: 500, fontSize: "12px", lineHeight: "16px", color: "#858C94" }}>{student.grade}</p>
                </div>
              </div>

              {/* Plant Stage */}
              <div className="flex items-center gap-2.5 mt-2 md:mt-0">
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

              {/* Status + Risk */}
              <div className="flex items-center h-[60px] md:h-[72px] rounded-[24px] mt-2 md:mt-0" style={{ backgroundColor: "#525162", padding: "10px 24px" }}>
                <div>
                  <div className="flex items-center gap-2.5 mb-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#00CED1]" />
                    <p style={{ ...inter, fontWeight: 600, fontSize: "15px", lineHeight: "20px", color: "#FFFFFF" }}>{student.status}</p>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span style={{ ...inter, fontWeight: 400, fontSize: "12px", lineHeight: "16px", color: "rgba(255,255,255,0.5)" }}>Risk</span>
                    <span className="rounded-full px-2.5 py-0.5" style={{ backgroundColor: "#F59E0B", ...inter, fontWeight: 500, fontSize: "10px", lineHeight: "14px", color: "#111023" }}>{student.risk}</span>
                  </div>
                </div>
              </div>

              {/* Timer */}
              <div className="flex items-center h-[60px] md:h-[72px] rounded-[24px] mt-2 md:mt-0" style={{ backgroundColor: "#525162", padding: "10px 24px" }}>
                <div>
                  <p style={{ ...inter, fontWeight: 600, fontSize: "15px", lineHeight: "20px", color: "#FFFFFF" }}>Timer: {student.timer}</p>
                  <p style={{ ...inter, fontWeight: 400, fontSize: "12px", lineHeight: "16px", color: "rgba(255,255,255,0.5)" }}>{student.lastActive}</p>
                </div>
              </div>

              {/* Open Chat */}
              <button className="uppercase flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity whitespace-nowrap mt-2 md:mt-0 self-start md:self-center" style={{ ...inter, fontWeight: 700, fontSize: "13.5px", lineHeight: "18px", letterSpacing: "0.8px", color: "#00CED1" }}>
                Open Chat
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
