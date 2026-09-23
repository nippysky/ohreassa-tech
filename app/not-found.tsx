import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container empty-state">
      <div className="eyebrow">404 · A LITTLE OFF THE GRID</div>
      <h1>Let’s get you back to good energy.</h1>
      <p>This page has moved or doesn’t exist.</p>
      <Link href="/" className="button button-orange">
        Back to home
      </Link>
    </main>
  );
}
