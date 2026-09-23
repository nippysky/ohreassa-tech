import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartProvider } from "@/components/store/cart-provider";
import { Reveal } from "@/components/ui/reveal";
import { getCategories, getSettings } from "@/sanity/lib/data";
import { Suspense } from "react";

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, categories] = await Promise.all([
    getSettings(),
    getCategories(),
  ]);
  return (
    <CartProvider>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Suspense
        fallback={
          <div
            className="header-placeholder skeleton"
            aria-label="Loading navigation"
          />
        }
      >
        <Header
          settings={settings}
          categories={categories.map(({ _id, name, slug }) => ({
            _id,
            name,
            slug,
          }))}
        />
      </Suspense>
      <main id="main">{children}</main>
      <Footer settings={settings} categories={categories} />
      <Suspense fallback={null}>
        <Reveal />
      </Suspense>
    </CartProvider>
  );
}
