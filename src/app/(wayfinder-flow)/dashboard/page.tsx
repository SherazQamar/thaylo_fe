"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import UserDropdown from "@/components/wayfinder/UserDropdown";
import WayfinderStudentRow from "@/components/wayfinder/WayfinderStudentRow";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import { getApiErrorMessage } from "@/lib/auth-api";
import { fetchWayfinderStudents, wayfinderQueryKeys } from "@/lib/wayfinder-api";

const inter = { fontFamily: "Inter, sans-serif" } as const;

const stats = [
  { label: "Mastery Trend", value: "Improving", change: "+11.01%", positive: true },
  { label: "Time this week", value: "42 min", change: "-2%", positive: false },
  { label: "Sel Summary", value: "Amber", change: "+11.01%", positive: true },
];

export default function DashboardPage() {
  const studentsQuery = useQuery({
    queryKey: wayfinderQueryKeys.students({ page: 1 }),
    queryFn: () => fetchWayfinderStudents({ page: 1 }),
  });

  const students = studentsQuery.data?.items ?? [];
  const totalStudents = studentsQuery.data?.meta?.total ?? students.length;

  return (
    <div className="p-4 md:p-6 lg:p-10">
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

      <div className="rounded-[12px] p-4 md:p-6" style={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}>
        <div className="flex items-center justify-between mb-4 md:mb-5">
          <div>
            <h2 style={{ ...inter, fontWeight: 700, fontSize: "22px", lineHeight: "22px", color: "#FFFFFF" }}>
              Student List
            </h2>
            <p style={{ ...inter, fontWeight: 400, fontSize: "12px", lineHeight: "16px", color: "rgba(255,255,255,0.45)", marginTop: "4px" }}>
              {totalStudents} assigned {totalStudents === 1 ? "student" : "students"}
            </p>
          </div>
          {totalStudents > 0 && (
            <Link
              href="/dashboard/students"
              className="uppercase hover:opacity-80 transition-opacity"
              style={{ ...inter, fontWeight: 700, fontSize: "13.5px", lineHeight: "18px", letterSpacing: "0.8px", color: "#00CED1" }}
            >
              View All
            </Link>
          )}
        </div>

        {studentsQuery.isLoading && (
          <p style={{ ...inter, fontWeight: 400, fontSize: "14px", color: "rgba(255,255,255,0.5)" }} className="py-8 text-center">
            Loading students…
          </p>
        )}

        {studentsQuery.isError && (
          <p style={{ ...inter, fontWeight: 400, fontSize: "14px", color: "#EF4444" }} className="py-8 text-center" role="alert">
            {getApiErrorMessage(studentsQuery.error)}
          </p>
        )}

        {!studentsQuery.isLoading && !studentsQuery.isError && students.length === 0 && (
          <p style={{ ...inter, fontWeight: 400, fontSize: "14px", color: "rgba(255,255,255,0.5)" }} className="py-8 text-center">
            No students assigned to you yet.
          </p>
        )}

        <div className="flex flex-col gap-2">
          {students.map((student) => (
            <WayfinderStudentRow key={student.id} student={student} />
          ))}
        </div>
      </div>
    </div>
  );
}
