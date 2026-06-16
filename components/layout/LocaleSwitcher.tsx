"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

/**
 * Compact, premium EN / NL switcher.
 *
 * Uses next-intl's locale-aware navigation so switching language keeps the
 * user on the *same* page — `/projects/boulder-buddy` ⇄
 * `/nl/projects/boulder-buddy` — and next-intl persists the choice via its
 * locale cookie.
 *
 * Visual: a tiny segmented toggle. Both options sit in equal-padding pills;
 * the active locale gets a subtle background lift so the switcher reads as a
 * control, not as two free-floating nav links. Mono caps + tracking are kept
 * to align typographically with the navbar's primary nav.
 */
export function LocaleSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("common");

  function switchTo(next: string) {
    if (next === locale) return;
    // `pathname` is already locale-stripped; replace it under the new locale.
    router.replace(pathname, { locale: next });
  }

  return (
    <div
      role="group"
      aria-label={t("language")}
      className={cn(
        "flex items-center gap-0.5 font-mono text-[11px] uppercase tracking-[0.18em]",
        className,
      )}
    >
      {routing.locales.map((loc) => {
        const active = loc === locale;
        return (
          <button
            key={loc}
            type="button"
            onClick={() => switchTo(loc)}
            aria-current={active ? "true" : undefined}
            aria-label={loc.toUpperCase()}
            className={cn(
              "rounded-full px-2 py-1 transition-colors",
              active
                ? "bg-foreground/[0.07] text-foreground"
                : "text-muted hover:text-foreground",
            )}
          >
            {loc}
          </button>
        );
      })}
    </div>
  );
}
