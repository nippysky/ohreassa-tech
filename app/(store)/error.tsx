"use client";

import Link from "next/link";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <section className="container empty-state">
      <h1>A small interruption.</h1>
      <p>We couldn’t load this page. Please try again in a moment.</p>
      <div className="button-row">
        <button onClick={reset} className="button button-orange">
          Try again
        </button>
        <Link href="/contact" className="button button-outline">
          Contact our team
        </Link>
      </div>
    </section>
  );
}
