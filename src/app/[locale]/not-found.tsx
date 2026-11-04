import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function LocaleNotFound() {
  const t = useTranslations("notFound");

  return (
    <section className="container-page flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-4 text-3xl sm:text-4xl">{t("title")}</h1>
      <p className="mt-4 max-w-md text-ink-soft">{t("description")}</p>
      <Link href="/" className="btn-primary mt-8">
        {t("back")}
      </Link>
    </section>
  );
}
