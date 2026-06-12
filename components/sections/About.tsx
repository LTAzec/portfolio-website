import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { site } from "@/data/site";

/**
 * About section — premium editorial intro to the person behind AZEC Digital.
 *
 * Two-column layout on desktop:
 *   LEFT  — section heading + intro paragraphs + "read more" link to /about
 *   RIGHT — numbered "approach" list (the studio's working principles)
 *
 * Acts as a preview on the home page — the full profile, tooling and
 * experience timeline live on the dedicated /about page.
 */
const approachKeys = ["practical", "clean", "endToEnd", "iterate"] as const;

export function About() {
  const t = useTranslations("about");

  return (
    <section id="about" className="py-24 sm:py-32 lg:py-40">
      <Container>
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-16">
          {/* Left — heading + intro */}
          <div className="lg:col-span-7">
            <SectionHeading
              index="02"
              eyebrow={t("eyebrow")}
              title={t("title")}
              subtitle={t("subtitle", { founder: site.founder })}
            />

            <div className="mt-10 max-w-xl space-y-5 text-base leading-relaxed text-muted">
              <p>{t("p1")}</p>
              <p>{t("p2")}</p>
            </div>

            <div className="mt-10">
              <Link
                href="/about"
                className="group inline-flex items-center gap-1.5 text-[14px] font-medium text-foreground transition-colors hover:text-accent"
              >
                {t("readMore")}
                <span
                  aria-hidden
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                >
                  →
                </span>
              </Link>
            </div>
          </div>

          {/* Right — approach list */}
          <div className="lg:col-span-5">
            <span className="text-eyebrow flex items-center gap-3">
              <span className="text-accent">A</span>
              <span className="h-px w-6 bg-faint" />
              <span>{t("approachEyebrow")}</span>
            </span>

            <ul className="mt-7 divide-y divide-border border-y border-border">
              {approachKeys.map((key, i) => (
                <li
                  key={key}
                  className="grid grid-cols-[auto_1fr] gap-x-5 py-5"
                >
                  <span className="font-mono text-[11px] text-faint">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <div className="text-[14px] font-medium text-foreground">
                      {t(`approach.${key}Title`)}
                    </div>
                    <p className="mt-1 text-[13px] leading-relaxed text-muted">
                      {t(`approach.${key}Desc`)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
