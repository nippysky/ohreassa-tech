"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { dataset, projectId } from "./sanity/env";
import { schemaTypes } from "./sanity/schemaTypes";

export default defineConfig({
  name: "ohreassa",
  title: "Ohreassa Technology",
  projectId: projectId || "unconfigured",
  dataset,
  basePath: "/studio",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Store management")
          .items([
            S.listItem()
              .title("Store settings")
              .child(
                S.document()
                  .schemaType("storeSettings")
                  .documentId("storeSettings")
                  .initialValueTemplate("storeSettings"),
              ),
            S.divider(),
            ...S.documentTypeListItems().filter(
              (item) => item.getId() !== "storeSettings",
            ),
          ]),
    }),
  ],
  schema: {
    types: schemaTypes,
  },
  document: {
    // Hide duplicate creation without removing the singleton's initial values.
    newDocumentOptions: (options) =>
      options.filter((option) => option.templateId !== "storeSettings"),
    actions: (actions, context) =>
      context.schemaType === "storeSettings"
        ? actions.filter(
            (action) =>
              !["delete", "duplicate", "unpublish"].includes(
                action.action || "",
              ),
          )
        : actions,
  },
});
