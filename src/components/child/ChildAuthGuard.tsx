"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthAgent } from "@/lib/auth-agent";
import { fetchChildProfile } from "@/lib/child-api";
import { getChildToken } from "@/lib/auth-cookies";
import { logoutChild } from "@/lib/auth-session";
import { useChildAuthStore } from "@/stores/child-auth.store";

type AuthStatus = "loading" | "authenticated";

export default function ChildAuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<AuthStatus>("loading");

  useEffect(() => {
    if (!isAuthAgent("child")) {
      router.replace("/");
      return;
    }

    const token = getChildToken();
    if (!token) {
      router.replace("/child-sign-in");
      return;
    }

    let cancelled = false;

    fetchChildProfile()
      .then((profile) => {
        if (cancelled) return;
        useChildAuthStore.getState().setChild(profile);
        setStatus("authenticated");
      })
      .catch(() => {
        if (cancelled) return;
        logoutChild();
        router.replace("/child-sign-in");
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
