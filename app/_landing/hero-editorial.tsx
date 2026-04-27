"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { WorkspaceMockup } from "./workspace-mockup";
import { EarlyAccessDialog } from "./early-access-dialog";
import { TryDemoButton } from "./try-demo-button";
import { EASE, Reveal } from "./motion-primitives";

export function LandingHeroEditorial() {
  const reduced = useReducedMotion() ?? false;
  const sectionRef = useRef<HTMLElement>(null);

  // Cursor-driven spotlight: smoothly chase the pointer position via rAF.
  // Writes --hero-mx / --hero-my to both glow layers; CSS keyframes still own
  // the second blob's path. Skipped under prefers-reduced-motion.
  useEffect(() => {
    if (reduced) return;
    const section = sectionRef.current;
    if (!section) return;
    const layers = section.querySelectorAll<HTMLElement>(
      ".hero-glow-mask, .hero-glow-ambient",
    );
    if (layers.length === 0) return;

    let targetX = 50;
    let targetY = 40;
    let currentX = 50;
    let currentY = 40;
    let rafId = 0;

    const onMove = (e: PointerEvent) => {
      const rect = section.getBoundingClientRect();
      targetX = ((e.clientX - rect.left) / rect.width) * 100;
      targetY = ((e.clientY - rect.top) / rect.height) * 100;
    };

    const tick = () => {
      currentX += (targetX - currentX) * 0.1;
      currentY += (targetY - currentY) * 0.1;
      const mx = `${currentX.toFixed(2)}%`;
      const my = `${currentY.toFixed(2)}%`;
      layers.forEach((el) => {
        el.style.setProperty("--hero-mx", mx);
        el.style.setProperty("--hero-my", my);
      });
      rafId = requestAnimationFrame(tick);
    };

    section.addEventListener("pointermove", onMove);
    rafId = requestAnimationFrame(tick);

    return () => {
      section.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(rafId);
    };
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative pt-24 pb-10 lg:pt-32 lg:pb-16 overflow-hidden"
    >
      {/* Background stack — explicit z-0 so it always sits behind content */}
      {/* Warm halo that fills the gaps between lit dots, following the spotlight */}
      <div
        aria-hidden
        className="hero-glow-ambient pointer-events-none absolute inset-0 z-0"
      />

      {/* Base dot grid — uniform grey, edge-to-edge */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 [background-image:radial-gradient(circle,#9a9388_1.2px,transparent_1.2px)] [background-size:20px_20px]"
      />

      {/* Coral overlay dots — same grid, masked by a wandering spotlight.
          Where the spotlight is, coral dots replace grey. As it moves, dots light up
          and dim back to grey. */}
      <div
        aria-hidden
        className="hero-glow-mask pointer-events-none absolute inset-0 z-0 [background-image:radial-gradient(circle,var(--color-coral)_1.4px,transparent_1.4px)] [background-size:20px_20px]"
      />

      {/* Vertical rotated badge — anchored to the right edge of the section */}
      <div
        aria-hidden
        className="hidden lg:flex absolute right-0 top-[260px] items-center z-10"
      >
        <div className="bg-ink text-paper py-5 px-2.5 text-[10px] tracking-[0.22em] font-medium">
          <span className="[writing-mode:vertical-rl] rotate-180">
            EARLY ACCESS · COHORT 02
          </span>
        </div>
      </div>

      {/* Top label */}
      <div className="relative z-10 max-w-[1280px] mx-auto px-6">
        <Reveal>
          <div className="inline-flex items-center gap-2 rounded-full border border-paper-edge bg-paper-hi px-3 py-1.5">
            <span className="relative flex size-1.5">
              <span className="absolute inset-0 rounded-full bg-emerald-500 opacity-60 animate-ping" />
              <span className="relative size-1.5 rounded-full bg-emerald-500" />
            </span>
            <span className="label">Private beta · Now reviewing applications</span>
          </div>
        </Reveal>
      </div>

      {/* Editorial stacked headline + side caption */}
      <div className="relative z-10 max-w-[1280px] mx-auto px-6 mt-10 lg:mt-14">
        <div className="grid grid-cols-12 gap-6 lg:gap-10 items-start">
          {/* Headline column */}
          <div className="col-span-12 lg:col-span-9">
            <h1 className="serif text-[clamp(56px,10vw,148px)] leading-[0.92] tracking-[-0.035em] text-ink">
              <Reveal y={32}>
                <span className="block">AI employees</span>
              </Reveal>
              <Reveal y={32} delay={0.08}>
                <span className="block">that learn</span>
              </Reveal>
              <Reveal y={32} delay={0.16}>
                <span className="block">
                  how <span className="italic-serif text-coral-deep">you work.</span>
                </span>
              </Reveal>
            </h1>

            <Reveal delay={0.28}>
              <p className="mt-6 lg:mt-8 italic-serif text-[clamp(22px,2.6vw,34px)] leading-[1.2] text-ink-muted pl-1">
                Not the other way around.
              </p>
            </Reveal>
          </div>

          {/* Side caption + meta */}
          <div className="col-span-12 lg:col-span-3 lg:-mt-20 space-y-4 max-w-[280px]">
            <Reveal delay={0.2}>
              <div className="bg-paper-hi border border-paper-edge rounded-lg p-5 shadow-[0_1px_0_rgba(60,40,20,0.04)]">
                <div className="label mb-3">Problem</div>
                <p className="text-[15px] lg:text-[16px] leading-[1.55] text-ink">
                  Most AI needs prompts, training, and an engineer.{" "}
                  <span className="text-ink-muted">
                    Your team tries it once and quits.
                  </span>
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.26}>
              <div className="bg-paper-hi border border-paper-edge rounded-lg p-5 shadow-[0_1px_0_rgba(60,40,20,0.04)]">
                <div className="label mb-3">Solution</div>
                <p className="text-[15px] lg:text-[16px] leading-[1.55] text-ink">
                  Aluqos watches how you actually work.{" "}
                  <span className="text-ink-muted">
                    Then does the job. No setup, no prompting.
                  </span>
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.32}>
              <div className="bg-paper-hi border border-paper-edge rounded-lg p-5 shadow-[0_1px_0_rgba(60,40,20,0.04)]">
                <div className="label mb-3">Future</div>
                <p className="text-[15px] lg:text-[16px] leading-[1.55] text-ink">
                  Start with one hire. Grow to a whole team.{" "}
                  <span className="text-ink-muted">
                    Same product. No migration, ever.
                  </span>
                </p>
              </div>
            </Reveal>
          </div>
        </div>

        {/* CTAs — left-aligned, editorial */}
        <Reveal delay={0.36}>
          <div className="mt-12 lg:mt-14 flex flex-wrap items-center gap-3">
            <EarlyAccessDialog
              triggerLabel="Sign up for waitlist"
              triggerVariant="ink"
              triggerSize="lg"
              source="hero"
            />
            <TryDemoButton />
          </div>
        </Reveal>
      </div>

      {/* Mockup with editorial figure caption */}
      <div className="relative z-10 mt-20 lg:mt-28 max-w-[1280px] mx-auto px-6">
        <motion.figure
          initial={{ opacity: 0, y: reduced ? 0 : 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: reduced ? 0 : 0.8, delay: reduced ? 0 : 0.15, ease: EASE }}
          aria-hidden
          className="pointer-events-none select-none"
        >
          <div className="relative">
            <div className="absolute -inset-6 lg:-inset-8 bg-paper-hi rounded-2xl -z-10" />
            <WorkspaceMockup />
          </div>
          <figcaption className="label mt-6 lg:mt-8 flex items-baseline gap-3">
            <span className="text-coral">Fig. 01</span>
            <span>The workspace, day one. Customer data redacted.</span>
          </figcaption>
        </motion.figure>
      </div>
    </section>
  );
}
