import { useQuery } from "@tanstack/react-query";
import { getUserToken } from "@/lib/auth-cookies";
import {
  fetchPortalNotificationCount,
  notificationQueryKeys,
  type NotificationsAuthMode,
} from "@/lib/portal-notifications-api";

export function usePortalNotificationCount(mode: NotificationsAuthMode) {
  const token = getUserToken();

  const query = useQuery({
    queryKey: notificationQueryKeys.count(mode),
    queryFn: () => fetchPortalNotificationCount(mode),
    enabled: !!token,
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
  });

  return {
    count: query.data ?? 0,
    isLoading: query.isLoading,
  };
}
