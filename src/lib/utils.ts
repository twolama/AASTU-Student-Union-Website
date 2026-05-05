import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind CSS class names safely, resolving conflicts.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number with commas (e.g. 12450 → "12,450")
 */
export function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}

/**
 * Clamps a string to maxLength characters + "…"
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength).trimEnd() + "…";
}
/**
 * Strips HTML tags from a string using regex.
 */
export function stripHtml(html: string): string {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, "");
}

/**
 * Resolves a media URL from the API.
 * If the URL is relative (starts with /media/), it prefixes it with /api/proxy.
 */
export function resolveMediaUrl(value?: string | null) {
  if (!value) {
    return "";
  }

  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  if (value.startsWith("/api/proxy/")) {
    return value;
  }

  if (value.startsWith("/")) {
    return `/api/proxy${value}`;
  }

  return `/api/proxy/${value}`;
}
