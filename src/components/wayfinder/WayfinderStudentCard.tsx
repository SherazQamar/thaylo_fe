"use client";

import Image from "next/image";
import Link from "next/link";
import type { WayfinderStudent } from "@/lib/wayfinder-api";
import {
  formatLastActiveAt,
  formatStudentGrade,
  formatWayfinderStudentName,
} from "@/lib/wayfinder-student";

const inter = { fontFamily: "Inter, sans-serif" } as const;

const BADGE_ASSETS = ["/assets/s1.png", "/assets/s2.png", "/assets/s3.png"];

function PlantIcon() {
  return (
    <Image src="/assets/s0.png" alt="Plant" width={48} height={48} className="w-12 h-12 object-contain" unoptimized />
  );
}

function plantStatusColor(status: string): string {
  const lower = status.toLowerCase();
  if (lower.includes("struggl") || lower.includes("risk")) return "#EF4444";
  if (lower.includes("slow")) return "#F59E0B";
  if (lower.includes("not started")) return "#858C94";
  return "#00CED1";
}

interface WayfinderStudentCardProps {
  student: WayfinderStudent;
}

export default function WayfinderStudentCard({ student }: WayfinderStudentCardProps) {
  const displayName = formatWayfinderStudentName(student);
  const badgesEarned = student.badgesEarned ?? 0;
  const plantStatus = student.plantStatus || "Not started yet";
  const lastActiveLabel = formatLastActiveAt(student.lastActiveAt);
  const visibleBadges = BADGE_ASSETS.slice(0, Math.min(3, Math.max(badgesEarned, 0)));
  const extraBadges = Math.max(0, badgesEarned - visibleBadges.length);

  return (
    <Link
      href={`/dashboard/student?id=${student.id}`}
      className="relative rounded-[12px] p-6 flex flex-col items-center hover:bg-[#3a3954] transition-colors"
      style={{ backgroundColor: "#313044" }}
    >
      <span
        className="absolute top-3 right-3 max-w-[46%] truncate rounded-full px-2.5 py-1"
        style={{
          ...inter,
          fontWeight: 500,
          fontSize: "10px",
          lineHeight: "14px",
          color: student.lastActiveAt ? "#111023" : "rgba(255,255,255,0.55)",
          backgroundColor: student.lastActiveAt ? "#00CED1" : "rgba(255,255,255,0.08)",
        }}
        title={
          student.lastActiveAt
            ? `Last active: ${new Date(student.lastActiveAt).toLocaleString()}`
            : "Last active: Not yet active"
        }
      >
        {student.lastActiveAt ? lastActiveLabel : "Not yet active"}
      </span>

      <p
        style={{
          ...inter,
          fontWeight: 600,
          fontSize: "16px",
          lineHeight: "24px",
          color: "#FFFFFF",
          marginBottom: "16px",
          paddingRight: "72px",
        }}
      >
        {displayName}
      </p>

      <div className="w-[100px] h-[100px] rounded-full border-4 border-[#525162] flex items-center justify-center mb-4 relative">
        <div
          className="w-[80px] h-[80px] rounded-full flex items-center justify-center"
          style={{ border: "3px solid #00CED1", borderTopColor: "transparent" }}
        >
          <PlantIcon />
        </div>
      </div>

      <p style={{ ...inter, fontWeight: 700, fontSize: "20px", lineHeight: "28px", color: "#FFFFFF" }}>
        {formatStudentGrade(student.grade)}
      </p>
      <p
        style={{
          ...inter,
          fontWeight: 500,
          fontSize: "13px",
          lineHeight: "20px",
          color: plantStatusColor(plantStatus),
          marginTop: "4px",
          textAlign: "center",
        }}
      >
        {plantStatus}
      </p>

      <div className="w-full h-px bg-white/10 my-4" />

      {badgesEarned > 0 && (
        <div className="flex items-center gap-2 mb-2">
          {visibleBadges.map((src) => (
            <div
              key={src}
              className="w-7 h-7 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#525162" }}
            >
              <Image src={src} alt="badge" width={19} height={19} className="w-[19px] h-[19px] object-contain" unoptimized />
            </div>
          ))}
          {extraBadges > 0 && (
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#525162" }}
            >
              <span style={{ ...inter, fontWeight: 500, fontSize: "12px", lineHeight: "100%", color: "#00CED1" }}>
                +{extraBadges}
              </span>
            </div>
          )}
        </div>
      )}
      <p style={{ ...inter, fontWeight: 500, fontSize: "12px", lineHeight: "16px", color: "rgba(255,255,255,0.5)" }}>
        {badgesEarned} Badges Earned
      </p>
    </Link>
  );
}
