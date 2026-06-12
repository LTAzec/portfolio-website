import { useTranslations } from "next-intl";
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
  const t = useTranslations("capabilities");

  return (
    <section id="skills" className="py-24 sm:py-32 lg:py-40">
      <Container>
        <SectionHeading
          index="03"
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
        />

        <div className="mt-16">
          <CapabilityGrid capabilities={capabilities} />
        </div>
      </Container>
    </section>
  );
}
