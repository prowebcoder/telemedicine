// app/routes/products.$handle.jsx
import {useLoaderData} from 'react-router';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
} from '@shopify/hydrogen';
import {ProductPrice} from '~/components/ProductPrice';
import {ProductImage} from '~/components/ProductImage';
import {ProductForm} from '~/components/ProductForm';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import React, {useState} from 'react';
import { AddToCartButton } from '~/components/AddToCartButton';
import { useAside } from '~/components/Aside';

/**
 * @type {Route.MetaFunction}
 */
export const meta = ({data}) => {
  return [
    {title: `Hydrogen | ${data?.product.title ?? ''}`},
    {
      rel: 'canonical',
      href: `/products/${data?.product.handle}`,
    },
  ];
};

/**
 * @param {Route.LoaderArgs} args
 */
export async function loader(args) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 * @param {Route.LoaderArgs}
 */
async function loadCriticalData({context, params, request}) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const [{product}] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {handle, selectedOptions: getSelectedProductOptions(request)},
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  // The API handle might be localized, so redirect to the localized handle
  redirectIfHandleIsLocalized(request, {handle, data: product});

  return {
    product,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 * @param {Route.LoaderArgs}
 */
function loadDeferredData({context, params}) {
  // keep empty for now (you can add reviews/recommendations here)
  return {};
}

export default function Product() {
  /** @type {LoaderReturnData} */
  const {product} = useLoaderData();
  const {open} = useAside();

  // Optimistically selects a variant with given available variant information
  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  // Sets the search param to the selected variant without navigation
  // only when no search params are set in the url
  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  // Get the product options array
  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const {title, descriptionHtml} = product;

  // SAFE single-metafield fields (works on all storefront API versions)
  const howItHelps = product?.howItHelps?.value ?? null;
  const keyIngredients = product?.keyIngredients?.value ?? null;
  const whatToExpect = product?.whatToExpect?.value ?? null;

  // Accordion state
  const [openPanel, setOpenPanel] = useState('how');

  // Handle Buy Now: add variant and redirect to checkout
  async function handleBuyNow(variantId) {
    if (!variantId) return;

    try {
      const response = await fetch('/cart', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          action: 'addLines',
          lines: [
            {
              merchandiseId: variantId,
              quantity: 1,
            },
          ],
        }),
      });

      const data = await response.json();

      // Shopify Hydrogen cart API returns 'checkoutUrl'
      if (data?.checkoutUrl) {
        window.location.href = data.checkoutUrl; // redirect to checkout
      } else {
        console.error("Checkout URL missing in response", data);
        // fallback: open side cart
        open('cart');
      }
    } catch (err) {
      console.error('Buy now error', err);
      open('cart');
    }
  }

  // collect up to 5 real thumbnails (media nodes)
  const thumbnails = (product.media?.nodes ?? [])
    .filter((m) => m?.previewImage?.url || (m?.image?.url))
    .slice(0, 5);

  return (
    <div className="product-page-wrapper max-w-[1200px] mx-auto px-6 py-10">

      {/* TITLE + CATEGORY (moved above grid to match PDF) */}
      <div className="mb-6">
        <div className="text-3xl font-semibold">{title}</div>
        {product?.productType && (
          <div className="text-sm text-gray-500 mt-2">{product.productType}</div>
        )}
      </div>

      {/* Grid: left image, right content */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* LEFT: Image column (6/12) */}
        <div className="md:col-span-6">
          <div className="product-image-wrap w-full rounded-lg overflow-hidden">
            <ProductImage image={selectedVariant?.image ?? product?.featuredImage} />
          </div>

          {/* Thumbnails (only real images) */}
    {/* Thumbnails: first 3 static, rest in slider */}
{/* --- THUMBNAILS (3 static + slider for the rest) --- */}
{thumbnails.length > 0 && (
  <div className="mt-4 flex items-start gap-3">

    {/* FIRST 3 THUMBNAILS */}
    <div className="flex gap-2">
      {thumbnails.slice(0, 3).map((m, idx) => {
        const url = m.previewImage?.url ?? m.image?.url;
        return (
          <div
            key={`static-${m.id ?? idx}`}
            className="w-45 h-45 rounded-md overflow-hidden bg-gray-200 flex-shrink-0"
          >
            {url ? (
              <img
                src={url}
                alt={`${product.title} thumb ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-300" />
            )}
          </div>
        );
      })}
    </div>

    {/* SLIDER FOR REMAINING THUMBNAILS */}
    {thumbnails.length > 3 && (
      <div className="flex-1 overflow-x-auto scrollbar-hide">
        <div className="flex gap-3">
          {thumbnails.slice(3).map((m, idx) => {
            const url = m.previewImage?.url ?? m.image?.url;
            return (
              <div
                key={`slider-${m.id ?? idx}`}
                className="w-45 h-45 rounded-md overflow-hidden bg-gray-200 flex-shrink-0"
              >
                {url ? (
                  <img
                    src={url}
                    alt={`${product.title} thumb ${idx + 4}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    )}

  </div>
)}


        </div>

        {/* RIGHT: Details column (6/12) */}
        <div className="md:col-span-6">
          {/* short description excerpt */}
          {descriptionHtml && (
            <div
              className="text-sm text-gray-700 mb-4"
              dangerouslySetInnerHTML={{__html: descriptionHtml.split('</p>')[0] || descriptionHtml}}
            />
          )}

          {/* Bottle size / options */}
          <div className="mb-4">
          
            <ProductForm productOptions={productOptions} selectedVariant={selectedVariant} />
          </div>

          {/* Price */}
          <div className="mb-6">
            <div className="text-sm text-gray-600 mb-1">Price:</div>
            <div className="text-2xl font-bold">
              <ProductPrice price={selectedVariant?.price} compareAtPrice={selectedVariant?.compareAtPrice} />
            </div>
          </div>

          {/* Actions: Buy Now (primary pill) and Add To Cart (outlined with cart icon) */}
          <div className="flex flex-col sm:flex-row gap-2 mb-6">
            <button
              onClick={() => handleBuyNow(selectedVariant?.id)}
              disabled={!selectedVariant}
              className="w-100 px-8 py-4 rounded-full bg-black text-white font-semibold text-center"
            >
              Buy Now
            </button>

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
            
              onClick={() => open('cart')}
            >
              {/* styled content inside AddToCartButton */}
              <div className="w-75 flex items-center justify-center gap-3 px-6 py-3 rounded-full border border-gray-300 bg-white text-black">
                {/* Cart SVG icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <circle cx="9" cy="20" r="1" />
                  <circle cx="20" cy="20" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                <span className="font-medium">Add To Cart</span>
              </div>
            </AddToCartButton>
          </div>

          {/* Accordions */}
          <div className="product-accordions">
            <div className="border-t border-b">
              <button
                className="w-full text-left py-4 flex justify-between items-center"
                onClick={() => setOpenPanel(openPanel === 'how' ? null : 'how')}
                aria-expanded={openPanel === 'how'}
              >
                <span className="font-semibold">How it helps</span>
                <span className="text-gray-600">{openPanel === 'how' ? '−' : '+'}</span>
              </button>
              {openPanel === 'how' && (
                <div className="pb-4 text-sm text-gray-700">
                  {howItHelps ? (
                    <div dangerouslySetInnerHTML={{__html: howItHelps}} />
                  ) : descriptionHtml ? (
                    <div dangerouslySetInnerHTML={{__html: descriptionHtml}} />
                  ) : (
                    <p>No information provided yet.</p>
                  )}
                </div>
              )}
            </div>

            <div className="border-b">
              <button
                className="w-full text-left py-4 flex justify-between items-center"
                onClick={() => setOpenPanel(openPanel === 'ingredients' ? null : 'ingredients')}
                aria-expanded={openPanel === 'ingredients'}
              >
                <span className="font-semibold">Key ingredients & their benefits</span>
                <span className="text-gray-600">{openPanel === 'ingredients' ? '−' : '+'}</span>
              </button>
              {openPanel === 'ingredients' && (
                <div className="pb-4 text-sm text-gray-700">
                  {keyIngredients ? (
                    <div dangerouslySetInnerHTML={{__html: keyIngredients}} />
                  ) : (
                    <p>No ingredient details provided yet.</p>
                  )}
                </div>
              )}
            </div>

            <div className="border-b">
              <button
                className="w-full text-left py-4 flex justify-between items-center"
                onClick={() => setOpenPanel(openPanel === 'expect' ? null : 'expect')}
                aria-expanded={openPanel === 'expect'}
              >
                <span className="font-semibold">What to expect</span>
                <span className="text-gray-600">{openPanel === 'expect' ? '−' : '+'}</span>
              </button>
              {openPanel === 'expect' && (
                <div className="pb-4 text-sm text-gray-700">
                  {whatToExpect ? (
                    <div dangerouslySetInnerHTML={{__html: whatToExpect}} />
                  ) : (
                    <p>No expectation information provided yet.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Dark CTA (only) — kept and styled per your request */}
    

      {/* Analytics Product View */}
      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price?.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />
    </div>
  );
}

/* ----------------------------
   GraphQL fragments & query
   (kept compatible - single metafield access)
   ---------------------------- */

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
`;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    productType
    encodedVariantExistence
    encodedVariantAvailability
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants (selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    media(first: 10) {
      nodes {
        __typename
        ... on MediaImage {
          id
          previewImage {
            url
            width
            height
          }
        }
      }
    }
    seo {
      description
      title
    }

    # Single metafields (safe across storefront API versions)
    howItHelps: metafield(namespace: "custom", key: "how_it_helps") {
      value
    }
    keyIngredients: metafield(namespace: "custom", key: "key_ingredients") {
      value
    }
    whatToExpect: metafield(namespace: "custom", key: "what_to_expect") {
      value
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
`;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
`;

/** @typedef {import('./+types/products.$handle').Route} Route */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
