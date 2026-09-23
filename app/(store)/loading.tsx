export default function Loading() {
  return (
    <div
      className="container loading-page"
      role="status"
      aria-label="Loading page"
    >
      <div className="skeleton skeleton-eyebrow" />
      <div className="skeleton skeleton-title" />
      <div className="skeleton-grid">
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton skeleton-card" />
        ))}
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
