"use client";

import { useState, useRef, useEffect } from "react";
import PortalAvatar from "@/components/shared/PortalAvatar";
import { logoutChild } from "@/lib/auth-session";
import { useChildAuthStore } from "@/stores/child-auth.store";

const inter = { fontFamily: "Inter, sans-serif" } as const;

function formatChildGrade(grade: string | null | undefined): string {
  if (!grade?.trim()) return "Student";
  if (/^grade\s/i.test(grade.trim())) return grade.trim();
  return `Grade ${grade.trim()}`;
}

export default function ChildUserDropdown() {
  const child = useChildAuthStore((state) => state.child);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const displayName = child?.userName?.trim() || "Student";
  const displayGrade = formatChildGrade(child?.grade);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    setOpen(false);
    logoutChild(true);
  }

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)} className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity">
        <PortalAvatar name={displayName} avatarUrl={child?.avatarUrl} />
        <div className="hidden sm:block text-left">
          <p style={{ ...inter, fontWeight: 600, fontSize: "16px", lineHeight: "22px", color: "#FFFFFF" }}>{displayName}</p>
          <p style={{ ...inter, fontWeight: 400, fontSize: "12px", lineHeight: "16px", color: "rgba(255,255,255,0.5)" }}>{displayGrade}</p>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className={`opacity-50 transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-[200px] rounded-[12px] overflow-hidden z-50 shadow-lg" style={{ backgroundColor: "#313044", border: "1px solid rgba(255,255,255,0.1)" }}>
          <div className="px-4 py-3 border-b border-white/10">
            <p style={{ ...inter, fontWeight: 600, fontSize: "14px", color: "#FFFFFF" }}>{displayName}</p>
            <p style={{ ...inter, fontWeight: 400, fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>{displayGrade}</p>
          </div>
          <button onClick={handleLogout} className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-white/5 transition-colors cursor-pointer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span style={{ ...inter, fontWeight: 500, fontSize: "14px", color: "#EF4444" }}>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
}
