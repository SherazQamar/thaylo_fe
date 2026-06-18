"use client";

import Image from "next/image";
import Link from "next/link";
import type { WayfinderStudent } from "@/lib/wayfinder-api";
import {
  formatAssignedDate,
  formatStudentGrade,
  formatWayfinderStudentName,
} from "@/lib/wayfinder-student";

const inter = { fontFamily: "Inter, sans-serif" } as const;

function PlantIcon() {
  return (
    <Image src="/assets/s0.png" alt="Plant" width={48} height={48} className="w-12 h-12 object-contain" unoptimized />
  );
}

interface WayfinderStudentCardProps {
  student: WayfinderStudent;
}

export default function WayfinderStudentCard({ student }: WayfinderStudentCardProps) {
  const displayName = formatWayfinderStudentName(student);
  const parentLabel = student.parent.name ?? student.parent.email;

  return (
    <Link
      href={`/dashboard/student?id=${student.id}`}
      className="rounded-[12px] p-6 flex flex-col items-center hover:bg-[#3a3954] transition-colors"
      style={{ backgroundColor: "#313044" }}
    >
      <p style={{ ...inter, fontWeight: 600, fontSize: "16px", lineHeight: "24px", color: "#FFFFFF", marginBottom: "16px" }}>
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
      <p style={{ ...inter, fontWeight: 500, fontSize: "13px", lineHeight: "20px", color: "#00CED1", marginTop: "4px" }}>
        @{student.userName}
      </p>
      <div className="w-full h-px bg-white/10 my-4" />
      <p style={{ ...inter, fontWeight: 500, fontSize: "12px", lineHeight: "16px", color: "rgba(255,255,255,0.5)", textAlign: "center" }}>
        Parent: {parentLabel}
      </p>
      <p style={{ ...inter, fontWeight: 500, fontSize: "12px", lineHeight: "16px", color: "rgba(255,255,255,0.4)", marginTop: "4px" }}>
        Assigned {formatAssignedDate(student.assignedAt)}
      </p>
    </Link>
  );
}
