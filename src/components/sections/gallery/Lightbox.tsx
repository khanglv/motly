"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { KeyboardEvent } from "react";
import { useUIStore } from "@/store/ui-store";
import type { GalleryImage } from "@/types";
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from "@/components/ui/icons";

export function Lightbox({ images }: { images: GalleryImage[] }) {
  const t = useTranslations("gallery");
  const reduceMotion = useReducedMotion();
  const index = useUIStore((s) => s.lightboxIndex);
  const close = useUIStore((s) => s.closeLightbox);
  const next = useUIStore((s) => s.nextImage);
  const prev = useUIStore((s) => s.prevImage);

  const total = images.length;
  const open = index !== null && index < total;
  const image = open ? images[index] : null;

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      next(total);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev(total);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && close()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/85 backdrop-blur-sm" />
        <Dialog.Content
          aria-describedby={undefined}
          onKeyDown={onKeyDown}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 outline-none sm:p-10"
        >
          <Dialog.Title className="sr-only">{t("dialogTitle")}</Dialog.Title>

          <Dialog.Close
            className="absolute top-4 right-4 rounded-full bg-cream/10 p-3 text-cream hover:bg-cream/20"
            aria-label={t("close")}
          >
            <CloseIcon width={22} height={22} />
          </Dialog.Close>

          {image && (
            <figure className="flex max-h-full w-full max-w-5xl flex-col items-center">
              <AnimatePresence mode="wait" initial={false}>
                <m.div
                  key={image.id}
                  initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduceMotion ? undefined : { opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.25 }}
                  className="relative flex max-h-[75vh] w-full items-center justify-center"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    sizes="(min-width: 1024px) 64rem, 100vw"
                    className="max-h-[75vh] w-auto rounded-xl object-contain"
                  />
                </m.div>
              </AnimatePresence>
              <figcaption className="mt-4 flex items-center gap-3 text-sm text-cream/90">
                <span>{image.alt}</span>
                <span aria-hidden className="text-cream/50">
                  ·
                </span>
                <span data-testid="lightbox-counter">
                  {t("counter", { current: (index ?? 0) + 1, total })}
                </span>
              </figcaption>
            </figure>
          )}

          {total > 1 && (
            <>
              <button
                type="button"
                onClick={() => prev(total)}
                aria-label={t("prev")}
                className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-cream/10 p-3 text-cream hover:bg-cream/20 sm:left-6"
              >
                <ChevronLeftIcon width={24} height={24} />
              </button>
              <button
                type="button"
                onClick={() => next(total)}
                aria-label={t("next")}
                className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-cream/10 p-3 text-cream hover:bg-cream/20 sm:right-6"
              >
                <ChevronRightIcon width={24} height={24} />
              </button>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
