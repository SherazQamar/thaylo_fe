"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import ChildUserDropdown from "@/components/child/ChildUserDropdown";
import ChildNoClassBanner from "@/components/child/ChildNoClassBanner";
import { BadgeShield } from "@/components/shared/BadgeArtwork";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import { useChildAssignedClasses } from "@/hooks/use-child-assigned-classes";
import { useAiSettings } from "@/hooks/use-ai-settings";
import { fetchChildBadges, syncChildBadgeActivity } from "@/lib/badge-api";
import { fetchBloomBuddyTrends } from "@/lib/bloom-buddy-api";
import { navigateToChildClass } from "@/lib/start-child-class";
import { notify } from "@/lib/notify";
import { useChildAuthStore } from "@/stores/child-auth.store";

const inter = { fontFamily: "Inter, sans-serif" } as const;

/** Figma Child Flow Home — zig-zag path (mobile + desktop) */
const PATH_NODES = [
  { id: "start", type: "start" as const, align: "center" as const },
  { id: "plant-1", type: "chest" as const, icon: "/assets/child-path/plant-chest.svg", align: "left" as const },
  { id: "fwd-1", type: "forward" as const, icon: "/assets/child-path/forward.svg", align: "right" as const },
  { id: "plant-2", type: "chest" as const, icon: "/assets/child-path/plant-leaves.svg", align: "left" as const },
  { id: "fwd-2", type: "forward" as const, icon: "/assets/child-path/forward.svg", align: "right" as const },
];

const alignClass = {
  left: "self-start ml-[6%] md:ml-[14%]",
  right: "self-end mr-[6%] md:mr-[14%]",
  /** Figma places START slightly right of true center */
  center: "self-center translate-x-[18%] md:translate-x-[12%]",
} as const;

