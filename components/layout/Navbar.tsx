import Link from "next/link";
import { AzecDigitalLockup } from "@/components/brand/AzecDigitalLockup";
import { MobileNav } from "./MobileNav";
import { navLinks } from "@/data/nav";
import { site } from "@/data/site";

/**
 * Floating navigation pill — product-studio feel.
 *
 *   - Fixed, centred, hairline-bordered, soft backdrop blur
 *   - Left: official AZEC Digital lockup (wordmark + DIGITAL with
 *           flanking hairlines) — rendered inline at navbar scale
 *   - Centre: mono uppercase nav links (real page routes)
 *   - Right: mobile hamburger only; width-balanced spacer on desktop
 *
 * Mobile shows a slightly more compact lockup (h-9) but the same
 * structure — no fallback icon, no separate brand variant.
 */
export function Navbar() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-3 z-30 px-4 sm:top-4">
      <div className="pointer-events-auto mx-auto w-full max-w-[760px]">
        <div className="ring-highlight relative flex h-12 items-center justify-between rounded-full border border-border bg-background/70 pr-2 pl-3.5 shadow-[0_8px_28px_-14px_rgba(0,0,0,0.6)] backdrop-blur-md">
          {/* Brand — AZEC Digital lockup */}
          <Link
            href="/"
            aria-label={`${site.name} — home`}
            className="flex items-center text-foreground transition-opacity hover:opacity-80"
          >
            <AzecDigitalLockup className="h-9 w-auto sm:h-10" />
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
