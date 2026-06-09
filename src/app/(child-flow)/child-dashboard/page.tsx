"use client";

import { useRouter } from "next/navigation";
import ChildUserDropdown from "@/components/child/ChildUserDropdown";
import { useChildAuthStore } from "@/stores/child-auth.store";

const inter = { fontFamily: "Inter, sans-serif" } as const;

/* Learning path nodes */
const pathNodes = [
  { type: "start", label: "START", active: true },
  { type: "lesson", icon: "plant" },
  { type: "skip", icon: "forward" },
  { type: "lesson", icon: "leaves" },
  { type: "skip", icon: "forward" },
];

const pathNodes2 = [
  { type: "skip", icon: "forward" },
  { type: "lesson", icon: "plant" },
];

export default function ChildProgressPage() {
  const router = useRouter();
  const child = useChildAuthStore((state) => state.child);
  const greetingName = child?.userName?.trim() || "Student";

  return (
    <div className="flex flex-col h-full">
      {/* Header - full width */}
      <div className="flex items-center justify-between px-4 md:px-5 lg:px-6 pt-4 md:pt-5 lg:pt-6 pb-3 flex-shrink-0">
        <h1 style={{ ...inter, fontWeight: 600, fontSize: "22px", color: "#DCE6EC" }}>Progress</h1>
        <div className="hidden md:block">
          <ChildUserDropdown />
        </div>
      </div>

      {/* Two column layout */}
      <div className="flex flex-col lg:flex-row lg:flex-1 lg:min-h-0">
      {/* Main Content */}
      <div className="flex-1 min-w-0 px-4 md:px-5 lg:px-6 pb-6 overflow-y-auto overflow-x-hidden scrollbar-hide">
        {/* Welcome Banner */}
        <div
          className="rounded-[16px] px-6 md:px-8 py-5 mb-8 flex items-center justify-between"
          style={{ background: "linear-gradient(135deg, #064e3b 0%, #047857 40%, #059669 70%, #34d399 100%)" }}
        >
          <div>
            <p style={{ ...inter, fontWeight: 400, fontSize: "14px", color: "rgba(255,255,255,0.8)" }}>
              Welcome back, {greetingName}
            </p>
            <p style={{ ...inter, fontWeight: 700, fontSize: "20px", color: "#FFFFFF", marginTop: "4px" }}>
              Here&apos;s your learning path today
            </p>
          </div>
          <button
            className="rounded-[14px] px-6 py-3 cursor-pointer hover:opacity-90 transition-opacity flex-shrink-0 ml-4"
            style={{ backgroundColor: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)", backdropFilter: "blur(4px)", ...inter, fontWeight: 700, fontSize: "14px", color: "#FFFFFF" }}
            onClick={() => router.push("/child-dashboard/lesson")}
          >
            Start NOW
          </button>
        </div>

        {/* Learning Path */}
        <div className="flex flex-col items-center pb-8">
          {/* Module 1 nodes */}
          {pathNodes.map((node, i) => (
            <div key={i} className="flex flex-col items-center">
              {node.type === "start" ? (
                <>
                  <span
                    className="rounded-full px-4 py-1 mb-2"
                    style={{ backgroundColor: "#00CED1", ...inter, fontWeight: 700, fontSize: "11px", color: "#111023", letterSpacing: "1px" }}
                  >
                    START
                  </span>
                  <div className="w-[56px] h-[56px] rounded-full bg-[#00CED1] flex items-center justify-center shadow-lg" style={{ boxShadow: "0 0 20px rgba(0,206,209,0.3)" }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                    </svg>
                  </div>
                  <div className="w-px h-8 bg-[#525162]" />
                </>
              ) : node.type === "lesson" ? (
                <>
                  <div className="w-[48px] h-[48px] rounded-full bg-[#313044] border-2 border-[#525162] flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#525162" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {node.icon === "plant" ? (
                        <><path d="M12 22V8" /><path d="M5 12H2a10 10 0 0020 0h-3" /><path d="M8 5.2C9.2 3.6 10.5 3 12 3c1.5 0 2.8.6 4 2.2" /></>
                      ) : (
                        <><path d="M12 22V8" /><path d="M5 12H2a10 10 0 0020 0h-3" /><path d="M8 5.2C9.2 3.6 10.5 3 12 3c1.5 0 2.8.6 4 2.2" /></>
                      )}
                    </svg>
                  </div>
                  <div className="w-px h-8 bg-[#525162]" />
                </>
              ) : (
                <>
                  <div className="w-[48px] h-[48px] rounded-full bg-[#313044] border-2 border-[#525162] flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#525162" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="5 4 15 12 5 20 5 4" />
                      <polygon points="13 4 23 12 13 20 13 4" />
                    </svg>
                  </div>
                  <div className="w-px h-8 bg-[#525162]" />
                </>
              )}
            </div>
          ))}

          {/* Module 2 Divider */}
          <div className="flex items-center gap-4 my-4 w-full max-w-[300px]">
            <div className="flex-1 h-px bg-[#525162]" />
            <span style={{ ...inter, fontWeight: 600, fontSize: "12px", color: "rgba(255,255,255,0.3)", letterSpacing: "1px" }}>MODULE 2</span>
            <div className="flex-1 h-px bg-[#525162]" />
          </div>

          {/* Module 2 nodes */}
          {pathNodes2.map((node, i) => (
            <div key={`m2-${i}`} className="flex flex-col items-center">
              <div className="w-[48px] h-[48px] rounded-full bg-[#313044] border-2 border-[#525162] flex items-center justify-center">
                {node.type === "skip" ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#525162" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="5 4 15 12 5 20 5 4" />
                    <polygon points="13 4 23 12 13 20 13 4" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#525162" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22V8" /><path d="M5 12H2a10 10 0 0020 0h-3" /><path d="M8 5.2C9.2 3.6 10.5 3 12 3c1.5 0 2.8.6 4 2.2" />
                  </svg>
                )}
              </div>
              {i < pathNodes2.length - 1 && <div className="w-px h-8 bg-[#525162]" />}
            </div>
          ))}
        </div>
      </div>

      {/* Right Sidebar - desktop only */}
      <div className="w-full lg:w-[300px] flex-shrink-0 flex flex-col gap-4 p-4 lg:overflow-y-auto lg:scrollbar-hide lg:border-l border-white/5">
        {/* Unlock Next Badge */}
        <div className="rounded-[12px] p-4" style={{ backgroundColor: "#313044" }}>
          <div className="flex items-center justify-between mb-3">
            <h3 style={{ ...inter, fontWeight: 700, fontSize: "14px", color: "#FFFFFF" }}>Unlock Next badge</h3>
            <span style={{ ...inter, fontWeight: 700, fontSize: "12px", color: "#00CED1", cursor: "pointer" }}>SEE ALL</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[8px] bg-[#525162] flex items-center justify-center flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00CED1" strokeWidth="2"><path d="M12 15l-2 5-3-1 1.5-4M12 15l2 5 3-1-1.5-4M6 9a6 6 0 1012 0 6 6 0 00-12 0z" /></svg>
            </div>
            <div className="flex-1">
              <p style={{ ...inter, fontWeight: 500, fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>Rising star</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 h-[6px] bg-[#525162] rounded-full overflow-hidden">
                  <div className="h-full w-[20%] bg-[#00CED1] rounded-full" />
                </div>
                <span style={{ ...inter, fontWeight: 700, fontSize: "12px", color: "#FFFFFF" }}>2 / 10</span>
              </div>
              <p style={{ ...inter, fontWeight: 400, fontSize: "11px", color: "rgba(255,255,255,0.4)", marginTop: "2px" }}>Complete 8 more module</p>
            </div>
          </div>
        </div>

        {/* Today's Focus */}
        <div className="rounded-[12px] p-4" style={{ backgroundColor: "#313044" }}>
          <h3 style={{ ...inter, fontWeight: 700, fontSize: "14px", color: "#FFFFFF", marginBottom: "10px" }}>Today&apos;s Focus</h3>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[8px] bg-[#2d5a3e] flex items-center justify-center flex-shrink-0 text-lg">
              📗
            </div>
            <div>
              <p style={{ ...inter, fontWeight: 500, fontSize: "13px", color: "#FFFFFF" }}>Reading for evidence</p>
              <p style={{ ...inter, fontWeight: 400, fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>Confidence: Medium</p>
            </div>
          </div>
        </div>

        {/* Tip from instructor */}
        <div className="rounded-[12px] p-4" style={{ backgroundColor: "#313044" }}>
          <h3 style={{ ...inter, fontWeight: 700, fontSize: "14px", color: "#FFFFFF", marginBottom: "10px" }}>Tip from your instructor</h3>
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
                <p style={{ ...inter, fontWeight: 600, fontSize: "12px", color: "#FFFFFF" }}>Bloom Buddy</p>
                <p style={{ ...inter, fontWeight: 400, fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>I feel good!</p>
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
