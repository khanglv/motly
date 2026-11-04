"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { apiFetch } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import type { ApiList, GalleryImage } from "@/types";

export function useGallery() {
  const locale = useLocale();
  return useQuery({
    queryKey: queryKeys.gallery(locale),
    queryFn: ({ signal }) =>
      apiFetch<ApiList<GalleryImage>>("/api/gallery", { locale }, { signal }).then((r) => r.data),
  });
}
