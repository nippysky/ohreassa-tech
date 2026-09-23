import "server-only";
import { createClient } from "@sanity/client";
import { apiVersion, dataset, isSanityConfigured, projectId } from "../env";

export function getSanityClient() {
  if (!isSanityConfigured) return null;
  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    perspective: "published",
    timeout: 8000,
    maxRetries: 1,
  });
}