export default function ChildPathwayPage() {
  const router = useRouter();
  const child = useChildAuthStore((state) => state.child);
  const { settings } = useAiSettings("child");
  const buddyName = settings.bloomBuddy?.name ?? "Calyx";
  const greetingName = child?.userName?.trim() || "Student";
  const { primaryClass, hasAssignedClass, isLoading: classesLoading } = useChildAssignedClasses();
  const [isStarting, setIsStarting] = useState(false);
  const [latestMoodLabel, setLatestMoodLabel] = useState<string | null>(null);
  const [tipsOpen, setTipsOpen] = useState(false);
  const canStartClass = hasAssignedClass && !classesLoading;
  const focusArea = primaryClass?.focusArea?.trim() || null;
  const tutorBrain = primaryClass?.tutorBrain ?? null;

  const badgesQuery = useQuery({
    queryKey: ["child", "badges"],
    queryFn: fetchChildBadges,
  });

  useEffect(() => {
    void syncChildBadgeActivity().catch(() => {
      // Optional streak sync.
    });
  }, []);

  useEffect(() => {
    fetchBloomBuddyTrends(7)
      .then((trends) => {
        const latest = trends.checkIns.at(-1);
        if (!latest) return;
        const labels: Record<string, string> = {
          HAPPY: "😊 Feeling happy",
          OKAY: "😐 Feeling okay",
          WORRIED: "😟 Feeling worried",
          SAD: "😢 Feeling sad",
          ANGRY: "😠 Feeling angry",
          TIRED: "😴 Feeling tired",
        };
        setLatestMoodLabel(labels[latest.mood] ?? null);
      })
      .catch(() => {
        // Optional dashboard widget.
      });
  }, []);

  const handleStartClass = async () => {
    if (isStarting || !canStartClass) {
      return;
    }
    setIsStarting(true);
    try {
      await navigateToChildClass(router, hasAssignedClass);
    } catch (error) {
      notify.error(error, "Unable to start class.");
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header - desktop only (mobile uses shared logo + menu) */}
      <div className="hidden md:flex flex-col gap-1 px-4 md:px-5 lg:px-6 pt-4 md:pt-5 lg:pt-6 pb-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h1 style={{ ...inter, fontWeight: 600, fontSize: "22px", color: "#DCE6EC" }}>Pathway</h1>
          <div className="hidden md:block">
            <ChildUserDropdown />
          </div>
        </div>
        <Breadcrumbs
          showHome={false}
          items={[{ href: "/child-dashboard", label: "Pathway" }]}
        />
      </div>

      {/* Two column layout */}
      <div className="flex flex-col lg:flex-row lg:flex-1 lg:min-h-0">
      {/* Main Content */}
      <div className="flex-1 min-w-0 px-6 md:px-5 lg:px-6 pt-2 md:pt-0 pb-6 overflow-y-auto overflow-x-hidden scrollbar-hide">
        {/* Welcome Banner — Figma Child Flow Home */}
        <div
          className="rounded-[6px] md:rounded-[16px] px-2 py-2 md:px-8 md:py-5 mb-3 md:mb-4 flex items-center justify-between gap-2"
          style={{ background: "linear-gradient(90deg, #60D624 0%, #00696B 100%)" }}
        >
          <div className="min-w-0 flex-1">
            <p
              className="text-[10px] md:text-sm leading-[14px] md:leading-normal opacity-70 md:opacity-80"
              style={{ ...inter, fontWeight: 400, color: "#FFFFFF" }}
            >
              Welcome back, {greetingName}
            </p>
            <p
              className="text-[11px] md:text-xl leading-4 md:leading-normal font-medium md:font-bold mt-0.5 md:mt-1"
              style={{ ...inter, color: "#FFFFFF" }}
            >
              Here&apos;s your learning path today
            </p>
            {hasAssignedClass && primaryClass && (
              <p
                className="hidden md:block"
                style={{ ...inter, fontWeight: 400, fontSize: "12px", color: "rgba(255,255,255,0.65)", marginTop: "6px" }}
              >
                {primaryClass.needsRetake
                  ? `Keep building: ${primaryClass.nextLessonTitle ?? primaryClass.title}`
                  : `${primaryClass.subject} · ${primaryClass.gradeLevel}`}
              </p>
            )}
          </div>
          <button
            className="rounded-[7px] md:rounded-[14px] px-[7px] py-[3px] md:px-6 md:py-3 cursor-pointer hover:opacity-90 transition-opacity flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0px_1px_0px_0px_rgba(0,0,0,0.2)] md:shadow-none"
            style={{
              backgroundColor: "transparent",
              border: "0.5px solid rgba(0,0,0,0.2)",
              ...inter,
              fontWeight: 400,
              fontSize: "11px",
              lineHeight: "18px",
              color: "#FFFFFF",
            }}
            disabled={isStarting || !canStartClass}
            onClick={handleStartClass}
            title={!canStartClass ? "No published class for your grade yet" : undefined}
          >
            {isStarting ? "Starting…" : classesLoading ? "Loading…" : "Start Now"}
          </button>
        </div>

        {!classesLoading && !hasAssignedClass && (
          <div className="mb-4">
            <ChildNoClassBanner />
          </div>
        )}

        {/* Learning Path — Figma zig-zag (tight spacing, mobile + large) */}
        <div className="flex flex-col items-stretch w-full max-w-[240px] md:max-w-[280px] mx-auto pb-8 pt-1 gap-2.5 md:gap-3">
          {PATH_NODES.map((node) => {
            if (node.type === "start") {
              return (
                <div key={node.id} className={`${alignClass[node.align]} relative flex flex-col items-center`}>
                  {/* START speech bubble */}
                  <div className="relative mb-0.5 z-10">
                    <div
                      className="rounded-[8px] px-3 py-1.5 border border-[#37464F]"
                      style={{ backgroundColor: "#313044" }}
                    >
                      <span
                        style={{
                          ...inter,
                          fontWeight: 700,
                          fontSize: "12px",
                          letterSpacing: "0.4px",
                          color: canStartClass ? "#00CED1" : "rgba(255,255,255,0.45)",
                        }}
                      >
                        START
                      </span>
                    </div>
                    <div
                      className="absolute left-1/2 -translate-x-1/2 -bottom-[5px] w-2.5 h-2.5 rotate-45 border-r border-b border-[#37464F]"
                      style={{ backgroundColor: "#313044" }}
                    />
                  </div>

                  {/* Outer ring + button */}
                  <div
                    className={`relative mt-0.5 flex items-center justify-center rounded-full p-[9px] ${
                      canStartClass ? "bg-[#313044]/40" : "bg-[#313044]/20 opacity-70"
                    }`}
                    style={{ width: 72, height: 68 }}
                  >
                    <div
                      role="button"
                      tabIndex={canStartClass ? 0 : -1}
                      aria-disabled={!canStartClass}
                      aria-label={canStartClass ? "Start class" : "No class available yet"}
                      onClick={canStartClass ? handleStartClass : undefined}
                      onKeyDown={(event) => {
                        if (!canStartClass) return;
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          void handleStartClass();
                        }
                      }}
                      className={`relative w-[52px] h-[42px] rounded-full flex items-center justify-center transition-opacity ${
                        canStartClass
                          ? "bg-[#00CED1] cursor-pointer hover:opacity-90"
                          : "bg-[#525162] cursor-not-allowed"
                      }`}
                      style={
                        canStartClass
                          ? { boxShadow: "0px 5px 0px 0px #01A8AB" }
                          : { boxShadow: "0px 5px 0px 0px #424056" }
                      }
                    >
                      <Image
                        src="/assets/child-path/start-hand.svg"
                        alt=""
                        width={24}
                        height={24}
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                  </div>
                </div>
              );
            }

            if (node.type === "chest") {
              return (
                <div key={node.id} className={`${alignClass[node.align]} opacity-55`}>
                  <div className="relative w-[56px] h-[64px] md:w-[62px] md:h-[70px]">
                    <Image
                      src={node.icon}
                      alt=""
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                </div>
              );
            }

            // forward
            return (
              <div key={node.id} className={`${alignClass[node.align]} opacity-55`}>
                <div
                  className="w-[52px] h-[42px] md:w-[56px] md:h-[46px] rounded-full bg-[#313044] flex items-center justify-center"
                  style={{ boxShadow: "0px 5px 0px 0px #424056" }}
                >
                  <Image
                    src={node.icon}
                    alt=""
                    width={30}
                    height={24}
                    className="object-contain opacity-80"
                    unoptimized
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Sidebar - desktop only */}
      <div className="w-full lg:w-[300px] flex-shrink-0 flex flex-col gap-4 p-4 lg:overflow-y-auto lg:scrollbar-hide lg:border-l border-white/5">
        {/* Unlock Next Badge */}
        <div className="rounded-[12px] p-4" style={{ backgroundColor: "#313044" }}>
          <div className="flex items-center justify-between mb-3">
            <h3 style={{ ...inter, fontWeight: 700, fontSize: "14px", color: "#FFFFFF" }}>Unlock Next badge</h3>
            <Link
              href="/child-dashboard/profile/badges"
              style={{ ...inter, fontWeight: 700, fontSize: "12px", color: "#00CED1" }}
            >
              SEE ALL
            </Link>
          </div>
          {badgesQuery.data?.nextUnlock ? (
            <div className="flex items-center gap-3">
              <BadgeShield
                iconStyle={badgesQuery.data.nextUnlock.iconStyle}
                earned={false}
                size={40}
              />
              <div className="flex-1">
                <p style={{ ...inter, fontWeight: 500, fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>
                  {badgesQuery.data.nextUnlock.name}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-[6px] bg-[#525162] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#00CED1] rounded-full"
                      style={{
                        width: `${Math.min(
                          100,
                          (badgesQuery.data.nextUnlock.progressCurrent /
                            Math.max(1, badgesQuery.data.nextUnlock.progressTarget)) *
                            100,
                        )}%`,
                      }}
                    />
                  </div>
                  <span style={{ ...inter, fontWeight: 700, fontSize: "12px", color: "#FFFFFF" }}>
                    {badgesQuery.data.nextUnlock.progressCurrent} /{" "}
                    {badgesQuery.data.nextUnlock.progressTarget}
                  </span>
                </div>
                <p style={{ ...inter, fontWeight: 400, fontSize: "11px", color: "rgba(255,255,255,0.4)", marginTop: "2px" }}>
                  {badgesQuery.data.nextUnlock.progressLabel}
                </p>
              </div>
            </div>
          ) : (
            <p style={{ ...inter, fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>
              {badgesQuery.isLoading
                ? "Loading badge progress…"
                : "Keep learning to unlock badges."}
            </p>
          )}
        </div>

        {/* Next Step — Tutor Brain explainability (Blueprint C2) */}
        <div className="rounded-[12px] p-4" style={{ backgroundColor: "#313044" }}>
          <div className="flex items-center justify-between gap-2 mb-2">
            <h3 style={{ ...inter, fontWeight: 700, fontSize: "14px", color: "#FFFFFF" }}>
              Next Step
            </h3>
            {tutorBrain?.whyKind === "retake" || primaryClass?.needsRetake ? (
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                style={{ backgroundColor: "rgba(245,158,11,0.15)", color: "#F59E0B" }}
              >
                Skill boost
              </span>
            ) : tutorBrain?.interestPersonalized ? (
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                style={{ backgroundColor: "rgba(0,206,209,0.15)", color: "#00CED1" }}
              >
                Personalized
              </span>
            ) : null}
          </div>

          <p style={{ ...inter, fontWeight: 600, fontSize: "13px", color: "#FFFFFF" }}>
            {primaryClass?.nextLessonTitle ??
              focusArea ??
              (hasAssignedClass ? "Loading next step…" : "No lesson assigned yet")}
          </p>
          {focusArea ? (
            <p style={{ ...inter, fontWeight: 400, fontSize: "11px", color: "#00CED1", marginTop: 4 }}>
              {focusArea}
            </p>
          ) : null}

          <div
            className="mt-3 rounded-xl border border-[#00CED1]/25 bg-[#00CED1]/5 px-3 py-2.5"
          >
            <p
              style={{
                ...inter,
                fontSize: "10px",
                fontWeight: 600,
                color: "#00CED1",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Why this next step
            </p>
            <p
              style={{
                ...inter,
                fontSize: "12px",
                lineHeight: "17px",
                color: "rgba(255,255,255,0.8)",
                marginTop: 6,
              }}
            >
              {tutorBrain?.summary ??
                (primaryClass?.needsRetake
                  ? "Your Tutor Brain wants another session with a new picture to strengthen this skill before the next lesson."
                  : hasAssignedClass
                    ? "Your Tutor Brain chose the next unmastered lesson on your pathway."
                    : "Ask a parent or Wayfinder to assign a class to get started.")}
            </p>
            {(tutorBrain?.reasons?.length ?? 0) > 0 ? (
              <ul className="mt-2 space-y-1">
                {tutorBrain!.reasons.slice(0, 3).map((reason) => (
                  <li
                    key={reason}
                    style={{
                      ...inter,
                      fontSize: "11px",
                      color: "rgba(255,255,255,0.55)",
                      lineHeight: "15px",
                    }}
                  >
                    • {reason}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={!canStartClass || isStarting}
              onClick={() => void handleStartClass()}
              className="rounded-full px-3.5 py-1.5 text-xs font-semibold disabled:opacity-50 cursor-pointer"
              style={{ backgroundColor: "#00CED1", color: "#111023", ...inter }}
            >
              {isStarting ? "Starting…" : "Start"}
            </button>
            <button
              type="button"
              onClick={() => setTipsOpen(true)}
              className="rounded-full px-3.5 py-1.5 text-xs font-semibold border border-white/20 text-white/80 cursor-pointer"
              style={inter}
            >
              Review tips
            </button>
            <Link
              href="/child-dashboard/modules"
              className="rounded-full px-3.5 py-1.5 text-xs font-semibold border border-[#00CED1]/40 text-[#00CED1]"
              style={inter}
            >
              Pick module
            </Link>
          </div>
        </div>

        {tipsOpen ? (
          <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
            <button
              type="button"
              className="absolute inset-0 bg-black/70 cursor-pointer"
              aria-label="Close tips"
              onClick={() => setTipsOpen(false)}
            />
            <div
              role="dialog"
              aria-modal="true"
              className="relative w-full max-w-md rounded-[16px] border border-white/10 bg-[#313044] p-5 shadow-xl"
              style={inter}
            >
              <h3 className="text-white text-base font-semibold">Review tips</h3>
              <p className="text-white/55 text-sm mt-1">
                From your Tutor Brain for{" "}
                {primaryClass?.nextLessonTitle ?? "today's lesson"}
              </p>
              <ul className="mt-4 space-y-2">
                {(tutorBrain?.reasons?.length
                  ? tutorBrain.reasons
                  : [
                      "Take your time on practice before Quick Check.",
                      "Use Need a hint? if a question feels tricky.",
                      "A short reteach helps more than rushing ahead.",
                    ]
                ).map((tip) => (
                  <li
                    key={tip}
                    className="rounded-xl bg-white/[0.04] border border-white/10 px-3 py-2 text-sm text-white/80"
                  >
                    {tip}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => setTipsOpen(false)}
                className="mt-4 w-full rounded-full py-2 text-sm font-semibold cursor-pointer"
                style={{ backgroundColor: "#00CED1", color: "#111023" }}
              >
                Got it
              </button>
            </div>
          </div>
        ) : null}

        {/* Daily Message from Wayfinder */}
        <div className="rounded-[12px] p-4" style={{ backgroundColor: "#313044" }}>
          <h3 style={{ ...inter, fontWeight: 700, fontSize: "14px", color: "#FFFFFF", marginBottom: "10px" }}>Daily Message from Wayfinder</h3>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-[8px] bg-[#525162] flex items-center justify-center flex-shrink-0 text-lg">
              💡
            </div>
            <p style={{ ...inter, fontWeight: 400, fontSize: "13px", lineHeight: "18px", color: "rgba(255,255,255,0.7)" }}>
              Look for clues in the second paragraph.
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="rounded-[12px] p-4" style={{ backgroundColor: "#313044" }}>
          <div className="flex items-center justify-between mb-3">
            <h3 style={{ ...inter, fontWeight: 700, fontSize: "14px", color: "#FFFFFF" }}>Messages</h3>
            <span style={{ ...inter, fontWeight: 700, fontSize: "12px", color: "#00CED1", cursor: "pointer" }}>OPEN CHAT</span>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 rounded-[10px] p-2.5" style={{ backgroundColor: "#525162" }}>
              <div className="w-8 h-8 rounded-full bg-[#F59E0B] flex items-center justify-center flex-shrink-0 text-sm">😊</div>
              <div>
                <p style={{ ...inter, fontWeight: 600, fontSize: "12px", color: "#FFFFFF" }}>{buddyName}</p>
                <p style={{ ...inter, fontWeight: 400, fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>
                  {latestMoodLabel ?? "Check in with Bloom Buddy before class"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-[10px] p-2.5" style={{ backgroundColor: "#525162" }}>
              <div className="w-8 h-8 rounded-full bg-[#F59E0B] flex items-center justify-center flex-shrink-0 text-sm">🔔</div>
              <div>
                <p style={{ ...inter, fontWeight: 600, fontSize: "12px", color: "#FFFFFF" }}>Wayfinder sent note</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center gap-4 mt-auto pt-4">
          {["ABOUT", "BLOG", "TERMS", "PRIVACY"].map((link) => (
            <span key={link} style={{ ...inter, fontWeight: 500, fontSize: "11px", color: "rgba(255,255,255,0.3)", cursor: "pointer" }}>
              {link}
            </span>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
}
