"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import ParentUserDropdown from "@/components/parent/ParentUserDropdown";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import BadgePreviewStrip from "@/components/shared/BadgePreviewStrip";
import PortalAvatar from "@/components/shared/PortalAvatar";
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
    <Image
      src="/assets/s0.png"
      alt="Plant"
      width={48}
      height={48}
      className="w-12 h-12 object-contain"
      unoptimized
    />
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
  const childCount = children.length;
  const subtitle =
    childCount === 0
      ? "Add a child to get started."
      : childCount === 1
        ? `Here is how ${children[0]?.userName ?? "your child"} is doing today.`
        : "Here is how your children are doing today.";

  function handleAddChild() {
    resetWizard();
    router.push(withAddChildWizardMode("/parent-register/step-2"));
  }

  return (
    <div className="px-6 py-4 md:p-6 lg:p-10">
      <div className="hidden md:flex items-center justify-between mb-3">
        <h1
          className="uppercase"
          style={{
            ...inter,
            fontWeight: 700,
            fontSize: "24px",
            lineHeight: "25px",
            letterSpacing: "0.8px",
            color: "#DCE6EC",
          }}
        >
          Children
        </h1>
        <ParentUserDropdown />
      </div>

      <Breadcrumbs
        showHome={false}
        items={[
          { href: "/parent-dashboard", label: "Parent Dashboard" },
          { href: "/parent-dashboard/children", label: "Children" },
        ]}
      />

      {/* Figma mobile: Hello + subtitle + full-width Add Child */}
      <div className="mb-6 md:mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <h2
            className="text-[32px] leading-10 md:text-[22px] md:leading-[30px]"
            style={{
              ...inter,
              fontWeight: 700,
              color: "#FFFFFF",
            }}
          >
            Hello, {greetingName}
          </h2>
          <p
            className="mt-1.5 md:mt-1 text-[14px] leading-6"
            style={{
              ...inter,
              fontWeight: 400,
              color: "rgba(255,255,255,0.5)",
            }}
          >
            {subtitle}
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddChild}
          className="w-full md:w-auto rounded-full h-12 md:h-auto px-6 py-2.5 cursor-pointer hover:opacity-90 transition-opacity"
          style={{
            backgroundColor: "#00CED1",
            ...inter,
            fontWeight: 600,
            fontSize: "14px",
            lineHeight: "20px",
            color: "#111023",
          }}
        >
          Add Child
        </button>
      </div>

      {children.length === 0 ? (
        <p
          style={{
            ...inter,
            fontWeight: 400,
            fontSize: "14px",
            lineHeight: "22px",
            color: "rgba(255,255,255,0.5)",
          }}
        >
          No children registered yet. Add a child to get started.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-5">
          {children.map((child) => (
            <Link
              key={child.id}
              href={`/parent-dashboard/child?id=${child.id}`}
              className="rounded-[12px] px-5 py-7 md:p-6 flex flex-col items-center hover:bg-[#3a3954] transition-colors"
              style={{ backgroundColor: "#313044" }}
            >
              <p
                className="text-[14px] leading-[19px] md:text-[16px] md:leading-6"
                style={{
                  ...inter,
                  fontWeight: 600,
                  color: "#FFFFFF",
                  marginBottom: "12px",
                }}
              >
                {child.userName}
              </p>
              <div className="mb-3">
                <PortalAvatar
                  name={child.userName}
                  avatarUrl={child.avatarUrl}
                  size={56}
                  useWordInitials
                />
              </div>
              {/* Figma mobile plant ring ≈ 120px */}
              <div className="w-[120px] h-[120px] md:w-[100px] md:h-[100px] rounded-full border-4 border-[#525162] flex items-center justify-center mb-4 relative">
                <div
                  className="w-[96px] h-[96px] md:w-[80px] md:h-[80px] rounded-full flex items-center justify-center"
                  style={{
                    border: "3px solid #00CED1",
                    borderTopColor: "transparent",
                  }}
                >
                  <PlantIcon />
                </div>
              </div>
              <p
                className="text-[24px] leading-[29px] md:text-[20px] md:leading-7"
                style={{
                  ...inter,
                  fontWeight: 700,
                  color: "#FFFFFF",
                }}
              >
                {formatChildGrade(child.grade)}
              </p>
              <p
                className="text-[14px] leading-[19px] md:text-[13px] md:leading-5 text-center"
                style={{
                  ...inter,
                  fontWeight: 500,
                  color:
                    child.plantStatus === "Not started yet"
                      ? "#858C94"
                      : "#00CED1",
                  marginTop: "8px",
                }}
              >
                {child.plantStatus}
              </p>
              <div className="w-full h-px bg-white/10 my-5 md:my-4" />
              <div className="flex flex-col items-center gap-2.5">
                <BadgePreviewStrip
                  previews={child.badgePreviews ?? []}
                  totalEarned={child.badgesEarned}
                />
                <p
                  style={{
                    ...inter,
                    fontWeight: 500,
                    fontSize: "12px",
                    lineHeight: "17px",
                    color: "rgba(255,255,255,0.55)",
                  }}
                >
                  {child.badgesEarned} Badge
                  {child.badgesEarned === 1 ? "" : "s"} Earned
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
