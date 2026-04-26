# Saathi Walkthrough & Workspace Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a YC-demo-ready vertical slice of Saathi — homepage → 6-phase onboarding walkthrough → workspace where Alex (AI Product Manager) is already streaming a real PRD.

**Architecture:** Single Next.js 15 application (App Router, TS, Tailwind v4) with Server Actions and Edge-runtime AI streams. Supabase Postgres + Storage for persistence. Real Claude (`claude-sonnet-4-6`) calls for the four AI moments; all external service integrations (GitHub / Jira / Notion / Slack) are faked with polished theater. Single hardcoded demo user, no auth.

**Tech Stack:** Next.js 15, TypeScript, Tailwind v4, shadcn/ui, Supabase JS client, `@anthropic-ai/sdk`, `ai` (Vercel AI SDK), `pdf-parse`, `mammoth`, `tiptap`, `zustand`, `playwright`, `pnpm`.

**Reference spec:** `docs/superpowers/specs/2026-04-25-saathi-walkthrough-workspace-design.md` (read before starting any task).

---

## Testing philosophy

The spec is explicit: "demo > architecture." Apply TDD to logic, skip it for visuals.

- **TDD (red → green → commit):** file parsers, prompt-output structuring/parsers, Supabase query helpers, integration-fake state machines, the offline-fallback selector.
- **Build-and-smoke (no unit test):** UI components, layouts, Tailwind styling, animations.
- **One Playwright E2E:** the canonical demo path — `/` → walkthrough → workspace → follow-up → export. This is the smoke test for everything visual.

## File structure (target)

```
app/
  layout.tsx                                  # global theme + fonts
  page.tsx                                    # homepage
  onboarding/[employeeId]/
    page.tsx                                  # walkthrough state machine
    _phases/
      phase-1-brief.tsx
      phase-2-reading.tsx
      phase-3-observe.tsx
      phase-4-plan.tsx
      phase-5-approve.tsx
  work/[employeeId]/
    page.tsx                                  # workspace
  api/
    ai/understand/route.ts
    ai/plan/route.ts
    ai/prd/route.ts
    ai/refine/route.ts
    voice/route.ts
src/
  ai/
    client.ts                                 # anthropic client
    stream.ts                                 # streaming helpers
    fallback.ts                               # offline canned responses
    prompts/
      understand-context.ts
      propose-action-plan.ts
      generate-prd.ts
      refine-prd.ts
  db/
    schema.sql
    client.ts                                 # supabase clients (server / browser)
    queries.ts                                # typed query helpers
    seed.ts                                   # demo employee seed
    reset.ts                                  # demo reset
  parsing/
    pdf.ts
    docx.ts
    md.ts
    parse-upload.ts                           # dispatcher
  fakes/
    github-modal.tsx
    jira-toast.tsx
    notion-export.tsx
    slack-modal.tsx
  components/
    avatar-card.tsx
    status-pill.tsx
    serif.tsx
    typewriter-line.tsx
    dropzone.tsx
  store/
    walkthrough.ts                            # zustand
    workspace.ts                              # zustand
  ui/                                         # shadcn primitives, restyled
fixtures/demo/
  saathi-mvp/                                 # fake repo
  q2-roadmap.pdf
  issue-47.json
  sample-prd.pdf
  slack-messages.json
  canned-responses/
    understand.json
    plan.json
    prd-issue-47.json
    refine-add-api-spec.json
tests/
  unit/                                       # vitest
  e2e/demo-path.spec.ts                       # playwright
```

---

## Phase A — Foundation (Tasks 1–5)

### Task 1: Bootstrap Next.js 15 + Tailwind v4 + TypeScript

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.mjs`, `app/layout.tsx`, `app/page.tsx`, `postcss.config.mjs`, `app/globals.css`

- [ ] **Step 1: Init pnpm and Next.js**

Run from project root:

```bash
pnpm dlx create-next-app@latest . \
  --ts --tailwind --eslint --app --src-dir false \
  --import-alias "@/*" --no-turbopack --yes
```

Expected: scaffolds package.json, app/, tsconfig.json. Pick "No" if asked to overwrite — just proceed.

- [ ] **Step 2: Pin to required versions**

Edit `package.json` `dependencies` to ensure:

```json
{
  "dependencies": {
    "next": "15.0.0",
    "react": "19.0.0",
    "react-dom": "19.0.0"
  }
}
```

Run: `pnpm install`

- [ ] **Step 3: Verify dev server boots**

Run: `pnpm dev`
Expected: server on http://localhost:3000 with default Next.js page rendering. Stop with Ctrl-C.

- [ ] **Step 4: Replace homepage with placeholder**

Create `app/page.tsx`:

```tsx
export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <p className="text-sm text-stone-500">Saathi · placeholder</p>
    </main>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: bootstrap Next.js 15 + Tailwind v4 + TS"
```

---

### Task 2: Editorial theme tokens (colors, fonts, base typography)

**Files:**
- Modify: `app/layout.tsx`, `app/globals.css`
- Create: `src/components/serif.tsx`

The aesthetic is fixed by the spec: warm peachy-coral accent, serif headings, sans body, paper background.

- [ ] **Step 1: Add fonts to layout**

Replace `app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Inter, Newsreader } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const serif = Newsreader({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Saathi",
  description: "AI employees that learn how you work.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${serif.variable}`}>
      <body className="bg-[--color-paper] text-[--color-ink] font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
```

(Newsreader is a free Google Font close in feel to Iowan Old Style / Charter; ship-friendly.)

- [ ] **Step 2: Define theme tokens in globals.css**

Replace `app/globals.css`:

```css
@import "tailwindcss";

@theme {
  --color-paper: #f4ede1;
  --color-paper-hi: #f9f3e6;
  --color-paper-edge: #e6dcc6;
  --color-ink: #1f1d1a;
  --color-ink-muted: #5a4f3d;
  --color-ink-faint: #7a6f5c;
  --color-coral: #c46449;
  --color-coral-deep: #9c4a2a;
  --color-coral-light: #e07a5f;
  --font-sans: var(--font-sans), -apple-system, BlinkMacSystemFont, sans-serif;
  --font-serif: var(--font-serif), Georgia, "Iowan Old Style", serif;
}

html, body { background: var(--color-paper); }

.serif { font-family: var(--font-serif); letter-spacing: -0.01em; }
.label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: var(--color-ink-faint); }
.italic-serif { font-family: var(--font-serif); font-style: italic; }

@keyframes pulse-coral {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.4); }
}
.pulse-coral { animation: pulse-coral 1.6s infinite; }
```

- [ ] **Step 3: Reusable Serif component**

Create `src/components/serif.tsx`:

```tsx
import { cn } from "@/src/lib/cn";

export function Serif({
  as: Tag = "span",
  className,
  italic,
  children,
}: {
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  italic?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Tag className={cn("serif", italic && "italic", className)}>{children}</Tag>
  );
}
```

- [ ] **Step 4: Add cn util**

Create `src/lib/cn.ts`:

```ts
export function cn(...args: Array<string | false | null | undefined>) {
  return args.filter(Boolean).join(" ");
}
```

- [ ] **Step 5: Smoke check**

Run: `pnpm dev`
Open http://localhost:3000. Expected: paper-colored background, "Saathi · placeholder" text rendered with system fonts (page text won't be serif — that's fine, base font is sans). Stop server.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: editorial theme tokens (paper bg, coral accents, serif/sans fonts)"
```

---

### Task 3: Supabase project setup + clients

**Files:**
- Create: `.env.example`, `.env.local`, `src/db/client.ts`
- Modify: `package.json`

Spec requires Supabase Postgres + Storage. Set up clients for both server (service role) and browser (anon) usage. There's no auth, but we still keep the split so RLS can be turned on later.

- [ ] **Step 1: Install Supabase JS**

```bash
pnpm add @supabase/supabase-js @supabase/ssr
```

- [ ] **Step 2: Create env example**

Create `.env.example`:

```
# Supabase (create a free project at supabase.com)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Demo user (any UUID; one row in employees points at this)
SAATHI_DEMO_USER_ID=11111111-1111-1111-1111-111111111111

# Anthropic
ANTHROPIC_API_KEY=

# OpenAI (Whisper for voice input)
OPENAI_API_KEY=
```

- [ ] **Step 3: Create local env (developer fills in)**

Create `.env.local` with placeholder values copied from `.env.example`. Document in commit message that the developer must replace these.

- [ ] **Step 4: Server + browser Supabase clients**

Create `src/db/client.ts`:

```ts
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function browserClient() {
  return createClient(url, anonKey, { auth: { persistSession: false } });
}

export function serverClient() {
  if (!serviceKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY missing");
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}

export const DEMO_USER_ID = process.env.SAATHI_DEMO_USER_ID!;
```

- [ ] **Step 5: Verify env loads (sanity-only)**

Add to `app/page.tsx` temporarily to verify env is wired (revert before committing):

```tsx
console.log("DEMO_USER_ID set:", !!process.env.SAATHI_DEMO_USER_ID);
```

Run `pnpm dev`, check terminal logs for the message. Revert the change.

- [ ] **Step 6: Commit**

```bash
git add .env.example src/db/client.ts package.json pnpm-lock.yaml
git commit -m "feat(db): add supabase client helpers and env template"
```

Note: `.env.local` is gitignored — never commit secrets.

---

### Task 4: Schema migration (5 tables)

**Files:**
- Create: `src/db/schema.sql`, `src/db/migrate.ts`, `scripts/db-migrate.mjs`

- [ ] **Step 1: Write schema.sql**

Create `src/db/schema.sql`:

```sql
-- Saathi schema. Single demo user; RLS off in dev, permissive single-user policy in deploy.

create extension if not exists "uuid-ossp";

create table if not exists employees (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null,
  name            text not null,
  role            text not null,
  bio             text,
  avatar_seed     text,
  status          text not null default 'idle',  -- idle | onboarding | working
  autonomy_level  text,                          -- ask_always | ask_external | just_do_it
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

create table if not exists onboarding_sessions (
  id                uuid primary key default uuid_generate_v4(),
  employee_id       uuid not null references employees(id) on delete cascade,
  phase             int not null default 1,
  brief             jsonb,
  context_summary   jsonb,
  observations      jsonb,
  action_plan       jsonb,
  approvals         jsonb,
  completed_at      timestamptz,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now(),
  unique(employee_id)
);

create table if not exists uploads (
  id              uuid primary key default uuid_generate_v4(),
  employee_id     uuid not null references employees(id) on delete cascade,
  filename        text not null,
  storage_path    text not null,
  mime_type       text,
  parsed_text     text,
  parse_status    text not null default 'pending',  -- pending | done | failed
  created_at      timestamptz default now()
);

create table if not exists prds (
  id              uuid primary key default uuid_generate_v4(),
  employee_id     uuid not null references employees(id) on delete cascade,
  title           text,
  source_issue    text,
  sections        jsonb not null default '{}'::jsonb,
  status          text not null default 'streaming',  -- streaming | draft | edited | exported
  generated_at    timestamptz default now(),
  updated_at      timestamptz default now()
);

create table if not exists events (
  id              uuid primary key default uuid_generate_v4(),
  employee_id     uuid references employees(id) on delete cascade,
  type            text not null,
  payload         jsonb,
  created_at      timestamptz default now()
);

create index if not exists idx_uploads_employee on uploads(employee_id);
create index if not exists idx_prds_employee on prds(employee_id);
create index if not exists idx_events_employee on events(employee_id, created_at desc);

-- Storage bucket for uploaded user docs
insert into storage.buckets (id, name, public)
values ('uploads', 'uploads', false)
on conflict (id) do nothing;
```

- [ ] **Step 2: Migration runner script**

Create `scripts/db-migrate.mjs`:

```js
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing Supabase env vars.");
  process.exit(1);
}
const sql = readFileSync(new URL("../src/db/schema.sql", import.meta.url), "utf8");
const client = createClient(url, key, { auth: { persistSession: false } });

const { error } = await client.rpc("exec_sql", { sql });
if (error) {
  // Fallback: split on ';' and run via raw http if exec_sql RPC doesn't exist.
  console.error("exec_sql RPC failed; running statements via supabase-js raw query.");
  const stmts = sql.split(/;\s*\n/).map(s => s.trim()).filter(Boolean);
  for (const stmt of stmts) {
    const { error } = await client.from("_dummy").select("1").limit(0); // warm-up
    // The supabase-js client cannot run arbitrary DDL — surface a friendly hint.
    void error;
  }
  console.error("\nIf exec_sql is not available in your project, paste src/db/schema.sql into the Supabase SQL editor and run it.");
  process.exit(1);
}
console.log("Migration applied.");
```

Add to `package.json` scripts:

```json
"db:migrate": "node scripts/db-migrate.mjs"
```

Add `dotenv` dep:

```bash
pnpm add -D dotenv
```

- [ ] **Step 3: Apply schema (manual fallback documented)**

Run `pnpm db:migrate`. If the RPC is unavailable on a fresh Supabase project (it usually is unless `pg_net` extension is enabled), the script prints a clear instruction to paste `src/db/schema.sql` into the Supabase SQL Editor. Either path is acceptable.

Verify in Supabase dashboard: 5 tables visible, `uploads` storage bucket present.

- [ ] **Step 4: Commit**

```bash
git add src/db/schema.sql scripts/db-migrate.mjs package.json pnpm-lock.yaml
git commit -m "feat(db): schema + migration runner for 5 tables and uploads bucket"
```

---

### Task 5: Seed + reset scripts (Alex singleton)

**Files:**
- Create: `src/db/seed.ts`, `scripts/db-seed.mjs`, `scripts/db-reset.mjs`
- Modify: `package.json`

- [ ] **Step 1: Seed module**

Create `src/db/seed.ts`:

```ts
import { serverClient, DEMO_USER_ID } from "./client";

export async function seedDemoEmployee() {
  const sb = serverClient();

  // Idempotent: if Alex exists for this user, return it. Else insert.
  const { data: existing } = await sb
    .from("employees")
    .select("*")
    .eq("user_id", DEMO_USER_ID)
    .eq("name", "Alex")
    .maybeSingle();

  if (existing) return existing;

  const { data, error } = await sb
    .from("employees")
    .insert({
      user_id: DEMO_USER_ID,
      name: "Alex",
      role: "product_manager",
      bio: "Curious, structured, allergic to vague PRDs.",
      avatar_seed: "alex-pm-coral",
      status: "idle",
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
```

- [ ] **Step 2: CLI seed entry**

Create `scripts/db-seed.mjs`:

```js
import "dotenv/config";
import { seedDemoEmployee } from "../src/db/seed.ts";
const e = await seedDemoEmployee();
console.log("Seeded employee:", e.id, e.name);
```

- [ ] **Step 3: CLI reset entry**

Create `scripts/db-reset.mjs`:

```js
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } },
);
const userId = process.env.SAATHI_DEMO_USER_ID;
const { data: emps } = await sb.from("employees").select("id").eq("user_id", userId);
const ids = (emps ?? []).map(e => e.id);
if (ids.length) {
  await sb.from("events").delete().in("employee_id", ids);
  await sb.from("prds").delete().in("employee_id", ids);
  await sb.from("uploads").delete().in("employee_id", ids);
  await sb.from("onboarding_sessions").delete().in("employee_id", ids);
  await sb.from("employees").delete().in("id", ids);
}
const list = await sb.storage.from("uploads").list();
const files = (list.data ?? []).map(f => f.name);
if (files.length) await sb.storage.from("uploads").remove(files);
console.log("Reset complete. Re-seeding...");
const seed = await import("../src/db/seed.ts");
const e = await seed.seedDemoEmployee();
console.log("Seeded:", e.name, e.id);
```

- [ ] **Step 4: Wire into pnpm scripts**

Add to `package.json`:

```json
"db:seed": "node --experimental-strip-types scripts/db-seed.mjs",
"db:reset": "node --experimental-strip-types scripts/db-reset.mjs",
"demo:reset": "pnpm db:reset"
```

(Node 22+ supports `--experimental-strip-types` for `.ts` imports from `.mjs`. If on Node 20, run `pnpm dlx tsx scripts/db-seed.mjs` instead.)

- [ ] **Step 5: Run seed and verify**

```bash
pnpm db:seed
```

Expected: `Seeded employee: <uuid> Alex`. Check Supabase dashboard `employees` table — one row.

- [ ] **Step 6: Commit**

```bash
git add src/db/seed.ts scripts/db-seed.mjs scripts/db-reset.mjs package.json
git commit -m "feat(db): seed Alex singleton + demo:reset script"
```

---

## Phase B — File parsing (Tasks 6–8) [TDD]

### Task 6: PDF parser

**Files:**
- Create: `src/parsing/pdf.ts`, `tests/unit/parsing/pdf.test.ts`
- Modify: `package.json`

- [ ] **Step 1: Install pdf-parse and vitest**

```bash
pnpm add pdf-parse
pnpm add -D vitest @vitest/ui @types/pdf-parse
```

Add to `package.json` scripts:

```json
"test": "vitest run",
"test:watch": "vitest"
```

Create `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import path from "node:path";
export default defineConfig({
  test: { environment: "node" },
  resolve: { alias: { "@": path.resolve(__dirname, ".") } },
});
```

- [ ] **Step 2: Write the failing test**

Create `tests/unit/parsing/pdf.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { parsePdf } from "@/src/parsing/pdf";

describe("parsePdf", () => {
  it("extracts text from a simple PDF buffer", async () => {
    // Use the q2-roadmap fixture once it exists; for now stub a tiny PDF.
    const buf = readFileSync("tests/fixtures/hello.pdf");
    const text = await parsePdf(buf);
    expect(text).toContain("Hello");
  });

  it("returns empty string on a corrupt PDF without throwing", async () => {
    const text = await parsePdf(Buffer.from("not a pdf"));
    expect(text).toBe("");
  });
});
```

- [ ] **Step 3: Add a tiny test fixture PDF**

```bash
mkdir -p tests/fixtures
# Generate a 1-page "Hello world" PDF using built-in macOS tool or any generator:
echo "Hello world" > /tmp/hello.txt
cupsfilter /tmp/hello.txt > tests/fixtures/hello.pdf 2>/dev/null
```

(If `cupsfilter` is unavailable, run `python3 -c "from reportlab.pdfgen import canvas; c=canvas.Canvas('tests/fixtures/hello.pdf'); c.drawString(72,720,'Hello world'); c.save()"` after `pip install reportlab`. Any 1-page PDF containing "Hello world" works.)

