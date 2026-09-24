import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowDown, ArrowUpRight, Sun } from "lucide-react";
import { SolarSolutions, FinalCta } from "@/components/home/marketing";
import { StructuredData } from "@/components/structured-data";
import { breadcrumbJsonLd, pageMetadata, socialImage } from "@/lib/seo";
import { siteUrl, whatsappContact } from "@/lib/store";
import { getSettings } from "@/sanity/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return pageMetadata(settings, {
    title: "Solar solutions & professional installation",
    description: settings.content.services.description,
    path: "/services",
    shareImage: {
      ...socialImage(settings),
      url: `${socialImage(settings).url}&page=services`,
      alt: `${settings.content.services.title} | ${settings.name}`,
    },
  });
}

export default async function ServicesPage() {
  const settings = await getSettings();
  const { content, whatsappNumber } = settings;
  return (
    <>
      <StructuredData
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Solar solutions & services", path: "/services" },
        ])}
      />
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: content.services.items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: {
              "@type": "Service",
              name: item.title,
              description: item.description,
              url: `${siteUrl()}/services#service-${item._key}`,
              areaServed: { "@type": "Country", name: "Nigeria" },
              provider: {
                "@type": "Organization",
                name: settings.name,
                url: siteUrl(),
                telephone: settings.phone,
              },
            },
          })),
        }}
      />
      <section className="container services-hero">
        <div className="services-hero-copy">
          <div className="breadcrumbs">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Services</span>
          </div>
          <div className="eyebrow">SOLAR SOLUTIONS & SERVICES</div>
          <h1>{content.services.title}</h1>
          <p>{content.services.description}</p>
          <a
            href={whatsappContact(
              whatsappNumber,
              "Hello! I’d like to discuss a solar solution and installation for my home or business.",
            )}
            className="button button-orange"
          >
            Find my solar solution <ArrowUpRight size={18} />
          </a>
          <a href="#installation" className="services-jump">
            Discover our services <ArrowDown size={16} />
          </a>
        </div>
        <div className="services-photo">
          <Image
            src="/images/home.webp"
            alt="Solar panels on a residential rooftop"
            fill
            sizes="(max-width: 800px) 90vw, 50vw"
            preload
          />
          <div className="services-photo-note">
            <Sun size={25} strokeWidth={1.3} />
            <span>
              Good advice.
              <br />
              Dependable power.
            </span>
          </div>
        </div>
      </section>
      <SolarSolutions
        content={content}
        whatsappNumber={whatsappNumber}
        detailed
      />
      <section
        className="section container service-offerings"
        id="installation"
        data-reveal
      >
        <div className="section-heading marketing-heading">
          <div>
            <div className="eyebrow">FROM FIRST QUESTION TO EVERYDAY POWER</div>
            <h2>
              Expert help.
              <br />
              Every step of the way.
            </h2>
          </div>
          <p>{content.approach.reassurance}</p>
        </div>
        <div className="service-list">
          {content.services.items.map((item, index) => (
            <article key={item._key} id={`service-${item._key}`}>
              <span className="service-number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3>{item.title}</h3>
              <div>
                <p>{item.description}</p>
                <a
                  className="text-link"
                  href={whatsappContact(
                    whatsappNumber,
                    `Hello! I’d like to enquire about ${item.title.toLowerCase()}.`,
                  )}
                >
                  Discuss this service <ArrowUpRight size={17} />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
      <FinalCta content={content} whatsappNumber={whatsappNumber} />
    </>
  );
}
