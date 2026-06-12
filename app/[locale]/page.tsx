import { getTranslations, setRequestLocale } from "next-intl/server";

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
export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");

  return (
    <>
      <Hero />
      <About />
      <FeaturedProjects />
      <Capabilities />
      <CTASection
        eyebrow={t("ctaEyebrow")}
        title={t("ctaTitle")}
        subtitle={t("ctaSubtitle")}
        primary={{ label: t("ctaPrimary"), href: "/contact" }}
        secondary={{ label: t("ctaSecondary"), href: "/projects" }}
      />
    </>
  );
}