- [ ] **Step 4: Run test — expect failure**

```bash
pnpm test tests/unit/parsing/pdf.test.ts
```

Expected: FAIL with "Cannot find module @/src/parsing/pdf".

- [ ] **Step 5: Implement parsePdf**

Create `src/parsing/pdf.ts`:

```ts
import pdfParse from "pdf-parse";

export async function parsePdf(buf: Buffer): Promise<string> {
  try {
    const result = await pdfParse(buf);
    return (result.text ?? "").trim();
  } catch {
    return "";
  }
}
```

- [ ] **Step 6: Run test — expect pass**

```bash
pnpm test tests/unit/parsing/pdf.test.ts
```

Expected: 2 tests pass.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat(parsing): pdf parser with corrupt-input safety"
```

---

### Task 7: DOCX parser

**Files:**
- Create: `src/parsing/docx.ts`, `tests/unit/parsing/docx.test.ts`, `tests/fixtures/hello.docx`

- [ ] **Step 1: Install mammoth**

```bash
pnpm add mammoth
```

- [ ] **Step 2: Failing test**

Create `tests/unit/parsing/docx.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { parseDocx } from "@/src/parsing/docx";

describe("parseDocx", () => {
  it("extracts text from a docx buffer", async () => {
    const buf = readFileSync("tests/fixtures/hello.docx");
    const text = await parseDocx(buf);
    expect(text).toContain("Hello");
  });

  it("returns empty string on garbage input", async () => {
    expect(await parseDocx(Buffer.from("not a docx"))).toBe("");
  });
});
```

- [ ] **Step 3: Add a tiny .docx fixture**

```bash
# Easiest: open Pages/Word, save a 1-line "Hello world" doc as docx.
# Or: use the existing Saathi_OnePager_YC copy.docx as the fixture for a quick check:
cp "Saathi_OnePager_YC copy.docx" tests/fixtures/hello.docx
```

The test asserts only that "Hello" appears — adjust the assertion to match the fixture content if reusing the OnePager (it contains "Saathi" reliably; change `expect(text).toContain("Hello")` to `expect(text).toContain("Saathi")` if that's the fixture).

- [ ] **Step 4: Run test — expect failure**

```bash
pnpm test tests/unit/parsing/docx.test.ts
```

Expected: FAIL ("Cannot find module").

- [ ] **Step 5: Implement parseDocx**

Create `src/parsing/docx.ts`:

```ts
import mammoth from "mammoth";

export async function parseDocx(buf: Buffer): Promise<string> {
  try {
    const { value } = await mammoth.extractRawText({ buffer: buf });
    return (value ?? "").trim();
  } catch {
    return "";
  }
}
```

- [ ] **Step 6: Run test — expect pass**

```bash
pnpm test tests/unit/parsing/docx.test.ts
```

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat(parsing): docx parser via mammoth"
```

---

### Task 8: Markdown / text parser + dispatcher

**Files:**
- Create: `src/parsing/md.ts`, `src/parsing/parse-upload.ts`, `tests/unit/parsing/dispatcher.test.ts`

- [ ] **Step 1: Failing test for dispatcher**

Create `tests/unit/parsing/dispatcher.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { parseUpload } from "@/src/parsing/parse-upload";

describe("parseUpload dispatcher", () => {
  it("routes .md by mime type", async () => {
    const buf = Buffer.from("# Title\n\nBody text.");
    expect(await parseUpload(buf, "text/markdown", "x.md")).toContain("Body text");
  });

  it("routes .txt by mime type", async () => {
    const buf = Buffer.from("plain content");
    expect(await parseUpload(buf, "text/plain", "x.txt")).toContain("plain content");
  });

  it("falls back to extension when mime is octet-stream", async () => {
    const buf = Buffer.from("# md content");
    expect(await parseUpload(buf, "application/octet-stream", "thing.md"))
      .toContain("md content");
  });

  it("returns empty for unknown formats", async () => {
    expect(await parseUpload(Buffer.from("xx"), "image/png", "x.png")).toBe("");
  });
});
```

- [ ] **Step 2: Run — expect failure**

```bash
pnpm test tests/unit/parsing/dispatcher.test.ts
```

Expected: FAIL.

- [ ] **Step 3: Implement md parser**

Create `src/parsing/md.ts`:

```ts
export function parseMd(buf: Buffer): string {
  return buf.toString("utf8").trim();
}
```

- [ ] **Step 4: Implement dispatcher**

Create `src/parsing/parse-upload.ts`:

```ts
import { parsePdf } from "./pdf";
import { parseDocx } from "./docx";
import { parseMd } from "./md";

export async function parseUpload(
  buf: Buffer,
  mime: string,
  filename: string,
): Promise<string> {
  const lower = filename.toLowerCase();
  const ext = lower.slice(lower.lastIndexOf("."));

  if (mime === "application/pdf" || ext === ".pdf") return parsePdf(buf);
  if (mime.includes("word") || ext === ".docx") return parseDocx(buf);
  if (mime.startsWith("text/") || ext === ".md" || ext === ".txt") return parseMd(buf);
  return "";
}
```

- [ ] **Step 5: Run — expect pass**

```bash
pnpm test tests/unit/parsing/
```

Expected: all parsing tests pass.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(parsing): md/txt parser + mime/ext dispatcher"
```

---

## Phase C — AI infrastructure (Tasks 9–11)

### Task 9: Anthropic client + streaming helpers

**Files:**
- Create: `src/ai/client.ts`, `src/ai/stream.ts`
- Modify: `package.json`

- [ ] **Step 1: Install Anthropic + Vercel AI SDK**

```bash
pnpm add @anthropic-ai/sdk ai @ai-sdk/anthropic
```

- [ ] **Step 2: Anthropic client**

Create `src/ai/client.ts`:

```ts
import { anthropic } from "@ai-sdk/anthropic";

export const MODEL_ID = "claude-sonnet-4-6";
export const claude = anthropic(MODEL_ID);

export const ANTHROPIC_KEY_PRESENT = !!process.env.ANTHROPIC_API_KEY;
```

- [ ] **Step 3: Streaming helper for JSON-shaped responses**

Create `src/ai/stream.ts`:

```ts
import { streamText, generateText } from "ai";
import { claude } from "./client";

export type StreamArgs = {
  system: string;
  prompt: string;
  signal?: AbortSignal;
};

/**
 * Stream raw text from Claude. Returns an AsyncIterable of token deltas
 * plus the final assembled text on completion.
 */
export async function streamClaude(args: StreamArgs) {
  const result = streamText({
    model: claude,
    system: args.system,
    prompt: args.prompt,
    abortSignal: args.signal,
  });
  return result;
}

/**
 * Non-streaming JSON call used for structured outputs where we need
 * the whole shape before rendering (rare — most calls stream).
 */
export async function jsonClaude<T>(args: StreamArgs): Promise<T> {
  const { text } = await generateText({
    model: claude,
    system: args.system,
    prompt: args.prompt,
    abortSignal: args.signal,
  });
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end < 0) throw new Error("Claude response not JSON");
  return JSON.parse(text.slice(start, end + 1)) as T;
}
```

- [ ] **Step 4: Smoke check (manual, optional)**

Create `scripts/ai-smoke.mjs`:

```js
import "dotenv/config";
import { streamClaude } from "../src/ai/stream.ts";
const r = await streamClaude({
  system: "You are a friendly haiku writer.",
  prompt: "Write a haiku about onboarding.",
});
for await (const chunk of r.textStream) process.stdout.write(chunk);
process.stdout.write("\n");
```

Run with the developer's actual Anthropic key:

```bash
pnpm dlx tsx scripts/ai-smoke.mjs
```

Expected: a streaming haiku appears in the terminal. Skip if no key configured.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(ai): anthropic client + streamClaude/jsonClaude helpers"
```

---

### Task 10: Offline fallback infrastructure [TDD]

**Files:**
- Create: `src/ai/fallback.ts`, `tests/unit/ai/fallback.test.ts`

The fallback returns pre-recorded streaming content if Claude is slow or unreachable. The selector decides which canned response to play given the prompt key.

- [ ] **Step 1: Failing test**

Create `tests/unit/ai/fallback.test.ts`:

```ts
import { describe, it, expect, vi } from "vitest";
import { withFallback, loadCanned } from "@/src/ai/fallback";

describe("withFallback", () => {
  it("returns the live result when it succeeds within the budget", async () => {
    const live = vi.fn().mockResolvedValue("live");
    const canned = vi.fn().mockResolvedValue("canned");
    const out = await withFallback({ ttfbMs: 10000, live, canned });
    expect(out).toBe("live");
    expect(canned).not.toHaveBeenCalled();
  });

  it("uses canned when live throws", async () => {
    const live = vi.fn().mockRejectedValue(new Error("network"));
    const canned = vi.fn().mockResolvedValue("canned");
    const out = await withFallback({ ttfbMs: 10000, live, canned });
    expect(out).toBe("canned");
  });

  it("uses canned when live exceeds the time budget", async () => {
    const live = () => new Promise(r => setTimeout(() => r("late"), 200));
    const canned = vi.fn().mockResolvedValue("canned");
    const out = await withFallback({ ttfbMs: 50, live, canned });
    expect(out).toBe("canned");
  });
});

describe("loadCanned", () => {
  it("loads a canned response by key", async () => {
    const r = await loadCanned("understand");
    expect(r).toBeTruthy();
    expect(typeof r).toBe("object");
  });
});
```

- [ ] **Step 2: Add a stub canned file**

```bash
mkdir -p fixtures/demo/canned-responses
echo '{"project_context":"stub","role_and_priorities":"stub","how_you_communicate":"stub"}' \
  > fixtures/demo/canned-responses/understand.json
```

- [ ] **Step 3: Run test — expect failure**

```bash
pnpm test tests/unit/ai/fallback.test.ts
```

- [ ] **Step 4: Implement**

Create `src/ai/fallback.ts`:

```ts
import { readFile } from "node:fs/promises";
import path from "node:path";

const CANNED_DIR = path.resolve(process.cwd(), "fixtures/demo/canned-responses");

export type CannedKey = "understand" | "plan" | "prd-issue-47" | "refine-add-api-spec";

export async function loadCanned<T = unknown>(key: CannedKey): Promise<T> {
  const file = path.join(CANNED_DIR, `${key}.json`);
  const raw = await readFile(file, "utf8");
  return JSON.parse(raw) as T;
}

export type WithFallbackArgs<T> = {
  ttfbMs: number;
  live: () => Promise<T>;
  canned: () => Promise<T>;
};

export async function withFallback<T>({ ttfbMs, live, canned }: WithFallbackArgs<T>): Promise<T> {
  let timer: NodeJS.Timeout | undefined;
  const livePromise = (async () => live())();
  const timeout = new Promise<T>((_, reject) => {
    timer = setTimeout(() => reject(new Error("ttfb exceeded")), ttfbMs);
  });
  try {
    const result = await Promise.race([livePromise, timeout]);
    if (timer) clearTimeout(timer);
    return result;
  } catch {
    if (timer) clearTimeout(timer);
    return canned();
  }
}
```

- [ ] **Step 5: Run test — expect pass**

```bash
pnpm test tests/unit/ai/fallback.test.ts
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(ai): offline fallback (withFallback + loadCanned)"
```

---

### Task 11: Zustand stores for in-flight state

**Files:**
- Create: `src/store/walkthrough.ts`, `src/store/workspace.ts`
- Modify: `package.json`

- [ ] **Step 1: Install zustand**

```bash
pnpm add zustand
```

- [ ] **Step 2: Walkthrough store**

Create `src/store/walkthrough.ts`:

```ts
import { create } from "zustand";

export type Phase = 1 | 2 | 3 | 4 | 5 | 6;

type WalkthroughState = {
  phase: Phase;
  briefDraft: Record<string, unknown>;
  readingLines: string[];
  understoodDraft: { project_context: string; role_and_priorities: string; how_you_communicate: string } | null;
  observationsDraft: Record<string, unknown>;
  actionPlanDraft: { own: any[]; assist: any[]; flag: any[] } | null;
  setPhase: (p: Phase) => void;
  setBrief: (b: Record<string, unknown>) => void;
  appendReadingLine: (l: string) => void;
  setUnderstood: (u: WalkthroughState["understoodDraft"]) => void;
  setObservations: (o: Record<string, unknown>) => void;
  setActionPlan: (p: WalkthroughState["actionPlanDraft"]) => void;
  reset: () => void;
};

const initial: Pick<WalkthroughState, "phase"|"briefDraft"|"readingLines"|"understoodDraft"|"observationsDraft"|"actionPlanDraft"> = {
  phase: 1,
  briefDraft: {},
  readingLines: [],
  understoodDraft: null,
  observationsDraft: {},
  actionPlanDraft: null,
};

export const useWalkthrough = create<WalkthroughState>((set) => ({
  ...initial,
  setPhase: (phase) => set({ phase }),
  setBrief: (briefDraft) => set({ briefDraft }),
  appendReadingLine: (line) => set((s) => ({ readingLines: [...s.readingLines, line] })),
  setUnderstood: (understoodDraft) => set({ understoodDraft }),
  setObservations: (observationsDraft) => set({ observationsDraft }),
  setActionPlan: (actionPlanDraft) => set({ actionPlanDraft }),
  reset: () => set(initial),
}));
```

- [ ] **Step 3: Workspace store**

Create `src/store/workspace.ts`:

```ts
import { create } from "zustand";

export type PrdSectionKey =
  | "problem"
  | "goals"
  | "user_stories"
  | "scope"
  | "out_of_scope"
  | "success_metrics";

export type PrdState = {
  prdId: string | null;
  title: string;
  sections: Partial<Record<PrdSectionKey, string>>;
  streamingSection: PrdSectionKey | null;
  status: "idle" | "drafting" | "editing" | "exporting";
  setPrd: (p: { id: string; title: string }) => void;
  appendSection: (key: PrdSectionKey, delta: string) => void;
  setStreamingSection: (k: PrdSectionKey | null) => void;
  finishStreaming: () => void;
  setStatus: (s: PrdState["status"]) => void;
  reset: () => void;
};

const initial: Pick<PrdState, "prdId"|"title"|"sections"|"streamingSection"|"status"> = {
  prdId: null,
  title: "",
  sections: {},
  streamingSection: null,
  status: "idle",
};

export const useWorkspace = create<PrdState>((set) => ({
  ...initial,
  setPrd: ({ id, title }) => set({ prdId: id, title, sections: {}, status: "drafting" }),
  appendSection: (key, delta) =>
    set((s) => ({ sections: { ...s.sections, [key]: (s.sections[key] ?? "") + delta } })),
  setStreamingSection: (streamingSection) => set({ streamingSection }),
  finishStreaming: () => set({ streamingSection: null, status: "idle" }),
  setStatus: (status) => set({ status }),
  reset: () => set(initial),
}));
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(store): zustand stores for walkthrough + workspace in-flight state"
```

---

## Phase D — AI prompts (Tasks 12–15)

Each prompt is a function that builds the system + user prompts, returns a streaming result, and is wrapped in `withFallback`. Each prompt has a corresponding API route.

### Task 12: `understandContext` prompt + endpoint

**Files:**
- Create: `src/ai/prompts/understand-context.ts`, `app/api/ai/understand/route.ts`, `tests/unit/ai/understand-prompt.test.ts`

- [ ] **Step 1: Failing test for prompt builder**

Create `tests/unit/ai/understand-prompt.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { buildUnderstandPrompt } from "@/src/ai/prompts/understand-context";

describe("buildUnderstandPrompt", () => {
  it("includes the brief and parsed docs verbatim", () => {
    const out = buildUnderstandPrompt({
      brief: { project: "Saathi", role: "Founder", priorities: ["YC demo"], time_sink: "PRDs", team: "3 eng", tools: ["Notion"] },
      docs: [{ filename: "spec.pdf", parsed_text: "Goals: build the demo" }],
    });
    expect(out.system).toContain("Product Manager");
    expect(out.system).toContain("JSON");
    expect(out.user).toContain("Saathi");
    expect(out.user).toContain("spec.pdf");
    expect(out.user).toContain("Goals: build the demo");
  });

  it("forces strict JSON schema", () => {
    const out = buildUnderstandPrompt({ brief: {}, docs: [] });
    expect(out.system).toContain("project_context");
    expect(out.system).toContain("role_and_priorities");
    expect(out.system).toContain("how_you_communicate");
  });
});
```

- [ ] **Step 2: Run — expect failure**

```bash
pnpm test tests/unit/ai/understand-prompt.test.ts
```

- [ ] **Step 3: Implement prompt builder**

Create `src/ai/prompts/understand-context.ts`:

```ts
export type UnderstandInput = {
  brief: Record<string, unknown>;
  docs: Array<{ filename: string; parsed_text: string }>;
};

export type UnderstoodContext = {
  project_context: string;
  role_and_priorities: string;
  how_you_communicate: string;
};

const SYSTEM = `You are Alex, a senior AI Product Manager who has just been hired by a small team.
You read everything they share and form a clear picture of the project, the person, and how they communicate before doing any work.

You think in three lenses:
1. Project context — what are they building, who is it for, what's the current state.
2. Role & priorities — what does THIS person own and what's most pressing for them right now.
3. How they communicate — concrete observations about voice, structure, depth, vocabulary.

Be concrete. Quote phrases when relevant. Avoid generic AI praise. No hedging. Speak like a colleague.

OUTPUT: a single JSON object with exactly these keys (each value a 2-4 sentence paragraph):
{
  "project_context": "...",
  "role_and_priorities": "...",
  "how_you_communicate": "..."
}
Output JSON only, no preamble.`;

export function buildUnderstandPrompt(input: UnderstandInput) {
  const docs = input.docs.length
    ? input.docs.map(d => `--- ${d.filename} ---\n${d.parsed_text}`).join("\n\n")
    : "(no documents uploaded)";
  const user = [
    "Brief from the user:",
    JSON.stringify(input.brief, null, 2),
    "",
    "Documents they shared:",
    docs,
    "",
    "Now produce the JSON described in the system prompt.",
  ].join("\n");
  return { system: SYSTEM, user };
}
```

- [ ] **Step 4: Run — expect pass**

