import type { ProductImage, SeoContent } from "./commerce/types";

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
};

// Initial editor values and first-run presentation only. Published Sanity settings take precedence.
export const storeDefaults: StoreSettings = {
  name: "Ohreassa Technology",
  tagline: "Reliable power. A world of possibilities.",
  description:
    "Energy solutions for homes, businesses and everyday life. Explore our products and order with our team on WhatsApp.",
  aboutText:
    "We bring together practical energy solutions to help people keep their homes, businesses and everyday lives moving.\n\nOur team helps homeowners, business owners, installers and resellers compare products and make informed choices. Whether you’re starting small or planning something bigger, a conversation is a good place to begin.\n\nOur role goes beyond a product on a shelf. We’re here to help with the details, from choosing a suitable solution to understanding your order and getting support.",
  email: "ohreassatechnology20@gmail.com",
  phone: "08068244971",
  alternatePhone: "08122214307",
  whatsappNumber: "2348068244971",
  address:
    "No. 2, St. Patrick’s Road, Alaba International Market, Ojo, Lagos, Nigeria",
  instagramUrl: "https://www.instagram.com/ohreassa_technology/",
  openingHours: "",
  announcement: "A brighter everyday starts with reliable power.",
};

export function resolveStoreSettings(
  settings: Partial<StoreSettings> | null,
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
