# Saathi — Walkthrough & Workspace Design

**Date:** 2026-04-25
**Scope:** First product surface for Saathi: the shared 6-phase onboarding walkthrough and the per-employee workspace, built for one role (Alex, the AI Product Manager).
**Status:** Design approved. Implementation plan to follow via `superpowers:writing-plans`.

## Goal

Ship a YC-demo-ready vertical slice of Saathi: a user can land on the homepage, "hire" Alex the AI Product Manager, go through the full onboarding walkthrough, and end up in a workspace where Alex is already drafting a real PRD streamed from Claude. The flow must feel indistinguishable from a real product, while being internally simplified to one role, one user, no auth, and faked external integrations.

This vertical sets the pattern that Jordan (PgM) and Sam (Marketing) will follow in subsequent rounds. Out of scope here: Jordan, Sam, multi-user, billing, settings.

## Source material

- `Saathi_OnePager_YC copy.docx` — product positioning ("AI employees that learn how you work").
- `Saathi_MVP_Spec.docx` — the demo-first MVP spec. We follow its 6-phase onboarding flow, its avatar/personality model, and its "Permission to fake it" rule.

## Decisions locked during brainstorm

| # | Decision | Rationale |
|---|---|---|
| 1 | "Dashboard" = the per-employee Workspace (not a team home) | User confirmed — single-screen work surface where Alex generates and refines PRDs. |
| 2 | One role only this round: Alex / Product Manager | Cleanest vertical slice. Single streaming PRD output is simpler than Jordan's structured sections or Sam's parallel cards. |
| 3 | Real Claude calls + faked external integrations | Matches spec's "demo > architecture" — real where it's the magic moment, theater where it's not. User wants the theater to look real. |
| 4 | Persistent Supabase, single hardcoded user, no auth | Survives refresh, supports "come back tomorrow" without the cost of real auth. Spec's DO NOT BUILD list explicitly excludes auth flows. |
| 5 | Editorial / Human aesthetic | Warm peachy-coral accent, serif headings (Iowan Old Style / Charter), sans body (Inter), paper background. Reinforces the "hire a colleague" metaphor over "configure a tool." |
| 6 | Hybrid AI fidelity | Real Claude for `understandContext` (Phase 2), `proposeActionPlan` (Phase 4), `generatePRD` (Phase 6 + workspace), `refinePRD` (workspace follow-ups). Static role-templates for Phase 3 questions. |
| 7 | All external integrations faked | GitHub, Jira, Notion, Slack — every "connect" / "send" button is theater with polished, committed UX consequences (toast, state change, sound). |
| 8 | Voice input is real | Whisper API. Small lift, magical moment. |

## Architecture

**Single Next.js 15 application** (App Router, TypeScript, Tailwind v4) deployed on Vercel.

- **Frontend:** React Server Components for static chrome, Client Components for the walkthrough state machine and streaming output. shadcn/ui as the primitive layer, restyled to the editorial aesthetic.
- **AI calls:** server actions and Edge route handlers using `@anthropic-ai/sdk` with model `claude-sonnet-4-6`. Streaming via the Vercel AI SDK (`ai` package).
- **File parsing:** Node-runtime parsers — `pdf-parse` for PDFs, `mammoth` for `.docx`, direct read for `.md` / `.txt`. LlamaIndex/Unstructured intentionally deferred — overkill for the demo path. Documented as the path to swap post-YC.
- **Persistence:** Supabase Postgres (data) + Supabase Storage (uploaded files). RLS off in dev; permissive single-user policy in any deployed environment.
- **State management:** server state (Supabase) is source of truth. Client uses RSC data + a thin Zustand store for in-flight streaming state.
- **Voice:** OpenAI Whisper (`whisper-1`) for transcription. One feature flag controls availability.
- **Hosting:** Vercel for the app + Edge functions, Supabase for DB + Storage. No separate workers, no queues.

The "demo > architecture" rule is the single most important architectural constraint: if a piece of infra doesn't make the demo more reliable or more impressive, we don't build it.

## Data model (Supabase)

Five tables. Every row references a single `user_id` from `process.env.SAATHI_DEMO_USER_ID`. Timestamps (`created_at`, `updated_at`) on every table; omitted below for brevity.

