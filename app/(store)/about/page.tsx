import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { TrustBar } from "@/components/home/sections";
import { Experience, FinalCta } from "@/components/home/marketing";
import { getSettings } from "@/sanity/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return pageMetadata(settings, {
    title: "Our story",
    description: settings.aboutText,
    path: "/about",
  });
}
export default async function AboutPage() {
  const settings = await getSettings();
  return (
    <>
      <section className="container about-hero">
        <div>
          <div className="eyebrow">
            HELLO. WE’RE {settings.name.toUpperCase()}.
          </div>
          <h1>
            Reliable power.
            <br />
            <span className="orange-text">Made affordable.</span>
          </h1>
          <p>{settings.content.solution.description}</p>
          <Link href="/services" className="button button-orange">
            Explore our solutions <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="about-photo">
          <Image
            src="/images/home.webp"
            alt="Sunlight falling on a rooftop solar energy system"
            fill
            sizes="(max-width: 800px) 95vw, 50vw"
            preload
          />
        </div>
      </section>
      <TrustBar />
      <section className="section container about-story" data-reveal>
        <div>
          <div className="eyebrow">ROOTED IN REAL LIFE</div>
          <h2>{settings.content.approach.title}</h2>
        </div>
        <div>
          {settings.aboutText
            .split(/\n\s*\n/)
            .filter(Boolean)
            .map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          <Link href="/contact" className="text-link">
            Meet your local power partner <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
      <Experience content={settings.content} />
      <FinalCta
        content={settings.content}
        whatsappNumber={settings.whatsappNumber}
      />
    </>
  );
}
