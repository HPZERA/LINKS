import { UAParser } from "ua-parser-js";
import type { DeviceType } from "@/types/domain";

export interface ParsedUserAgent {
  device: DeviceType;
  browser: string | null;
  os: string | null;
}

export function parseUserAgent(userAgent: string | null): ParsedUserAgent {
  if (!userAgent) return { device: "unknown", browser: null, os: null };

  const result = new UAParser(userAgent).getResult();
  const deviceType = result.device.type;

  const device: DeviceType =
    deviceType === "mobile" ? "mobile" : deviceType === "tablet" ? "tablet" : "desktop";

  return {
    device,
    browser: result.browser.name ?? null,
    os: result.os.name ?? null,
  };
}
