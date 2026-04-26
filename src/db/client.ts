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
