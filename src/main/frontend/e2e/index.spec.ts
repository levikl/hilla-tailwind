import { test, expect } from "@playwright/test";

test("root route shows system status message", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByText("System is Nominal. Kotlin is running.")
  ).toBeVisible();
});
