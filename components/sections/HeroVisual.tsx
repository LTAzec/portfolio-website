import type { CSSProperties } from "react";
import { AzecIcon } from "@/components/brand/AzecIcon";
import { cn } from "@/lib/utils";

/**
 * Hero visual — AZEC Digital "developer system" piece.
 *
 * Two distinct components, one per viewport tier:
 *
 *   <HeroVisualMobile />  — compact orbital composition. Central AZEC
 *                           tile, two subtle rings, five orbiting
 *                           capability chips (3 standard + 2 subtle),
 *                           animated underglow, compact dashboard card
 *                           anchored at the bottom. ~340px tall.
 *
 *   <HeroVisual />        — full desktop system. Three orbit rings, six
 *                           orbiting capability chips, terminal +
 *                           dashboard panels, soft underglow, central
 *                           icon tile. Square, max 460px wide.
 *
 * Hero.tsx places each in its respective layout (mobile flex / desktop grid)
 * so we never carry the wrong variant in the DOM.
 *
 * All animations use transform / opacity / offset-distance only — no JS,
 * no libraries. prefers-reduced-motion stops every animation via the
 * shared override in globals.css; OrbitChip sets a static `offsetDistance`
 * so chips stay evenly distributed when motion is off instead of stacking
 * at 0°. Decorative: pointer-events disabled.
 */

/* ──────────────────────────────────────────────────────────────
   Mobile — compact orbital system, ~340px tall
   ────────────────────────────────────────────────────────────── */
export function HeroVisualMobile() {
  return (
    <div
      aria-hidden
      className="pointer-events-none relative mx-auto h-[340px] w-full max-w-[280px]"
    >
      {/* Soft animated underglow */}
      <div
        className="animate-glow-pulse absolute top-[170px] left-1/2 -z-10 h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(45,123,255,0.32) 0%, transparent 65%)",
        }}
      />

      {/* Two subtle orbit rings */}
      <Ring radius={60} opacity={0.5} cy={170} />
      <Ring radius={95} opacity={0.32} cy={170} />

      {/* Central AZEC tile */}
      <div className="absolute top-[170px] left-1/2 h-[80px] w-[80px] -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_10px_28px_rgba(45,123,255,0.22)]">
        <AzecIcon className="h-full w-full" />
      </div>

      {/* 5 chips on the outer orbit — 72° apart, alternating standard / subtle */}
      {MOBILE_CHIPS.map((chip) => (
        <OrbitChip key={chip.label} chip={chip} cy={170} />
      ))}

      {/* Compact dashboard card — sits below the orbit, never in its path */}
      <MobileDashboardPanel />
    </div>
  );
}

const MOBILE_CHIPS: ChipDef[] = [
  { label: "Next.js", radius: 95, duration: 80, delay: 0 },
  { label: "Interfaces", radius: 95, duration: 80, delay: -16, subtle: true },
  { label: "AI Tools", radius: 95, duration: 80, delay: -32 },
  { label: "TypeScript", radius: 95, duration: 80, delay: -48, subtle: true },
  { label: "Automation", radius: 95, duration: 80, delay: -64 },
];

/* ──────────────────────────────────────────────────────────────
   Desktop — full animated system
   ────────────────────────────────────────────────────────────── */
export function HeroVisual() {
  return (
    <div
      aria-hidden
      className="pointer-events-none relative mx-auto aspect-square w-full max-w-[460px]"
    >
      {/* Masked dot grid */}
      <div
        className="bg-dots absolute inset-0"
        style={{
          maskImage: "radial-gradient(circle, black 22%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(circle, black 22%, transparent 70%)",
        }}
      />

      {/* Orbit rings */}
      <Ring radius={100} opacity={0.5} />
      <Ring radius={150} opacity={0.36} />
      <Ring radius={200} opacity={0.24} />

      {/* Soft underglow behind the icon */}
      <div
        className="animate-glow-pulse absolute top-1/2 left-1/2 -z-10 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(45,123,255,0.34) 0%, transparent 65%)",
        }}
      />

      {/* Central AZEC tile */}
      <div className="absolute top-1/2 left-1/2 h-[152px] w-[152px] -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_14px_38px_rgba(45,123,255,0.24)]">
        <AzecIcon className="h-full w-full" />
      </div>

      {/* Orbiting capability chips */}
      {CHIPS.map((chip) => (
        <OrbitChip key={chip.label} chip={chip} />
      ))}

      <TerminalPanel />
      <DashboardPanel />
    </div>
  );
}

/**
 * `cy` lets mobile shift the orbit centre away from the container's vertical
 * midpoint so the dashboard card has clear space below. Desktop omits it and
 * falls back to the original `top-1/2` centring — no visual change there.
 */
function Ring({
  radius,
  opacity,
  cy,
}: {
  radius: number;
  opacity: number;
  cy?: number;
}) {
  const positionStyle: CSSProperties =
    cy !== undefined ? { top: `${cy}px` } : { top: "50%" };

  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-border"
      style={{
        ...positionStyle,
        width: `${radius * 2}px`,
        height: `${radius * 2}px`,
        opacity,
      }}
    />
  );
}

