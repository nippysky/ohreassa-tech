import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { getSettings } from "@/sanity/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return pageMetadata(settings, {
    title: "Ordering terms",
    description: `Read ${settings.name}’s terms for WhatsApp order requests, prices, availability, delivery, payment confirmation and product support.`,
    path: "/terms",
  });
}
export default async function TermsPage() {
  const settings = await getSettings();
  return (
    <article className="container legal-page">
      <div className="eyebrow">BEFORE YOU ORDER</div>
      <h1>A clear way forward.</h1>
      <h2>Orders begin with a request</h2>
      <p>
        Adding items to a cart or opening WhatsApp does not reserve stock,
        confirm a sale or complete payment. Send your message on WhatsApp, then
        wait for {settings.name} to confirm availability, the final total,
        fulfilment and payment instructions.
      </p>
      <h2>Prices and bulk offers</h2>
      <p>
        All website prices are in Nigerian naira. Published prices are checked
        again when you prepare your order. Bulk rates apply to the minimum
        quantity stated for each individual product; the standard threshold is 6
        units. Quantities of different products are not combined. The lowest
        eligible regular, sale or bulk price applies without stacking discounts.
        Confirm the final quote with our team before payment.
      </p>
      <h2>Delivery and collection</h2>
      <p>
        Delivery charges are not included in the products subtotal. Delivery
        availability, timing and fees are confirmed for your address before
        payment. For pickup, agree collection arrangements with the team before
        visiting.
      </p>
      <h2>Payment</h2>
      <p>
        No payment is collected by this website. {settings.name} will provide
        current payment instructions directly. The supplied trading terms
        require full payment before delivery or at pickup. Confirm the
        recipient’s details with the team before making a transfer.
      </p>
      <h2>Warranty and support</h2>
      <p>
        Check the warranty stated on the product you order and confirm it with
        the team. Contact {settings.name} before opening, dismantling or
        arranging third-party repair of a product, as unauthorised work may void
        its warranty. Report damaged, faulty or incorrect items promptly so the
        team can advise on assessment and resolution.
      </p>
      <h2>Changes and cancellations</h2>
      <p>
        Contact the team as soon as possible to request an order change,
        cancellation or return. They will confirm the options applicable to your
        order and its fulfilment status. These ordering details do not remove
        any rights that apply under law.
      </p>
    </article>
  );
}
