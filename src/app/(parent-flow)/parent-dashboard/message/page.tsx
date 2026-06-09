"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import ParentUserDropdown from "@/components/parent/ParentUserDropdown";
import { fetchParentProfile } from "@/lib/auth-api";
import { fetchParentChildren } from "@/lib/parent-api";

const inter = { fontFamily: "Inter, sans-serif" } as const;

type ContactId = "wayfinder" | "group" | `child-${number}`;

interface MessageContact {
  id: ContactId;
  name: string;
  preview: string;
  avatar: string;
  unread: number;
}

export default function ParentMessagePage() {
  const { data: profile } = useQuery({
    queryKey: ["parent-profile"],
    queryFn: fetchParentProfile,
  });
  const { data: children = [] } = useQuery({
    queryKey: ["parent-children"],
    queryFn: fetchParentChildren,
  });

  const [search, setSearch] = useState("");
  const [activeContactId, setActiveContactId] = useState<ContactId>("group");

  const parentName = profile?.name?.trim() || "Parent";

  const contacts = useMemo<MessageContact[]>(() => {
    const childContacts: MessageContact[] = children.map((child) => ({
      id: `child-${child.id}`,
      name: child.userName,
      preview: "No messages yet",
      avatar: "/assets/wayfinder Em.png",
      unread: 0,
    }));

    return [
      {
        id: "group",
        name: "Group Chat",
        preview: `Mom, Wayfinder${children.length ? `, ${children.map((c) => c.userName).join(", ")}` : ""}`,
        avatar: "/assets/wayfinder-symbol.png",
        unread: 0,
      },
      {
        id: "wayfinder",
        name: "Wayfinder",
        preview: "Your child's learning guide",
        avatar: "/assets/wayfinder-symbol.png",
        unread: 0,
      },
      ...childContacts,
    ];
  }, [children]);

  const filteredContacts = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return contacts;
    return contacts.filter(
      (contact) =>
        contact.name.toLowerCase().includes(query) ||
        contact.preview.toLowerCase().includes(query),
    );
  }, [contacts, search]);

  const activeContact =
    contacts.find((contact) => contact.id === activeContactId) ?? contacts[0];

  const chatTitle =
    activeContact?.id === "group"
      ? "Group Chat"
      : activeContact?.name ?? "Messages";

  const chatSubtitle =
    activeContact?.id === "group"
      ? [parentName, "Wayfinder", ...children.map((c) => c.userName)].join(", ")
      : activeContact?.preview ?? "";

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 md:px-6 lg:px-10 py-4 md:py-5 flex-shrink-0">
        <h1 className="uppercase" style={{ ...inter, fontWeight: 700, fontSize: "24px", lineHeight: "25px", letterSpacing: "0.8px", color: "#DCE6EC" }}>
          Message
        </h1>
        <div className="hidden md:block">
          <ParentUserDropdown />
        </div>
      </div>

      <div className="flex-1 flex mx-4 md:mx-6 lg:mx-10 mb-4 md:mb-6 rounded-[12px] overflow-hidden" style={{ backgroundColor: "#1a1930" }}>
        <div className="hidden md:flex w-[280px] flex-shrink-0 border-r border-white/10 flex-col">
          <div className="p-4">
            <div className="flex items-center gap-2 rounded-[10px] px-3 py-2.5" style={{ backgroundColor: "#313044" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent outline-none text-white/80 placeholder-white/40 w-full"
                style={{ ...inter, fontWeight: 400, fontSize: "14px" }}
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredContacts.length === 0 ? (
              <p className="px-4 py-3" style={{ ...inter, fontWeight: 400, fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>
                No contacts found.
              </p>
            ) : (
              filteredContacts.map((contact) => (
                <button
                  key={contact.id}
                  type="button"
                  onClick={() => setActiveContactId(contact.id)}
                  className={`w-full flex items-start gap-3 px-4 py-3.5 cursor-pointer transition-colors border-b border-white/5 text-left ${
                    activeContactId === contact.id ? "bg-white/10" : "hover:bg-white/5"
                  }`}
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                    <Image src={contact.avatar} alt={contact.name} width={40} height={40} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p style={{ ...inter, fontWeight: 600, fontSize: "14px", lineHeight: "20px", color: "#FFFFFF" }}>{contact.name}</p>
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <p className="truncate" style={{ ...inter, fontWeight: 400, fontSize: "12px", lineHeight: "18px", color: "rgba(255,255,255,0.5)", maxWidth: "160px" }}>
                        {contact.preview}
                      </p>
                      {contact.unread > 0 && (
                        <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#EF4444", ...inter, fontWeight: 600, fontSize: "10px", color: "#FFFFFF" }}>
                          {contact.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 md:px-5 py-3 md:py-3.5 border-b border-white/10 gap-2">
            <div>
              <p style={{ ...inter, fontWeight: 700, fontSize: "18px", lineHeight: "24px", color: "#FFFFFF" }}>{chatTitle}</p>
              <p style={{ ...inter, fontWeight: 400, fontSize: "13px", lineHeight: "18px", color: "rgba(255,255,255,0.5)" }}>{chatSubtitle}</p>
            </div>
            <div className="flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
              <p style={{ ...inter, fontWeight: 400, fontSize: "11px", lineHeight: "16px", color: "rgba(255,255,255,0.4)" }}>
                This chat is for lesson updates and learning-related discussion only.
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 md:px-5 py-4 flex flex-col items-center justify-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#313044] flex items-center justify-center">
              <Image src={activeContact?.avatar ?? "/assets/wayfinder-symbol.png"} alt="" width={32} height={32} className="w-8 h-8 object-contain" />
            </div>
            <div className="text-center max-w-[320px]">
              <p style={{ ...inter, fontWeight: 600, fontSize: "16px", lineHeight: "24px", color: "#FFFFFF", marginBottom: "8px" }}>
                No messages yet
              </p>
              <p style={{ ...inter, fontWeight: 400, fontSize: "14px", lineHeight: "22px", color: "rgba(255,255,255,0.5)" }}>
                {children.length === 0
                  ? "Add a child to start family conversations with Wayfinder."
                  : "When messaging is available, updates from Wayfinder and your children will appear here."}
              </p>
            </div>

            <div className="flex items-center gap-3 mt-2 w-full max-w-[420px]">
              <div className="w-10 h-10 rounded-full bg-[#00CED1] flex items-center justify-center flex-shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111023" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <div className="rounded-[16px] px-3 md:px-4 py-2 md:py-2.5" style={{ backgroundColor: "#313044" }}>
                <p style={{ ...inter, fontWeight: 400, fontSize: "14px", lineHeight: "22px", color: "#FFFFFF" }}>
                  Need help? Say <span style={{ color: "#00CED1", fontWeight: 600 }}>&quot;Wayfinder&quot;</span>
                </p>
              </div>
            </div>
          </div>

          <div className="px-4 md:px-5 py-3 md:py-3.5 border-t border-white/10 flex items-center gap-3">
            <button
              type="button"
              disabled
              className="w-9 h-9 rounded-full bg-[#525162] flex items-center justify-center flex-shrink-0 cursor-not-allowed opacity-50"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111023" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            </button>
            <div className="flex-1 rounded-[10px] px-4 py-2.5" style={{ backgroundColor: "#313044" }}>
              <input
                type="text"
                placeholder="Messaging coming soon"
                disabled
                className="bg-transparent outline-none text-white/40 placeholder-white/30 w-full cursor-not-allowed"
                style={{ ...inter, fontWeight: 400, fontSize: "14px" }}
              />
            </div>
            <button type="button" disabled className="flex-shrink-0 cursor-not-allowed opacity-50">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#525162" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
