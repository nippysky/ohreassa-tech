import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { InstagramIcon as Instagram } from "@/components/ui/instagram-icon";
import { cacheLife } from "next/cache";
import { whatsappContact, type StoreSettings } from "@/lib/store";
import type { Category } from "@/lib/commerce/types";

export async function Footer({
  settings,
  categories,
}: {
  settings: StoreSettings;
  categories: Category[];
}) {
  "use cache";
  cacheLife("days");
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Link href="/">
              <Image
                src={settings.logo?.url || "/brand/logo-optimized.png"}
                alt={settings.logo?.alt || settings.name}
                width={220}
                height={55}
              />
            </Link>
            {settings.tagline && (
              <p className="preserve-lines">{settings.tagline}</p>
            )}
            {settings.instagramUrl && (
              <a
                className="social-link"
                href={settings.instagramUrl}
                target="_blank"
                rel="noreferrer"
              >
                <Instagram size={18} />
                Follow our journey <ArrowUpRight size={14} />
              </a>
            )}
          </div>
          <div>
            <h3>Find your power</h3>
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/shop?category=${encodeURIComponent(c.slug)}`}
              >
                {c.name}
              </Link>
            ))}
            <Link href="/shop">All products</Link>
          </div>
          <div>
            <h3>Here to help</h3>
            <Link href="/services">Solar solutions</Link>
            <Link href="/services#installation">Installation & support</Link>
            <Link href="/about">About us</Link>
            <Link href="/contact">Contact us</Link>
            <Link href="/contact#faq">Common questions</Link>
            <a href={whatsappContact(settings.whatsappNumber)}>WhatsApp us</a>
          </div>
          <div className="footer-contact">
            <h3>Let’s connect</h3>
            <a href={`tel:${settings.phone}`}>
              <Phone size={15} />
              {settings.phone}
            </a>
            <a href={`mailto:${settings.email}`}>
              <Mail size={15} />
              <span>{settings.email}</span>
            </a>
            <p>
              <MapPin size={17} />
              <span>{settings.address}</span>
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} {settings.name}. All rights reserved.
          </span>
          <div>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms & ordering</Link>
            <span>
              Made for a brighter everyday <span className="orange-dot" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
