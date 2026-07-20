"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ParentUserDropdown from "@/components/parent/ParentUserDropdown";
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
import { fetchParentChildren } from "@/lib/parent-api";
import {
  findOrCreateDirectRoom,
  findOrCreateGroupRoom,
  listChatRooms,
  markRoomAsRead,
  type ChatRoomListItem,
} from "@/lib/chat-api";
import { useAuthStore } from "@/stores/auth.store";
import { useChatConversation } from "@/hooks/use-chat-conversation";

const inter = { fontFamily: "Inter, sans-serif" } as const;

type ParentContact = ChatSidebarContact & {
  childId?: number;
  wayfinderId?: number;
  targetType?: "USER" | "CHILD";
  targetId?: number;
};

function roomLabel(room: ChatRoomListItem) {
  if (room.type === "GROUP") return room.groupName ?? "Family Group";
  return room.otherParticipant?.name ?? "Direct Chat";
}

function formatChildGrade(grade: string | null | undefined): string {
  if (!grade?.trim()) return "Child";
  if (/^grade\s/i.test(grade.trim())) return grade.trim();
  return `Grade ${grade.trim()}`;
}

export default function ParentMessagePage() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const user = useAuthStore((s) => s.user);
  const [activeRoomId, setActiveRoomId] = useState<number | null>(null);
  const [messageText, setMessageText] = useState("");
  const [activeContactId, setActiveContactId] = useState<string | null>(null);
  const [activeChildId, setActiveChildId] = useState<number | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<ChatContactCategory[]>([
    "group",
    "child",
    "parent",
  ]);

  const { data: children = [] } = useQuery({
    queryKey: ["parent-children"],
    queryFn: fetchParentChildren,
  });

  useEffect(() => {
    const fromQuery = Number(searchParams.get("childId"));
    if (Number.isFinite(fromQuery) && fromQuery > 0) {
      const match = children.find((c) => c.id === fromQuery);
      if (match) {
        setActiveChildId(match.id);
        return;
      }
    }
    if (activeChildId || !children[0]?.id) return;
    setActiveChildId(children[0].id);
  }, [activeChildId, children, searchParams]);

  const roomsQuery = useQuery({
    queryKey: ["chat-rooms", "parent"],
    queryFn: () => listChatRooms("user"),
    refetchInterval: 8000,
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
    roleMode: "user",
    scope: "parent",
    roomId: activeRoomId,
    self: { type: "USER", id: user?.id },
  });

  const selectedChild = children.find((c) => c.id === activeChildId);

  const people = useMemo<ChatSidebarPerson[]>(() => {
    const rooms = roomsQuery.data ?? [];
    return children.map((child) => {
      const unread =
        roomMeta(
          rooms,
          (room) => room.type === "GROUP" && room.anchorChild?.id === child.id,
        ).unreadCount +
        roomMeta(
          rooms,
          (room) =>
            room.type === "DIRECT" &&
            room.otherParticipant?.type === "CHILD" &&
            room.otherParticipant.id === child.id,
        ).unreadCount;
      return {
        id: String(child.id),
        label: child.userName,
        subtitle: formatChildGrade(child.grade),
        unreadCount: unread,
      };
    });
  }, [children, roomsQuery.data]);

  const allContacts = useMemo<ParentContact[]>(() => {
    if (!selectedChild) return [];

    const rooms = roomsQuery.data ?? [];
    const wayfinderRoom = rooms.find(
      (room) => room.type === "DIRECT" && room.otherParticipant?.role === "WAYFINDER",
    );

    const groupMeta = roomMeta(
      rooms,
      (room) => room.type === "GROUP" && room.anchorChild?.id === selectedChild.id,
    );
    const childMeta = roomMeta(
      rooms,
      (room) =>
        room.type === "DIRECT" &&
        room.otherParticipant?.type === "CHILD" &&
        room.otherParticipant.id === selectedChild.id,
    );

    const contacts: ParentContact[] = [
      {
        id: `group-${selectedChild.id}`,
        category: "group",
        label: `${selectedChild.userName}'s Family Group`,
        subtitle: "Group chat",
        childId: selectedChild.id,
        roomId: groupMeta.roomId,
        unreadCount: groupMeta.unreadCount,
        lastMessage: groupMeta.lastMessage,
        lastMessageAt: groupMeta.lastMessageAt,
      },
      {
        id: `child-${selectedChild.id}`,
        category: "child",
        label: selectedChild.userName,
        subtitle: "Direct with child",
        childId: selectedChild.id,
        targetType: "CHILD",
        targetId: selectedChild.id,
        roomId: childMeta.roomId,
        unreadCount: childMeta.unreadCount,
        lastMessage: childMeta.lastMessage,
        lastMessageAt: childMeta.lastMessageAt,
      },
    ];

    if (wayfinderRoom?.otherParticipant) {
      contacts.push({
        id: `parent-wayfinder-${wayfinderRoom.otherParticipant.id}`,
        category: "parent",
        label: wayfinderRoom.otherParticipant.name ?? "Wayfinder",
        subtitle: "Direct with wayfinder",
        wayfinderId: wayfinderRoom.otherParticipant.id,
        targetType: "USER",
        targetId: wayfinderRoom.otherParticipant.id,
        roomId: wayfinderRoom.roomId,
        unreadCount: wayfinderRoom.unreadCount,
        lastMessage: wayfinderRoom.lastMessage,
        lastMessageAt: wayfinderRoom.lastMessageAt,
      });
    } else {
      contacts.push({
        id: `parent-wayfinder-pending-${selectedChild.id}`,
        category: "parent",
        label: "Wayfinder",
        subtitle: "Direct with wayfinder",
        childId: selectedChild.id,
        unreadCount: 0,
      });
    }

    return contacts;
  }, [selectedChild, roomsQuery.data]);

  const visibleContacts = useMemo(
    () => filterContacts(allContacts, selectedFilters),
    [allContacts, selectedFilters],
  );

  const ensureRoomMutation = useMutation({
    mutationFn: async (contact: ParentContact) => {
      if (contact.category === "group") {
        if (!contact.childId) throw new Error("No child found for group chat.");
        const group = await findOrCreateGroupRoom("user", { childId: contact.childId });
        return group.roomId;
      }

      if (contact.targetType && contact.targetId) {
        const direct = await findOrCreateDirectRoom("user", {
          targetType: contact.targetType,
          targetId: contact.targetId,
        });
        return direct.roomId;
      }

      if (contact.category === "parent" && contact.childId) {
        const group = await findOrCreateGroupRoom("user", { childId: contact.childId });
        const participant = group.participants.find((p) => p.role === "WAYFINDER");
        if (!participant) throw new Error("Wayfinder not assigned yet.");
        const direct = await findOrCreateDirectRoom("user", {
          targetType: participant.type,
          targetId: participant.id,
        });
        return direct.roomId;
      }

      throw new Error("Unable to open this chat.");
    },
    onSuccess: async (roomId) => {
      setActiveRoomId(roomId);
      queryClient.setQueryData<ChatRoomListItem[]>(
        ["chat-rooms", "parent"],
        (prev) => clearRoomUnreadInCache(prev, roomId),
      );
      await queryClient.invalidateQueries({ queryKey: ["chat-rooms", "parent"] });
      await markRoomAsRead("user", roomId);
    },
  });

  useEffect(() => {
    if (!activeContactId || visibleContacts.some((contact) => contact.id === activeContactId)) {
      return;
    }
    setActiveContactId(null);
    setActiveRoomId(null);
  }, [activeContactId, visibleContacts]);

  useEffect(() => {
    if (activeContactId || visibleContacts.length === 0) return;
    const first = visibleContacts[0] as ParentContact;
    setActiveContactId(first.id);
    ensureRoomMutation.mutate(first);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeContactId, visibleContacts, activeChildId]);

  const activeRoom = (roomsQuery.data ?? []).find((room) => room.roomId === activeRoomId);

  function handleSend(file?: File | null) {
    const content = messageText.trim();
    if (!content && !file) return;
    if (!activeRoomId) return;
    setMessageText("");
    void send(content, file);
  }

  function handleFilterToggle(filter: ChatContactCategory) {
    setSelectedFilters((current) => toggleChatFilter(current, filter));
  }

  function handleSelectContact(contact: ChatSidebarContact) {
    const parentContact = contact as ParentContact;
    setActiveContactId(parentContact.id);
    ensureRoomMutation.mutate(parentContact);
  }

  function handleSelectPerson(person: ChatSidebarPerson) {
    const nextId = Number(person.id);
    if (!Number.isFinite(nextId) || nextId === activeChildId) return;
    setActiveChildId(nextId);
    setActiveContactId(null);
    setActiveRoomId(null);
  }

  const activeGroupParticipants = activeRoom?.groupParticipants ?? undefined;

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col gap-1 px-4 md:px-6 lg:px-10 py-4 md:py-5 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h1 className="uppercase" style={{ ...inter, fontWeight: 700, fontSize: "24px", color: "#DCE6EC" }}>
            Message
          </h1>
          <div className="hidden md:block"><ParentUserDropdown /></div>
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
        className="flex-1 flex flex-col md:flex-row mx-4 md:mx-6 lg:mx-10 mb-4 md:mb-6 rounded-[12px] overflow-hidden"
        style={{ backgroundColor: "#1a1930" }}
      >
        <ChatSidebar
          portal="parent"
          className="md:w-[300px] md:border-r border-b md:border-b-0"
          people={people}
          peopleLabel="Children"
          activePersonId={activeChildId != null ? String(activeChildId) : null}
          onSelectPerson={handleSelectPerson}
          contacts={visibleContacts}
          activeContactId={activeContactId}
          selectedFilters={selectedFilters}
          onFilterToggle={handleFilterToggle}
          onSelectContact={handleSelectContact}
          footer={`${visibleContacts.length} chat${visibleContacts.length === 1 ? "" : "s"} · ${people.length} child${people.length === 1 ? "" : "ren"}`}
        />

        <div className="flex-1 flex flex-col min-h-0">
          <div className="px-4 md:px-5 py-3 border-b border-white/10">
            <p style={{ ...inter, fontWeight: 700, fontSize: "18px", color: "#fff" }}>
              {activeRoom ? roomLabel(activeRoom) : "Select a chat"}
            </p>
            <p style={{ ...inter, fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>
              {activeRoom?.type === "GROUP"
                ? `Group · ${selectedChild?.userName ?? "Child"}`
                : "Direct chat"}
            </p>
          </div>

          <ChatMessageList
            messages={activeMessages}
            isLoading={messagesLoading}
            self={{ type: "USER", id: user?.id }}
            selfDisplayName={user?.name ?? "You"}
            activeRoom={activeRoom}
            groupParticipants={activeGroupParticipants}
            othersTyping={othersTyping}
            scrollRef={scrollRef}
            onScroll={onScroll}
            onRetry={retry}
            emptyLabel="No messages yet. Start the conversation."
          />

          <ChatComposer
            value={messageText}
            onChange={setMessageText}
            onSend={handleSend}
            onTyping={notifyTyping}
            disabled={!activeRoomId}
            placeholder={activeRoomId ? "Message" : "Select a chat first"}
          />
        </div>
      </div>
    </div>
  );
}
