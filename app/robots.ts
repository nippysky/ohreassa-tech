import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/store";
import { isIndexableSite } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  if (!isIndexableSite()) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Checkout/cart remain crawlable so their noindex metadata can be read.
      disallow: ["/studio", "/api/"],
    },
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
