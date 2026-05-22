import { About } from "@/components/sections/About";
import { Capabilities } from "@/components/sections/Capabilities";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { Hero } from "@/components/sections/Hero";
import { CTASection } from "@/components/ui/CTASection";

/**
 * Home page — strong intro to AZEC Digital.
 *
 *   Hero          → brand intro + animated AZEC system
 *   About         → preview of the studio + working approach
 *   FeaturedProjects → selected case-study list
 *   Capabilities  → tools, surfaces and systems
 *   CTASection    → closing call-to-action toward /contact
 */
export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <FeaturedProjects />
      <Capabilities />
      <CTASection
        eyebrow="Open for work"
        title="Have a project in mind? {Let's talk.}"
        subtitle="The studio takes on a small number of projects per year. Get in touch with a brief and we'll see if there's a good fit."
        primary={{ label: "Get in touch", href: "/contact" }}
        secondary={{ label: "See all projects", href: "/projects" }}
      />
    </>
  );
}
