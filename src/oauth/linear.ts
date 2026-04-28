const LINEAR_AUTHORIZE = "https://linear.app/oauth/authorize";
const LINEAR_TOKEN = "https://api.linear.app/oauth/token";

export type LinearTokens = {
  accessToken: string;
  refreshToken: string | null;
  expiresAt: Date;
  scope: string;
};

function clientId(): string {
  const v = process.env.LINEAR_CLIENT_ID;
  if (!v) throw new Error("LINEAR_CLIENT_ID not set");
  return v;
}

function clientSecret(): string {
  const v = process.env.LINEAR_CLIENT_SECRET;
  if (!v) throw new Error("LINEAR_CLIENT_SECRET not set");
  return v;
}

function redirectUri(): string {
  const base = process.env.NEXT_PUBLIC_BASE_URL;
  if (!base) throw new Error("NEXT_PUBLIC_BASE_URL not set");
  return `${base}/api/oauth/linear/callback`;
}

export function buildLinearAuthorizeUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: clientId(),
    redirect_uri: redirectUri(),
    response_type: "code",
    scope: "read",
    state,
  });
  return `${LINEAR_AUTHORIZE}?${params.toString()}`;
}

export async function exchangeLinearCode(code: string): Promise<LinearTokens> {
  const body = new URLSearchParams({
    code,
    redirect_uri: redirectUri(),
    client_id: clientId(),
    client_secret: clientSecret(),
    grant_type: "authorization_code",
  });
  const res = await fetch(LINEAR_TOKEN, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
  });
  const json = (await res.json()) as Record<string, unknown>;
  if (!res.ok) {
    const err = String(json.error ?? "unknown_error");
    const desc = String(json.error_description ?? "");
    throw new Error(`Linear OAuth: ${err}${desc ? `: ${desc}` : ""}`);
  }
  return {
    accessToken: String(json.access_token),
    refreshToken: typeof json.refresh_token === "string" ? json.refresh_token : null,
    expiresAt: new Date(Date.now() + (Number(json.expires_in) || 3600) * 1000),
    scope: String(json.scope ?? "read"),
  };
}

export async function refreshLinearToken(refreshToken: string): Promise<LinearTokens> {
  const body = new URLSearchParams({
    refresh_token: refreshToken,
    client_id: clientId(),
    client_secret: clientSecret(),
    grant_type: "refresh_token",
  });
  const res = await fetch(LINEAR_TOKEN, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
  });
  const json = (await res.json()) as Record<string, unknown>;
  if (!res.ok) {
    const err = String(json.error ?? "unknown_error");
    throw new Error(`Linear refresh: ${err}`);
  }
  return {
    accessToken: String(json.access_token),
    refreshToken: typeof json.refresh_token === "string" ? json.refresh_token : refreshToken,
    expiresAt: new Date(Date.now() + (Number(json.expires_in) || 3600) * 1000),
    scope: String(json.scope ?? "read"),
  };
}
