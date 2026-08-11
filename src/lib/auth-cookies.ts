import Cookies from "js-cookie";

const USER_TOKEN_KEY = "thaylo_access_token";
const CHILD_TOKEN_KEY = "thaylo_child_access_token";

/** Matches backend JWT_EXPIRES_IN=1d */
const TOKEN_EXPIRES_DAYS = 1;

const cookieOptions: Cookies.CookieAttributes = {
  path: "/",
  sameSite: "lax",
  secure:
    typeof window !== "undefined" && window.location.protocol === "https:",
  expires: TOKEN_EXPIRES_DAYS,
};

export function setUserToken(token: string): void {
  Cookies.set(USER_TOKEN_KEY, token, cookieOptions);
}

export function getUserToken(): string | undefined {
  return Cookies.get(USER_TOKEN_KEY);
}

const removeOptions: Cookies.CookieAttributes = {
  path: cookieOptions.path,
  sameSite: cookieOptions.sameSite,
  secure: cookieOptions.secure,
};

export function clearUserToken(): void {
  Cookies.remove(USER_TOKEN_KEY, removeOptions);
}

export function setChildToken(token: string, expiresDays = TOKEN_EXPIRES_DAYS): void {
  Cookies.set(CHILD_TOKEN_KEY, token, {
    ...cookieOptions,
    expires: Math.max(1, expiresDays),
  });
}

export function getChildToken(): string | undefined {
  return Cookies.get(CHILD_TOKEN_KEY);
}

export function clearChildToken(): void {
  Cookies.remove(CHILD_TOKEN_KEY, removeOptions);
}

export function clearAllAuthTokens(): void {
  clearUserToken();
  clearChildToken();
}

/** Removes legacy Zustand persist keys and portal agent marker from localStorage. */
export function clearLegacyAuthStorage(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("thaylo-auth");
  localStorage.removeItem("thaylo-child-auth");
  localStorage.removeItem("thaylo_agent");
}
