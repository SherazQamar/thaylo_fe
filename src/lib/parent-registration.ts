import type { Child, User } from "@/types/api";

export type UserWithChildren = User & { children?: Child[] };

export const ADD_CHILD_WIZARD_MODE = "add";

export function isAddChildWizardMode(
  searchParams: Pick<URLSearchParams, "get"> | null | undefined,
): boolean {
  return searchParams?.get("mode") === ADD_CHILD_WIZARD_MODE;
}

export function withAddChildWizardMode(path: string): string {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}mode=${ADD_CHILD_WIZARD_MODE}`;
}

export function hasCompletedFamilyRegistration(
  user: Pick<User, "IsFamilyRegister" | "isChildRegister"> & {
    children?: Child[];
  },
): boolean {
  return (
    user.IsFamilyRegister === true ||
    user.isChildRegister === true ||
    (Array.isArray(user.children) && user.children.length > 0)
  );
}
