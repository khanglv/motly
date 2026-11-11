import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Bỏ qua /api, /cms-api (proxy tới API NestJS), /admin (CMS), file nội bộ của Next.js và mọi file tĩnh (có dấu chấm trong path)
  matcher: "/((?!api|cms-api|admin|_next|_vercel|.*\\..*).*)",
};
