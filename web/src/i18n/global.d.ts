import type messages from "../../messages/vi.json";
import type { routing } from "./routing";

// Type-safe cho key dịch và locale của next-intl
declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages;
  }
}
