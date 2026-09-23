import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { getSettings } from "@/sanity/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return pageMetadata(settings, {
    title: "Privacy notice",
    description: `How ${settings.name} handles cart information, guest checkout details and WhatsApp order requests. Read our privacy notice.`,
    path: "/privacy",
  });
}
export default async function PrivacyPage() {
  const settings = await getSettings();
  return (
    <article className="container legal-page">
      <div className="eyebrow">YOUR INFORMATION</div>
      <h1>Privacy, in plain language.</h1>
      <p>
        This notice explains how this storefront handles your details when you
        browse and prepare an order with {settings.name}.
      </p>
      <h2>What the website uses</h2>
      <p>
        Your cart’s product identifiers and quantities are saved in your
        browser’s local storage so the cart remains available when you return.
        Clearing the cart removes those saved selections. Your name, phone
        number and address are not stored in local storage.
      </p>
      <h2>Preparing an order</h2>
      <p>
        When you review your order, your contact and delivery details are sent
        securely to the website server to validate the request and create your
        WhatsApp message. The application does not save order requests to a
        database or log those details. Hosting providers may process technical
        request information needed to operate the website.
      </p>
      <h2>Continuing to WhatsApp</h2>
      <p>
        Continuing to WhatsApp transfers the prefilled order message, including
        your supplied details, to WhatsApp. The message is included in the
        WhatsApp link, which may be retained in your browser history. Review the
        information before continuing, particularly on shared devices. Pressing
        Send shares it with {settings.name} so our team can arrange your order.
        WhatsApp’s own privacy terms apply on its service.
      </p>
      <h2>Shopping services</h2>
      <p>
        Sanity supplies product content and images. Vercel hosts the deployed
        website. This storefront does not include advertising trackers or
        collect online card details. Normal server logs and browser storage may
        still be used to deliver and secure the service.
      </p>
      <h2>Your requests</h2>
      <p>
        For questions about information shared with {settings.name}, or to
        request access, correction or deletion, contact{" "}
        <a href={`mailto:${settings.email}`}>{settings.email}</a>. The team will
        explain any records it needs to retain to fulfil orders or meet
        applicable obligations.
      </p>
    </article>
  );
}
