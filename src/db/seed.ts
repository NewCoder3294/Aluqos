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
