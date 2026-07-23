/** Roles served by this app. Admin / Super Admin use a separate portal. */
export type PortalUserRole = "PARENT" | "WAY_FINDER";

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  success: boolean;
  timestamp: string;
}

export interface PaginatedMeta {
  total: number;
  lastPage: number;
  currentPage: number;
  perPage: number;
  prev: number | null;
  next: number | null;
}

export interface PaginatedApiResponse<T> extends ApiResponse<T[]> {
  meta: PaginatedMeta;
}

export type GuardianRelationType = "PARENT" | "GUARDIAN";

export interface User {
  id: number;
  email: string;
  name: string | null;
  role: PortalUserRole;
  phone?: string | null;
  country?: string | null;
  timeZone?: string | null;
  /** Hiring / coverage region (Wayfinders). Sets operational timezone. */
  region?: string | null;
  /** Selected preset avatar R2 key. */
  avatarKey?: string | null;
  /** Public URL for the selected preset avatar. */
  avatarUrl?: string | null;
  guardianType?: GuardianRelationType | null;
  secondaryGuardianName?: string | null;
  secondaryGuardianType?: GuardianRelationType | null;
  IsFamilyRegister?: boolean;
  isChildRegister?: boolean;
  isEmailVerified?: boolean;
  children?: Child[];
}

export interface Child {
  id: number;
  firstName?: string | null;
  secondName?: string | null;
  userName: string;
  grade: string | null;
  /** Selected preset avatar R2 key. */
  avatarKey?: string | null;
  /** Public URL for the selected preset avatar. */
  avatarUrl?: string | null;
  interestAreas?: string[];
  /** Note the child writes for their parent to read. */
  notesForParent?: string | null;
  /** Preferred class days (mon–sun). */
  classGoalDays?: string[];
  /** Target daily class minutes. */
  classGoalDailyMinutes?: number | null;
  documentUrls: string[];
  permission: Record<string, unknown> | null;
  userId?: number;
  parentId?: number;
  createdAt?: string;
  updatedAt?: string;
}
