import { defineQuery } from "next-sanity";

export const productProjection = `{
  _id, _updatedAt, seo{title, description}, name, "slug": slug.current, sku,
  "category": category->{name, "slug": slug.current}, summary, description,
  "images": [mainImage, ...coalesce(gallery, [])][defined(asset)]{
    "url": asset->url, alt, "lqip": asset->metadata.lqip
  },
  price, salePrice, saleStartsAt, saleEndsAt, quantityPrices,
  stockStatus, stockQuantity, warrantyMonths, featured, specifications
}`;
export const productFilter = `_type == "product" && active == true && defined(slug.current) && defined(category->slug.current) && category->active != false`;
export const CATALOG_QUERY = defineQuery(
  `*[${productFilter}] | order(featured desc, name asc) ${productProjection}`,
);
export const PRODUCT_QUERY = defineQuery(
  `*[${productFilter} && slug.current == $slug][0] ${productProjection}`,
);
export const QUOTE_PRODUCTS_QUERY = defineQuery(
  `*[${productFilter} && _id in $ids] ${productProjection}`,
);
export const CATEGORIES_QUERY = defineQuery(
  `*[_type == "category" && active != false && defined(slug.current)] | order(sortOrder asc, name asc) {
    _id, _updatedAt, seo{title, description}, name, "slug": slug.current, description, eyebrow, featured,
    "image": coalesce(image, *[_type == "product" && active == true && category._ref == ^._id && defined(mainImage.asset)] | order(name asc)[0].mainImage){
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
