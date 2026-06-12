"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { navItems } from "@/data/nav";
import { cn } from "@/lib/utils";

/**
 * Mobile menu trigger + full-screen overlay.
 * Lives inside <Navbar /> and only renders on small screens. The language
 * switcher sits at the bottom of the overlay so it's reachable on mobile.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("nav");
  const tc = useTranslations("common");

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? tc("closeMenu") : tc("openMenu")}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="relative z-50 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-foreground transition-colors hover:bg-surface-strong"
      >
        <span className="sr-only">{tc("toggleNav")}</span>
        <Hamburger open={open} />
      </button>

      <div
        className={cn(
          "fixed inset-0 z-40 transition-opacity duration-300",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <div
          className="absolute inset-0 bg-background/90 backdrop-blur-xl"
          onClick={() => setOpen(false)}
        />

        <nav className="relative flex h-full flex-col items-center justify-center gap-8 px-8">
          <ul className="flex flex-col items-center gap-6">
            {navItems.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="text-2xl font-medium tracking-tight text-foreground transition-colors hover:text-accent"
                >
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>

          {/* Language switcher — generous tap targets on mobile */}
          <LocaleSwitcher className="mt-2 text-[13px]" />
        </nav>
      </div>
    </div>
  );
}

function Hamburger({ open }: { open: boolean }) {
  return (
    <div className="relative h-3.5 w-5">
      <span
        className={cn(
          "absolute left-0 block h-px w-5 bg-current transition-transform duration-300",
          open ? "top-1.5 rotate-45" : "top-0",
        )}
      />
      <span
        className={cn(
          "absolute top-1.5 left-0 block h-px w-5 bg-current transition-opacity duration-200",
          open ? "opacity-0" : "opacity-100",
        )}
      />
      <span
        className={cn(
          "absolute left-0 block h-px w-5 bg-current transition-transform duration-300",
          open ? "top-1.5 -rotate-45" : "top-3",
        )}
      />
    </div>
  );
}
