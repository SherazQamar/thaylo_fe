import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isParentAccessTokenValid } from "@/lib/jwt";

const USER_TOKEN_KEY = "thaylo_access_token";
const SIGN_IN_PATH = "/parent-sign-in";

export function middleware(request: NextRequest) {
  const token = request.cookies.get(USER_TOKEN_KEY)?.value;
  const isValid = token ? isParentAccessTokenValid(token) : false;

  if (!isValid) {
    const signInUrl = new URL(SIGN_IN_PATH, request.url);
    signInUrl.searchParams.set("returnUrl", request.nextUrl.pathname);

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
  matcher: ["/parent-dashboard", "/parent-dashboard/:path*"],
};
