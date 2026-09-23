import { CommerceError } from "./commerce/pricing";

export function privateJson(body: unknown, status = 200) {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store, max-age=0",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export async function readJson(
  request: Request,
  maximumBytes = 16_384,
): Promise<unknown> {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin)
    throw new CommerceError("Please submit your order from this website.");
  if (!request.headers.get("content-type")?.includes("application/json"))
    throw new CommerceError("Please send a valid order request.");
  const reader = request.body?.getReader();
  if (!reader) throw new CommerceError("The request is empty.");
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > maximumBytes) {
      await reader.cancel();
      throw new CommerceError(
        "This order is too large. Please contact us directly.",
      );
    }
    chunks.push(value);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw new CommerceError("Please send a valid order request.");
  }
}
