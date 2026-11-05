import { badRequest, jsonList, parseLocale } from "@/lib/api-response";
import { getFeatured } from "@/lib/data-service";

// GET /api/featured?locale=vi|en
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = parseLocale(searchParams);
  if (!locale) return badRequest("Invalid locale. Use 'vi' or 'en'.");

  return jsonList(getFeatured(locale));
}
