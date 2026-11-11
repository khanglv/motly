"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { apiFetch } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import type { ApiList, Review } from "@/types";

export function useReviews() {
  const locale = useLocale();
  return useQuery({
    queryKey: queryKeys.reviews(locale),
    queryFn: ({ signal }) => apiFetch<ApiList<Review>>("/api/reviews", { locale }, { signal }).then((r) => r.data),
  });
}
