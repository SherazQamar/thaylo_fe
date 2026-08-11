"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchPortalNotificationCount,
  fetchPortalNotifications,
  markAllPortalNotificationsRead,
  markPortalNotificationRead,
  notificationQueryKeys,
  type NotificationsAuthMode,
  type PortalNotificationCategory,
  type PortalNotificationItem,
} from "@/lib/portal-notifications-api";
import { useNotifyError } from "@/hooks/use-notify-error";
import { notify } from "@/lib/notify";
import InfoTooltip from "@/components/shared/InfoTooltip";
import { NOTIFICATIONS_CENTER_HINTS } from "@/lib/portal-help-text";

const inter = { fontFamily: "Inter, sans-serif" } as const;

const CATEGORIES: Array<{ value: "" | PortalNotificationCategory; label: string }> = [
  { value: "", label: "All" },
  { value: "PROGRESS", label: "Progress" },
  { value: "SEL", label: "SEL" },
  { value: "SYSTEM", label: "System" },
];

function categoryColor(category: PortalNotificationCategory) {
  switch (category) {
    case "SEL":
      return "#F59E0B";
    case "PROGRESS":
      return "#00CED1";
    case "SYSTEM":
      return "#A78BFA";
    default:
      return "#858C94";
  }
}

function formatWhen(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function NotificationsCenter({
  mode,
  title = "Notifications Center",
}: {
  mode: NotificationsAuthMode;
  title?: string;
}) {
  const queryClient = useQueryClient();
  const [category, setCategory] = useState<"" | PortalNotificationCategory>("");
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [page, setPage] = useState(1);

  const listParams = useMemo(
    () => ({ page, category, unreadOnly }),
    [page, category, unreadOnly],
  );

  const listQuery = useQuery({
    queryKey: notificationQueryKeys.list(mode, listParams),
    queryFn: () =>
      fetchPortalNotifications(mode, {
        page,
        limit: 20,
        category,
        unreadOnly,
      }),
  });

  const countQuery = useQuery({
    queryKey: notificationQueryKeys.count(mode),
    queryFn: () => fetchPortalNotificationCount(mode),
    refetchInterval: 30_000,
  });

  useNotifyError(listQuery.error, listQuery.isError);

  const markOne = useMutation({
    mutationFn: (id: number) => markPortalNotificationRead(mode, id),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["notifications", mode] }),
      ]);
    },
    onError: (err) => notify.error(err, "Could not mark notification read"),
  });

  const markAll = useMutation({
    mutationFn: () => markAllPortalNotificationsRead(mode),
    onSuccess: async () => {
      notify.success("All notifications marked read");
      await queryClient.invalidateQueries({ queryKey: ["notifications", mode] });
    },
    onError: (err) => notify.error(err, "Could not mark all read"),
  });

  const items = listQuery.data?.items ?? [];
  const meta = listQuery.data?.meta;
  const unreadCount = countQuery.data ?? meta?.unreadCount ?? 0;

  const onOpen = async (item: PortalNotificationItem) => {
    if (!item.readAt) {
      try {
        await markOne.mutateAsync(item.id);
      } catch {
        // still allow navigation
      }
    }
  };

  return (
    <div style={inter}>
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <h1 className="text-white text-2xl font-bold tracking-wide uppercase inline-flex items-center gap-2">
            {title}
            <InfoTooltip
              content={NOTIFICATIONS_CENTER_HINTS.shared}
              align="left"
              label="What are notifications?"
            />
          </h1>
          <p className="text-white/50 text-sm mt-1">
            Progress, SEL, and System updates
            {unreadCount > 0 ? ` · ${unreadCount} unread` : ""}
          </p>
        </div>
        <button
          type="button"
          disabled={markAll.isPending || unreadCount === 0}
          onClick={() => markAll.mutate()}
          className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white/80 hover:bg-white/5 disabled:opacity-40"
        >
          Mark all read
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-5">
        {CATEGORIES.map((opt) => (
          <button
            key={opt.label}
            type="button"
            onClick={() => {
              setCategory(opt.value);
              setPage(1);
            }}
            className={
              "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors " +
              (category === opt.value
                ? "bg-[#00CED1] text-[#111023]"
                : "bg-white/5 text-white/70 hover:bg-white/10")
            }
          >
            {opt.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => {
            setUnreadOnly((v) => !v);
            setPage(1);
          }}
          className={
            "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors " +
            (unreadOnly
              ? "bg-[#F59E0B] text-[#111023]"
              : "bg-white/5 text-white/70 hover:bg-white/10")
          }
        >
          Unread only
        </button>
      </div>

      {listQuery.isLoading ? (
        <p className="text-white/50 text-sm py-10 text-center">Loading notifications…</p>
      ) : items.length === 0 ? (
        <div
          className="rounded-2xl px-5 py-12 text-center text-white/50 text-sm"
          style={{ backgroundColor: "#313044" }}
        >
          No notifications in this view yet.
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((item) => {
            const unread = !item.readAt;
            const accent = categoryColor(item.category);
            const content = (
              <div
                className={
                  "rounded-2xl px-4 py-3.5 border transition-colors " +
                  (unread ? "border-white/10 bg-[#313044]" : "border-transparent bg-[#313044]/70")
                }
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#111023]"
                        style={{ backgroundColor: accent }}
                      >
                        {item.category}
                      </span>
                      {unread ? (
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-[#00CED1]">
                          New
                        </span>
                      ) : null}
                    </div>
                    <p className="text-white font-semibold mt-1.5 text-[15px]">{item.title}</p>
                    <p className="text-white/55 text-sm mt-1">{item.body}</p>
                  </div>
                  <span className="shrink-0 text-[11px] text-white/40">{formatWhen(item.createdAt)}</span>
                </div>
              </div>
            );

            if (item.href) {
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => void onOpen(item)}
                  className="block hover:opacity-95"
                >
                  {content}
                </Link>
              );
            }

            return (
              <button
                key={item.id}
                type="button"
                className="text-left w-full"
                onClick={() => void onOpen(item)}
              >
                {content}
              </button>
            );
          })}
        </div>
      )}

      {meta && meta.lastPage > 1 ? (
        <div className="mt-5 flex items-center justify-center gap-3">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/70 disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-white/50 text-sm">
            Page {meta.currentPage} of {meta.lastPage}
          </span>
          <button
            type="button"
            disabled={page >= meta.lastPage}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/70 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      ) : null}
    </div>
  );
}
