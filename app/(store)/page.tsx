import { Suspense } from "react";
import type { Metadata } from "next";
import { StructuredData } from "@/components/structured-data";
import { businessJsonLd, pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Hero } from "@/components/home/hero";
import { Collections, Faq, TrustBar } from "@/components/home/sections";
import {
  PowerStory,
  SolarSolutions,
  PersonalAdvice,
  WhyOhreassa,
  Experience,
  FinalCta,
} from "@/components/home/marketing";
import { ProductCard } from "@/components/store/product-card";
import {
  getCatalog,
  getCategories,
  getSettings,
  getPricingTime,
} from "@/sanity/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return pageMetadata(settings, {
    title:
      settings.seo?.title || "Reliable, affordable solar solutions in Nigeria",
    description: settings.seo?.description || settings.description,
    path: "/",
  });
}

async function FeaturedProducts() {
  const { products } = await getCatalog();
  const pricingTime = await getPricingTime();
  const featured = products.filter((p) => p.featured).slice(0, 4);
  if (!featured.length) return null;
  return (
    <section className="section container">
      <div className="section-heading">
        <div>
          <div className="eyebrow">SELECTED FOR YOUR EVERYDAY</div>
          <h2>Ready for your next chapter.</h2>
        </div>
        <Link className="text-link" href="/shop">
          Shop the collection <ArrowUpRight size={18} />
        </Link>
      </div>
      <div className="product-grid">
        {featured.map((p) => (
          <ProductCard key={p._id} product={p} pricingTime={pricingTime} />
        ))}
      </div>
    </section>
  );
}

export default async function Home() {
  const [settings, categories] = await Promise.all([
    getSettings(),
    getCategories(),
  ]);
  return (
    <>
      <StructuredData data={businessJsonLd(settings)} />
      <Hero
        content={settings.content}
        whatsappNumber={settings.whatsappNumber}
      />
      <TrustBar />
      <PowerStory
        content={settings.content}
        whatsappNumber={settings.whatsappNumber}
      />
      <Collections categories={categories} content={settings.content} />
      <Suspense
        fallback={
          <div
            className="container skeleton-grid"
            aria-label="Loading featured products"
          >
            <div className="skeleton" />
            <div className="skeleton" />
            <div className="skeleton" />
          </div>
        }
      >
        <FeaturedProducts />
      </Suspense>
      <SolarSolutions
        content={settings.content}
        whatsappNumber={settings.whatsappNumber}
      />
      <PersonalAdvice
        content={settings.content}
        whatsappNumber={settings.whatsappNumber}
      />
      <WhyOhreassa content={settings.content} />
      <Experience content={settings.content} />
      <Faq content={settings.content} />
      <FinalCta
        content={settings.content}
        whatsappNumber={settings.whatsappNumber}
      />
    </>
  );
}
