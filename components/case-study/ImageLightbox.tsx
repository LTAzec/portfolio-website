"use client";

import { useEffect } from "react";
import type { EditorialImageRef } from "@/lib/types";

interface ImageLightboxProps {
  images: EditorialImageRef[];
  index: number;
  onClose: () => void;
  onChange: (idx: number) => void;
}

/**
 * Fullscreen image lightbox. Used by both InternalProjectsShowcase
 * (AZ Turnhout tab navigator) and MediaShowcase (Jansen / single-folder
 * case studies). Pure presentational client component — caller manages
 * open state, index, and the image list.
 *
 *   - ESC closes, ← / → navigate (with wrap-around)
 *   - Backdrop click closes
 *   - Body scroll is locked while open
 *   - Subtle fade + scale entrance via scoped keyframes
 *   - Respects prefers-reduced-motion
 */
export function ImageLightbox({
  images,
  index,
  onClose,
  onChange,
}: ImageLightboxProps) {
  // Lock body scroll while the lightbox is open
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowLeft" && images.length > 1) {
        e.preventDefault();
        onChange((index - 1 + images.length) % images.length);
      } else if (e.key === "ArrowRight" && images.length > 1) {
        e.preventDefault();
        onChange((index + 1) % images.length);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [index, images.length, onClose, onChange]);

  const current = images[index];
  if (!current) return null;

  const hasMultiple = images.length > 1;
  const prev = () => onChange((index - 1 + images.length) % images.length);
  const next = () => onChange((index + 1) % images.length);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image preview"
      className="lightbox-root fixed inset-0 z-50 flex items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Backdrop */}
      <div
        aria-hidden
        className="lightbox-backdrop bg-background/85 absolute inset-0 backdrop-blur-xl"
        onClick={onClose}
      />

      {/* Image */}
      <div className="lightbox-image relative max-h-[90vh] max-w-[92vw] sm:max-w-[88vw]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={current.src}
          alt={current.alt}
          className="block h-auto max-h-[90vh] w-auto max-w-[92vw] rounded-xl shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)] sm:max-w-[88vw]"
        />
      </div>

      {/* Close */}
      <button
        type="button"
        aria-label="Close preview"
        onClick={onClose}
        className="ring-highlight bg-charcoal-strong/80 border-border-strong absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border text-foreground backdrop-blur-md transition-colors hover:border-accent/60 hover:text-accent sm:top-6 sm:right-6"
      >
        <span aria-hidden className="font-mono text-base leading-none">
          ✕
        </span>
      </button>

      {/* Prev / Next */}
      {hasMultiple && (
        <>
          <button
            type="button"
            aria-label="Previous image"
            onClick={prev}
            className="ring-highlight bg-charcoal-strong/80 border-border-strong absolute top-1/2 left-3 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border text-foreground backdrop-blur-md transition-colors hover:border-accent/60 hover:text-accent sm:left-6"
          >
            <span aria-hidden className="font-mono text-lg leading-none">
              ←
            </span>
          </button>
          <button
            type="button"
            aria-label="Next image"
            onClick={next}
            className="ring-highlight bg-charcoal-strong/80 border-border-strong absolute top-1/2 right-3 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border text-foreground backdrop-blur-md transition-colors hover:border-accent/60 hover:text-accent sm:right-6"
          >
            <span aria-hidden className="font-mono text-lg leading-none">
              →
            </span>
          </button>

          {/* Counter */}
          <div className="text-eyebrow absolute bottom-5 left-1/2 z-10 -translate-x-1/2 text-[10px] text-foreground/80 sm:bottom-7">
            <span className="text-accent">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="text-faint"> / </span>
            <span>{String(images.length).padStart(2, "0")}</span>
          </div>
        </>
      )}

      {/* Caption */}
      {current.caption && (
        <div className="absolute bottom-14 left-1/2 z-10 max-w-[80vw] -translate-x-1/2 text-center sm:bottom-16">
          <p className="text-eyebrow text-[10px] tracking-[0.08em] text-foreground/70">
            {current.caption}
          </p>
        </div>
      )}

      {/* Scoped keyframes — fade + soft scale entrance */}
      <style>{`
        .lightbox-root .lightbox-backdrop {
          animation: lightboxBackdrop 240ms ease-out both;
        }
        .lightbox-root .lightbox-image {
          animation: lightboxImage 320ms cubic-bezier(0.2, 0.7, 0.2, 1) both;
        }
        @keyframes lightboxBackdrop {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes lightboxImage {
          from { opacity: 0; transform: scale(0.97); }
          to   { opacity: 1; transform: scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .lightbox-root .lightbox-backdrop,
          .lightbox-root .lightbox-image {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