```bash
pnpm test tests/unit/ai/understand-prompt.test.ts
```

- [ ] **Step 5: API route with streaming + fallback**

Create `app/api/ai/understand/route.ts`:

```ts
import { NextRequest } from "next/server";
import { streamClaude } from "@/src/ai/stream";
import { withFallback, loadCanned } from "@/src/ai/fallback";
import { buildUnderstandPrompt, UnderstandInput, UnderstoodContext } from "@/src/ai/prompts/understand-context";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const input = (await req.json()) as UnderstandInput;
  const { system, user } = buildUnderstandPrompt(input);

  const live = async () => {
    const result = await streamClaude({ system, prompt: user });
    return result.toTextStreamResponse();
  };

  const canned = async () => {
    const data = await loadCanned<UnderstoodContext>("understand");
    const text = JSON.stringify(data);
    return new Response(simulateStream(text), {
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  };

  try {
    return await withFallback({ ttfbMs: 10000, live, canned });
  } catch {
    return canned();
  }
}

function simulateStream(text: string) {
  const encoder = new TextEncoder();
  return new ReadableStream({
    async start(controller) {
      const chars = [...text];
      for (const c of chars) {
        controller.enqueue(encoder.encode(c));
        await new Promise(r => setTimeout(r, 12));
      }
      controller.close();
    },
  });
}
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(ai): understandContext prompt + /api/ai/understand route"
```

---

### Task 13: `proposeActionPlan` prompt + endpoint

**Files:**
- Create: `src/ai/prompts/propose-action-plan.ts`, `app/api/ai/plan/route.ts`, `tests/unit/ai/plan-prompt.test.ts`

- [ ] **Step 1: Failing test**

Create `tests/unit/ai/plan-prompt.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { buildProposePlanPrompt } from "@/src/ai/prompts/propose-action-plan";

describe("buildProposePlanPrompt", () => {
  it("includes brief, summary, observations, and docs", () => {
    const out = buildProposePlanPrompt({
      brief: { project: "Saathi" },
      context_summary: { project_context: "x", role_and_priorities: "y", how_you_communicate: "z" },
      observations: { decision_style: "ask_external", prd_depth: "1-pager", sample_prd_text: "Sample PRD body" },
      docs: [{ filename: "issue-47.json", parsed_text: "bulk export" }],
    });
    expect(out.system).toContain("own");
    expect(out.system).toContain("assist");
    expect(out.system).toContain("flag");
    expect(out.user).toContain("Saathi");
    expect(out.user).toContain("Sample PRD body");
    expect(out.user).toContain("issue-47.json");
  });
});
```

- [ ] **Step 2: Run — expect fail**

```bash
pnpm test tests/unit/ai/plan-prompt.test.ts
```

- [ ] **Step 3: Implement**

Create `src/ai/prompts/propose-action-plan.ts`:

```ts
export type ActionPlanInput = {
  brief: Record<string, unknown>;
  context_summary: Record<string, unknown>;
  observations: Record<string, unknown>;
  docs: Array<{ filename: string; parsed_text: string }>;
};

export type ActionItem = { title: string; rationale: string };
export type ActionPlan = { own: ActionItem[]; assist: ActionItem[]; flag: ActionItem[] };

const SYSTEM = `You are Alex, an AI Product Manager who has just finished onboarding.
You have read this person's brief, their documents, and your observations of how they work.
Now you propose an action plan — what you will do for them, like a confident new hire who has done their homework.

Three tiers:
- "own" (3-5 items): tasks you execute end-to-end without approval. Specific to their context.
- "assist" (2-4 items): tasks you draft, they review and send.
- "flag" (2-4 items): things you watch for and surface, decisions stay with them.

Each item: a one-line action title, plus a one-sentence rationale that ties to something concrete you saw in their docs or brief. Quote a filename or phrase when possible. No generic role tasks ("write PRDs"). Always specific.

OUTPUT: a single JSON object:
{
  "own": [{"title": "...", "rationale": "..."}, ...],
  "assist": [...],
  "flag": [...]
}
Output JSON only.`;

export function buildProposePlanPrompt(input: ActionPlanInput) {
  const docs = input.docs.length
    ? input.docs.map(d => `--- ${d.filename} ---\n${d.parsed_text}`).join("\n\n")
    : "(no documents)";
  const user = [
    "Brief:",
    JSON.stringify(input.brief, null, 2),
    "",
    "What I understood (from Phase 2):",
    JSON.stringify(input.context_summary, null, 2),
    "",
    "How they work (from Phase 3):",
    JSON.stringify(input.observations, null, 2),
    "",
    "Documents:",
    docs,
    "",
    "Produce the JSON action plan described in the system prompt.",
  ].join("\n");
  return { system: SYSTEM, user };
}
```

- [ ] **Step 4: Run — expect pass**

```bash
pnpm test tests/unit/ai/plan-prompt.test.ts
```

- [ ] **Step 5: API route**

Create `app/api/ai/plan/route.ts`:

```ts
import { NextRequest } from "next/server";
import { streamClaude } from "@/src/ai/stream";
import { withFallback, loadCanned } from "@/src/ai/fallback";
import { buildProposePlanPrompt, ActionPlanInput, ActionPlan } from "@/src/ai/prompts/propose-action-plan";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const input = (await req.json()) as ActionPlanInput;
  const { system, user } = buildProposePlanPrompt(input);

  const live = async () => {
    const result = await streamClaude({ system, prompt: user });
    return result.toTextStreamResponse();
  };

  const canned = async () => {
    const data = await loadCanned<ActionPlan>("plan");
    const text = JSON.stringify(data);
    return new Response(simulateStream(text), {
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  };

  try {
    return await withFallback({ ttfbMs: 10000, live, canned });
  } catch {
    return canned();
  }
}

function simulateStream(text: string) {
  const encoder = new TextEncoder();
  return new ReadableStream({
    async start(controller) {
      for (const c of [...text]) {
        controller.enqueue(encoder.encode(c));
        await new Promise(r => setTimeout(r, 8));
      }
      controller.close();
    },
  });
}
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(ai): proposeActionPlan prompt + /api/ai/plan route"
```

---

### Task 14: `generatePRD` prompt + endpoint

**Files:**
- Create: `src/ai/prompts/generate-prd.ts`, `app/api/ai/prd/route.ts`, `tests/unit/ai/prd-prompt.test.ts`

- [ ] **Step 1: Failing test**

Create `tests/unit/ai/prd-prompt.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { buildGeneratePrdPrompt } from "@/src/ai/prompts/generate-prd";

describe("buildGeneratePrdPrompt", () => {
  it("includes context summary and source issue", () => {
    const out = buildGeneratePrdPrompt({
      context_summary: { project_context: "ctx", role_and_priorities: "r", how_you_communicate: "punchy short sentences" },
      observations: { prd_depth: "full spec" },
      docs: [{ filename: "issue-47.json", parsed_text: "bulk export request" }],
      source: "Issue #47: Add bulk export for analytics dashboard",
    });
    expect(out.system).toContain("Problem");
    expect(out.system).toContain("Goals");
    expect(out.system).toContain("user_stories");
    expect(out.user).toContain("Issue #47");
    expect(out.user).toContain("bulk export");
    expect(out.user).toContain("punchy short sentences");
  });
});
```

- [ ] **Step 2: Run — expect fail**

```bash
pnpm test tests/unit/ai/prd-prompt.test.ts
```

- [ ] **Step 3: Implement**

Create `src/ai/prompts/generate-prd.ts`:

```ts
export type PrdInput = {
  context_summary: Record<string, unknown>;
  observations: Record<string, unknown>;
  docs: Array<{ filename: string; parsed_text: string }>;
  source: string;  // e.g. "Issue #47: ..."
};

export type GeneratedPrd = {
  title: string;
  sections: {
    problem: string;
    goals: string;
    user_stories: string;
    scope: string;
    out_of_scope: string;
    success_metrics: string;
  };
};

const SYSTEM = `You are Alex, an AI Product Manager. You write PRDs that real PMs would publish without edits.

A great PRD has six sections:
- Problem statement: who hurts and how, with a concrete observation. Not abstract.
- Goals: 2-4 measurable outcomes with target deltas (from X to Y).
- User stories: 3-5 stories in "As a..., I can..." form, written as the user would speak.
- Scope: bullet list of what's in.
- Out of scope: bullet list of what's out, with one-line rationale each.
- Success metrics: 2-3 measurable KPIs with targets.

Match the user's voice exactly — short sentences if they write short, formal if they're formal. Avoid generic SaaS PM language. Avoid "leverage", "robust", "seamless", "best-in-class". Specific is better than smart.

OUTPUT: a single JSON object:
{
  "title": "Short feature name",
  "sections": {
    "problem": "...",
    "goals": "...",
    "user_stories": "...",
    "scope": "...",
    "out_of_scope": "...",
    "success_metrics": "..."
  }
}
Output JSON only.`;

export function buildGeneratePrdPrompt(input: PrdInput) {
  const docs = input.docs.length
    ? input.docs.map(d => `--- ${d.filename} ---\n${d.parsed_text}`).join("\n\n")
    : "(no docs)";
  const user = [
    "What I understood about the project & the person:",
    JSON.stringify(input.context_summary, null, 2),
    "",
    "How they like work delivered:",
    JSON.stringify(input.observations, null, 2),
    "",
    "Source materials:",
    docs,
    "",
    `Write a PRD for: ${input.source}`,
    "",
    "Output JSON per the system prompt.",
  ].join("\n");
  return { system: SYSTEM, user };
}
```

- [ ] **Step 4: Run — expect pass**

```bash
pnpm test tests/unit/ai/prd-prompt.test.ts
```

- [ ] **Step 5: API route**

Create `app/api/ai/prd/route.ts`:

```ts
import { NextRequest } from "next/server";
import { streamClaude } from "@/src/ai/stream";
import { withFallback, loadCanned } from "@/src/ai/fallback";
import { buildGeneratePrdPrompt, PrdInput, GeneratedPrd } from "@/src/ai/prompts/generate-prd";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const input = (await req.json()) as PrdInput;
  const { system, user } = buildGeneratePrdPrompt(input);

  const live = async () => {
    const result = await streamClaude({ system, prompt: user });
    return result.toTextStreamResponse();
  };

  const canned = async () => {
    const data = await loadCanned<GeneratedPrd>("prd-issue-47");
    const text = JSON.stringify(data);
    return new Response(simulateStream(text), {
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  };

  try {
    return await withFallback({ ttfbMs: 10000, live, canned });
  } catch {
    return canned();
  }
}

function simulateStream(text: string) {
  const encoder = new TextEncoder();
  return new ReadableStream({
    async start(controller) {
      for (const c of [...text]) {
        controller.enqueue(encoder.encode(c));
        await new Promise(r => setTimeout(r, 6));
      }
      controller.close();
    },
  });
}
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(ai): generatePRD prompt + /api/ai/prd route"
```

---

### Task 15: `refinePRD` prompt + endpoint

**Files:**
- Create: `src/ai/prompts/refine-prd.ts`, `app/api/ai/refine/route.ts`, `tests/unit/ai/refine-prompt.test.ts`

- [ ] **Step 1: Failing test**

Create `tests/unit/ai/refine-prompt.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { buildRefinePrdPrompt } from "@/src/ai/prompts/refine-prd";

describe("buildRefinePrdPrompt", () => {
  it("targets a section by key and applies the action", () => {
    const out = buildRefinePrdPrompt({
      sections: { problem: "p", goals: "g", user_stories: "us", scope: "s", out_of_scope: "oos", success_metrics: "sm" },
      action: "Add API spec",
      voice_summary: "punchy short sentences",
    });
    expect(out.system).toContain("section_key");
    expect(out.user).toContain("Add API spec");
    expect(out.user).toContain("punchy short sentences");
  });
});
```

- [ ] **Step 2: Run — expect fail**

```bash
pnpm test tests/unit/ai/refine-prompt.test.ts
```

- [ ] **Step 3: Implement**

Create `src/ai/prompts/refine-prd.ts`:

```ts
import type { GeneratedPrd } from "./generate-prd";

export type RefineInput = {
  sections: GeneratedPrd["sections"];
  action: string;             // "Add API spec" | "Simplify" | "Tighten scope" | "Write engineering tickets" | freeform
  voice_summary?: string;     // from context_summary.how_you_communicate
};

export type RefineOutput = {
  section_key: keyof GeneratedPrd["sections"];
  new_content: string;
};

const SYSTEM = `You are Alex revising a PRD section based on a follow-up instruction.

Pick the section that best matches the instruction. Rewrite ONLY that section. Preserve voice — do not reset it.

OUTPUT: a single JSON object:
{
  "section_key": "problem" | "goals" | "user_stories" | "scope" | "out_of_scope" | "success_metrics",
  "new_content": "..."
}
Output JSON only.`;

export function buildRefinePrdPrompt(input: RefineInput) {
  const user = [
    "Current PRD sections:",
    JSON.stringify(input.sections, null, 2),
    "",
    `Voice to preserve: ${input.voice_summary ?? "(use the existing tone)"}`,
    "",
    `Follow-up instruction: ${input.action}`,
    "",
    "Output JSON per the system prompt.",
  ].join("\n");
  return { system: SYSTEM, user };
}
```

- [ ] **Step 4: Run — expect pass**

```bash
pnpm test tests/unit/ai/refine-prompt.test.ts
```

- [ ] **Step 5: API route**

Create `app/api/ai/refine/route.ts`:

```ts
import { NextRequest } from "next/server";
import { streamClaude } from "@/src/ai/stream";
import { withFallback, loadCanned } from "@/src/ai/fallback";
import { buildRefinePrdPrompt, RefineInput, RefineOutput } from "@/src/ai/prompts/refine-prd";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const input = (await req.json()) as RefineInput;
  const { system, user } = buildRefinePrdPrompt(input);

  const live = async () => {
    const result = await streamClaude({ system, prompt: user });
    return result.toTextStreamResponse();
  };

  const canned = async () => {
    const data = await loadCanned<RefineOutput>("refine-add-api-spec");
    const text = JSON.stringify(data);
    return new Response(simulateStream(text), {
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  };

  try {
    return await withFallback({ ttfbMs: 10000, live, canned });
  } catch {
    return canned();
  }
}

function simulateStream(text: string) {
  const encoder = new TextEncoder();
  return new ReadableStream({
    async start(controller) {
      for (const c of [...text]) {
        controller.enqueue(encoder.encode(c));
        await new Promise(r => setTimeout(r, 6));
      }
      controller.close();
    },
  });
}
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(ai): refinePRD prompt + /api/ai/refine route"
```

---

## Phase E — Faked integrations (Tasks 16–19)

These are theater. The lie commits — every button must produce a polished, visible consequence.

### Task 16: Toast primitive + GitHub OAuth modal

**Files:**
- Create: `src/components/toast.tsx`, `src/fakes/github-modal.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Install sonner for toasts**

```bash
pnpm add sonner
```

- [ ] **Step 2: Toast primitive (themed)**

Create `src/components/toast.tsx`:

```tsx
"use client";

import { Toaster as SonnerToaster, toast as sonnerToast } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      toastOptions={{
        style: {
          background: "var(--color-paper-hi)",
          border: "1px solid var(--color-paper-edge)",
          color: "var(--color-ink)",
          fontFamily: "var(--font-sans)",
          fontSize: "13px",
          boxShadow: "0 4px 18px rgba(31, 29, 26, 0.10)",
        },
      }}
    />
  );
}

export const toast = {
  success: (msg: string, opts?: { description?: string; icon?: React.ReactNode }) =>
    sonnerToast.success(msg, opts),
  info: (msg: string, opts?: { description?: string }) => sonnerToast.message(msg, opts),
  error: (msg: string) => sonnerToast.error(msg),
};
```

- [ ] **Step 3: Wire Toaster into root layout**

Edit `app/layout.tsx` `<body>` to add `<Toaster />` at the bottom of children:

```tsx
import { Toaster } from "@/src/components/toast";
// ...
<body>{children}<Toaster /></body>
```

- [ ] **Step 4: GitHub OAuth modal (faked)**

Create `src/fakes/github-modal.tsx`:

```tsx
"use client";

import { useState } from "react";
import { toast } from "@/src/components/toast";

export function GithubConnectButton({
  onConnected,
  preset = "nicolasdossantos/saathi-mvp",
}: {
  onConnected?: (repo: string) => void;
  preset?: string;
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 rounded-md border border-[--color-paper-edge] bg-white text-sm text-[--color-ink] hover:border-[--color-coral]"
      >
        <span className="inline-flex items-center gap-2">
          <GithubGlyph /> Connect GitHub
        </span>
      </button>
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40">
          <div className="w-[420px] rounded-lg bg-white shadow-2xl border border-stone-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-stone-200 flex items-center gap-3">
              <GithubGlyph />
              <div className="text-[15px] font-medium">Authorize Saathi</div>
            </div>
            <div className="p-5 text-[13.5px] text-stone-700 space-y-3">
              <p>Saathi by <strong>nicolasdossantos</strong> wants to access your repositories.</p>
              <ul className="list-disc pl-5 text-stone-600 space-y-1">
                <li>Read repository contents</li>
                <li>Read issues</li>
                <li>Read pull requests</li>
              </ul>
            </div>
            <div className="px-5 py-3 bg-stone-50 flex justify-end gap-2 border-t border-stone-200">
              <button
                onClick={() => setOpen(false)}
                className="px-3 py-1.5 text-sm text-stone-600"
                disabled={busy}
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  setBusy(true);
                  await new Promise(r => setTimeout(r, 1800));
                  setBusy(false);
                  setOpen(false);
                  toast.success(`Connected to ${preset}`, { icon: <GithubGlyph /> });
                  onConnected?.(preset);
                }}
                className="px-3 py-1.5 text-sm rounded bg-[#1f883d] text-white disabled:opacity-60"
                disabled={busy}
              >
                {busy ? "Authorizing…" : "Authorize Saathi"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function GithubGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M8 .2a8 8 0 0 0-2.5 15.6c.4.1.5-.2.5-.4v-1.4c-2.2.5-2.7-1-2.7-1-.4-.9-.9-1.2-.9-1.2-.7-.5.1-.5.1-.5.8.1 1.2.8 1.2.8.7 1.2 1.9.9 2.4.7.1-.5.3-.9.5-1.1-1.7-.2-3.6-.9-3.6-3.9 0-.9.3-1.6.8-2.2-.1-.2-.4-1 .1-2.1 0 0 .7-.2 2.2.8a7.6 7.6 0 0 1 4 0c1.5-1 2.2-.8 2.2-.8.4 1.1.2 1.9.1 2.1.5.6.8 1.3.8 2.2 0 3-1.9 3.7-3.6 3.9.3.3.6.8.6 1.6v2.4c0 .2.1.5.5.4A8 8 0 0 0 8 .2z"/>
    </svg>
  );
}
```

- [ ] **Step 5: Smoke check (manual)**

Drop `<GithubConnectButton />` into `app/page.tsx` temporarily. Run `pnpm dev`, click the button, watch the modal + toast. Revert.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(fakes): toast primitive + faked GitHub OAuth modal"
```

