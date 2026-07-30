"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import ChildUserDropdown from "@/components/child/ChildUserDropdown";
import { BadgeShield } from "@/components/shared/BadgeArtwork";
import { fetchChildBadges } from "@/lib/badge-api";
import { useNotifyError } from "@/hooks/use-notify-error";

const inter = { fontFamily: "Inter, sans-serif" } as const;

export default function BadgesPage() {
  const badgesQuery = useQuery({
    queryKey: ["child", "badges"],
    queryFn: fetchChildBadges,
  });
  useNotifyError(badgesQuery.error, badgesQuery.isError);

  const summary = badgesQuery.data;
  const badges = summary?.badges ?? [];

  return (
    <div className="p-4 md:p-5 lg:p-6 overflow-y-auto scrollbar-hide h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/child-dashboard/profile"
            className="text-white/60 hover:text-white transition-colors"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </Link>
          <h1
            className="uppercase"
            style={{
              ...inter,
              fontWeight: 700,
              fontSize: "22px",
              letterSpacing: "0.8px",
              color: "#DCE6EC",
            }}
          >
            Badges
          </h1>
        </div>
        <div className="hidden md:block">
          <ChildUserDropdown />
        </div>
      </div>

      {summary && (
        <div
          className="rounded-[12px] px-4 py-3 mb-5 flex flex-wrap items-center gap-4"
          style={{ backgroundColor: "#313044" }}
        >
          <div>
            <p style={{ ...inter, fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>
              Total earned
            </p>
            <p style={{ ...inter, fontWeight: 700, fontSize: "20px", color: "#00CED1" }}>
              {summary.badgesEarned}
            </p>
          </div>
          <div className="w-px h-8 bg-white/10 hidden sm:block" />
          <div>
            <p style={{ ...inter, fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>
              Progress plant
            </p>
            <p style={{ ...inter, fontWeight: 600, fontSize: "14px", color: "#FFFFFF" }}>
              {summary.plantStatus} · Stage {summary.plantStage} ·{" "}
              {summary.masteredCount}/{summary.totalLessons} mastered
            </p>
          </div>
          <div className="w-px h-8 bg-white/10 hidden sm:block" />
          <div>
            <p style={{ ...inter, fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>
              Login streak
            </p>
            <p style={{ ...inter, fontWeight: 600, fontSize: "14px", color: "#FFFFFF" }}>
              {summary.loginStreakDays}/5 days toward Sprout Streak
            </p>
          </div>
        </div>
      )}

      {badgesQuery.isLoading && (
        <p style={{ ...inter, color: "rgba(255,255,255,0.5)" }}>Loading badges…</p>
      )}

      {badgesQuery.isError && (
        <p style={{ ...inter, color: "rgba(255,255,255,0.5)" }}>
          Unable to load badges right now.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {badges.map((badge) => {
          const earned = badge.count > 0;
          const maxLabel =
            badge.maxCount == null ? "Unlimited" : `Max ${badge.maxCount}`;
          return (
            <div
              key={badge.kind}
              className="rounded-[12px] px-4 py-3 flex items-center gap-3"
              style={{ backgroundColor: "#313044" }}
            >
              <BadgeShield
                iconStyle={badge.iconStyle}
                earned={earned}
                imageUrl={badge.imageUrl}
                alt={badge.name}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span
                    style={{
                      ...inter,
                      fontWeight: 600,
                      fontSize: "14px",
                      color: "#FFFFFF",
                    }}
                  >
                    {badge.name}
                    {badge.isMilestone ? (
                      <span
                        style={{
                          ...inter,
                          fontWeight: 500,
                          fontSize: "11px",
                          color: "#00CED1",
                          marginLeft: 6,
                        }}
                      >
                        Milestone
                      </span>
                    ) : null}
                  </span>
                  <span
                    style={{
                      ...inter,
                      fontWeight: 700,
                      fontSize: "13px",
                      color: earned ? "#00CED1" : "rgba(255,255,255,0.45)",
                    }}
                  >
                    {badge.count}
                    {badge.maxCount != null ? ` / ${badge.maxCount}` : ""}
                  </span>
                </div>
                {badge.maxCount != null && (
                  <div className="w-full h-[4px] bg-[#525162] rounded-full overflow-hidden mb-1">
                    <div
                      className="h-full bg-[#00CED1] rounded-full"
                      style={{
                        width: `${Math.min(
                          100,
                          (badge.count / badge.maxCount) * 100,
                        )}%`,
                      }}
                    />
                  </div>
                )}
                <p
                  style={{
                    ...inter,
                    fontWeight: 400,
                    fontSize: "11px",
                    color: "rgba(255,255,255,0.4)",
                  }}
                >
                  {badge.description} · {maxLabel}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
