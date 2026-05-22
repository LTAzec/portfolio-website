import { CapabilityGrid } from "@/components/ui/CapabilityGrid";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { capabilities } from "@/data/capabilities";

/**
 * Capabilities section on the home page.
 * Data comes from data/capabilities.ts so the same list can be reused
 * on the About page without drift.
 */
export function Capabilities() {
  return (
    <section id="skills" className="py-24 sm:py-32 lg:py-40">
      <Container>
        <SectionHeading
          index="03"
          eyebrow="Capabilities"
          title="Practical {tools}, surfaces and systems."
          subtitle="The technologies, disciplines and ways of working that show up across most projects — from data layer to interface, end-to-end."
        />

        <div className="mt-16">
          <CapabilityGrid capabilities={capabilities} />
        </div>
      </Container>
    </section>
  );
}