---

### Task 17: Jira "Update tickets" toast component

**Files:**
- Create: `src/fakes/jira-toast.tsx`

- [ ] **Step 1: Implement**

Create `src/fakes/jira-toast.tsx`:

```tsx
"use client";

import { toast } from "@/src/components/toast";

let nextKey = 1248;

export function fakeJiraCreate(project = "ENG"): string {
  const key = `${project}-${nextKey++}`;
  toast.success(`Created ${key} in Jira`, {
    description: "Tracked in your backlog.",
    icon: <JiraGlyph />,
  });
  return key;
}

export function JiraSendButton({
  label = "Update Jira",
  project = "ENG",
}: {
  label?: string;
  project?: string;
}) {
  return (
    <button
      onClick={() => fakeJiraCreate(project)}
      className="px-3 py-1.5 text-xs rounded border border-[--color-paper-edge] bg-white hover:border-[#0052cc] text-[--color-ink]"
    >
      <span className="inline-flex items-center gap-1.5"><JiraGlyph /> {label}</span>
    </button>
  );
}

function JiraGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#0052cc" aria-hidden>
      <path d="M11.571 11.513H0a5.218 5.218 0 0 0 5.232 5.215h2.13v2.057A5.215 5.215 0 0 0 12.575 24V12.518a1.005 1.005 0 0 0-1.005-1.005zM17.363 5.736H5.785a5.215 5.215 0 0 0 5.215 5.215h2.129v2.057A5.218 5.218 0 0 0 18.363 18.22V6.74a1.005 1.005 0 0 0-1-1.004zM23.155 0H11.577a5.215 5.215 0 0 0 5.215 5.215h2.129v2.057A5.218 5.218 0 0 0 24.156 12.49V1.005A1.005 1.005 0 0 0 23.155 0z"/>
    </svg>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat(fakes): jira toast (fake ticket creation)"
```

---

### Task 18: Notion export (toast + .md download)

**Files:**
- Create: `src/fakes/notion-export.tsx`, `src/lib/prd-to-md.ts`, `tests/unit/lib/prd-to-md.test.ts`

- [ ] **Step 1: Failing test for serializer**

Create `tests/unit/lib/prd-to-md.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { prdToMarkdown } from "@/src/lib/prd-to-md";

describe("prdToMarkdown", () => {
  it("renders title and section headings", () => {
    const md = prdToMarkdown({
      title: "Bulk export",
      sections: {
        problem: "p text",
        goals: "g text",
        user_stories: "us text",
        scope: "s text",
        out_of_scope: "oos text",
        success_metrics: "sm text",
      },
    });
    expect(md).toMatch(/^# Bulk export/);
    expect(md).toContain("## Problem statement");
    expect(md).toContain("## Goals");
    expect(md).toContain("## User stories");
    expect(md).toContain("## Scope");
    expect(md).toContain("## Out of scope");
    expect(md).toContain("## Success metrics");
    expect(md).toContain("p text");
  });

  it("skips empty sections", () => {
    const md = prdToMarkdown({
      title: "T",
      sections: { problem: "x", goals: "", user_stories: "", scope: "", out_of_scope: "", success_metrics: "" },
    });
    expect(md).toContain("## Problem statement");
    expect(md).not.toContain("## Goals");
  });
});
```

- [ ] **Step 2: Run — expect fail**

```bash
pnpm test tests/unit/lib/prd-to-md.test.ts
```

- [ ] **Step 3: Implement**

Create `src/lib/prd-to-md.ts`:

```ts
import type { GeneratedPrd } from "@/src/ai/prompts/generate-prd";

const HEADINGS: Array<[keyof GeneratedPrd["sections"], string]> = [
  ["problem", "Problem statement"],
  ["goals", "Goals"],
  ["user_stories", "User stories"],
  ["scope", "Scope"],
  ["out_of_scope", "Out of scope"],
  ["success_metrics", "Success metrics"],
];

export function prdToMarkdown(prd: GeneratedPrd): string {
  const out: string[] = [`# ${prd.title || "Untitled PRD"}`, ""];
  for (const [key, label] of HEADINGS) {
    const body = (prd.sections[key] ?? "").trim();
    if (!body) continue;
    out.push(`## ${label}`, "", body, "");
  }
  return out.join("\n").trim() + "\n";
}
```

- [ ] **Step 4: Run — expect pass**

```bash
pnpm test tests/unit/lib/prd-to-md.test.ts
```

- [ ] **Step 5: Notion export component**

Create `src/fakes/notion-export.tsx`:

```tsx
"use client";

import { toast } from "@/src/components/toast";
import { prdToMarkdown } from "@/src/lib/prd-to-md";
import type { GeneratedPrd } from "@/src/ai/prompts/generate-prd";

let nextSlug = 1248;

export function fakeNotionExport(prd: GeneratedPrd) {
  const md = prdToMarkdown(prd);
  const blob = new Blob([md], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${slugify(prd.title)}.md`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  const slug = `prd-${nextSlug++}`;
  toast.success("Exported to Notion", {
    description: `saathi.notion.site/${slug}`,
    icon: <NotionGlyph />,
  });
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "prd";
}

function NotionGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.5" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M8 7v10M8 7l8 10M16 7v10" />
    </svg>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(fakes): notion export (md serializer + faked toast + download)"
```

---

### Task 19: Slack OAuth modal + channel picker

**Files:**
- Create: `src/fakes/slack-modal.tsx`

- [ ] **Step 1: Implement**

Create `src/fakes/slack-modal.tsx`:

```tsx
"use client";

import { useState } from "react";
import { toast } from "@/src/components/toast";

const CHANNELS = ["#product-feedback", "#design-review", "#general", "#eng-standup"];

export function SlackConnectButton({
  onConnected,
}: {
  onConnected?: (channel: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"auth" | "channels" | "done">("auth");
  const [busy, setBusy] = useState(false);
  const [picked, setPicked] = useState<string>("#product-feedback");

  return (
    <>
      <button
        onClick={() => { setOpen(true); setStep("auth"); }}
        className="px-4 py-2 rounded-md border border-[--color-paper-edge] bg-white text-sm hover:border-[--color-coral]"
      >
        <span className="inline-flex items-center gap-2"><SlackGlyph /> Connect Slack</span>
      </button>
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40">
          <div className="w-[440px] rounded-lg bg-white shadow-2xl border border-stone-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-stone-200 flex items-center gap-3">
              <SlackGlyph />
              <div className="text-[15px] font-medium">
                {step === "auth" ? "Authorize Saathi" : "Choose a channel"}
              </div>
            </div>
            {step === "auth" && (
              <div className="p-5 text-[13.5px] text-stone-700 space-y-3">
                <p>Saathi will be able to:</p>
                <ul className="list-disc pl-5 text-stone-600 space-y-1">
                  <li>View messages in channels Saathi is added to</li>
                  <li>Post messages as Alex</li>
                </ul>
              </div>
            )}
            {step === "channels" && (
              <div className="p-5 space-y-2">
                {CHANNELS.map(c => (
                  <label key={c} className="flex items-center gap-2 text-[13.5px] cursor-pointer">
                    <input
                      type="radio"
                      name="ch"
                      checked={picked === c}
                      onChange={() => setPicked(c)}
                    />
                    {c}
                  </label>
                ))}
              </div>
            )}
            <div className="px-5 py-3 bg-stone-50 flex justify-end gap-2 border-t border-stone-200">
              <button onClick={() => setOpen(false)} className="px-3 py-1.5 text-sm text-stone-600">
                Cancel
              </button>
              {step === "auth" ? (
                <button
                  onClick={async () => {
                    setBusy(true);
                    await new Promise(r => setTimeout(r, 1500));
                    setBusy(false);
                    setStep("channels");
                  }}
                  disabled={busy}
                  className="px-3 py-1.5 text-sm rounded bg-[#4a154b] text-white disabled:opacity-60"
                >
                  {busy ? "Authorizing…" : "Allow"}
                </button>
              ) : (
                <button
                  onClick={() => {
                    setOpen(false);
                    toast.success(`Connected to ${picked}`, { icon: <SlackGlyph /> });
                    onConnected?.(picked);
                  }}
                  className="px-3 py-1.5 text-sm rounded bg-[#4a154b] text-white"
                >
                  Use this channel
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function SlackSendButton({ channel = "#product-feedback" }: { channel?: string }) {
  return (
    <button
      onClick={() => toast.success(`Sent to ${channel}`, { icon: <SlackGlyph /> })}
      className="px-3 py-1.5 text-xs rounded border border-[--color-paper-edge] bg-white hover:border-[#4a154b]"
    >
      <span className="inline-flex items-center gap-1.5"><SlackGlyph /> Send to Slack</span>
    </button>
  );
}

function SlackGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden>
      <path fill="#e01e5a" d="M5 15a2 2 0 1 1-2-2h2v2zm1 0a2 2 0 0 1 4 0v5a2 2 0 1 1-4 0v-5z"/>
      <path fill="#36c5f0" d="M9 5a2 2 0 1 1 2-2v2H9zm0 1a2 2 0 0 1 0 4H4a2 2 0 1 1 0-4h5z"/>
      <path fill="#2eb67d" d="M19 9a2 2 0 1 1 2 2h-2V9zm-1 0a2 2 0 0 1-4 0V4a2 2 0 1 1 4 0v5z"/>
      <path fill="#ecb22e" d="M15 19a2 2 0 1 1-2 2v-2h2zm0-1a2 2 0 0 1 0-4h5a2 2 0 1 1 0 4h-5z"/>
    </svg>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat(fakes): slack OAuth modal + channel picker + send button"
```

---

## Phase F — Shared UI primitives + Server queries (Tasks 20–22)

### Task 20: Avatar card + status pill + typewriter line

**Files:**
- Create: `src/components/avatar-card.tsx`, `src/components/status-pill.tsx`, `src/components/typewriter-line.tsx`

- [ ] **Step 1: Avatar card**

Create `src/components/avatar-card.tsx`:

```tsx
import { Serif } from "./serif";

export function AvatarCard({
  name,
  role,
  size = "md",
  status,
}: {
  name: string;
  role: string;
  size?: "sm" | "md";
  status?: React.ReactNode;
}) {
  const dim = size === "sm" ? "w-9 h-9 text-[14px]" : "w-11 h-11 text-[16px]";
  return (
    <div className="flex items-center gap-3">
      <div
        className={`${dim} rounded-full text-white grid place-items-center`}
        style={{ background: "linear-gradient(135deg,#e07a5f,#c46449)" }}
      >
        <Serif>{name.charAt(0)}</Serif>
      </div>
      <div>
        <Serif className="text-[16px]">{name}</Serif>
        <div className="label">{role}</div>
        {status && <div className="mt-1">{status}</div>}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Status pill (with pulse)**

Create `src/components/status-pill.tsx`:

```tsx
export function StatusPill({ children, active = true }: { children: React.ReactNode; active?: boolean }) {
  return (
    <span className="text-[11px] uppercase tracking-[0.12em] text-[--color-coral-deep] inline-flex items-center gap-2">
      {active && (
        <span className="w-[7px] h-[7px] rounded-full bg-[--color-coral] pulse-coral" />
      )}
      {children}
    </span>
  );
}
```

- [ ] **Step 3: Typewriter line**

Create `src/components/typewriter-line.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";

export function TypewriterLine({
  text,
  speedMs = 18,
  onDone,
}: {
  text: string;
  speedMs?: number;
  onDone?: () => void;
}) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (i >= text.length) { onDone?.(); return; }
    const t = setTimeout(() => setI(i + 1), speedMs);
    return () => clearTimeout(t);
  }, [i, text, speedMs, onDone]);
  return <span>{text.slice(0, i)}<span className="text-[--color-coral]">▍</span></span>;
}
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(ui): avatar card, status pill (pulse), typewriter line"
```

---

### Task 21: Dropzone primitive + upload action

**Files:**
- Create: `src/components/dropzone.tsx`, `src/db/queries.ts`, `src/server/uploads.ts`

- [ ] **Step 1: Install react-dropzone**

```bash
pnpm add react-dropzone
```

- [ ] **Step 2: Dropzone UI**

Create `src/components/dropzone.tsx`:

```tsx
"use client";

import { useDropzone } from "react-dropzone";

export function Dropzone({
  onFiles,
  hint = "Drop files here, or paste a Notion URL",
  multiple = true,
}: {
  onFiles: (files: File[]) => void;
  hint?: string;
  multiple?: boolean;
}) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onFiles,
    multiple,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "text/plain": [".txt"],
      "text/markdown": [".md"],
    },
  });
  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${
        isDragActive ? "border-[--color-coral] bg-[--color-paper-hi]" : "border-[--color-paper-edge] bg-white"
      }`}
    >
      <input {...getInputProps()} />
      <p className="text-[14px] text-[--color-ink-muted]">{hint}</p>
      <p className="label mt-2">.pdf · .docx · .md · .txt</p>
    </div>
  );
}
```

- [ ] **Step 3: Typed Supabase queries**

Create `src/db/queries.ts`:

```ts
import { serverClient, DEMO_USER_ID } from "./client";

export async function getDemoEmployee() {
  const sb = serverClient();
  const { data } = await sb
    .from("employees")
    .select("*")
    .eq("user_id", DEMO_USER_ID)
    .eq("name", "Alex")
    .maybeSingle();
  return data;
}

export async function setEmployeeStatus(id: string, status: "idle"|"onboarding"|"working") {
  const sb = serverClient();
  await sb.from("employees").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
}

export async function getOrInitOnboarding(employee_id: string) {
  const sb = serverClient();
  const { data } = await sb.from("onboarding_sessions").select("*").eq("employee_id", employee_id).maybeSingle();
  if (data) return data;
  const { data: inserted } = await sb
    .from("onboarding_sessions")
    .insert({ employee_id, phase: 1 })
    .select()
    .single();
  return inserted!;
}

export async function updateOnboarding(employee_id: string, patch: Record<string, unknown>) {
  const sb = serverClient();
  await sb
    .from("onboarding_sessions")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("employee_id", employee_id);
}

export async function listUploads(employee_id: string) {
  const sb = serverClient();
  const { data } = await sb.from("uploads").select("*").eq("employee_id", employee_id).order("created_at");
  return data ?? [];
}

export async function listEmployeePrds(employee_id: string) {
  const sb = serverClient();
  const { data } = await sb.from("prds").select("*").eq("employee_id", employee_id).order("generated_at", { ascending: false });
  return data ?? [];
}

export async function logEvent(employee_id: string | null, type: string, payload?: unknown) {
  const sb = serverClient();
  await sb.from("events").insert({ employee_id, type, payload: payload ?? {} });
}
```

- [ ] **Step 4: Server-side upload action**

Create `src/server/uploads.ts`:

```ts
"use server";

import { serverClient } from "@/src/db/client";
import { parseUpload } from "@/src/parsing/parse-upload";
import { randomUUID } from "node:crypto";

export type StoredUpload = {
  id: string;
  filename: string;
  storage_path: string;
  parsed_text: string;
};

export async function storeAndParseUpload(
  employeeId: string,
  file: { name: string; type: string; data: ArrayBuffer },
): Promise<StoredUpload> {
  const sb = serverClient();
  const buf = Buffer.from(file.data);
  const path = `${employeeId}/${randomUUID()}-${file.name}`;

  await sb.storage.from("uploads").upload(path, buf, { contentType: file.type, upsert: false });

  const parsed = await parseUpload(buf, file.type, file.name);

  const { data, error } = await sb
    .from("uploads")
    .insert({
      employee_id: employeeId,
      filename: file.name,
      storage_path: path,
      mime_type: file.type,
      parsed_text: parsed,
      parse_status: parsed ? "done" : "failed",
    })
    .select()
    .single();
  if (error) throw error;
  return { id: data.id, filename: data.filename, storage_path: data.storage_path, parsed_text: data.parsed_text };
}
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(server): dropzone + typed queries + upload+parse server action"
```

---

### Task 22: Homepage — "Hire an AI Product Manager"

**Files:**
- Modify: `app/page.tsx`
- Create: `src/server/hire.ts`

- [ ] **Step 1: Hire server action**

Create `src/server/hire.ts`:

```ts
"use server";

import { redirect } from "next/navigation";
import { getDemoEmployee, setEmployeeStatus, getOrInitOnboarding, logEvent } from "@/src/db/queries";

export async function hireProductManager() {
  const emp = await getDemoEmployee();
  if (!emp) throw new Error("Demo employee not seeded. Run pnpm db:seed.");
  await setEmployeeStatus(emp.id, "onboarding");
  await getOrInitOnboarding(emp.id);
  await logEvent(emp.id, "onboarding_started");
  redirect(`/onboarding/${emp.id}`);
}
```

- [ ] **Step 2: Homepage UI**

Replace `app/page.tsx`:

```tsx
import { hireProductManager } from "@/src/server/hire";
import { Serif } from "@/src/components/serif";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="max-w-[640px] text-center space-y-10">
        <div className="space-y-4">
          <Serif as="h1" className="text-[44px] leading-tight">
            AI employees that learn how you work.
          </Serif>
          <p className="text-[16px] text-[--color-ink-muted] leading-relaxed">
            Hire an AI colleague in minutes. They shadow how you work — your tools,
            tone, priorities — and start contributing from day one.
          </p>
        </div>
        <form action={hireProductManager}>
          <button
            type="submit"
            className="px-7 py-3 rounded-sm text-[12px] uppercase tracking-[0.12em] text-[--color-paper] bg-[--color-ink] hover:bg-[--color-coral-deep] transition-colors"
          >
            Hire an AI Product Manager
          </button>
        </form>
        <p className="label">More roles coming soon · Program Manager · Marketing</p>
      </div>
    </main>
  );
}
```

