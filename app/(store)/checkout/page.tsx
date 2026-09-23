import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { Checkout } from "@/components/store/checkout";
import { getSettings } from "@/sanity/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return pageMetadata(settings, {
    title: "Checkout",
    description:
      "Add your contact and delivery details, review your order and continue to WhatsApp to send your request to our team.",
    path: "/checkout",
    noIndex: true,
  });
}
export default async function CheckoutPage() {
  const settings = await getSettings();
  return (
    <section className="container commerce-page">
      <div className="eyebrow">PERSONAL. SIMPLE. POWERED.</div>
      <h1>
        A conversation away<span className="orange-text">.</span>
      </h1>
      <Checkout settings={settings} />
    </section>
  );
}
