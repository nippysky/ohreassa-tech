import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container empty-state">
      <h1>This product isn’t here.</h1>
      <p>It may have moved or may no longer be available.</p>
      <Link className="button button-orange" href="/shop">
        Explore the collection
      </Link>
    </div>
  );
}
