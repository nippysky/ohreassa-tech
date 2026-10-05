export type ProductImage = { url: string; alt: string; lqip?: string };
export type PriceTier = { minimumQuantity: number; unitPrice: number };
export type SeoContent = { title?: string; description?: string };
export type Product = {
  _id: string;
  _updatedAt?: string;
  seo?: SeoContent | null;
  name: string;
  slug: string;
  category: { name: string; slug: string } | null;
  description: string;
  images: ProductImage[];
  price: number;
  salePrice?: number | null;
  saleStartsAt?: string | null;
  saleEndsAt?: string | null;
  quantityPrices?: PriceTier[];
  stockStatus: "inStock" | "preorder" | "outOfStock";
  stockQuantity?: number | null;
  warrantyMonths?: number | null;
  featured: boolean;
  specifications?: { label: string; value: string; _key: string }[];
};
export type Category = {
  _id: string;
  _updatedAt?: string;
  seo?: SeoContent | null;
  name: string;
  slug: string;
  description?: string;
  eyebrow?: string;
  image?: ProductImage | null;
  featured?: boolean;
};
export type CartItem = { productId: string; quantity: number };
export type QuoteLine = {
  productId: string;
  name: string;
  slug: string;
  image: ProductImage | null;
  quantity: number;
  unitPrice: number;
  regularPrice: number;
  lineTotal: number;
  savings: number;
  pricing: "standard" | "sale" | "bulk";
  stockStatus: Product["stockStatus"];
};
// Monetary values in quotes are integer kobo, never floating-point naira.
export type Quote = {
  lines: QuoteLine[];
  subtotal: number;
  savings: number;
  currency: "NGN";
};
export type Customer = {
  name: string;
  phone: string;
  fulfillment: "delivery" | "pickup";
  address: string;
  city: string;
  state: string;
  notes: string;
  consent: true;
};
export type CheckoutResult = {
  provider: "whatsapp";
  url: string;
  message: string;
  reference: string;
  quote: Quote;
};
