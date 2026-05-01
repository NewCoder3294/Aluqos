import Link from "next/link";
import { MOCK_MODE } from "@/src/db/client";
import { serverAuthClient } from "@/src/db/auth-server";
import { signOut } from "@/src/server/sign-out";

// Server component rendered in the AppShell header. Surfaces a "Sign in" link
// when the visitor is unauthenticated, or the user's email + a sign-out
// button when a Supabase session is active. In MOCK_MODE (no Supabase env),
// renders nothing so the demo experience stays uncluttered.
export async function HeaderAuthControl() {
  if (MOCK_MODE) return null;

  let email: string | null = null;
  try {
    const supabase = await serverAuthClient();
    const { data } = await supabase.auth.getUser();
    email = data.user?.email ?? null;
  } catch {
    return null;
  }

  if (!email) {
    return (
      <Link
        href="/login"
        className="text-[12px] uppercase tracking-[0.12em] text-ink-faint hover:text-coral-deep"
      >
        Sign in
      </Link>
    );
  }

  return (
    <form action={signOut} className="flex items-center gap-3">
      <span className="text-[12px] text-ink-faint hidden sm:inline">{email}</span>
      <button
        type="submit"
        className="text-[12px] uppercase tracking-[0.12em] text-ink-faint hover:text-coral-deep"
      >
        Sign out
      </button>
    </form>
  );
}
