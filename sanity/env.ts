// These two identifiers are public by design. Never put a token in a NEXT_PUBLIC_ variable.
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion = "2026-09-01";
export const isSanityConfigured =
  /^[a-z0-9-]+$/.test(projectId) && /^[a-z0-9_-]+$/.test(dataset);
