import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Bỏ qua /api, file nội bộ của Next.js và mọi file tĩnh (có dấu chấm trong path)
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
