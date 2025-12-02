// src/components/ProductItem.jsx
import React from "react";
import { Link } from "react-router";
import { Image, Money } from "@shopify/hydrogen";
import { useVariantUrl } from "~/lib/variants";
import { AddToCartButton } from "./AddToCartButton";


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
export function ProductItem({ product, loading }) {
  // keep this hook and usage — you asked to preserve
  const variantUrl = useVariantUrl(product.handle);
  const selectedVariant =
    product.selectedOrFirstAvailableVariant ||
    product.variants?.nodes?.[0] ||
    null;
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
        <div className="product-actions flex flex-col gap-3 mt-3">
  <Link
    to={variantUrl || `/products/${product.handle}`}
    className="buy-now-btn flex-1 text-center py-2 rounded-full bg-black text-white text-sm font-medium"
    prefetch="intent"
  >
    Buy Now
  </Link>

  <div className="flex justify-center items-center gap-2  text-center py-2 rounded-full border  text-sm font-medium">
     <svg width="25" height="21" viewBox="0 0 25 21" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M19.7299 15.1388H8.31488C8.19748 15.1388 8.08364 15.0985 7.99243 15.0246C7.90123 14.9507 7.83819 14.8477 7.81389 14.7328L4.9152 1.024H0V0H5.32992C5.44728 4.00129e-05 5.56106 0.0403944 5.65221 0.114307C5.74337 0.188219 5.80636 0.291202 5.83066 0.406016L8.72986 14.1148H19.7299C20.113 14.1158 20.4852 13.9881 20.787 13.7522C21.0887 13.5162 21.3025 13.1858 21.3939 12.8138L23.3692 4.8215C23.3865 4.75126 23.3876 4.67801 23.3725 4.60728C23.3573 4.53654 23.3263 4.47018 23.2817 4.41322C23.2371 4.35625 23.1801 4.31017 23.1151 4.27845C23.0501 4.24674 22.9787 4.23022 22.9064 4.23014H10.1862V3.20614H22.9043C23.1323 3.20582 23.3573 3.25742 23.5623 3.35702C23.7673 3.45662 23.947 3.60161 24.0876 3.78099C24.2283 3.96036 24.3262 4.16942 24.374 4.39229C24.4218 4.61516 24.4182 4.84599 24.3635 5.06727L22.388 13.0593C22.2421 13.6537 21.9007 14.1818 21.4187 14.5589C20.9367 14.936 20.3419 15.1402 19.7299 15.1388Z" fill="#00082E"/>
<path d="M11.2485 20.5824C10.8266 20.5824 10.4141 20.4573 10.0633 20.2229C9.71247 19.9885 9.43905 19.6553 9.27759 19.2655C9.11614 18.8757 9.07391 18.4467 9.15624 18.0329C9.23858 17.6191 9.44177 17.239 9.74014 16.9406C10.0385 16.6423 10.4186 16.4392 10.8325 16.3569C11.2463 16.2746 11.6752 16.3169 12.065 16.4784C12.4548 16.6399 12.788 16.9133 13.0223 17.2642C13.2567 17.615 13.3818 18.0275 13.3817 18.4494C13.3811 19.015 13.1561 19.5571 12.7562 19.957C12.3562 20.3569 11.814 20.5818 11.2485 20.5824ZM11.2485 17.3399C11.0291 17.3399 10.8147 17.405 10.6322 17.5268C10.4498 17.6487 10.3077 17.8219 10.2237 18.0246C10.1397 18.2273 10.1178 18.4503 10.1605 18.6655C10.2033 18.8806 10.3089 19.0783 10.464 19.2334C10.6191 19.3886 10.8168 19.4942 11.0319 19.5371C11.2471 19.5799 11.4701 19.558 11.6728 19.4741C11.8755 19.3901 12.0487 19.248 12.1707 19.0656C12.2926 18.8832 12.3577 18.6688 12.3577 18.4494C12.3574 18.1553 12.2404 17.8734 12.0325 17.6654C11.8245 17.4575 11.5426 17.3405 11.2485 17.3402V17.3399Z" fill="#00082E"/>
<path d="M18.5708 20.5824C18.1488 20.5826 17.7363 20.4577 17.3853 20.2234C17.0344 19.9891 16.7608 19.656 16.5992 19.2662C16.4376 18.8764 16.3952 18.4474 16.4774 18.0335C16.5596 17.6196 16.7627 17.2394 17.0611 16.941C17.3594 16.6426 17.7395 16.4393 18.1534 16.357C18.5672 16.2746 18.9962 16.3168 19.3861 16.4783C19.7759 16.6397 20.1091 16.9132 20.3436 17.2641C20.578 17.6149 20.7031 18.0275 20.703 18.4494C20.7023 19.0148 20.4775 19.5568 20.0778 19.9567C19.6781 20.3565 19.1362 20.5815 18.5708 20.5824ZM18.5708 17.3399C18.3514 17.3397 18.1368 17.4046 17.9543 17.5263C17.7717 17.6481 17.6294 17.8212 17.5453 18.0239C17.4612 18.2266 17.439 18.4496 17.4817 18.6648C17.5244 18.8801 17.6299 19.0778 17.785 19.2331C17.94 19.3883 18.1377 19.4941 18.3528 19.537C18.568 19.5799 18.7911 19.558 18.9938 19.4741C19.1966 19.3903 19.3699 19.2481 19.4919 19.0657C19.6138 18.8833 19.679 18.6688 19.679 18.4494C19.6787 18.1555 19.5618 17.8737 19.3541 17.6658C19.1464 17.4579 18.8647 17.3408 18.5708 17.3402V17.3399Z" fill="#00082E"/>
</svg>
    <AddToCartButton
      lines={
        selectedVariant
          ? [
              {
                merchandiseId: selectedVariant.id,
                quantity: 1,
              },
            ]
          : []
      }
      disabled={!selectedVariant}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Adding to cart:', selectedVariant);
      }}
    >
      <span>Add to Cart</span>
    </AddToCartButton>
  </div>
</div>
        </div>
      </Link>
    </div>
  );
}
