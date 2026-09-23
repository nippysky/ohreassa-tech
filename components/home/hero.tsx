import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BatteryCharging,
  Check,
  MessageCircle,
  Sun,
} from "lucide-react";
import { whatsappContact } from "@/lib/store";

export function Hero({ whatsappNumber }: { whatsappNumber: string }) {
  return (
    <section className="hero">
      <div className="container hero-grid">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="orange-dot" /> ENERGY FOR WHAT MATTERS
          </div>
          <h1>
            Life moves.
            <br />
            Keep it
            <br />
            <span>powered.</span>
            <span className="heading-spark" aria-hidden="true">
              ✳
            </span>
          </h1>
          <p>
            From the first light to the last task. Discover reliable solar and
            energy solutions for your home, your business, and everything in
            between.
          </p>
          <div className="hero-actions">
            <Link href="/shop" className="button button-orange">
              Find your power <ArrowUpRight size={19} />
            </Link>
            <a className="text-link" href={whatsappContact(whatsappNumber)}>
              <MessageCircle size={18} />
              Talk to an expert
            </a>
          </div>
          <div className="hero-footnote">
            <span>
              <Check size={14} />
              Genuine products
            </span>
            <span>
              <Check size={14} />
              Local support, real people
            </span>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-orbit orbit-one" />
          <div className="hero-orbit orbit-two" />
          <div className="hero-sun" />
          <div className="hero-visual-caption">
            <Sun size={17} />
            <span>
              BETTER ENERGY.
              <br />
              BRIGHTER POSSIBILITIES.
            </span>
          </div>
          <div className="hero-product">
            <Image
              src="/images/hero-battery.webp"
              alt="Ohreassa standing lithium battery energy storage system"
              fill
              sizes="(max-width: 700px) 78vw, 510px"
              preload
            />
          </div>
          <div className="energy-label">
            <span className="energy-icon">
              <BatteryCharging size={24} />
            </span>
            <div>
              <strong>Power you can count on.</strong>
              <span>Ready for your everyday.</span>
            </div>
            <span className="status-dot" />
          </div>
          <Link href="/shop" className="hero-collection-link">
            <span>Explore the collection</span>
            <ArrowRight size={20} />
          </Link>
          <span className="hero-side-label">ENERGY FOR YOUR EVERYDAY</span>
        </div>
      </div>
    </section>
  );
}
