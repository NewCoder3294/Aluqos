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
