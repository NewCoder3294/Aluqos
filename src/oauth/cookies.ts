import { cookies } from "next/headers";

const COOKIE_NAME = "aluqos_oauth_state";

export async function setStateCookie(state: string): Promise<void> {
  const c = await cookies();
  c.set(COOKIE_NAME, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });
}

export async function readStateCookie(): Promise<string | null> {
  const c = await cookies();
  return c.get(COOKIE_NAME)?.value ?? null;
}

export async function clearStateCookie(): Promise<void> {
  const c = await cookies();
  c.delete(COOKIE_NAME);
}
