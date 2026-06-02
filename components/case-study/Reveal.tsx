"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  /** Optional delay in ms — handy for staggered groups. */
  delay?: number;
  /** Tailwind classes for the wrapping div. */
  className?: string;
  /** Pixels to translate upward while hidden. Default 10. */
  rise?: number;
}

/**
 * Tiny IntersectionObserver-backed reveal. Fades from opacity 0 → 1 and
 * translates `rise` pixels (default 10) upward to its resting position.
 *
 *   - No external library; renders a plain div.
 *   - Triggers once; never reverses on scroll-out.
 *   - Falls back to instant-visible if prefers-reduced-motion is set
 *     (handled via the lazy initial state below).
 */
export function Reveal({
  children,
  delay = 0,
  className,
  rise = 10,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  // Lazy initial state: reduced-motion users start as already-visible, which
  // means the effect below never has to flip state for that case (avoids the
  // `setState in effect` lint and the extra render pass).
  const [visible, setVisible] = useState(() => prefersReducedMotion());

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    // Reduced-motion: nothing to observe — initial state already shows it.
    if (prefersReducedMotion()) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const style: CSSProperties = {
    transitionDelay: delay ? `${delay}ms` : undefined,
    transform: visible ? "translate3d(0, 0, 0)" : `translate3d(0, ${rise}px, 0)`,
  };

  return (
    <div
      ref={ref}
      style={style}
      className={cn(
        "transition-[opacity,transform] duration-700 ease-out will-change-[opacity,transform]",
        visible ? "opacity-100" : "opacity-0",
        className,
      )}
    >
      {children}
    </div>
  );
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}
