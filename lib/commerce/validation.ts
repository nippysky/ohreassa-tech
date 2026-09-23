import { z } from "zod";
import { MAX_CART_LINES, MAX_QUANTITY } from "./pricing";

const text = (min: number, max: number) =>
  z
    .string()
    .trim()
    .min(min)
    .max(max)
    .refine(
      (s) => !/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(s),
      "Please remove unsupported characters.",
    );
export const cartItemSchema = z
  .object({
    productId: z
      .string()
      .min(1)
      .max(128)
      .regex(/^[a-zA-Z0-9_.-]+$/),
    quantity: z.number().int().min(1).max(MAX_QUANTITY),
  })
  .strict();
export const quoteRequestSchema = z
  .object({ items: z.array(cartItemSchema).min(1).max(MAX_CART_LINES) })
  .strict();
export const customerSchema = z
  .object({
    name: text(2, 100),
    phone: text(7, 24)
      .regex(/^\+?[\d ()-]+$/, "Enter a valid phone number.")
      .refine((s) => {
        const n = s.replace(/\D/g, "");
        return n.length >= 10 && n.length <= 15;
      }, "Enter a phone number with 10–15 digits."),
    fulfillment: z.enum(["delivery", "pickup"]),
    address: text(0, 240),
    city: text(0, 80),
    state: text(0, 60),
    notes: text(0, 400),
    consent: z.literal(true),
  })
  .strict()
  .superRefine((value, ctx) => {
    if (value.fulfillment === "delivery") {
      for (const key of ["address", "city", "state"] as const) {
        if (value[key].length < 2)
          ctx.addIssue({
            code: "custom",
            path: [key],
            message: "Please complete your delivery address, city and state.",
          });
      }
    }
  });
export const checkoutRequestSchema = quoteRequestSchema.extend({
  customer: customerSchema,
});
