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
          {/* Headline variants considered (kept as a record for the team):
              A. "The AI that watches how you work — and builds the workflow you didn't know you needed."
              B. "Stop configuring AI. Aluqos watches, learns, and ships the workflow itself."   ← chosen
              C. "Your team's busywork, automated by an AI that figured out how you work on its own."
              We picked B because it leads with the verb the buyer cares about
              ("stop configuring"), names the action ("watches, learns, ships"),
              and drops the worn-out "AI employees" frame. */}
          <div className="col-span-12 lg:col-span-9">
            <h1 className="serif text-[clamp(44px,7vw,96px)] leading-[0.95] tracking-[-0.03em] text-ink">
              <Reveal y={32}>
                <span className="block">Stop configuring</span>
              </Reveal>
              <Reveal y={32} delay={0.08}>
                <span className="block italic-serif text-coral-deep">AI.</span>
              </Reveal>
              <Reveal y={32} delay={0.16}>
                <span className="block">It configures itself.</span>
              </Reveal>
            </h1>

            <Reveal delay={0.28}>
              <p className="mt-6 lg:mt-8 italic-serif text-[clamp(22px,2.6vw,34px)] leading-[1.2] text-ink-muted pl-1 max-w-[28ch]">
                Aluqos watches how your team actually works — then ships the workflows that save you hours.
              </p>
            </Reveal>
          </div>

          {/* Side caption + meta — compact so the column matches the
              headline's height and the CTAs stay above the fold. */}
          <div className="col-span-12 lg:col-span-3 lg:self-stretch flex flex-col gap-3 lg:gap-3.5">
            <Reveal delay={0.2} className="flex-1 flex">
              <div className="flex-1 flex flex-col bg-paper-hi border border-paper-edge rounded-lg p-4 lg:p-5 shadow-[0_2px_8px_rgba(60,40,20,0.05)]">
                <div className="label mb-2 text-coral-deep text-[10px]">Pain</div>
                <p className="text-[13px] lg:text-[14px] leading-[1.45] text-ink">
                  Most AI dies in pilot.{" "}
                  <span className="text-ink-muted">
                    Nobody has time to prompt or configure it.
                  </span>
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.26} className="flex-1 flex">
              <div className="flex-1 flex flex-col bg-paper-hi border border-paper-edge rounded-lg p-4 lg:p-5 shadow-[0_2px_8px_rgba(60,40,20,0.05)]">
                <div className="label mb-2 text-coral-deep text-[10px]">Shift</div>
                <p className="text-[13px] lg:text-[14px] leading-[1.45] text-ink">
                  Aluqos observes for a week.{" "}
                  <span className="text-ink-muted">
                    Then ships the workflows that save the most hours.
                  </span>
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.32} className="flex-1 flex">
              <div className="flex-1 flex flex-col bg-paper-hi border border-paper-edge rounded-lg p-4 lg:p-5 shadow-[0_2px_8px_rgba(60,40,20,0.05)]">
                <div className="label mb-2 text-coral-deep text-[10px]">Trust</div>
                <p className="text-[13px] lg:text-[14px] leading-[1.45] text-ink">
                  You hold the leash.{" "}
                  <span className="text-ink-muted">
                    Per-workflow autonomy — confirm-all to fully autonomous.
                  </span>
                </p>
              </div>
            </Reveal>
          </div>
        </div>

        {/* CTAs — left-aligned, editorial */}
        <Reveal delay={0.36}>
          <div className="mt-8 lg:mt-10 flex flex-wrap items-center gap-3">
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
            <span>Day eight. Aluqos has shipped its first proposed workflow.</span>
          </figcaption>
        </motion.figure>
      </div>
    </section>
  );
}
