import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface PageHeaderProps {
  /** Two-digit editorial index (e.g. "02"). */
  index?: string;
  /** Small uppercase label above the title. */
  eyebrow?: string;
  /** Main heading text. Use `{...}` for accent underline. */
  title: string;
  /** Optional supporting paragraph. */
  subtitle?: string;
}

/**
 * Reusable page-level header. Wraps SectionHeading with page-grade
 * top/bottom padding so every subpage opens with the same editorial
 * rhythm.
 */
export function PageHeader(props: PageHeaderProps) {
  return (
    <section className="pt-28 pb-12 sm:pt-36 sm:pb-16 lg:pt-40">
      <Container>
        <SectionHeading {...props} />
      </Container>
    </section>
  );
}
