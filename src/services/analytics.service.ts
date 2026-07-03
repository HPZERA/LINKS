import "server-only";
import { fromZonedTime, toZonedTime } from "date-fns-tz";
import { addDays, startOfDay, subDays } from "date-fns";
import { format } from "date-fns";
import {
  countClicks,
  countClicksInRange,
  listClicks as listClickRows,
  listClicksForAggregation,
  listRecentClicks,
  type ClicksFilter,
} from "@/repositories/clicks.repository";
import { countLinks, listTopLinks } from "@/repositories/links.repository";
import { APP_TIMEZONE } from "@/utils/format";
import type { ClickDTO, DashboardStats, DateRange, DeviceType, PeriodPreset } from "@/types/domain";
import type { Database } from "@/types/database.types";

type ClickRow = Database["public"]["Tables"]["clicks"]["Row"];

function toClickDTO(row: ClickRow & { link_slug: string }): ClickDTO {
  return {
    id: row.id,
    linkId: row.link_id,
    linkSlug: row.link_slug,
    referer: row.referer,
    userAgent: row.user_agent,
    device: (row.device as DeviceType) ?? "unknown",
    browser: row.browser,
    os: row.os,
    country: row.country,
    ip: row.ip,
    createdAt: row.created_at,
  };
}

/** Início do dia (00:00) em America/Sao_Paulo, convertido para um instante UTC real. */
function startOfDayInAppTimezone(date: Date): Date {
  const zoned = toZonedTime(date, APP_TIMEZONE);
  const startZoned = startOfDay(zoned);
  return fromZonedTime(startZoned, APP_TIMEZONE);
}

export function getPeriodRange(preset: PeriodPreset, custom?: DateRange): DateRange {
  const now = new Date();

  if (preset === "custom" && custom) return custom;

  if (preset === "today") {
    return { from: startOfDayInAppTimezone(now), to: now };
  }

  const days = preset === "7d" ? 7 : preset === "30d" ? 30 : 90;
  return { from: subDays(now, days), to: now };
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const now = new Date();
  const todayStart = startOfDayInAppTimezone(now);
  const yesterdayStart = startOfDayInAppTimezone(subDays(now, 1));

  const [totalLinks, totalClicks, clicksToday, clicksYesterday, recentClicksRows, topLinksRows] =
    await Promise.all([
      countLinks(),
      countClicks(),
      countClicksInRange(todayStart, addDays(todayStart, 1)),
      countClicksInRange(yesterdayStart, todayStart),
      listRecentClicks(10),
      listTopLinks(5),
    ]);

  return {
    totalLinks,
    totalClicks,
    clicksToday,
    clicksYesterday,
    recentClicks: recentClicksRows.map(toClickDTO),
    topLinks: topLinksRows.map((link) => ({
      id: link.id,
      slug: link.slug,
      destinationUrl: link.destination_url,
      clickCount: link.click_count,
    })),
  };
}

export interface ClicksPageResult {
  rows: ClickDTO[];
  total: number;
}

export async function getClicksInRange(filter: ClicksFilter): Promise<ClicksPageResult> {
  const { rows, total } = await listClickRows(filter);
  return { rows: rows.map(toClickDTO), total };
}

export interface TimeSeriesPoint {
  date: string;
  count: number;
}

export interface BreakdownItem {
  label: string;
  count: number;
}

export interface StatsBreakdown {
  timeSeries: TimeSeriesPoint[];
  byDevice: BreakdownItem[];
  byCountry: BreakdownItem[];
}

export async function getStatsBreakdown(range: DateRange, linkId?: string): Promise<StatsBreakdown> {
  const rows = await listClicksForAggregation(range.from, range.to, linkId);

  const byDay = new Map<string, number>();
  const byDevice = new Map<string, number>();
  const byCountry = new Map<string, number>();

  for (const row of rows) {
    const day = format(toZonedTime(new Date(row.created_at), APP_TIMEZONE), "dd/MM");
    byDay.set(day, (byDay.get(day) ?? 0) + 1);

    const device = row.device ?? "unknown";
    byDevice.set(device, (byDevice.get(device) ?? 0) + 1);

    const country = row.country ?? "Desconhecido";
    byCountry.set(country, (byCountry.get(country) ?? 0) + 1);
  }

  const timeSeries = Array.from(byDay.entries())
    .map(([date, count]) => ({ date, count }))
    .reverse();

  const byDeviceList = Array.from(byDevice.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);

  const byCountryList = Array.from(byCountry.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  return { timeSeries, byDevice: byDeviceList, byCountry: byCountryList };
}
