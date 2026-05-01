import { createBrowserClient } from "@supabase/ssr";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// Browser-side Supabase client used by the Google sign-in button. Cookie-
// persisted session, in contrast to db/client.ts's browserClient() which
// disables persistence for service-role-style queries. Keep this file free of
// `next/headers` imports — those would force the bundler to flag any client
// component that imports it as server-only.
export function browserAuthClient() {
  return createBrowserClient(url, anonKey);
}
