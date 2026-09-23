import type { MetadataRoute } from "next";
import { getCatalog } from "@/sanity/lib/data";
import { siteUrl } from "@/lib/store";
import { isIndexableSite } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!isIndexableSite()) return [];
  const { products, categories } = await getCatalog();
  const populatedCategories = categories.filter((category) =>
    products.some((product) => product.category.slug === category.slug),
  );
  return [
    ...[
      "/",
      "/about",
      "/contact",
      "/privacy",
      "/terms",
      ...(products.length ? ["/shop"] : []),
    ].map((path) => ({ url: new URL(path, siteUrl()).href })),
    ...populatedCategories.map((category) => ({
      url: `${siteUrl()}/shop?category=${encodeURIComponent(category.slug)}`,
      // Product changes also change a collection's contents.
      lastModified: [
        category._updatedAt,
        ...products
          .filter((p) => p.category.slug === category.slug)
          .map((p) => p._updatedAt),
      ]
        .filter((value): value is string => !!value)
        .sort()
        .at(-1),
      ...(category.image ? { images: [category.image.url] } : {}),
    })),
    ...products.map((product) => ({
      url: `${siteUrl()}/shop/${encodeURIComponent(product.slug)}`,
      lastModified: product._updatedAt,
      images: product.images.map((image) => image.url),
    })),
  ];
}
