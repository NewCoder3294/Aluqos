"use client";

import React, { useEffect, useState, memo } from "react";
import Image from "next/image";
import { LogoMark } from "./logo";

// ────────────────────────────────────────────────────────────────────────
// Enterprise integrations orbit — full-color brand logos on neutral tiles
// Logo SVGs are stored locally at /public/logos/{file}
// ────────────────────────────────────────────────────────────────────────

type OrbitColor = "coral" | "ink";

interface IntegrationConfig {
  id: string;
  file: string; // matches /public/logos/{file}
  label: string;
  orbitRadius: number;
  size: number;
  speed: number;
  phaseShift: number;
  glowColor: OrbitColor;
}

// Inner orbit (closer, faster, ink-toned glow): 3 core dev/work tools
// Outer orbit (slower, coral glow): 5 broader enterprise tools
const integrationsConfig: IntegrationConfig[] = [
  // Inner orbit
  { id: "slack",   file: "slack.svg",   label: "Slack",   orbitRadius: 110, size: 48, speed: 0.35,  phaseShift: 0,                      glowColor: "ink"   },
  { id: "linear",  file: "linear.svg",  label: "Linear",  orbitRadius: 110, size: 48, speed: 0.35,  phaseShift: (2 * Math.PI) / 3,      glowColor: "ink"   },
  { id: "notion",  file: "notion.svg",  label: "Notion",  orbitRadius: 110, size: 48, speed: 0.35,  phaseShift: (4 * Math.PI) / 3,      glowColor: "ink"   },
  // Outer orbit (counter-rotating, slower)
  { id: "github",  file: "github.svg",  label: "GitHub",  orbitRadius: 200, size: 52, speed: -0.22, phaseShift: 0,                      glowColor: "coral" },
  { id: "figma",   file: "figma.svg",   label: "Figma",   orbitRadius: 200, size: 48, speed: -0.22, phaseShift: (2 * Math.PI) / 5,      glowColor: "coral" },
  { id: "drive",   file: "drive.svg",   label: "Drive",   orbitRadius: 200, size: 48, speed: -0.22, phaseShift: (4 * Math.PI) / 5,      glowColor: "coral" },
  { id: "asana",   file: "asana.svg",   label: "Asana",   orbitRadius: 200, size: 48, speed: -0.22, phaseShift: (6 * Math.PI) / 5,      glowColor: "coral" },
  { id: "loom",    file: "loom.svg",    label: "Loom",    orbitRadius: 200, size: 48, speed: -0.22, phaseShift: (8 * Math.PI) / 5,      glowColor: "coral" },
];

// ─── Orbiting integration tile ─────────────────────────────────────────
const OrbitingIntegration = memo(({ config, angle }: { config: IntegrationConfig; angle: number }) => {
  const [hovered, setHovered] = useState(false);
  const { orbitRadius, size, file, label } = config;
  const x = Math.cos(angle) * orbitRadius;
  const y = Math.sin(angle) * orbitRadius;

  return (
    <div
      className="absolute top-1/2 left-1/2 transition-all duration-300 ease-out"
      // Render numeric CSS values as explicit "Npx" strings so server and
      // client produce identical inline-style strings — avoids a hydration
      // mismatch when browser extensions or React serializers normalize
      // numeric style values differently across SSR/CSR.
      style={{
        width: `${size}px`,
        height: `${size}px`,
        transform: `translate(calc(${x}px - 50%), calc(${y}px - 50%))`,
        zIndex: hovered ? 20 : 10,
      }}
      suppressHydrationWarning
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className={`
          relative w-full h-full p-2.5
          rounded-full flex items-center justify-center bg-white
          transition-all duration-300 cursor-pointer
          ${hovered ? "scale-110" : ""}
        `}
        style={{
          border: "1px solid rgba(230,220,198,1)",
          boxShadow: hovered
            ? "0 8px 28px rgba(196,100,73,0.22), 0 0 0 1px rgba(196,100,73,0.30)"
            : "0 2px 10px rgba(31,29,26,0.08)",
        }}
      >
        <Image
          src={`/logos/${file}`}
          alt={label}
          width={size - 16}
          height={size - 16}
          className="w-full h-full"
        />
        {hovered && (
          <div className="absolute -bottom-9 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-ink rounded text-[11px] text-paper whitespace-nowrap pointer-events-none uppercase tracking-[0.1em]">
            {label}
          </div>
        )}
      </div>
    </div>
  );
});
OrbitingIntegration.displayName = "OrbitingIntegration";

