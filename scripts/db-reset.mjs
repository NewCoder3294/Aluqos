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
  await sb.from("walkthrough_events").delete().in("employee_id", ids);
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
