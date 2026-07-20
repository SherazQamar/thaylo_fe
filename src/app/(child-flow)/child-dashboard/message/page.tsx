"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ChildUserDropdown from "@/components/child/ChildUserDropdown";
import ChildMessageSnapshotCard from "@/components/child/ChildMessageSnapshotCard";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import ChatSidebar, {
  type CategoryAvatarItem,
} from "@/components/shared/chat/ChatSidebar";
import ChatMessageList from "@/components/shared/chat/ChatMessageList";
import ChatComposer from "@/components/shared/chat/ChatComposer";
import {
  clearRoomUnreadInCache,
  filterContacts,
  roomMeta,
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

function formatChildGrade(grade: string | null | undefined): string {
  if (!grade?.trim()) return "Student";
  if (/^grade\s/i.test(grade.trim())) return grade.trim();
  return `Grade ${grade.trim()}`;
}

export default function ChildMessagePage() {
  const queryClient = useQueryClient();
  const child = useChildAuthStore((s) => s.child);
  const [message, setMessage] = useState("");
  const [activeRoomId, setActiveRoomId] = useState<number | null>(null);
  const [activeContactId, setActiveContactId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<ChatContactCategory>("group");
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
        avatarUrl: child?.avatarUrl,
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
        avatarUrl: parentParticipant.avatarUrl,
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
        avatarUrl: wayfinderParticipant.avatarUrl,
      });
    }

    return contacts;
  }, [child?.avatarUrl, groupName, parentParticipant, wayfinderParticipant, roomsQuery.data]);

  const categoryCounts = useMemo(() => {
    const counts: Record<ChatContactCategory, number> = {
      child: 0,
      parent: 0,
      group: 0,
    };
    for (const contact of allContacts) {
      counts[contact.category] += contact.unreadCount ?? 0;
    }
    return counts;
  }, [allContacts]);

  const visibleContacts = useMemo(
    () => filterContacts(allContacts, [activeCategory]),
    [allContacts, activeCategory],
  );

  const people = useMemo<ChatSidebarPerson[]>(
    () =>
      child
        ? [
            {
              id: String(child.id),
              label: child.userName,
              subtitle: formatChildGrade(child.grade),
              avatarUrl: child.avatarUrl,
            },
          ]
        : [],
    [child],
  );

  const categoryAvatars = useMemo(() => {
    const wayfinder: CategoryAvatarItem | undefined = wayfinderParticipant
      ? {
          name: wayfinderParticipant.name ?? "Wayfinder",
          avatarUrl: wayfinderParticipant.avatarUrl,
        }
      : undefined;
    const parent: CategoryAvatarItem | undefined = parentParticipant
      ? {
          name: parentParticipant.name ?? "Parent",
          avatarUrl: parentParticipant.avatarUrl,
        }
      : undefined;
    const self: CategoryAvatarItem | undefined = child
      ? { name: child.userName, avatarUrl: child.avatarUrl }
      : undefined;
    return {
      child: wayfinder,
      parent,
      group: [self, parent, wayfinder].filter(
        (item): item is CategoryAvatarItem => Boolean(item),
      ),
    };
  }, [child, parentParticipant, wayfinderParticipant]);

  const hasAutoOpenedRef = useRef(false);

  useEffect(() => {
    if (hasAutoOpenedRef.current || activeRoomId || openRoomMutation.isPending) return;
    const preferred =
      visibleContacts.find((c) => c.category === activeCategory) ??
      allContacts.find((contact) => contact.action === "group");
    if (!preferred) return;
    hasAutoOpenedRef.current = true;
    setActiveContactId(preferred.id);
    setActiveCategory(preferred.category);
    openRoomMutation.mutate(preferred as ChildContact);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeRoomId, allContacts]);

  useEffect(() => {
    if (!activeContactId || visibleContacts.some((contact) => contact.id === activeContactId)) {
      return;
    }
    setActiveContactId(null);
    setActiveRoomId(null);
  }, [activeContactId, visibleContacts]);

  useEffect(() => {
    if (activeContactId || visibleContacts.length === 0) return;
    const first = visibleContacts[0] as ChildContact;
    setActiveContactId(first.id);
    openRoomMutation.mutate(first);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeContactId, visibleContacts, activeCategory]);

  const activeRoom = (roomsQuery.data ?? []).find((room) => room.roomId === activeRoomId);

  function handleSend(file?: File | null) {
    const content = message.trim();
    if (!content && !file) return;
    if (!activeRoomId) return;
    setMessage("");
    void send(content, file);
  }

  function handleSelectContact(contact: ChatSidebarContact) {
    const childContact = contact as ChildContact;
    setActiveContactId(childContact.id);
    openRoomMutation.mutate(childContact);
  }

  function handleCategorySelect(category: ChatContactCategory) {
    if (category === activeCategory) return;
    setActiveCategory(category);
    setActiveContactId(null);
    setActiveRoomId(null);
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
          layout="focus"
          className="md:w-[300px] lg:w-[320px] md:border-r border-b md:border-b-0"
          backLink={{ href: "/child-dashboard", label: "Back to Dashboard" }}
          people={people}
          activePersonId={child ? String(child.id) : null}
          personStatus={{ label: "Online", online: true }}
          contacts={visibleContacts}
          activeContactId={activeContactId}
          selectedFilters={[activeCategory]}
          onFilterToggle={handleCategorySelect}
          activeCategory={activeCategory}
          onCategorySelect={handleCategorySelect}
          categoryCounts={categoryCounts}
          categoryAvatars={categoryAvatars}
          onSelectContact={handleSelectContact}
        />

        <div className="flex-1 flex flex-col min-h-0">
          <div className="px-3 md:px-4 py-3 border-b border-white/10">
            <ChildMessageSnapshotCard />
          </div>

          <ChatMessageList
            messages={activeMessages}
            isLoading={messagesLoading}
            self={{ type: "CHILD", id: child?.id }}
            selfDisplayName={child?.userName ?? "You"}
            selfAvatarUrl={child?.avatarUrl}
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
            placeholder={activeRoomId ? "Type a message..." : "Select a chat"}
          />
        </div>
      </div>
    </div>
  );
}
