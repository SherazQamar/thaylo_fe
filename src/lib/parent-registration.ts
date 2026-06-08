import type { Child, User } from "@/types/api";

export type UserWithChildren = User & { children?: Child[] };

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
