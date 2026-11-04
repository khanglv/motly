import { isLocale } from "./data-service";
import type { Locale } from "@/types";

const CACHE_HEADERS = {
  "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
};

export function jsonList<T>(data: T[]) {
  return Response.json({ data }, { headers: CACHE_HEADERS });
}

export function badRequest(message: string) {
  return Response.json({ error: message }, { status: 400, headers: { "Cache-Control": "no-store" } });
}

/**
 * Đọc ?locale=, mặc định "vi". Trả về null nếu giá trị không hợp lệ.
 */
export function parseLocale(searchParams: URLSearchParams): Locale | null {
  const value = searchParams.get("locale") ?? "vi";
  return isLocale(value) ? value : null;
}
