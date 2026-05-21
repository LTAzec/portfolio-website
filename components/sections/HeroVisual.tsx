import type { CSSProperties } from "react";
import { AzecIcon } from "@/components/brand/AzecIcon";

/**
 * Hero visual — AZEC Digital "developer system" piece.
 *
 * Two distinct components, one per viewport tier:
 *
 *   <HeroVisualMobile />  — compact composition. Just the AZEC icon,
 *                           one subtle ring, a soft underglow. No orbits,
 *                           no chips, no panels. Fixed height ~180px.
 *
 *   <HeroVisual />        — full desktop system. Three orbit rings, six
 *                           orbiting capability chips, two developer panels,
 *                           soft underglow, central icon tile.
 *                           Square, max 460px wide.
 *
 * Hero.tsx places each in its respective layout (mobile flex / desktop grid)
 * so we never carry the wrong variant in the DOM.
 *
 * All animations use transform / opacity / offset-distance only — no JS,
 * no libraries. prefers-reduced-motion stops every animation via the
 * shared override in globals.css. Decorative: pointer-events disabled.
 */

/* ──────────────────────────────────────────────────────────────
   Mobile — compact, ~180px tall
   ────────────────────────────────────────────────────────────── */
export function HeroVisualMobile() {
  return (
    <div
      aria-hidden
      className="pointer-events-none relative mx-auto grid h-[180px] w-full place-items-center"
    >
      {/* Soft underglow */}
      <div
        className="absolute h-[200px] w-[200px] rounded-full opacity-50 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(45,123,255,0.42) 0%, transparent 70%)",
        }}
      />

      {/* One subtle ring around the icon */}
      <div className="absolute h-[150px] w-[150px] rounded-full border border-border opacity-50" />

      {/* Central AZEC tile */}
      <AzecIcon className="relative h-[104px] w-[104px] drop-shadow-[0_8px_24px_rgba(45,123,255,0.25)]" />
    </div>
  );
}

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

function Ring({ radius, opacity }: { radius: number; opacity: number }) {
  return (
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-border"
      style={{
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
}

const CHIPS: ChipDef[] = [
  { label: "TypeScript", radius: 100, duration: 90, delay: 0 },
  { label: "Next.js", radius: 100, duration: 90, delay: -45 },
  { label: "Interfaces", radius: 150, duration: 120, delay: 0, reverse: true },
  { label: "Tooling", radius: 150, duration: 120, delay: -60, reverse: true },
  { label: "AI Products", radius: 200, duration: 150, delay: 0 },
  { label: "Automation", radius: 200, duration: 150, delay: -75 },
];

function OrbitChip({ chip }: { chip: ChipDef }) {
  const style: CSSProperties = {
    offsetPath: `circle(${chip.radius}px)`,
    offsetAnchor: "center",
    offsetRotate: "0deg",
    animationDuration: `${chip.duration}s`,
    animationDelay: `${chip.delay}s`,
    animationDirection: chip.reverse ? "reverse" : "normal",
  };

  return (
    <span
      className="animate-orbit-trace absolute top-1/2 left-1/2 inline-flex rounded-full border border-border bg-charcoal/90 px-2.5 py-1 font-mono text-[10px] tracking-[0.08em] whitespace-nowrap text-foreground/85 backdrop-blur-sm"
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
