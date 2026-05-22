import type { Metadata } from "next";

import { Container } from "@/components/layout/Container";
import { ContactCard } from "@/components/ui/ContactCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { site, socials } from "@/data/site";

export const metadata: Metadata = {
  title: `Contact — ${site.name}`,
  description: "Get in touch with AZEC Digital — projects, collaborations, opportunities.",
};

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <rect x="2" y="3.5" width="14" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M2.5 4.5L9 9.5L15.5 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path d="M9 1.5C4.86 1.5 1.5 4.86 1.5 9c0 3.31 2.15 6.12 5.13 7.11.38.07.52-.16.52-.36 0-.18-.01-.65-.01-1.27-2.09.45-2.53-1.01-2.53-1.01-.34-.87-.83-1.1-.83-1.1-.68-.46.05-.45.05-.45.75.05 1.14.77 1.14.77.67 1.14 1.75.81 2.18.62.07-.48.26-.81.47-1-1.67-.19-3.43-.83-3.43-3.71 0-.82.29-1.49.77-2.02-.08-.19-.34-.95.07-1.99 0 0 .63-.2 2.06.77.6-.17 1.24-.25 1.88-.25.64 0 1.28.08 1.88.25 1.43-.97 2.06-.77 2.06-.77.41 1.04.15 1.8.07 1.99.48.53.77 1.2.77 2.02 0 2.89-1.76 3.52-3.44 3.71.27.23.51.69.51 1.39 0 1-.01 1.81-.01 2.06 0 .2.14.43.52.36C14.35 15.12 16.5 12.31 16.5 9 16.5 4.86 13.14 1.5 9 1.5z" fill="currentColor" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <rect x="1.5" y="1.5" width="15" height="15" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M5 7v6M5 5v.01M8 13V7m0 0c0-1 1-2 2-2s2 1 2 2v6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function iconFor(name: string) {
  if (name === "mail") return <MailIcon />;
  if (name === "github") return <GithubIcon />;
  if (name === "linkedin") return <LinkedinIcon />;
  return null;
}

function valueFor(label: string, defaultHref: string) {
  if (label === "Email") return site.email;
  if (label === "GitHub") return "github.com/yannisbertels";
  if (label === "LinkedIn") return "linkedin.com/in/yannisbertels";
  return defaultHref;
}

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="{Let's} build something."
        subtitle="Open for projects, collaborations and opportunities. The fastest way to start a conversation is email."
      />

      <section className="pb-20 sm:pb-28">
        <Container>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <span className="text-eyebrow flex items-center gap-3">
                <span className="text-accent">●</span>
                <span>Status</span>
              </span>
              <p className="mt-4 text-[15px] leading-relaxed text-foreground/90">
                Currently available for new projects, collaborations and opportunities.
              </p>
              <div className="mt-7 space-y-2">
                <div className="text-eyebrow text-[10px]">Based in</div>
                <div className="text-[15px] text-foreground">
                  {site.location} · Remote
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 lg:col-span-8">
              {socials.map((s) => (
                <ContactCard
                  key={s.label}
                  label={s.label}
                  value={valueFor(s.label, s.href)}
                  href={s.href}
                  icon={iconFor(s.icon)}
                  external={s.icon !== "mail"}
                />
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-border py-12 sm:py-16">
        <Container>
          <div className="text-eyebrow flex flex-wrap items-center justify-between gap-y-2 text-[10px]">
            <span>{site.name} · Est. {site.founded}</span>
            <span className="text-muted">For most enquiries, email is fastest.</span>
          </div>
        </Container>
      </section>
    </>
  );
}
