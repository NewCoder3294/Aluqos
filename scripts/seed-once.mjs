import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const userId = process.env.SAATHI_DEMO_USER_ID ?? "11111111-1111-1111-1111-111111111111";

if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env");
  process.exit(1);
}

const sb = createClient(url, key, { auth: { persistSession: false } });

const { data: existing } = await sb
  .from("employees")
  .select("*")
  .eq("user_id", userId)
  .eq("name", "Alex")
  .maybeSingle();

if (existing) {
  console.log("Already seeded:", existing.id);
  process.exit(0);
}

const { data, error } = await sb
  .from("employees")
  .insert({
    user_id: userId,
    name: "Alex",
    role: "product_manager",
    bio: "Curious, structured, allergic to vague PRDs.",
    avatar_seed: "alex-pm-coral",
    status: "idle",
  })
  .select()
  .single();

if (error) {
  console.error("Seed failed:", error);
  process.exit(1);
}
console.log("Seeded employee:", data.id, data.name);
