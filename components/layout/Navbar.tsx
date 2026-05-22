import Link from "next/link";
import { AzecIcon } from "@/components/brand/AzecIcon";
import { MobileNav } from "./MobileNav";
import { navLinks } from "@/data/nav";
import { site } from "@/data/site";

/**
 * Floating navigation pill — product-studio feel.
 *   - Fixed, centred, hairline-bordered, soft backdrop blur
 *   - Left: AZEC icon as the app-mark (Link to home)
 *   - Center: mono uppercase nav links (real page routes)
 *   - Right: mobile hamburger only; width-balanced spacer on desktop
 */
export function Navbar() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-3 z-30 px-4 sm:top-4">
      <div className="pointer-events-auto mx-auto w-full max-w-[720px]">
        <div className="ring-highlight relative flex h-12 items-center justify-between rounded-full border border-border bg-background/70 pr-2 pl-2.5 shadow-[0_8px_28px_-14px_rgba(0,0,0,0.6)] backdrop-blur-md">
          <Link
            href="/"
            aria-label={`${site.name} — home`}
            className="flex items-center rounded-full p-1 text-foreground transition-opacity hover:opacity-80"
          >
            <AzecIcon className="h-7 w-7" />
          </Link>

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

          <div className="flex min-w-[36px] items-center justify-end">
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
}
