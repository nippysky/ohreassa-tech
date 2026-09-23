import type { Metadata } from "next";
import { createHash } from "node:crypto";
import type { Product, ProductImage } from "./commerce/types";
import { productPrice } from "./commerce/pricing";
import { siteUrl, type StoreSettings } from "./store";

export function socialImage(
  settings: StoreSettings,
  content?: {
    kind: "product" | "category";
    slug: string;
    name: string;
    image?: ProductImage | null;
    updatedAt?: string;
  },
) {
  const params = new URLSearchParams();
  if (content) params.set(content.kind, content.slug);
  // New published content gets a new URL so sharing platforms can refresh it.
  const revision = createHash("sha256")
    .update(
      JSON.stringify([
        settings._updatedAt,
        settings.name,
        settings.logo?.url,
        content?.updatedAt,
        content?.name,
        content?.image?.url,
      ]),
    )
    .digest("hex")
    .slice(0, 16);
  params.set("v", revision);
  return {
    url: `${siteUrl()}/opengraph-image?${params}`,
    width: 1200,
    height: 630,
    alt: content ? `${content.name} | ${settings.name}` : settings.name,
  };
}

export function isIndexableSite(
  origin = siteUrl(),
  deployment = process.env.VERCEL_ENV,
) {
  const url = new URL(origin);
  return (
    url.protocol === "https:" &&
    !["localhost", "127.0.0.1", "[::1]"].includes(url.hostname) &&
    !url.hostname.endsWith(".localhost") &&
    (!deployment || deployment === "production")
  );
}

export function metaDescription(text: string) {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= 170) return normalized;
  return `${normalized.slice(0, 167).replace(/\s+\S*$/, "")}…`;
}

export function pageMetadata(
  settings: StoreSettings,
  {
    title,
    description,
    path,
    shareImage,
    noIndex = false,
  }: {
    title: string;
    description: string;
    path: string;
    shareImage?: ReturnType<typeof socialImage>;
    noIndex?: boolean;
  },
): Metadata {
  const fullTitle = `${title} | ${settings.name}`;
  const summary = metaDescription(description);
  const url = new URL(path, siteUrl()).href;
  const previews = [shareImage || socialImage(settings)];
  return {
    title,
    description: summary,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "en_NG",
      siteName: settings.name,
      title: fullTitle,
      description: summary,
      url,
      images: previews,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: summary,
      images: previews.slice(0, 1),
    },
    robots: {
      index: !noIndex && isIndexableSite(),
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  };
}

// CMS content must never be able to close the JSON-LD script element.
export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function businessJsonLd(settings: StoreSettings) {
  const origin = siteUrl();
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${origin}/#organization`,
        name: settings.name,
        url: origin,
        description: settings.description,
        logo: settings.logo?.url || `${origin}/brand/logo-optimized.png`,
        email: settings.email,
        telephone: settings.phone,
        address: { "@type": "PostalAddress", streetAddress: settings.address },
        ...(settings.instagramUrl ? { sameAs: [settings.instagramUrl] } : {}),
      },
      {
        "@type": "WebSite",
        "@id": `${origin}/#website`,
        url: origin,
        name: settings.name,
        inLanguage: "en-NG",
        publisher: { "@id": `${origin}/#organization` },
      },
    ] as const,
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map(({ name, path }, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: new URL(path, siteUrl()).href,
    })),
  };
}

export function productJsonLd(
  product: Product,
  settings: StoreSettings,
  pricingTime: number,
) {
  const url = `${siteUrl()}/shop/${encodeURIComponent(product.slug)}`;
  const availability =
    product.stockStatus === "outOfStock" || product.stockQuantity === 0
      ? "OutOfStock"
      : product.stockStatus === "preorder"
        ? "PreOrder"
        : "InStock";
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    name: product.name,
    description: product.summary,
    sku: product.sku,
    category: product.category.name,
    image: product.images.map((image) => image.url),
    url,
    ...(product.specifications?.length
      ? {
          additionalProperty: product.specifications.map(
            ({ label, value }) => ({
              "@type": "PropertyValue",
              name: label,
              value,
            }),
          ),
        }
      : {}),
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "NGN",
      // Matches the visible price for one unit, including an active sale.
      price: (productPrice(product, 1, pricingTime).unitPrice / 100).toFixed(2),
      availability: `https://schema.org/${availability}`,
      seller: {
        "@type": "Organization",
        "@id": `${siteUrl()}/#organization`,
        name: settings.name,
        url: siteUrl(),
      },
    },
  };
}
