"use client";

import Link from "next/link";
import PortalAvatar from "@/components/shared/PortalAvatar";
import type { WayfinderStudent } from "@/lib/wayfinder-api";
import {
  formatAssignedDate,
  formatStudentGrade,
  formatWayfinderStudentName,
} from "@/lib/wayfinder-student";

const inter = { fontFamily: "Inter, sans-serif" } as const;

interface WayfinderStudentRowProps {
  student: WayfinderStudent;
}

export default function WayfinderStudentRow({ student }: WayfinderStudentRowProps) {
  const displayName = formatWayfinderStudentName(student);
  const parentLabel = student.parent.name ?? student.parent.email;

  return (
    <Link
      href={`/dashboard/student?id=${student.id}`}
      className="md:grid md:grid-cols-[1.2fr_1fr_auto] items-center rounded-[12px] px-4 md:px-5 py-3 gap-3 md:gap-4 hover:bg-white/10 transition-colors flex flex-col"
      style={{ backgroundColor: "#313044" }}
    >
      <div className="flex items-center gap-2.5 w-full">
        <PortalAvatar name={displayName} avatarUrl={student.avatarUrl} size={36} />
        <div className="min-w-0">
          <p style={{ ...inter, fontWeight: 600, fontSize: "15px", lineHeight: "20px", color: "#FFFFFF" }}>
            {displayName}
          </p>
          <p style={{ ...inter, fontWeight: 500, fontSize: "12px", lineHeight: "16px", color: "#858C94" }}>
            {formatStudentGrade(student.grade)}
          </p>
        </div>
      </div>

      <div className="w-full md:mt-0">
        <p style={{ ...inter, fontWeight: 500, fontSize: "13px", lineHeight: "18px", color: "rgba(255,255,255,0.7)" }}>
          Parent: {parentLabel}
        </p>
        <p style={{ ...inter, fontWeight: 400, fontSize: "12px", lineHeight: "16px", color: "rgba(255,255,255,0.45)", marginTop: "2px" }}>
          Assigned {formatAssignedDate(student.assignedAt)}
        </p>
      </div>

      <span
        className="uppercase flex-shrink-0 whitespace-nowrap mt-2 md:mt-0 self-start md:self-center"
        style={{ ...inter, fontWeight: 700, fontSize: "13.5px", lineHeight: "18px", letterSpacing: "0.8px", color: "#00CED1" }}
      >
        View
      </span>
    </Link>
  );
}
