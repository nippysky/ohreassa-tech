import assert from "node:assert/strict";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ProductCard } from "../components/store/product-card";
import { ProductDetail } from "../components/store/product-detail";
import { CartProvider } from "../components/store/cart-provider";
import type { Product } from "../lib/commerce/types";

const product: Product = {
  _id: "minimal-product",
  slug: "minimal-product",
  name: "Home backup battery",
  description: "Backup power for a refrigerator and essential appliances.",
  price: 500000,
  images: [{ url: "/images/hero-battery.webp", alt: "" }],
  category: null,
  stockStatus: "inStock",
  featured: false,
};

test("a basic product card renders without a category, SKU, separate summary or photo caption", () => {
  const html = renderToStaticMarkup(
    createElement(ProductCard, { product, pricingTime: 0 }),
  );
  assert.ok(html.includes(product.description));
  assert.match(html, /alt="Home backup battery"/);
  assert.match(html, /₦500,000/);
  assert.ok(!html.includes("undefined"));
  assert.ok(!html.includes("category="));
});

test("a basic product detail renders and prepares a model-free product enquiry", () => {
  const html = renderToStaticMarkup(
    createElement(
      CartProvider,
      null,
      createElement(ProductDetail, {
        product,
        pricingTime: 0,
        whatsappNumber: "2348122214307",
      }),
    ),
  );
  assert.ok(html.includes(product.description));
  assert.match(html, /Available to order/);
  assert.match(html, /Add to cart/);
  assert.ok(!html.includes("MODEL:"));
  assert.ok(!html.includes("category="));
  const link = html.match(/href="(https:\/\/wa\.me\/[^\"]+)"/)?.[1];
  assert.ok(link);
  assert.equal(
    new URL(link).searchParams.get("text"),
    "Hello! I’d like to know more about Home backup battery.",
  );
});
