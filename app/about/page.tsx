import type { Metadata } from "next";

import { AboutHero } from "@/components/about/AboutHero";
import { BackgroundSection } from "@/components/about/BackgroundSection";
import { FocusGrid } from "@/components/about/FocusGrid";
import { ProjectShelf } from "@/components/about/ProjectShelf";
import { Container } from "@/components/layout/Container";
import { CapabilityGrid } from "@/components/ui/CapabilityGrid";
import { CTASection } from "@/components/ui/CTASection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Timeline } from "@/components/ui/Timeline";
import {
  focusAreas,
  profileParagraphs,
  roleChips,
} from "@/data/about";
import { projects as allProjects } from "@/data/projects";
import { resolveProjectsCardMedia } from "@/lib/resolve-project-media";
import { capabilities } from "@/data/capabilities";
import { experience } from "@/data/experience";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: `About — ${site.name}`,
  description: `${site.founder} — Junior Software Developer based in Turnhout. Full-stack, automation and AI work behind AZEC Digital.`,
};

const workEntries = experience.filter(
  (e) => e.type === "work" || e.type === "studio",
);
const educationEntries = experience.filter((e) => e.type === "education");

export default function AboutPage() {
  const resolvedShelfProjects = resolveProjectsCardMedia(allProjects);

  return (
    <>
      {/* ── 1. Hero ───────────────────────────────────────────────── */}
      <AboutHero
        index="02"
        eyebrow="About"
        title={site.founder}
        chips={roleChips}
        intro="Developer in Turnhout, Belgium. Building practical software at the intersection of full-stack engineering, automation and AI — under the AZEC Digital banner."
        availability={`${site.location} · ${site.availability}`}
        portrait={{
          src: "/portrait/yannis.jpg",
          alt: `${site.founder} — portrait`,
          initials: "YB",
        }}
      />

      {/* ── 2. Profile ────────────────────────────────────────────── */}
      <section className="border-t border-border py-20 sm:py-24">
        <Container>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <span className="text-eyebrow flex items-center gap-3">
                <span className="text-accent">A</span>
                <span className="h-px w-6 bg-faint" />
                <span>Profile</span>
              </span>
              <h2 className="mt-5 text-balance text-[1.75rem] font-medium leading-[1.15] tracking-[-0.02em] text-foreground sm:text-[2rem]">
                Building practical software, end to end.
              </h2>
            </div>
            <div className="flex flex-col gap-5 text-[16px] leading-[1.7] text-foreground/90 lg:col-span-8 sm:text-[17px] sm:leading-[1.72]">
              {profileParagraphs.map((p, i) => (
                <p key={i} className="max-w-2xl text-pretty">
                  {p}
                </p>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── 3. Relevant background ────────────────────────────────── */}
      <section className="border-t border-border py-20 sm:py-24">
        <Container>
          <SectionHeading
            index="B"
            eyebrow="Relevant background"
            title="Work that shaped how I {build}."
            subtitle="Three roles, very different worlds — what each one actually taught me, not what fits on a CV line."
          />
          <div className="mt-12 sm:mt-14">
            <BackgroundSection items={workEntries} />
          </div>
        </Container>
      </section>

      {/* ── 4. Education ──────────────────────────────────────────── */}
      <section className="border-t border-border py-20 sm:py-24">
        <Container>
          <SectionHeading
            index="C"
            eyebrow="Education"
            title="Foundations and {fundamentals}."
            subtitle="Software engineering training — programming, data, full-stack web and mobile, with applied real-world projects."
          />
          <div className="mt-12 sm:mt-14">
            <Timeline items={educationEntries} />
          </div>
        </Container>
      </section>

      {/* ── 5. Technical stack ────────────────────────────────────── */}
      <section className="border-t border-border py-20 sm:py-24">
        <Container>
          <SectionHeading
            index="D"
            eyebrow="Technical stack"
            title="What I {actually use}."
            subtitle="Five buckets, mapped to the work the studio takes on day-to-day."
          />
          <div className="mt-12 sm:mt-14">
            <CapabilityGrid capabilities={capabilities} />
          </div>
        </Container>
      </section>

      {/* ── 6. Project shelf ──────────────────────────────────────── */}
      <section className="border-t border-border py-20 sm:py-24">
        <Container>
          <SectionHeading
            index="E"
            eyebrow="Project shelf"
            title="Things I've {built}."
            subtitle="Pulled live from the project index — swipe through to see every case, internal and personal. New entries land here automatically."
          />
          <div className="mt-12 sm:mt-14">
            <ProjectShelf items={resolvedShelfProjects} />
          </div>
        </Container>
      </section>

      {/* ── 7. Focus areas ────────────────────────────────────────── */}
      <section className="border-t border-border py-20 sm:py-24">
        <Container>
          <SectionHeading
            index="F"
            eyebrow="Focus"
            title="Where I {gravitate}."
            subtitle="The corners of the stack the work keeps pulling me back to."
          />
          <div className="mt-12 sm:mt-14">
            <FocusGrid areas={focusAreas} />
          </div>
        </Container>
      </section>

      {/* ── 8. CTA ────────────────────────────────────────────────── */}
      <CTASection
        eyebrow="Open for work"
        title="Want to {work together}?"
        subtitle="I take on a small number of projects at a time. Reach out with a brief — let's see if there's a good fit."
        primary={{ label: "Get in touch", href: "/contact" }}
        secondary={{ label: "See projects", href: "/projects" }}
      />
    </>
  );
}
