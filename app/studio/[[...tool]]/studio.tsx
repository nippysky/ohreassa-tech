"use client";

import { NextStudio } from "next-sanity/studio";
import isPropValid from "@emotion/is-prop-valid";
import { StyleSheetManager, type ShouldForwardProp } from "styled-components";
import config from "@/sanity.config";

// Sanity's routing props belong on its React components, not HTML elements.
const shouldForwardProp: ShouldForwardProp<"web"> = (prop, target) =>
  typeof target !== "string" || isPropValid(prop);

export default function Studio() {
  return (
    <StyleSheetManager shouldForwardProp={shouldForwardProp}>
      <NextStudio config={config} />
    </StyleSheetManager>
  );
}
