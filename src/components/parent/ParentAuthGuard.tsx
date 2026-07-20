"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchParentProfile } from "@/lib/auth-api";
import { getUserToken } from "@/lib/auth-cookies";
import { logoutParent } from "@/lib/auth-session";
import { isParentAccessTokenValid } from "@/lib/jwt";
import { useAuthStore } from "@/stores/auth.store";
import type { User } from "@/types/api";

type AuthStatus = "loading" | "authenticated";

/** Design-preview escape hatch: set NEXT_PUBLIC_DISABLE_PARENT_AUTH=true in .env.local. */
const authDisabled = process.env.NEXT_PUBLIC_DISABLE_PARENT_AUTH === "true";

const previewParent: User = {
  id: 0,
  email: "preview.parent@thayloglobal.com",
  name: "Preview Parent",
  role: "PARENT",
  isEmailVerified: true,
  children: [],
};

export default function ParentAuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<AuthStatus>(
    authDisabled ? "authenticated" : "loading"
  );

  useEffect(() => {
    if (authDisabled) {
      useAuthStore.getState().setUser(previewParent);
      return;
    }

    const token = getUserToken();
    if (!token) {
      router.replace("/parent-sign-in");
      return;
    }

    if (!isParentAccessTokenValid(token)) {
      logoutParent();
      router.replace("/");
      return;
    }

    let cancelled = false;

    fetchParentProfile()
      .then((profile) => {
        if (cancelled) return;

        if (profile.role !== "PARENT") {
          logoutParent();
          router.replace("/");
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
