import type { Metadata } from "next";
import localFont from "next/font/local";
import { siteUrl } from "@/lib/store";
import { pageMetadata } from "@/lib/seo";
import { getSettings } from "@/sanity/lib/data";
import "./globals.css";

const bodyFont = localFont({
  src: "../node_modules/@fontsource-variable/dm-sans/files/dm-sans-latin-wght-normal.woff2",
  weight: "100 1000",
  style: "normal",
  variable: "--font-body",
  display: "swap",
});
const headingFont = localFont({
  src: "../node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2",
  weight: "200 800",
  style: "normal",
  variable: "--font-heading",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    ...pageMetadata(settings, {
      title: "Energy solutions in Nigeria",
      description: settings.description,
      path: "/",
    }),
    // Canonicals belong to individual pages, never to an inherited layout.
    alternates: undefined,
    metadataBase: new URL(siteUrl()),
    title: {
      default: `${settings.name} · Energy solutions in Nigeria`,
      template: `%s | ${settings.name}`,
    },
    applicationName: settings.name,
    formatDetection: { telephone: false },
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${bodyFont.variable} ${headingFont.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
