import { quoteRequestSchema } from "@/lib/commerce/validation";
import {
  buildQuote,
  CommerceError,
  normalizeItems,
} from "@/lib/commerce/pricing";
import { getFreshProducts } from "@/sanity/lib/data";
import { privateJson, readJson } from "@/lib/http";

export async function POST(request: Request) {
  try {
    const parsed = quoteRequestSchema.safeParse(await readJson(request));
    if (!parsed.success)
      return privateJson(
        { error: "Check your cart quantities and try again." },
        400,
      );
    const items = normalizeItems(parsed.data.items);
    return privateJson({
      quote: buildQuote(
        items,
        await getFreshProducts(items.map((i) => i.productId)),
      ),
    });
  } catch (error) {
    if (error instanceof CommerceError)
      return privateJson({ error: error.message }, 409);
    return privateJson(
      {
        error:
          "We couldn’t confirm current prices. Please try again or contact us on WhatsApp.",
      },
      503,
    );
  }
}
