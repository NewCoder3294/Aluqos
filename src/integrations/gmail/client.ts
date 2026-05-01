import { getDecryptedTokens, saveCredentials } from "@/src/oauth/credentials";

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GMAIL_INBOX_LABEL_URL =
  "https://gmail.googleapis.com/gmail/v1/users/me/labels/INBOX";

const GMAIL_SCOPE = "https://www.googleapis.com/auth/gmail.readonly";

// Refresh tokens earlier than their stated expiry so the call we're about to
// make doesn't race the wire-time expiry. 60s of slack is generous.
const REFRESH_LEEWAY_MS = 60 * 1000;

export type GmailInboxStats = {
  messagesTotal: number;
  messagesUnread: number;
  threadsTotal: number;
  threadsUnread: number;
};

export class GmailAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GmailAuthError";
  }
}

async function refreshGmailAccessToken(
  tenantId: string,
  refreshToken: string
): Promise<string> {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new GmailAuthError(
      "Missing GOOGLE_OAUTH_CLIENT_ID / GOOGLE_OAUTH_CLIENT_SECRET — required for Gmail token refresh."
    );
  }

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
  });

  const res = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new GmailAuthError(`google token refresh ${res.status}: ${text}`);
  }
  const json = (await res.json()) as {
    access_token: string;
    expires_in: number;
    scope?: string;
  };

  await saveCredentials({
    tenant_id: tenantId,
    source: "gmail",
    access_token: json.access_token,
    // Google often omits a new refresh_token on refresh — keep the existing one.
    refresh_token: refreshToken,
    expires_at: new Date(Date.now() + json.expires_in * 1000),
    scope: json.scope ?? GMAIL_SCOPE,
  });

  return json.access_token;
}

export async function getValidGmailAccessToken(
  tenantId: string
): Promise<string | null> {
  const tokens = await getDecryptedTokens(tenantId, "gmail");
  if (!tokens) return null;

  const expiresInMs = tokens.expires_at.getTime() - Date.now();
  if (expiresInMs > REFRESH_LEEWAY_MS) {
    return tokens.access_token;
  }
  if (!tokens.refresh_token) {
    throw new GmailAuthError("gmail access token expired and no refresh token available");
  }
  return refreshGmailAccessToken(tenantId, tokens.refresh_token);
}

export async function getInboxStats(
  tenantId: string
): Promise<GmailInboxStats | null> {
  let token = await getValidGmailAccessToken(tenantId);
  if (!token) return null;

  let res = await fetch(GMAIL_INBOX_LABEL_URL, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  // 401 after a fresh-or-refreshed token usually means the token was revoked.
  // Try one forced refresh; if it still fails, surface null so the UI can
  // show a "reconnect" affordance instead of crashing the page.
  if (res.status === 401) {
    const tokens = await getDecryptedTokens(tenantId, "gmail");
    if (tokens?.refresh_token) {
      try {
        token = await refreshGmailAccessToken(tenantId, tokens.refresh_token);
        res = await fetch(GMAIL_INBOX_LABEL_URL, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });
      } catch {
        return null;
      }
    } else {
      return null;
    }
  }

  if (!res.ok) {
    console.warn(`gmail labels.get ${res.status}: ${await res.text()}`);
    return null;
  }

  const json = (await res.json()) as {
    messagesTotal?: number;
    messagesUnread?: number;
    threadsTotal?: number;
    threadsUnread?: number;
  };
  return {
    messagesTotal: json.messagesTotal ?? 0,
    messagesUnread: json.messagesUnread ?? 0,
    threadsTotal: json.threadsTotal ?? 0,
    threadsUnread: json.threadsUnread ?? 0,
  };
}
