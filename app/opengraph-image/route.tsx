import type { NextRequest } from "next/server";
import { getCategories, getProduct, getSettings } from "@/sanity/lib/data";
import { renderSocialImage } from "@/lib/social-image";

// Share cards accept only published product/category slugs, never arbitrary image URLs.
export async function GET(request: NextRequest) {
  const productSlug = request.nextUrl.searchParams.get("product");
  const categorySlug = request.nextUrl.searchParams.get("category");
  if (
    (productSlug && categorySlug) ||
    (productSlug?.length || 0) > 100 ||
    (categorySlug?.length || 0) > 100
  ) {
    return new Response("Invalid image request", { status: 400 });
  }
  const settings = await getSettings();
  if (
    !productSlug &&
    !categorySlug &&
    request.nextUrl.searchParams.get("page") === "services"
  ) {
    return renderSocialImage({
      settings,
      heading: settings.content.services.title,
      label: "SOLAR SOLUTIONS & SERVICES",
    });
  }
  if (productSlug) {
    const product = await getProduct(productSlug);
    if (!product) return new Response("Product not found", { status: 404 });
    return renderSocialImage({
      settings,
      heading: product.name,
      label: product.category?.name.toUpperCase() || "EXPLORE THE PRODUCT",
      image: product.images[0]?.url,
      product: true,
    });
  }
  if (categorySlug) {
    const category = (await getCategories()).find(
      (item) => item.slug === categorySlug,
    );
    if (!category) return new Response("Collection not found", { status: 404 });
    return renderSocialImage({
      settings,
      heading: category.name,
      label: "EXPLORE THE COLLECTION",
      image: category.image?.url,
    });
  }
  return renderSocialImage({ settings });
}