- [ ] **Step 3: Smoke check**

Run `pnpm dev`. Open http://localhost:3000. Click the button. Expected: redirect to `/onboarding/<uuid>` (route doesn't exist yet — Next.js 404 is fine for now). Verify Supabase `events` shows an `onboarding_started` row, and `employees.status` flipped to `onboarding`.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(homepage): hire flow + redirect to /onboarding/[employeeId]"
```

---

## Phase G — Walkthrough route + 6 phases (Tasks 23–28)

### Task 23: Walkthrough route shell + phase router + chrome

**Files:**
- Create: `app/onboarding/[employeeId]/page.tsx`, `app/onboarding/[employeeId]/walkthrough-client.tsx`, `app/onboarding/[employeeId]/_phases/index.ts`

The route is a Server Component that loads onboarding state, then mounts a Client Component that switches on `phase`. The chrome (avatar in corner, day-label) is shared.

- [ ] **Step 1: Server page**

Create `app/onboarding/[employeeId]/page.tsx`:

```tsx
import { serverClient } from "@/src/db/client";
import { WalkthroughClient } from "./walkthrough-client";
import { notFound } from "next/navigation";

export default async function OnboardingPage({ params }: { params: Promise<{ employeeId: string }> }) {
  const { employeeId } = await params;
  const sb = serverClient();
  const { data: emp } = await sb.from("employees").select("*").eq("id", employeeId).maybeSingle();
  if (!emp) notFound();
  const { data: session } = await sb.from("onboarding_sessions").select("*").eq("employee_id", employeeId).maybeSingle();
  return <WalkthroughClient employee={emp} session={session ?? { phase: 1, employee_id: employeeId }} />;
}
```

- [ ] **Step 2: Phase index export**

Create `app/onboarding/[employeeId]/_phases/index.ts`:

```ts
export { Phase1Brief } from "./phase-1-brief";
export { Phase2Reading } from "./phase-2-reading";
export { Phase3Observe } from "./phase-3-observe";
export { Phase4Plan } from "./phase-4-plan";
export { Phase5Approve } from "./phase-5-approve";
```

- [ ] **Step 3: Walkthrough client (state machine + chrome)**

Create `app/onboarding/[employeeId]/walkthrough-client.tsx`:

```tsx
"use client";

import { useEffect } from "react";
import { useWalkthrough, type Phase } from "@/src/store/walkthrough";
import { AvatarCard } from "@/src/components/avatar-card";
import { Serif } from "@/src/components/serif";
import {
  Phase1Brief, Phase2Reading, Phase3Observe, Phase4Plan, Phase5Approve,
} from "./_phases";

const DAY_LABELS: Record<Phase, string> = {
  1: "Day one — getting acquainted",
  2: "Day one — reading the room",
  3: "Day one — picking up your style",
  4: "Day one — planning the work",
  5: "Day one — your call",
  6: "Already on it.",
};

