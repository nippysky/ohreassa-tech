import assert from "node:assert/strict";
import { test } from "node:test";
import { catalogView } from "../lib/commerce/catalog";
import { productExcerpt } from "../lib/commerce/product-content";
import type { Category, Product } from "../lib/commerce/types";
import {
  businessJsonLd,
  isIndexableSite,
  pageMetadata,
  productJsonLd,
  serializeJsonLd,
  socialImage,
} from "../lib/seo";
import { storeDefaults } from "../lib/store";

const category: Category = {
  _id: "test-category",
  name: "New collection",
  slug: "new-collection",
};
const product: Product = {
  _id: "seo-fixture",
  name: "Test product",
  slug: "test-product",
  category,
  description: "Test-only inventory",
  images: [
    {
      url: "https://cdn.sanity.io/images/example/production/main.jpg",
      alt: "Main picture",
    },
  ],
  price: 500000,
  salePrice: 490000,
  saleStartsAt: "2026-09-01T00:00:00Z",
  saleEndsAt: "2026-10-01T00:00:00Z",
  quantityPrices: [{ minimumQuantity: 6, unitPrice: 480000 }],
  stockStatus: "inStock",
  featured: false,
};
const now = Date.parse("2026-09-22T12:00:00Z");

test("search offers match the one-unit sale price, never the six-unit discount", () => {
  const data = productJsonLd(product, storeDefaults, now);
  assert.equal(data.offers.priceCurrency, "NGN");
  assert.equal(data.offers.price, "490000.00");
  assert.equal(
    productJsonLd(product, storeDefaults, Date.parse(product.saleEndsAt!))
      .offers.price,
    "500000.00",
  );
  assert.equal(data.offers.availability, "https://schema.org/InStock");
});

test("products without optional details stay searchable and have complete search metadata", () => {
  const basic: Product = {
    _id: "basic-product",
    name: "Home backup battery",
    slug: "basic-product",
    description: "Reliable backup for a refrigerator and essential appliances.",
    price: 500000,
    images: [],
    category: null,
    stockStatus: "inStock",
    featured: false,
  };
  assert.equal(
    catalogView([basic], [category], { q: "refrigerator" }, now).filtered
      .length,
    1,
  );
  assert.equal(
    catalogView([basic], [category], { category: category.slug }, now).filtered
      .length,
    0,
  );
  const data = productJsonLd(basic, storeDefaults, now);
  assert.equal(data.description, basic.description);
  assert.equal(data.category, undefined);
  assert.equal("sku" in data, false);
  assert.equal(data.offers.price, "500000.00");
});

test("product previews are generated from one description without changing the full text", () => {
  const text =
    "Backup power for your home.\n\nIncludes a battery and charger for everyday use.";
  assert.equal(
    productExcerpt(text),
    "Backup power for your home. Includes a battery and charger for everyday use.",
  );
  assert.equal(productExcerpt(text, 30), "Backup power for your home.…");
  assert.equal(productExcerpt(""), "");
  assert.equal(productExcerpt("x".repeat(200), 30).length, 30);
});

test("sold-out quantities override preorder and in-stock search availability", () => {
  assert.equal(
    productJsonLd({ ...product, stockStatus: "preorder" }, storeDefaults, now)
      .offers.availability,
    "https://schema.org/PreOrder",
  );
  for (const stockStatus of ["inStock", "preorder", "outOfStock"] as const) {
    assert.equal(
      productJsonLd(
        { ...product, stockStatus, stockQuantity: 0 },
        storeDefaults,
        now,
      ).offers.availability,
      "https://schema.org/OutOfStock",
    );
  }
});

test("CMS content cannot break out of structured-data script tags", () => {
  const name = '</script><script>alert("unsafe")</script>';
  const encoded = serializeJsonLd(
    productJsonLd({ ...product, name }, storeDefaults, now),
  );
  assert.ok(!encoded.includes("<"));
  assert.equal(JSON.parse(encoded).name, name);
});

