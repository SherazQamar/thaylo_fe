"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import UserDropdown from "@/components/wayfinder/UserDropdown";
import WayfinderStudentSnapshotCard from "@/components/wayfinder/WayfinderStudentSnapshotCard";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import ChatSidebar from "@/components/shared/chat/ChatSidebar";
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
  fetchWayfinderStudentSnapshot,
  fetchWayfinderStudents,
  wayfinderQueryKeys,
} from "@/lib/wayfinder-api";
import {
  findOrCreateDirectRoom,
  findOrCreateGroupRoom,
  listChatRooms,
  markRoomAsRead,
  type ChatRoomListItem,
} from "@/lib/chat-api";
import { useAuthStore } from "@/stores/auth.store";
import { useChatConversation } from "@/hooks/use-chat-conversation";
import {
  formatStudentGrade,
  formatWayfinderStudentName,
  isRecentlyActive,
} from "@/lib/wayfinder-student";

const inter = { fontFamily: "Inter, sans-serif" } as const;

type WayfinderContact = ChatSidebarContact & {
  studentId: number;
  action: "group" | "child" | "parent";
};

export default function MessagePage() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const deepLinkStudentId = Number(searchParams.get("studentId"));
  const deepLinkContact = searchParams.get("contact");
  const user = useAuthStore((s) => s.user);
  const [message, setMessage] = useState("");
  const [activeRoomId, setActiveRoomId] = useState<number | null>(null);
  const [activeStudentId, setActiveStudentId] = useState<number | null>(null);
  const [activeContactId, setActiveContactId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<ChatContactCategory>("parent");

  const studentsQuery = useQuery({
    queryKey: ["wayfinder-students-chat"],
    queryFn: () => fetchWayfinderStudents({ page: 1, search: "" }),
  });

  const students = studentsQuery.data?.items ?? [];

  useEffect(() => {
    if (activeStudentId || !students[0]?.id) return;
    const preferred =
      Number.isFinite(deepLinkStudentId) &&
      students.some((student) => student.id === deepLinkStudentId)
        ? deepLinkStudentId
        : students[0].id;
    setActiveStudentId(preferred);
  }, [activeStudentId, students, deepLinkStudentId]);

  const roomsQuery = useQuery({
    queryKey: ["chat-rooms", "wayfinder"],
    queryFn: () => listChatRooms("user"),
    refetchInterval: 8000,
  });

  const snapshotQuery = useQuery({
    queryKey: wayfinderQueryKeys.studentSnapshot(activeStudentId ?? 0),
    queryFn: () => fetchWayfinderStudentSnapshot(activeStudentId!),
    enabled: typeof activeStudentId === "number" && activeStudentId > 0,
    refetchInterval: 30_000,
  });

  const openRoomMutation = useMutation({
    mutationFn: async (contact: WayfinderContact) => {
      if (contact.action === "group") {
        return findOrCreateGroupRoom("user", { childId: contact.studentId });
      }

      const groupRoom = (roomsQuery.data ?? []).find(
        (room) => room.type === "GROUP" && room.anchorChild?.id === contact.studentId,
      );

      if (contact.action === "child") {
        return findOrCreateDirectRoom("user", {
          targetType: "CHILD",
          targetId: contact.studentId,
        });
      }

      const parent = groupRoom?.groupParticipants?.find((p) => p.role === "PARENT");
      if (!parent) {
        const group = await findOrCreateGroupRoom("user", { childId: contact.studentId });
        const parentFromGroup = group.participants.find((p) => p.role === "PARENT");
        if (!parentFromGroup) throw new Error("Parent not found for this student.");
        return findOrCreateDirectRoom("user", {
          targetType: parentFromGroup.type,
          targetId: parentFromGroup.id,
        });
      }

      return findOrCreateDirectRoom("user", {
        targetType: parent.type,
        targetId: parent.id,
      });
    },
    onSuccess: async (room) => {
      setActiveRoomId(room.roomId);
      queryClient.setQueryData<ChatRoomListItem[]>(
        ["chat-rooms", "wayfinder"],
        (prev) => clearRoomUnreadInCache(prev, room.roomId),
      );
      await markRoomAsRead("user", room.roomId);
      await queryClient.invalidateQueries({ queryKey: ["chat-rooms", "wayfinder"] });
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
    roleMode: "user",
    scope: "wayfinder",
    roomId: activeRoomId,
    self: { type: "USER", id: user?.id },
  });

  const selectedStudent = students.find((s) => s.id === activeStudentId);

  const people = useMemo<ChatSidebarPerson[]>(() => {
    const rooms = roomsQuery.data ?? [];
    return students.map((student) => {
      const displayName = formatWayfinderStudentName(student);
      const unread =
        roomMeta(
          rooms,
          (room) => room.type === "GROUP" && room.anchorChild?.id === student.id,
        ).unreadCount +
        roomMeta(
          rooms,
          (room) =>
            room.type === "DIRECT" &&
            room.otherParticipant?.type === "CHILD" &&
            room.otherParticipant.id === student.id,
        ).unreadCount;
      return {
        id: String(student.id),
        label: displayName,
        subtitle: formatStudentGrade(student.grade),
        unreadCount: unread,
        avatarUrl: student.avatarUrl,
      };
    });
  }, [students, roomsQuery.data]);

  const allContacts = useMemo<WayfinderContact[]>(() => {
    if (!selectedStudent) return [];

    const rooms = roomsQuery.data ?? [];
    const groupRoom = rooms.find(
      (room) => room.type === "GROUP" && room.anchorChild?.id === selectedStudent.id,
    );
    const parent = groupRoom?.groupParticipants?.find((p) => p.role === "PARENT");
    const parentName = parent?.name ?? "Parent";

    const groupMeta = roomMeta(
      rooms,
      (room) => room.type === "GROUP" && room.anchorChild?.id === selectedStudent.id,
    );
    const childMeta = roomMeta(
      rooms,
      (room) =>
        room.type === "DIRECT" &&
        room.otherParticipant?.type === "CHILD" &&
        room.otherParticipant.id === selectedStudent.id,
    );
    const parentMeta = parent
      ? roomMeta(
          rooms,
          (room) =>
            room.type === "DIRECT" &&
            room.otherParticipant?.type === parent.type &&
            room.otherParticipant.id === parent.id,
        )
      : { roomId: null, unreadCount: 0, lastMessage: null, lastMessageAt: null };

    return [
      {
        id: `group-${selectedStudent.id}`,
        category: "group",
        label: `${selectedStudent.userName}'s Family Group`,
        subtitle: "Group chat",
        studentId: selectedStudent.id,
        action: "group",
        roomId: groupMeta.roomId,
        unreadCount: groupMeta.unreadCount,
        lastMessage: groupMeta.lastMessage,
        lastMessageAt: groupMeta.lastMessageAt,
        avatarUrl: selectedStudent.avatarUrl,
      },
      {
        id: `child-${selectedStudent.id}`,
        category: "child",
        label: formatWayfinderStudentName(selectedStudent),
        subtitle: "Direct with child",
        studentId: selectedStudent.id,
        action: "child",
        roomId: childMeta.roomId,
        unreadCount: childMeta.unreadCount,
        lastMessage: childMeta.lastMessage,
        lastMessageAt: childMeta.lastMessageAt,
        avatarUrl: selectedStudent.avatarUrl,
      },
      {
        id: `parent-${selectedStudent.id}`,
        category: "parent",
        label: parentName.startsWith("Mom") || parentName.startsWith("Dad")
          ? parentName
          : `Parent – ${parentName}`,
        subtitle: "Direct with parent",
        studentId: selectedStudent.id,
        action: "parent",
        roomId: parentMeta.roomId,
        unreadCount: parentMeta.unreadCount,
        lastMessage: parentMeta.lastMessage,
        lastMessageAt: parentMeta.lastMessageAt,
        avatarUrl: parent?.avatarUrl,
      },
    ];
  }, [roomsQuery.data, selectedStudent]);

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
    if (!selectedStudent) return {};

    const rooms = roomsQuery.data ?? [];
    const groupRoom = rooms.find(
      (room) => room.type === "GROUP" && room.anchorChild?.id === selectedStudent.id,
    );
    const parent = groupRoom?.groupParticipants?.find((p) => p.role === "PARENT");
    const childAvatar = {
      name: formatWayfinderStudentName(selectedStudent),
      avatarUrl: selectedStudent.avatarUrl,
    };
    const parentAvatar = parent
      ? { name: parent.name ?? "Parent", avatarUrl: parent.avatarUrl }
      : undefined;
    const wayfinderSelf = user
      ? { name: user.name ?? "Wayfinder", avatarUrl: user.avatarUrl }
      : undefined;

    return {
      child: childAvatar,
      parent: parentAvatar,
      group: [childAvatar, parentAvatar, wayfinderSelf].filter(
        (item): item is { name: string; avatarUrl?: string | null } => Boolean(item),
      ),
    };
  }, [roomsQuery.data, selectedStudent, user]);

  const visibleContacts = useMemo(
    () => filterContacts(allContacts, [activeCategory]),
    [allContacts, activeCategory],
  );

  useEffect(() => {
    if (!Number.isFinite(deepLinkStudentId) || !activeStudentId) return;
    if (deepLinkStudentId !== activeStudentId) return;

    const contactType: ChatContactCategory =
      deepLinkContact === "parent"
        ? "parent"
        : deepLinkContact === "group"
          ? "group"
          : "child";
    const contactId = `${contactType}-${activeStudentId}`;
    const contact = allContacts.find((item) => item.id === contactId) as WayfinderContact | undefined;
    if (!contact) return;

    setActiveCategory(contactType);
    setActiveContactId(contactId);
    openRoomMutation.mutate(contact);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allContacts, activeStudentId, deepLinkStudentId, deepLinkContact]);

  useEffect(() => {
    if (!activeContactId || visibleContacts.some((contact) => contact.id === activeContactId)) {
      return;
    }
    setActiveContactId(null);
    setActiveRoomId(null);
  }, [activeContactId, visibleContacts]);

  useEffect(() => {
    if (activeContactId || visibleContacts.length === 0) return;
    const first = visibleContacts[0] as WayfinderContact;
    setActiveContactId(first.id);
    openRoomMutation.mutate(first);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeContactId, visibleContacts, activeStudentId, activeCategory]);

  const activeRoom = (roomsQuery.data ?? []).find((room) => room.roomId === activeRoomId);

  function handleSend(file?: File | null) {
    const content = message.trim();
    if (!content && !file) return;
    if (!activeRoomId) return;
    setMessage("");
    void send(content, file);
  }

  function handleSelectContact(contact: ChatSidebarContact) {
    const wayfinderContact = contact as WayfinderContact;
    setActiveContactId(wayfinderContact.id);
    openRoomMutation.mutate(wayfinderContact);
  }

  function handleSelectPerson(person: ChatSidebarPerson) {
    const nextId = Number(person.id);
    if (!Number.isFinite(nextId) || nextId === activeStudentId) return;
    setActiveStudentId(nextId);
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
  const personOnline = isRecentlyActive(snapshotQuery.data?.lastActiveAt);

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col gap-1 px-4 md:px-6 lg:px-10 py-4 md:py-5 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h1 className="uppercase" style={{ ...inter, fontWeight: 700, fontSize: "24px", lineHeight: "25px", letterSpacing: "0.8px", color: "#DCE6EC" }}>
            Message
          </h1>
          <div className="hidden md:block">
            <UserDropdown />
          </div>
        </div>
        <Breadcrumbs
          showHome={false}
          items={[
            { href: "/dashboard", label: "Wayfinder Dashboard" },
            { href: "/dashboard/message", label: "Message" },
          ]}
        />
      </div>

      <div
        className="flex-1 flex flex-col md:flex-row mx-4 md:mx-6 lg:mx-10 mb-4 md:mb-6 rounded-[12px] overflow-hidden"
        style={{ backgroundColor: "#1a1930" }}
      >
        <ChatSidebar
          portal="wayfinder"
          layout="focus"
          className="md:w-[300px] lg:w-[320px] md:border-r border-b md:border-b-0"
          backLink={{ href: "/dashboard/students", label: "Back to Students" }}
          people={people}
          peopleLabel="Students"
          activePersonId={activeStudentId != null ? String(activeStudentId) : null}
          onSelectPerson={handleSelectPerson}
          personStatus={
            selectedStudent
              ? {
                  label: personOnline ? "Active" : "Away",
                  online: personOnline,
                }
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
            <WayfinderStudentSnapshotCard childId={activeStudentId} />
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
            emptyLabel="No messages yet."
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
