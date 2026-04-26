import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const MOCK_MODE = !serviceKey || !url;
export const DEMO_USER_ID = process.env.SAATHI_DEMO_USER_ID ?? "11111111-1111-1111-1111-111111111111";
export const DEMO_EMPLOYEE_ID = "00000000-0000-0000-0000-00000000a1ex";

export function browserClient() {
  return createClient(url || "https://localhost", anonKey || "anon", { auth: { persistSession: false } });
}

export function serverClient() {
  if (MOCK_MODE) throw new Error("MOCK_MODE — Supabase not configured");
  return createClient(url, serviceKey!, { auth: { persistSession: false } });
}

export function fakeEmployee() {
  return {
    id: DEMO_EMPLOYEE_ID,
    user_id: DEMO_USER_ID,
    name: "Alex",
    role: "product_manager",
    status: "idle",
    autonomy_level: null,
    bio: "Curious, structured, allergic to vague PRDs.",
    avatar_seed: "alex-pm-coral",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}
