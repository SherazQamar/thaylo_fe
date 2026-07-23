"use client";

import type { ReactNode } from "react";

type MessageWorkspaceProps = {
  sidebar: ReactNode;
  chat: ReactNode;
  /** When true on small screens, show chat pane instead of contact list. */
  mobileShowChat: boolean;
  onBackToList: () => void;
  backLabel?: string;
};

/**
 * Desktop (lg+): sidebar + chat side-by-side.
 * Below lg: one pane at a time so the composer stays on-screen.
 */
export default function MessageWorkspace({
  sidebar,
  chat,
  mobileShowChat,
  onBackToList,
  backLabel = "Back to chats",
}: MessageWorkspaceProps) {
  return (
    <div
      className="flex-1 flex flex-col lg:flex-row mx-3 sm:mx-4 md:mx-6 lg:mx-10 mb-3 sm:mb-4 md:mb-6 rounded-[12px] overflow-hidden min-h-0"
      style={{ backgroundColor: "#1a1930" }}
    >
      <div
        className={
          "min-h-0 flex-col border-white/10 w-full lg:w-[300px] xl:w-[320px] lg:shrink-0 lg:border-r " +
          (mobileShowChat ? "hidden lg:flex " : "flex flex-1 ")
        }
      >
        {sidebar}
      </div>

      <div
        className={
          "min-h-0 min-w-0 flex-col " +
          (mobileShowChat ? "flex flex-1 " : "hidden lg:flex lg:flex-1 ")
        }
      >
        <div className="lg:hidden shrink-0 px-3 pt-3 pb-1">
          <button
            type="button"
            onClick={onBackToList}
            className="inline-flex items-center gap-1.5 text-white/60 hover:text-white transition-colors text-sm font-medium"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M15 18l-6-6 6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {backLabel}
          </button>
        </div>
        <div className="flex-1 flex flex-col min-h-0 min-w-0 overflow-hidden">{chat}</div>
      </div>
    </div>
  );
}
