"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowUpRight,
  Check,
  MessageCircle,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";
import {
  formatMoney,
  MAX_QUANTITY,
  productPrice,
} from "@/lib/commerce/pricing";
import { whatsappContact } from "@/lib/store";
import type { Product } from "@/lib/commerce/types";
import { useCart } from "./cart-provider";
import { ProductGallery } from "./product-gallery";

export function ProductDetail({
  product,
  whatsappNumber,
  pricingTime,
}: {
  product: Product;
  whatsappNumber: string;
  pricingTime: number;
}) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { add, ready } = useCart();
  const max = Math.min(MAX_QUANTITY, product.stockQuantity ?? MAX_QUANTITY);
  const unavailable = product.stockStatus === "outOfStock" || max === 0;
  const { unitPrice, regularPrice, pricing } = productPrice(
    product,
    quantity,
    pricingTime,
  );
  return (
    <div className="product-detail">
      <ProductGallery
        key={product._id}
        images={product.images || []}
        name={product.name}
      />
      <div className="product-info">
        <Link
          href={`/shop?category=${encodeURIComponent(product.category.slug)}`}
          className="eyebrow"
        >
          {product.category.name}
        </Link>
        <h1>{product.name}</h1>
        <span className="model-label">MODEL: {product.sku}</span>
        <p className="product-summary">{product.summary}</p>
        <div className="detail-price">
          <strong>{formatMoney(unitPrice)}</strong>
          {unitPrice < regularPrice && <del>{formatMoney(regularPrice)}</del>}
          <span>per unit</span>
        </div>
        {pricing !== "standard" && (
          <div className="discount-note">
            <Check size={15} />
            {pricing === "bulk" ? "Bulk price applied" : "Sale price applied"} ·
            save {formatMoney((regularPrice - unitPrice) * quantity)} on this
            order
          </div>
        )}
        {!!product.quantityPrices?.length && (
          <div className="bulk-prices">
            <span>Better together. Save when you buy more.</span>
            {[...product.quantityPrices]
              .sort((a, b) => a.minimumQuantity - b.minimumQuantity)
              .map((tier) => (
                <div key={tier.minimumQuantity}>
                  <strong>{tier.minimumQuantity}+ units</strong>
                  <span>
                    {formatMoney(Math.round(tier.unitPrice * 100))} / unit
                  </span>
                </div>
              ))}
            <small>Per product. The lowest eligible price applies.</small>
          </div>
        )}
        <span className={`stock-label ${unavailable ? "unavailable" : ""}`}>
          <span className="status-dot" />
          {unavailable
            ? "Currently out of stock"
            : product.stockStatus === "preorder"
              ? "Available to pre-order · timing confirmed by our team"
              : "Available to order"}
        </span>
        <div className="purchase-row">
          <Quantity
            value={quantity}
            max={Math.max(1, max)}
            onChange={(q) => {
              setQuantity(q);
              setAdded(false);
            }}
            disabled={unavailable}
          />
          <button
            disabled={unavailable || !ready}
            className="button button-orange"
            onClick={() => {
              if (add(product._id, quantity)) setAdded(true);
            }}
          >
            {added ? <Check size={19} /> : <ShoppingBag size={19} />}
            {added ? "Added to cart" : "Add to cart"}
          </button>
        </div>
        {added && (
          <Link href="/cart" className="button button-dark full-width">
            View cart & checkout <ArrowUpRight size={18} />
          </Link>
        )}
        <a
          className="product-question"
          href={whatsappContact(
            whatsappNumber,
            `Hello! I’d like to know more about ${product.name} (${product.sku}).`,
          )}
        >
          <MessageCircle size={18} />
          Have a question about this product? <ArrowUpRight size={16} />
        </a>
        <div className="detail-assurances">
          <span>
            <ShieldCheck size={18} />
            Genuine product
          </span>
          {!!product.warrantyMonths && (
            <span>
              <Check size={18} />
              {product.warrantyMonths % 12 === 0
                ? `${product.warrantyMonths / 12}-year`
                : `${product.warrantyMonths}-month`}{" "}
              warranty
            </span>
          )}
        </div>
        <small className="small-note">
          Delivery costs and availability are confirmed on WhatsApp before
          payment.
        </small>
      </div>
    </div>
  );
}

export function Quantity({
  value,
  onChange,
  max = MAX_QUANTITY,
  disabled = false,
}: {
  value: number;
  onChange: (value: number) => void;
  max?: number;
  disabled?: boolean;
}) {
  return (
    <div className="quantity-control">
      <button
        aria-label="Decrease quantity"
        disabled={disabled || value <= 1}
        onClick={() => onChange(value - 1)}
        type="button"
      >
        <Minus size={15} />
      </button>
      <input
        type="number"
        inputMode="numeric"
        aria-label="Quantity"
        min={1}
        max={max}
        value={value}
        disabled={disabled}
        onChange={(e) =>
          onChange(
            Math.min(max, Math.max(1, Math.trunc(Number(e.target.value)) || 1)),
          )
        }
      />
      <button
        aria-label="Increase quantity"
        disabled={disabled || value >= max}
        onClick={() => onChange(value + 1)}
        type="button"
      >
        <Plus size={15} />
      </button>
    </div>
  );
}
