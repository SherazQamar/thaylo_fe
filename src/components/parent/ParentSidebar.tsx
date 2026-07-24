"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NavUnreadBadge from "@/components/shared/chat/NavUnreadBadge";
import ParentUserDropdown from "@/components/parent/ParentUserDropdown";
import { useChatUnreadCount } from "@/hooks/use-chat-unread-count";

const inter = { fontFamily: "Inter, sans-serif" } as const;

type NavIconId =
  | "home"
  | "children"
  | "reports"
  | "billing"
  | "message"
  | "profile"
  | "settings";

type NavItem = {
  label: string;
  href: string;
  matchPaths: string[];
  icon: NavIconId;
  /** Figma mobile bottom bar: home, baby, transaction-minus, message, user */
  mobileBottom?: boolean;
};

/** Figma outline icons — home-2 / baby 1 / transaction-minus / message 1 / user 1 */
function NavIcon({
  id,
  active,
  size = 22,
}: {
  id: NavIconId;
  active: boolean;
  size?: number;
}) {
  const color = active ? "#00CED1" : "rgba(255,255,255,0.55)";
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none" as const,
    stroke: color,
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (id) {
    case "home":
      return (
        <svg {...common}>
          <path d="M3 10.5L12 3l9 7.5" />
          <path d="M5 9.5V20a1 1 0 001 1h4.5v-6h3v6H18a1 1 0 001-1V9.5" />
        </svg>
      );
    case "children":
      // Figma baby 1
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
          <circle cx="9.2" cy="11.2" r="1" fill={color} stroke="none" />
          <circle cx="14.8" cy="11.2" r="1" fill={color} stroke="none" />
          <path d="M9.2 14.8c.9 1.3 2 1.9 2.8 1.9s1.9-.6 2.8-1.9" />
          <path d="M12.2 4.2c.5-1.3 1.8-1.7 2.6-1" />
        </svg>
      );
    case "billing":
      // Figma transaction-minus
      return (
        <svg {...common}>
          <path d="M9 3.5h6a2 2 0 012 2v12.2c0 .5-.55.8-1 .5l-1.5-1.1-1.5 1.1c-.3.22-.7.22-1 0l-1.5-1.1-1.5 1.1c-.45.3-1 0-1-.5V5.5a2 2 0 012-2z" />
          <line x1="10.5" y1="10.5" x2="13.5" y2="10.5" />
        </svg>
      );
    case "reports":
      return (
        <svg {...common}>
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      );
    case "message":
      return (
        <svg {...common}>
          <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
        </svg>
      );
    case "profile":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="10" r="3" />
          <path d="M6.5 18.5a6 6 0 0111 0" />
        </svg>
      );
    case "settings":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
        </svg>
      );
    default:
      return null;
  }
}

const navItems: NavItem[] = [
  {
    label: "DASHBOARD",
    href: "/parent-dashboard",
    matchPaths: ["/parent-dashboard"],
    icon: "home",
    mobileBottom: true,
  },
  {
    label: "CHILDREN",
    href: "/parent-dashboard/children",
    matchPaths: ["/parent-dashboard/children", "/parent-dashboard/child"],
    icon: "children",
    mobileBottom: true,
  },
  {
    label: "REPORTS",
    href: "/parent-dashboard/reports",
    matchPaths: ["/parent-dashboard/reports"],
    icon: "reports",
  },
  {
    label: "BILLING",
    href: "/parent-dashboard/subscription",
    matchPaths: ["/parent-dashboard/subscription"],
    icon: "billing",
    mobileBottom: true,
  },
  {
    label: "MESSAGE",
    href: "/parent-dashboard/message",
    matchPaths: ["/parent-dashboard/message"],
    icon: "message",
    mobileBottom: true,
  },
  {
    label: "PROFILE",
    href: "/parent-dashboard/profile",
    matchPaths: ["/parent-dashboard/profile"],
    icon: "profile",
    mobileBottom: true,
  },
  {
    label: "SETTINGS",
    href: "/parent-dashboard/settings",
    matchPaths: ["/parent-dashboard/settings"],
    icon: "settings",
  },
];