// ─── Glowing orbit ring ────────────────────────────────────────────────
const OrbitRing = memo(({ radius, color, delay = 0 }: { radius: number; color: OrbitColor; delay?: number }) => {
  const palette =
    color === "coral"
      ? {
          edge: "rgba(196,100,73,0.28)",
          glow: "rgba(196,100,73,0.10)",
          inner: "rgba(196,100,73,0.04)",
        }
      : {
          edge: "rgba(31,29,26,0.22)",
          glow: "rgba(31,29,26,0.06)",
          inner: "rgba(31,29,26,0.02)",
        };

  return (
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
      style={{ width: radius * 2, height: radius * 2 }}
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, transparent 55%, ${palette.glow} 88%, ${palette.edge} 100%)`,
          animation: "orbit-pulse 6s ease-in-out infinite",
          animationDelay: `${delay}s`,
        }}
      />
      <div
        className="absolute inset-0 rounded-full"
        style={{
          border: `1px solid ${palette.edge}`,
          boxShadow: `inset 0 0 24px ${palette.inner}`,
        }}
      />
    </div>
  );
});
OrbitRing.displayName = "OrbitRing";

// ─── Section ───────────────────────────────────────────────────────────
export function LandingIntegrations() {
  const [time, setTime] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    let raf: number;
    let last = performance.now();
    const tick = (now: number) => {
      setTime(t => t + (now - last) / 1000);
      last = now;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [paused]);

  return (
    <section className="relative py-12 sm:py-16 px-4 sm:px-8 bg-paper">
      <div className="w-full">
        <div className="relative bg-paper-hi border border-paper-edge rounded-[2.5rem] shadow-[0_16px_64px_rgba(31,29,26,0.08)] overflow-hidden min-h-[560px]">
          {/* visible grid pattern */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(31,29,26,0.10) 1px, transparent 1px), linear-gradient(to bottom, rgba(31,29,26,0.10) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
              maskImage: "radial-gradient(ellipse at center, black 60%, transparent 95%)",
            }}
          />
          {/* small "+" intersection marks at every 4th gridline for editorial feel */}
          <div
            className="absolute inset-0 pointer-events-none opacity-50"
            style={{
              backgroundImage: `radial-gradient(circle, rgba(31,29,26,0.18) 1px, transparent 1.5px)`,
              backgroundSize: "224px 224px",
              backgroundPosition: "28px 28px",
            }}
          />
          {/* soft coral wash bleeding from the orbit side */}
          <div
            className="absolute inset-y-0 right-0 w-2/3 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 75% 50%, rgba(196,100,73,0.14), transparent 65%)",
            }}
          />

          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center p-10 sm:p-12 lg:p-16 min-h-[560px] max-w-[1400px] mx-auto">
            {/* Copy */}
            <div>
          <div className="label mb-3">Integrations</div>
          <h2 className="serif text-4xl sm:text-5xl text-ink leading-[1.05]">
            Plugs into the stack <span className="italic-serif text-coral-deep">you already use</span>.
          </h2>
          <p className="mt-5 text-lg text-ink-faint max-w-md">
            Aluqos lives where your team already works — Slack, Linear, Notion, GitHub, Figma.
            No migration, no second source of truth.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {integrationsConfig.map(t => (
              <span key={t.id} className="text-[11px] uppercase tracking-[0.12em] text-ink-faint border border-paper-edge bg-paper-hi rounded-full px-3 py-1">
                {t.label}
              </span>
            ))}
          </div>
        </div>

        {/* Orbit visual */}
        <div className="relative flex items-center justify-center">
          <div
            className="relative w-[480px] h-[480px] max-w-full flex items-center justify-center"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {/* Center brand mark — actual Aluqos LogoMark */}
            <div className="relative z-20 flex items-center justify-center">
              <div
                className="absolute inset-0 -m-6 rounded-full"
                style={{
                  background: "radial-gradient(circle, rgba(196,100,73,0.45), transparent 70%)",
                  filter: "blur(18px)",
                  animation: "orbit-pulse 4s ease-in-out infinite",
                }}
              />
              <LogoMark className="relative w-[88px] h-[88px] rounded-[20px] shadow-[0_12px_40px_rgba(31,29,26,0.3)]" />
            </div>

            {/* Orbit rings */}
            <OrbitRing radius={110} color="ink" delay={0} />
            <OrbitRing radius={200} color="coral" delay={1.5} />

            {/* Orbiting integrations */}
            {integrationsConfig.map(c => (
              <OrbitingIntegration
                key={c.id}
                config={c}
                angle={time * c.speed + c.phaseShift}
              />
            ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
