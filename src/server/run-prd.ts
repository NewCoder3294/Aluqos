"use server";

import { serverClient, MOCK_MODE, fakeEmployee } from "@/src/db/client";
import { listEmployeePrds, listUploads, logEvent } from "@/src/db/queries";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { authorizeEmployee } from "./auth-guard";

export async function fetchWorkspaceState(employeeId: string) {
  await authorizeEmployee(employeeId);
  if (MOCK_MODE) {
    const uploads = await listUploads(employeeId);
    const prds = await listEmployeePrds(employeeId);
    return { emp: { ...fakeEmployee(), id: employeeId }, session: null, uploads, prds };
  }
  try {
    const sb = serverClient();
    const { data: emp } = await sb.from("employees").select("*").eq("id", employeeId).maybeSingle();
    const { data: session } = await sb.from("onboarding_sessions").select("*").eq("employee_id", employeeId).maybeSingle();
    const uploads = await listUploads(employeeId);
    const prds = await listEmployeePrds(employeeId);
    return { emp, session, uploads, prds };
  } catch {
    const uploads = await listUploads(employeeId);
    const prds = await listEmployeePrds(employeeId);
    return { emp: { ...fakeEmployee(), id: employeeId }, session: null, uploads, prds };
  }
}

export async function fetchPrdInputs(employeeId: string, source: string) {
  await authorizeEmployee(employeeId);
  if (MOCK_MODE) {
    const uploads = await listUploads(employeeId);
    return {
      context_summary: {},
      observations: {},
      docs: uploads.map(u => ({ filename: u.filename, parsed_text: u.parsed_text ?? "" })),
      source,
    };
  }
  try {
    const sb = serverClient();
    const { data: session } = await sb.from("onboarding_sessions").select("*").eq("employee_id", employeeId).maybeSingle();
    const uploads = await listUploads(employeeId);
    return {
      context_summary: session?.context_summary ?? {},
      observations: session?.observations ?? {},
      docs: uploads.map(u => ({ filename: u.filename, parsed_text: u.parsed_text ?? "" })),
      source,
    };
  } catch {
    const uploads = await listUploads(employeeId);
    return {
      context_summary: {},
      observations: {},
      docs: uploads.map(u => ({ filename: u.filename, parsed_text: u.parsed_text ?? "" })),
      source,
    };
  }
}

export async function createPrd(employeeId: string, title: string, sourceIssue: string) {
  await authorizeEmployee(employeeId);
  if (MOCK_MODE) {
    return {
      id: randomUUID(),
      employee_id: employeeId,
      title,
      source_issue: sourceIssue,
      sections: {},
      status: "streaming",
    };
  }
  try {
    const sb = serverClient();
    const { data, error } = await sb
      .from("prds")
      .insert({ employee_id: employeeId, title, source_issue: sourceIssue, sections: {}, status: "streaming" })
      .select()
      .single();
    if (error) throw error;
    await logEvent(employeeId, "prd_started", { id: data.id, title });
    return data;
  } catch {
    return {
      id: randomUUID(),
      employee_id: employeeId,
      title,
      source_issue: sourceIssue,
      sections: {},
      status: "streaming",
    };
  }
}

export async function persistPrdSections(prdId: string, employeeId: string, sections: Record<string, string>, title: string) {
  await authorizeEmployee(employeeId);
  if (MOCK_MODE) return;
  try {
    const sb = serverClient();
    await sb.from("prds").update({ sections, title, status: "draft", updated_at: new Date().toISOString() }).eq("id", prdId);
    await logEvent(employeeId, "prd_generated", { id: prdId });
  } catch {}
}

export async function persistPrdEdit(prdId: string, sectionKey: string, content: string) {
  if (MOCK_MODE) return;
  try {
    const sb = serverClient();
    const { data: existing } = await sb.from("prds").select("sections").eq("id", prdId).maybeSingle();
    const sections = { ...(existing?.sections ?? {}), [sectionKey]: content };
    await sb.from("prds").update({ sections, status: "edited", updated_at: new Date().toISOString() }).eq("id", prdId);
  } catch {}
}

export async function loadIssueFixture(): Promise<{ title: string; body: string }> {
  const file = path.resolve(process.cwd(), "fixtures/demo/issue-47.json");
  return JSON.parse(await readFile(file, "utf8"));
}

/**
 * Spawn a blank PRD tied to a backlog request, then redirect into the PRD
 * surface where it streams a draft. The bootstrap=1 flag tells prd-surface
 * to generate against the new PRD's source_issue.
 */
export async function draftPrdFromBacklog(
  employeeId: string,
  source: string,
): Promise<void> {
  await authorizeEmployee(employeeId);
  const { redirect } = await import("next/navigation");
  // randomUUID fallback path keeps the demo working even when MOCK_MODE / DB
  // is unavailable; prd-surface will still kick off generation against the
  // source label passed via the URL.
  const created = await createPrd(employeeId, "", source);
  redirect(`/work/${employeeId}/prd/${created.id}?bootstrap=1`);
}

/**
 * Plant the magical-onboarding PRD into the DB so the user lands on /work
 * with the exact PRD they just watched stream — no drift, no second
 * generation. Idempotent: if a PRD already exists for this employee with the
 * demo source issue, do nothing.
 */
export async function seedDemoFirstPrd(
  employeeId: string,
  title: string,
  sourceIssue: string,
  sections: Record<string, string>,
): Promise<{ id: string } | null> {
  await authorizeEmployee(employeeId);
  if (MOCK_MODE) return null;
  try {
    const sb = serverClient();
    const { data: existing } = await sb
      .from("prds")
      .select("id")
      .eq("employee_id", employeeId)
      .eq("source_issue", sourceIssue)
      .maybeSingle();
    if (existing) return { id: existing.id };
    const { data, error } = await sb
      .from("prds")
      .insert({
        employee_id: employeeId,
        title,
        source_issue: sourceIssue,
        sections,
        status: "draft",
      })
      .select("id")
      .single();
    if (error) throw error;
    await logEvent(employeeId, "prd_generated", { id: data.id, source: "demo-onboarding" });
    return { id: data.id };
  } catch {
    return null;
  }
}
