import { productPrice } from "./pricing";
import type { Category, Product } from "./types";

export type CatalogParams = Record<string, string | string[] | undefined>;
export const PRODUCTS_PER_PAGE = 12;

export function catalogView(
  products: Product[],
  categories: Category[],
  params: CatalogParams,
  now: number,
) {
  const param = (name: string) =>
    typeof params[name] === "string" ? params[name].slice(0, 100) : "";
  const q = param("q").trim();
  const category = param("category");
  const selectedCategory = categories.find((item) => item.slug === category);
  const sort = param("sort") || "featured";
  const deals = param("deals") === "true";
  const filtered = products.filter(
    (product) =>
      (!category || product.category?.slug === category) &&
      (!q ||
        `${product.name} ${product.description}`
          .toLowerCase()
          .includes(q.toLowerCase())) &&
      (!deals || productPrice(product, 1, now).pricing === "sale"),
  );
  if (sort === "price-asc")
    filtered.sort(
      (a, b) =>
        productPrice(a, 1, now).unitPrice - productPrice(b, 1, now).unitPrice,
    );
  if (sort === "price-desc")
    filtered.sort(
      (a, b) =>
        productPrice(b, 1, now).unitPrice - productPrice(a, 1, now).unitPrice,
    );
  if (sort === "name") filtered.sort((a, b) => a.name.localeCompare(b.name));
  const pageCount = Math.max(1, Math.ceil(filtered.length / PRODUCTS_PER_PAGE));
  const requestedPage = Number(param("page") || 1);
  const page = Math.min(
    pageCount,
    Math.max(1, Number.isSafeInteger(requestedPage) ? requestedPage : 1),
  );
  const href = (updates: Record<string, string> = {}) => {
    const search = new URLSearchParams({
      q,
      category,
      deals: deals ? "true" : "",
      sort,
      ...updates,
    });
    [...search].forEach(([key, value]) => {
      if (
        !value ||
        (key === "sort" && value === "featured") ||
        (key === "page" && value === "1")
      )
        search.delete(key);
    });
    return `/shop${search.size ? `?${search}` : ""}`;
  };
  // Each results page has its own canonical. Only clean category/browse pages
  // are indexable; search, sort, offers and empty results are excluded.
  const canonicalPath = href({ page: page > 1 ? String(page) : "" });
  const noIndex =
    !!q ||
    deals ||
    sort !== "featured" ||
    filtered.length === 0 ||
    (!!category && !selectedCategory) ||
    page !== requestedPage;
  return {
    q,
    category,
    selectedCategory,
    sort,
    deals,
    filtered,
    pageCount,
    page,
    href,
    canonicalPath,
    noIndex,
  };
}
