import { Container } from "./Container";
import { MobileNav } from "./MobileNav";
import { AzecWordmark } from "@/components/brand/AzecWordmark";
import { navLinks } from "@/data/nav";
import { site } from "@/data/site";

/**
 * Editorial sticky navigation.
 *
 * Left  — the real AZEC wordmark (currentColor white + #2D7BFF E-bar)
 * Mid   — text-only nav links, generous breathing room
 * Right — a hairline-outlined "Get in touch" link with a subtle
 *         accent-tinted hover, plus the mobile trigger
 */
export function Navbar() {
  return (
    <header className="sticky top-0 z-30 w-full">
      <div className="absolute inset-x-0 top-0 h-full border-b border-border/60 bg-background/70 backdrop-blur-md" />

      <Container as="div" className="relative flex h-16 items-center justify-between">
        <a
          href="#top"
          className="flex items-center text-foreground transition-opacity hover:opacity-80"
          aria-label={`${site.name} — home`}
        >
          <AzecWordmark className="h-[22px] w-auto" />
        </a>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-10">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-[13px] text-muted transition-colors hover:text-foreground"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#contact"
            className="group hidden items-center gap-1.5 rounded-full border border-border-strong px-3.5 py-1.5 text-[13px] font-medium text-foreground transition-colors hover:border-accent/60 hover:bg-accent-soft md:inline-flex"
          >
            Get in touch
            <span
              aria-hidden
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            >
              →
            </span>
          </a>
          <MobileNav />
        </div>
      </Container>
    </header>
  );
}
