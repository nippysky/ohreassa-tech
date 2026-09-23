import "server-only";
import { cache } from "react";
import { cacheLife, cacheTag } from "next/cache";
import type { Category, Product } from "@/lib/commerce/types";
import {
  resolveStoreSettings,
  storeDefaults,
  type StoreSettings,
} from "@/lib/store";
import { getSanityClient } from "./client";
import {
  CATALOG_QUERY,
  CATEGORIES_QUERY,
  PRODUCT_QUERY,
  QUOTE_PRODUCTS_QUERY,
  SETTINGS_QUERY,
} from "./queries";

export type Catalog = {
  products: Product[];
  categories: Category[];
  status: "ready" | "unconfigured" | "unavailable";
};

export async function getCategories(): Promise<Category[]> {
  "use cache";
  cacheLife({ stale: 60, revalidate: 60, expire: 300 });
  cacheTag("catalog");
  const client = getSanityClient();
  if (!client) return [];
  try {
    return await client.fetch<Category[]>(CATEGORIES_QUERY);
  } catch {
    return [];
  }
}

export async function getPricingTime(): Promise<number> {
  "use cache";
  cacheLife({ stale: 60, revalidate: 60, expire: 300 });
  cacheTag("catalog");
  return Date.now();
}

export const getCatalog = cache(async function getCatalog(): Promise<Catalog> {
  "use cache";
  cacheLife({ stale: 60, revalidate: 60, expire: 300 });
  cacheTag("catalog");
  const client = getSanityClient();
  if (!client) return { products: [], categories: [], status: "unconfigured" };
  try {
    const [products, categories] = await Promise.all([
      client.fetch<Product[]>(CATALOG_QUERY),
      getCategories(),
    ]);
    return { products, categories, status: "ready" };
  } catch {
    console.error(
      "Sanity catalog request failed. Check project configuration and API access.",
    );
    return { products: [], categories: [], status: "unavailable" };
  }
});

export const getProduct = cache(async function getProduct(
  slug: string,
): Promise<Product | null> {
  "use cache";
  cacheLife({ stale: 60, revalidate: 60, expire: 300 });
  cacheTag("catalog");
  const client = getSanityClient();
  if (!client) return null;
  return client.fetch<Product | null>(PRODUCT_QUERY, { slug });
});

export async function getFreshProducts(ids: string[]): Promise<Product[]> {
  const client = getSanityClient();
  if (!client) throw new Error("Catalog not configured");
  return client.fetch<Product[]>(
    QUOTE_PRODUCTS_QUERY,
    { ids },
    { cache: "no-store" },
  );
}

export async function getFreshSettings(): Promise<StoreSettings> {
  const client = getSanityClient();
  if (!client) return storeDefaults;
  const settings = await client.fetch<Partial<StoreSettings> | null>(
    SETTINGS_QUERY,
    {},
    { cache: "no-store" },
  );
  return resolveStoreSettings(settings);
}

export async function getSettings(): Promise<StoreSettings> {
  "use cache";
  cacheLife({ stale: 60, revalidate: 60, expire: 300 });
  cacheTag("settings");
  try {
    return await getFreshSettings();
  } catch {
    return storeDefaults;
  }
}
