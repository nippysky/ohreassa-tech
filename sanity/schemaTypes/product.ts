import {
  ALL_FIELDS_GROUP,
  defineArrayMember,
  defineField,
  defineType,
} from "sanity";

const imageFields = [
  defineField({
    name: "alt",
    title: "Describe this photo (optional)",
    type: "string",
    description:
      "Leave blank to use the product name. Add a description for a particular angle or detail if you wish.",
    validation: (r) => r.max(160),
  }),
];

export const product = defineType({
  name: "product",
  title: "Products",
  type: "document",
  groups: [
    { name: "details", title: "Product", default: true },
    { name: "pricing", title: "Discounts (optional)" },
    { name: "options", title: "More options" },
    { ...ALL_FIELDS_GROUP, hidden: true },
  ],
  fieldsets: [
    {
      name: "photos",
      title: "More photos (optional)",
      options: { collapsible: true, collapsed: true },
    },
    {
      name: "specifications",
      title: "Features & warranty (optional)",
      options: { collapsible: true, collapsed: true },
    },
    {
      name: "availability",
      title: "Availability (optional)",
      options: { collapsible: true, collapsed: true },
    },
    {
      name: "search",
      title: "Search & sharing (optional)",
      options: { collapsible: true, collapsed: true },
    },
    {
      name: "saleDates",
      title: "Schedule the discount (optional)",
      options: { collapsible: true, collapsed: true },
    },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Product name",
      type: "string",
      group: "details",
      validation: (r) => r.required().max(120),
    }),
    defineField({
      name: "price",
      title: "Price (₦)",
      type: "number",
      group: "details",
      description:
        "Price for one item in naira. Enter numbers only, for example 500000.",
      validation: (r) => r.required().positive().precision(2).max(1000000000),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 6,
      group: "details",
      description:
        "Tell customers about this product, what it does and what is included. This is the only description you need to write.",
      validation: (r) => r.required().max(8000),
    }),
    defineField({
      name: "mainImage",
      title: "Main photo",
      type: "image",
      group: "details",
      options: { hotspot: true },
      fields: imageFields,
      validation: (r) => r.required().assetRequired(),
      description: "Upload the photo customers should see first.",
    }),
    defineField({
      name: "category",
      title: "Category (optional)",
      type: "reference",
      to: [{ type: "category" }],
      group: "details",
      description:
        "Choose a category to help customers find this product. You can add it later.",
    }),
    defineField({
      name: "gallery",
      title: "Additional photos",
      type: "array",
      group: "details",
      fieldset: "photos",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: imageFields,
          validation: (r) => r.required().assetRequired(),
        }),
      ],
      validation: (r) => r.max(7),
      description: "Add up to seven extra photos. Drag to change their order.",
    }),
    defineField({
      name: "salePrice",
      title: "Discounted price (₦)",
      type: "number",
      group: "pricing",
      description: "Optional. Leave blank to sell at the normal price.",
      validation: (r) =>
        r
          .positive()
          .precision(2)
          .custom(
            (value, ctx) =>
              value == null ||
              value < Number(ctx.document?.price) ||
              "The discounted price must be lower than the normal price.",
          ),
    }),
    defineField({
      name: "saleStartsAt",
      title: "Start date",
      type: "datetime",
      group: "pricing",
      fieldset: "saleDates",
      description: "Leave blank to start the discount immediately.",
    }),
    defineField({
      name: "saleEndsAt",
      title: "End date",
      type: "datetime",
      group: "pricing",
      fieldset: "saleDates",
      description: "Leave blank to keep the discount until you remove it.",
      validation: (r) =>
        r.custom(
          (value, ctx) =>
            !value ||
            !ctx.document?.saleStartsAt ||
            Date.parse(value) > Date.parse(String(ctx.document.saleStartsAt)) ||
            "The end date must be after the start date.",
        ),
    }),
    defineField({
      name: "quantityPrices",
      title: "Bulk discounts (optional)",
      type: "array",
      group: "pricing",
      description:
        "Only add this if buying several of this product gives a lower price per item. The usual offer starts at 6 items. Customers get the best available discount.",
      of: [
        defineArrayMember({
          name: "quantityPrice",
          type: "object",
          fields: [
            defineField({
              name: "minimumQuantity",
              title: "Buy at least this many",
              type: "number",
              initialValue: 6,
              validation: (r) => r.required().integer().min(2).max(99),
            }),
            defineField({
              name: "unitPrice",
              title: "Price per item (₦)",
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
                      "The bulk price must not be higher than the normal price.",
                  ),
            }),
          ],
          preview: {
            select: { quantity: "minimumQuantity", price: "unitPrice" },
            prepare({ quantity, price }) {
              return {
                title: `${quantity}+ items`,
                subtitle: `₦${Number(price).toLocaleString("en-NG")} per item`,
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
            "Use a different minimum quantity for each bulk discount."
          );
        }),
    }),
    defineField({
      name: "active",
      title: "Show in store",
      type: "boolean",
      initialValue: true,
      group: "details",
      description:
        "On by default for new products. Click Publish when ready. Turn off to hide a product without deleting it.",
    }),
    defineField({
      name: "featured",
      title: "Feature on homepage",
      type: "boolean",
      initialValue: false,
      group: "options",
      description: "Optional. Highlight this product on the homepage.",
    }),
    defineField({
      name: "stockStatus",
      title: "Availability",
      type: "string",
      initialValue: "inStock",
      group: "options",
      fieldset: "availability",
      options: {
        list: [
          { title: "Available to order", value: "inStock" },
          { title: "Pre-order", value: "preorder" },
          { title: "Out of stock", value: "outOfStock" },
        ],
        layout: "radio",
      },
      description:
        "Optional. Products are available to order unless you choose otherwise.",
    }),
    defineField({
      name: "stockQuantity",
      title: "Available quantity",
      type: "number",
      group: "options",
      fieldset: "availability",
      description:
        "Optional. Leave blank if you confirm stock with the customer. If filled in, this limits the quantity in each order request.",
      validation: (r) => r.integer().min(0),
    }),
    defineField({
      name: "specifications",
      title: "Extra product details",
      type: "array",
      group: "options",
      fieldset: "specifications",
      description:
        "Optional. Add details such as capacity or dimensions if they are useful.",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Detail name",
              type: "string",
              validation: (r) => r.required().max(60),
            }),
            defineField({
              name: "value",
              title: "Value",
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
      title: "Warranty in months",
      type: "number",
      group: "options",
      fieldset: "specifications",
      description:
        "Optional. Only enter the confirmed warranty for this product.",
      validation: (r) => r.integer().min(0).max(120),
    }),
    defineField({
      name: "slug",
      title: "Custom page link",
      type: "slug",
      group: "options",
      fieldset: "search",
      options: { source: "name", maxLength: 100 },
      description:
        "Optional. A working product link is provided automatically. Use Generate only if you want a link based on the product name. Keep an existing link to avoid breaking shared URLs.",
    }),
    defineField({
      name: "seo",
      type: "seo",
      group: "options",
      fieldset: "search",
    }),
  ],
  preview: {
    select: { title: "name", price: "price", media: "mainImage" },
    prepare({ title, price, media }) {
      return {
        title,
        media,
        subtitle:
          typeof price === "number"
            ? `₦${price.toLocaleString("en-NG")}`
            : "Add a price to publish",
      };
    },
  },
});
