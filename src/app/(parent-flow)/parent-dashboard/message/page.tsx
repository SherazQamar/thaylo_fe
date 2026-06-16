"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ParentUserDropdown from "@/components/parent/ParentUserDropdown";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import { fetchParentChildren } from "@/lib/parent-api";
import { useAuthStore } from "@/stores/auth.store";

const inter = { fontFamily: "Inter, sans-serif" } as const;

type ContactId = "group" | "wayfinder" | `child-${number}`;

interface Contact {
  id: ContactId;
  name: string;
  preview: string;
  time: string;
  unread: number;
}

interface DemoMessage {
  sender: string;
  text: string;
  isUser: boolean;
  role: "parent" | "wayfinder" | "student";
}

function parentDisplayName(name: string | null | undefined): string {
  const trimmed = name?.trim();
  if (!trimmed) return "Parent";
  return trimmed.split(/\s+/)[0] ?? trimmed;
}

function buildContacts(
  parentName: string,
  children: { id: number; userName: string }[],
): Contact[] {
  const firstChild = children[0]?.userName;
  const contacts: Contact[] = [
    {
      id: "group",
      name: "Group Chat",
      preview: firstChild
        ? `Updates for ${firstChild} and family`
        : "Family lesson updates",
      time: "Today",
      unread: 0,
    },
    {
      id: "wayfinder",
      name: "Wayfinder",
      preview: firstChild
        ? `${firstChild} did well in today's reading.`
        : "Your learning guide",
      time: "10:45am",
      unread: 0,
    },
  ];

  for (const child of children) {
    contacts.push({
      id: `child-${child.id}`,
      name: child.userName,
      preview: "No messages yet",
      time: "—",
      unread: 0,
    });
  }

  return contacts;
}

function buildDemoMessages(
  parentName: string,
  childName: string | null,
  contactId: ContactId,
): DemoMessage[] {
  if (contactId === "wayfinder") {
    return [
      {
        sender: parentName,
        text: "Hi Wayfinder, can you share a quick progress update?",
        isUser: true,
        role: "parent",
      },
      {
        sender: "Wayfinder",
        text: childName
          ? `${childName} completed 2 modules this week. Reading comprehension is improving.`
          : "Add a child to your account to see personalized lesson updates here.",
        isUser: false,
        role: "wayfinder",
      },
      {
        sender: "Wayfinder",
        text: "I'll send a full report after the next assessment.",
        isUser: false,
        role: "wayfinder",
      },
    ];
  }

  if (contactId.startsWith("child-") && childName) {
    return [
      {
        sender: parentName,
        text: `Hi ${childName}, how was your lesson today?`,
        isUser: true,
        role: "parent",
      },
      {
        sender: childName,
        text: "It was good! I learned some new vocabulary words.",
        isUser: false,
        role: "student",
      },
    ];
  }

  return [
    {
      sender: parentName,
      text: childName
        ? `Hi Wayfinder, how is ${childName} doing in reading?`
        : "Hi Wayfinder, we're getting started with Thaylo.",
      isUser: true,
      role: "parent",
    },
    {
      sender: "Wayfinder",
      text: childName
        ? `${childName} has been making steady progress. Comprehension scores are improving.`
        : "Welcome! Once you add a child, group updates will appear here.",
      isUser: false,
      role: "wayfinder",
    },
    ...(childName
      ? [
          {
            sender: childName,
            text: `Hi ${parentName}! I finished my lesson today.`,
            isUser: false,
            role: "student" as const,
          },
        ]
      : []),
  ];
}

function contactSubtitle(
  contactId: ContactId,
  parentName: string,
  children: { id: number; userName: string }[],
): string {
  if (contactId === "wayfinder") return "Wayfinder";
  if (contactId.startsWith("child-")) {
    const childId = Number(contactId.replace("child-", ""));
    return children.find((c) => c.id === childId)?.userName ?? parentName;
  }

  const names = [parentName, "Wayfinder", ...children.map((c) => c.userName)];
  return names.join(", ");
}

function ContactAvatar({ kind }: { kind: "group" | "wayfinder" | "child" }) {
  if (kind === "wayfinder") {
    return (
      <div className="w-10 h-10 rounded-full bg-[#00CED1]/20 flex items-center justify-center flex-shrink-0 text-[#00CED1] text-sm font-semibold">
        W
      </div>
    );
  }

  if (kind === "group") {
    return (
      <div className="w-10 h-10 rounded-full bg-[#525162] flex items-center justify-center flex-shrink-0 text-lg">
        👨‍👩‍👧
      </div>
    );
  }

  return (
    <div className="w-10 h-10 rounded-full bg-[#525162] flex items-center justify-center flex-shrink-0 text-lg">
      🧒
    </div>
  );
}

