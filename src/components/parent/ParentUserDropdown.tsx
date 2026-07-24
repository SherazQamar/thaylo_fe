"use client";

import { useState, useRef, useEffect } from "react";
import PortalAvatar from "@/components/shared/PortalAvatar";
import { logoutParent } from "@/lib/auth-session";
import { useAuthStore } from "@/stores/auth.store";

const inter = { fontFamily: "Inter, sans-serif" } as const;

type ParentUserDropdownProps = {
  /** When true, always show name/role (e.g. hamburger drawer). */
  showLabel?: boolean;
  /** Open menu above the trigger so it stays on-screen near the bottom. */
  menuPlacement?: "bottom" | "top";
};

export default function ParentUserDropdown({
  showLabel = false,
  menuPlacement = "bottom",
}: ParentUserDropdownProps) {
  const user = useAuthStore((state) => state.user);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const displayName = user?.name?.trim() || "Parent";
  const displayEmail = user?.email ?? "";
  const opensUp = menuPlacement === "top";

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
    logoutParent(true);
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity w-full"
      >
        <PortalAvatar name={displayName} avatarUrl={user?.avatarUrl} />
        <div className={`text-left min-w-0 flex-1 ${showLabel ? "block" : "hidden sm:block"}`}>
          <p style={{ ...inter, fontWeight: 600, fontSize: "16px", lineHeight: "22px", color: "#FFFFFF" }}>
            {displayName}
          </p>
          <p style={{ ...inter, fontWeight: 400, fontSize: "12px", lineHeight: "16px", color: "rgba(255,255,255,0.5)" }}>
            Parent
          </p>
        </div>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          className={`opacity-50 transition-transform duration-200 shrink-0 ${
            open ? (opensUp ? "" : "rotate-180") : opensUp ? "rotate-180" : ""
          }`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div
          className={`absolute rounded-[12px] overflow-hidden z-[70] shadow-lg ${
            showLabel ? "left-0 right-0 w-full min-w-[200px]" : "right-0 w-[200px]"
          } ${opensUp ? "bottom-full mb-2" : "top-full mt-2"}`}
          style={{ backgroundColor: "#313044", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <div className="px-4 py-3 border-b border-white/10">
            <p style={{ ...inter, fontWeight: 600, fontSize: "14px", lineHeight: "20px", color: "#FFFFFF" }}>
              {displayName}
            </p>
            <p style={{ ...inter, fontWeight: 400, fontSize: "12px", lineHeight: "16px", color: "rgba(255,255,255,0.5)" }}>
              {displayEmail || "Parent"}
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-white/5 transition-colors cursor-pointer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span style={{ ...inter, fontWeight: 500, fontSize: "14px", lineHeight: "20px", color: "#EF4444" }}>
              Logout
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
