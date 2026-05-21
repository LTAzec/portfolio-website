import type { CSSProperties } from "react";
import { AzecIcon } from "@/components/brand/AzecIcon";

/**
 * Right-side hero visual — the AZEC Digital "developer system" piece.
 *
 * Composition (desktop):
 *   - Central AZEC icon tile, with a soft AZEC-blue underglow
 *   - Three concentric orbit rings (hairline)
 *   - Six floating capability chips orbiting at different speeds:
 *     inner ring: TypeScript · Next.js          (90s)
 *     middle:    Interfaces · Tooling           (120s, reverse)
 *     outer:     AI Products · Automation       (150s)
 *   - Top-right: tiny terminal-style status panel (build watcher + blink)
 *   - Bottom-left: tiny dashboard-style panel (active projects + progress)
 *   - Subtle dot-grid in the centre, masked to a circle
 *
 * Mobile fallback: just the AzecIcon tile + soft glow. Lighter, calmer.
 *
 * Every animation uses transform / opacity / offset-distance only — no
 * JS loop, no libraries. prefers-reduced-motion stops them all via
 * the shared override in globals.css.
 *
 * Decorative — pointer-events disabled across the whole tree so it can
 * never block scroll/clicks.
 */
export function HeroVisual() {
  return (
    <div
      aria-hidden
      className="pointer-events-none relative mx-auto aspect-square w-full max-w-[460px]"
    >
      {/* Mobile fallback — static icon, no orbits */}
      <div className="absolute inset-0 grid place-items-center lg:hidden">
        <StaticIcon />
      </div>

      {/* Desktop composition */}
      <div className="absolute inset-0 hidden lg:block">
        <AnimatedSystem />
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   Mobile — quieter, just an iconic seal
   ────────────────────────────────────────────────────────────── */
function StaticIcon() {
  return (
    <div className="relative">
      <div
        className="absolute -inset-10 -z-10 rounded-full opacity-50 blur-2xl"
        style={{
          background:
            "radial-gradient(circle, rgba(45,123,255,0.45) 0%, transparent 70%)",
        }}
      />
      <AzecIcon className="h-24 w-24 sm:h-28 sm:w-28" />
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   Desktop animated system
   ────────────────────────────────────────────────────────────── */
function AnimatedSystem() {
  return (
    <div className="relative h-full w-full">
      {/* Masked dot grid — work surface around the icon */}
      <div
        className="bg-dots absolute inset-0"
        style={{
          maskImage: "radial-gradient(circle, black 22%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(circle, black 22%, transparent 70%)",
        }}
      />

      {/* Orbit rings */}
      <Ring radius={100} opacity={0.55} />
      <Ring radius={150} opacity={0.4} />
      <Ring radius={200} opacity={0.28} />

      {/* Soft underglow behind the icon */}
      <div
        className="animate-glow-pulse absolute top-1/2 left-1/2 -z-10 h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
        style={{
          background:
            "radial-gradient(circle, rgba(45,123,255,0.50) 0%, transparent 70%)",
        }}
      />

      {/* Central AZEC tile */}
      <div className="absolute top-1/2 left-1/2 h-[140px] w-[140px] -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_10px_40px_rgba(45,123,255,0.25)]">
        <AzecIcon className="h-full w-full" />
      </div>

      {/* Orbiting capability chips */}
      {CHIPS.map((chip) => (
        <OrbitChip key={chip.label} chip={chip} />
      ))}

      {/* Top-right terminal panel */}
      <TerminalPanel />

      {/* Bottom-left dashboard panel */}
      <DashboardPanel />
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   Orbit ring
   ────────────────────────────────────────────────────────────── */
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

/* ──────────────────────────────────────────────────────────────
   Capability chips
   Each chip declares its orbit radius, duration, delay, direction.
   offset-path traces the circular orbit; offset-anchor keeps the
   chip centered on the path; offset-rotate keeps it upright.
   ────────────────────────────────────────────────────────────── */
interface ChipDef {
  label: string;
  radius: number;
  duration: number;
  /** Negative seconds — starts the animation mid-cycle. */
  delay: number;
  reverse?: boolean;
}

const CHIPS: ChipDef[] = [
  // Inner — engineering core
  { label: "TypeScript", radius: 100, duration: 90, delay: 0 },
  { label: "Next.js", radius: 100, duration: 90, delay: -45 },
  // Middle — practice areas, reversed direction for visual variety
  { label: "Interfaces", radius: 150, duration: 120, delay: 0, reverse: true },
  { label: "Tooling", radius: 150, duration: 120, delay: -60, reverse: true },
  // Outer — high-level capabilities
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
      className="ring-highlight animate-orbit-trace absolute top-1/2 left-1/2 inline-flex rounded-full border border-border-strong bg-charcoal-strong px-2.5 py-1 font-mono text-[10px] tracking-[0.06em] whitespace-nowrap text-foreground"
      style={style}
    >
      {chip.label}
    </span>
  );
}

/* ──────────────────────────────────────────────────────────────
   Developer panels
   ────────────────────────────────────────────────────────────── */
function TerminalPanel() {
  return (
    <div
      className="animate-float-y glass ring-highlight absolute top-[6%] right-[2%] rounded-md px-3 py-2 font-mono text-[10px] leading-tight"
      style={{ animationDuration: "7s" }}
    >
      <div className="flex items-center gap-1.5 text-foreground">
        <span className="text-accent">▸</span>
        <span>azec build —watch</span>
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
      className="animate-float-y glass ring-highlight absolute bottom-[6%] left-[2%] rounded-md px-3 py-2 font-mono text-[10px] leading-tight"
      style={{ animationDuration: "7s", animationDelay: "-3.5s" }}
    >
      <div className="flex items-center justify-between gap-4 text-foreground">
        <span>Active projects</span>
        <span className="text-accent">04</span>
      </div>
      <div className="mt-1.5 flex items-center gap-2 text-muted">
        <span className="block h-[3px] w-14 overflow-hidden rounded-full bg-border">
          <span className="block h-full w-3/4 bg-accent" />
        </span>
        <span>75%</span>
      </div>
    </div>
  );
}
