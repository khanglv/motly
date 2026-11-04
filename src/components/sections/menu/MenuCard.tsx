"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import clsx from "clsx";
import type { MenuItem } from "@/types";

const priceFormatters = {
  vi: new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }),
  en: new Intl.NumberFormat("en-US", { style: "currency", currency: "VND", maximumFractionDigits: 0 }),
};

export function formatPrice(price: number, locale: "vi" | "en") {
  return priceFormatters[locale].format(price);
}

export function MenuCard({ item }: { item: MenuItem }) {
  const t = useTranslations("menu.tags");
  const locale = useLocale();

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-card bg-cream shadow-[0_1px_0_rgb(47_61_36/0.06)] ring-1 ring-matcha-100 transition-shadow hover:shadow-soft">
      <div className="relative aspect-square overflow-hidden bg-matcha-100">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="(min-width: 1024px) 18rem, (min-width: 640px) 45vw, 90vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
        {item.tags.length > 0 && (
          <ul className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {item.tags.map((tag) => (
              <li
                key={tag}
                className={clsx(
                  "rounded-full px-2.5 py-1 text-[11px] font-medium tracking-wide",
                  tag === "signature" && "bg-matcha-900 text-cream",
                  tag === "best-seller" && "bg-cream text-matcha-900",
                  tag === "new" && "bg-sakura text-ink",
                )}
              >
                {t(tag)}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-lg leading-snug">{item.name}</h3>
          <p className="shrink-0 font-medium text-matcha-700">{formatPrice(item.price, locale)}</p>
        </div>
        <p className="text-sm leading-relaxed text-ink-soft">{item.description}</p>
      </div>
    </article>
  );
}
