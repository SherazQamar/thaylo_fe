"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState, type ReactNode } from "react";
import AppToaster from "@/components/shared/AppToaster";
import { clearLegacyAuthStorage } from "@/lib/auth-cookies";
import { getQueryClient } from "@/lib/query-client";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => getQueryClient());

  useEffect(() => {
    clearLegacyAuthStorage();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <AppToaster />
    </QueryClientProvider>
  );
}
