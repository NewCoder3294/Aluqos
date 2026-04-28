import { test, expect } from "@playwright/test";

// This E2E requires:
// 1. Local Supabase running with all migrations applied
// 2. .env.local has LINEAR_CLIENT_ID, LINEAR_CLIENT_SECRET, LINEAR_WEBHOOK_SECRET, OAUTH_STATE_SECRET
// 3. A mock Linear OAuth server (see fixtures/mock-linear/) running on :4001 OR
//    LINEAR_OAUTH_BASE env var pointing to it. The mock returns a fixed token + a
//    fixed paginated issues list.
//
// Per /plan-eng-review T9: this test is the canary that proves the full
// connect-to-events path works. If it stays green, GitHub and Calendar
// plans replicate the shape.

test("connect Linear → backfill runs → events visible in settings", async ({ page }) => {
  await page.goto("/settings/connections");
  await expect(page.getByRole("heading", { name: "Connections" })).toBeVisible();

  // Linear row should show "Connect" link
  const linearRow = page.locator("li", { hasText: "Linear" });
  await expect(linearRow.getByRole("link", { name: /Connect/i })).toBeVisible();

  // Initiate OAuth — expect redirect chain ending back at /settings/connections?connected=linear
  // (mock-linear returns immediately with code=test-code)
  await linearRow.getByRole("link", { name: /Connect/i }).click();
  await page.waitForURL(/\/settings\/connections\?connected=linear/, { timeout: 30_000 });

  // Status pill should appear in the running state, then complete within 30s
  await expect(linearRow.getByText(/Syncing your last 30 days/i)).toBeVisible({ timeout: 5_000 });
  await expect(linearRow.getByText(/events synced/i)).toBeVisible({ timeout: 60_000 });

  // Disconnect should work
  page.once("dialog", (d) => d.accept());
  await linearRow.getByRole("button", { name: /Disconnect/i }).click();
  await expect(linearRow.getByRole("link", { name: /Connect/i })).toBeVisible({ timeout: 5_000 });
});
