# Changelog

## Unreleased — Visual QA round 2 (2026-04-28)

- Real fix for "How it works" step bleed-through: previous patch applied a 200ms `transition-delay` to the whole `transition-[opacity,transform,visibility]` shorthand, which held the outgoing card at opacity 1 for 200ms while the incoming card was already fading in. Replaced the shorthand with explicit per-property transitions: `opacity 200ms ease-out, transform 200ms ease-out, visibility 0s linear {0s when becoming active, 200ms when becoming inactive}`. Visibility now lags only on the way out; opacity always animates immediately. Future maintainer note: do not add a single shared `transition-delay` to a multi-property shorthand on this component — opacity and visibility need different delay rules.
- Navbar backdrop strengthened: scrolled pill bumped 60→80% opacity; un-scrolled bar bumped 40→70% opacity + added `backdrop-saturate-150`. Headlines passing under the nav now read as de-emphasized rather than bleeding through.
- Vertical voids tightened: team `mt-12 → mt-8`, founders `mt-12 → mt-8`, team "Next up" header `mt-14 → mt-10`, integrations card `min-h-[720px] → min-h-[560px]` and inner `lg:p-24 → lg:p-16`.
- Italic accents in h2's standardized to `text-coral-deep` (matching the hero "AI." treatment) — was inconsistent `text-ink-faint` across team / founders / cta / how it works.

## 2026-04-28 — Visual QA fixes round 1

- Hero h1 / subhead / cards / CTAs no longer wrapped in `<Reveal>`; intersection-observer animations were racing with hydration, leaving the headline blank on first paint. Headline now renders instantly.
- Hero workspace mockup figure removed — redundant with the better demo three sections down, and was pushing Pain/Shift/Trust below the fold.
- Hero top padding reduced (pt-24 → pt-16); Pain/Shift/Trust + CTA now visible above the fold on a 1456×840 viewport.
- "How it works" step crossfade tightened (500ms → 200ms) and inactive cards now flip to `visibility: hidden` after fade-out so DOM text can't bleed through during scroll.
- `scroll-padding-top` bumped 100→110px so anchor links land cleanly below the floating nav.
- Section padding reduced site-wide (py-24/py-32 → py-16/py-24) on team, founders, pricing.

## 2026-04-28 — Homepage rewrite for depth

- Hero leads with the auto-discovery thesis ("Stop configuring AI. It should configure itself.") and replaces the generic "AI employees" frame.
- "How it works" rewritten as the Week 1 / Week 2 / Week 3 narrative: it watches → it proposes → it ships. Autonomy slider is now Week 3's visual hero.
- Bento feature-tile grid removed from the homepage; redundant with the new narrative.
- Role section centers Alex (PM) — Jordan and Sam demoted to "Next up" so the page tells one strong story instead of three half-told ones.
- New founders section: 4 photos + one credibility line each, anchored to unfair advantages (SOC, Red Hat on-call, T-Mobile carrier-scale, ClickHouse/Kafka data infra).
- Trust strip relabeled "Early Access Partners"; fake stats removed; quote slots wired with `TODO` markers for real pull-quotes.
- Pricing block added: Free trial / $299 per agent / Enterprise contact-sales — anchors the workforce frame.
- Waitlist form question swapped from "What would you put an AI employee on first?" to "What's the most repetitive thing on your team's plate?" to capture pain.
