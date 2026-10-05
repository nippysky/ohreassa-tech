import type { CheckoutResult, Customer, Quote } from "./types";
import { formatMoney } from "./pricing";
import type { StoreSettings } from "../store";

// An order request is not a payment or reservation. Future providers implement this boundary.
export interface CheckoutProvider {
  createCheckout(input: {
    quote: Quote;
    customer: Customer;
    settings: StoreSettings;
    reference: string;
  }): CheckoutResult;
}

const clean = (text: string) =>
  text
    .replace(/[\r\n]+/g, ", ")
    .replace(/[*_~`]/g, "")
    .trim();

export const whatsappProvider: CheckoutProvider = {
  createCheckout({ quote, customer, settings, reference }) {
    const destination = settings.whatsappNumber.replace(/\D/g, "");
    if (!/^[1-9]\d{7,14}$/.test(destination))
      throw new Error("The store contact number is not configured correctly.");
    const message = [
      `Hello ${clean(settings.name)}! I’d like to place an order.`,
      `Request: ${reference}`,
      "",
      "ORDER DETAILS",
      ...quote.lines.flatMap((line, i) => [
        `${i + 1}. ${clean(line.name)}`,
        `Qty: ${line.quantity} × ${formatMoney(line.unitPrice)} = ${formatMoney(line.lineTotal)}`,
        ...(line.pricing !== "standard"
          ? [`${line.pricing === "bulk" ? "Bulk" : "Sale"} price applied`]
          : []),
        ...(line.stockStatus === "preorder"
          ? ["Pre-order: please confirm lead time"]
          : []),
      ]),
      "",
      `Products subtotal: ${formatMoney(quote.subtotal)}`,
      ...(quote.savings ? [`Savings: ${formatMoney(quote.savings)}`] : []),
      customer.fulfillment === "delivery"
        ? "Delivery: please confirm the delivery fee and final total."
        : "Collection: I will pick up from the store.",
      "",
      "CUSTOMER DETAILS",
      `Name: ${clean(customer.name)}`,
      `Phone: ${clean(customer.phone)}`,
      customer.fulfillment === "delivery"
        ? `Delivery address: ${clean(customer.address)}, ${clean(customer.city)}, ${clean(customer.state)}, Nigeria`
        : `Pickup location: ${clean(settings.address)}`,
      ...(customer.notes ? [`Notes: ${clean(customer.notes)}`] : []),
      "",
      "Please confirm availability, the final total and payment instructions. This is an order request; no payment has been made.",
    ].join("\n");
    return {
      provider: "whatsapp",
      message,
      url: `https://wa.me/${destination}?text=${encodeURIComponent(message)}`,
      reference,
      quote,
    };
  },
};
