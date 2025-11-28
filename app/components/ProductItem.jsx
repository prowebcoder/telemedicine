// src/components/ProductItem.jsx
import React from "react";
import {Link} from "react-router";
import {Image, Money} from "@shopify/hydrogen";
import {useVariantUrl} from "~/lib/variants";
import {AddToCartButton} from "./AddToCartButton";


/**
 * @typedef {import('storefrontapi.generated').ProductItemFragment} ProductItemFragment
 * @typedef {import('storefrontapi.generated').CollectionItemFragment} CollectionItemFragment
 * @typedef {import('storefrontapi.generated').RecommendedProductFragment} RecommendedProductFragment
 */

/**
 * @param {{
 *   product:
 *     | CollectionItemFragment
 *     | ProductItemFragment
 *     | RecommendedProductFragment;
 *   loading?: 'eager' | 'lazy';
 * }} props
 */
export function ProductItem({product, loading}) {
  // keep this hook and usage — you asked to preserve
  const variantUrl = useVariantUrl(product.handle);

  // preserve original image usage variable
  const image = product.featuredImage;

  // metafield-based badge (you said you'll set later)
  // this code assumes product.metafields is an array (we include metafields in queries below)
  let badge = null;
  if (product?.metafields && Array.isArray(product.metafields)) {
    const mf = product.metafields.find(
      (m) => m.namespace === "custom" && m.key === "product_badge",
    );
    if (mf) badge = mf.value;
  }

  // get first collection title if available
  const firstCollection = product?.collections?.nodes?.[0]?.title;

  return (
    <div className="product-card border rounded-2xl overflow-hidden">
      <Link to={`/products/${product.handle}`} prefetch="intent" className="product-link block h-full">
        <div className="product-image-container w-full aspect-[1/1] bg-gray-100 overflow-hidden">
          {image ? (
            <Image
              data={image}
              alt={image.altText ?? product.title}
              aspectRatio="1/1"
              loading={loading}
              className="product-image object-cover w-full h-full transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gray-200" />
          )}
        </div>

        <div className="product-info p-4">
          <h3 className="product-title text-sm md:text-base font-semibold mb-1">{product.title}</h3>

          <div className="flex items-center gap-2 mb-2">
            {badge && <span className="category-badge text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600">{badge}</span>}
            {firstCollection && <span className="text-xs text-gray-500">{firstCollection}</span>}
          </div>

          {product?.priceRange?.minVariantPrice && (
            <div className="product-price mb-3 text-lg font-bold text-gray-900">
              <Money data={product.priceRange.minVariantPrice} />
            </div>
          )}

          {/* Buttons section — Buy Now (link to product page) and Add to Cart (uses your AddToCartButton) */}
          <div className="product-actions flex gap-3">
            <Link
              to={variantUrl || `/products/${product.handle}`}
              className="buy-now-btn flex-1 text-center py-2 rounded-full bg-black text-white text-sm font-medium"
              prefetch="intent"
            >
              Buy Now
            </Link>

            {/* AddToCartButton exists in your project — keep import & usage */}
            <div className="w-14">
              <AddToCartButton product={product} />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
