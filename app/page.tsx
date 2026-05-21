import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { Hero } from "@/components/sections/Hero";

/**
 * Home page. Sections are composed in narrative order and each one is
 * a self-contained component, so adding/reordering future sections
 * (About, OtherProjects, Skills, Experience, Contact, Footer) is trivial.
 *
 * Sections planned but not yet implemented:
 *   About, OtherProjects, Skills, Experience, Contact, Footer.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedProjects />
    </>
  );
}
