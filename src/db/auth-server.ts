import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// Server-side Supabase client wired to Next's cookie store. Use inside route
// handlers, server components, and server actions to read the Supabase session
// and (in the auth callback) write the session cookies that exchangeCodeForSession
// emits. The `server-only` import guarantees a build error if any client
// component accidentally imports this module.
export async function serverAuthClient() {
  const cookieStore = await cookies();
  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Server components can't set cookies; route handlers and actions
          // can. The Supabase SSR helper calls setAll defensively in both
          // contexts, so swallow the read-only-store error.
        }
      },
    },
  });
}
