"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ParentUserDropdown from "@/components/parent/ParentUserDropdown";
import ParentChildMessageSnapshotCard from "@/components/parent/ParentChildMessageSnapshotCard";
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
  const [activeCategory, setActiveCategory] = useState<ChatContactCategory>("child");

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
        avatarUrl: child.avatarUrl,
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
        avatarUrl: selectedChild.avatarUrl,
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
        avatarUrl: selectedChild.avatarUrl,
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
        avatarUrl: wayfinderRoom.otherParticipant.avatarUrl,
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

  const categoryAvatars = useMemo(() => {
    const childAvatar: CategoryAvatarItem | undefined = selectedChild
      ? { name: selectedChild.userName, avatarUrl: selectedChild.avatarUrl }
      : undefined;
    const wayfinderContact = allContacts.find((c) => c.category === "parent");
    const wayfinder: CategoryAvatarItem | undefined = wayfinderContact
      ? { name: wayfinderContact.label, avatarUrl: wayfinderContact.avatarUrl }
      : undefined;
    const parentSelf: CategoryAvatarItem | undefined = user
      ? { name: user.name ?? "Parent", avatarUrl: user.avatarUrl }
      : undefined;
    return {
      child: childAvatar,
      parent: wayfinder,
      group: [childAvatar, parentSelf, wayfinder].filter(
        (item): item is CategoryAvatarItem => Boolean(item),
      ),
    };
  }, [allContacts, selectedChild, user]);

  const visibleContacts = useMemo(
    () => filterContacts(allContacts, [activeCategory]),
    [allContacts, activeCategory],
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
  }, [activeContactId, visibleContacts, activeChildId, activeCategory]);

  const activeRoom = (roomsQuery.data ?? []).find((room) => room.roomId === activeRoomId);

  function handleSend(file?: File | null) {
    const content = messageText.trim();
    if (!content && !file) return;
    if (!activeRoomId) return;
    setMessageText("");
    void send(content, file);
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

  function handleCategorySelect(category: ChatContactCategory) {
    if (category === activeCategory) return;
    setActiveCategory(category);
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
          layout="focus"
          className="md:w-[300px] lg:w-[320px] md:border-r border-b md:border-b-0"
          backLink={{ href: "/parent-dashboard/children", label: "Back to Children" }}
          people={people}
          peopleLabel="Children"
          activePersonId={activeChildId != null ? String(activeChildId) : null}
          onSelectPerson={handleSelectPerson}
          personStatus={
            selectedChild
              ? { label: selectedChild.plantStatus || "Growing", online: false }
              : null
          }
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
            <ParentChildMessageSnapshotCard childId={activeChildId} />
          </div>

          <ChatMessageList
            messages={activeMessages}
            isLoading={messagesLoading}
            self={{ type: "USER", id: user?.id }}
            selfDisplayName={user?.name ?? "You"}
            selfAvatarUrl={user?.avatarUrl}
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
            placeholder={activeRoomId ? "Type a message..." : "Select a chat first"}
          />
        </div>
      </div>
    </div>
  );
}
