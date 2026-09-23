import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BatteryCharging,
  Headphones,
  MessageCircle,
  PackageCheck,
  Package,
  ShieldCheck,
  Sun,
  Zap,
} from "lucide-react";
import { whatsappContact } from "@/lib/store";
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

export function Collections({ categories }: { categories: Category[] }) {
  const collections = categories.filter((category) => category.featured);
  if (!collections.length) return null;
  return (
    <section className="section container" id="collections" data-reveal>
      <div className="section-heading">
        <div>
          <div className="eyebrow">ONE BRAND. EVERY POSSIBILITY.</div>
          <h2>Your power. Your way.</h2>
        </div>
        <Link className="text-link" href="/shop">
          Explore all products <ArrowUpRight size={18} />
        </Link>
      </div>
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
    </section>
  );
}

export function Lifestyle() {
  return (
    <section className="lifestyle-section" data-reveal>
      <div className="container lifestyle-grid">
        <div className="lifestyle-image">
          <Image
            src="/images/home.webp"
            alt="A home with rooftop solar panels capturing energy from the sun"
            fill
            sizes="(max-width: 800px) 100vw, 50vw"
          />
          <div className="lifestyle-image-tag">
            <Sun size={18} />A brighter way to live.
          </div>
        </div>
        <div className="lifestyle-copy">
          <div className="eyebrow">MORE THAN ELECTRICITY</div>
          <h2>
            Keep the lights on.
            <br />
            And the dreams
            <br />
            <span className="orange-text">moving.</span>
          </h2>
          <p>
            The workday that runs smoothly. The family movie night. The small
            business with big plans. We’re here for the moments that shouldn’t
            have to wait for power.
          </p>
          <div className="lifestyle-values">
            <span>
              <Zap size={18} />
              Energy for your everyday
            </span>
            <span>
              <ShieldCheck size={18} />
              Support beyond the purchase
            </span>
          </div>
          <Link href="/about" className="text-link">
            Get to know us <ArrowUpRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function HowItWorks({ whatsappNumber }: { whatsappNumber: string }) {
  return (
    <section className="section container" data-reveal>
      <div className="section-heading">
        <div>
          <div className="eyebrow">GOOD ENERGY. ZERO COMPLICATIONS.</div>
          <h2>A few clicks. A brighter day.</h2>
        </div>
        <p className="section-intro">
          From choosing your solution to talking to our team.
          <br />
          We keep it personal. And simple.
        </p>
      </div>
      <div className="steps-grid">
        {[
          {
            icon: Zap,
            title: "Find your fit",
            text: "Explore our power solutions. Check specifications and choose what works for you.",
          },
          {
            icon: PackageCheck,
            title: "Make it yours",
            text: "Add products and quantities to your cart. Eligible bulk prices apply automatically.",
          },
          {
            icon: MessageCircle,
            title: "Let’s make it happen",
            text: "Share your order on WhatsApp. Our team confirms availability, delivery and payment.",
          },
        ].map(({ icon: Icon, title, text }, i) => (
          <div className="step" key={title}>
            <div className="step-top">
              <Icon size={27} strokeWidth={1.5} />
              <span>0{i + 1}</span>
            </div>
            <h3>{title}</h3>
            <p>{text}</p>
          </div>
        ))}
      </div>
      <div className="support-strip">
        <div>
          <span className="support-icon">
            <Headphones size={29} strokeWidth={1.6} />
          </span>
          <span>
            <strong>A little guidance goes a long way.</strong>
            <p>
              Not sure where to start? Let’s find the right solution together.
            </p>
          </span>
        </div>
        <a
          href={whatsappContact(whatsappNumber)}
          className="button button-dark"
        >
          Talk to our team <ArrowUpRight size={18} />
        </a>
      </div>
    </section>
  );
}

export function Faq() {
  const faqs = [
    [
      "How do I place an order?",
      "Choose your products and quantities, then enter your name, phone number and delivery details at checkout. Review your order and continue to WhatsApp. Press Send in WhatsApp; our team will confirm availability, delivery costs and payment instructions.",
    ],
    [
      "Do you offer bulk pricing?",
      "Yes. Products with a published bulk rate qualify from the minimum quantity shown on the product page. The standard bulk threshold is 6 units of the same product. Different products do not combine to meet a threshold. If a sale is also active, the lower eligible unit price applies.",
    ],
    [
      "How is delivery arranged?",
      "Share your delivery address at checkout. Our team will confirm whether delivery is available to your location, the delivery fee and the expected timing on WhatsApp before you pay. You can also request collection from our store.",
    ],
    [
      "Can you help me choose a system?",
      "Absolutely. Tell our team which appliances you want to power and how you plan to use them. We’ll help you compare suitable options and confirm compatibility before you order.",
    ],
    [
      "What about warranty and after-sales support?",
      "Warranty details are listed on each product page. Contact our team directly for warranty assistance. Unauthorised opening, dismantling or repair can void the warranty; please speak to our team first.",
    ],
  ];
  return (
    <section className="faq-section container section" id="faq" data-reveal>
      <div>
        <div className="eyebrow">A LITTLE CLARITY</div>
        <h2>
          Good questions.
          <br />
          Straight answers.
        </h2>
        <Link href="/contact" className="text-link">
          Still need a hand? <ArrowRight size={18} />
        </Link>
      </div>
      <div className="faq-list">
        {faqs.map(([q, a]) => (
          <details key={q}>
            <summary>
              {q}
              <span aria-hidden="true">+</span>
            </summary>
            <p>{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
