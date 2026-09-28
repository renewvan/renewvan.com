import { expect, test } from "@playwright/test";

test("homepage renders hero heading and nav", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Know your van, from anywhere",
    }),
  ).toBeVisible();

  await expect(page.getByRole("link", { name: "GitHub" })).toBeVisible();
});
