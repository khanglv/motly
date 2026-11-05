"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { apiFetch } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import type { ApiList, FeaturedItem } from "@/types";

export function useFeatured() {
  const locale = useLocale();
  return useQuery({
    queryKey: queryKeys.featured(locale),
    queryFn: ({ signal }) =>
      apiFetch<ApiList<FeaturedItem>>("/api/featured", { locale }, { signal }).then((r) => r.data),
  });
}
