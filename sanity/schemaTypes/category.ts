import { defineField, defineType } from "sanity";

export const category = defineType({
  name: "category",
  title: "Product categories",
  type: "document",
  fields: [
    defineField({
      name: "name",
      type: "string",
      validation: (r) => r.required().max(60),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "name", maxLength: 80 },
      description:
        "Generate from the name. Any unique slug works; navigation and collection links update automatically.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "description",
      type: "text",
      rows: 3,
      validation: (r) => r.max(160),
    }),
    defineField({
      name: "eyebrow",
      title: "Short collection label",
      type: "string",
      description:
        "Optional small heading above the category name on its homepage card.",
      validation: (r) => r.max(60),
    }),
    defineField({
      name: "image",
      title: "Collection picture",
      type: "image",
      options: { hotspot: true },
      description:
        "Optional. If omitted, the first available product’s main picture is used.",
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
      name: "active",
      title: "Show category in store",
      type: "boolean",
      initialValue: true,
      description:
        "Turning this off hides the category and its products from browsing and new checkout requests. Existing content is kept.",
    }),
    defineField({
      name: "featured",
      title: "Show on homepage",
      type: "boolean",
      initialValue: true,
      description:
        "Published, visible categories always appear in the shop, navigation and footer. Enable this to also show a homepage collection card.",
    }),
    defineField({
      name: "sortOrder",
      type: "number",
      initialValue: 0,
      description: "Lower numbers appear first throughout the store.",
      validation: (r) => r.integer().min(0),
    }),
    defineField({ name: "seo", type: "seo" }),
  ],
  preview: { select: { title: "name", media: "image" } },
});
