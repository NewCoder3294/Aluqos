"use server";

import { serverClient, MOCK_MODE, fakeEmployee } from "@/src/db/client";
import { listEmployeePrds, listUploads, logEvent } from "@/src/db/queries";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

export async function fetchWorkspaceState(employeeId: string) {
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
