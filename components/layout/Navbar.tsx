import Link from "next/link";
import { AzecDigitalLockup } from "@/components/brand/AzecDigitalLockup";
import { AzecWordmark } from "@/components/brand/AzecWordmark";
import { MobileNav } from "./MobileNav";
import { navLinks } from "@/data/nav";
import { site } from "@/data/site";

/**
 * Floating navigation pill — product-studio feel.
 *
 *   - Fixed, centred, hairline-bordered, soft backdrop blur
 *   - Left brand:
 *       · mobile  → compact <AzecWordmark /> (AZEC only, no DIGITAL rule)
 *       · ≥ sm    → full <AzecDigitalLockup /> with hairlines & DIGITAL
 *   - Centre: mono uppercase nav links (real page routes)
 *   - Right: mobile hamburger only; width-balanced spacer on desktop
 *
 * The mobile swap keeps the pill from feeling cramped while preserving
 * the premium AZEC type on every breakpoint.
 */
export function Navbar() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-3 z-30 px-4 sm:top-4">
      <div className="pointer-events-auto mx-auto w-full max-w-[760px]">
        <div className="ring-highlight relative flex h-12 items-center justify-between rounded-full border border-border bg-background/70 pr-2 pl-3 shadow-[0_8px_28px_-14px_rgba(0,0,0,0.6)] backdrop-blur-md sm:pl-3.5">
          {/* Brand — wordmark on mobile, full lockup from sm up */}
          <Link
            href="/"
            aria-label={`${site.name} — home`}
            className="flex items-center text-foreground transition-opacity hover:opacity-80"
          >
            <AzecWordmark className="h-6 w-auto sm:hidden" />
            <AzecDigitalLockup className="hidden h-9 w-auto sm:block md:h-10" />
          </Link>

          {/* Primary nav — desktop only, mono caps */}
          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-6">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right slot — width-balanced spacer + mobile trigger */}
          <div className="flex min-w-[36px] items-center justify-end">
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
}
