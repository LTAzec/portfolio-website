import { AzecWordmark } from "@/components/brand/AzecWordmark";

/**
 * Global backdrop. Editorial, restrained — the look of a studio book
 * page rather than a glowing tech surface. Layers:
 *
 *   1. 12-column hairline grid — anchors the page to the layout system
 *   2. Giant AZEC wordmark watermark — barely visible (~3.5% opacity),
 *      masked to the centre, ties everything to the brand
 *   3. SVG fractal-noise grain
 *   4. A single soft blue zone in the bottom-right — the only "glow"
 *   5. Edge vignette to deepen the corners
 *
 * Component name kept as <BackgroundGlow /> for import stability;
 * the implementation is now a restrained backdrop.
 */
export function BackgroundGlow() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* 1 — 12-column grid */}
      <div className="bg-grid-12 absolute inset-0 opacity-100" />

      {/* 2 — Wordmark watermark */}
      <div className="mask-fade-edges absolute inset-0 flex items-center justify-center">
        <AzecWordmark
          label=""
          className="h-auto w-[140%] max-w-none text-foreground opacity-[0.022]"
        />
      </div>

      {/* 3 — Film grain */}
      <div className="bg-noise absolute inset-0 opacity-[0.04] mix-blend-overlay" />

      {/* 4 — One soft blue zone, bottom-right */}
      <div
        className="absolute -bottom-40 -right-20 h-[520px] w-[680px] rounded-full opacity-50 blur-[140px]"
        style={{
          background:
            "radial-gradient(circle, rgba(45,123,255,0.18) 0%, rgba(45,123,255,0) 70%)",
        }}
      />

      {/* 5 — Edge vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.55) 100%)",
        }}
      />
    </div>
  );
}
