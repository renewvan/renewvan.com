import { expect, test } from "@playwright/test";

test("docs search finds a known page and navigates to it", async ({ page }) => {
  await page.goto("/docs");

  await page.getByRole("button", { name: "Search ⌘ K" }).click();

  const searchInput = page.getByRole("combobox", { name: "Search" });
  await expect(searchInput).toBeVisible();
  await searchInput.fill("Hardware Setup");

  const result = page.getByRole("option", { name: /Hardware Setup/ });
  await expect(result).toBeVisible();

  await result.click();
  await expect(page).toHaveURL(/\/docs\/getting-started\/hardware-setup$/);
});