const mobileBottomItems = navItems.filter((item) => item.mobileBottom);

function matchesNavPath(pathname: string, path: string) {
  return pathname === path || pathname.startsWith(`${path}/`);
}

function getActiveNavHref(pathname: string) {
  let activeHref: string | null = null;
  let longestMatch = -1;

  for (const item of navItems) {
    for (const path of item.matchPaths) {
      if (matchesNavPath(pathname, path) && path.length > longestMatch) {
        longestMatch = path.length;
        activeHref = item.href;
      }
    }
  }

  return activeHref;
}

export default function ParentSidebar() {
  const pathname = usePathname();
  const activeHref = getActiveNavHref(pathname);
  const [collapsed, setCollapsed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { unreadTotal } = useChatUnreadCount("parent");

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex h-screen bg-[#313044] flex-col transition-all duration-300 ${
          collapsed ? "w-[80px]" : "w-[250px]"
        }`}
      >
        <div className="px-5 pt-6 pb-8 flex items-center gap-2.5">
          <Image
            src="/assets/logo.png"
            alt="Thaylo"
            width={48}
            height={48}
            className={`object-contain transition-all duration-300 ${
              collapsed ? "w-8 h-8" : "w-10 h-10"
            }`}
          />
          {!collapsed && (
            <div className="leading-none">
              <span
                className="block text-[18px] font-medium tracking-[0.08em]"
                style={{
                  background: "linear-gradient(90deg, #60D624, #00A19A)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                THAYLO
              </span>
              <span className="block text-[7px] tracking-[0.2em] text-[#60D624]/70 uppercase mt-0.5">
                GLOBAL AI SCHOOL
              </span>
            </div>
          )}
        </div>

        <nav className="flex-1 flex flex-col gap-1 px-3">
          {navItems.map((item) => {
            const isActive = activeHref === item.href;
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
                  <NavIcon id={item.icon} active={isActive} size={22} />
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

        <div className="px-3 pb-6">
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-white/40 hover:text-white/70 transition-colors w-full cursor-pointer ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
            >
              <polyline points="11 17 6 12 11 7" />
              <polyline points="18 17 13 12 18 7" />
            </svg>
            {!collapsed && (
              <span className="text-[13px] font-medium tracking-wider" style={inter}>
                COLLAPSE
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* Mobile Header — logo + hamburger */}
      <div
        className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#111023] px-4 pb-3 flex items-center justify-between"
        style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top, 0px))" }}
      >
        <div className="flex items-center gap-2">
          <Image
            src="/assets/logo.png"
            alt="Thaylo"
            width={40}
            height={40}
            className="w-8 h-8 object-contain"
          />
          <div className="leading-none">
            <span
              className="block text-[16px] font-medium tracking-[0.08em]"
              style={{
                background: "linear-gradient(90deg, #60D624, #00A19A)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              THAYLO
            </span>
            <span className="block text-[6px] tracking-[0.2em] text-[#60D624]/70 uppercase mt-0.5">
              GLOBAL AI SCHOOL
            </span>
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
            style={{
              paddingTop: "calc(max(0.75rem, env(safe-area-inset-top, 0px)) + 52px)",
            }}
          >
            <nav className="flex flex-col gap-1 flex-1 overflow-y-auto min-h-0">
              {navItems.map((item) => {
                const isActive = activeHref === item.href;
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
                      <NavIcon id={item.icon} active={isActive} size={24} />
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
              <ParentUserDropdown showLabel menuPlacement="top" />
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Nav — Figma: home, children, billing, message, profile */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#111023] flex items-center justify-between px-6 pt-3"
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom, 0px))" }}
      >
        {mobileBottomItems.map((item) => {
          const isActive = activeHref === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              aria-label={item.label}
              className="relative flex items-center justify-center size-8"
            >
              <NavIcon id={item.icon} active={isActive} size={32} />
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
