import assert from "node:assert/strict";
import { test } from "node:test";
import {
  buildQuote,
  normalizeItems,
  productPrice,
  toKobo,
} from "../lib/commerce/pricing";
import { checkoutRequestSchema } from "../lib/commerce/validation";
import { whatsappProvider } from "../lib/commerce/whatsapp";
import { resolveStoreSettings, storeDefaults } from "../lib/store";
import type { Customer, Product } from "../lib/commerce/types";

const product: Product = {
  _id: "test-inverter",
  name: "Test inverter",
  slug: "test-inverter",
  sku: "TEST-01",
  category: { name: "Inverters", slug: "inverters" },
  summary: "Test fixture only",
  description: "Not published inventory",
  images: [],
  price: 500000,
  quantityPrices: [{ minimumQuantity: 6, unitPrice: 480000 }],
  stockStatus: "inStock",
  featured: false,
};
const customer: Customer = {
  name: "Test Buyer",
  phone: "08000000000",
  fulfillment: "delivery",
  address: "10 Example Street",
  city: "Lagos",
  state: "Lagos",
  notes: "Call on arrival",
  consent: true,
};

test("bulk price begins at six units, including the exactly-five boundary", () => {
  assert.equal(productPrice(product, 5).unitPrice, 50000000);
  assert.equal(productPrice(product, 6).unitPrice, 48000000);
  assert.equal(
    buildQuote([{ productId: product._id, quantity: 6 }], [product]).subtotal,
    288000000,
  );
});
test("bulk thresholds are per product and duplicate lines are merged", () => {
  const second = { ...product, _id: "other" };
  assert.equal(
    buildQuote(
      [
        { productId: product._id, quantity: 3 },
        { productId: second._id, quantity: 3 },
      ],
      [product, second],
    ).savings,
    0,
  );
  const quote = buildQuote(
    [
      { productId: product._id, quantity: 3 },
      { productId: product._id, quantity: 3 },
    ],
    [product],
  );
  assert.equal(quote.lines.length, 1);
  assert.equal(quote.savings, 12000000);
});
test("sale boundaries are inclusive at start and exclusive at end", () => {
  const sale = {
    ...product,
    salePrice: 450000,
    saleStartsAt: "2026-09-01T00:00:00Z",
    saleEndsAt: "2026-10-01T00:00:00Z",
  };
  assert.equal(
    productPrice(sale, 1, Date.parse(sale.saleStartsAt) - 1).pricing,
    "standard",
  );
  assert.equal(
    productPrice(sale, 1, Date.parse(sale.saleStartsAt)).pricing,
    "sale",
  );
  assert.equal(
    productPrice(sale, 1, Date.parse(sale.saleEndsAt)).pricing,
    "standard",
  );
});
test("the lowest eligible sale or bulk price wins without stacking", () => {
  assert.equal(
    productPrice({ ...product, salePrice: 450000 }, 6).unitPrice,
    45000000,
  );
  assert.equal(
    productPrice({ ...product, salePrice: 490000 }, 6).unitPrice,
    48000000,
  );
  assert.equal(
    productPrice(
      {
        ...product,
        quantityPrices: [
          { minimumQuantity: 10, unitPrice: 440000 },
          ...product.quantityPrices!,
        ],
      },
      10,
    ).unitPrice,
    44000000,
  );
});
test("missing, unpublished, unavailable and insufficient-stock products fail closed", () => {
  const items = [{ productId: product._id, quantity: 6 }];
  assert.throws(() => buildQuote(items, []), /no longer available/);
  assert.throws(
    () => buildQuote(items, [{ ...product, stockStatus: "outOfStock" }]),
    /unavailable/,
  );
  assert.throws(
    () => buildQuote(items, [{ ...product, stockQuantity: 5 }]),
    /unavailable/,
  );
  assert.throws(
    () => buildQuote(items, [{ ...product, price: NaN }]),
    /price needs/,
  );
  assert.equal(
    buildQuote(items, [{ ...product, stockStatus: "preorder" }]).lines[0]
      .stockStatus,
    "preorder",
  );
});
test("zero, negative, fractional, oversized and duplicate-inflated quantities are rejected", () => {
  for (const quantity of [0, -1, 1.5, 100, Infinity, NaN])
    assert.throws(() => normalizeItems([{ productId: product._id, quantity }]));
  assert.throws(() =>
    normalizeItems([
      { productId: product._id, quantity: 60 },
      { productId: product._id, quantity: 60 },
    ]),
  );
  assert.throws(() => normalizeItems([]));
});
test("checkout rejects client supplied prices and incomplete delivery details", () => {
  const request = {
    items: [{ productId: product._id, quantity: 1 }],
    customer,
  };
  assert.equal(checkoutRequestSchema.safeParse(request).success, true);
  assert.equal(
    checkoutRequestSchema.safeParse({ ...request, total: 1 }).success,
    false,
  );
  assert.equal(
    checkoutRequestSchema.safeParse({
      ...request,
      items: [{ ...request.items[0], price: 1 }],
    }).success,
    false,
  );
  assert.equal(
    checkoutRequestSchema.safeParse({
      ...request,
      customer: { ...customer, address: "" },
    }).success,
    false,
  );
  assert.equal(
    checkoutRequestSchema.safeParse({
      ...request,
      customer: { ...customer, consent: false },
    }).success,
    false,
  );
  assert.equal(
    checkoutRequestSchema.safeParse({
      ...request,
      customer: {
        ...customer,
        fulfillment: "pickup",
        address: "",
        city: "",
        state: "",
      },
    }).success,
    true,
  );
});
test("prices calculate in integer kobo", () => {
  assert.equal(toKobo(0.29), 29);
  assert.equal(
    buildQuote(
      [{ productId: product._id, quantity: 3 }],
      [{ ...product, price: 19.99, quantityPrices: [] }],
    ).subtotal,
    5997,
  );
});
test("WhatsApp request contains the confirmed number, quantities, prices and delivery details", () => {
  const quote = buildQuote(
    [{ productId: product._id, quantity: 6 }],
    [product],
  );
  const result = whatsappProvider.createCheckout({
    quote,
    customer,
    settings: storeDefaults,
    reference: "OHR-TEST0001",
  });
  const url = new URL(result.url);
  assert.equal(url.hostname, "wa.me");
  assert.equal(url.pathname, "/2348122214307");
  assert.equal(url.searchParams.get("text"), result.message);
  for (const expected of [
    "Test Buyer",
    "08000000000",
    "Test inverter",
    "Qty: 6",
    "₦480,000",
    "₦2,880,000",
    "10 Example Street",
    "Lagos",
    "Bulk price applied",
    "no payment has been made",
  ])
    assert.ok(result.message.includes(expected), expected);
});
test("pickup messages omit address fields and unsupported destination numbers fail", () => {
  const quote = buildQuote(
    [{ productId: product._id, quantity: 1 }],
    [product],
  );
  const result = whatsappProvider.createCheckout({
    quote,
    customer: { ...customer, fulfillment: "pickup" },
    settings: storeDefaults,
    reference: "TEST",
  });
  assert.ok(result.message.includes("Pickup location:"));
  assert.ok(!result.message.includes("Delivery address:"));
  assert.throws(() =>
    whatsappProvider.createCheckout({
      quote,
      customer,
      settings: { ...storeDefaults, whatsappNumber: "0" },
      reference: "TEST",
    }),
  );
});

test("existing CMS settings can add page-copy overrides without losing contact details or missing sections", () => {
  const settings = resolveStoreSettings({
    phone: "08011111111",
    whatsappNumber: "2348022222222",
    content: { hero: { title: "Updated by the store" } },
  });
  assert.equal(settings.phone, "08011111111");
  assert.equal(settings.whatsappNumber, "2348022222222");
  assert.equal(settings.content.hero.title, "Updated by the store");
  assert.equal(settings.content.hero.accent, storeDefaults.content.hero.accent);
  assert.deepEqual(settings.content.services, storeDefaults.content.services);
  assert.deepEqual(
    resolveStoreSettings({ content: { faq: { items: [] } } }).content.faq.items,
    [],
  );
});
