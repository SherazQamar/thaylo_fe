export const LANDING_PATH = "/";

export const PORTAL_SIGN_IN_PATHS = {
  parent: "/parent-sign-in",
  wayfinder: "/wayfinder-sign-in",
  child: "/child-sign-in",
} as const;

export type PortalAgent = keyof typeof PORTAL_SIGN_IN_PATHS;