```
employees
  id               uuid pk
  user_id          uuid          -- always the demo user
  name             text          -- "Alex"
  role             text          -- "product_manager"
  bio              text          -- one-line personality string
  avatar_seed      text          -- deterministic avatar art seed
  status           text          -- onboarding | working | idle
  autonomy_level   text          -- ask_always | ask_external | just_do_it

onboarding_sessions
  id               uuid pk
  employee_id      uuid fk -> employees
  phase            int           -- 1..6, current position
  brief            jsonb         -- Phase 1 form answers
  context_summary  jsonb         -- Phase 2 "here's what I understood"
  observations     jsonb         -- Phase 3 answers
  action_plan      jsonb         -- Phase 4 generated tiers
  approvals        jsonb         -- Phase 5 user toggles per item
  completed_at     timestamptz

uploads
  id               uuid pk
  employee_id      uuid fk
  filename         text
  storage_path     text          -- Supabase Storage key
  mime_type        text
  parsed_text      text          -- extracted plain text
  parse_status     text          -- pending | done | failed

prds
  id               uuid pk
  employee_id      uuid fk
  title            text
  source_issue     text          -- e.g. "Issue #47"
  sections         jsonb         -- structured: problem/goals/users/scope/oos/metrics
  status           text          -- streaming | draft | edited | exported
  generated_at     timestamptz

events
  id               uuid pk
  employee_id      uuid fk
  type             text          -- onboarding_started | phase_completed | prd_generated | export_clicked | etc.
  payload          jsonb
```

**Key choices:**

- `onboarding_sessions` is **one row per employee**, not per attempt. Restarting onboarding overwrites it.
- `uploads.parsed_text` lives in Postgres so it's directly available to prompt context. Files stay in Storage for re-download / display.
- **No vector DB.** Single employee, ~5–10 docs, well under 200K tokens. We stuff parsed text into the system prompt context window. Documented as the slot for embeddings post-YC.
- `prds.sections` is structured JSON (one key per section), not raw markdown — enables independently-editable section blocks.
- `events` powers analytics, server-side error logging (`type='error'`), and any future "here's what I did today" feed.

**Seeding the demo employee.** A `pnpm db:seed` script inserts the canonical Alex row (`name: "Alex"`, `role: "product_manager"`, `bio`, `avatar_seed`, `status: "idle"`) for the configured `SAATHI_DEMO_USER_ID`. The homepage's "Hire an AI Product Manager" button finds this seeded row, transitions it to `status='onboarding'`, and routes to `/onboarding/[employeeId]`. There is no employee creation flow in the UI — Alex is a singleton.

## The Walkthrough

Single route: **`/onboarding/[employeeId]`**. State machine driven by `onboarding_sessions.phase`. URL stays stable across phases. Refresh-safe — returns to the current phase.

**Layout:** centered ~720px column, generous vertical rhythm, paper background, avatar persists in a small fixed corner card showing Alex's current state. No numeric progress bar — instead a small serif label top-left ("Day one — getting acquainted") that softens between phases. Reinforces the human metaphor.

### Phase 1 — Brief the intern

- Six-field form, **one field at a time** (typeform cadence): project + role + top-3 priorities + #1 time-sink + team (optional) + tools (chip selector).
- Then a prominent dropzone — drag PDFs/.docx/.md/.txt or paste a Notion URL. **Minimum 1 doc to advance.**
- Submit creates `uploads` rows, persists `onboarding_sessions.brief`, and kicks off Phase 2 in the background.

### Phase 2 — The reading moment

This is the trust-builder.

- While parsing + the `understandContext` Claude call run (~6–12s), the screen streams lines in sequence with typewriter cadence: *"Reading saathi-mvp/main…"* → *"Reviewing the launch brief…"* → *"Picking up your writing style…"*.
- Lines are **keyed off real filenames** of the uploaded docs, not generic placeholders.
- When the Claude response finishes, the screen morphs into the **"Here's what I understood"** card: three serif-headed sections (*Project context / Your role and priorities / How you communicate*), each editable inline.
- Two buttons: **"That's right, keep going"** / **"Let me correct this"** (latter expands all sections to edit mode).
- Persists `context_summary`.

