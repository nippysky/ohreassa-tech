import assert from "node:assert/strict";
import { test } from "node:test";
import { unstable_getResponseFromNextConfig } from "next/experimental/testing/server";
import nextConfig from "../next.config";

test("Studio permits Sanity Dashboard embedding at its root and nested routes", async () => {
  for (const path of [
    "/studio",
    "/studio/",
    "/studio/structure",
    "/studio/structure/product;example?view=form",
  ]) {
    const { headers } = await unstable_getResponseFromNextConfig({
      url: `https://ohreassatechnology.com${path}`,
      nextConfig,
    });
    assert.equal(headers.get("x-frame-options"), null, path);
    assert.equal(
      headers.get("content-security-policy"),
      "frame-ancestors 'self' https://sanity.io https://*.sanity.io;",
      path,
    );
    assert.equal(headers.get("x-content-type-options"), "nosniff", path);
  }
});

test("storefront and similarly named paths retain their framing protection", async () => {
  for (const path of [
    "/",
    "/shop",
    "/api/checkout",
    "/studio-other",
    "/studios",
  ]) {
    const { headers } = await unstable_getResponseFromNextConfig({
      url: `https://ohreassatechnology.com${path}`,
      nextConfig,
    });
    assert.equal(headers.get("x-frame-options"), "SAMEORIGIN", path);
    assert.equal(headers.get("content-security-policy"), null, path);
    assert.equal(headers.get("x-content-type-options"), "nosniff", path);
  }
});
