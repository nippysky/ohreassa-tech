"use client";

import { useRouter } from "next/navigation";
import Form from "next/form";
import { useOptimistic, useTransition } from "react";
import { Search, SlidersHorizontal } from "lucide-react";

export function CatalogFilters({
  q,
  category,
  sort,
  deals,
}: {
  q: string;
  category: string;
  sort: string;
  deals: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [filters, updateFilters] = useOptimistic(
    { deals, sort },
    (current, updates: Partial<{ deals: boolean; sort: string }>) => ({
      ...current,
      ...updates,
    }),
  );
  function navigate(updates: Record<string, string>) {
    const params = new URLSearchParams({
      ...(q ? { q } : {}),
      ...(category ? { category } : {}),
      ...(sort ? { sort } : {}),
      ...(deals ? { deals: "true" } : {}),
      ...updates,
    });
    [...params].forEach(([key, value]) => {
      if (!value) params.delete(key);
    });
    startTransition(() => {
      updateFilters({
        deals: params.get("deals") === "true",
        sort: params.get("sort") || "featured",
      });
      router.push(`/shop?${params}`, { scroll: false });
    });
  }
  return (
    <div className="catalog-tools" aria-busy={pending}>
      <Form
        action="/shop"
        role="search"
        className="catalog-search"
        scroll={false}
      >
        <Search size={19} />
        <input
          aria-label="Search products"
          name="q"
          type="search"
          defaultValue={q}
          placeholder="Search products, models, and more…"
          maxLength={100}
        />
        {category && <input type="hidden" name="category" value={category} />}
        <input type="hidden" name="sort" value={sort} />
        {deals && <input type="hidden" name="deals" value="true" />}
        <button type="submit" aria-label="Submit search">
          <ArrowSearch />
        </button>
      </Form>
      <label className="deals-filter">
        <input
          type="checkbox"
          checked={filters.deals}
          disabled={pending}
          onChange={(e) => navigate({ deals: e.target.checked ? "true" : "" })}
        />
        On sale
      </label>
      <label className="sort-select">
        <SlidersHorizontal size={16} />
        <span className="sr-only">Sort products</span>
        <select
          value={filters.sort}
          disabled={pending}
          onChange={(e) => navigate({ sort: e.target.value })}
        >
          <option value="featured">Recommended</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
          <option value="name">Name: A to Z</option>
        </select>
      </label>
      <span role="status" className="sr-only">
        {pending ? "Updating products…" : ""}
      </span>
    </div>
  );
}

function ArrowSearch() {
  return <span aria-hidden="true">→</span>;
}
