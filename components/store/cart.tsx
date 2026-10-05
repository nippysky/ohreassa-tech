"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  MessageCircle,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { useCart } from "./cart-provider";
import { useQuote } from "./use-quote";
import { Quantity } from "./product-detail";
import { formatMoney } from "@/lib/commerce/pricing";
import type { Quote } from "@/lib/commerce/types";
import { whatsappContact } from "@/lib/store";

export function EmptyCart() {
  return (
    <div className="empty-state">
      <span className="empty-icon">
        <ShoppingBag size={34} strokeWidth={1.4} />
      </span>
      <h2>A little room for possibility.</h2>
      <p>
        Your cart is empty. Let’s find the power solution that fits your life.
      </p>
      <Link className="button button-orange" href="/shop">
        Explore products <ArrowUpRight size={18} />
      </Link>
    </div>
  );
}

export function OrderSummary({
  quote,
  children,
  pickup = false,
}: {
  quote?: Quote;
  children?: React.ReactNode;
  pickup?: boolean;
}) {
  return (
    <aside className="order-summary">
      <div className="eyebrow">YOUR NEXT CHAPTER</div>
      <h2>Order summary</h2>
      {quote ? (
        <>
          <div className="summary-row">
            <span>
              Products (
              {quote.lines.reduce((sum, line) => sum + line.quantity, 0)})
            </span>
            <strong>{formatMoney(quote.subtotal + quote.savings)}</strong>
          </div>
          {quote.savings > 0 && (
            <div className="summary-row savings">
              <span>Your savings</span>
              <strong>−{formatMoney(quote.savings)}</strong>
            </div>
          )}
          <div className="summary-row">
            <span>{pickup ? "Collection" : "Delivery"}</span>
            <span>{pickup ? "Store pickup" : "Confirmed on WhatsApp"}</span>
          </div>
          <div className="summary-total">
            <span>Products subtotal</span>
            <strong>{formatMoney(quote.subtotal)}</strong>
          </div>
        </>
      ) : (
        <p>We’ll confirm current product prices before checkout.</p>
      )}
      {children}
      <p className="summary-note">
        <MessageCircle size={17} />
        Our team confirms your final total and payment details on WhatsApp.
        Nothing is charged here.
      </p>
    </aside>
  );
}

export function Cart({ whatsappNumber }: { whatsappNumber: string }) {
  const { items, ready, update, remove, clear } = useCart();
  const { quote, error, loading, retry } = useQuote(items, ready);
  if (!ready)
    return <div className="skeleton skeleton-cart" aria-label="Loading cart" />;
  if (!items.length) return <EmptyCart />;
  return (
    <div className="cart-layout">
      <div>
        <div className="cart-section-title">
          <h2>Your power, picked.</h2>
          <button className="quiet-button" onClick={clear}>
            Clear cart
          </button>
        </div>
        {error && (
          <div className="error-message" role="alert">
            <p>{error}</p>
            <button className="text-link" onClick={retry}>
              Try again
            </button>
            <a href={whatsappContact(whatsappNumber)} className="text-link">
              Contact the team <ArrowUpRight size={15} />
            </a>
          </div>
        )}
        <div
          className={loading ? "cart-items is-loading" : "cart-items"}
          aria-busy={loading}
        >
          {items.map((item, index) => {
            const line = quote?.lines.find(
              (l) => l.productId === item.productId,
            );
            return (
              <article className="cart-item" key={item.productId}>
                <div className="cart-item-image">
                  {line?.image ? (
                    <Image
                      src={line.image.url}
                      alt={line.image.alt || line.name}
                      fill
                      sizes="110px"
                    />
                  ) : (
                    <ShoppingBag size={30} strokeWidth={1} />
                  )}
                </div>
                <div className="cart-item-content">
                  {line ? (
                    <>
                      <Link href={`/shop/${line.slug}`}>
                        <h3>{line.name}</h3>
                      </Link>
                      {line.pricing !== "standard" && (
                        <span className="bulk-hint">
                          {line.pricing === "bulk" ? "Bulk" : "Sale"} price
                          applied
                        </span>
                      )}
                    </>
                  ) : (
                    <h3>
                      {loading ? "Checking product…" : `Cart item ${index + 1}`}
                    </h3>
                  )}
                  <div className="cart-item-controls">
                    <Quantity
                      value={item.quantity}
                      onChange={(q) => update(item.productId, q)}
                    />
                    <button
                      className="remove-item"
                      aria-label={`Remove ${line?.name || `item ${index + 1}`}`}
                      onClick={() => remove(item.productId)}
                    >
                      <Trash2 size={16} />
                      Remove
                    </button>
                  </div>
                </div>
                <strong className="cart-item-price">
                  {line && !error
                    ? formatMoney(line.unitPrice * item.quantity)
                    : "—"}
                </strong>
              </article>
            );
          })}
        </div>
        <Link href="/shop" className="text-link">
          <ArrowLeft size={17} />
          Keep exploring
        </Link>
      </div>
      <OrderSummary quote={!error && !loading ? quote : undefined}>
        {!error && !loading && quote ? (
          <Link href="/checkout" className="button button-orange full-width">
            Proceed to checkout <ArrowUpRight size={18} />
          </Link>
        ) : (
          <button disabled className="button button-orange full-width">
            {loading
              ? "Checking current prices…"
              : "Resolve cart issues to continue"}
          </button>
        )}
        <span className="small-note">
          Bulk discounts apply to eligible quantities of the same product.
        </span>
      </OrderSummary>
    </div>
  );
}