test("local and Vercel preview environments cannot become indexable", () => {
  for (const url of [
    "http://localhost:3000",
    "https://localhost:3000",
    "https://127.0.0.1",
    "https://[::1]",
    "https://store.localhost",
  ]) {
    assert.equal(isIndexableSite(url, "production"), false);
  }
  assert.equal(isIndexableSite("https://store.example.com", "preview"), false);
  assert.equal(
    isIndexableSite("https://store.example.com", "development"),
    false,
  );
  assert.equal(
    isIndexableSite("https://store.example.com", "production"),
    true,
  );
});

test("new category slugs and pagination have distinct canonical URLs", () => {
  const products = Array.from({ length: 25 }, (_, index) => ({
    ...product,
    _id: String(index),
  }));
  const first = catalogView(
    products,
    [category],
    {
      category: category.slug,
      sort: "featured",
      page: "1",
      utm_source: "test",
    },
    now,
  );
  assert.equal(first.canonicalPath, "/shop?category=new-collection");
  assert.equal(first.noIndex, false);
  const second = catalogView(
    products,
    [category],
    { category: category.slug, page: "2" },
    now,
  );
  assert.equal(second.canonicalPath, "/shop?category=new-collection&page=2");
  assert.equal(second.noIndex, false);
  assert.equal(second.href({ category: "", page: "" }), "/shop");
});

test("search, sorting, sales, empty categories and invalid pages stay out of search indexes", () => {
  for (const params of [
    { q: "test" },
    { sort: "price-asc" },
    { deals: "true" },
    { category: "unknown" },
    { page: "99" },
    { page: "2.5" },
    { page: "nope" },
  ]) {
    assert.equal(catalogView([product], [category], params, now).noIndex, true);
  }
  assert.equal(
    catalogView([], [category], { category: category.slug }, now).noIndex,
    true,
  );
});

test("page previews use current store identity and the product's own main image", () => {
  const shareImage = socialImage(storeDefaults, {
    kind: "product",
    slug: product.slug,
    name: product.name,
    image: product.images[0],
  });
  const metadata = pageMetadata(
    { ...storeDefaults, name: "Updated store" },
    {
      title: product.name,
      description: product.description,
      path: "/shop/test-product",
      shareImage,
      noIndex: true,
    },
  );
  assert.equal(metadata.title, product.name);
  assert.equal(metadata.openGraph?.title, "Test product | Updated store");
  assert.equal(metadata.twitter?.title, metadata.openGraph?.title);
  assert.ok(
    String(metadata.alternates?.canonical).endsWith("/shop/test-product"),
  );
  assert.deepEqual(metadata.openGraph?.images, [shareImage]);
  assert.equal(
    new URL(shareImage.url).searchParams.get("product"),
    product.slug,
  );
  assert.equal((metadata.robots as { index: boolean }).index, false);
});

test("published picture and branding changes refresh the sharing image URL", () => {
  const content = {
    kind: "product" as const,
    slug: product.slug,
    name: product.name,
    image: product.images[0],
  };
  const original = socialImage(storeDefaults, content).url;
  const updatedPhoto = socialImage(storeDefaults, {
    ...content,
    image: { url: `${product.images[0].url}?new-photo`, alt: "New photo" },
  }).url;
  const updatedBranding = socialImage(
    { ...storeDefaults, name: "Updated name" },
    content,
  ).url;
  assert.notEqual(original, updatedPhoto);
  assert.notEqual(original, updatedBranding);
  assert.equal(original, socialImage(storeDefaults, content).url);
});

test("business markup follows edited contact details and cleared social links", () => {
  const settings = {
    ...storeDefaults,
    name: "Updated store",
    phone: "08111111111",
    instagramUrl: "",
    address: "Updated address",
  };
  const business = businessJsonLd(settings)["@graph"][0];
  assert.equal(business.name, settings.name);
  assert.equal(business.telephone, settings.phone);
  assert.deepEqual(business.address, {
    "@type": "PostalAddress",
    streetAddress: settings.address,
  });
  assert.equal(business.sameAs, undefined);
});
