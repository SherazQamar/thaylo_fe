export interface AccessTokenPayload {
  sub: number;
  email?: string;
  role?: string;
  exp?: number;
}

/** Decodes JWT payload (no signature verification — use with API validation). */
export function decodeAccessTokenPayload(
  token: string,
): AccessTokenPayload | null {
  try {
    const segment = token.split(".")[1];
    if (!segment) return null;

    const base64 = segment.replace(/-/g, "+").replace(/_/g, "/");
    const padded =
      base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const json =
      typeof atob !== "undefined"
        ? atob(padded)
        : Buffer.from(padded, "base64").toString("utf-8");

    return JSON.parse(json) as AccessTokenPayload;
  } catch {
    return null;
  }
}

function isAccessTokenValidForRole(token: string, role: string): boolean {
  const payload = decodeAccessTokenPayload(token);
  if (!payload?.sub) return false;
  if (payload.role !== role) return false;
  if (payload.exp != null && payload.exp * 1000 <= Date.now()) return false;
  return true;
}

export function isParentAccessTokenValid(token: string): boolean {
  return isAccessTokenValidForRole(token, "PARENT");
}

export function isWayfinderAccessTokenValid(token: string): boolean {
  return isAccessTokenValidForRole(token, "WAY_FINDER");
}
