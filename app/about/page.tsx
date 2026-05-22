import type { Metadata } from "next";

import { Container } from "@/components/layout/Container";
import { CapabilityGrid } from "@/components/ui/CapabilityGrid";
import { CTASection } from "@/components/ui/CTASection";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Tag } from "@/components/ui/Tag";
import { Timeline } from "@/components/ui/Timeline";
import { capabilities } from "@/data/capabilities";
import { experience } from "@/data/experience";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: `About — ${site.name}`,
  description: `${site.founder} — developer behind AZEC Digital. Background, focus and ways of working.`,
};

const principles = [
  { title: "Practical first", description: "Solve the real problem first. Polish, refinement and visual craft come after the thing actually works." },
  { title: "Clean execution", description: "Strong typography, restrained motion, focused interactions. Details compound — the small ones decide whether software feels professional." },
  { title: "Built end-to-end", description: "From data layer to UX, shipped as one piece. No hand-offs in the middle, no rough edges between parts." },
  { title: "Iterate small", description: "Ship the smallest valuable thing, then refine from real feedback. Speed of feedback is the single biggest predictor of quality." },
];

const tooling = [
  "Next.js", "TypeScript", "React", "Tailwind", "Node.js", "PostgreSQL",
  "Prisma", "Drizzle", "LLM APIs", "OpenAI SDK", "Vercel", "GitHub Actions",
  "Figma", "Linear", "Raycast",
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        index="02"
        eyebrow="About"
        title="A studio of {one}, building practical software."
        subtitle={`Run by ${site.founder} — a developer focused on digital products, internal tooling and AI-driven experiments. Background in full-stack engineering with a strong focus on product, usability and clean execution.`}
      />

      <section className="pb-20 sm:pb-28">
        <Container>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <span className="text-eyebrow">Profile</span>
            </div>
            <div className="space-y-5 text-[17px] leading-[1.65] text-foreground/90 lg:col-span-8">
              <p>
                AZEC Digital is an independent studio led by {site.founder}.
                The work spans digital products, internal tooling, marketing
                sites and AI-driven side projects — different domains, same
                approach: build the thing that actually solves the problem,
                make it feel professional, ship it.
              </p>
              <p>
                Most projects start as practical problems. An internal team
                needs better tooling. A small business wants a polished web
                presence. An experiment wants to become a real product. The
                studio takes those briefs and ships them end-to-end.
              </p>
              <p>
                The studio is small by design — small enough to keep quality
                consistent across every deliverable, small enough to ship
                fast, small enough that the person writing the code is the
                person you talk to.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-border py-20 sm:py-28">
        <Container>
          <SectionHeading index="A" eyebrow="Approach" title="How the studio {works}." />
          <ul className="mt-14 divide-y divide-border border-y border-border">
            {principles.map((p, i) => (
              <li key={p.title} className="grid grid-cols-[auto_1fr] gap-x-6 py-6">
                <span className="font-mono text-[11px] text-faint">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <div className="text-[15px] font-medium text-foreground">{p.title}</div>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{p.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="border-t border-border py-20 sm:py-28">
        <Container>
          <SectionHeading
            index="B"
            eyebrow="Capabilities"
            title="What I {work} with."
            subtitle="The disciplines and surfaces the studio engages with across most projects."
          />
          <div className="mt-14">
            <CapabilityGrid capabilities={capabilities} />
          </div>
        </Container>
      </section>

      <section className="border-t border-border py-20 sm:py-28">
        <Container>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <span className="text-eyebrow flex items-center gap-3">
                <span className="text-accent">C</span>
                <span className="h-px w-6 bg-faint" />
                <span>Tooling</span>
              </span>
              <h2 className="mt-5 max-w-md text-balance text-3xl font-medium tracking-[-0.02em] text-foreground sm:text-[2rem]">
                Day-to-day stack.
              </h2>
            </div>
            <div className="lg:col-span-8">
              <p className="max-w-2xl text-[15px] leading-relaxed text-muted">
                The concrete technologies that show up in most projects — not an exhaustive list, but the surface area the studio is fluent in.
              </p>
              <div className="mt-7 flex flex-wrap gap-1.5">
                {tooling.map((t) => <Tag key={t}>{t}</Tag>)}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-border py-20 sm:py-28">
        <Container>
          <SectionHeading index="D" eyebrow="Experience" title="Background and {timeline}." />
          <div className="mt-14">
            <Timeline items={experience} />
          </div>
        </Container>
      </section>

      <CTASection
        eyebrow="Open for work"
        title="Want to {work together}?"
        subtitle="The studio takes on a small number of projects per year. Reach out with a brief — let's see if there's a good fit."
        primary={{ label: "Get in touch", href: "/contact" }}
        secondary={{ label: "See projects", href: "/projects" }}
      />
    </>
  );
}
