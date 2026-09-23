import { defineField, defineType } from "sanity";
import { storeDefaults } from "@/lib/store";

export const storeSettings = defineType({
  name: "storeSettings",
  title: "Store settings",
  type: "document",
  initialValue: storeDefaults,
  groups: [
    { name: "business", title: "Business & branding", default: true },
    { name: "contact", title: "Contact & pickup" },
    { name: "content", title: "Website text" },
    { name: "seo", title: "Search & sharing" },
  ],
  fields: [
    defineField({
      name: "seo",
      title: "Homepage search & sharing",
      type: "seo",
      group: "seo",
      description:
        "Optional homepage overrides. Leave blank to use the website description and an automatic title. Product and category metadata are edited on their own documents.",
    }),
    defineField({
      name: "name",
      group: "business",
      title: "Store name",
      type: "string",
      validation: (r) => r.required().max(80),
    }),
    defineField({
      name: "logo",
      title: "Store logo",
      type: "image",
      group: "business",
      description:
        "Optional replacement for the prepared Ohreassa logo. Use a wide PNG or WebP with a transparent background.",
      fields: [
        defineField({
          name: "alt",
          title: "Image description",
          type: "string",
          validation: (r) => r.required().max(160),
        }),
      ],
    }),
    defineField({
      name: "tagline",
      title: "Footer tagline",
      type: "text",
      rows: 2,
      group: "content",
      validation: (r) => r.max(160),
    }),
    defineField({
      name: "description",
      title: "Website description",
      type: "text",
      rows: 3,
      group: "content",
      description: "Used in the website’s search and sharing metadata.",
      validation: (r) => r.required().max(180),
    }),
    defineField({
      name: "aboutText",
      title: "Our story",
      type: "text",
      rows: 8,
      group: "content",
      description:
        "The body text on the About page. Separate paragraphs with a blank line.",
      validation: (r) => r.required().max(4000),
    }),
    defineField({
      name: "announcement",
      group: "content",
      title: "Announcement bar",
      type: "string",
      description: "Leave blank to hide the announcement bar.",
      validation: (r) => r.max(120),
    }),
    defineField({
      name: "email",
      group: "contact",
      type: "string",
      validation: (r) => r.required().email(),
    }),
    defineField({
      name: "phone",
      group: "contact",
      title: "Primary phone",
      type: "string",
      validation: (r) => r.required().max(24),
    }),
    defineField({
      name: "alternatePhone",
      group: "contact",
      title: "Alternate phone",
      type: "string",
      validation: (r) => r.max(24),
    }),
    defineField({
      name: "whatsappNumber",
      group: "contact",
      title: "WhatsApp order number",
      type: "string",
      description:
        "International digits only, e.g. 2348068244971. No +, spaces, or leading zero. All order requests go to this number.",
      validation: (r) =>
        r
          .required()
          .regex(/^[1-9]\d{7,14}$/, { name: "international phone number" }),
    }),
    defineField({
      name: "address",
      group: "contact",
      title: "Store / pickup address",
      type: "text",
      rows: 3,
      validation: (r) => r.required().max(300),
    }),
    defineField({
      name: "openingHours",
      title: "Opening hours / visiting information",
      type: "text",
      rows: 3,
      group: "contact",
      description:
        "Optional. Shown on the contact page and with pickup details at checkout.",
      validation: (r) => r.max(300),
    }),
    defineField({
      name: "instagramUrl",
      group: "contact",
      title: "Instagram",
      type: "url",
      validation: (r) => r.uri({ scheme: ["https"] }),
    }),
  ],
  preview: { select: { title: "name", media: "logo" } },
});
