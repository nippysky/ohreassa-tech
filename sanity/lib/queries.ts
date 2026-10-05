import { defineQuery } from "next-sanity";

// Existing custom links stay stable. Products without one use their permanent document ID.
const productSlug = `select(defined(slug.current) && slug.current != "" => slug.current, _id)`;
export const productProjection = `{
  _id, _updatedAt, seo{title, description}, name, "slug": ${productSlug},
  "category": select(defined(category->name) && defined(category->slug.current) => category->{name, "slug": slug.current}, null),
  "description": coalesce(description, ""),
  "images": [mainImage, ...coalesce(gallery, [])][defined(asset->url)]{
    "url": asset->url, "alt": coalesce(alt, ""), "lqip": asset->metadata.lqip
  },
  price, salePrice, saleStartsAt, saleEndsAt, quantityPrices,
  "stockStatus": coalesce(stockStatus, "inStock"), stockQuantity, warrantyMonths,
  "featured": coalesce(featured, false), specifications
}`;
export const productFilter = `_type == "product" && coalesce(active, true) == true && defined(name) && price > 0 && coalesce(category->active, true) == true`;
export const CATALOG_QUERY = defineQuery(
  `*[${productFilter}] | order(featured desc, name asc) ${productProjection}`,
);
export const PRODUCT_QUERY = defineQuery(
  `*[${productFilter} && ${productSlug} == $slug][0] ${productProjection}`,
);
export const QUOTE_PRODUCTS_QUERY = defineQuery(
  `*[${productFilter} && _id in $ids] ${productProjection}`,
);
export const CATEGORIES_QUERY = defineQuery(
  `*[_type == "category" && active != false && defined(slug.current)] | order(sortOrder asc, name asc) {
    _id, _updatedAt, seo{title, description}, name, "slug": slug.current, description, eyebrow, featured,
    "image": coalesce(image, *[${productFilter} && category._ref == ^._id && defined(mainImage.asset)] | order(name asc)[0].mainImage){
      "url": asset->url, alt, "lqip": asset->metadata.lqip
    }
  }`,
);
export const SETTINGS_QUERY = defineQuery(
  `*[_type == "storeSettings" && _id == "storeSettings"][0]{
    _updatedAt,name,tagline,description,aboutText,email,phone,alternatePhone,whatsappNumber,address,openingHours,instagramUrl,announcement,
    "logo": logo{"url": asset->url, alt}, seo{title, description}, content
  }`,
);
