import { GoogleSignInButton } from "./google-button";

export const dynamic = "force-dynamic";

// Minimal sign-in page. Bypasses AppShell intentionally — the user has no
// session yet, so the employee-scoped sidebar would be misleading. Single
// "Continue with Google" affordance; we don't offer email/password.
export default function LoginPage() {
  return (
    <main className="min-h-screen bg-paper flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="serif text-[28px] tracking-[-0.01em] text-ink">
            Welcome to Aluqos
          </div>
          <p className="mt-2 text-[13px] text-ink-muted">
            Sign in to continue. We&apos;ll request read-only access to your
            Gmail inbox so we can show you what&apos;s waiting.
          </p>
        </div>

        <div className="bg-white border border-paper-edge rounded-md p-6">
          <GoogleSignInButton />
          <p className="mt-4 text-[11px] text-ink-faint leading-relaxed">
            By continuing, you grant Aluqos read-only access to your Gmail
            inbox. You can revoke access anytime from your Google account.
          </p>
        </div>
      </div>
    </main>
  );
}
