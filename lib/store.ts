import type { ProductImage, SeoContent } from "./commerce/types";
import {
  contentDefaults,
  resolveWebsiteContent,
  type WebsiteContent,
  type WebsiteContentInput,
} from "./site-content";

export type StoreSettings = {
  _updatedAt?: string;
  name: string;
  tagline: string;
  description: string;
  aboutText: string;
  email: string;
  phone: string;
  alternatePhone: string;
  whatsappNumber: string;
  address: string;
  openingHours: string;
  instagramUrl: string;
  announcement: string;
  logo?: ProductImage | null;
  seo?: SeoContent | null;
  content: WebsiteContent;
};

// Initial editor values and first-run presentation only. Published Sanity settings take precedence.
export const storeDefaults: StoreSettings = {
  name: "Ohreassa Technology",
  tagline:
    "Reliable, affordable solar power solutions for Nigerian homes and businesses.",
  description:
    "Quality solar panels, lithium batteries, inverters and professional installation for Nigerian homes and businesses. Reliable power, made affordable.",
  aboutText:
    "For over 7 years, Ohreassa Technology has helped homes and businesses across Nigeria move toward more reliable power.\n\nWe provide quality, affordable solar solutions designed around how you actually use electricity. Whether you need backup power for your home, reliable energy for your business, or a complete solar system, we’ll help you find the right solution for your needs and budget.\n\nOur commitment doesn’t stop at the sale. From choosing the right product to installation and after-sales support, we’re with you throughout the journey.",
  email: "ohreassatechnology20@gmail.com",
  phone: "08068244971",
  alternatePhone: "",
  whatsappNumber: "2348122214307",
  address:
    "No. 2, St. Patrick’s Road, Alaba International Market, Ojo, Lagos, Nigeria",
  instagramUrl: "https://www.instagram.com/ohreassa_technology/",
  openingHours: "",
  announcement:
    "Reliable power. Made affordable. Solar solutions across Nigeria.",
  content: contentDefaults,
};

export function resolveStoreSettings(
  settings:
    | (Omit<Partial<StoreSettings>, "content"> & {
        content?: WebsiteContentInput | null;
      })
    | null,
): StoreSettings {
  if (!settings) return storeDefaults;
  const defined = Object.fromEntries(
    Object.entries(settings).filter(([, value]) => value != null),
  );
  return {
    ...storeDefaults,
    ...defined,
    // Clearing an optional field in Studio must remove it, not restore a starter value.
    announcement: settings.announcement || "",
    tagline: settings.tagline || "",
    alternatePhone: settings.alternatePhone || "",
    instagramUrl: settings.instagramUrl || "",
    openingHours: settings.openingHours || "",
    logo: settings.logo || null,
    content: resolveWebsiteContent(settings.content),
  };
}

export function whatsappContact(
  number: string,
  message = "Hello! I’d like help choosing a power solution.",
) {
  const digits = number.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function siteUrl() {
  const value =
    process.env.SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000");
  return new URL(value).origin;
}
