import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  isParentAccessTokenValid,
  isWayfinderAccessTokenValid,
} from "@/lib/jwt";

const USER_TOKEN_KEY = "thaylo_access_token";

type ProtectedPortal = {
  prefix: string;
  signInPath: string;
  isValid: (token: string) => boolean;
};

const PROTECTED_PORTALS: ProtectedPortal[] = [
  {
    prefix: "/parent-dashboard",
    signInPath: "/parent-sign-in",
    isValid: isParentAccessTokenValid,
  },
  {
    prefix: "/dashboard",
    signInPath: "/wayfinder-sign-in",
    isValid: isWayfinderAccessTokenValid,
  },
];

/** Design-preview escape hatch: set NEXT_PUBLIC_DISABLE_PARENT_AUTH=true in .env.local. */
const parentAuthDisabled =
  process.env.NEXT_PUBLIC_DISABLE_PARENT_AUTH === "true";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (parentAuthDisabled && pathname.startsWith("/parent-dashboard")) {
    return NextResponse.next();
  }

  const portal = PROTECTED_PORTALS.find((entry) =>
    pathname.startsWith(entry.prefix),
  );

  if (!portal) {
    return NextResponse.next();
  }

  const token = request.cookies.get(USER_TOKEN_KEY)?.value;
  const isValid = token ? portal.isValid(token) : false;

  if (!isValid) {
    const signInUrl = new URL(portal.signInPath, request.url);
    signInUrl.searchParams.set("returnUrl", pathname);

    const response = NextResponse.redirect(signInUrl);
    if (token) {
      response.cookies.set(USER_TOKEN_KEY, "", {
        path: "/",
        maxAge: 0,
        sameSite: "lax",
      });
    }
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/parent-dashboard/:path*", "/dashboard/:path*"],
};
