"use client";

import type { ReactNode } from "react";
import PortalAvatar from "@/components/shared/PortalAvatar";
import { formatChatListTime } from "@/components/shared/chat/chat-format";
import {
  getChatFilterOptions,
  type ChatContactCategory,
  type ChatPortal,
  type ChatSidebarContact,
  type ChatSidebarPerson,
} from "@/components/shared/chat/chat-sidebar-types";

const inter = { fontFamily: "Inter, sans-serif" } as const;

type ChatSidebarProps = {
  contacts: ChatSidebarContact[];
  activeContactId: string | null;
  selectedFilters: ChatContactCategory[];
  onFilterToggle: (filter: ChatContactCategory) => void;
  onSelectContact: (contact: ChatSidebarContact) => void;
  portal: ChatPortal;
  /** Optional people list (students / children / contacts) — replaces dropdown pickers. */
  people?: ChatSidebarPerson[];
  activePersonId?: string | null;
  onSelectPerson?: (person: ChatSidebarPerson) => void;
  peopleLabel?: string;
  header?: ReactNode;
  footer?: ReactNode;
  className?: string;
  hideFilters?: boolean;
};

export default function ChatSidebar({
  contacts,
  activeContactId,
  selectedFilters,
  onFilterToggle,
  onSelectContact,
  portal,
  people,
  activePersonId,
  onSelectPerson,
  peopleLabel = "People",
  header,
  footer,
  className = "",
  hideFilters = false,
}: ChatSidebarProps) {
  const filterOptions = getChatFilterOptions(portal);
  const showPeople = (people?.length ?? 0) > 0;
  const showContactsSection = !(hideFilters && contacts.length === 0 && showPeople);
  const peopleSectionClass = showContactsSection
    ? "border-b border-white/10 flex flex-col max-h-[42%] min-h-[120px]"
    : "flex flex-col flex-1 min-h-0";

  return (
    <div className={`flex flex-col border-white/10 min-h-0 ${className}`}>
      {showPeople ? (
        <div className={peopleSectionClass}>
          <div className="px-4 pt-4 pb-2">
            <p className="text-white/50 text-xs uppercase tracking-wide" style={inter}>
              {peopleLabel}
            </p>
          </div>
          <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-1">
            {people!.map((person) => {
              const isActive = activePersonId === person.id;
              const hasUnread = (person.unreadCount ?? 0) > 0;
              return (
                <button
                  key={person.id}
                  type="button"
                  onClick={() => onSelectPerson?.(person)}
                  className={
                    "w-full text-left rounded-xl px-2.5 py-2.5 transition-colors " +
                    (isActive
                      ? "bg-[#00CED1]/15 ring-1 ring-[#00CED1]/40"
                      : "hover:bg-white/5")
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <PortalAvatar
                      name={person.label}
                      avatarUrl={person.avatarUrl}
                      size={showContactsSection ? 36 : 44}
                      useWordInitials
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-white text-sm font-semibold truncate" style={inter}>
                          {person.label}
                        </p>
                        {hasUnread ? (
                          <span
                            className="min-w-[18px] h-[18px] shrink-0 rounded-full bg-[#FF4D4F] px-1 flex items-center justify-center text-[10px] font-bold text-white"
                            style={inter}
                          >
                            {person.unreadCount! > 9 ? "9+" : person.unreadCount}
                          </span>
                        ) : null}
                      </div>
                      {person.subtitle ? (
                        <p className="text-white/45 text-[11px] truncate mt-0.5" style={inter}>
                          {person.subtitle}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {!hideFilters ? (
        <div className="p-4 border-b border-white/10 space-y-3">
          <p className="text-white/50 text-xs uppercase tracking-wide" style={inter}>
            Show chats
          </p>
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => {
              const active = selectedFilters.includes(option.id);
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => onFilterToggle(option.id)}
                  className={
                    "rounded-full px-3 py-1.5 text-xs font-semibold transition-colors " +
                    (active
                      ? "bg-[#00CED1] text-[#111023]"
                      : "bg-[#313044] text-white/60 hover:text-white hover:bg-white/10")
                  }
                  style={inter}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {header ? <div className="px-4 pt-4">{header}</div> : null}

      {showContactsSection ? (
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5 min-h-0">
          {showPeople ? (
            <p className="px-1 pb-1 text-white/50 text-xs uppercase tracking-wide" style={inter}>
              Chats
            </p>
          ) : null}
          {contacts.length === 0 ? (
            <p className="px-1 text-white/45 text-xs" style={inter}>
              {showPeople
                ? "Select someone above to see their chats."
                : "No chats match the selected filters."}
            </p>
          ) : (
            contacts.map((contact) => {
              const hasUnread = (contact.unreadCount ?? 0) > 0;
              const isActive = activeContactId === contact.id;
              const preview =
                contact.lastMessage?.trim() ||
                contact.subtitle ||
                "No messages yet";

              return (
                <button
                  key={contact.id}
                  type="button"
                  onClick={() => onSelectContact(contact)}
                  className={
                    "w-full text-left rounded-xl px-3 py-3 transition-colors " +
                    (isActive
                      ? "bg-[#2a2940] ring-1 ring-[#00CED1]/30"
                      : "hover:bg-white/5")
                  }
                >
                  <div className="flex items-start gap-3">
                    <PortalAvatar
                      name={contact.label}
                      avatarUrl={contact.avatarUrl}
                      size={44}
                      useWordInitials
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-white text-sm font-semibold truncate" style={inter}>
                          {contact.label}
                        </p>
                        {contact.lastMessageAt ? (
                          <span
                            className="shrink-0 text-[11px] text-[#00CED1]"
                            style={inter}
                          >
                            {formatChatListTime(contact.lastMessageAt)}
                          </span>
                        ) : null}
                      </div>

                      <div className="mt-1 flex items-end justify-between gap-2">
                        <p className="text-white/55 text-xs truncate flex-1" style={inter}>
                          {preview}
                        </p>
                        {hasUnread ? (
                          <span
                            className="min-w-[18px] h-[18px] shrink-0 rounded-full bg-[#FF4D4F] px-1 flex items-center justify-center text-[10px] font-bold text-white"
                            style={inter}
                            aria-label={`${contact.unreadCount} unread messages`}
                          >
                            {contact.unreadCount! > 9 ? "9+" : contact.unreadCount}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      ) : null}

      {footer ? (
        <div className="border-t border-white/10 px-4 py-3 text-white/40 text-xs" style={inter}>
          {footer}
        </div>
      ) : null}
    </div>
  );
}
