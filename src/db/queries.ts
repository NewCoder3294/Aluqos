import { serverClient, DEMO_USER_ID, MOCK_MODE, fakeEmployee } from "./client";

const MOCK_UPLOADS = [
  {
    id: "mock-upload-1",
    employee_id: "mock",
    filename: "saathi-mvp-README.md",
    storage_path: "mock/saathi-mvp-README.md",
    mime_type: "text/markdown",
    parsed_text: "Aluqos — AI employees that learn how you work. MVP overview, problem, solution, and target users.",
    parse_status: "done",
    created_at: new Date().toISOString(),
  },
  {
    id: "mock-upload-2",
    employee_id: "mock",
    filename: "saathi-mvp-architecture.md",
    storage_path: "mock/saathi-mvp-architecture.md",
    mime_type: "text/markdown",
    parsed_text: "Architecture: Next.js App Router, Supabase, Anthropic Claude, edge streaming.",
    parse_status: "done",
    created_at: new Date().toISOString(),
  },
  {
    id: "mock-upload-3",
    employee_id: "mock",
    filename: "q2-roadmap.pdf",
    storage_path: "mock/q2-roadmap.pdf",
    mime_type: "application/pdf",
    parsed_text: "Q2 roadmap: ship YC demo, close design partners, hit $10K MRR.",
    parse_status: "done",
    created_at: new Date().toISOString(),
  },
  {
    id: "mock-upload-4",
    employee_id: "mock",
    filename: "issue-47.json",
    storage_path: "mock/issue-47.json",
    mime_type: "text/plain",
    parsed_text: "Issue #47 — PRD: voice notes for AI employees.",
    parse_status: "done",
    created_at: new Date().toISOString(),
  },
];

export async function getDemoEmployee() {
  if (MOCK_MODE) return fakeEmployee();
  try {
    const sb = serverClient();
    const { data } = await sb
      .from("employees")
      .select("*")
      .eq("user_id", DEMO_USER_ID)
      .eq("name", "Alex")
      .maybeSingle();
    return data ?? fakeEmployee();
  } catch {
    return fakeEmployee();
  }
}

export async function setEmployeeStatus(id: string, status: "idle"|"onboarding"|"working") {
  if (MOCK_MODE) return;
  try {
    const sb = serverClient();
    await sb.from("employees").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
  } catch {}
}

export async function getOrInitOnboarding(employee_id: string) {
  if (MOCK_MODE) {
    return {
      id: "mock",
      employee_id,
      phase: 1,
      brief: null,
      context_summary: null,
      observations: null,
      action_plan: null,
      approvals: null,
      completed_at: null,
    };
  }
  try {
    const sb = serverClient();
    const { data } = await sb.from("onboarding_sessions").select("*").eq("employee_id", employee_id).maybeSingle();
    if (data) return data;
    const { data: inserted } = await sb
      .from("onboarding_sessions")
      .insert({ employee_id, phase: 1 })
      .select()
      .single();
    return inserted!;
  } catch {
    return { id: "mock", employee_id, phase: 1 };
  }
}

export async function updateOnboarding(employee_id: string, patch: Record<string, unknown>) {
  if (MOCK_MODE) return;
  try {
    const sb = serverClient();
    await sb
      .from("onboarding_sessions")
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq("employee_id", employee_id);
  } catch {}
}

export async function listUploads(employee_id: string) {
  if (MOCK_MODE) return MOCK_UPLOADS.map(u => ({ ...u, employee_id }));
  try {
    const sb = serverClient();
    const { data } = await sb.from("uploads").select("*").eq("employee_id", employee_id).order("created_at");
    return data ?? [];
  } catch {
    return [];
  }
}

export async function listEmployeePrds(employee_id: string) {
  if (MOCK_MODE) return [];
  try {
    const sb = serverClient();
    const { data } = await sb.from("prds").select("*").eq("employee_id", employee_id).order("generated_at", { ascending: false });
    return data ?? [];
  } catch {
    return [];
  }
}

export async function logEvent(employee_id: string | null, type: string, payload?: unknown) {
  if (MOCK_MODE) return;
  try {
    const sb = serverClient();
    await sb.from("events").insert({ employee_id, type, payload: payload ?? {} });
  } catch {}
}
