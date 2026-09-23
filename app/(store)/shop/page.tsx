import type { Metadata } from "next";
import { Suspense } from "react";
import type { Category } from "@/lib/commerce/types";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, MessageCircle, SearchX } from "lucide-react";
import { CatalogFilters } from "@/components/store/catalog-filters";
import { ProductCard } from "@/components/store/product-card";
import { whatsappContact } from "@/lib/store";
import {
  catalogView,
  PRODUCTS_PER_PAGE,
  type CatalogParams,
} from "@/lib/commerce/catalog";
import { breadcrumbJsonLd, pageMetadata, socialImage } from "@/lib/seo";
import { StructuredData } from "@/components/structured-data";
import { getCatalog, getSettings, getPricingTime } from "@/sanity/lib/data";

type ShopProps = { searchParams: Promise<CatalogParams> };

export async function generateMetadata({
  searchParams,
}: ShopProps): Promise<Metadata> {
  const [params, { products, categories }, settings, now] = await Promise.all([
    searchParams,
    getCatalog(),
    getSettings(),
    getPricingTime(),
  ]);
  const view = catalogView(products, categories, params, now);
  const category = view.selectedCategory;
  const title = view.q
    ? `Search results for “${view.q}”`
    : category?.seo?.title ||
      (category ? `${category.name} in Nigeria` : "Shop power solutions");
  return pageMetadata(settings, {
    title: `${title}${view.page > 1 ? ` – Page ${view.page}` : ""}`,
    description:
      category?.seo?.description ||
      category?.description ||
      "Explore our energy solutions. Current naira prices, bulk offers and easy WhatsApp ordering.",
    path: view.canonicalPath,
    shareImage: category
      ? socialImage(settings, {
          kind: "category",
          slug: category.slug,
          name: category.name,
          image: category.image,
          updatedAt: category._updatedAt,
        })
      : undefined,
    noIndex: view.noIndex,
  });
}

async function ShopContent({ searchParams }: ShopProps) {
  const [params, { products, categories, status }, settings, now] =
    await Promise.all([
      searchParams,
      getCatalog(),
      getSettings(),
      getPricingTime(),
    ]);
  const {
    q,
    category,
    selectedCategory,
    sort,
    deals,
    filtered,
    pageCount,
    page,
    href,
  } = catalogView(products, categories, params, now);
  return (
    <>
      <StructuredData
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Shop", path: "/shop" },
          ...(selectedCategory
            ? [
                {
                  name: selectedCategory.name,
                  path: `/shop?category=${encodeURIComponent(selectedCategory.slug)}`,
                },
              ]
            : []),
        ])}
      />
      <ShopBanner category={selectedCategory} />
      <section className="container catalog-section">
        <nav className="category-tabs" aria-label="Product categories">
          <Link
            href={href({ category: "", page: "" })}
            className={!category ? "active" : ""}
          >
            All products
          </Link>
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={href({ category: c.slug, page: "" })}
              className={category === c.slug ? "active" : ""}
            >
              {c.name}
            </Link>
          ))}
        </nav>
        <CatalogFilters
          key={`${q}-${category}-${sort}-${deals}`}
          {...{ q, category, sort, deals }}
        />
        {products.length > 0 && (
          <div className="results-line">
            <span>
              {filtered.length} {filtered.length === 1 ? "product" : "products"}
              {q ? ` for “${q}”` : ""}
            </span>
            <span>Prices in Nigerian naira (₦)</span>
          </div>
        )}
        {filtered.length ? (
          <>
            <div className="product-grid">
              {filtered
                .slice((page - 1) * PRODUCTS_PER_PAGE, page * PRODUCTS_PER_PAGE)
                .map((p) => (
                  <ProductCard key={p._id} product={p} pricingTime={now} />
                ))}
            </div>
            {pageCount > 1 && (
              <nav className="pagination" aria-label="Pagination">
                {page > 1 && (
                  <Link href={href({ page: String(page - 1) })}>
                    ← Previous
                  </Link>
                )}
                <span>
                  Page {page} of {pageCount}
                </span>
                {page < pageCount && (
                  <Link href={href({ page: String(page + 1) })}>Next →</Link>
                )}
              </nav>
            )}
          </>
        ) : products.length ? (
          <div className="empty-state">
            <SearchX size={38} strokeWidth={1.3} />
            <h2>No matches just yet.</h2>
            <p>Try a different search or explore another collection.</p>
            <Link className="button button-dark" href="/shop">
              Clear filters <ArrowUpRight size={17} />
            </Link>
          </div>
        ) : (
          <div className="catalog-empty">
            <div>
              <div className="eyebrow">LET’S FIND YOUR FIT</div>
              <h2>
                {status === "unavailable"
                  ? "A brief pause.\nThe power’s still here."
                  : "Good energy starts\nwith a conversation."}
              </h2>
              <p>
                {status === "unavailable"
                  ? "Our online catalog is temporarily unavailable. Please try again shortly, or let our team help you directly."
                  : "We’re getting our online collection ready. In the meantime, our team can help you explore available products and find your perfect power solution."}
              </p>
              <a
                className="button button-orange"
                href={whatsappContact(settings.whatsappNumber)}
              >
                <MessageCircle size={18} />
                Explore with our team <ArrowUpRight size={18} />
              </a>
              {!!categories.length && (
                <span className="small-note">
                  {categories.map((c) => c.name).join(" · ")}
                </span>
              )}
            </div>
            <div className="catalog-empty-image">
              <Image
                src="/images/hero-battery.webp"
                alt="Ohreassa lithium battery"
                fill
                sizes="(max-width: 650px) 70vw, 350px"
              />
            </div>
          </div>
        )}
      </section>
    </>
  );
}

function ShopBanner({ category }: { category?: Category }) {
  return (
    <section className="page-banner">
      <div className="container">
        <div className="breadcrumbs">
          <Link href="/">Home</Link>
          <span>/</span>
          <span>Shop</span>
          {category && (
            <>
              <span>/</span>
              <span>{category.name}</span>
            </>
          )}
        </div>
        <div className="eyebrow">YOUR NEXT CHAPTER, POWERED.</div>
        <h1>
          {category?.name || "Find your kind of power"}
          <span className="orange-text">.</span>
        </h1>
        <p>
          {category?.description ||
            "Thoughtful energy solutions. Chosen for your everyday."}
        </p>
      </div>
    </section>
  );
}

function ShopLoading() {
  return (
    <>
      <ShopBanner />
      <section
        className="container catalog-section"
        role="status"
        aria-label="Loading products"
        aria-busy="true"
      >
        <div className="skeleton skeleton-eyebrow" />
        <div className="skeleton-grid" aria-hidden="true">
          {[1, 2, 3].map((item) => (
            <div className="skeleton" key={item} />
          ))}
        </div>
        <span className="sr-only">Loading products…</span>
      </section>
    </>
  );
}

export default function ShopPage({ searchParams }: ShopProps) {
  return (
    <Suspense fallback={<ShopLoading />}>
      <ShopContent searchParams={searchParams} />
    </Suspense>
  );
}