interface ChipDef {
  label: string;
  radius: number;
  duration: number;
  delay: number;
  reverse?: boolean;
  /** Mobile-only: tighter padding, smaller text, lower opacity. */
  subtle?: boolean;
}

const CHIPS: ChipDef[] = [
  { label: "TypeScript", radius: 100, duration: 90, delay: 0 },
  { label: "Next.js", radius: 100, duration: 90, delay: -45 },
  { label: "Interfaces", radius: 150, duration: 120, delay: 0, reverse: true },
  { label: "Tooling", radius: 150, duration: 120, delay: -60, reverse: true },
  { label: "AI Products", radius: 200, duration: 150, delay: 0 },
  { label: "Automation", radius: 200, duration: 150, delay: -75 },
];

function OrbitChip({ chip, cy }: { chip: ChipDef; cy?: number }) {
  // Static offset-distance matching where the animation's negative delay would
  // place the chip. The CSS animation overrides this during normal motion, so
  // desktop / mobile visuals are unchanged. With prefers-reduced-motion the
  // animation is removed (see globals.css) and this static value keeps the
  // chips evenly distributed instead of stacking at 0°.
  const startPercent =
    (((-chip.delay / chip.duration) * 100) % 100 + 100) % 100;

  const style: CSSProperties = {
    top: cy !== undefined ? `${cy}px` : "50%",
    offsetPath: `circle(${chip.radius}px)`,
    offsetAnchor: "center",
    offsetRotate: "0deg",
    offsetDistance: `${startPercent}%`,
    animationDuration: `${chip.duration}s`,
    animationDelay: `${chip.delay}s`,
    animationDirection: chip.reverse ? "reverse" : "normal",
  };

  return (
    <span
      className={cn(
        "animate-orbit-trace absolute left-1/2 inline-flex rounded-full border whitespace-nowrap font-mono backdrop-blur-sm",
        chip.subtle
          ? "border-border/60 bg-charcoal/70 px-2 py-0.5 text-[9px] tracking-[0.06em] text-foreground/65"
          : "border-border bg-charcoal/90 px-2.5 py-1 text-[10px] tracking-[0.08em] text-foreground/85",
      )}
      style={style}
    >
      {chip.label}
    </span>
  );
}

function TerminalPanel() {
  return (
    <div
      className="animate-float-y glass ring-highlight absolute top-[8%] right-[4%] rounded-lg px-3.5 py-2.5 font-mono text-[10px] leading-tight shadow-[0_8px_24px_-10px_rgba(0,0,0,0.6)]"
      style={{ animationDuration: "7s" }}
    >
      <div className="flex items-center gap-1.5 text-foreground">
        <span className="text-accent">▸</span>
        <span>azec build --watch</span>
        <span className="animate-cursor-blink ml-0.5 inline-block h-[10px] w-[5px] translate-y-px bg-accent" />
      </div>
      <div className="mt-1.5 flex items-center gap-1.5 text-muted">
        <span className="h-1 w-1 rounded-full bg-accent" />
        <span>ready · 320ms</span>
      </div>
    </div>
  );
}

function DashboardPanel() {
  return (
    <div
      className="animate-float-y glass ring-highlight absolute bottom-[8%] left-[4%] rounded-lg px-3.5 py-2.5 font-mono text-[10px] leading-tight shadow-[0_8px_24px_-10px_rgba(0,0,0,0.6)]"
      style={{ animationDuration: "7s", animationDelay: "-3.5s" }}
    >
      <div className="flex items-center justify-between gap-5 text-foreground">
        <span>Active projects</span>
        <span className="text-accent">04</span>
      </div>
      <div className="mt-1.5 flex items-center gap-2 text-muted">
        <span className="block h-[3px] w-16 overflow-hidden rounded-full bg-border">
          <span className="block h-full w-3/4 bg-accent" />
        </span>
        <span>75%</span>
      </div>
    </div>
  );
}

/**
 * Mobile-only compact dashboard. Tighter padding, narrower progress bar,
 * pinned to the bottom-centre of the visual so it sits below the orbit reach
 * (chip max y ≈ 277px in a 340px container → ~21px clear gap to card top).
 */
function MobileDashboardPanel() {
  return (
    <div
      className="animate-float-y glass ring-highlight absolute bottom-3 left-1/2 -translate-x-1/2 rounded-lg px-2.5 py-1.5 font-mono text-[10px] leading-tight shadow-[0_8px_24px_-10px_rgba(0,0,0,0.6)]"
      style={{ animationDuration: "7s", animationDelay: "-3.5s" }}
    >
      <div className="flex items-center justify-between gap-4 text-foreground">
        <span>Active projects</span>
        <span className="text-accent">04</span>
      </div>
      <div className="mt-1 flex items-center gap-1.5 text-muted">
        <span className="block h-[3px] w-12 overflow-hidden rounded-full bg-border">
          <span className="block h-full w-3/4 bg-accent" />
        </span>
        <span>75%</span>
      </div>
    </div>
  );
}
