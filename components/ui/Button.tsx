import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

type ButtonAsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & {
    href?: undefined;
  };

type ButtonAsLink = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps> & {
    href: string;
  };

type ButtonProps = ButtonAsButton | ButtonAsLink;

/**
 * Studio button. Three variants:
 *   - primary    Solid AZEC blue. Restrained shadow, no rainbow gradient.
 *   - secondary  Hairline-outlined. Border brightens to paper on hover.
 *   - ghost      Bare text link with arrow ergonomics.
 *
 * Always rendered as a `group` so children (arrow icons, etc.) can hook
 * into hover state with `group-hover:`.
 */

const baseStyles =
  "group relative inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight transition-all duration-200 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:pointer-events-none";

const sizeStyles: Record<Size, string> = {
  md: "h-10 px-5 text-[13px]",
  lg: "h-12 px-6 text-[14px]",
};

const variantStyles: Record<Variant, string> = {
  primary: [
    "bg-accent text-white",
    "hover:bg-accent-strong",
    "shadow-[0_0_0_1px_rgba(45,123,255,0.45),0_10px_30px_-12px_rgba(45,123,255,0.6)]",
    "hover:shadow-[0_0_0_1px_rgba(45,123,255,0.7),0_14px_36px_-8px_rgba(45,123,255,0.75)]",
  ].join(" "),

  secondary: [
    "border border-border-strong text-foreground bg-transparent",
    "hover:border-foreground hover:bg-surface",
  ].join(" "),

  ghost: "text-muted hover:text-foreground",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: ButtonProps) {
  const classes = cn(
    baseStyles,
    sizeStyles[size],
    variantStyles[variant],
    className,
  );

  if ("href" in rest && rest.href !== undefined) {
    const { href, ...anchorRest } = rest as AnchorHTMLAttributes<HTMLAnchorElement>;
    // Internal routes go through next-intl's locale-aware <Link> so the
    // active locale prefix (e.g. /nl) is preserved; external URLs stay <a>.
    const isInternal = typeof href === "string" && href.startsWith("/");
    if (isInternal) {
      return (
        <Link href={href as string} className={classes} {...anchorRest}>
          {children}
        </Link>
      );
    }
    return (
      <a className={classes} href={href} {...anchorRest}>
        {children}
      </a>
    );
  }

  return (
    <button
      className={classes}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
}
