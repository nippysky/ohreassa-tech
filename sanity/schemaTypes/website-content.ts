import { defineField, defineType } from "sanity";
import { contentDefaults } from "@/lib/site-content";

const sectionTitles: Record<keyof typeof contentDefaults, string> = {
  hero: "Homepage introduction",
  problem: "Power challenges",
  solution: "Our solution",
  approach: "Personal advice",
  products: "Product range overview",
  solutions: "Homes, businesses & outdoor spaces",
  benefits: "Why Ohreassa",
  experience: "Experience & business figures",
  services: "Services page",
  faq: "Frequently asked questions",
  finalCta: "Closing invitation",
};
const fieldTitles: Record<string, string> = {
  title: "Heading",
  accent: "Highlighted heading",
  description: "Description",
  detail: "Additional text",
  concern: "Customer concern",
  reassurance: "Closing line",
};

export const websiteContent = defineType({
  name: "websiteContent",
  title: "Homepage & services copy",
  type: "object",
  description:
    "Edit the words while keeping the website’s layout. Product range entries describe what you offer; create actual inventory under Products and Product categories.",
  fields: Object.entries(contentDefaults).map(([name, defaults]) =>
    defineField({
      name,
      title: sectionTitles[name as keyof typeof contentDefaults],
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: Object.keys(defaults).map((key) =>
        key === "items"
          ? defineField({
              name: "items",
              title: name === "faq" ? "Questions & answers" : "Items",
              type: "array",
              validation: (r) => r.max(16),
              of: [
                {
                  name: "contentItem",
                  type: "object",
                  fields: [
                    defineField({
                      name: "title",
                      title: name === "faq" ? "Question" : "Heading",
                      type: "string",
                      validation: (r) => r.required().max(150),
                    }),
                    defineField({
                      name: "description",
                      title: name === "faq" ? "Answer" : "Description",
                      type: "text",
                      rows: 3,
                      validation: (r) => r.required().max(800),
                    }),
                  ],
                  preview: {
                    select: { title: "title", subtitle: "description" },
                  },
                },
              ],
            })
          : defineField({
              name: key,
              title: fieldTitles[key] || key,
              type: key === "title" || key === "accent" ? "string" : "text",
              validation: (r) =>
                r
                  .required()
                  .max(key === "title" || key === "accent" ? 150 : 1000),
            }),
      ),
    }),
  ),
});
