import Link from "next/link";
import { Container } from "@/components/layout/Container";

interface CTASectionProps {
  /** Small editorial label above the title. */
  eyebrow?: string;
  /** Title; wrap accent words in `{...}` for the underline. */
  title?: string;
  /** Optional supporting sentence. */
  subtitle?: string;
  /** Primary CTA label + href. */
  primary?: { label: string; href: string };
  /** Optional secondary text link. */
  secondary?: { label: string; href: string };
}

/**
 * Reusable bottom-of-page CTA section. Hairline-separated, restrained,
 * no marketing flourish — just a clean offer-and-action block.
 */
export function CTASection({
  eyebrow = "Open for work",
  title = "Have a project in mind?",
  subtitle,
  primary = { label: "Get in touch", href: "/contact" },
  secondary = { label: "View work", href: "/projects" },
}: CTASectionProps) {
  return (
    <section className="border-t border-border py-20 sm:py-24 lg:py-28">
      <Container>
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <span className="text-eyebrow flex items-center gap-3">
              <span className="text-accent">●</span>
              <span>{eyebrow}</span>
            </span>
            <h2 className="mt-5 text-balance text-3xl font-medium leading-[1.1] tracking-[-0.025em] text-foreground sm:text-4xl lg:text-[2.75rem]">
              {renderTitle(title)}
            </h2>
            {subtitle && (
              <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-muted">
                {subtitle}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link
              href={primary.href}
              className="group inline-flex h-12 items-center gap-2 rounded-full bg-accent px-6 text-[14px] font-medium text-white shadow-[0_0_0_1px_rgba(45,123,255,0.45),0_10px_30px_-12px_rgba(45,123,255,0.6)] transition-all hover:bg-accent-strong hover:shadow-[0_0_0_1px_rgba(45,123,255,0.7),0_14px_36px_-8px_rgba(45,123,255,0.75)]"
            >
              {primary.label}
              <span
                aria-hidden
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              >
                →
              </span>
            </Link>
            {secondary && (
              <Link
                href={secondary.href}
                className="group inline-flex items-center gap-1.5 text-[14px] font-medium text-foreground transition-colors hover:text-accent"
              >
                {secondary.label}
                <span
                  aria-hidden
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                >
                  →
                </span>
              </Link>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

function renderTitle(title: string) {
  const parts = title.split(/(\{[^}]+\})/g);
  return parts.map((part, i) => {
    if (part.startsWith("{") && part.endsWith("}")) {
      return (
        <span key={i} className="accent-underline">
          {part.slice(1, -1)}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}
