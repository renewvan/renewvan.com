import { expect, test } from "@playwright/test";

test("docs section renders with nested nav, content, and TOC", async ({
  page,
}) => {
  await page.goto("/docs");

  // Top-level page renders.
  await expect(
    page.getByRole("heading", { level: 1, name: "Welcome" }),
  ).toBeVisible();

  // Sidebar shows the auto-generated nested nav entry.
  const nestedNavLink = page.getByRole("link", { name: "Hardware Setup" });
  await expect(nestedNavLink).toBeVisible();

  // Navigating to the nested page renders its content.
  await nestedNavLink.click();
  await expect(page).toHaveURL(/\/docs\/getting-started\/hardware-setup$/);
  await expect(
    page.getByRole("heading", { level: 1, name: "Hardware Setup" }),
  ).toBeVisible();
  await expect(page.getByText("Connect each sensor to the hub")).toBeVisible();

  // Table of contents matches the page's headings.
  await expect(
    page.getByRole("link", { name: "Verifying readings" }).last(),
  ).toBeVisible();
});

test("docs section respects the site's shared theme toggle", async ({
  page,
}) => {
  await page.goto("/docs/getting-started/hardware-setup");

  const html = page.locator("html");
  const initiallyDark = (await html.getAttribute("class"))?.includes("dark");

  await page.getByRole("button", { name: "Toggle Theme" }).click();

  await expect(html).toHaveClass(
    initiallyDark ? /(?<!-)\blight\b/ : /(?<!-)\bdark\b/,
  );
});

test("docs section is reachable from the homepage nav", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: "Docs", exact: true }).click();
  await expect(page).toHaveURL(/\/docs$/);
});
