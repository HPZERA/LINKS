import type { LinkStatus, UserRole } from "./database.types";

export type DeviceType = "desktop" | "mobile" | "tablet" | "unknown";

export interface LinkDTO {
  id: string;
  slug: string;
  destinationUrl: string;
  description: string | null;
  categoryId: string | null;
  categoryName: string | null;
  status: LinkStatus;
  clickCount: number;
  lastClickedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryDTO {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClickDTO {
  id: string;
  linkId: string;
  linkSlug: string;
  referer: string | null;
  userAgent: string | null;
  device: DeviceType;
  browser: string | null;
  os: string | null;
  country: string | null;
  ip: string | null;
  createdAt: string;
}

export interface SettingsDTO {
  siteTitle: string;
  primaryDomain: string | null;
  logoUrl: string | null;
  faviconUrl: string | null;
  metaPixelId: string | null;
  metaAccessToken: string | null;
  metaTestEventCode: string | null;
  googleAnalyticsId: string | null;
  googleTagManagerId: string | null;
  webhookUrl: string | null;
  supportEmail: string | null;
  defaultRedirect: string | null;
  storeIpAddress: boolean;
  updatedAt: string;
}

export interface ProfileDTO {
  id: string;
  email: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  role: UserRole;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type PeriodPreset = "today" | "7d" | "30d" | "90d" | "custom";

export interface DateRange {
  from: Date;
  to: Date;
}

export interface DashboardStats {
  totalLinks: number;
  totalClicks: number;
  clicksToday: number;
  clicksYesterday: number;
  recentClicks: ClickDTO[];
  topLinks: Array<Pick<LinkDTO, "id" | "slug" | "destinationUrl" | "clickCount">>;
}

export interface ActionResult<T = undefined> {
  ok: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}
