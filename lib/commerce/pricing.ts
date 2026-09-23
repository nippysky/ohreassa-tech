import type { CartItem, Product, Quote, QuoteLine } from "./types";

export const MAX_QUANTITY = 99;
export const MAX_CART_LINES = 20;
const money = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
});
export const formatMoney = (kobo: number) => money.format(kobo / 100);
export const toKobo = (naira: number) => Math.round(naira * 100);

export class CommerceError extends Error {}

export function productPrice(product: Product, quantity = 1, now = Date.now()) {
  if (!Number.isFinite(product.price) || product.price <= 0)
    throw new CommerceError(
      "This product’s price needs to be confirmed. Please contact us.",
    );
  const regularPrice = toKobo(product.price);
  let unitPrice = regularPrice;
  let pricing: QuoteLine["pricing"] = "standard";
  const starts = product.saleStartsAt
    ? Date.parse(product.saleStartsAt)
    : -Infinity;
  const ends = product.saleEndsAt ? Date.parse(product.saleEndsAt) : Infinity;
  if (
    product.salePrice &&
    product.salePrice > 0 &&
    now >= starts &&
    now < ends &&
    toKobo(product.salePrice) < unitPrice
  ) {
    unitPrice = toKobo(product.salePrice);
    pricing = "sale";
  }
  for (const tier of product.quantityPrices || []) {
    if (
      Number.isInteger(tier.minimumQuantity) &&
      tier.minimumQuantity >= 2 &&
      quantity >= tier.minimumQuantity &&
      tier.unitPrice > 0 &&
      toKobo(tier.unitPrice) < unitPrice
    ) {
      unitPrice = toKobo(tier.unitPrice);
      pricing = "bulk";
    }
  }
  return { unitPrice, regularPrice, pricing };
}

export function normalizeItems(items: CartItem[]): CartItem[] {
  if (!items.length || items.length > MAX_CART_LINES)
    throw new CommerceError(
      `Your cart must contain 1–${MAX_CART_LINES} different products.`,
    );
  const merged = new Map<string, number>();
  for (const item of items) {
    if (
      !Number.isInteger(item.quantity) ||
      item.quantity < 1 ||
      item.quantity > MAX_QUANTITY
    )
      throw new CommerceError(
        `Choose a quantity between 1 and ${MAX_QUANTITY}.`,
      );
    merged.set(
      item.productId,
      (merged.get(item.productId) || 0) + item.quantity,
    );
  }
  return [...merged].map(([productId, quantity]) => {
    if (quantity > MAX_QUANTITY)
      throw new CommerceError(
        `The maximum quantity per product is ${MAX_QUANTITY}. Contact us for larger orders.`,
      );
    return { productId, quantity };
  });
}

export function buildQuote(
  items: CartItem[],
  products: Product[],
  now = Date.now(),
): Quote {
  const lines = normalizeItems(items).map(
    ({ productId, quantity }): QuoteLine => {
      const product = products.find((p) => p._id === productId);
      if (!product)
        throw new CommerceError(
          "A product in your cart is no longer available. Remove it to continue.",
        );
      if (
        product.stockStatus === "outOfStock" ||
        (product.stockQuantity != null && product.stockQuantity < quantity)
      )
        throw new CommerceError(
          `${product.name}: the selected quantity is unavailable. Reduce the quantity or contact us.`,
        );
      const price = productPrice(product, quantity, now);
      return {
        productId,
        name: product.name,
        slug: product.slug,
        sku: product.sku,
        image: product.images?.[0] || null,
        quantity,
        ...price,
        lineTotal: price.unitPrice * quantity,
        savings: (price.regularPrice - price.unitPrice) * quantity,
        stockStatus: product.stockStatus,
      };
    },
  );
  const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);
  if (!Number.isSafeInteger(subtotal))
    throw new CommerceError("Please contact us to arrange this order.");
  return {
    lines,
    subtotal,
    savings: lines.reduce((sum, line) => sum + line.savings, 0),
    currency: "NGN",
  };
}
