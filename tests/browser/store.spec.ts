import { expect, test } from "@playwright/test";
import { buildQuote } from "../../lib/commerce/pricing";
import { whatsappProvider } from "../../lib/commerce/whatsapp";
import { storeDefaults } from "../../lib/store";
import type { Customer, Product } from "../../lib/commerce/types";

// Only these browser tests use fixtures; no catalog records are seeded or served by the application.
const product: Product = {
  _id: "browser-fixture",
  name: "Test hybrid inverter",
  slug: "test-inverter",
  sku: "TEST-01",
  category: { name: "Inverters", slug: "inverters" },
  summary: "",
  description: "",
  images: [],
  price: 500000,
  quantityPrices: [{ minimumQuantity: 6, unitPrice: 480000 }],
  stockStatus: "inStock",
  featured: false,
};

test("home, navigation, search, FAQ and responsive width", async ({
  page,
  isMobile,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /Reliable Power/ }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page
    .locator("#main summary:visible")
    .filter({ hasText: "What solar system do I need for my home?" })
    .click();
  await expect(
    page
      .locator("#main")
      .getByText(/It depends on the appliances you want to power/),
  ).toBeVisible();
  if (isMobile) {
    await page.getByRole("button", { name: "Open menu" }).click();
    await page
      .getByRole("navigation", { name: "Mobile navigation" })
      .getByRole("link", { name: "All products" })
      .click();
  } else {
    await page
      .getByRole("navigation", { name: "Main navigation" })
      .getByRole("link", { name: "Shop products", exact: true })
      .click();
  }
  await expect(
    page.getByRole("heading", { name: /Find your kind of power/ }),
  ).toBeVisible();
  await page
    .getByRole("searchbox", { name: "Search products", exact: true })
    .fill("battery");
  await page.getByRole("button", { name: "Submit search" }).click();
  await expect(page).toHaveURL(/q=battery/);
  await page.getByRole("checkbox", { name: "On sale" }).check();
  await expect(page).toHaveURL(/deals=true/);
  expect(errors).toEqual([]);
});

test("empty cart is honest and corrupted saved cart recovers", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem("ohreassa-cart-v1", "{not json"),
  );
  await page.goto("/cart");
  await expect(
    page.getByRole("heading", { name: "A little room for possibility." }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Explore products", exact: true }),
  ).toBeVisible();
});