### Phase 3 — Observe how you work

- Five role-specific questions for PM (from spec): PRD depth, stakeholders, "done" definition, scope-creep posture, sample PRD upload.
- Plus the global **decision-style selector**: ask everything / flag blockers only / just do it.
- Sample PRD upload is a separate dropzone.
- One question per screen, smooth forward/back, no walls of fields.
- Persists `observations`.

### Phase 4 — The action plan

The wow moment.

- Server kicks off `proposeActionPlan` Claude call with the full context (brief + summary + observations + parsed docs).
- Streams in three tiers: *"I will own"*, *"I will assist on"*, *"I will flag"* — 3–5 items per tier, each with a one-sentence rationale.
- Items appear one at a time with typewriter cadence. Avatar pulses while streaming.
- **No skeleton loaders** — real text the moment the first token arrives.

### Phase 5 — Approve

- Each action plan item gets three states (Approved / Modify / Remove) as a segmented control. Modify expands inline edit.
- Below the list: a slim summary line — *"Alex will own 3 tasks, assist on 2, and flag 4 things."*
- Global **autonomy slider** (3-position): ask everything / ask for external actions / just do it.
- One large primary CTA: **"Start working"**.
- Click persists `approvals` + `autonomy_level`, marks `completed_at`, transitions Alex to `status='working'`, navigates to the workspace.

### Phase 6 — First task auto-runs

- Workspace loads with Alex *already* generating a PRD for the fixture's "Issue #47 — Add bulk export for analytics dashboard."
- No "what would you like me to do?" prompt. The PRD is streaming when you arrive.
- This is the critical handoff. The walkthrough does not end with success-state confetti. It ends with Alex already at work.

## The Workspace

Route: **`/work/[employeeId]`**. Single screen, two columns, no nav chrome.

```
┌──────────────────────────────────────────────────────────────┐
│  [A] Alex · AI Product Manager        [Status pill]   [⋯]    │
├──────────────────────────────┬───────────────────────────────┤
│  LEFT — context & input      │  RIGHT — work surface         │
│  (~38% width, sticky)        │  (~62% width)                 │
│                              │                               │
│  Current focus pill          │  ┌─ PRD: Issue #47 ─────────┐ │
│  Source materials list       │  │  Problem statement       │ │
│   (uploaded docs +           │  │  Goals                   │ │
│    "Add more")               │  │  User stories            │ │
│  Action plan rail            │  │  Scope / Out of scope    │ │
│   (own/assist/flag tiers,    │  │  Success metrics         │ │
│    each clickable to start   │  │                          │ │
│    a new task)               │  │  [Edit any section]      │ │
│  Free-text input             │  └──────────────────────────┘ │
│   "Ask Alex something…"      │  Follow-up chips:             │
│                              │  [Add API spec] [Write tickets]│
│                              │  [Simplify] [Tighten scope]   │
│                              │  [Export ▾] [Save as draft]   │
└──────────────────────────────┴───────────────────────────────┘
```

**Behaviors:**

- **Streaming PRD renderer.** Sections render as individual editable blocks (one component per section). While streaming, only the current section shows the typewriter; finished sections lock and become editable. The user can start editing earlier sections while later sections are still streaming.
- **Editing.** Click any section heading or body → in-place rich-text edit (Tiptap, minimal toolbar — bold/italic/lists/links). Edits persist on blur to `prds.sections`. Status flips to `edited`.
- **Follow-up prompts.** The four chips below the PRD invoke a `refinePRD` Claude call — system prompt receives current sections JSON + the action ("Add API spec"), returns a diff applied to the relevant section. Streams in place. Free-text input does the same with a custom instruction.
- **Source materials list.** Uploaded fixture docs from onboarding plus an "Add more" button (re-uses the Phase 1 dropzone). New uploads parse, get added to context, trigger an avatar status flicker — *"Alex is reading two new docs."*
- **Action plan rail.** Renders the approved tiers from `onboarding_sessions.action_plan`. Each "I will own" item is clickable → starts a new PRD. The current PRD goes into a small "Recent work" stack at the bottom of the right column.
- **Status pill on avatar.** Live state: *Reading* / *Drafting* / *Idle* / *Exporting*. Subtle pulse when active.
- **Export button.** Three options: Notion (toast + downloads .md), Jira (toast with fake ticket key), Slack (toast). All look polished, all faked.
- **No tabs, no settings, no nav.** Spec says don't build them. The workspace is the product.

