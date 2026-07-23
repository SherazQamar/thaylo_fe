"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import PortalAvatar from "@/components/shared/PortalAvatar";
import { logoutUser } from "@/lib/auth-session";
import { useAuthStore } from "@/stores/auth.store";

const inter = { fontFamily: "Inter, sans-serif" } as const;

export default function UserDropdown() {
  const user = useAuthStore((state) => state.user);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const displayName = user?.name ?? "Wayfinder";
  const displayEmail = user?.email ?? "";

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    setOpen(false);
    logoutUser(true);
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity"
      >
        <PortalAvatar name={displayName} avatarUrl={user?.avatarUrl} />
        <div className="hidden sm:block text-left">
          <p style={{ ...inter, fontWeight: 600, fontSize: "16px", lineHeight: "22px", color: "#FFFFFF" }}>{displayName}</p>
          <p style={{ ...inter, fontWeight: 400, fontSize: "12px", lineHeight: "16px", color: "rgba(255,255,255,0.5)" }}>Wayfinder</p>
        </div>
        <Image
          src="/assets/arrow-down.png"
          alt=""
          width={16}
          height={16}
          className={`w-4 h-4 object-contain opacity-50 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          unoptimized
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-[200px] rounded-[12px] overflow-hidden z-50 shadow-lg" style={{ backgroundColor: "#313044", border: "1px solid rgba(255,255,255,0.1)" }}>
          <div className="px-4 py-3 border-b border-white/10">
            <p style={{ ...inter, fontWeight: 600, fontSize: "14px", lineHeight: "20px", color: "#FFFFFF" }}>{displayName}</p>
            <p style={{ ...inter, fontWeight: 400, fontSize: "12px", lineHeight: "16px", color: "rgba(255,255,255,0.5)" }}>{displayEmail}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-white/5 transition-colors cursor-pointer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span style={{ ...inter, fontWeight: 500, fontSize: "14px", lineHeight: "20px", color: "#EF4444" }}>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
}
