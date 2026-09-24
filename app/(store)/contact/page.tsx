import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { ArrowUpRight, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { InstagramIcon as Instagram } from "@/components/ui/instagram-icon";
import { getSettings } from "@/sanity/lib/data";
import { whatsappContact } from "@/lib/store";
import { Faq } from "@/components/home/sections";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return pageMetadata(settings, {
    title: "Contact our team",
    description: `Contact ${settings.name} for product advice, availability, bulk orders, pickup, delivery and support. Chat with our team on WhatsApp.`,
    path: "/contact",
  });
}
export default async function ContactPage() {
  const settings = await getSettings();
  return (
    <>
      <section className="container contact-section">
        <div className="eyebrow">REAL PEOPLE. GOOD ENERGY.</div>
        <h1>
          Let’s power
          <br />
          what’s next<span className="orange-text">.</span>
        </h1>
        <p className="contact-intro">
          Solar products, professional installation, or help choosing a system.
          <br />
          Our team is here to help you take the next step.
        </p>
        <div className="contact-grid">
          <a
            className="contact-card contact-primary"
            href={whatsappContact(settings.whatsappNumber)}
          >
            <MessageCircle size={31} />
            <h2>Start a conversation.</h2>
            <p>
              For product guidance, orders and support, message our team on
              WhatsApp.
            </p>
            <span>
              +{settings.whatsappNumber}
              <ArrowUpRight size={24} />
            </span>
          </a>
          <div className="contact-card">
            <Phone size={25} />
            <h2>Give us a call.</h2>
            <a href={`tel:${settings.phone}`}>{settings.phone}</a>
            {settings.alternatePhone && (
              <a href={`tel:${settings.alternatePhone}`}>
                {settings.alternatePhone}
              </a>
            )}
            <div className="contact-email">
              <Mail size={20} />
              <a href={`mailto:${settings.email}`}>{settings.email}</a>
            </div>
          </div>
          <div className="contact-card">
            <MapPin size={27} />
            <h2>Come say hello.</h2>
            <p>{settings.address}</p>
            <a
              className="text-link"
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address)}`}
              target="_blank"
              rel="noreferrer"
            >
              Get directions <ArrowUpRight size={17} />
            </a>
            <small className="preserve-lines">
              {settings.openingHours ||
                "Please contact us to confirm your visit."}
            </small>
          </div>
        </div>
        {settings.instagramUrl && (
          <a
            className="instagram-strip"
            href={settings.instagramUrl}
            target="_blank"
            rel="noreferrer"
          >
            <Instagram size={22} />
            <span>Follow {settings.name} on Instagram.</span>
            <ArrowUpRight size={21} />
          </a>
        )}
      </section>
      <Faq content={settings.content} />
    </>
  );
}
