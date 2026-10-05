import type { Metadata } from "next";
import { Suspense } from "react";
import Loading from "../../loading";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/store/product-detail";
import { StructuredData } from "@/components/structured-data";
import {
  breadcrumbJsonLd,
  pageMetadata,
  productJsonLd,
  socialImage,
} from "@/lib/seo";
import { getProduct, getSettings, getPricingTime } from "@/sanity/lib/data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [product, settings] = await Promise.all([
    getProduct(slug),
    getSettings(),
  ]);
  if (!product) notFound();
  return pageMetadata(settings, {
    title: product.seo?.title || product.name,
    description: product.seo?.description || product.description,
    path: `/shop/${encodeURIComponent(product.slug)}`,
    shareImage: socialImage(settings, {
      kind: "product",
      slug: product.slug,
      name: product.name,
      image: product.images[0],
      updatedAt: product._updatedAt,
    }),
  });
}

async function ProductContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [product, settings, pricingTime] = await Promise.all([
    getProduct(slug),
    getSettings(),
    getPricingTime(),
  ]);
  if (!product) notFound();
  const categoryPath = product.category
    ? `/shop?category=${encodeURIComponent(product.category.slug)}`
    : null;
  return (
    <section className="container product-page">
      <StructuredData data={productJsonLd(product, settings, pricingTime)} />
      <StructuredData
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Shop", path: "/shop" },
          ...(product.category && categoryPath
            ? [{ name: product.category.name, path: categoryPath }]
            : []),
          {
            name: product.name,
            path: `/shop/${encodeURIComponent(product.slug)}`,
          },
        ])}
      />
      <div className="breadcrumbs">
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href="/shop">Shop</Link>
        <span>/</span>
        {product.category && categoryPath && (
          <>
            <Link href={categoryPath}>{product.category.name}</Link>
            <span>/</span>
          </>
        )}
        <span>{product.name}</span>
      </div>
      <ProductDetail
        product={product}
        whatsappNumber={settings.whatsappNumber}
        pricingTime={pricingTime}
      />
      <div className="product-information">
        <div>
          <div className="eyebrow">GET TO KNOW YOUR POWER</div>
          <h2>Built for your everyday.</h2>
          <p className="preserve-lines">{product.description}</p>
        </div>
        {!!product.specifications?.length && (
          <div>
            <h3>At a glance</h3>
            <dl className="specifications">
              {product.specifications.map((s) => (
                <div key={s._key}>
                  <dt>{s.label}</dt>
                  <dd>{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </div>
    </section>
  );
}

export default function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<Loading />}>
      <ProductContent params={params} />
    </Suspense>
  );
}
