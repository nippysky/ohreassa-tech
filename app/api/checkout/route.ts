import { randomUUID } from "node:crypto";
import { checkoutRequestSchema } from "@/lib/commerce/validation";
import {
  buildQuote,
  CommerceError,
  normalizeItems,
} from "@/lib/commerce/pricing";
import { whatsappProvider } from "@/lib/commerce/whatsapp";
import { getFreshProducts, getFreshSettings } from "@/sanity/lib/data";
import { privateJson, readJson } from "@/lib/http";

export async function POST(request: Request) {
  try {
    const parsed = checkoutRequestSchema.safeParse(await readJson(request));
    if (!parsed.success)
      return privateJson(
        {
          error:
            "Please check your name, phone number, delivery details and consent.",
        },
        400,
      );
    const items = normalizeItems(parsed.data.items);
    const [products, settings] = await Promise.all([
      getFreshProducts(items.map((i) => i.productId)),
      getFreshSettings(),
    ]);
    const quote = buildQuote(items, products);
    const reference = `OHR-${randomUUID().slice(0, 8).toUpperCase()}`;
    return privateJson(
      whatsappProvider.createCheckout({
        quote,
        customer: parsed.data.customer,
        settings,
        reference,
      }),
    );
  } catch (error) {
    if (error instanceof CommerceError)
      return privateJson({ error: error.message }, 409);
    // Never log request bodies or customer information.
    return privateJson(
      {
        error:
          "We couldn’t prepare your order. Please try again or contact us directly.",
      },
      503,
    );
  }
}
