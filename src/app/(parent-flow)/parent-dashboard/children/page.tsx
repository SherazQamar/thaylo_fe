"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import ParentUserDropdown from "@/components/parent/ParentUserDropdown";
import { fetchParentChildren } from "@/lib/parent-api";
import { withAddChildWizardMode } from "@/lib/parent-registration";
import { useRegisterWizardStore } from "@/stores/register-wizard.store";
import { useAuthStore } from "@/stores/auth.store";

const inter = { fontFamily: "Inter, sans-serif" } as const;

function formatChildGrade(grade: string | null | undefined): string {
  if (!grade?.trim()) return "—";
  if (/^grade\s/i.test(grade.trim())) return grade.trim();
  return `Grade ${grade.trim()}`;
}

function PlantIcon() {
  return (
    <Image src="/assets/s0.png" alt="Plant" width={48} height={48} className="w-12 h-12 object-contain" unoptimized />
  );
}

export default function ChildrenPage() {
  const router = useRouter();
  const resetWizard = useRegisterWizardStore((s) => s.reset);
  const user = useAuthStore((state) => state.user);
  const { data: children = [] } = useQuery({
    queryKey: ["parent-children"],
    queryFn: fetchParentChildren,
  });

  const greetingName = user?.name?.trim() || "Parent";

  function handleAddChild() {
    resetWizard();
    router.push(withAddChildWizardMode("/parent-register/step-2"));
  }

  return (
    <div className="p-4 md:p-6 lg:p-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <h1
          className="uppercase"
          style={{ ...inter, fontWeight: 700, fontSize: "24px", lineHeight: "25px", letterSpacing: "0.8px", color: "#DCE6EC" }}
        >
          Children
        </h1>
        <div className="hidden md:block">
          <ParentUserDropdown />
        </div>
      </div>

      {/* Greeting + Add Child */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h2 style={{ ...inter, fontWeight: 700, fontSize: "22px", lineHeight: "30px", color: "#FFFFFF" }}>
          Hello, {greetingName}
        </h2>
        <button
          type="button"
          onClick={handleAddChild}
          className="rounded-full px-6 py-2.5 cursor-pointer hover:opacity-90 transition-opacity self-start sm:self-auto"
          style={{ backgroundColor: "#00CED1", ...inter, fontWeight: 600, fontSize: "14px", lineHeight: "20px", color: "#111023" }}
        >
          Add Child
        </button>
      </div>

      {/* Child Cards Grid */}
      {children.length === 0 ? (
        <p style={{ ...inter, fontWeight: 400, fontSize: "14px", lineHeight: "22px", color: "rgba(255,255,255,0.5)" }}>
          No children registered yet. Add a child to get started.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {children.map((child) => (
            <Link
              key={child.id}
              href={`/parent-dashboard/child?id=${child.id}`}
              className="rounded-[12px] p-6 flex flex-col items-center hover:bg-[#3a3954] transition-colors"
              style={{ backgroundColor: "#313044" }}
            >
              <p style={{ ...inter, fontWeight: 600, fontSize: "16px", lineHeight: "24px", color: "#FFFFFF", marginBottom: "16px" }}>
                {child.userName}
              </p>
              <div className="w-[100px] h-[100px] rounded-full border-4 border-[#525162] flex items-center justify-center mb-4 relative">
                <div className="w-[80px] h-[80px] rounded-full flex items-center justify-center" style={{ border: "3px solid #00CED1", borderTopColor: "transparent" }}>
                  <PlantIcon />
                </div>
              </div>
              <p style={{ ...inter, fontWeight: 700, fontSize: "20px", lineHeight: "28px", color: "#FFFFFF" }}>{formatChildGrade(child.grade)}</p>
              <p style={{ ...inter, fontWeight: 500, fontSize: "13px", lineHeight: "20px", color: "#858C94", marginTop: "4px" }}>{child.plantStatus}</p>
              <div className="w-full h-px bg-white/10 my-4" />
              <p style={{ ...inter, fontWeight: 500, fontSize: "12px", lineHeight: "16px", color: "rgba(255,255,255,0.5)" }}>
                {child.badgesEarned} Badges Earned
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
