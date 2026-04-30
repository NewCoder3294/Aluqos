"use client";

import { useState } from "react";
import { browserAuthClient } from "@/src/db/auth-client";
import { Button } from "@/src/components/ui/button";

export function GoogleSignInButton() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setPending(true);
    setError(null);
    const supabase = browserAuthClient();
    const redirectTo = `${window.location.origin}/auth/callback`;
    const { error: signInError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        scopes: "https://www.googleapis.com/auth/gmail.readonly",
        // access_type=offline + prompt=consent are required for Google to
        // return a refresh token. Without them, the captured access token
        // expires after one hour with no way to renew.
        queryParams: { access_type: "offline", prompt: "consent" },
        redirectTo,
      },
    });
    if (signInError) {
      setError(signInError.message);
      setPending(false);
    }
    // On success the browser is redirected to Google; nothing to do.
  }

  return (
    <div className="flex flex-col items-stretch gap-2">
      <Button
        type="button"
        variant="ink"
        size="lg"
        onClick={handleClick}
        disabled={pending}
      >
        {pending ? "Redirecting…" : "Continue with Google"}
      </Button>
      {error && (
        <p className="text-[12px] text-coral-deep" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