**Returning later:** workspace shows the most recent PRD on the right with full final state (no token replay). Below it: a slim "Recent work" stack of prior PRDs, each clickable.

## AI prompts (overview)

Four structured Claude prompts. Each is a single function in `src/ai/prompts/`. All use streaming and emit structured JSON where applicable.

| Prompt | Inputs | Output | Streamed? |
|---|---|---|---|
| `understandContext` | brief + parsed_text from all uploads | JSON `{ project_context, role_and_priorities, how_you_communicate }` (each a paragraph) | yes — show fields as they arrive |
| `proposeActionPlan` | brief + context_summary + observations + parsed_text | JSON `{ own: Item[], assist: Item[], flag: Item[] }`, each `Item = { title, rationale }` | yes — items appear one at a time |
| `generatePRD` | full context + source issue/topic | JSON `{ title, sections: { problem, goals, user_stories, scope, out_of_scope, success_metrics } }` | yes — sections appear in order |
| `refinePRD` | current sections JSON + action ("Add API spec" / custom string) | JSON diff: `{ section_key, new_content }` | yes — streams into the targeted section |

System prompts enforce: PM best practices, the user's writing style (extracted in Phase 2), and the user's quality bar (sample PRD from Phase 3). Tone calibration ("for engineers or execs?") is a session-level field set once and threaded through all prompts.

## Faked integrations

Every external service is theater. The lie commits.

| Service | Demo behavior |
|---|---|
| GitHub "Connect repo" | Real-looking GitHub OAuth modal (rendered ourselves). 2s spinner. "Connected to nicolasdossantos/saathi-mvp" with the GitHub logo. Reads from `fixtures/demo/saathi-mvp/`. |
| Jira "Update tickets" / Send | Atlassian-blue toast, real-looking ticket key (`Created ENG-1248`). No API call. |
| Notion "Export PRD" | "Exported to Notion · saathi.notion.site/prd-1248" toast. Downloads a real `.md` file locally. No API call. |
| Slack OAuth / channel picker / send | Real Slack-modal styling, fake channel picker, fake success. Channel read during onboarding cites pre-baked fake messages so Phase 4 rationale can mention "I noticed @marie asked about bulk export." Never touches Slack. |
| Voice input | **Real** — Whisper-compatible transcription. Native mic button. Drops text into the active input. |

**Critical UX rule:** every faked button must trigger a visible, polished consequence — toast, state change, subtle sound, animation. We treat each faked moment as a designed UX beat, not a placeholder.

## Demo fixture

Hardcoded, baked into the repo at `fixtures/demo/`.

- `fixtures/demo/saathi-mvp/` — small but real-looking Next.js repo (README, a few TS files, fake `package.json`, `docs/` folder). Just enough that "Reading saathi-mvp/main…" scans real filenames.
- `fixtures/demo/q2-roadmap.pdf` — 3-page real PDF, hand-written PM content (not Claude-generated, so the writing-style pickup feels accurate).
- `fixtures/demo/issue-47.json` — issue title, body, labels. Triggers Phase 6's auto-PRD.
- `fixtures/demo/sample-prd.pdf` — a "PRD you're proud of" for Phase 3 upload.
- `fixtures/demo/canned-responses/` — pre-recorded streaming responses for each of the four Claude prompts, used as offline fallback (see Resilience).
- `fixtures/demo/slack-messages.json` — fake recent channel messages for the faked Slack read flow.

A hidden **"Use demo data"** button on the Phase 1 dropzone surfaces the fixture: click and the four files appear pre-uploaded. Parsing pipeline still runs on them, so the path is identical to a real upload.

## Demo path resilience

The demo path is the canonical flow:

1. Land on `/` → "Hire an AI Product Manager"
2. Walkthrough Phases 1–5 with the demo fixture (via "Use demo data")
3. Phase 6 → Workspace with PRD streaming for Issue #47
4. Click a follow-up chip → live edit
5. Click Export → Notion / Jira / Slack toast

