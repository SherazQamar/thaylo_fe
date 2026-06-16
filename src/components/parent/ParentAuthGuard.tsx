"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthAgent } from "@/lib/auth-agent";
import { fetchParentProfile } from "@/lib/auth-api";
import { getUserToken } from "@/lib/auth-cookies";
import { logoutParent } from "@/lib/auth-session";
import { useAuthStore } from "@/stores/auth.store";

type AuthStatus = "loading" | "authenticated";

export default function ParentAuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<AuthStatus>("loading");

  useEffect(() => {
    if (!isAuthAgent("parent")) {
      router.replace("/");
      return;
    }

    const token = getUserToken();
    if (!token) {
      router.replace("/parent-sign-in");
      return;
    }

    let cancelled = false;

    fetchParentProfile()
      .then((profile) => {
        if (cancelled) return;

        if (profile.role !== "PARENT") {
          logoutParent();
          router.replace("/parent-sign-in");
          return;
        }

        useAuthStore.getState().setUser(profile);
        setStatus("authenticated");
      })
      .catch(() => {
        if (cancelled) return;
        logoutParent();
        router.replace("/parent-sign-in");
      });

    return () => {
      cancelled = true;
    };
  }, [router]);

  if (status === "loading") {
    return (
      <div className="h-screen flex items-center justify-center bg-[#111023]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#00CED1] border-t-transparent rounded-full animate-spin" />
          <p
            className="text-white/50 text-sm"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Loading…
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
