import { expect, test } from "@playwright/test";
import { instant } from "@next/playwright";

test("shop shows a useful shell before request-specific data on a direct visit", async ({
  page,
  baseURL,
}) => {
  await instant(
    page,
    async () => {
      await page.goto("/shop");
      await expect(
        page.getByRole("heading", { name: "Find your kind of power." }),
      ).toBeVisible();
    },
    { baseURL },
  );
  await expect(
    page.getByRole("searchbox", { name: "Search products", exact: true }),
  ).toBeVisible();
});

test("shop navigation shows its shell without waiting for search parameters", async ({
  page,
}) => {
  await page.goto("/");
  await instant(page, async () => {
    await page
      .locator(".hero")
      .getByRole("link", { name: "Shop solar products", exact: true })
      .click();
    await expect(page).toHaveURL(/\/shop$/);
    await expect(
      page.getByRole("heading", { name: "Find your kind of power." }),
    ).toBeVisible();
  });
  await expect(
    page.getByRole("searchbox", { name: "Search products", exact: true }),
  ).toBeVisible();
});
