"use client";

import Link from "next/link";
import Image from "next/image";
import UserDropdown from "@/components/wayfinder/UserDropdown";
import Breadcrumbs from "@/components/shared/Breadcrumbs";

const inter = { fontFamily: "Inter, sans-serif" } as const;

const students = [
  {
    name: "Fatima",
    grade: "Grade 4",
    status: "Fatima's growing!",
    statusColor: "#00CED1",
    badges: 4,
  },
  {
    name: "Ali",
    grade: "Grade 2",
    status: "Fatima is struggling to grow!",
    statusColor: "#EF4444",
    badges: 4,
  },
  {
    name: "Sara",
    grade: "Grade 5",
    status: "Fatima is growing slowly",
    statusColor: "#F59E0B",
    badges: 4,
  },
];

function PlantIcon() {
  return (
    <Image src="/assets/s0.png" alt="Plant" width={48} height={48} className="w-12 h-12 object-contain" unoptimized />
  );
}

export default function StudentsPage() {
  return (
    <div className="p-4 md:p-6 lg:p-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 md:mb-3">
        <h1
          className="uppercase"
          style={{ ...inter, fontWeight: 700, fontSize: "24px", lineHeight: "25px", letterSpacing: "0.8px", color: "#DCE6EC" }}
        >
          Student
        </h1>
        <div className="hidden md:block">
          <UserDropdown />
        </div>
      </div>

      <Breadcrumbs
        showHome={false}
        items={[
          { href: "/dashboard", label: "Wayfinder Dashboard" },
          { href: "/dashboard/students", label: "Students" },
        ]}
      />

      {/* Student Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6 md:mt-8">
        {students.map((student, i) => (
          <Link
            key={i}
            href="/dashboard/student"
            className="rounded-[12px] p-6 flex flex-col items-center hover:bg-[#3a3954] transition-colors"
            style={{ backgroundColor: "#313044" }}
          >
            <p style={{ ...inter, fontWeight: 600, fontSize: "16px", lineHeight: "24px", color: "#FFFFFF", marginBottom: "16px" }}>
              {student.name}
            </p>
            <div className="w-[100px] h-[100px] rounded-full border-4 border-[#525162] flex items-center justify-center mb-4 relative">
              <div className="w-[80px] h-[80px] rounded-full flex items-center justify-center" style={{ border: "3px solid #00CED1", borderTopColor: "transparent" }}>
                <PlantIcon />
              </div>
            </div>
            <p style={{ ...inter, fontWeight: 700, fontSize: "20px", lineHeight: "28px", color: "#FFFFFF" }}>{student.grade}</p>
            <p style={{ ...inter, fontWeight: 500, fontSize: "13px", lineHeight: "20px", color: student.statusColor, marginTop: "4px" }}>{student.status}</p>
            <div className="w-full h-px bg-white/10 my-4" />
            <div className="flex items-center gap-2 mb-2">
              {["/assets/s1.png", "/assets/s2.png", "/assets/s3.png"].map((src, j) => (
                <div key={j} className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: "#525162" }}>
                  <Image src={src} alt="badge" width={19} height={19} className="w-[19px] h-[19px] object-contain" unoptimized />
                </div>
              ))}
              <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: "#525162" }}>
                <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "16px", lineHeight: "100%", color: "#00CED1" }}>+1</span>
              </div>
            </div>
            <p style={{ ...inter, fontWeight: 500, fontSize: "12px", lineHeight: "16px", color: "rgba(255,255,255,0.5)" }}>
              {student.badges} Badges Earned
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
