import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BatteryCharging,
  Headphones,
  MessageCircle,
  Package,
  ShieldCheck,
} from "lucide-react";
import type { WebsiteContent } from "@/lib/site-content";
import type { Category } from "@/lib/commerce/types";

export function TrustBar() {
  return (
    <section className="trust-bar">
      <div className="container trust-grid">
        {[
          {
            icon: ShieldCheck,
            title: "Genuine products",
            text: "Chosen with care",
          },
          {
            icon: BatteryCharging,
            title: "Built around your life",
            text: "Home, business & beyond",
          },
          {
            icon: Headphones,
            title: "Real people. Real support.",
            text: "Talk to our team",
          },
          {
            icon: MessageCircle,
            title: "Easy WhatsApp ordering",
            text: "A conversation away",
          },
        ].map(({ icon: Icon, title, text }) => (
          <div key={title}>
            <Icon size={25} strokeWidth={1.4} />
            <span>
              <strong>{title}</strong>
              <small>{text}</small>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Collections({
  categories,
  content,
}: {
  categories: Category[];
  content: WebsiteContent;
}) {
  const collections = categories.filter((category) => category.featured);

  return (
    <section className="section container" id="collections" data-reveal>
      <div className="section-heading">
        <div>
          <div className="eyebrow">THE BUILDING BLOCKS OF BETTER POWER</div>
          <h2>{content.products.title}</h2>
          <p className="collection-intro">{content.products.description}</p>
        </div>
        <Link className="text-link" href="/shop">
          Shop all products <ArrowUpRight size={18} />
        </Link>
      </div>
      {collections.length ? (
        <div className="collection-grid">
          {collections.map((collection, i) => (
            <Link
              href={`/shop?category=${encodeURIComponent(collection.slug)}`}
              key={collection.slug}
              className={`collection-card collection-${i % 3}`}
            >
              <div className="collection-top">
                <span className="collection-number">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="circle-arrow">
                  <ArrowUpRight size={21} />
                </span>
              </div>
              <div className="collection-image">
                {collection.image?.url ? (
                  <Image
                    src={collection.image.url}
                    alt={collection.image.alt || collection.name}
                    fill
                    sizes="(max-width: 600px) 88vw, (max-width: 900px) 45vw, 380px"
                  />
                ) : (
                  <Package
                    className="collection-placeholder"
                    size={72}
                    strokeWidth={1}
                  />
                )}
              </div>
              <div className="collection-bottom">
                {collection.eyebrow && (
                  <span className="eyebrow">{collection.eyebrow}</span>
                )}
                <h3>{collection.name}</h3>
                {collection.description && <p>{collection.description}</p>}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="product-range">
          {content.products.items.map((item, index) => (
            <article key={item._key}>
              <span className="range-number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export function Faq({ content }: { content: WebsiteContent }) {
  if (!content.faq.items.length) return null;
  return (
    <section className="faq-section container section" id="faq" data-reveal>
      <div>
        <div className="eyebrow">A LITTLE CLARITY</div>
        <h2>{content.faq.title}</h2>
        <p className="faq-intro">{content.faq.description}</p>
        <Link href="/contact" className="text-link">
          Still need a hand? <ArrowRight size={18} />
        </Link>
      </div>
      <div className="faq-list">
        {content.faq.items.map((item) => (
          <details key={item._key}>
            <summary>
              {item.title}
              <span aria-hidden="true">+</span>
            </summary>
            <p>{item.description}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
