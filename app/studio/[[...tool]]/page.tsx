import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import Link from "next/link";
import { isSanityConfigured } from "@/sanity/env";
import Studio from "./studio";

export const metadata: Metadata = {
  title: "Store management",
  description:
    "Manage the store’s products, categories, prices and business details.",
  robots: { index: false, follow: false },
};

async function StoreEditor() {
  // Studio's authenticated catch-all routes are resolved for each request.
  await connection();
  return <Studio />;
}

export default function StudioPage() {
  if (!isSanityConfigured)
    return (
      <main className="setup-page">
        <div className="eyebrow">OHREASSA · STORE MANAGEMENT</div>
        <h1>Your store’s control room.</h1>
        <p>
          Connect a Sanity project to manage products, prices and store details.
        </p>
        <ol>
          <li>
            Create your project at{" "}
            <a
              href="https://www.sanity.io/manage"
              target="_blank"
              rel="noreferrer"
            >
              sanity.io/manage
            </a>{" "}
            and a production dataset.
          </li>
          <li>
            Set <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> and{" "}
            <code>NEXT_PUBLIC_SANITY_DATASET</code> in your local environment
            and Vercel.
          </li>
          <li>Add this website’s origin under Sanity → API → CORS origins.</li>
          <li>
            Restart the website, then sign in here with your Sanity account.
          </li>
        </ol>
        <p>No products are created automatically.</p>
        <Link className="button button-dark" href="/">
          Back to storefront
        </Link>
      </main>
    );
  return (
    <Suspense
      fallback={
        <main className="setup-page" aria-busy="true">
          <p>Loading store editor…</p>
        </main>
      }
    >
      <StoreEditor />
    </Suspense>
  );
}
