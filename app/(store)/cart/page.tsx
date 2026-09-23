import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import { Cart } from "@/components/store/cart";
import { getSettings } from "@/sanity/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return pageMetadata(settings, {
    title: "Your cart",
    description:
      "Review your selected products, quantities and current naira prices before continuing to guest checkout.",
    path: "/cart",
    noIndex: true,
  });
}
export default async function CartPage() {
  const settings = await getSettings();
  return (
    <section className="container commerce-page">
      <div className="breadcrumbs">
        <Link href="/">Home</Link>
        <span>/</span>
        <span>Your cart</span>
      </div>
      <div className="eyebrow">ONE STEP CLOSER</div>
      <h1>
        Good things in store<span className="orange-text">.</span>
      </h1>
      <Cart whatsappNumber={settings.whatsappNumber} />
    </section>
  );
}
