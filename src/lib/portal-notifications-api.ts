import { api } from "@/lib/api";
import type { ApiResponse, PaginatedMeta } from "@/types/api";

export type PortalNotificationCategory =
  | "PROGRESS"
  | "SEL"
  | "BILLING"
  | "SYSTEM";

export interface PortalNotificationItem {
  id: number;
  category: PortalNotificationCategory;
  title: string;
  body: string;
  href: string | null;
  sourceKey: string;
  readAt: string | null;
  createdAt: string;
}

export interface PortalNotificationsResult {
  items: PortalNotificationItem[];
  meta: PaginatedMeta & { unreadCount?: number };
}

export type NotificationsAuthMode = "wayfinder" | "parent";

function basePath(mode: NotificationsAuthMode) {
  return mode === "parent" ? "/parent/notifications" : "/wayfinder/notifications";
}

export async function fetchPortalNotifications(
  mode: NotificationsAuthMode,
  params: {
    page?: number;
    limit?: number;
    category?: PortalNotificationCategory | "";
    unreadOnly?: boolean;
  } = {},
): Promise<PortalNotificationsResult> {
  const { data } = await api.get<
    ApiResponse<PortalNotificationItem[]> & { meta?: PaginatedMeta & { unreadCount?: number } }
  >(basePath(mode), {
    params: {
      page: params.page ?? 1,
      limit: params.limit ?? 20,
      ...(params.category ? { category: params.category } : {}),
      ...(params.unreadOnly ? { unreadOnly: "true" } : {}),
    },
  });

  // Backend returns { data: { items, meta } } via ApiResponseDto wrapping object
  const payload = data.data as unknown as {
    items?: PortalNotificationItem[];
    meta?: PaginatedMeta & { unreadCount?: number };
  };

  if (payload && Array.isArray(payload.items)) {
    return {
      items: payload.items,
      meta: payload.meta ?? {
        total: payload.items.length,
        lastPage: 1,
        currentPage: 1,
        perPage: params.limit ?? 20,
        prev: null,
        next: null,
        unreadCount: 0,
      },
    };
  }

  return {
    items: Array.isArray(data.data) ? data.data : [],
    meta: data.meta ?? {
      total: 0,
      lastPage: 1,
      currentPage: 1,
      perPage: 20,
      prev: null,
      next: null,
      unreadCount: 0,
    },
  };
}

export async function fetchPortalNotificationCount(
  mode: NotificationsAuthMode,
): Promise<number> {
  const { data } = await api.get<ApiResponse<{ count: number }>>(
    `${basePath(mode)}/count`,
  );
  return data.data?.count ?? 0;
}

export async function markPortalNotificationRead(
  mode: NotificationsAuthMode,
  id: number,
) {
  await api.patch(`${basePath(mode)}/${id}/read`);
}

export async function markAllPortalNotificationsRead(mode: NotificationsAuthMode) {
  await api.patch(`${basePath(mode)}/read-all`);
}

export const notificationQueryKeys = {
  list: (mode: NotificationsAuthMode, params: Record<string, unknown>) =>
    ["notifications", mode, "list", params] as const,
  count: (mode: NotificationsAuthMode) => ["notifications", mode, "count"] as const,
};
