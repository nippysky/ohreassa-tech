import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Building2,
  Home,
  LampDesk,
  MessageCircle,
  Sun,
} from "lucide-react";
import { whatsappContact } from "@/lib/store";
import type { WebsiteContent } from "@/lib/site-content";

type ContentProps = { content: WebsiteContent; whatsappNumber: string };

export function PowerStory({ content, whatsappNumber }: ContentProps) {
  return (
    <section className="section container power-story" data-reveal>
      <div className="power-challenge">
        <div className="eyebrow">A FAMILIAR CHALLENGE</div>
        <h2>{content.problem.title}</h2>
        <p>{content.problem.description}</p>
        <div className="power-concern">
          <span>AND WHEN YOU DECIDE TO GO SOLAR…</span>
          <strong>“{content.problem.concern}”</strong>
        </div>
        <p>{content.problem.reassurance}</p>
      </div>
      <div className="power-answer">
        <Sun size={34} strokeWidth={1.2} />
        <div className="eyebrow">A BETTER WAY FORWARD</div>
        <h2>{content.solution.title}</h2>
        <p>{content.solution.description}</p>
        <p>{content.solution.detail}</p>
        <a
          className="text-link"
          href={whatsappContact(
            whatsappNumber,
            "Hello! I’d like help finding a solar solution for my needs and budget.",
          )}
        >
          Find my solar solution <ArrowUpRight size={18} />
        </a>
      </div>
    </section>
  );
}

export function SolarSolutions({
  content,
  whatsappNumber,
  detailed = false,
}: ContentProps & { detailed?: boolean }) {
  const icons = [Home, Building2, LampDesk];
  if (!content.solutions.items.length) return null;
  return (
    <section className="solutions-section" id="solutions" data-reveal>
      <div className="container section">
        <div className="section-heading marketing-heading">
          <div>
            <div className="eyebrow">SOLAR THAT FITS YOUR LIFE</div>
            <h2>{content.solutions.title}</h2>
          </div>
          <p>{content.solutions.description}</p>
        </div>
        <div className="solutions-grid">
          {content.solutions.items.map((item, index) => {
            const Icon = icons[index % icons.length];
            return (
              <article className="solution-item" key={item._key}>
                <div className="solution-top">
                  <Icon size={30} strokeWidth={1.3} />
                  <span>{String(index + 1).padStart(2, "0")}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <a
                  className="text-link"
                  href={whatsappContact(
                    whatsappNumber,
                    `Hello! I’d like to discuss your solar solutions: ${item.title.toLowerCase()}.`,
                  )}
                >
                  Let’s talk <ArrowUpRight size={17} />
                </a>
              </article>
            );
          })}
        </div>
        {!detailed && (
          <div className="solutions-footer">
            <span>
              Expert advice. Professional installation. Ongoing support.
            </span>
            <Link href="/services" className="text-link">
              Explore solar solutions <ArrowUpRight size={18} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export function PersonalAdvice({ content, whatsappNumber }: ContentProps) {
  return (
    <section className="lifestyle-section" data-reveal>
      <div className="container lifestyle-grid">
        <div className="lifestyle-image">
          <Image
            src="/images/home.webp"
            alt="A rooftop solar system capturing sunlight for a home"
            fill
            sizes="(max-width: 800px) 100vw, 50vw"
          />
          <div className="lifestyle-image-tag">
            <Sun size={18} />
            Power for the way you live.
          </div>
        </div>
        <div className="lifestyle-copy advice-copy">
          <div className="eyebrow">BUILT AROUND YOU</div>
          <h2>{content.approach.title}</h2>
          <p>{content.approach.description}</p>
          <p>{content.approach.detail}</p>
          <strong>{content.approach.reassurance}</strong>
          <a href={whatsappContact(whatsappNumber)} className="text-link">
            Talk to a solar expert <ArrowUpRight size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}

export function WhyOhreassa({ content }: { content: WebsiteContent }) {
  return (
    <section className="section container why-section" data-reveal>
      <div className="section-heading marketing-heading">
        <div>
          <div className="eyebrow">THE OHREASSA DIFFERENCE</div>
          <h2>{content.benefits.title}</h2>
        </div>
        <p>{content.benefits.description}</p>
      </div>
      <div className="benefits-grid">
        {content.benefits.items.map((item, index) => (
          <article key={item._key}>
            <span className="benefit-number">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function Experience({ content }: { content: WebsiteContent }) {
  return (
    <section className="experience-section" data-reveal>
      <div className="container experience-grid">
        <div>
          <div className="eyebrow">EXPERIENCE YOU CAN BUILD ON</div>
          <h2>{content.experience.title}</h2>
          <p>{content.experience.description}</p>
          <p>{content.experience.detail}</p>
        </div>
        <dl className="experience-stats">
          {content.experience.items.map((item) => (
            <div key={item._key}>
              <dt>{item.description}</dt>
              <dd>{item.title}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export function FinalCta({ content, whatsappNumber }: ContentProps) {
  return (
    <section className="container final-section" data-reveal>
      <div className="final-cta">
        <div className="final-copy">
          <div className="eyebrow">YOUR NEXT CHAPTER, POWERED</div>
          <h2>{content.finalCta.title}</h2>
          <p>{content.finalCta.description}</p>
          <div className="final-actions">
            <Link href="/shop" className="button button-orange">
              Shop solar products <ArrowUpRight size={18} />
            </Link>
            <a href={whatsappContact(whatsappNumber)} className="text-link">
              <MessageCircle size={18} />
              Talk to an expert
            </a>
          </div>
        </div>
        <div className="final-signature" aria-hidden="true">
          <Sun size={80} strokeWidth={0.7} />
          <span>{content.finalCta.reassurance}</span>
        </div>
      </div>
    </section>
  );
}
