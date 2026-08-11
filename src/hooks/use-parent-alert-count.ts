import { useQuery } from "@tanstack/react-query";
import { getUserToken } from "@/lib/auth-cookies";
import { fetchParentAlertCount, parentQueryKeys } from "@/lib/parent-api";

export function useParentAlertCount() {
  const token = getUserToken();

  const query = useQuery({
    queryKey: parentQueryKeys.alertCount(),
    queryFn: fetchParentAlertCount,
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
