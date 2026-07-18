"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ChildUserDropdown from "@/components/child/ChildUserDropdown";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import ChatSidebar from "@/components/shared/chat/ChatSidebar";
import ChatMessageList from "@/components/shared/chat/ChatMessageList";
import ChatComposer from "@/components/shared/chat/ChatComposer";
import {
  clearRoomUnreadInCache,
  filterContacts,
  roomMeta,
  toggleChatFilter,
  type ChatContactCategory,
  type ChatSidebarContact,
  type ChatSidebarPerson,
} from "@/components/shared/chat/chat-sidebar-types";
import {
  findOrCreateDirectRoom,
  findOrCreateGroupRoom,
  isFindOrCreateGroupRoomResult,
  listChatRooms,
  markRoomAsRead,
  type ChatParticipant,
  type ChatRoomListItem,
} from "@/lib/chat-api";
import { useChildAuthStore } from "@/stores/child-auth.store";
import { useChatConversation } from "@/hooks/use-chat-conversation";

const inter = { fontFamily: "Inter, sans-serif" } as const;

type ChildContact = ChatSidebarContact & {
  participant?: ChatParticipant;
  action: "group" | "parent" | "wayfinder";
};

export default function ChildMessagePage() {
  const queryClient = useQueryClient();
  const child = useChildAuthStore((s) => s.child);
  const [message, setMessage] = useState("");
  const [activeRoomId, setActiveRoomId] = useState<number | null>(null);
  const [activeContactId, setActiveContactId] = useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<ChatContactCategory[]>([
    "group",
    "parent",
    "child",
  ]);
  const [groupName, setGroupName] = useState("Family Group");
  const [groupParticipants, setGroupParticipants] = useState<ChatParticipant[]>([]);

  const roomsQuery = useQuery({
    queryKey: ["chat-rooms", "child"],
    queryFn: () => listChatRooms("child"),
    refetchInterval: 8000,
  });

  const openRoomMutation = useMutation({
    mutationFn: async (contact: ChildContact) => {
      if (contact.action === "group") {
        return findOrCreateGroupRoom("child");
      }
      if (!contact.participant) {
        throw new Error("Contact is not available yet.");
      }
      return findOrCreateDirectRoom("child", {
        targetType: contact.participant.type,
        targetId: contact.participant.id,
      });
    },
    onSuccess: async (room, contact) => {
      if (contact.action === "group" && isFindOrCreateGroupRoomResult(room)) {
        setGroupName(room.groupName);
        setGroupParticipants(room.participants);
      }
      setActiveRoomId(room.roomId);
      queryClient.setQueryData<ChatRoomListItem[]>(
        ["chat-rooms", "child"],
        (prev) => clearRoomUnreadInCache(prev, room.roomId),
      );
      await markRoomAsRead("child", room.roomId);
      await queryClient.invalidateQueries({ queryKey: ["chat-rooms", "child"] });
    },
  });

  const {
    messages: activeMessages,
    isLoading: messagesLoading,
    send,
    retry,
    othersTyping,
    notifyTyping,
    scrollRef,
    onScroll,
  } = useChatConversation({
    roleMode: "child",
    scope: "child",
    roomId: activeRoomId,
    self: { type: "CHILD", id: child?.id, role: "CHILD" },
  });

  const groupRoomId =
    (roomsQuery.data ?? []).find((room) => room.type === "GROUP")?.roomId ?? null;

  useEffect(() => {
    const groupRoom = (roomsQuery.data ?? []).find((room) => room.type === "GROUP");
    if (!groupRoom) return;
    if (groupRoom.groupName) setGroupName(groupRoom.groupName);
    if (groupRoom.groupParticipants?.length) {
      setGroupParticipants(groupRoom.groupParticipants);
    }
  }, [groupRoomId, roomsQuery.dataUpdatedAt, roomsQuery.data]);

  const resolvedParticipants =
    groupParticipants.length > 0
      ? groupParticipants
      : ((roomsQuery.data ?? []).find((room) => room.type === "GROUP")?.groupParticipants ?? []);

  const parentParticipant = resolvedParticipants.find((p) => p.role === "PARENT");
  const wayfinderParticipant = resolvedParticipants.find((p) => p.role === "WAYFINDER");

  const allContacts = useMemo<ChildContact[]>(() => {
    const rooms = roomsQuery.data ?? [];
    const groupMeta = roomMeta(rooms, (room) => room.type === "GROUP");

    const contacts: ChildContact[] = [
      {
        id: "group",
        category: "group",
        label: groupName,
        subtitle: "Group chat",
        action: "group",
        roomId: groupMeta.roomId,
        unreadCount: groupMeta.unreadCount,
        lastMessage: groupMeta.lastMessage,
        lastMessageAt: groupMeta.lastMessageAt,
      },
    ];

    if (parentParticipant) {
      const parentMeta = roomMeta(
        rooms,
        (room) =>
          room.type === "DIRECT" &&
          room.otherParticipant?.type === parentParticipant.type &&
          room.otherParticipant.id === parentParticipant.id,
      );
      contacts.push({
        id: `parent-${parentParticipant.id}`,
        category: "parent",
        label: parentParticipant.name ?? "Parent",
        subtitle: "Direct with parent",
        participant: parentParticipant,
        action: "parent",
        roomId: parentMeta.roomId,
        unreadCount: parentMeta.unreadCount,
        lastMessage: parentMeta.lastMessage,
        lastMessageAt: parentMeta.lastMessageAt,
      });
    }

    if (wayfinderParticipant) {
      const wayfinderMeta = roomMeta(
        rooms,
        (room) =>
          room.type === "DIRECT" &&
          room.otherParticipant?.type === wayfinderParticipant.type &&
          room.otherParticipant.id === wayfinderParticipant.id,
      );
      contacts.push({
        id: `wayfinder-${wayfinderParticipant.id}`,
        category: "child",
        label: wayfinderParticipant.name ?? "Wayfinder",
        subtitle: "Direct with wayfinder",
        participant: wayfinderParticipant,
        action: "wayfinder",
        roomId: wayfinderMeta.roomId,
        unreadCount: wayfinderMeta.unreadCount,
        lastMessage: wayfinderMeta.lastMessage,
        lastMessageAt: wayfinderMeta.lastMessageAt,
      });
    }

    return contacts;
  }, [groupName, parentParticipant, wayfinderParticipant, roomsQuery.data]);

  const visibleContacts = useMemo(
    () => filterContacts(allContacts, selectedFilters),
    [allContacts, selectedFilters],
  );

  const people = useMemo<ChatSidebarPerson[]>(
    () =>
      visibleContacts.map((contact) => ({
        id: contact.id,
        label: contact.label,
        subtitle: contact.subtitle,
        unreadCount: contact.unreadCount,
        avatarUrl: contact.avatarUrl,
      })),
    [visibleContacts],
  );

  const hasAutoOpenedRef = useRef(false);

  useEffect(() => {
    if (hasAutoOpenedRef.current || activeRoomId || openRoomMutation.isPending) return;
    const groupContact = allContacts.find((contact) => contact.action === "group");
    if (!groupContact) return;
    hasAutoOpenedRef.current = true;
    setActiveContactId(groupContact.id);
    openRoomMutation.mutate(groupContact);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeRoomId, allContacts]);

  useEffect(() => {
    if (!activeContactId || visibleContacts.some((contact) => contact.id === activeContactId)) {
      return;
    }
    setActiveContactId(null);
    setActiveRoomId(null);
  }, [activeContactId, visibleContacts]);

  const activeRoom = (roomsQuery.data ?? []).find((room) => room.roomId === activeRoomId);
  const activeContact = allContacts.find((contact) => contact.id === activeContactId);

  function handleSend(file?: File | null) {
    const content = message.trim();
    if (!content && !file) return;
    if (!activeRoomId) return;
    setMessage("");
    void send(content, file);
  }

  const title = activeContact?.label ?? (activeRoom?.type === "GROUP" ? groupName : "Chat");

  function handleFilterToggle(filter: ChatContactCategory) {
    setSelectedFilters((current) => toggleChatFilter(current, filter));
  }

  function handleSelectContact(contact: ChatSidebarContact) {
    const childContact = contact as ChildContact;
    setActiveContactId(childContact.id);
    openRoomMutation.mutate(childContact);
  }

  function handleSelectPerson(person: ChatSidebarPerson) {
    const contact = allContacts.find((item) => item.id === person.id);
    if (!contact) return;
    handleSelectContact(contact);
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col gap-1 px-4 md:px-6 pt-4 pb-2 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h1 className="uppercase" style={{ ...inter, fontWeight: 700, fontSize: "22px", letterSpacing: "0.8px", color: "#DCE6EC" }}>
            Message
          </h1>
          <div className="hidden md:block">
            <ChildUserDropdown />
          </div>
        </div>
        <Breadcrumbs
          showHome={false}
          items={[
            { href: "/child-dashboard", label: "Student Dashboard" },
            { href: "/child-dashboard/message", label: "Message" },
          ]}
        />
      </div>

      <div
        className="flex-1 flex flex-col md:flex-row min-h-0 mx-4 md:mx-6 mb-4 rounded-[16px] overflow-hidden"
        style={{ backgroundColor: "#1a1930" }}
      >
        <ChatSidebar
          portal="child"
          className="md:w-[300px] md:border-r border-b md:border-b-0"
          people={people}
          peopleLabel="Contacts"
          activePersonId={activeContactId}
          onSelectPerson={handleSelectPerson}
          contacts={[]}
          hideFilters
          activeContactId={activeContactId}
          selectedFilters={selectedFilters}
          onFilterToggle={handleFilterToggle}
          onSelectContact={handleSelectContact}
          footer={`${people.length} contact${people.length === 1 ? "" : "s"}`}
        />

        <div className="flex-1 flex flex-col min-h-0">
          <div className="px-5 py-3 border-b border-white/5 flex-shrink-0">
            <h2 style={{ ...inter, fontWeight: 700, fontSize: "16px", color: "#FFFFFF" }}>{title}</h2>
            <p style={{ ...inter, fontWeight: 400, fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>
              {activeContact?.category === "group" ? "Group chat" : "Direct chat"}
            </p>
          </div>

          <ChatMessageList
            messages={activeMessages}
            isLoading={messagesLoading}
            self={{ type: "CHILD", id: child?.id }}
            selfDisplayName={child?.userName ?? "You"}
            activeRoom={activeRoom}
            groupParticipants={resolvedParticipants}
            othersTyping={othersTyping}
            scrollRef={scrollRef}
            onScroll={onScroll}
            onRetry={retry}
            emptyLabel="No messages yet. Start by sending hello."
          />

          <ChatComposer
            value={message}
            onChange={setMessage}
            onSend={handleSend}
            onTyping={notifyTyping}
            disabled={!activeRoomId}
            placeholder={activeRoomId ? "Message" : "Select a chat"}
          />
        </div>
      </div>
    </div>
  );
}
