"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

function AlertIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={active ? "text-[#00CED1]" : "text-white/60"}
    >
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

const navItems = [
  {
    label: "DASHBOARD",
    href: "/dashboard",
    matchPaths: ["/dashboard"],
    iconSrc: "/assets/dashboard.png",
  },
  {
    label: "STUDENTS",
    href: "/dashboard/students",
    matchPaths: ["/dashboard/students", "/dashboard/student"],
    iconSrc: "/assets/student.png",
  },
  {
    label: "LIVE SESSIONS",
    href: "/dashboard/live-sessions",
    matchPaths: ["/dashboard/live-sessions"],
    iconSrc: "/assets/live.png",
  },
  {
    label: "ALERTS CENTER",
    href: "/dashboard/alerts",
    matchPaths: ["/dashboard/alerts"],
    icon: "alert" as const,
    badge: 3,
  },
  {
    label: "MESSAGE",
    href: "/dashboard/message",
    matchPaths: ["/dashboard/message"],
    iconSrc: "/assets/message.png",
  },
  {
    label: "PROFILE",
    href: "/dashboard/profile",
    matchPaths: ["/dashboard/profile"],
    iconSrc: "/assets/profile.png",
  },
];

function matchesNavPath(pathname: string, path: string) {
  return pathname === path || pathname.startsWith(`${path}/`);
}

function getActiveNavHref(pathname: string) {
  let activeHref: string | null = null;
  let longestMatch = -1;

  for (const item of navItems) {
    const paths = item.matchPaths ?? [item.href];
    for (const path of paths) {
      if (matchesNavPath(pathname, path) && path.length > longestMatch) {
        longestMatch = path.length;
        activeHref = item.href;
      }
    }
  }

  return activeHref;
}

export default function Sidebar() {
  const pathname = usePathname();
  const activeHref = getActiveNavHref(pathname);
  const [collapsed, setCollapsed] = useState(false);

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
            className={`object-contain transition-all duration-300 ${
              collapsed ? "w-8 h-8" : "w-10 h-10"
            }`}
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
                  {"icon" in item && item.icon === "alert" ? (
                    <AlertIcon active={isActive} />
                  ) : (
                    <Image
                      src={item.iconSrc!}
                      alt={item.label}
                      width={22}
                      height={22}
                      className={`w-[22px] h-[22px] object-contain ${isActive ? "brightness-0 invert-0" : "opacity-60"}`}
                      style={isActive ? { filter: "brightness(0) saturate(100%) invert(72%) sepia(52%) saturate(2894%) hue-rotate(139deg) brightness(96%) contrast(101%)" } : {}}
                      unoptimized
                    />
                  )}
                </span>
                {!collapsed && (
                  <span
                    className="text-[13px] font-medium tracking-wider flex-1"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {item.label}
                  </span>
                )}
                {"badge" in item && item.badge && !collapsed && (
                  <span className="ml-auto min-w-[18px] h-[18px] px-1.5 rounded-full bg-[#FF6F6F] text-white text-[10px] font-bold flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
                {"badge" in item && item.badge && collapsed && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#FF6F6F]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Collapse toggle */}
        <div className="px-3 pb-6">
          <button
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
              <span
                className="text-[13px] font-medium tracking-wider"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                COLLAPSE
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#111023] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image
            src="/assets/logo.png"
            alt="Thaylo"
            width={40}
            height={40}
            className="w-8 h-8 object-contain"
          />
          <div className="leading-none">
            <span className="block text-[16px] font-medium tracking-[0.08em]" style={{ background: "linear-gradient(90deg, #60D624, #00A19A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              THAYLO
            </span>
            <span className="block text-[6px] tracking-[0.2em] text-[#60D624]/70 uppercase mt-0.5">
              GLOBAL AI SCHOOL
            </span>
          </div>
        </div>
        <button className="text-white/60">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#313044] border-t border-white/10 flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive = activeHref === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              aria-label={item.label}
              className={`relative flex items-center justify-center w-12 h-12 rounded-xl transition-all ${
                isActive ? "text-[#00CED1] bg-[#111023]" : "text-white/40"
              }`}
            >
              {"icon" in item && item.icon === "alert" ? (
                <AlertIcon active={isActive} />
              ) : (
                <Image
                  src={item.iconSrc!}
                  alt={item.label}
                  width={22}
                  height={22}
                  className="w-[22px] h-[22px] object-contain"
                  style={isActive ? { filter: "brightness(0) saturate(100%) invert(72%) sepia(52%) saturate(2894%) hue-rotate(139deg) brightness(96%) contrast(101%)" } : { opacity: 0.4 }}
                  unoptimized
                />
              )}
              {"badge" in item && item.badge ? (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF6F6F]" />
              ) : null}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
