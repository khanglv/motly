import { badRequest, jsonList, parseLocale } from "@/lib/api-response";
import { getMenu, isMenuFilter } from "@/lib/data-service";
import { MENU_FILTERS } from "@/types";

// GET /api/menu?locale=vi|en&category=all|matcha|coffee|bakery
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const locale = parseLocale(searchParams);
  if (!locale) return badRequest("Invalid locale. Use 'vi' or 'en'.");

  const category = searchParams.get("category") ?? "all";
  if (!isMenuFilter(category)) {
    return badRequest(`Invalid category. Use one of: ${MENU_FILTERS.join(", ")}.`);
  }

  return jsonList(getMenu(locale, category));
}
