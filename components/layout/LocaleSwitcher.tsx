"use client";

import { Fragment } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

/**
 * Compact, premium EN | NL switcher.
 *
 * Uses next-intl's locale-aware navigation so switching language keeps the
 * user on the *same* page — `/projects/boulder-buddy` ⇄
 * `/nl/projects/boulder-buddy` — and next-intl persists the choice via its
 * locale cookie. No dropdown, just two mono-caps toggles with a hairline
 * divider, matching the navbar's type treatment.
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
        "flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.18em]",
        className,
      )}
    >
      {routing.locales.map((loc, i) => (
        <Fragment key={loc}>
          {i > 0 && (
            <span aria-hidden className="text-faint">
              |
            </span>
          )}
          <button
            type="button"
            onClick={() => switchTo(loc)}
            aria-current={loc === locale ? "true" : undefined}
            className={cn(
              "transition-colors",
              loc === locale
                ? "text-foreground"
                : "text-muted hover:text-foreground",
            )}
          >
            {loc}
          </button>
        </Fragment>
      ))}
    </div>
  );
}