**Resilience requirements:**

- **Offline fallback for Claude calls.** If the Anthropic API is unreachable or slow (>10s to first token), serve a pre-recorded streaming response from `fixtures/demo/canned-responses/`. Same Issue #47 PRD, same cadence. The user cannot tell. The demo cannot break on conference wifi.
- **Hard 8s timeout on doc parsing.** If parsing takes longer (corrupt PDF, etc.), silently swap in a pre-parsed cache. Demo fixture ships both raw files and pre-parsed text.
- **No loading spinners on the demo path.** Real Claude calls always start streaming within 2s; if not, fallback fires before the user sees a spinner.

## Error handling

Minimal, demo-path only.

- Off-path errors (50MB upload, weird MIME, network drop mid-stream) → friendly toast: *"Alex hit a snag. Mind trying that again?"* No stack traces, no broken states.
- Server actions wrap in try/catch and log via the `events` table with `type='error'` for post-demo debugging. User-facing message stays in colleague tone.
- No retry logic, no exponential backoff, no queues. If it fails, the user retries.

## Testing

Proportional to the demo.

- **One Playwright E2E test:** the demo path end-to-end. Uses the "Use demo data" hidden button. Asserts: Phase 1 → Phase 6 → PRD streamed → follow-up chip applied → export toast shown. **This is the smoke test that runs on every commit.** If it breaks, the demo is broken.
- **Unit tests** only on:
  - Structured prompt parsers (action plan tier extraction, PRD section structuring).
  - Integration-fake state machines (OAuth modals, toasts).
- **No tests** on visual styling, hover states, faked OAuth modals — rehearse against the actual UI.

A `pnpm demo:reset` script wipes the demo user's Supabase rows and re-uploads fixture files. Run before every rehearsal. Run before the YC demo.

## Out of scope (for this round)

- Jordan (Program Manager) and Sam (Marketing) employees.
- Multi-user / auth / billing / settings.
- Real GitHub / Jira / Notion / Slack integrations.
- Mobile responsiveness.
- Vector embeddings / RAG.
- Background workers, queues, observability beyond the `events` table.
- Daily summary, weekly learning summary (spec marks SHOULD/NICE — defer).
- Campaign calendar, tone variants, multi-channel marketing output (Sam-specific).

## File / directory shape (target)

```
saathi2/
├─ app/
│  ├─ page.tsx                     -- homepage, "Hire an AI Product Manager"
│  ├─ onboarding/[employeeId]/
│  │  ├─ page.tsx                  -- walkthrough state machine entry
│  │  └─ _phases/
│  │     ├─ phase-1-brief.tsx
│  │     ├─ phase-2-reading.tsx
│  │     ├─ phase-3-observe.tsx
│  │     ├─ phase-4-plan.tsx
│  │     └─ phase-5-approve.tsx
│  ├─ work/[employeeId]/
│  │  └─ page.tsx                  -- workspace
│  └─ api/
│     ├─ ai/understand/route.ts
│     ├─ ai/plan/route.ts
│     ├─ ai/prd/route.ts
│     └─ ai/refine/route.ts
├─ src/
│  ├─ ai/
│  │  ├─ prompts/                  -- four prompt builders
│  │  ├─ fallback.ts               -- offline canned responses
│  │  └─ stream.ts                 -- streaming utilities
│  ├─ db/
│  │  ├─ schema.sql                -- Supabase migrations
│  │  └─ queries.ts                -- typed query helpers
│  ├─ parsing/
│  │  ├─ pdf.ts
│  │  ├─ docx.ts
│  │  └─ md.ts
│  ├─ fakes/                       -- faked integration components
│  │  ├─ github-modal.tsx
│  │  ├─ jira-toast.tsx
│  │  ├─ notion-export.tsx
│  │  └─ slack-modal.tsx
│  ├─ ui/                          -- shadcn primitives + editorial restyle
│  └─ store/                       -- zustand store for in-flight state
├─ fixtures/demo/                  -- the sacred fixture
├─ tests/
│  └─ e2e/demo-path.spec.ts
└─ docs/superpowers/specs/         -- this spec
```

## Open questions

None blocking. Implementation can proceed.
