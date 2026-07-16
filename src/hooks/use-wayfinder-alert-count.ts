import { useQuery } from "@tanstack/react-query";
import { getUserToken } from "@/lib/auth-cookies";
import { fetchWayfinderAlertCount, wayfinderQueryKeys } from "@/lib/wayfinder-api";

export function useWayfinderAlertCount() {
  const token = getUserToken();

  const query = useQuery({
    queryKey: wayfinderQueryKeys.alertCount(),
    queryFn: fetchWayfinderAlertCount,
    enabled: !!token,
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  return {
    alertCount: query.data ?? 0,
    isLoading: query.isLoading,
  };
}
