"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchUserProfile } from "@/lib/auth-api";
import { getUserToken } from "@/lib/auth-cookies";
import { logoutUser } from "@/lib/auth-session";
import { isWayfinderAccessTokenValid } from "@/lib/jwt";
import { useAuthStore } from "@/stores/auth.store";

type AuthStatus = "loading" | "authenticated";

export default function WayfinderAuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<AuthStatus>("loading");

  useEffect(() => {
    const token = getUserToken();
    if (!token) {
      router.replace("/wayfinder-sign-in");
      return;
    }

    if (!isWayfinderAccessTokenValid(token)) {
      logoutUser();
      router.replace("/");
      return;
    }

    let cancelled = false;

    fetchUserProfile()
      .then((profile) => {
        if (cancelled) return;

        if (profile.role !== "WAY_FINDER") {
          logoutUser();
          router.replace("/");
          return;
        }

        useAuthStore.getState().setUser(profile);
        setStatus("authenticated");
      })
      .catch(() => {
        if (cancelled) return;
        logoutUser();
        router.replace("/wayfinder-sign-in");
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
