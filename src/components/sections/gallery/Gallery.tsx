"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import clsx from "clsx";
import { useGallery } from "@/hooks/useGallery";
import { useUIStore } from "@/store/ui-store";
import { ErrorState } from "@/components/ui/ErrorState";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import decor from "@/styles/decor.module.scss";
import { Lightbox } from "./Lightbox";

export function Gallery() {
  const t = useTranslations("gallery");
  const { data, isPending, isError, refetch } = useGallery();
  const openLightbox = useUIStore((s) => s.openLightbox);

  return (
    <section id="gallery" aria-labelledby="gallery-title" className="section bg-cream-dark/40">
      <div className="container-page">
        <Reveal>
          <SectionHeading id="gallery-title" eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
        </Reveal>

        <div className="mt-14">
          {isPending ? (
            <div className="columns-2 gap-4 md:columns-3" role="status" aria-live="polite">
              {Array.from({ length: 6 }, (_, i) => (
                <div
                  key={i}
                  className={clsx(decor.shimmer, "mb-4 break-inside-avoid rounded-2xl", i % 2 ? "h-48" : "h-72")}
                />
              ))}
            </div>
          ) : isError ? (
            <ErrorState message={t("error")} retryLabel={t("retry")} onRetry={() => refetch()} />
          ) : (
            <>
              <ul className="columns-2 gap-4 md:columns-3">
                {data.map((img, i) => (
                  <li key={img.id} className="mb-4 break-inside-avoid">
                    <button
                      type="button"
                      onClick={() => openLightbox(i)}
                      aria-label={t("open", { alt: img.alt })}
                      aria-haspopup="dialog"
                      className="group block w-full overflow-hidden rounded-2xl"
                    >
                      <Image
                        src={img.src}
                        alt={img.alt}
                        width={img.width}
                        height={img.height}
                        sizes="(min-width: 768px) 33vw, 50vw"
                        className="h-auto w-full transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                      />
                    </button>
                  </li>
                ))}
              </ul>
              <Lightbox images={data} />
            </>
          )}
        </div>
      </div>
    </section>
  );
}
