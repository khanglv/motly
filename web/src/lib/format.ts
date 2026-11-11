import type { Locale } from "@/types";

const priceFormatters: Record<Locale, Intl.NumberFormat> = {
  vi: new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }),
  en: new Intl.NumberFormat("en-US", { style: "currency", currency: "VND", maximumFractionDigits: 0 }),
};

export function formatPrice(price: number, locale: Locale) {
  return priceFormatters[locale].format(price);
}

/** Giá gọn cho bảng menu: 45.000 ₫ → "45k" */
export function formatPriceShort(price: number) {
  return price % 1000 === 0 ? `${price / 1000}k` : String(price);
}
