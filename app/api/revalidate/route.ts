import { timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { privateJson } from "@/lib/http";

export async function POST(request: Request) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  const provided =
    request.headers.get("authorization")?.replace(/^Bearer /, "") || "";
  if (!secret) return privateJson({ error: "Webhook not configured" }, 503);
  const expectedBytes = Buffer.from(secret);
  const providedBytes = Buffer.from(provided);
  if (
    expectedBytes.length !== providedBytes.length ||
    !timingSafeEqual(expectedBytes, providedBytes)
  )
    return privateJson({ error: "Unauthorized" }, 401);
  revalidateTag("catalog", { expire: 0 });
  revalidateTag("settings", { expire: 0 });
  return privateJson({ revalidated: true });
}
