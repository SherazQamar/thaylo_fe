"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import UserDropdown from "@/components/wayfinder/UserDropdown";
import WayfinderStudentCard from "@/components/wayfinder/WayfinderStudentCard";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import ListPagination from "@/components/shared/ListPagination";
import { useNotifyError } from "@/hooks/use-notify-error";
import { fetchWayfinderStudents, wayfinderQueryKeys } from "@/lib/wayfinder-api";

const inter = { fontFamily: "Inter, sans-serif" } as const;

export default function StudentsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  const studentsQuery = useQuery({
    queryKey: wayfinderQueryKeys.students({ page, search: debouncedSearch || undefined }),
    queryFn: () => fetchWayfinderStudents({ page, search: debouncedSearch || undefined }),
    refetchInterval: 30_000,
  });

  const students = studentsQuery.data?.items ?? [];
  const meta = studentsQuery.data?.meta ?? null;

  useNotifyError(studentsQuery.error, studentsQuery.isError);

  return (
    <div className="p-4 md:p-6 lg:p-10">
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

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-6 md:mt-8 mb-5">
        <p style={{ ...inter, fontWeight: 500, fontSize: "14px", lineHeight: "20px", color: "rgba(255,255,255,0.5)" }}>
          Students assigned to your caseload
        </p>
        <div className="relative w-full sm:w-[280px]">
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            placeholder="Search by name or grade"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-4 py-2.5 rounded-full bg-[#313044] text-white text-sm outline-none border border-[#525162] focus:border-[#00CED1]/40 placeholder:text-white/40"
            style={inter}
          />
        </div>
      </div>

      {studentsQuery.isLoading && (
        <p style={{ ...inter, fontWeight: 400, fontSize: "14px", color: "rgba(255,255,255,0.5)" }} className="py-12 text-center">
          Loading students…
        </p>
      )}

      {!studentsQuery.isLoading && !studentsQuery.isError && students.length === 0 && (
        <p style={{ ...inter, fontWeight: 400, fontSize: "14px", color: "rgba(255,255,255,0.5)" }} className="py-12 text-center">
          {debouncedSearch ? "No students match your search." : "No students assigned to you yet."}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {students.map((student) => (
          <WayfinderStudentCard key={student.id} student={student} />
        ))}
      </div>

      <ListPagination
        meta={meta}
        onPageChange={setPage}
        isLoading={studentsQuery.isFetching}
        itemLabel="students"
      />
    </div>
  );
}
