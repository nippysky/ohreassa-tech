// Product cards and the detail-page introduction reuse the single authored description.
export function productExcerpt(description: string, limit = 160) {
  const text = description.replace(/\s+/g, " ").trim();
  if (text.length <= limit) return text;
  const shortened = text.slice(0, limit - 1);
  const wordEnd = shortened.lastIndexOf(" ");
  return `${wordEnd > 0 ? shortened.slice(0, wordEnd) : shortened}…`;
}
