"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link, usePathname } from "@/i18n/navigation";
import { AzecWordmark } from "@/components/brand/AzecWordmark";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { navItems } from "@/data/nav";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";
import { isNavItemActive } from "./nav-active";

/**
 * Mobile menu — hamburger trigger in the navbar pill + a dropdown panel
 * portaled to <body> when open.
 *
 * The panel docks to the top of the viewport (fixed inset-x-0 top-0),
 * takes its natural height from its content, and hangs over the page
 * below with a hairline border + soft drop shadow. A transparent
 * backdrop sits behind it for click-outside-to-close, while leaving the
 * page visible below the panel.
 *
 * Why the portal: the navbar pill has `backdrop-blur-md`, which creates
 * a CSS containing block. Anything `fixed`-positioned inside it gets
 * anchored to the pill rather than the viewport. Portaling to
 * `document.body` puts the overlay outside that constraint.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const pathname = usePathname();

  // Portals need document.body which is only there client-side.
  useEffect(() => {
    setMounted(true);
  }, []);

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

  const overlay = (
    <>
      {/* Click-outside backdrop — transparent, sits behind the panel.
         Catches taps on the page below the dropdown so the menu closes
         naturally when the visitor reaches "outside". */}
      <div
        aria-hidden
        onClick={() => setOpen(false)}
        className={cn(
          "fixed inset-0 z-[998] transition-opacity duration-300 md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      {/* Dropdown panel — natural height, top-docked, opaque. */}
      <div
        aria-hidden={!open}
        className={cn(
          "fixed inset-x-0 top-0 z-[999] flex flex-col border-b border-white/10 bg-[#05070B] shadow-[0_18px_40px_-12px_rgba(0,0,0,0.7)] transition-opacity duration-300 md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        {/* Top bar — 64px, wordmark left, close button right. */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-5">
          <Link
            href="/"
            aria-label={`${site.name} — home`}
            onClick={() => setOpen(false)}
            className="flex items-center text-foreground transition-opacity hover:opacity-80"
          >
            <AzecWordmark className="h-6 w-auto" />
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label={tc("closeMenu")}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-foreground transition-colors hover:bg-white/[0.07]"
          >
            <span className="sr-only">{tc("closeMenu")}</span>
            <Hamburger open={true} />
          </button>
        </div>

        {/* Menu content — padding-based spacing, no flex-1, no
           justify-center. Panel height comes from this content. */}
        <nav
          aria-label="Mobile primary"
          className="flex flex-col items-center px-8 pt-6 pb-8"
        >
          <ul className="flex flex-col items-center gap-4">
            {navItems.map((item) => {
              const active = isNavItemActive(pathname, item.href);
              return (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "text-[22px] font-medium leading-[1.15] tracking-tight transition-colors",
                      active
                        ? "text-accent"
                        : "text-foreground hover:text-accent",
                    )}
                  >
                    {t(item.key)}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-6 flex flex-col items-center gap-3">
            <span aria-hidden className="h-px w-12 bg-white/10" />
            <LocaleSwitcher className="text-[13px]" />
          </div>
        </nav>
      </div>
    </>
  );

  return (
    <div className="md:hidden">
      {/* Trigger — stays in the navbar pill. */}
      <button
        type="button"
        aria-label={open ? tc("closeMenu") : tc("openMenu")}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-foreground transition-colors hover:bg-surface-strong"
      >
        <span className="sr-only">{tc("toggleNav")}</span>
        <Hamburger open={open} />
      </button>

      {/* Backdrop + dropdown panel portaled to <body> so they escape any
         ancestor that establishes a containing block (notably the
         navbar pill's backdrop-blur). */}
      {mounted && createPortal(overlay, document.body)}
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
