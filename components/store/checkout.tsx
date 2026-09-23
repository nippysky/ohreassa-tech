"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  Copy,
  LockKeyhole,
  MessageCircle,
  PackageCheck,
  Truck,
} from "lucide-react";
import { useCart } from "./cart-provider";
import { useQuote } from "./use-quote";
import { EmptyCart, OrderSummary } from "./cart";
import { customerSchema } from "@/lib/commerce/validation";
import { formatMoney } from "@/lib/commerce/pricing";
import type { CheckoutResult, Customer } from "@/lib/commerce/types";
import { whatsappContact, type StoreSettings } from "@/lib/store";

export function Checkout({ settings }: { settings: StoreSettings }) {
  const { items, ready, announce } = useCart();
  const { quote, error: quoteError, loading, retry } = useQuote(items, ready);
  const [fulfillment, setFulfillment] = useState<"delivery" | "pickup">(
    "delivery",
  );
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [review, setReview] = useState<{
    result: CheckoutResult;
    customer: Customer;
    cartSignature: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const signature = JSON.stringify(items);
  const currentReview = review?.cartSignature === signature ? review : null;

  async function prepare(customer: Customer): Promise<CheckoutResult> {
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items, customer }),
    });
    const data = await response.json();
    if (!response.ok)
      throw new Error(
        data.error || "We couldn’t prepare your order. Please try again.",
      );
    return data;
  }
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const parsed = customerSchema.safeParse({
      name: form.get("name"),
      phone: form.get("phone"),
      fulfillment,
      address: fulfillment === "delivery" ? form.get("address") : "",
      city: fulfillment === "delivery" ? form.get("city") : "",
      state: fulfillment === "delivery" ? form.get("state") : "",
      notes: form.get("notes") || "",
      consent: form.get("consent") === "on",
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || "Please check your details.");
      return;
    }
    setBusy(true);
    try {
      const result = await prepare(parsed.data);
      setReview({ result, customer: parsed.data, cartSignature: signature });
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Please check your connection and try again.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function continueToWhatsApp() {
    if (!currentReview) return;
    setBusy(true);
    setError("");
    try {
      const fresh = await prepare(currentReview.customer);
      if (
        JSON.stringify(fresh.quote) !==
        JSON.stringify(currentReview.result.quote)
      ) {
        setReview({ ...currentReview, result: fresh });
        setError(
          "Your order has updated prices or availability details. Review the updated summary, then continue.",
        );
        return;
      }
      window.location.assign(fresh.url);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Please check your connection and try again.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function copyMessage() {
    if (!currentReview) return;
    try {
      await navigator.clipboard.writeText(currentReview.result.message);
      setCopied(true);
      announce(
        `Order message copied. Paste it into your chat with ${settings.name}.`,
      );
    } catch {
      setError(
        "Your browser couldn’t copy the message. Select and copy the order text below.",
      );
    }
  }

  if (!ready)
    return (
      <div className="skeleton skeleton-cart" aria-label="Loading checkout" />
    );
  if (!items.length) return <EmptyCart />;
  return (
    <>
      <div className="checkout-progress">
        <span className={currentReview ? "complete" : "active"}>
          {currentReview ? <Check size={14} /> : "1"}Your details
        </span>
        <i />
        <span className={currentReview ? "active" : ""}>
          2 Review & WhatsApp
        </span>
      </div>
      <div className="checkout-layout">
        <div>
          {quoteError && (
            <div className="error-message" role="alert">
              <p>{quoteError}</p>
              <button onClick={retry}>Try again</button>
              <Link href="/cart">Edit cart</Link>
            </div>
          )}
          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}
          <form
            className={`checkout-form ${currentReview ? "visually-hidden-form" : ""}`}
            onSubmit={handleSubmit}
            onChange={() => {
              setReview(null);
              setError("");
            }}
          >
            <div className="form-heading">
              <h2>Let’s make it yours.</h2>
              <p>Tell us who you are and where your power is going.</p>
            </div>
            <div className="field-grid">
              <label>
                Full name <span>*</span>
                <input
                  name="name"
                  autoComplete="name"
                  placeholder="Your full name"
                  minLength={2}
                  maxLength={100}
                  required
                />
              </label>
              <label>
                Phone number <span>*</span>
                <input
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="e.g. 08012345678"
                  maxLength={24}
                  minLength={10}
                  required
                />
              </label>
            </div>
            <fieldset className="fulfillment-options">
              <legend>How would you like to receive your order?</legend>
              <label className={fulfillment === "delivery" ? "selected" : ""}>
                <input
                  type="radio"
                  name="fulfillment"
                  value="delivery"
                  checked={fulfillment === "delivery"}
                  onChange={() => setFulfillment("delivery")}
                />
                <Truck size={22} />
                <span>
                  <strong>Delivery</strong>
                  <small>Fee confirmed by our team</small>
                </span>
              </label>
              <label className={fulfillment === "pickup" ? "selected" : ""}>
                <input
                  type="radio"
                  name="fulfillment"
                  value="pickup"
                  checked={fulfillment === "pickup"}
                  onChange={() => setFulfillment("pickup")}
                />
                <PackageCheck size={22} />
                <span>
                  <strong>Store pickup</strong>
                  <small>Collect from our store</small>
                </span>
              </label>
            </fieldset>
            {fulfillment === "delivery" ? (
              <>
                <label>
                  Delivery address <span>*</span>
                  <input
                    name="address"
                    autoComplete="street-address"
                    placeholder="House number, street and area"
                    minLength={2}
                    maxLength={240}
                    required
                  />
                </label>
                <div className="field-grid">
                  <label>
                    City / town <span>*</span>
                    <input
                      name="city"
                      autoComplete="address-level2"
                      placeholder="City or town"
                      minLength={2}
                      maxLength={80}
                      required
                    />
                  </label>
                  <label>
                    State <span>*</span>
                    <input
                      name="state"
                      autoComplete="address-level1"
                      placeholder="State in Nigeria"
                      minLength={2}
                      maxLength={60}
                      required
                    />
                  </label>
                </div>
              </>
            ) : (
              <div className="pickup-address">
                <PackageCheck size={20} />
                <span>
                  <strong>Pick up from {settings.name}</strong>
                  {settings.address}
                  <small>
                    {settings.openingHours ||
                      "Please wait for our team to confirm your pickup arrangements."}
                  </small>
                </span>
              </div>
            )}
            <label>
              Anything we should know? <small>(optional)</small>
              <textarea
                name="notes"
                placeholder="Delivery instructions or a question for our team…"
                rows={3}
                maxLength={400}
              />
            </label>
            <label className="consent-field">
              <input type="checkbox" name="consent" required />
              <span>
                I agree to share these details with {settings.name} through
                WhatsApp to arrange my order. I have read the{" "}
                <Link href="/privacy" target="_blank">
                  privacy notice
                </Link>{" "}
                and{" "}
                <Link href="/terms" target="_blank">
                  ordering terms
                </Link>
                .
              </span>
            </label>
            <button
              disabled={busy || loading || !!quoteError || !quote}
              className="button button-orange full-width"
              type="submit"
            >
              {busy ? "Checking your order…" : "Review my order"}
              <ArrowUpRight size={18} />
            </button>
            <div className="privacy-note">
              <LockKeyhole size={15} />
              Your contact and delivery details are not saved in this browser.
            </div>
          </form>
          {currentReview && (
            <div className="checkout-review">
              <div className="eyebrow">LOOKING GOOD</div>
              <h2>One last look.</h2>
              <p>
                Review your details, then open WhatsApp and press{" "}
                <strong>Send</strong>. Our team will take it from there.
              </p>
              <dl className="review-details">
                <div>
                  <dt>Name</dt>
                  <dd>{currentReview.customer.name}</dd>
                </div>
                <div>
                  <dt>Phone</dt>
                  <dd>{currentReview.customer.phone}</dd>
                </div>
                <div>
                  <dt>
                    {fulfillment === "pickup" ? "Collection" : "Deliver to"}
                  </dt>
                  <dd>
                    {fulfillment === "pickup"
                      ? settings.address
                      : `${currentReview.customer.address}, ${currentReview.customer.city}, ${currentReview.customer.state}`}
                  </dd>
                </div>
              </dl>
              <div className="review-lines">
                {currentReview.result.quote.lines.map((line) => (
                  <div key={line.productId}>
                    <span>
                      {line.name}
                      <small>
                        {line.quantity} × {formatMoney(line.unitPrice)}
                        {line.stockStatus === "preorder" ? " · Pre-order" : ""}
                      </small>
                    </span>
                    <strong>{formatMoney(line.lineTotal)}</strong>
                  </div>
                ))}
              </div>
              <button
                className="button button-whatsapp full-width"
                disabled={busy || !!quoteError || loading}
                onClick={continueToWhatsApp}
              >
                <MessageCircle size={20} />
                {busy ? "Confirming current prices…" : "Continue to WhatsApp"}
                <ArrowUpRight size={19} />
              </button>
              <p className="small-note">
                Opening WhatsApp doesn’t send your message or confirm an order.
                You’ll press Send there. Our team confirms delivery,
                availability and payment.
              </p>
              <div className="review-actions">
                <button className="text-link" onClick={() => setReview(null)}>
                  <ArrowLeft size={16} />
                  Edit details
                </button>
                <button className="text-link" onClick={copyMessage}>
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? "Copied" : "Copy order message"}
                </button>
              </div>
              <details className="message-preview">
                <summary>View WhatsApp message</summary>
                <pre>{currentReview.result.message}</pre>
              </details>
              <p className="small-note">
                If WhatsApp doesn’t open, copy the message and send it to{" "}
                <a href={whatsappContact(settings.whatsappNumber)}>
                  +{settings.whatsappNumber}
                </a>
                . Your cart stays here until you clear it.
              </p>
            </div>
          )}
          <Link className="text-link back-to-cart" href="/cart">
            <ArrowLeft size={17} />
            Back to your cart
          </Link>
        </div>
        <OrderSummary
          quote={
            currentReview?.result.quote ||
            (!quoteError && !loading ? quote : undefined)
          }
          pickup={fulfillment === "pickup"}
        />
      </div>
    </>
  );
}