export function WalkthroughClient({
  employee,
  session,
}: {
  employee: { id: string; name: string; role: string };
  session: { phase?: number; employee_id: string };
}) {
  const phase = useWalkthrough(s => s.phase);
  const setPhase = useWalkthrough(s => s.setPhase);

  useEffect(() => {
    if (session.phase) setPhase(session.phase as Phase);
  }, [session.phase, setPhase]);

  return (
    <main className="min-h-screen px-6 py-10 flex flex-col items-center">
      <div className="w-full max-w-[760px]">
        <div className="flex items-start justify-between mb-12">
          <Serif italic className="text-[14px] text-[--color-ink-faint]">
            {DAY_LABELS[phase]}
          </Serif>
          <AvatarCard name={employee.name} role="AI Product Manager" size="sm" />
        </div>

        <div className="space-y-8">
          {phase === 1 && <Phase1Brief employeeId={employee.id} />}
          {phase === 2 && <Phase2Reading employeeId={employee.id} />}
          {phase === 3 && <Phase3Observe employeeId={employee.id} />}
          {phase === 4 && <Phase4Plan employeeId={employee.id} />}
          {phase === 5 && <Phase5Approve employeeId={employee.id} />}
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 4: Stub the 5 phase components**

Create stubs (each will be filled in subsequent tasks). Create `app/onboarding/[employeeId]/_phases/phase-1-brief.tsx`:

```tsx
"use client";
export function Phase1Brief({ employeeId }: { employeeId: string }) {
  return <div>Phase 1 — Brief — TODO ({employeeId})</div>;
}
```

Repeat for `phase-2-reading.tsx` (`Phase2Reading`), `phase-3-observe.tsx` (`Phase3Observe`), `phase-4-plan.tsx` (`Phase4Plan`), `phase-5-approve.tsx` (`Phase5Approve`) — each a one-line stub.

- [ ] **Step 5: Smoke check**

Run `pnpm dev`. Click "Hire" on `/`. Expected: lands on `/onboarding/[uuid]` showing the day label, avatar in corner, and "Phase 1 — Brief — TODO" text. Stop server.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(walkthrough): route shell + phase state machine + chrome (avatar+day label)"
```

---

### Task 24: Phase 1 — Brief form + dropzone

**Files:**
- Create: `src/server/onboarding-actions.ts`
- Modify: `app/onboarding/[employeeId]/_phases/phase-1-brief.tsx`

- [ ] **Step 1: Server action `submitBrief`**

Create `src/server/onboarding-actions.ts`:

```ts
"use server";

import { revalidatePath } from "next/cache";
import { updateOnboarding, logEvent } from "@/src/db/queries";
import { storeAndParseUpload } from "./uploads";

export type BriefData = {
  project: string;
  role: string;
  priorities: string[];
  time_sink: string;
  team?: string;
  tools?: string[];
};

export async function submitBrief(employeeId: string, brief: BriefData, files: Array<{ name: string; type: string; data: ArrayBuffer }>) {
  for (const file of files) {
    await storeAndParseUpload(employeeId, file);
  }
  await updateOnboarding(employeeId, { brief, phase: 2 });
  await logEvent(employeeId, "phase_completed", { phase: 1 });
  revalidatePath(`/onboarding/${employeeId}`);
}
```

- [ ] **Step 2: Phase 1 component (typeform cadence)**

Replace `app/onboarding/[employeeId]/_phases/phase-1-brief.tsx`:

```tsx
"use client";

import { useState } from "react";
import { Dropzone } from "@/src/components/dropzone";
import { Serif } from "@/src/components/serif";
import { useWalkthrough } from "@/src/store/walkthrough";
import { submitBrief, BriefData } from "@/src/server/onboarding-actions";

const STEPS = [
  { key: "project", q: "What are you building?", placeholder: "Saathi — AI employees that learn how you work" },
  { key: "role", q: "What's your role?", placeholder: "Founder / Head of Product / …" },
  { key: "priorities", q: "Top three priorities right now?", placeholder: "Ship the YC demo, close design partners, hire eng #2" },
  { key: "time_sink", q: "What's eating most of your time?", placeholder: "Drafting PRDs from scratch every week" },
  { key: "team", q: "Who's on the team? (optional)", placeholder: "3 engineers + 1 designer" },
  { key: "tools", q: "What tools do you live in?", placeholder: "Notion, Slack, GitHub, Figma" },
] as const;

export function Phase1Brief({ employeeId }: { employeeId: string }) {
  const setPhase = useWalkthrough(s => s.setPhase);
  const setBriefStore = useWalkthrough(s => s.setBrief);
  const [stepIdx, setStepIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const onUpload = async () => {
    if (!files.length) return;
    setSubmitting(true);
    const filePayload = await Promise.all(files.map(async f => ({
      name: f.name, type: f.type, data: await f.arrayBuffer(),
    })));
    const brief: BriefData = {
      project: answers.project ?? "",
      role: answers.role ?? "",
      priorities: (answers.priorities ?? "").split(",").map(s => s.trim()).filter(Boolean),
      time_sink: answers.time_sink ?? "",
      team: answers.team,
      tools: (answers.tools ?? "").split(",").map(s => s.trim()).filter(Boolean),
    };
    setBriefStore(brief);
    await submitBrief(employeeId, brief, filePayload);
    setPhase(2);
    setSubmitting(false);
  };

  if (stepIdx < STEPS.length) {
    const step = STEPS[stepIdx];
    return (
      <section className="space-y-6">
        <Serif as="h2" className="text-[28px]">{step.q}</Serif>
        <input
          autoFocus
          className="w-full bg-transparent border-b border-[--color-paper-edge] py-3 text-[18px] focus:outline-none focus:border-[--color-coral]"
          placeholder={step.placeholder}
          value={answers[step.key] ?? ""}
          onChange={e => setAnswers(a => ({ ...a, [step.key]: e.target.value }))}
          onKeyDown={e => { if (e.key === "Enter") setStepIdx(stepIdx + 1); }}
        />
        <div className="flex justify-between items-center">
          <button
            onClick={() => setStepIdx(Math.max(0, stepIdx - 1))}
            className="text-[12px] uppercase tracking-[0.12em] text-[--color-ink-faint]"
          >Back</button>
          <button
            onClick={() => setStepIdx(stepIdx + 1)}
            className="px-5 py-2 text-[12px] uppercase tracking-[0.12em] text-[--color-paper] bg-[--color-ink]"
          >Next</button>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <Serif as="h2" className="text-[28px]">Drop in anything I should read.</Serif>
      <p className="text-[14px] text-[--color-ink-muted]">PRDs, briefs, meeting notes, your roadmap. The more, the better.</p>
      <Dropzone onFiles={fs => setFiles(prev => [...prev, ...fs])} />
      {files.length > 0 && (
        <ul className="text-[13px] space-y-1">
          {files.map((f, i) => <li key={i} className="text-[--color-ink-muted]">· {f.name}</li>)}
        </ul>
      )}
      <div className="flex justify-between items-center pt-2">
        <button
          onClick={() => setStepIdx(STEPS.length - 1)}
          className="text-[12px] uppercase tracking-[0.12em] text-[--color-ink-faint]"
        >Back</button>
        <button
          disabled={files.length === 0 || submitting}
          onClick={onUpload}
          className="px-5 py-2 text-[12px] uppercase tracking-[0.12em] text-[--color-paper] bg-[--color-ink] disabled:opacity-50"
        >
          {submitting ? "Reading…" : "Hand it over"}
        </button>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Smoke check**

Run `pnpm dev`. Walk through 6 fields, drop a file (use any handy PDF), click "Hand it over". Expected: page transitions to Phase 2 stub. Verify `onboarding_sessions.brief` saved + `uploads` row created in Supabase.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(walkthrough): phase 1 brief form + dropzone + submit action"
```

---

### Task 25: Phase 2 — Reading moment + understood card

**Files:**
- Create: `src/server/run-understand.ts`
- Modify: `app/onboarding/[employeeId]/_phases/phase-2-reading.tsx`

- [ ] **Step 1: Server action**

Create `src/server/run-understand.ts`:

```ts
"use server";

import { listUploads, updateOnboarding, logEvent } from "@/src/db/queries";
import { serverClient } from "@/src/db/client";

export async function fetchOnboardingForUnderstand(employeeId: string) {
  const sb = serverClient();
  const { data: session } = await sb.from("onboarding_sessions").select("*").eq("employee_id", employeeId).maybeSingle();
  const uploads = await listUploads(employeeId);
  return {
    brief: session?.brief ?? {},
    docs: uploads.map(u => ({ filename: u.filename, parsed_text: u.parsed_text ?? "" })),
  };
}

export async function persistUnderstood(employeeId: string, summary: unknown) {
  await updateOnboarding(employeeId, { context_summary: summary, phase: 3 });
  await logEvent(employeeId, "phase_completed", { phase: 2 });
}
```

- [ ] **Step 2: Phase 2 component**

Replace `app/onboarding/[employeeId]/_phases/phase-2-reading.tsx`:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Serif } from "@/src/components/serif";
import { TypewriterLine } from "@/src/components/typewriter-line";
import { useWalkthrough } from "@/src/store/walkthrough";
import { fetchOnboardingForUnderstand, persistUnderstood } from "@/src/server/run-understand";

type Understood = { project_context: string; role_and_priorities: string; how_you_communicate: string };

export function Phase2Reading({ employeeId }: { employeeId: string }) {
  const setPhase = useWalkthrough(s => s.setPhase);
  const setUnderstoodStore = useWalkthrough(s => s.setUnderstood);
  const [lines, setLines] = useState<string[]>([]);
  const [understood, setUnderstood] = useState<Understood | null>(null);
  const [editMode, setEditMode] = useState(false);
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    (async () => {
      const ctx = await fetchOnboardingForUnderstand(employeeId);

      const queue = [
        ...ctx.docs.map(d => `Reading ${d.filename}…`),
        "Picking up your writing style…",
        "Understanding your priorities…",
      ];
      for (const l of queue) {
        setLines(prev => [...prev, l]);
        await new Promise(r => setTimeout(r, 800));
      }

      const res = await fetch("/api/ai/understand", {
        method: "POST", body: JSON.stringify(ctx),
      });
      const text = await res.text();
      const start = text.indexOf("{");
      const end = text.lastIndexOf("}");
      if (start < 0 || end < 0) {
        setUnderstood({ project_context: "I read what I could. Let's keep going.", role_and_priorities: "Let's confirm your priorities below.", how_you_communicate: "I'll calibrate as we go." });
        return;
      }
      try {
        const parsed = JSON.parse(text.slice(start, end + 1)) as Understood;
        setUnderstood(parsed);
        setUnderstoodStore(parsed);
      } catch {
        setUnderstood({ project_context: text.slice(start, end + 1), role_and_priorities: "", how_you_communicate: "" });
      }
    })();
  }, [employeeId, setUnderstoodStore]);

  if (!understood) {
    return (
      <section className="space-y-3">
        {lines.map((l, i) => (
          <div key={i} className="text-[15px] text-[--color-ink-muted]">
            {i === lines.length - 1 ? <TypewriterLine text={l} /> : <span>· {l}</span>}
          </div>
        ))}
      </section>
    );
  }

  return (
    <section className="space-y-8">
      <Serif as="h2" className="text-[28px]">Here's what I understood.</Serif>
      <SummaryBlock label="Project context" value={understood.project_context} editable={editMode} onChange={v => setUnderstood({ ...understood, project_context: v })} />
      <SummaryBlock label="Your role & priorities" value={understood.role_and_priorities} editable={editMode} onChange={v => setUnderstood({ ...understood, role_and_priorities: v })} />
      <SummaryBlock label="How you communicate" value={understood.how_you_communicate} editable={editMode} onChange={v => setUnderstood({ ...understood, how_you_communicate: v })} />

      <div className="flex gap-3 pt-4">
        <button
          onClick={async () => { await persistUnderstood(employeeId, understood); setPhase(3); }}
          className="px-5 py-2 text-[12px] uppercase tracking-[0.12em] text-[--color-paper] bg-[--color-ink]"
        >That's right, keep going</button>
        <button
          onClick={() => setEditMode(true)}
          className="px-5 py-2 text-[12px] uppercase tracking-[0.12em] border border-[--color-paper-edge]"
        >Let me correct this</button>
      </div>
    </section>
  );
}

function SummaryBlock({ label, value, editable, onChange }: { label: string; value: string; editable: boolean; onChange: (v: string) => void }) {
  return (
    <div className="space-y-2">
      <div className="label">{label}</div>
      {editable ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full bg-white border border-[--color-paper-edge] rounded p-3 text-[15px] leading-relaxed serif"
          rows={3}
        />
      ) : (
        <p className="serif text-[16px] leading-relaxed">{value}</p>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Smoke check**

Continue from a fresh seed: run through Phase 1 with a real PDF (or use existing `Saathi_OnePager_YC copy.docx`). Reach Phase 2. Expected: lines stream in, then "Here's what I understood" with three filled paragraphs. Click "That's right" → Phase 3 stub.

If `ANTHROPIC_API_KEY` is missing or returns garbage, the canned fallback should fire silently after 10s.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(walkthrough): phase 2 reading moment + understood card with inline edit"
```

---

### Task 26: Phase 3 — Observe how you work

**Files:**
- Modify: `app/onboarding/[employeeId]/_phases/phase-3-observe.tsx`

- [ ] **Step 1: Implement**

Replace `app/onboarding/[employeeId]/_phases/phase-3-observe.tsx`:

```tsx
"use client";

import { useState } from "react";
import { Serif } from "@/src/components/serif";
import { Dropzone } from "@/src/components/dropzone";
import { useWalkthrough } from "@/src/store/walkthrough";
import { updateOnboardingObservations } from "@/src/server/onboarding-actions";
import { storeAndParseUpload } from "@/src/server/uploads";

const QUESTIONS = [
  { key: "prd_depth", q: "Should your PRDs be 1-pagers or full specs?", options: ["1-pager", "Full spec", "Depends on the feature"] },
  { key: "stakeholders", q: "Who are your main stakeholders?", placeholder: "Engineers + design + CEO" },
  { key: "done_definition", q: "What does a 'done' PRD look like to you?", placeholder: "Approved by eng lead and design lead, scope reviewed" },
  { key: "scope_creep", q: "How do you handle scope creep?", options: ["Strict — push back hard", "Flexible — capture for v2", "Depends on who's asking"] },
] as const;

const DECISION_STYLE = [
  { val: "ask_always", label: "Ask everything", sub: "I want to approve before any send" },
  { val: "ask_external", label: "Ask for external actions", sub: "Drafts are yours; sending needs me" },
  { val: "just_do_it", label: "Just do it", sub: "I'll review when something looks off" },
];

export function Phase3Observe({ employeeId }: { employeeId: string }) {
  const setPhase = useWalkthrough(s => s.setPhase);
  const setObsStore = useWalkthrough(s => s.setObservations);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [decisionStyle, setDecisionStyle] = useState<string>("ask_external");
  const [sampleFile, setSampleFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const total = QUESTIONS.length + 2; // questions + decision style + sample upload
  const isQ = step < QUESTIONS.length;
  const isDecision = step === QUESTIONS.length;
  const isSample = step === QUESTIONS.length + 1;

  const finish = async () => {
    setSubmitting(true);
    let sample_prd_text: string | undefined;
    if (sampleFile) {
      const data = await sampleFile.arrayBuffer();
      const stored = await storeAndParseUpload(employeeId, { name: sampleFile.name, type: sampleFile.type, data });
      sample_prd_text = stored.parsed_text;
    }
    const observations = { ...answers, decision_style: decisionStyle, sample_prd_text };
    setObsStore(observations);
    await updateOnboardingObservations(employeeId, observations);
    setPhase(4);
  };

  if (isQ) {
    const cur = QUESTIONS[step];
    return (
      <section className="space-y-6">
        <Serif as="h2" className="text-[28px]">{cur.q}</Serif>
        {"options" in cur ? (
          <div className="space-y-2">
            {cur.options.map(o => (
              <button
                key={o}
                onClick={() => { setAnswers(a => ({ ...a, [cur.key]: o })); setStep(step + 1); }}
                className={`w-full text-left px-4 py-3 rounded border ${
                  answers[cur.key] === o ? "border-[--color-coral] bg-[--color-paper-hi]" : "border-[--color-paper-edge] bg-white"
                }`}
              >{o}</button>
            ))}
          </div>
        ) : (
          <input
            autoFocus
            className="w-full bg-transparent border-b border-[--color-paper-edge] py-3 text-[18px] focus:outline-none focus:border-[--color-coral]"
            placeholder={(cur as any).placeholder}
            value={answers[cur.key] ?? ""}
            onChange={e => setAnswers(a => ({ ...a, [cur.key]: e.target.value }))}
            onKeyDown={e => { if (e.key === "Enter") setStep(step + 1); }}
          />
        )}
        <div className="flex justify-between">
          <button onClick={() => setStep(Math.max(0, step - 1))} className="text-[12px] uppercase tracking-[0.12em] text-[--color-ink-faint]">Back</button>
          <span className="label">{step + 1} / {total}</span>
        </div>
      </section>
    );
  }

  if (isDecision) {
    return (
      <section className="space-y-6">
        <Serif as="h2" className="text-[28px]">How much do you want to be in the loop?</Serif>
        <div className="space-y-2">
          {DECISION_STYLE.map(d => (
            <button
              key={d.val}
              onClick={() => setDecisionStyle(d.val)}
              className={`w-full text-left px-4 py-3 rounded border ${
                decisionStyle === d.val ? "border-[--color-coral] bg-[--color-paper-hi]" : "border-[--color-paper-edge] bg-white"
              }`}
            >
              <div className="text-[14px]">{d.label}</div>
              <div className="text-[12.5px] text-[--color-ink-faint]">{d.sub}</div>
            </button>
          ))}
        </div>
        <div className="flex justify-between">
          <button onClick={() => setStep(step - 1)} className="text-[12px] uppercase tracking-[0.12em] text-[--color-ink-faint]">Back</button>
          <button onClick={() => setStep(step + 1)} className="px-5 py-2 text-[12px] uppercase tracking-[0.12em] text-[--color-paper] bg-[--color-ink]">Next</button>
        </div>
      </section>
    );
  }

  if (isSample) {
    return (
      <section className="space-y-6">
        <Serif as="h2" className="text-[28px]">Drop a PRD you're proud of.</Serif>
        <p className="text-[14px] text-[--color-ink-muted]">Optional — but it's the fastest way for me to learn your bar.</p>
        <Dropzone onFiles={f => setSampleFile(f[0] ?? null)} multiple={false} />
        {sampleFile && <p className="text-[13px] text-[--color-ink-muted]">· {sampleFile.name}</p>}
        <div className="flex justify-between">
          <button onClick={() => setStep(step - 1)} className="text-[12px] uppercase tracking-[0.12em] text-[--color-ink-faint]">Back</button>
          <button onClick={finish} disabled={submitting} className="px-5 py-2 text-[12px] uppercase tracking-[0.12em] text-[--color-paper] bg-[--color-ink] disabled:opacity-50">
            {submitting ? "Saving…" : "Show me what you'll do"}
          </button>
        </div>
      </section>
    );
  }

  return null;
}
```

- [ ] **Step 2: Add the persist action**

Append to `src/server/onboarding-actions.ts`:

```ts
export async function updateOnboardingObservations(employeeId: string, observations: Record<string, unknown>) {
  await updateOnboarding(employeeId, { observations, phase: 4 });
  await logEvent(employeeId, "phase_completed", { phase: 3 });
}
```

- [ ] **Step 3: Smoke check** — flow through Phase 3, confirm `onboarding_sessions.observations` populated.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(walkthrough): phase 3 observation questions + decision style + sample upload"
```

---

### Task 27: Phase 4 — Action plan streaming

**Files:**
- Create: `src/server/run-plan.ts`
- Modify: `app/onboarding/[employeeId]/_phases/phase-4-plan.tsx`

- [ ] **Step 1: Server fetch action**

Create `src/server/run-plan.ts`:

```ts
"use server";

import { listUploads, updateOnboarding, logEvent } from "@/src/db/queries";
import { serverClient } from "@/src/db/client";

export async function fetchPlanInputs(employeeId: string) {
  const sb = serverClient();
  const { data: session } = await sb.from("onboarding_sessions").select("*").eq("employee_id", employeeId).maybeSingle();
  const uploads = await listUploads(employeeId);
  return {
    brief: session?.brief ?? {},
    context_summary: session?.context_summary ?? {},
    observations: session?.observations ?? {},
    docs: uploads.map(u => ({ filename: u.filename, parsed_text: u.parsed_text ?? "" })),
  };
}

export async function persistPlan(employeeId: string, plan: unknown) {
  await updateOnboarding(employeeId, { action_plan: plan, phase: 5 });
  await logEvent(employeeId, "phase_completed", { phase: 4 });
}
```

- [ ] **Step 2: Phase 4 component**

Replace `app/onboarding/[employeeId]/_phases/phase-4-plan.tsx`:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Serif } from "@/src/components/serif";
import { StatusPill } from "@/src/components/status-pill";
import { useWalkthrough } from "@/src/store/walkthrough";
import { fetchPlanInputs, persistPlan } from "@/src/server/run-plan";
import type { ActionPlan, ActionItem } from "@/src/ai/prompts/propose-action-plan";

export function Phase4Plan({ employeeId }: { employeeId: string }) {
  const setPhase = useWalkthrough(s => s.setPhase);
  const setPlanStore = useWalkthrough(s => s.setActionPlan);
  const [plan, setPlan] = useState<ActionPlan | null>(null);
  const [streaming, setStreaming] = useState(true);
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    (async () => {
      const inputs = await fetchPlanInputs(employeeId);
      const res = await fetch("/api/ai/plan", { method: "POST", body: JSON.stringify(inputs) });
      const text = await res.text();
      const s = text.indexOf("{"); const e = text.lastIndexOf("}");
      if (s < 0 || e < 0) { setStreaming(false); return; }
      try {
        const parsed = JSON.parse(text.slice(s, e + 1)) as ActionPlan;
        setPlan(parsed);
        setPlanStore(parsed);
      } catch {}
      setStreaming(false);
    })();
  }, [employeeId, setPlanStore]);

  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between">
        <Serif as="h2" className="text-[28px]">Here's how I'd work with you.</Serif>
        {streaming && <StatusPill>Drafting</StatusPill>}
      </div>

      {!plan && (
        <p className="serif italic text-[--color-ink-faint] text-[15px]">Putting it together…</p>
      )}

      {plan && (
        <>
          <Tier label="I will own" items={plan.own ?? []} />
          <Tier label="I will assist on" items={plan.assist ?? []} />
          <Tier label="I will flag" items={plan.flag ?? []} />
        </>
      )}

      <div className="flex justify-end pt-2">
        <button
          disabled={!plan}
          onClick={async () => { if (!plan) return; await persistPlan(employeeId, plan); setPhase(5); }}
          className="px-5 py-2 text-[12px] uppercase tracking-[0.12em] text-[--color-paper] bg-[--color-ink] disabled:opacity-50"
        >Looks good — let me approve</button>
      </div>
    </section>
  );
}

function Tier({ label, items }: { label: string; items: ActionItem[] }) {
  return (
    <div className="space-y-2">
      <Serif italic className="text-[14px] text-[--color-ink-muted]">{label}</Serif>
      <ul className="space-y-2">
        {items.map((it, i) => (
          <li key={i} className="bg-white border border-[--color-paper-edge] rounded p-3">
            <div className="text-[14px] text-[--color-ink]">{it.title}</div>
            <div className="text-[12.5px] text-[--color-ink-faint] mt-1 italic">{it.rationale}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

- [ ] **Step 3: Smoke check** — Phase 4 displays a streaming action plan with three tiers. With no API key, falls back to canned response.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(walkthrough): phase 4 streaming action plan with three tiers"
```

---

### Task 28: Phase 5 — Approve + autonomy + Start working

**Files:**
- Create: `src/server/start-working.ts`
- Modify: `app/onboarding/[employeeId]/_phases/phase-5-approve.tsx`

- [ ] **Step 1: Server action**

Create `src/server/start-working.ts`:

```ts
"use server";

import { redirect } from "next/navigation";
import { serverClient } from "@/src/db/client";
import { updateOnboarding, setEmployeeStatus, logEvent } from "@/src/db/queries";

export async function startWorking(
  employeeId: string,
  approvals: Record<string, "approved" | "modified" | "removed">,
  autonomyLevel: "ask_always" | "ask_external" | "just_do_it",
  modifications: Record<string, string>,
) {
  const sb = serverClient();
  await updateOnboarding(employeeId, {
    approvals,
    completed_at: new Date().toISOString(),
    phase: 6,
  });
  await sb.from("employees").update({ autonomy_level: autonomyLevel }).eq("id", employeeId);
  await setEmployeeStatus(employeeId, "working");
  await logEvent(employeeId, "phase_completed", { phase: 5, modifications });
  await logEvent(employeeId, "onboarding_completed");
  redirect(`/work/${employeeId}?bootstrap=1`);
}
```

- [ ] **Step 2: Phase 5 component**

Replace `app/onboarding/[employeeId]/_phases/phase-5-approve.tsx`:

```tsx
"use client";

import { useState } from "react";
import { Serif } from "@/src/components/serif";
import { useWalkthrough } from "@/src/store/walkthrough";
import { startWorking } from "@/src/server/start-working";
import type { ActionItem } from "@/src/ai/prompts/propose-action-plan";

const AUTONOMY = [
  { val: "ask_always", label: "Ask everything" },
  { val: "ask_external", label: "Ask for external actions" },
  { val: "just_do_it", label: "Just do it" },
] as const;

export function Phase5Approve({ employeeId }: { employeeId: string }) {
  const plan = useWalkthrough(s => s.actionPlanDraft);
  const [approvals, setApprovals] = useState<Record<string, "approved"|"modified"|"removed">>({});
  const [mods, setMods] = useState<Record<string, string>>({});
  const [autonomy, setAutonomy] = useState<typeof AUTONOMY[number]["val"]>("ask_external");
  const [submitting, setSubmitting] = useState(false);

  const tiers: Array<{ label: string; items: ActionItem[]; tier: string }> = [
    { label: "I will own", items: plan?.own ?? [], tier: "own" },
    { label: "I will assist on", items: plan?.assist ?? [], tier: "assist" },
    { label: "I will flag", items: plan?.flag ?? [], tier: "flag" },
  ];

  const setApproval = (key: string, val: "approved"|"modified"|"removed") =>
    setApprovals(a => ({ ...a, [key]: val }));

  const counts = {
    own: tiers[0].items.filter((_, i) => approvals[`own-${i}`] !== "removed").length,
    assist: tiers[1].items.filter((_, i) => approvals[`assist-${i}`] !== "removed").length,
    flag: tiers[2].items.filter((_, i) => approvals[`flag-${i}`] !== "removed").length,
  };

  return (
    <section className="space-y-8">
      <Serif as="h2" className="text-[28px]">Your call.</Serif>

      {tiers.map(t => (
        <div key={t.tier} className="space-y-2">
          <Serif italic className="text-[14px] text-[--color-ink-muted]">{t.label}</Serif>
          <ul className="space-y-2">
            {t.items.map((it, i) => {
              const k = `${t.tier}-${i}`;
              const state = approvals[k] ?? "approved";
              return (
                <li key={k} className={`bg-white border rounded p-3 ${state === "removed" ? "opacity-40 line-through" : "border-[--color-paper-edge]"}`}>
                  <div className="text-[14px]">{state === "modified" ? (
                    <input
                      defaultValue={mods[k] ?? it.title}
                      onChange={e => setMods(m => ({ ...m, [k]: e.target.value }))}
                      className="w-full bg-transparent border-b border-[--color-paper-edge] focus:outline-none"
                    />
                  ) : it.title}</div>
                  <div className="text-[12.5px] text-[--color-ink-faint] mt-1 italic">{it.rationale}</div>
                  <div className="flex gap-1 mt-2">
                    {(["approved","modified","removed"] as const).map(opt => (
                      <button
                        key={opt}
                        onClick={() => setApproval(k, opt)}
                        className={`text-[11px] uppercase tracking-[0.1em] px-2 py-1 rounded ${state === opt ? "bg-[--color-ink] text-[--color-paper]" : "text-[--color-ink-faint]"}`}
                      >{opt}</button>
                    ))}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ))}

      <div className="space-y-3 pt-2 border-t border-[--color-paper-edge]">
        <div className="label">Autonomy</div>
        <div className="flex gap-2">
          {AUTONOMY.map(a => (
            <button
              key={a.val}
              onClick={() => setAutonomy(a.val)}
              className={`px-3 py-1.5 text-[12px] rounded border ${autonomy === a.val ? "bg-[--color-ink] text-[--color-paper] border-[--color-ink]" : "border-[--color-paper-edge]"}`}
            >{a.label}</button>
          ))}
        </div>
      </div>

      <p className="text-[14px] text-[--color-ink-muted]">
        Alex will own <strong>{counts.own}</strong> tasks, assist on <strong>{counts.assist}</strong>, and flag <strong>{counts.flag}</strong> things.
      </p>

      <div className="flex justify-end">
        <button
          disabled={submitting}
          onClick={async () => {
            setSubmitting(true);
            await startWorking(employeeId, approvals, autonomy, mods);
          }}
          className="px-7 py-3 text-[12px] uppercase tracking-[0.12em] text-[--color-paper] bg-[--color-ink] disabled:opacity-50"
        >
          {submitting ? "Starting…" : "Start working"}
        </button>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Smoke check** — flow through to Phase 5, click "Start working". Expected: redirect to `/work/[employeeId]?bootstrap=1` (route doesn't exist yet → 404 is fine).

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(walkthrough): phase 5 approval UI + autonomy + start working"
```

---

## Phase H — Workspace (Tasks 29–33)

### Task 29: Workspace route + layout shell + bootstrap flow

**Files:**
- Create: `app/work/[employeeId]/page.tsx`, `app/work/[employeeId]/workspace-client.tsx`, `src/server/run-prd.ts`

When `?bootstrap=1` is present, the workspace immediately starts streaming a PRD for Issue #47 (Phase 6's auto-run handoff). Otherwise it shows the most recent PRD.

- [ ] **Step 1: Server fetch + bootstrap action**

Create `src/server/run-prd.ts`:

```ts
"use server";

import { serverClient } from "@/src/db/client";
import { listEmployeePrds, listUploads, logEvent } from "@/src/db/queries";
import { readFile } from "node:fs/promises";
import path from "node:path";

export async function fetchWorkspaceState(employeeId: string) {
  const sb = serverClient();
  const { data: emp } = await sb.from("employees").select("*").eq("id", employeeId).maybeSingle();
  const { data: session } = await sb.from("onboarding_sessions").select("*").eq("employee_id", employeeId).maybeSingle();
  const uploads = await listUploads(employeeId);
  const prds = await listEmployeePrds(employeeId);
  return { emp, session, uploads, prds };
}

export async function fetchPrdInputs(employeeId: string, source: string) {
  const sb = serverClient();
  const { data: session } = await sb.from("onboarding_sessions").select("*").eq("employee_id", employeeId).maybeSingle();
  const uploads = await listUploads(employeeId);
  return {
    context_summary: session?.context_summary ?? {},
    observations: session?.observations ?? {},
    docs: uploads.map(u => ({ filename: u.filename, parsed_text: u.parsed_text ?? "" })),
    source,
  };
}

export async function createPrd(employeeId: string, title: string, sourceIssue: string) {
  const sb = serverClient();
  const { data, error } = await sb
    .from("prds")
    .insert({ employee_id: employeeId, title, source_issue: sourceIssue, sections: {}, status: "streaming" })
    .select()
    .single();
  if (error) throw error;
  await logEvent(employeeId, "prd_started", { id: data.id, title });
  return data;
}

export async function persistPrdSections(prdId: string, employeeId: string, sections: Record<string, string>, title: string) {
  const sb = serverClient();
  await sb.from("prds").update({ sections, title, status: "draft", updated_at: new Date().toISOString() }).eq("id", prdId);
  await logEvent(employeeId, "prd_generated", { id: prdId });
}

export async function persistPrdEdit(prdId: string, sectionKey: string, content: string) {
  const sb = serverClient();
  const { data: existing } = await sb.from("prds").select("sections").eq("id", prdId).maybeSingle();
  const sections = { ...(existing?.sections ?? {}), [sectionKey]: content };
  await sb.from("prds").update({ sections, status: "edited", updated_at: new Date().toISOString() }).eq("id", prdId);
}

export async function loadIssueFixture(): Promise<{ title: string; body: string }> {
  const file = path.resolve(process.cwd(), "fixtures/demo/issue-47.json");
  return JSON.parse(await readFile(file, "utf8"));
}
```

- [ ] **Step 2: Server page**

Create `app/work/[employeeId]/page.tsx`:

```tsx
import { fetchWorkspaceState } from "@/src/server/run-prd";
import { WorkspaceClient } from "./workspace-client";
import { notFound } from "next/navigation";

export default async function WorkPage({
  params,
  searchParams,
}: {
  params: Promise<{ employeeId: string }>;
  searchParams: Promise<{ bootstrap?: string }>;
}) {
  const { employeeId } = await params;
  const sp = await searchParams;
  const state = await fetchWorkspaceState(employeeId);
  if (!state.emp) notFound();
  return (
    <WorkspaceClient
      employee={state.emp}
      uploads={state.uploads}
      prds={state.prds}
      actionPlan={state.session?.action_plan ?? null}
      bootstrap={sp.bootstrap === "1"}
    />
  );
}
```

- [ ] **Step 3: Workspace shell with two columns**

Create `app/work/[employeeId]/workspace-client.tsx`:

```tsx
"use client";

import { AvatarCard } from "@/src/components/avatar-card";
import { StatusPill } from "@/src/components/status-pill";
import { useWorkspace } from "@/src/store/workspace";
import { PrdSurface } from "./_workspace/prd-surface";
import { LeftRail } from "./_workspace/left-rail";

export function WorkspaceClient({
  employee,
  uploads,
  prds,
  actionPlan,
  bootstrap,
}: {
  employee: { id: string; name: string; role: string };
  uploads: Array<{ id: string; filename: string }>;
  prds: Array<{ id: string; title: string; sections: Record<string, string>; source_issue: string | null }>;
  actionPlan: { own: { title: string }[]; assist: { title: string }[]; flag: { title: string }[] } | null;
  bootstrap: boolean;
}) {
  const status = useWorkspace(s => s.status);

  return (
    <main className="min-h-screen bg-[--color-paper]">
      <header className="px-6 py-4 border-b border-[--color-paper-edge] bg-[--color-paper-hi] flex items-center justify-between">
        <AvatarCard name={employee.name} role="AI Product Manager" size="sm" />
        <StatusPill active={status !== "idle"}>{statusLabel(status)}</StatusPill>
      </header>
      <div className="grid grid-cols-[300px_1fr] min-h-[calc(100vh-65px)]">
        <LeftRail employeeId={employee.id} uploads={uploads} actionPlan={actionPlan} />
        <PrdSurface employeeId={employee.id} initialPrds={prds} bootstrap={bootstrap} />
      </div>
    </main>
  );
}

function statusLabel(s: string) {
  switch (s) {
    case "drafting": return "Drafting";
    case "editing": return "Editing";
    case "exporting": return "Exporting";
    default: return "Idle";
  }
}
```

- [ ] **Step 4: Stub the two child components**

Create `app/work/[employeeId]/_workspace/left-rail.tsx`:

```tsx
"use client";
export function LeftRail(_props: any) {
  return <aside className="bg-[--color-paper-hi] border-r border-[--color-paper-edge] p-6 text-[13px]">Left rail — TODO</aside>;
}
```

Create `app/work/[employeeId]/_workspace/prd-surface.tsx`:

```tsx
"use client";
export function PrdSurface(_props: any) {
  return <section className="p-10">PRD surface — TODO</section>;
}
```

- [ ] **Step 5: Smoke check** — full flow from `/` through walkthrough → arrives at workspace shell with the two-column layout. Stub content visible on each side.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(workspace): route + two-column shell + server queries"
```

---

### Task 30: PRD streaming renderer with editable sections

**Files:**
- Create: `app/work/[employeeId]/_workspace/prd-section.tsx`
- Modify: `app/work/[employeeId]/_workspace/prd-surface.tsx`

- [ ] **Step 1: Install Tiptap**

```bash
pnpm add @tiptap/react @tiptap/pm @tiptap/starter-kit
```

- [ ] **Step 2: PRD section block (editable)**

Create `app/work/[employeeId]/_workspace/prd-section.tsx`:

```tsx
"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useState } from "react";

const LABELS: Record<string, string> = {
  problem: "Problem statement",
  goals: "Goals",
  user_stories: "User stories",
  scope: "Scope",
  out_of_scope: "Out of scope",
  success_metrics: "Success metrics",
};

export function PrdSection({
  sectionKey,
  text,
  streaming,
  onCommit,
}: {
  sectionKey: string;
  text: string;
  streaming: boolean;
  onCommit: (newText: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const editor = useEditor({
    extensions: [StarterKit],
    content: text,
    editable: editing,
    onBlur: ({ editor }) => onCommit(editor.getText()),
  }, [editing]);

  useEffect(() => {
    if (!editing && editor && text !== editor.getText()) {
      editor.commands.setContent(text);
    }
  }, [text, editor, editing]);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <h3 className="serif text-[14px] uppercase tracking-[0.14em] text-[--color-coral-deep]">
          {LABELS[sectionKey] ?? sectionKey}
        </h3>
        {!streaming && !editing && (
          <button onClick={() => setEditing(true)} className="label cursor-pointer">edit</button>
        )}
        {editing && (
          <button onClick={() => setEditing(false)} className="label cursor-pointer">done</button>
        )}
      </div>
      {editing ? (
        <EditorContent editor={editor} className="serif text-[15px] leading-[1.65] prose prose-stone max-w-none" />
      ) : (
        <p className="serif text-[15px] leading-[1.65] whitespace-pre-wrap">
          {text}
          {streaming && <span className="text-[--color-coral]">▍</span>}
        </p>
      )}
    </div>
  );
}
```

- [ ] **Step 3: PRD surface (streaming + sections)**

Replace `app/work/[employeeId]/_workspace/prd-surface.tsx`:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Serif } from "@/src/components/serif";
import { PrdSection } from "./prd-section";
import { ExportRow } from "./export-row";
import { FollowUps } from "./follow-ups";
import { useWorkspace, type PrdSectionKey } from "@/src/store/workspace";
import {
  createPrd, fetchPrdInputs, persistPrdSections, persistPrdEdit, loadIssueFixture,
} from "@/src/server/run-prd";

const SECTION_ORDER: PrdSectionKey[] = ["problem","goals","user_stories","scope","out_of_scope","success_metrics"];

export function PrdSurface({
  employeeId,
  initialPrds,
  bootstrap,
}: {
  employeeId: string;
  initialPrds: Array<{ id: string; title: string; sections: Record<string, string>; source_issue: string | null }>;
  bootstrap: boolean;
}) {
  const ws = useWorkspace();
  const ran = useRef(false);
  const [latest, setLatest] = useState(initialPrds[0] ?? null);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    if (bootstrap && !initialPrds.length) {
      void runFreshPrd();
    } else if (latest) {
      ws.setPrd({ id: latest.id, title: latest.title });
      Object.entries(latest.sections).forEach(([k, v]) => ws.appendSection(k as PrdSectionKey, v));
      ws.setStatus("idle");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function runFreshPrd() {
    const issue = await loadIssueFixture();
    const sourceLabel = `Issue #47 — ${issue.title}`;
    const inputs = await fetchPrdInputs(employeeId, sourceLabel);
    const created = await createPrd(employeeId, "", sourceLabel);
    setLatest({ id: created.id, title: "", sections: {}, source_issue: sourceLabel });
    ws.setPrd({ id: created.id, title: "" });
    ws.setStatus("drafting");

    const res = await fetch("/api/ai/prd", { method: "POST", body: JSON.stringify(inputs) });
    const text = await res.text();
    const start = text.indexOf("{"); const end = text.lastIndexOf("}");
    if (start < 0 || end < 0) { ws.finishStreaming(); return; }
    const parsed = JSON.parse(text.slice(start, end + 1));
    const sections: Record<string, string> = parsed.sections ?? {};
    for (const key of SECTION_ORDER) {
      const body = sections[key] ?? "";
      ws.setStreamingSection(key);
      for (let i = 0; i < body.length; i += 4) {
        ws.appendSection(key, body.slice(i, i + 4));
        await new Promise(r => setTimeout(r, 18));
      }
    }
    ws.finishStreaming();
    await persistPrdSections(created.id, employeeId, sections, parsed.title ?? "");
    setLatest({ id: created.id, title: parsed.title, sections, source_issue: sourceLabel });
  }

  if (!ws.prdId) {
    return (
      <section className="p-10">
        <p className="serif italic text-[--color-ink-faint]">Pick a task on the left to start.</p>
      </section>
    );
  }

  return (
    <section className="p-10 space-y-6 overflow-y-auto">
      <div>
        <Serif as="h2" className="text-[24px]">{ws.title || "Drafting…"}</Serif>
        <p className="text-[12px] text-[--color-ink-faint] mt-1">Drafted by Alex · sourced from {latest?.source_issue ?? "—"}</p>
      </div>

      <div className="space-y-6">
        {SECTION_ORDER.map(k => (
          <PrdSection
            key={k}
            sectionKey={k}
            text={ws.sections[k] ?? ""}
            streaming={ws.streamingSection === k}
            onCommit={(newText) => {
              ws.appendSection(k, ""); // ensure key exists
              if (ws.prdId) persistPrdEdit(ws.prdId, k, newText);
            }}
          />
        ))}
      </div>

      <FollowUps employeeId={employeeId} />
      <ExportRow />
    </section>
  );
}
```

- [ ] **Step 4: Stub `follow-ups.tsx` and `export-row.tsx` (filled next tasks)**

Create `app/work/[employeeId]/_workspace/follow-ups.tsx`:

```tsx
"use client";
export function FollowUps(_props: { employeeId: string }) { return null; }
```

Create `app/work/[employeeId]/_workspace/export-row.tsx`:

```tsx
"use client";
export function ExportRow() { return null; }
```

- [ ] **Step 5: Smoke check** — finish a fresh walkthrough so workspace lands with `?bootstrap=1`. Expected: PRD sections stream in over ~10–15s. Click "edit" on a finished section, type, click "done"; refresh — edits persist.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(workspace): streaming PRD renderer with editable sections (tiptap)"
```

---

### Task 31: Follow-up chips + free-text input

**Files:**
- Modify: `app/work/[employeeId]/_workspace/follow-ups.tsx`

- [ ] **Step 1: Implement**

Replace `app/work/[employeeId]/_workspace/follow-ups.tsx`:

```tsx
"use client";

import { useState } from "react";
import { useWorkspace, type PrdSectionKey } from "@/src/store/workspace";
import { persistPrdEdit } from "@/src/server/run-prd";

const PRESETS = ["Add API spec", "Write engineering tickets", "Simplify", "Tighten scope"];

export function FollowUps({ employeeId }: { employeeId: string }) {
  void employeeId;
  const ws = useWorkspace();
  const [custom, setCustom] = useState("");
  const [busy, setBusy] = useState(false);

  async function refine(action: string) {
    if (!ws.prdId || busy) return;
    setBusy(true);
    ws.setStatus("drafting");

    const sections = ws.sections;
    const res = await fetch("/api/ai/refine", {
      method: "POST",
      body: JSON.stringify({
        sections,
        action,
        voice_summary: undefined,
      }),
    });
    const text = await res.text();
    const s = text.indexOf("{"); const e = text.lastIndexOf("}");
    if (s < 0 || e < 0) { ws.finishStreaming(); setBusy(false); return; }
    const parsed = JSON.parse(text.slice(s, e + 1)) as { section_key: PrdSectionKey; new_content: string };

    // Reset that section in store and stream the new content.
    ws.setStreamingSection(parsed.section_key);
    // overwrite the section: we re-create by setting state directly via appendSection trick:
    // simplest path — set sections to a fresh value via a tiny zustand-friendly mutation
    useWorkspace.setState({ sections: { ...ws.sections, [parsed.section_key]: "" } });
    for (let i = 0; i < parsed.new_content.length; i += 4) {
      ws.appendSection(parsed.section_key, parsed.new_content.slice(i, i + 4));
      await new Promise(r => setTimeout(r, 14));
    }
    ws.finishStreaming();
    if (ws.prdId) await persistPrdEdit(ws.prdId, parsed.section_key, parsed.new_content);
    setBusy(false);
    setCustom("");
  }

  return (
    <div className="space-y-3 pt-4">
      <div className="flex gap-2 flex-wrap">
        {PRESETS.map(p => (
          <button
            key={p}
            disabled={busy}
            onClick={() => refine(p)}
            className="text-[12px] px-3 py-1.5 rounded-full border border-[--color-paper-edge] hover:border-[--color-coral] disabled:opacity-50"
          >{p}</button>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={custom}
          onChange={e => setCustom(e.target.value)}
          placeholder="Ask Alex to revise something specific…"
          className="flex-1 bg-white border border-[--color-paper-edge] rounded px-3 py-2 text-[13px] focus:outline-none focus:border-[--color-coral]"
          onKeyDown={e => { if (e.key === "Enter" && custom.trim()) refine(custom.trim()); }}
        />
        <button
          onClick={() => custom.trim() && refine(custom.trim())}
          disabled={busy || !custom.trim()}
          className="px-4 py-2 text-[12px] uppercase tracking-[0.1em] text-[--color-paper] bg-[--color-ink] disabled:opacity-50"
        >Send</button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Smoke check** — click a preset chip; expected: relevant section re-streams.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat(workspace): follow-up chips + free-text refinement"
```

---

### Task 32: Left rail — context, action plan, source materials

**Files:**
- Modify: `app/work/[employeeId]/_workspace/left-rail.tsx`

- [ ] **Step 1: Implement**

Replace `app/work/[employeeId]/_workspace/left-rail.tsx`:

```tsx
"use client";

import { Serif } from "@/src/components/serif";

export function LeftRail({
  employeeId,
  uploads,
  actionPlan,
}: {
  employeeId: string;
  uploads: Array<{ id: string; filename: string }>;
  actionPlan: { own: { title: string }[]; assist: { title: string }[]; flag: { title: string }[] } | null;
}) {
  void employeeId;
  return (
    <aside className="bg-[--color-paper-hi] border-r border-[--color-paper-edge] p-6 space-y-7 overflow-y-auto">
      <Section label="Source materials">
        <ul className="space-y-1 text-[13px]">
          {uploads.map(u => (
            <li key={u.id} className="flex items-center gap-2">
              <span className="w-3 h-3 inline-block border border-[--color-paper-edge] rounded-sm" />
              {u.filename}
            </li>
          ))}
          <li className="text-[12px] text-[--color-coral-deep] pt-1 cursor-pointer">＋ Add more</li>
        </ul>
      </Section>

      {actionPlan && (
        <Section label="Action plan">
          <Tier label="I will own" items={actionPlan.own} />
          <Tier label="I will assist" items={actionPlan.assist} />
          <Tier label="I will flag" items={actionPlan.flag} />
        </Section>
      )}
    </aside>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="label mb-2">{label}</div>
      {children}
    </div>
  );
}

function Tier({ label, items }: { label: string; items: { title: string }[] }) {
  if (!items?.length) return null;
  return (
    <div className="space-y-1.5 mb-3">
      <Serif italic className="text-[12.5px] text-[--color-ink-faint]">{label}</Serif>
      {items.map((it, i) => (
        <div key={i} className="text-[12.5px] bg-white border border-[--color-paper-edge] rounded px-2.5 py-1.5">
          {it.title}
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Smoke check** — left rail shows uploaded fixture filenames + 3 tiers.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat(workspace): left rail with sources + action plan"
```

---

### Task 33: Export row (Notion / Jira / Slack faked)

**Files:**
- Modify: `app/work/[employeeId]/_workspace/export-row.tsx`

- [ ] **Step 1: Implement**

Replace `app/work/[employeeId]/_workspace/export-row.tsx`:

```tsx
"use client";

import { useWorkspace, type PrdSectionKey } from "@/src/store/workspace";
import { fakeNotionExport } from "@/src/fakes/notion-export";
import { JiraSendButton } from "@/src/fakes/jira-toast";
import { SlackSendButton } from "@/src/fakes/slack-modal";

const KEYS: PrdSectionKey[] = ["problem","goals","user_stories","scope","out_of_scope","success_metrics"];

export function ExportRow() {
  const ws = useWorkspace();
  const onNotion = () => {
    const sections = Object.fromEntries(KEYS.map(k => [k, ws.sections[k] ?? ""])) as Record<PrdSectionKey, string>;
    fakeNotionExport({ title: ws.title || "Untitled PRD", sections: sections as any });
  };
  return (
    <div className="flex gap-2 pt-4 border-t border-[--color-paper-edge] mt-6">
      <button
        onClick={onNotion}
        className="px-4 py-2 text-[11px] uppercase tracking-[0.12em] text-[--color-paper] bg-[--color-ink]"
      >Export to Notion</button>
      <JiraSendButton label="Update Jira" />
      <SlackSendButton />
    </div>
  );
}
```

- [ ] **Step 2: Smoke check** — click each. Notion downloads `.md`; Jira and Slack show toasts.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat(workspace): export row with faked notion/jira/slack actions"
```

---

## Phase I — Demo fixture, Voice, & "Use demo data" (Tasks 34–36)

### Task 34: Build the demo fixture

**Files:**
- Create: `fixtures/demo/saathi-mvp/README.md`, `fixtures/demo/saathi-mvp/package.json`, `fixtures/demo/saathi-mvp/docs/architecture.md`, `fixtures/demo/q2-roadmap.pdf` (handcrafted), `fixtures/demo/issue-47.json`, `fixtures/demo/sample-prd.pdf` (handcrafted), `fixtures/demo/slack-messages.json`
- Create: `fixtures/demo/canned-responses/understand.json`, `fixtures/demo/canned-responses/plan.json`, `fixtures/demo/canned-responses/prd-issue-47.json`, `fixtures/demo/canned-responses/refine-add-api-spec.json`

- [ ] **Step 1: Saathi-MVP fake repo**

Create `fixtures/demo/saathi-mvp/README.md`:

```md
# saathi-mvp

YC demo build of Saathi. Next.js 15, Supabase, Claude.

## Status
Day 3 of 5. PM employee shipping today; PgM and Marketing tomorrow.

## Open issues
- #47 — Add bulk export for analytics dashboard (no PRD yet)
- #48 — Onboarding latency (Phase 2 reading takes 12s)
- #49 — Action plan items sometimes generic
```

Create `fixtures/demo/saathi-mvp/package.json`:

```json
{ "name": "saathi-mvp", "version": "0.1.0", "private": true, "scripts": { "dev": "next dev" } }
```

Create `fixtures/demo/saathi-mvp/docs/architecture.md`:

```md
# Architecture
Single Next.js app. Supabase for state. Claude sonnet-4-6 for generation.
No auth, single demo user. All external integrations are stubbed.
```

- [ ] **Step 2: Issue #47 fixture**

Create `fixtures/demo/issue-47.json`:

```json
{
  "id": 47,
  "title": "Add bulk export for analytics dashboard",
  "labels": ["feature", "analytics", "needs-prd"],
  "body": "Power users export dashboard data row by row today. They want a single click to download CSV/xlsx with current filters and column order preserved. Three customer interviews flagged this in the last month."
}
```

- [ ] **Step 3: Slack messages fixture**

Create `fixtures/demo/slack-messages.json`:

```json
{
  "channel": "#product-feedback",
  "messages": [
    { "user": "marie", "ts": "2026-04-22T10:14:00Z", "text": "Customer asked for bulk export from the analytics dashboard again. That's the third time this month." },
    { "user": "alex_eng", "ts": "2026-04-23T09:03:00Z", "text": "Issue #47 — would be quick. Need a PRD first." },
    { "user": "marie", "ts": "2026-04-24T14:22:00Z", "text": "Filed it. PM bandwidth tight this week." }
  ]
}
```

- [ ] **Step 4: PDFs (handcrafted)**

Create the two PDFs by writing `.md` source first, then exporting via any tool. Store source so they can be regenerated.

`fixtures/demo/q2-roadmap.md` (then convert to `q2-roadmap.pdf` using the developer's preferred tool — Pages, Word, `pandoc q2-roadmap.md -o q2-roadmap.pdf`):

```md
# Q2 Roadmap — Saathi
**Target:** YC Demo Day, ship 3 AI employees.

## April
- AI Product Manager (Alex) — onboarding + PRD generation. Demo-ready.
- Internal demo rehearsal: 30 reps minimum.

## May
- AI Program Manager (Jordan).
- AI Marketing Employee (Sam).
- Sign 10 design partners.

## Voice
We write in short sentences. Numbers in hooks. We avoid hedge words. The product earns trust by doing, not by promising.
```

`fixtures/demo/sample-prd.md` (then convert to `sample-prd.pdf`):

```md
# Quick filters on the analytics dashboard

## Problem statement
Analysts open the dashboard and immediately filter to last 30 days, top customers, and a single product line. They do this every day. Today it takes six clicks. Three of those clicks are inside a hidden menu nobody finds the first time.

## Goals
- Cut filter setup from 6 clicks to 1.
- Preserve last-used filter set across sessions.

## User stories
- As an analyst, I can save a filter combination and re-apply it next time I land on the page.
- As a manager, I can see who's looking at which views without asking.

## Scope
- One-click filter chips at the top of the dashboard.
- Persisted last-used set per user.

## Out of scope
- Multi-user shared filter sets (v2).

## Success metrics
- 80% of analysts apply a saved filter within 2 weeks.
- Median time to first filtered view drops from 18s to 4s.
```

(The above two `.md` files exist as source. The corresponding PDFs ship next to them.)

- [ ] **Step 5: Canned response files**

Create `fixtures/demo/canned-responses/understand.json`:

```json
{
  "project_context": "Saathi is a YC-stage product letting non-technical buyers hire AI 'employees' (PM, PgM, Marketer). The company is in active Demo-Day rehearsals — Day 3 of a 5-day push to ship Alex, the AI PM. Architecture is intentionally simple: one Next.js app, Supabase, Claude. Demo > scale.",
  "role_and_priorities": "Founder and head of product, owning the demo and the product surface. Top three priorities: (1) make the YC demo jaw-dropping, (2) close 10 design partners pre-launch, (3) hit $10K MRR within 90 days. The single biggest time sink is drafting PRDs from scratch each week.",
  "how_you_communicate": "Short sentences. Numbers in hooks. No 'leverage'/'seamless'/'best-in-class'. You frame outcomes as deltas (from X to Y) and lead with the user pain in concrete terms. Bullets are tight, two lines max."
}
```

Create `fixtures/demo/canned-responses/plan.json`:

```json
{
  "own": [
    { "title": "Draft PRDs for new feature requests in #product-feedback", "rationale": "Marie flagged bulk export three times this month — exactly the recurring pain point you said takes too long." },
    { "title": "Track the open backlog and surface gaps before standup", "rationale": "Issue #47 sat without a PRD for two weeks; you can't catch all of those manually." },
    { "title": "Maintain a one-line status on every shipped feature in Notion", "rationale": "Your sample PRD shows you care about clean trails — I'll keep that hygiene without you asking." }
  ],
  "assist": [
    { "title": "Draft stakeholder update emails — you review before sending", "rationale": "External comms stay your call. I'll handle the first 80%." },
    { "title": "Write engineering tickets from approved PRDs", "rationale": "You said you want bullet-tight tickets. I'll match your style and let you sign-off." }
  ],
  "flag": [
    { "title": "When a PRD's scope grows past the original brief", "rationale": "You said you handle scope creep with strict pushback — I'll surface it before it lands." },
    { "title": "When a feature request comes in for the third time across channels", "rationale": "Three-strikes is the signal you trust most." },
    { "title": "When a release date slips by more than a sprint", "rationale": "Demo-Day cadence is tight; one slipped week can compound." }
  ]
}
```

Create `fixtures/demo/canned-responses/prd-issue-47.json`:

```json
{
  "title": "Bulk export for the analytics dashboard",
  "sections": {
    "problem": "Power users export dashboard rows by hand today. The fastest analyst still takes about three minutes to assemble a 5,000-row CSV and the formatting breaks every time it lands in a deck. Three customer calls in the last month surfaced this. Issue #47 was filed two weeks ago and no PRD existed until now.",
    "goals": "Cut time-to-export for a 5,000-row view from 3 minutes of manual copy-paste to under 10 seconds. Preserve current filters, column order, and visible computed columns. Hit 25% weekly-active analyst adoption inside 30 days.",
    "user_stories": "As an analyst, I click 'Export' on any dashboard view and get a file matching what I see — filters, sort, computed columns. As a manager, I schedule a saved view to email me weekly without waiting on data eng. As a customer, I drop the export straight into a board deck without reformatting.",
    "scope": "One-click CSV and .xlsx export from any dashboard view. Server-side pagination for sets above 50K rows. Filter and sort state preserved exactly.",
    "out_of_scope": "Scheduled email delivery (parking for v2 — adds infra without changing core value). PDF export (different design problem). API access to exports (separate ticket).",
    "success_metrics": "Adoption: 25% of weekly active analysts use Export within 30 days. Median time-to-export under 10s. Zero formatting-related support tickets in the first month."
  }
}
```

Create `fixtures/demo/canned-responses/refine-add-api-spec.json`:

```json
{
  "section_key": "scope",
  "new_content": "One-click CSV and .xlsx export from any dashboard view. Server-side pagination for sets above 50K rows. Filter and sort state preserved exactly.\n\nAPI: POST /v1/dashboards/:id/exports → { format: 'csv'|'xlsx', filters?: {...}, columns?: [...] } returns 202 + { export_id }. GET /v1/exports/:id polls status (pending|done|failed) with a signed_url on done. Signed URLs valid 24h."
}
```

- [ ] **Step 6: Commit**

```bash
git add fixtures/
git commit -m "feat(fixtures): demo fixture (saathi-mvp repo, issue 47, PDFs, slack msgs, canned responses)"
```

---

### Task 35: "Use demo data" hidden button + voice input (Whisper)

**Files:**
- Modify: `app/onboarding/[employeeId]/_phases/phase-1-brief.tsx`
- Create: `src/server/seed-demo-fixture.ts`, `app/api/voice/route.ts`, `src/components/voice-button.tsx`

- [ ] **Step 1: Server action — push fixture into uploads**

Create `src/server/seed-demo-fixture.ts`:

```ts
"use server";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { storeAndParseUpload } from "./uploads";
import { updateOnboarding } from "@/src/db/queries";

const FILES = [
  { name: "saathi-mvp-README.md", type: "text/markdown", path: "saathi-mvp/README.md" },
  { name: "saathi-mvp-architecture.md", type: "text/markdown", path: "saathi-mvp/docs/architecture.md" },
  { name: "q2-roadmap.pdf", type: "application/pdf", path: "q2-roadmap.pdf" },
  { name: "issue-47.json", type: "text/plain", path: "issue-47.json" },
];

export async function seedDemoFixture(employeeId: string) {
  const root = path.resolve(process.cwd(), "fixtures/demo");
  for (const f of FILES) {
    const buf = await readFile(path.join(root, f.path));
    await storeAndParseUpload(employeeId, { name: f.name, type: f.type, data: buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) });
  }
  await updateOnboarding(employeeId, {
    brief: {
      project: "Saathi — AI employees that learn how you work",
      role: "Founder / head of product",
      priorities: ["Ship YC demo", "Close 10 design partners", "Hit $10K MRR in 90 days"],
      time_sink: "Drafting PRDs from scratch every week",
      team: "3 engineers + 1 designer",
      tools: ["Notion", "Slack", "GitHub", "Linear"],
    },
    phase: 2,
  });
}
```

- [ ] **Step 2: Hidden button on Phase 1**

In `app/onboarding/[employeeId]/_phases/phase-1-brief.tsx`, add (somewhere near the dropzone) a `?demo=1` query-param-gated button:

```tsx
import { useSearchParams } from "next/navigation";
import { seedDemoFixture } from "@/src/server/seed-demo-fixture";

// inside the component:
const searchParams = useSearchParams();
const showDemo = searchParams.get("demo") === "1";
// ...
{showDemo && (
  <button
    onClick={async () => {
      await seedDemoFixture(employeeId);
      setPhase(2);
    }}
    className="text-[11px] underline text-[--color-ink-faint] mt-4"
  >Use demo data</button>
)}
```

(The button only renders when the URL is `/onboarding/<id>?demo=1`. Add `?demo=1` to the homepage's `Hire` form action when running rehearsals.)

- [ ] **Step 3: Voice API route**

Create `app/api/voice/route.ts`:

```ts
import { NextRequest } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get("audio") as File | null;
  if (!file) return new Response("missing audio", { status: 400 });
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return new Response(JSON.stringify({ text: "" }), { status: 200 });
  const oa = new OpenAI({ apiKey });
  const transcription = await oa.audio.transcriptions.create({
    file,
    model: "whisper-1",
  });
  return new Response(JSON.stringify({ text: transcription.text }), {
    headers: { "content-type": "application/json" },
  });
}
```

Install dep:

```bash
pnpm add openai
```

- [ ] **Step 4: Voice button component**

Create `src/components/voice-button.tsx`:

```tsx
"use client";

import { useRef, useState } from "react";

export function VoiceButton({ onTranscript }: { onTranscript: (text: string) => void }) {
  const [recording, setRecording] = useState(false);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  async function start() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    chunks.current = [];
    const rec = new MediaRecorder(stream);
    rec.ondataavailable = e => chunks.current.push(e.data);
    rec.onstop = async () => {
      const blob = new Blob(chunks.current, { type: "audio/webm" });
      const fd = new FormData();
      fd.append("audio", new File([blob], "voice.webm", { type: "audio/webm" }));
      const res = await fetch("/api/voice", { method: "POST", body: fd });
      const { text } = await res.json();
      if (text) onTranscript(text);
      stream.getTracks().forEach(t => t.stop());
    };
    rec.start();
    mediaRef.current = rec;
    setRecording(true);
  }
  function stop() {
    mediaRef.current?.stop();
    setRecording(false);
  }

  return (
    <button
      type="button"
      onClick={recording ? stop : start}
      title={recording ? "Stop recording" : "Speak instead"}
      className={`w-9 h-9 rounded-full grid place-items-center border ${recording ? "bg-[--color-coral] border-[--color-coral]" : "bg-white border-[--color-paper-edge]"}`}
      aria-pressed={recording}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={recording ? "#fff" : "currentColor"} strokeWidth="2"><path d="M12 19v3M8 22h8"/><rect x="9" y="3" width="6" height="13" rx="3"/><path d="M5 11a7 7 0 0 0 14 0"/></svg>
    </button>
  );
}
```

- [ ] **Step 5: Integrate VoiceButton into Phase 3 sample-prd or workspace input (optional polish)**

Drop a `<VoiceButton onTranscript={t => setCustom(c => c + t)} />` next to the workspace free-text input.

- [ ] **Step 6: Smoke check** — run `/?demo=1` (or directly `/onboarding/<id>?demo=1`), click "Use demo data", land on Phase 2 with fixtures parsed. Voice button records & transcribes (only with OPENAI_API_KEY set).

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat(demo): use-demo-data button, fixture seeder, voice (whisper) input"
```

---

### Task 36: Polish pass — animations, focus states, empty states

**Files:** various — micro-edits across the app.

This task has no new files; it's a deliberate polish pass. Run the demo path 5 times and fix every rough edge.

- [ ] **Step 1: Run the demo path** (`pnpm dev` → `/?demo=1` → all the way through). Note jank in a list:
  - Avatar pulse should sync with text streaming.
  - Phase 2 line cadence should feel natural — not too fast, not too slow.
  - Phase 5 buttons should have hover states.
  - Workspace export buttons should be visually balanced.

- [ ] **Step 2: Fix issues found in Step 1.** Each fix is its own micro-commit.

- [ ] **Step 3: Run again, twice. No new issues should surface.**

- [ ] **Step 4: Commit final polish**

```bash
git add -A
git commit -m "polish: visual + cadence pass on the full demo path"
```

---

## Phase J — End-to-end test (Task 37)

### Task 37: Playwright demo-path E2E

**Files:**
- Create: `tests/e2e/demo-path.spec.ts`, `playwright.config.ts`
- Modify: `package.json`

- [ ] **Step 1: Install Playwright**

```bash
pnpm add -D @playwright/test
pnpm dlx playwright install chromium
```

- [ ] **Step 2: Config**

Create `playwright.config.ts`:

```ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 120_000,
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  webServer: {
    command: "pnpm dev",
    port: 3000,
    timeout: 60_000,
    reuseExistingServer: true,
  },
});
```

Add to `package.json`:

```json
"test:e2e": "playwright test"
```

- [ ] **Step 3: Test**

Create `tests/e2e/demo-path.spec.ts`:

```ts
import { test, expect } from "@playwright/test";

test("the canonical demo path works end-to-end", async ({ page }) => {
  // Reset before running so we always start clean.
  // (Optional — skip if reset is too slow; rely on resilient assertions.)
  await page.goto("/?demo=1");

  await expect(page.getByText("AI employees that learn how you work.")).toBeVisible();
  await page.getByRole("button", { name: /Hire an AI Product Manager/i }).click();

  // We should be on /onboarding/<id>?demo=1 (the homepage form preserves no query — the developer
  // can either visit /onboarding/<id>?demo=1 directly after seed, or update the homepage form to
  // forward the ?demo=1. For this test we navigate directly:
  await page.waitForURL(/\/onboarding\//);
  const onboardingUrl = new URL(page.url());
  await page.goto(onboardingUrl.pathname + "?demo=1");

  await page.getByRole("button", { name: /Use demo data/i }).click();

  // Phase 2 — wait for "Here's what I understood"
  await expect(page.getByRole("heading", { name: /Here's what I understood/i })).toBeVisible({ timeout: 30_000 });
  await page.getByRole("button", { name: /That's right, keep going/i }).click();

  // Phase 3 — pick first option per question, decision style, skip sample upload
  for (let i = 0; i < 4; i++) {
    const next = page.getByRole("button", { name: /Next/i });
    if (await next.isVisible()) await next.click();
    else {
      // Click first option in radio group
      await page.locator("button").nth(0).click();
    }
  }
  // Decision style — click first
  await page.getByRole("button", { name: /Just do it/i }).click();
  await page.getByRole("button", { name: /Next/i }).click();
  // Sample upload — skip
  await page.getByRole("button", { name: /Show me what you'll do/i }).click();

  // Phase 4 — wait for plan, then approve
  await expect(page.getByRole("heading", { name: /Here's how I'd work with you/i })).toBeVisible({ timeout: 30_000 });
  await page.getByRole("button", { name: /Looks good — let me approve/i }).click();

  // Phase 5 — Start working
  await page.getByRole("button", { name: /^Start working$/i }).click();

  // Workspace — wait for the PRD title to appear
  await page.waitForURL(/\/work\//, { timeout: 30_000 });
  await expect(page.getByText(/Bulk export/i)).toBeVisible({ timeout: 60_000 });

  // Click a follow-up chip
  await page.getByRole("button", { name: /Add API spec/i }).click();
  await expect(page.getByText(/POST \/v1\/dashboards/i)).toBeVisible({ timeout: 30_000 });

  // Click Export → Notion
  await page.getByRole("button", { name: /Export to Notion/i }).click();
  await expect(page.getByText(/Exported to Notion/i)).toBeVisible();
});
```

- [ ] **Step 4: Run the test**

```bash
pnpm db:reset
pnpm test:e2e
```

Expected: PASS. The test exercises the full demo path. If the homepage's `Hire` form doesn't forward `?demo=1`, the test recovers by re-navigating with the query param explicitly.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "test(e2e): playwright demo-path coverage"
```

---

## Final smoke

- [ ] **Run `pnpm test`** — all unit tests pass.
- [ ] **Run `pnpm test:e2e`** — full demo path passes.
- [ ] **Run `pnpm demo:reset && pnpm dev`** — manually walk the demo path. No console errors. No broken states.
- [ ] **Lock it.** Tag a `v0.1-demo` git tag.

```bash
git tag v0.1-demo
```

---

## Self-review checklist

This block confirms the plan covers the spec.

- ✅ Phase 1 (brief + dropzone) — Task 24
- ✅ Phase 2 (reading moment + understood card) — Task 25
- ✅ Phase 3 (5 PM Qs + decision style + sample upload) — Task 26
- ✅ Phase 4 (action plan streaming) — Task 27
- ✅ Phase 5 (approval + autonomy + Start working) — Task 28
- ✅ Phase 6 (auto-PRD on workspace bootstrap) — Task 30
- ✅ Workspace layout + streaming PRD — Tasks 29–32
- ✅ Follow-up chips + free-text — Task 31
- ✅ Export (Notion/Jira/Slack faked) — Task 33
- ✅ Faked integrations (GitHub modal, Jira, Notion, Slack) — Tasks 16–19
- ✅ Demo fixture + canned responses — Task 34
- ✅ "Use demo data" + Voice (Whisper) — Task 35
- ✅ Polish pass — Task 36
- ✅ E2E test — Task 37
- ✅ Resilience (`withFallback` + canned responses) — Task 10 + each route
- ✅ Editorial aesthetic — Task 2 + applied throughout
- ✅ Persistence (5 tables, single user) — Tasks 3–5
- ✅ AI prompts (4) + endpoints — Tasks 12–15

No placeholders. No "TODO" steps. Every task contains the actual code an engineer needs.
