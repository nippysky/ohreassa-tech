/* eslint-disable @next/next/no-img-element -- ImageResponse requires native image elements. */
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { StoreSettings } from "./store";

async function sanityPicture(
  url: string | undefined,
  width: number,
  height: number,
) {
  if (!url) return undefined;
  const image = new URL(url);
  if (image.protocol !== "https:" || image.hostname !== "cdn.sanity.io")
    return undefined;
  image.searchParams.set("w", String(width));
  image.searchParams.set("h", String(height));
  image.searchParams.set("fit", "max");
  image.searchParams.set("fm", "png");
  try {
    const response = await fetch(image, { signal: AbortSignal.timeout(8000) });
    if (!response.ok) return undefined;
    return `data:image/png;base64,${Buffer.from(await response.arrayBuffer()).toString("base64")}`;
  } catch {
    return undefined;
  }
}

export async function renderSocialImage({
  settings,
  heading = `${settings.content.hero.title}\n${settings.content.hero.accent}`,
  label = "SOLAR SOLUTIONS FOR NIGERIA",
  image,
  product = false,
}: {
  settings: StoreSettings;
  heading?: string;
  label?: string;
  image?: string;
  product?: boolean;
}) {
  const [defaultLogo, icon, customLogo, picture] = await Promise.all([
    readFile(join(process.cwd(), "public/brand/logo-optimized.png")),
    readFile(join(process.cwd(), "app/icon.png")),
    sanityPicture(settings.logo?.url, 460, 120),
    sanityPicture(image, 800, 900),
  ]);
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        background: "#f7f7f2",
        padding: "52px 60px",
        color: "#202725",
        gap: 40,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          justifyContent: "space-between",
        }}
      >
        {/* ImageResponse supports native img elements, not Next Image. */}
        <img
          src={
            customLogo ||
            `data:image/png;base64,${defaultLogo.toString("base64")}`
          }
          width={230}
          height={57}
          alt={settings.name}
          style={{ objectFit: "contain", objectPosition: "left" }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <span style={{ fontSize: 15, letterSpacing: 2, color: "#e95312" }}>
            {label.slice(0, 65)}
          </span>
          <div
            style={{
              display: "flex",
              fontSize:
                heading.length > 75 ? 44 : heading.length > 40 ? 54 : 68,
              lineHeight: 1.08,
              letterSpacing: -2,
              whiteSpace: "pre-wrap",
            }}
          >
            {heading}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <span style={{ fontSize: 20, color: "#e95312" }}>
            {product
              ? "View product · Order on WhatsApp"
              : "Solar products · Installation · Expert advice"}
          </span>
          <span style={{ fontSize: 16, color: "#727772" }}>
            {settings.name}
          </span>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          width: 430,
          height: "100%",
          background: picture ? "#ffffff" : "#eeede4",
          borderRadius: 30,
          alignItems: "center",
          justifyContent: "center",
          padding: 28,
        }}
      >
        <img
          src={picture || `data:image/png;base64,${icon.toString("base64")}`}
          width={picture ? 374 : 250}
          height={picture ? 460 : 250}
          alt=""
          style={{ objectFit: "contain" }}
        />
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      headers: {
        "Cache-Control":
          "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
      },
    },
  );
}