test("bulk cart and delivery checkout prepare the correct WhatsApp request without sending it", async ({
  page,
}) => {
  await page.route("**/api/checkout/quote", async (route) => {
    const { items } = route.request().postDataJSON();
    await route.fulfill({ json: { quote: buildQuote(items, [product]) } });
  });
  await page.route("**/api/checkout", async (route) => {
    const { items, customer } = route.request().postDataJSON() as {
      items: { productId: string; quantity: number }[];
      customer: Customer;
    };
    const result = whatsappProvider.createCheckout({
      quote: buildQuote(items, [product]),
      customer,
      settings: storeDefaults,
      reference: "OHR-TEST",
    });
    await route.fulfill({ json: result });
  });
  let whatsappUrl = "";
  await page.route("https://wa.me/**", async (route) => {
    whatsappUrl = route.request().url();
    await route.fulfill({
      body: "<h1>WhatsApp handoff intercepted by test</h1>",
      contentType: "text/html",
    });
  });
  await page.addInitScript(() =>
    localStorage.setItem(
      "ohreassa-cart-v1",
      JSON.stringify([{ productId: "browser-fixture", quantity: 5 }]),
    ),
  );
  await page.goto("/cart");
  await expect(
    page.getByRole("heading", { name: "Test hybrid inverter" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Increase quantity" }).click();
  await expect(
    page.getByText("Bulk price applied", { exact: true }),
  ).toBeVisible();
  await expect(page.locator(".summary-total")).toContainText("₦2,880,000");
  await page.getByRole("link", { name: "Proceed to checkout" }).click();
  await page.getByLabel("Full name").fill("Test Customer");
  await page.getByLabel("Phone number").fill("08000000000");
  await page
    .getByLabel("Delivery address", { exact: false })
    .fill("10 Example Road");
  await page.getByLabel("City / town").fill("Lagos");
  await page.getByLabel("State", { exact: false }).fill("Lagos");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Review my order" }).click();
  await expect(
    page.getByRole("heading", { name: "One last look." }),
  ).toBeVisible();
  await expect(page.locator(".review-details")).toContainText(
    "10 Example Road",
  );
  expect(
    await page.evaluate(() => localStorage.getItem("ohreassa-cart-v1")),
  ).not.toContain("Test Customer");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "Continue to WhatsApp" }).click();
  await expect.poll(() => whatsappUrl).toContain("https://wa.me/2348122214307");
  const message = new URL(whatsappUrl).searchParams.get("text");
  expect(message).toContain("Test Customer");
  expect(message).toContain("Qty: 6");
  expect(message).toContain("₦2,880,000");
  expect(message).toContain("10 Example Road");
});

test("API rejects tampered quantities and cross-origin requests", async ({
  request,
}) => {
  const tampered = await request.post("/api/checkout/quote", {
    data: { items: [{ productId: "test", quantity: -1 }] },
  });
  expect(tampered.status()).toBe(400);
  const crossOrigin = await request.post("/api/checkout/quote", {
    headers: { Origin: "https://untrusted.example" },
    data: { items: [{ productId: "test", quantity: 1 }] },
  });
  expect(crossOrigin.status()).toBe(409);
  expect(crossOrigin.headers()["cache-control"]).toContain("no-store");
});

test("pickup checkout pauses for changed prices before the WhatsApp handoff", async ({
  page,
}) => {
  let checkoutRequests = 0;
  let whatsappUrl = "";
  await page.route("**/api/checkout/quote", async (route) => {
    const { items } = route.request().postDataJSON();
    await route.fulfill({ json: { quote: buildQuote(items, [product]) } });
  });
  await page.route("**/api/checkout", async (route) => {
    checkoutRequests += 1;
    const { items, customer } = route.request().postDataJSON();
    const currentProduct =
      checkoutRequests > 1 ? { ...product, price: 510000 } : product;
    await route.fulfill({
      json: whatsappProvider.createCheckout({
        quote: buildQuote(items, [currentProduct]),
        customer,
        settings: storeDefaults,
        reference: "OHR-TEST",
      }),
    });
  });
  await page.route("https://wa.me/**", async (route) => {
    whatsappUrl = route.request().url();
    await route.fulfill({
      body: "Test handoff intercepted",
      contentType: "text/plain",
    });
  });
  await page.addInitScript(() =>
    localStorage.setItem(
      "ohreassa-cart-v1",
      JSON.stringify([{ productId: "browser-fixture", quantity: 1 }]),
    ),
  );
  await page.goto("/checkout");
  await page.getByLabel("Full name").fill("Pickup Customer");
  await page.getByLabel("Phone number").fill("08000000000");
  await page.getByRole("radio", { name: /Store pickup/ }).check();
  await expect(
    page.getByLabel("Delivery address", { exact: false }),
  ).toHaveCount(0);
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Review my order" }).click();
  await expect(page.locator(".summary-total")).toContainText("₦500,000");
  await page.getByRole("button", { name: "Continue to WhatsApp" }).click();
  await expect(
    page.getByRole("alert").filter({ hasText: "updated prices" }),
  ).toBeVisible();
  await expect(page.locator(".summary-total")).toContainText("₦510,000");
  expect(whatsappUrl).toBe("");
  await page.getByRole("button", { name: "Continue to WhatsApp" }).click();
  await expect.poll(() => whatsappUrl).toContain("https://wa.me/2348122214307");
  const message = new URL(whatsappUrl).searchParams.get("text");
  expect(message).toContain("₦510,000");
  expect(message).toContain("Pickup Customer");
  expect(message).toContain(`Pickup location: ${storeDefaults.address}`);
});
