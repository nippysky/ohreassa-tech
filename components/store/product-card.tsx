import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Package } from "lucide-react";
import type { Product } from "@/lib/commerce/types";
import { formatMoney, productPrice } from "@/lib/commerce/pricing";

export function ProductCard({
  product,
  pricingTime,
}: {
  product: Product;
  pricingTime: number;
}) {
  const { unitPrice, regularPrice, pricing } = productPrice(
    product,
    1,
    pricingTime,
  );
  const image = product.images?.[0];
  return (
    <article className="product-card">
      <Link href={`/shop/${product.slug}`} className="product-image-link">
        <div className="product-badges">
          {product.stockStatus === "outOfStock" ? (
            <span className="badge">Out of stock</span>
          ) : pricing === "sale" ? (
            <span className="badge badge-orange">
              Save {Math.round((1 - unitPrice / regularPrice) * 100)}%
            </span>
          ) : product.stockStatus === "preorder" ? (
            <span className="badge">Pre-order</span>
          ) : null}
        </div>
        {image?.url ? (
          <Image
            src={image.url}
            alt={image.alt || product.name}
            fill
            sizes="(max-width: 800px) 45vw, 400px"
            placeholder={image.lqip ? "blur" : "empty"}
            blurDataURL={image.lqip}
          />
        ) : (
          <Package size={56} strokeWidth={1} />
        )}
        <span className="product-view">
          Explore product <ArrowUpRight size={18} />
        </span>
      </Link>
      <div className="product-card-details">
        <span className="eyebrow">{product.category?.name}</span>
        <h3>
          <Link href={`/shop/${product.slug}`}>{product.name}</Link>
        </h3>
        <p>{product.summary}</p>
        <div className="product-price">
          <strong>{formatMoney(unitPrice)}</strong>
          {unitPrice < regularPrice && <del>{formatMoney(regularPrice)}</del>}
        </div>
        {!!product.quantityPrices?.length && (
          <span className="bulk-hint">Bulk pricing available</span>
        )}
      </div>
    </article>
  );
}
