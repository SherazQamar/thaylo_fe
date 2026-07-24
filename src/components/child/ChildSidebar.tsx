"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import ChildNoClassBanner from "@/components/child/ChildNoClassBanner";
import ChildUserDropdown from "@/components/child/ChildUserDropdown";
import NavUnreadBadge from "@/components/shared/chat/NavUnreadBadge";
import { useChildAssignedClasses } from "@/hooks/use-child-assigned-classes";
import { useChatUnreadCount } from "@/hooks/use-chat-unread-count";
import { navigateToChildClass } from "@/lib/start-child-class";

const inter = { fontFamily: "Inter, sans-serif" } as const;

/** Teal tint for icons that only have an inactive (grey) Figma export */
const ACTIVE_TEAL_FILTER =
  "brightness(0) saturate(100%) invert(72%) sepia(47%) saturate(1846%) hue-rotate(131deg) brightness(97%) contrast(101%)";

const navItems = [
  {
    label: "PATHWAY",
    href: "/child-dashboard",
    matchPaths: ["/child-dashboard"],
    iconInactive: "/assets/child-nav/pathway-inactive.svg",
    iconActive: "/assets/child-nav/pathway-active.svg",
  },
  {
    label: "PROGRESS",
    href: "/child-dashboard/modules",
    matchPaths: ["/child-dashboard/modules"],
    iconInactive: "/assets/child-nav/modules-inactive.svg",
    iconActive: "/assets/child-nav/modules-active.svg",
  },
  {
    label: "MESSAGE",
    href: "/child-dashboard/message",
    matchPaths: ["/child-dashboard/message"],
    iconInactive: "/assets/child-nav/message-inactive.svg",
    iconActive: "/assets/child-nav/message-inactive.svg",
    tintActive: true,
  },
  {
    label: "PROFILE",
    href: "/child-dashboard/profile",
    matchPaths: ["/child-dashboard/profile"],
    iconInactive: "/assets/child-nav/profile-inactive.png",
    iconActive: "/assets/child-nav/profile-active.png",
  },
  {
    label: "SETTING",
    href: "/child-dashboard/settings",
    matchPaths: ["/child-dashboard/settings"],
    iconInactive: "/assets/child-nav/settings-inactive.svg",
    iconActive: "/assets/child-nav/settings-inactive.svg",
    tintActive: true,
  },
] as const;

function ChildNavIcon({
  item,
  active,
  size = 32,
}: {
  item: (typeof navItems)[number];
  active: boolean;
  size?: number;
}) {
  const src = active ? item.iconActive : item.iconInactive;
  const tint = active && "tintActive" in item && item.tintActive;
  return (
    <Image
      src={src}
      alt=""
      width={size}
      height={size}
      className="object-contain"
      style={{
        width: size,
        height: size,
        filter: tint ? ACTIVE_TEAL_FILTER : undefined,
      }}
      unoptimized
    />
  );
}

