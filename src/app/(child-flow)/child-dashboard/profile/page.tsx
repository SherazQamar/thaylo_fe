"use client";

import Link from "next/link";
import ChildUserDropdown from "@/components/child/ChildUserDropdown";
import { useChildAuthStore } from "@/stores/child-auth.store";

const inter = { fontFamily: "Inter, sans-serif" } as const;

function formatChildGrade(grade: string | null | undefined): string {
  if (!grade?.trim()) return "—";
  if (/^grade\s/i.test(grade.trim())) return grade.trim();
  return `Grade ${grade.trim()}`;
}

function formatJoinedDate(createdAt: string | undefined): string {
  if (!createdAt) return "—";
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return "—";
  return `Joined ${date.toLocaleDateString("en-US", { month: "long", year: "numeric" })}`;
}

export default function ChildProfilePage() {
  const child = useChildAuthStore((state) => state.child);
  const displayName = child?.userName?.trim() || "Student";

  return (
    <div className="p-4 md:p-5 lg:p-6 overflow-y-auto scrollbar-hide h-full">
      <div className="flex items-center justify-between mb-5">
        <h1 className="uppercase" style={{ ...inter, fontWeight: 700, fontSize: "22px", letterSpacing: "0.8px", color: "#DCE6EC" }}>
          Profile
        </h1>
        <div className="hidden md:block">
          <ChildUserDropdown />
        </div>
      </div>

      <div className="rounded-[16px] p-6 mb-6" style={{ backgroundColor: "#313044" }}>
        <div className="relative mb-4">
          <div className="flex items-center gap-2 justify-end mb-3">
            <span className="hidden sm:inline" style={{ ...inter, fontWeight: 400, fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>Parent-managed settings</span>
          </div>
          <div className="flex justify-center">
            <div
              className="w-[100px] h-[100px] rounded-full flex items-center justify-center text-4xl"
              style={{ border: "2px dashed #00CED1" }}
            >
              🧒
            </div>
          </div>
        </div>

        <div className="mt-2 text-center sm:text-left">
          <h2 style={{ ...inter, fontWeight: 700, fontSize: "22px", color: "#FFFFFF" }}>{displayName}</h2>
          <p style={{ ...inter, fontWeight: 400, fontSize: "14px", color: "rgba(255,255,255,0.5)", marginTop: "2px" }}>
            @{displayName.replace(/\s+/g, "")}
          </p>
          <p style={{ ...inter, fontWeight: 400, fontSize: "14px", color: "rgba(255,255,255,0.5)", marginTop: "2px" }}>
            {formatJoinedDate(child?.createdAt)}
          </p>
          <p style={{ ...inter, fontWeight: 500, fontSize: "14px", color: "#00CED1", marginTop: "8px" }}>
            {formatChildGrade(child?.grade)}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <h3 style={{ ...inter, fontWeight: 700, fontSize: "20px", color: "#FFFFFF", marginBottom: "12px" }}>Statistics</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-[12px] py-3 flex items-center justify-center gap-2" style={{ border: "1px solid #525162" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00CED1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22V8" /><path d="M5 12H2a10 10 0 0020 0h-3" />
            </svg>
            <span style={{ ...inter, fontWeight: 700, fontSize: "16px", color: "#FFFFFF" }}>0 Lessons</span>
          </div>
          <div className="rounded-[12px] py-3 flex items-center justify-center gap-2" style={{ border: "1px solid #525162" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00CED1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 15l-2 5-3-1 1.5-4M12 15l2 5 3-1-1.5-4M6 9a6 6 0 1012 0 6 6 0 00-12 0z" />
            </svg>
            <span style={{ ...inter, fontWeight: 700, fontSize: "16px", color: "#FFFFFF" }}>0 Badges</span>
          </div>
        </div>
        <p style={{ ...inter, fontWeight: 400, fontSize: "12px", color: "rgba(255,255,255,0.4)", marginTop: "10px" }}>
          Lesson and badge counts will update as you complete activities.
        </p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 style={{ ...inter, fontWeight: 700, fontSize: "20px", color: "#FFFFFF" }}>Badges</h3>
          <Link href="/child-dashboard/profile/badges" style={{ ...inter, fontWeight: 600, fontSize: "13px", color: "#00CED1", cursor: "pointer" }}>
            See all
          </Link>
        </div>
        <div
          className="rounded-[12px] px-4 py-8 text-center"
          style={{ backgroundColor: "#313044" }}
        >
          <p style={{ ...inter, fontWeight: 400, fontSize: "14px", color: "rgba(255,255,255,0.5)" }}>
            No badges earned yet. Keep learning to unlock your first badge!
          </p>
        </div>
      </div>
    </div>
  );
}
