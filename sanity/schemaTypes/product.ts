import { defineArrayMember, defineField, defineType } from "sanity";

const imageFields = [
  defineField({
    name: "alt",
    title: "Image description",
    type: "string",
    description: "Describe this particular product photo for accessibility.",
    validation: (r) => r.required().max(160),
  }),
];

export const product = defineType({
  name: "product",
  title: "Products",
  type: "document",
  groups: [
    { name: "details", title: "Product details", default: true },
    { name: "pricing", title: "Prices & discounts" },
    { name: "inventory", title: "Availability" },
    { name: "seo", title: "Search & sharing" },
  ],
  fields: [
    defineField({ name: "seo", type: "seo", group: "seo" }),
    defineField({
      name: "name",
      title: "Product name",
      type: "string",
      group: "details",
      validation: (r) => r.required().max(120),
    }),
    defineField({
      name: "slug",
      type: "slug",
      group: "details",
      options: { source: "name", maxLength: 100 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "sku",
      title: "Model / SKU",
      type: "string",
      group: "details",
      validation: (r) => r.required().max(60),
    }),
    defineField({
      name: "category",
      type: "reference",
      to: [{ type: "category" }],
      group: "details",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "summary",
      title: "Short description",
      type: "text",
      rows: 2,
      group: "details",
      validation: (r) => r.required().max(220),
    }),
    defineField({
      name: "description",
      title: "Full description",
      type: "text",
      rows: 8,
      group: "details",
      validation: (r) => r.required().max(8000),
    }),
    defineField({
      name: "mainImage",
      title: "Main product picture",
      type: "image",
      group: "details",
      options: { hotspot: true },
      fields: imageFields,
      validation: (r) => r.required().assetRequired(),
      description:
        "Required. This product’s cover photo appears in the shop, cart and first on its details page.",
    }),
    defineField({
      name: "gallery",
      title: "Additional product pictures",
      type: "array",
      group: "details",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: imageFields,
          validation: (r) => r.required().assetRequired(),
        }),
      ],
      validation: (r) => r.max(7),
      description:
        "Optional. Add up to seven extra angles or detail photos for this product. Drag to reorder the thumbnails shown after its main picture.",
    }),
    defineField({
      name: "specifications",
      type: "array",
      group: "details",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "label",
              type: "string",
              validation: (r) => r.required().max(60),
            }),
            defineField({
              name: "value",
              type: "string",
              validation: (r) => r.required().max(160),
            }),
          ],
          preview: { select: { title: "label", subtitle: "value" } },
        }),
      ],
    }),
    defineField({
      name: "warrantyMonths",
      title: "Warranty (months)",
      type: "number",
      group: "details",
      description:
        "Use the current approved warranty for this product; do not assume.",
      validation: (r) => r.integer().min(0).max(120),
    }),
    defineField({
      name: "price",
      title: "Regular unit price (₦)",
      type: "number",
      group: "pricing",
      description:
        "Enter naira, e.g. 500000. Checkout converts to integer kobo.",
      validation: (r) => r.required().positive().precision(2).max(1000000000),
    }),
    defineField({
      name: "salePrice",
      title: "Sale unit price (₦)",
      type: "number",
      group: "pricing",
      validation: (r) =>
        r
          .positive()
          .precision(2)
          .custom(
            (value, ctx) =>
              value == null ||
              value < Number(ctx.document?.price) ||
              "Sale price must be below the regular price.",
          ),
    }),
    defineField({
      name: "saleStartsAt",
      title: "Sale starts",
      type: "datetime",
      group: "pricing",
      description: "Optional. Blank means the sale can start immediately.",
    }),
    defineField({
      name: "saleEndsAt",
      title: "Sale ends",
      type: "datetime",
      group: "pricing",
      description:
        "Optional. Enter an end date to automatically stop the sale.",
      validation: (r) =>
        r.custom(
          (value, ctx) =>
            !value ||
            !ctx.document?.saleStartsAt ||
            Date.parse(value) > Date.parse(String(ctx.document.saleStartsAt)) ||
            "The end must be after the start.",
        ),
    }),
    defineField({
      name: "quantityPrices",
      title: "Bulk unit prices",
      type: "array",
      group: "pricing",
      description:
        "Per product, not across the cart. The confirmed bulk threshold is 6 units. The lowest eligible sale or bulk price wins; discounts never stack.",
      of: [
        defineArrayMember({
          name: "quantityPrice",
          type: "object",
          fields: [
            defineField({
              name: "minimumQuantity",
              title: "Minimum quantity",
              type: "number",
              initialValue: 6,
              validation: (r) => r.required().integer().min(2).max(99),
            }),
            defineField({
              name: "unitPrice",
              title: "Unit price (₦)",
              type: "number",
              validation: (r) =>
                r
                  .required()
                  .positive()
                  .precision(2)
                  .custom(
                    (value, ctx) =>
                      value == null ||
                      value <= Number(ctx.document?.price) ||
                      "Bulk price must not exceed the regular price.",
                  ),
            }),
          ],
          preview: {
            select: { quantity: "minimumQuantity", price: "unitPrice" },
            prepare({ quantity, price }) {
              return {
                title: `${quantity}+ units`,
                subtitle: `₦${Number(price).toLocaleString("en-NG")} per unit`,
              };
            },
          },
        }),
      ],
      validation: (r) =>
        r.custom((tiers) => {
          const quantities = (tiers || []).map(
            (tier) => (tier as { minimumQuantity?: number }).minimumQuantity,
          );
          return (
            new Set(quantities).size === quantities.length ||
            "Each minimum quantity must be unique."
          );
        }),
    }),
    defineField({
      name: "active",
      title: "Show in store",
      type: "boolean",
      initialValue: false,
      group: "inventory",
      description: "Enable when details and prices are ready, then publish.",
    }),
    defineField({
      name: "featured",
      title: "Feature on homepage",
      type: "boolean",
      initialValue: false,
      group: "inventory",
    }),
    defineField({
      name: "stockStatus",
      title: "Availability",
      type: "string",
      initialValue: "inStock",
      options: {
        list: [
          { title: "In stock", value: "inStock" },
          { title: "Pre-order", value: "preorder" },
          { title: "Out of stock", value: "outOfStock" },
        ],
        layout: "radio",
      },
      group: "inventory",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "stockQuantity",
      title: "Available quantity",
      type: "number",
      group: "inventory",
      description:
        "Optional. Limits each order request. WhatsApp requests do not reserve or decrement stock. Leave blank for availability confirmed by the team.",
      validation: (r) => r.integer().min(0),
    }),
  ],
  preview: { select: { title: "name", subtitle: "sku", media: "mainImage" } },
});