export default function ChildSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const { unreadTotal } = useChatUnreadCount("child");
  const { primaryClass, hasAssignedClass, isLoading: classesLoading } = useChildAssignedClasses();
  const canStartClass = hasAssignedClass && !classesLoading;

  const handleStartClass = async () => {
    if (isStarting || !canStartClass) return;
    setIsStarting(true);
    try {
      await navigateToChildClass(router, hasAssignedClass);
    } catch {
      // Progress page banner covers the no-class state; ignore sidebar errors.
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex h-screen bg-[#313044] flex-col transition-all duration-300 ${
          collapsed ? "w-[80px]" : "w-[250px]"
        }`}
      >
        {/* Logo */}
        <div className="px-5 pt-6 pb-8 flex items-center gap-2.5">
          <Image
            src="/assets/logo.png"
            alt="Thaylo"
            width={48}
            height={48}
            className={`object-contain transition-all duration-300 ${collapsed ? "w-8 h-8" : "w-10 h-10"}`}
          />
          {!collapsed && (
            <div className="leading-none">
              <span className="block text-[18px] font-medium tracking-[0.08em]" style={{ background: "linear-gradient(90deg, #60D624, #00A19A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                THAYLO
              </span>
              <span className="block text-[7px] tracking-[0.2em] text-[#60D624]/70 uppercase mt-0.5">
                GLOBAL AI SCHOOL
              </span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-1 px-3">
          {navItems.map((item) => {
            const isActive = item.matchPaths.some((p) => pathname === p);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`relative flex items-center gap-3 rounded-xl transition-all duration-200 ${
                  collapsed ? "justify-center px-3 py-3.5" : "px-4 py-3.5"
                } ${
                  isActive
                    ? "bg-[#111023] text-[#00CED1] border-l-[5px] border-[#00CED1]"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className="flex-shrink-0">
                  <ChildNavIcon item={item} active={isActive} size={22} />
                </span>
                {!collapsed && (
                  <span className="text-[13px] font-medium tracking-wider flex-1" style={inter}>
                    {item.label}
                  </span>
                )}
                {item.label === "MESSAGE" ? (
                  <NavUnreadBadge count={unreadTotal} collapsed={collapsed} />
                ) : null}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Module Card */}
        {!collapsed && (
          <div className="px-3 pb-4">
            {hasAssignedClass && primaryClass ? (
              <div className="rounded-[16px] p-4 flex flex-col items-center" style={{ backgroundColor: "#111023" }}>
                <div className="w-[80px] h-[80px] rounded-full bg-[#313044] border-4 border-[#525162] flex items-center justify-center mb-3">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00CED1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22V8" /><path d="M5 12H2a10 10 0 0020 0h-3" /><path d="M8 5.2C9.2 3.6 10.5 3 12 3c1.5 0 2.8.6 4 2.2" />
                  </svg>
                </div>
                <p className="text-white text-xs font-semibold text-center mb-1" style={inter}>
                  {primaryClass.needsRetake
                    ? `Retake: ${primaryClass.nextLessonTitle ?? primaryClass.title}`
                    : primaryClass.nextLessonTitle ?? primaryClass.title}
                </p>
                <div className="flex items-center gap-1.5 text-white/50 text-[11px] mb-3">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                  {primaryClass.estimatedMinutes ? `${primaryClass.estimatedMinutes} min` : primaryClass.subject}
                </div>
                <button
                  className="w-full py-2 rounded-[10px] text-xs font-semibold uppercase tracking-wider cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: "#00CED1", color: "#111023", ...inter }}
                  disabled={isStarting || !canStartClass}
                  onClick={handleStartClass}
                >
                  {isStarting ? "Starting…" : classesLoading ? "Loading…" : "Start NOW"}
                </button>
              </div>
            ) : !classesLoading ? (
              <ChildNoClassBanner compact />
            ) : (
              <div className="rounded-[16px] p-4 text-center text-white/40 text-xs" style={{ backgroundColor: "#111023" }}>
                Loading class…
              </div>
            )}
          </div>
        )}

        {/* Collapse toggle */}
        <div className="px-3 pb-4">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-white/40 hover:text-white/70 transition-colors w-full cursor-pointer ${collapsed ? "justify-center" : ""}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}>
              <polyline points="11 17 6 12 11 7" />
              <polyline points="18 17 13 12 18 7" />
            </svg>
            {!collapsed && <span className="text-[13px] font-medium tracking-wider" style={inter}>COLLAPSE</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Header — logo left, menu right (Figma Child Flow) */}
      <div
        className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#111023] px-6 pb-3 flex items-center justify-between"
        style={{ paddingTop: "max(1.25rem, env(safe-area-inset-top, 0px))" }}
      >
        <div className="flex items-center gap-[5px]">
          <Image src="/assets/logo.png" alt="Thaylo" width={28} height={35} className="w-7 h-[35px] object-contain" />
          <div className="leading-none">
            <span className="block text-[16px] font-medium tracking-[0.08em]" style={{ background: "linear-gradient(90deg, #60D624, #00A19A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>THAYLO</span>
            <span className="block text-[6px] tracking-[0.2em] text-[#60D624]/70 uppercase mt-0.5">GLOBAL AI SCHOOL</span>
          </div>
        </div>
        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="relative size-6 shrink-0 cursor-pointer"
        >
          {menuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <Image
              src="/assets/child-nav/menu.png"
              alt=""
              width={24}
              height={24}
              className="size-6"
              unoptimized
            />
          )}
        </button>
      </div>

      {/* Mobile slide-out menu */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-[60]">
          <button
            type="button"
            className="absolute inset-0 bg-black/60 cursor-pointer"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          />
          <div
            className="absolute top-0 right-0 h-full w-[280px] max-w-[85vw] bg-[#313044] shadow-xl flex flex-col px-4 pb-6 overflow-visible"
            style={{ paddingTop: "calc(max(1.25rem, env(safe-area-inset-top, 0px)) + 47px)" }}
          >
            <nav className="flex flex-col gap-1 flex-1 overflow-y-auto min-h-0">
              {navItems.map((item) => {
                const isActive = item.matchPaths.some((p) => pathname === p);
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`relative flex items-center gap-3 rounded-xl px-4 py-3.5 transition-colors ${
                      isActive
                        ? "bg-[#111023] text-[#00CED1]"
                        : "text-white/70 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span className="flex-shrink-0">
                      <ChildNavIcon item={item} active={isActive} size={24} />
                    </span>
                    <span className="text-[13px] font-medium tracking-wider flex-1" style={inter}>
                      {item.label}
                    </span>
                    {item.label === "MESSAGE" ? (
                      <NavUnreadBadge count={unreadTotal} collapsed={false} />
                    ) : null}
                  </Link>
                );
              })}
            </nav>
            <div
              className="relative z-[80] pt-4 border-t border-white/10 shrink-0 overflow-visible"
              style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom, 0px))" }}
            >
              <ChildUserDropdown showLabel menuPlacement="top" />
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Nav — Figma icons */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#111023] flex items-center justify-between px-6 pt-3"
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom, 0px))" }}
      >
        {navItems.map((item) => {
          const isActive = item.matchPaths.some((p) => pathname === p);
          return (
            <Link
              key={item.label}
              href={item.href}
              aria-label={item.label}
              className="relative flex items-center justify-center size-8"
            >
              <ChildNavIcon item={item} active={isActive} size={32} />
              {item.label === "MESSAGE" ? (
                <NavUnreadBadge count={unreadTotal} collapsed />
              ) : null}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
