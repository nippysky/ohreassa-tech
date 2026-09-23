import { defineField, defineType } from "sanity";

export const seo = defineType({
  name: "seo",
  title: "Search & sharing",
  type: "object",
  description:
    "Optional. Leave these blank to use the page’s name and description automatically. The main picture is used when sharing a product or collection.",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: "title",
      title: "Search title",
      type: "string",
      description:
        "The store name is added automatically. Keep this clear and specific.",
      validation: (rule) =>
        rule
          .max(60)
          .warning(
            "A shorter title is less likely to be cut off in search results.",
          ),
    }),
    defineField({
      name: "description",
      title: "Search description",
      type: "text",
      rows: 3,
      description:
        "A short, accurate description of what customers will find on this page.",
      validation: (rule) =>
        rule.max(170).warning("Aim for 170 characters or fewer."),
    }),
  ],
});
