"use client";

import type { ReactNode } from "react";
import Link from "next/link";
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

export type CategoryAvatarItem = {
  name?: string | null;
  avatarUrl?: string | null;
};

function CategoryIcon({ category }: { category: ChatContactCategory }) {
  if (category === "child") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.75" />
        <path
          d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (category === "parent") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.75" />
        <circle cx="17" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.75" />
        <path
          d="M2.5 20c0-3 2.8-5.5 6.5-5.5 1.2 0 2.3.3 3.2.8"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
        <path
          d="M14 20c0-2.4 1.8-4.5 4.5-4.5S23 17.6 23 20"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <circle cx="9" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M23 21v-2a3.5 3.5 0 0 0-2.5-3.35"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M16.5 3.7a3.5 3.5 0 0 1 0 6.6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CategoryAvatarVisual({
  category,
  avatars,
  active,
}: {
  category: ChatContactCategory;
  avatars?: CategoryAvatarItem | CategoryAvatarItem[] | null;
  active: boolean;
}) {
  const list = Array.isArray(avatars) ? avatars.filter(Boolean) : avatars ? [avatars] : [];
  const hasAnyImage = list.some((a) => Boolean(a.avatarUrl?.trim()) || Boolean(a.name?.trim()));

  if (!hasAnyImage || list.length === 0) {
    return (
      <span className={active ? "text-[#00CED1]" : "text-white/45"}>
        <CategoryIcon category={category} />
      </span>
    );
  }

  if (list.length === 1) {
    return (
      <PortalAvatar
        name={list[0].name ?? category}
        avatarUrl={list[0].avatarUrl}
        size={28}
        useWordInitials
      />
    );
  }

  const stack = list.slice(0, 3);
  const size = 22;
  const overlap = 10;
  const width = size + (stack.length - 1) * overlap;

  return (
    <div className="relative shrink-0" style={{ width, height: size }}>
      {stack.map((item, index) => (
        <div
          key={`${item.name ?? "a"}-${index}`}
          className="absolute top-0 rounded-full ring-2 ring-[#1a1930]"
          style={{ left: index * overlap, zIndex: stack.length - index }}
        >
          <PortalAvatar
            name={item.name ?? category}
            avatarUrl={item.avatarUrl}
            size={size}
            useWordInitials
          />
        </div>
      ))}
    </div>
  );
}

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
  /**
   * Wayfinder-style left rail: back link, focused person card, vertical
   * Child/Parent/Group nav with counts, then conversations.
   */
  layout?: "default" | "focus";
  backLink?: { href: string; label: string };
  /** Unread (or message) counts per category for focus layout badges. */
  categoryCounts?: Partial<Record<ChatContactCategory, number>>;
  /**
   * Optional avatars for category nav rows.
   * Single item for Child/Parent (or Wayfinder label); array for Group stack.
   */
  categoryAvatars?: Partial<
    Record<ChatContactCategory, CategoryAvatarItem | CategoryAvatarItem[]>
  >;
  /** Single-select category for focus layout. */
  activeCategory?: ChatContactCategory;
  onCategorySelect?: (category: ChatContactCategory) => void;
  /** Status line under the focused person (e.g. "Active"). */
  personStatus?: { label: string; online?: boolean } | null;
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
  layout = "default",
  backLink,
  categoryCounts,
  categoryAvatars,
  activeCategory,
  onCategorySelect,
  personStatus,
}: ChatSidebarProps) {
  const filterOptions = getChatFilterOptions(portal);
  const isFocus = layout === "focus";
  const activePerson = people?.find((p) => p.id === activePersonId) ?? null;
  const showPeople = !isFocus && (people?.length ?? 0) > 0;
  const showContactsSection = !(hideFilters && contacts.length === 0 && showPeople);
  const peopleSectionClass = showContactsSection
    ? "border-b border-white/10 flex flex-col max-h-[42%] min-h-[120px]"
    : "flex flex-col flex-1 min-h-0";

  function renderConversations(title = "Conversations") {
    return (
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5 min-h-0">
        <div className="flex items-center justify-between px-1 pb-1">
          <p className="text-white/50 text-xs uppercase tracking-wide" style={inter}>
            {title}
          </p>
          {isFocus ? (
            <span className="text-white/35 text-[10px] uppercase tracking-wide" style={inter}>
              All
            </span>
          ) : null}
        </div>
        {contacts.length === 0 ? (
          <p className="px-1 text-white/45 text-xs" style={inter}>
            {isFocus
              ? "No conversations in this category yet."
              : showPeople
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
                    ? "bg-[#1e4a4c]/70 ring-1 ring-[#00CED1]/35"
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
                          className="shrink-0 text-[11px] text-white/40"
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
    );
  }

  if (isFocus) {
    return (
      <div className={`flex flex-col border-white/10 min-h-0 ${className}`}>
        {backLink ? (
          <div className="px-4 pt-4 pb-2">
            <Link
              href={backLink.href}
              className="inline-flex items-center gap-1.5 text-white/55 hover:text-white transition-colors"
              style={{ ...inter, fontWeight: 500, fontSize: "13px" }}
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
              {backLink.label}
            </Link>
          </div>
        ) : null}

        {activePerson ? (
          <div className="px-4 pb-3">
            <div
              className="rounded-xl p-3 flex items-center gap-3"
              style={{ backgroundColor: "rgba(255,255,255,0.04)" }}
            >
              <PortalAvatar
                name={activePerson.label}
                avatarUrl={activePerson.avatarUrl}
                size={44}
                useWordInitials
              />
              <div className="min-w-0 flex-1">
                <p className="text-white text-sm font-semibold truncate" style={inter}>
                  {activePerson.label}
                </p>
                {activePerson.subtitle ? (
                  <p className="text-white/45 text-[11px] truncate mt-0.5" style={inter}>
                    {activePerson.subtitle}
                  </p>
                ) : null}
                {personStatus ? (
                  <p
                    className="flex items-center gap-1.5 mt-1 text-[11px]"
                    style={{
                      ...inter,
                      fontWeight: 500,
                      color: personStatus.online ? "#34D399" : "rgba(255,255,255,0.45)",
                    }}
                  >
                    <span
                      className="inline-block w-1.5 h-1.5 rounded-full"
                      style={{
                        backgroundColor: personStatus.online ? "#34D399" : "rgba(255,255,255,0.35)",
                      }}
                    />
                    {personStatus.label}
                  </p>
                ) : null}
              </div>
            </div>

            {(people?.length ?? 0) > 1 ? (
              <div className="mt-2 max-h-[120px] overflow-y-auto space-y-0.5">
                {people!
                  .filter((p) => p.id !== activePersonId)
                  .map((person) => (
                    <button
                      key={person.id}
                      type="button"
                      onClick={() => onSelectPerson?.(person)}
                      className="w-full text-left rounded-lg px-2 py-1.5 hover:bg-white/5 transition-colors"
                    >
                      <p className="text-white/70 text-xs font-medium truncate" style={inter}>
                        {person.label}
                      </p>
                      {person.subtitle ? (
                        <p className="text-white/35 text-[10px] truncate" style={inter}>
                          {person.subtitle}
                        </p>
                      ) : null}
                    </button>
                  ))}
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="px-3 pb-3 space-y-1 border-b border-white/10">
          {filterOptions.map((option) => {
            const active = activeCategory === option.id;
            const count = categoryCounts?.[option.id] ?? 0;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => onCategorySelect?.(option.id)}
                className={
                  "w-full flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors " +
                  (active
                    ? "bg-[#00CED1]/18 ring-1 ring-[#00CED1]/45 text-white"
                    : "text-white/65 hover:bg-white/5 hover:text-white")
                }
                style={inter}
              >
                <CategoryAvatarVisual
                  category={option.id}
                  avatars={categoryAvatars?.[option.id]}
                  active={active}
                />
                <span className="flex-1 text-left text-sm font-semibold">{option.label}</span>
                <span
                  className={
                    "min-w-[22px] h-[22px] rounded-full px-1.5 flex items-center justify-center text-[11px] font-bold " +
                    (active ? "bg-[#00CED1] text-[#111023]" : "bg-white/10 text-white/70")
                  }
                >
                  {count > 9 ? "9+" : count}
                </span>
              </button>
            );
          })}
        </div>

        {header ? <div className="px-4 pt-3">{header}</div> : null}
        {renderConversations()}
        {footer ? (
          <div className="border-t border-white/10 px-4 py-3 text-white/40 text-xs" style={inter}>
            {footer}
          </div>
        ) : null}
      </div>
    );
  }

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

      {showContactsSection ? renderConversations(showPeople ? "Chats" : "Conversations") : null}

      {footer ? (
        <div className="border-t border-white/10 px-4 py-3 text-white/40 text-xs" style={inter}>
          {footer}
        </div>
      ) : null}
    </div>
  );
}
