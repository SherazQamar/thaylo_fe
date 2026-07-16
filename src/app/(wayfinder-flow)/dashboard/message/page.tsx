"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import UserDropdown from "@/components/wayfinder/UserDropdown";
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
} from "@/components/shared/chat/chat-sidebar-types";
import { fetchWayfinderStudents } from "@/lib/wayfinder-api";
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
  const [selectedFilters, setSelectedFilters] = useState<ChatContactCategory[]>([
    "group",
    "child",
    "parent",
  ]);

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
      },
      {
        id: `child-${selectedStudent.id}`,
        category: "child",
        label: selectedStudent.userName,
        subtitle: "Direct with child",
        studentId: selectedStudent.id,
        action: "child",
        roomId: childMeta.roomId,
        unreadCount: childMeta.unreadCount,
        lastMessage: childMeta.lastMessage,
        lastMessageAt: childMeta.lastMessageAt,
      },
      {
        id: `parent-${selectedStudent.id}`,
        category: "parent",
        label: parentName,
        subtitle: "Direct with parent",
        studentId: selectedStudent.id,
        action: "parent",
        roomId: parentMeta.roomId,
        unreadCount: parentMeta.unreadCount,
        lastMessage: parentMeta.lastMessage,
        lastMessageAt: parentMeta.lastMessageAt,
      },
    ];
  }, [roomsQuery.data, selectedStudent]);

  const visibleContacts = useMemo(
    () => filterContacts(allContacts, selectedFilters),
    [allContacts, selectedFilters],
  );

  useEffect(() => {
    if (!Number.isFinite(deepLinkStudentId) || !activeStudentId) return;
    if (deepLinkStudentId !== activeStudentId) return;

    const contactType =
      deepLinkContact === "parent"
        ? "parent"
        : deepLinkContact === "group"
          ? "group"
          : "child";
    const contactId = `${contactType}-${activeStudentId}`;
    const contact = allContacts.find((item) => item.id === contactId) as WayfinderContact | undefined;
    if (!contact) return;

    setSelectedFilters([contactType]);
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
  }, [activeContactId, visibleContacts, activeStudentId]);

  const activeRoom = (roomsQuery.data ?? []).find((room) => room.roomId === activeRoomId);

  function handleSend(file?: File | null) {
    const content = message.trim();
    if (!content && !file) return;
    if (!activeRoomId) return;
    setMessage("");
    void send(content, file);
  }

  function roomTitle(room: ChatRoomListItem | undefined) {
    if (!room) return "Select a chat";
    return room.type === "GROUP" ? room.groupName ?? "Family Group" : room.otherParticipant?.name ?? "Direct Chat";
  }

  function handleFilterToggle(filter: ChatContactCategory) {
    setSelectedFilters((current) => toggleChatFilter(current, filter));
  }

  function handleSelectContact(contact: ChatSidebarContact) {
    const wayfinderContact = contact as WayfinderContact;
    setActiveContactId(wayfinderContact.id);
    openRoomMutation.mutate(wayfinderContact);
  }

  const activeGroupParticipants = activeRoom?.groupParticipants ?? undefined;

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
          className="md:w-[300px] md:border-r border-b md:border-b-0"
          contacts={visibleContacts}
          activeContactId={activeContactId}
          selectedFilters={selectedFilters}
          onFilterToggle={handleFilterToggle}
          onSelectContact={handleSelectContact}
          header={
            <div className="space-y-2">
              <p className="text-white/50 text-xs uppercase tracking-wide" style={inter}>
                Student
              </p>
              <select
                value={activeStudentId ?? ""}
                onChange={(event) => {
                  const nextId = Number(event.target.value);
                  setActiveStudentId(nextId);
                  setActiveContactId(null);
                  setActiveRoomId(null);
                }}
                className="w-full rounded-[10px] px-3 py-2.5 bg-[#313044] text-white text-sm outline-none border border-white/10"
                style={inter}
              >
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.userName}
                  </option>
                ))}
              </select>
            </div>
          }
          footer={`${visibleContacts.length} chat${visibleContacts.length === 1 ? "" : "s"} shown`}
        />

        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 md:px-5 py-3 md:py-3.5 border-b border-white/10 gap-2">
            <div>
              <p style={{ ...inter, fontWeight: 700, fontSize: "18px", lineHeight: "24px", color: "#FFFFFF" }}>
                {roomTitle(activeRoom)}
              </p>
              <p style={{ ...inter, fontWeight: 400, fontSize: "13px", lineHeight: "18px", color: "rgba(255,255,255,0.5)" }}>
                {activeRoom?.type === "GROUP" ? "Group chat" : "Direct chat"}
              </p>
            </div>
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
            emptyLabel="No messages yet."
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
