import Link from "next/link";
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
const approach = [
  {
    title: "Practical first",
    description:
      "Solve the real problem first. Polish, refinement and visual craft come after the thing actually works.",
  },
  {
    title: "Clean execution",
    description:
      "Strong typography, restrained motion, focused interactions. Details compound — the small ones decide whether software feels professional.",
  },
  {
    title: "Built end-to-end",
    description:
      "From data layer to UX, shipped as one piece. No hand-offs in the middle, no rough edges between parts.",
  },
  {
    title: "Iterate small",
    description:
      "Ship the smallest valuable thing, then refine from real feedback. Speed of feedback is the single biggest predictor of quality.",
  },
];

export function About() {
  return (
    <section id="about" className="py-24 sm:py-32 lg:py-40">
      <Container>
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-16">
          {/* Left — heading + intro */}
          <div className="lg:col-span-7">
            <SectionHeading
              index="02"
              eyebrow="About"
              title="A studio of {one}, building practical software."
              subtitle={`Run by ${site.founder} — a developer focused on digital products, internal tooling and AI-driven experiments. Background in full-stack engineering with a strong focus on product, usability and clean execution.`}
            />

            <div className="mt-10 max-w-xl space-y-5 text-base leading-relaxed text-muted">
              <p>
                Most projects start as practical problems. An internal team
                needs better tooling. A small business wants a polished web
                presence. An experiment wants to become a real product. The
                studio takes those briefs and ships them end-to-end.
              </p>
              <p>
                The work spans web applications, internal interfaces, automation
                tools and AI-driven side projects. Different domains, same
                approach — build the thing that actually solves the problem,
                make it feel professional, ship it.
              </p>
            </div>

            <div className="mt-10">
              <Link
                href="/about"
                className="group inline-flex items-center gap-1.5 text-[14px] font-medium text-foreground transition-colors hover:text-accent"
              >
                Read full profile
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
              <span>Approach</span>
            </span>

            <ul className="mt-7 divide-y divide-border border-y border-border">
              {approach.map((item, i) => (
                <li
                  key={item.title}
                  className="grid grid-cols-[auto_1fr] gap-x-5 py-5"
                >
                  <span className="font-mono text-[11px] text-faint">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <div className="text-[14px] font-medium text-foreground">
                      {item.title}
                    </div>
                    <p className="mt-1 text-[13px] leading-relaxed text-muted">
                      {item.description}
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
