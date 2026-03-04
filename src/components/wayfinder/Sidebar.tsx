"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    label: "DASHBOARD",
    href: "/dashboard",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    label: "STUDENTS",
    href: "/students",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="5" />
        <path d="M8 14h.01M16 14h.01" />
        <path d="M9 18c0 0 1.5-1 3-1s3 1 3 1" />
      </svg>
    ),
  },
  {
    label: "LIVE SESSIONS",
    href: "/live-sessions",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        <path d="M8 10h.01M12 10h.01M16 10h.01" />
      </svg>
    ),
  },
  {
    label: "MESSAGE",
    href: "/message",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
      </svg>
    ),
  },
  {
    label: "PROFILE",
    href: "/profile",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`h-screen bg-[#313044] flex flex-col transition-all duration-300 ${
        collapsed ? "w-[80px]" : "w-[250px]"
      }`}
    >
      {/* Logo */}
      <div className="px-5 pt-6 pb-8 flex items-center gap-3">
        <Image
          src="/assets/logo.png"
          alt="Thaylo"
          width={140}
          height={140}
          className={`object-contain transition-all duration-300 ${
            collapsed ? "h-[30px]" : "h-[50px]"
          } w-auto`}
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1 px-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
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
              <span className="flex-shrink-0">{item.icon}</span>
              {!collapsed && (
                <span
                  className="text-[13px] font-medium tracking-wider"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {item.label}
                </span>
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
  );
}
