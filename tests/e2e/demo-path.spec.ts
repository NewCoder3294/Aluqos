import { test, expect } from "@playwright/test";

test("the canonical demo path works end-to-end", async ({ page }) => {
  await page.goto("/?demo=1");

  await expect(page.getByText("AI employees that learn how you work.")).toBeVisible();
  await page.getByRole("button", { name: /Hire an AI Product Manager/i }).click();

  await page.waitForURL(/\/onboarding\//);
  const onboardingUrl = new URL(page.url());
  await page.goto(onboardingUrl.pathname + "?demo=1");

  await page.getByRole("button", { name: /Use demo data/i }).click();

  await expect(page.getByRole("heading", { name: /Here's what I understood/i })).toBeVisible({ timeout: 30_000 });
  await page.getByRole("button", { name: /That's right, keep going/i }).click();

  for (let i = 0; i < 4; i++) {
    const next = page.getByRole("button", { name: /Next/i });
    if (await next.isVisible()) await next.click();
    else {
      await page.locator("button").nth(0).click();
    }
  }
  await page.getByRole("button", { name: /Just do it/i }).click();
  await page.getByRole("button", { name: /Next/i }).click();
  await page.getByRole("button", { name: /Show me what you'll do/i }).click();

  await expect(page.getByRole("heading", { name: /Here's how I'd work with you/i })).toBeVisible({ timeout: 30_000 });
  await page.getByRole("button", { name: /Looks good — let me approve/i }).click();

  await page.getByRole("button", { name: /^Start working$/i }).click();

  await page.waitForURL(/\/work\//, { timeout: 30_000 });
  await expect(page.getByText(/Bulk export/i)).toBeVisible({ timeout: 60_000 });

  await page.getByRole("button", { name: /Add API spec/i }).click();
  await expect(page.getByText(/POST \/v1\/dashboards/i)).toBeVisible({ timeout: 30_000 });

  await page.getByRole("button", { name: /Export to Notion/i }).click();
  await expect(page.getByText(/Exported to Notion/i)).toBeVisible();
});