function MessageAvatar({ role }: { role: DemoMessage["role"] }) {
  if (role === "wayfinder") {
    return (
      <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-[#00CED1]/20 flex items-center justify-center flex-shrink-0 mt-5 text-[#00CED1] text-xs font-bold">
        W
      </div>
    );
  }

  return (
    <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-[#525162] flex items-center justify-center flex-shrink-0 mt-5 text-sm">
      {role === "parent" ? "👤" : "🧒"}
    </div>
  );
}

export default function ParentMessagePage() {
  const user = useAuthStore((state) => state.user);
  const parentName = parentDisplayName(user?.name);
  const [search, setSearch] = useState("");
  const [activeContactId, setActiveContactId] = useState<ContactId>("group");

  const { data: children = [] } = useQuery({
    queryKey: ["parent-children"],
    queryFn: fetchParentChildren,
  });

  const contacts = useMemo(
    () => buildContacts(parentName, children),
    [parentName, children],
  );

  const filteredContacts = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return contacts;
    return contacts.filter((contact) => contact.name.toLowerCase().includes(query));
  }, [contacts, search]);

  const activeContact =
    contacts.find((contact) => contact.id === activeContactId) ?? contacts[0];

  const firstChildName = children[0]?.userName ?? null;
  const activeChildName =
    activeContactId.startsWith("child-")
      ? (children.find((c) => `child-${c.id}` === activeContactId)?.userName ?? null)
      : firstChildName;

  const demoMessages = useMemo(
    () =>
      buildDemoMessages(
        parentName,
        activeChildName,
        activeContact?.id ?? "group",
      ),
    [parentName, activeChildName, activeContact?.id],
  );

  const chatTitle = activeContact?.name ?? "Group Chat";
  const chatSubtitle = contactSubtitle(
    activeContact?.id ?? "group",
    parentName,
    children,
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col gap-1 px-4 md:px-6 lg:px-10 py-4 md:py-5 flex-shrink-0">
        <div className="flex items-center justify-between">
        <h1
          className="uppercase"
          style={{
            ...inter,
            fontWeight: 700,
            fontSize: "24px",
            lineHeight: "25px",
            letterSpacing: "0.8px",
            color: "#DCE6EC",
          }}
        >
          Message
        </h1>
        <div className="hidden md:block">
          <ParentUserDropdown />
        </div>
        </div>
        <Breadcrumbs
          showHome={false}
          items={[
            { href: "/parent-dashboard", label: "Parent Dashboard" },
            { href: "/parent-dashboard/message", label: "Message" },
          ]}
        />
      </div>

      <div
        className="flex-1 flex mx-4 md:mx-6 lg:mx-10 mb-4 md:mb-6 rounded-[12px] overflow-hidden"
        style={{ backgroundColor: "#1a1930" }}
      >
        <div className="hidden md:flex w-[280px] flex-shrink-0 border-r border-white/10 flex-col">
          <div className="p-4">
            <div
              className="flex items-center gap-2 rounded-[10px] px-3 py-2.5"
              style={{ backgroundColor: "#313044" }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search"
                className="bg-transparent outline-none text-white/80 placeholder-white/40 w-full"
                style={{ ...inter, fontWeight: 400, fontSize: "14px" }}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredContacts.length === 0 ? (
              <p
                className="px-4 py-3"
                style={{
                  ...inter,
                  fontWeight: 400,
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                No contacts match your search.
              </p>
            ) : (
              filteredContacts.map((contact) => {
                const isActive = contact.id === activeContactId;
                const kind =
                  contact.id === "group"
                    ? "group"
                    : contact.id === "wayfinder"
                      ? "wayfinder"
                      : "child";

                return (
                  <button
                    key={contact.id}
                    type="button"
                    onClick={() => setActiveContactId(contact.id)}
                    className={`w-full flex items-start gap-3 px-4 py-3.5 cursor-pointer transition-colors border-b border-white/5 text-left ${
                      isActive ? "bg-white/10" : "hover:bg-white/5"
                    }`}
                  >
                    <ContactAvatar kind={kind} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p
                          style={{
                            ...inter,
                            fontWeight: 600,
                            fontSize: "14px",
                            lineHeight: "20px",
                            color: "#FFFFFF",
                          }}
                        >
                          {contact.name}
                        </p>
                        <span
                          style={{
                            ...inter,
                            fontWeight: 500,
                            fontSize: "11px",
                            lineHeight: "16px",
                            color: "#00CED1",
                          }}
                        >
                          {contact.time}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-0.5">
                        <p
                          className="truncate"
                          style={{
                            ...inter,
                            fontWeight: 400,
                            fontSize: "12px",
                            lineHeight: "18px",
                            color: "rgba(255,255,255,0.5)",
                            maxWidth: "160px",
                          }}
                        >
                          {contact.preview}
                        </p>
                        {contact.unread > 0 && (
                          <span
                            className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{
                              backgroundColor: "#EF4444",
                              ...inter,
                              fontWeight: 600,
                              fontSize: "10px",
                              color: "#FFFFFF",
                            }}
                          >
                            {contact.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 md:px-5 py-3 md:py-3.5 border-b border-white/10 gap-2">
            <div>
              <p
                style={{
                  ...inter,
                  fontWeight: 700,
                  fontSize: "18px",
                  lineHeight: "24px",
                  color: "#FFFFFF",
                }}
              >
                {chatTitle}
              </p>
              <p
                style={{
                  ...inter,
                  fontWeight: 400,
                  fontSize: "13px",
                  lineHeight: "18px",
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                {chatSubtitle}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <p
                style={{
                  ...inter,
                  fontWeight: 400,
                  fontSize: "11px",
                  lineHeight: "16px",
                  color: "rgba(255,255,255,0.4)",
                }}
              >
                This chat is for lesson updates and learning-related discussion
                only.
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 md:px-5 py-4 flex flex-col gap-4">
            <p
              className="text-center"
              style={{
                ...inter,
                fontWeight: 500,
                fontSize: "12px",
                lineHeight: "16px",
                color: "rgba(255,255,255,0.4)",
              }}
            >
              Today · Sample conversation
            </p>

            {demoMessages.map((msg, i) => (
              <div
                key={`${msg.sender}-${i}`}
                className={`flex ${msg.isUser ? "justify-end" : "justify-start"} gap-2`}
              >
                {!msg.isUser && (
                  <MessageAvatar role={msg.role} />
                )}
                <div
                  className={`max-w-[85%] md:max-w-[420px] ${msg.isUser ? "items-end" : "items-start"} flex flex-col`}
                >
                  {!msg.isUser && (
                    <span
                      className="rounded-full px-2.5 py-0.5 mb-1"
                      style={{
                        ...inter,
                        fontWeight: 600,
                        fontSize: "11px",
                        lineHeight: "16px",
                        color: "#FFFFFF",
                        backgroundColor:
                          msg.role === "wayfinder" ? "#00CED1" : "#525162",
                      }}
                    >
                      {msg.sender}
                    </span>
                  )}
                  <div
                    className="rounded-[16px] px-3 md:px-4 py-2 md:py-2.5"
                    style={{
                      backgroundColor: msg.isUser ? "#313044" : "#00CED1",
                      ...inter,
                      fontWeight: 400,
                      fontSize: "14px",
                      lineHeight: "22px",
                      color: msg.isUser ? "#FFFFFF" : "#111023",
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}

            <div className="flex items-center gap-3 mt-2">
              <div className="w-10 h-10 rounded-full bg-[#00CED1] flex items-center justify-center flex-shrink-0">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#111023"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <div
                className="rounded-[16px] px-3 md:px-4 py-2 md:py-2.5"
                style={{ backgroundColor: "#313044" }}
              >
                <p
                  style={{
                    ...inter,
                    fontWeight: 400,
                    fontSize: "14px",
                    lineHeight: "22px",
                    color: "#FFFFFF",
                  }}
                >
                  Need help? Say{" "}
                  <span style={{ color: "#00CED1", fontWeight: 600 }}>
                    &quot;Wayfinder&quot;
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="px-4 md:px-5 py-3 md:py-3.5 border-t border-white/10 flex items-center gap-3">
            <button
              type="button"
              disabled
              className="w-9 h-9 rounded-full bg-[#525162] flex items-center justify-center flex-shrink-0 cursor-not-allowed opacity-50"
              aria-hidden
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#111023"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
            <div
              className="flex-1 rounded-[10px] px-4 py-2.5"
              style={{ backgroundColor: "#313044" }}
            >
              <input
                type="text"
                disabled
                placeholder="Messaging coming soon"
                className="bg-transparent outline-none text-white/40 placeholder-white/30 w-full cursor-not-allowed"
                style={{ ...inter, fontWeight: 400, fontSize: "14px" }}
              />
            </div>
            <button
              type="button"
              disabled
              className="flex-shrink-0 cursor-not-allowed opacity-40"
              aria-hidden
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#00CED1"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
