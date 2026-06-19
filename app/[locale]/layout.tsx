import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import "../globals.css";

import { BackgroundGlow } from "@/components/effects/BackgroundGlow";
import { Navbar } from "@/components/layout/Navbar";
import { routing } from "@/i18n/routing";
import { site } from "@/data/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Pre-render both locales at build time.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: {
      default: `${site.name} — ${site.role}`,
      template: `%s — ${site.name}`,
    },
    description: site.description,
    metadataBase: new URL(site.url),
    // hreflang signals — English is unprefixed, Dutch lives under /nl.
    alternates: {
      languages: {
        en: "/",
        nl: "/nl",
        "x-default": "/",
      },
    },
    openGraph: {
      title: `${site.name} — ${site.role}`,
      description: site.description,
      url: site.url,
      siteName: site.brand,
      locale: locale === "nl" ? "nl_BE" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${site.name} — ${site.role}`,
      description: site.description,
    },
    icons: { icon: "/icon.svg", apple: "/apple-icon.svg" },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  // Validate the incoming locale, then enable static rendering for every
  // Server Component in this tree.
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="relative min-h-full bg-background text-foreground">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <BackgroundGlow />
          <Navbar />
          <main className="relative">{children}</main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
