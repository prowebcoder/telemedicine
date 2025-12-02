import {useLoaderData, Link} from 'react-router';
import {getPaginationVariables, Image} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import { ProductItem } from '~/components/ProductItem';
import React, {useMemo, useState} from 'react';

/**
 * @param {Route.LoaderArgs} args
 */
export async function loader(args) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold.
 */
async function loadCriticalData({context, request}) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 12,
  });

  const [{collections}] = await Promise.all([
    context.storefront.query(COLLECTIONS_QUERY, {
      variables: paginationVariables,
    }),
  ]);

  return {collections};
}

function loadDeferredData() {
  return {};
}

export default function Collections() {
  const {collections} = useLoaderData();

  // UI state: active category tab (handle) and search input
  const [activeHandle, setActiveHandle] = useState('all'); // 'all' or collection.handle
  const [searchTerm, setSearchTerm] = useState('');

  // flatten all products across collections for trending/latest/search
  const allProducts = useMemo(() => {
    if (!collections?.nodes) return [];
    return collections.nodes.flatMap((c) => c.products?.nodes ?? []);
  }, [collections]);

  // derive categories for tabs
  const categories = useMemo(() => {
    return collections?.nodes ?? [];
  }, [collections]);

  // Trending: first 6 products (client-side, derived)
  const trendingProducts = useMemo(() => {
    return allProducts.slice(0, 6);
  }, [allProducts]);

  // Latest: first 8 products (client-side). You can replace with sort by createdAt if API is changed later.
  const latestProducts = useMemo(() => {
    return allProducts.slice(0, 8);
  }, [allProducts]);

  // helper to get products to render depending on active tab and search
  const filteredProductsByActive = useMemo(() => {
    let productsToFilter = [];

    if (activeHandle === 'all') {
      productsToFilter = allProducts;
    } else {
      const found = categories.find((c) => c.handle === activeHandle);
      productsToFilter = found?.products?.nodes ?? [];
    }

    if (!searchTerm) return productsToFilter;

    const q = searchTerm.trim().toLowerCase();
    return productsToFilter.filter((p) => (p.title || '').toLowerCase().includes(q));
  }, [activeHandle, allProducts, categories, searchTerm]);

  return (
    <div className=" max-w-7xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="collections-header mb-8">
        <h1 className="text-3xl font-semibold mb-4">Browse products available without consultation</h1>

        {/* Tabs + Search row */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
          {/* Tabs */}
          <div className="flex gap-1 overflow-x-auto pb-2">
            <button
              onClick={() => {
                setActiveHandle('all');
                setSearchTerm('');
              }}
              className={`cursor-pointer text-sm px-4 py-2 rounded-full whitespace-nowrap border ${activeHandle === 'all' ? 'bg-black text-white' : 'bg-white text-gray-700 border-gray-300'}`}
            >
              All
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveHandle(cat.handle);
                  setSearchTerm('');
                }}
                className={`cursor-pointer text-sm px-4 py-2 rounded-full whitespace-nowrap border ${activeHandle === cat.handle ? 'bg-black text-white' : 'bg-white text-gray-700 border-gray-300'}`}
              >
                {cat.title}
              </button>
            ))}
          </div>

          {/* Spacer for layout */}
          <div className="flex-1" />

          {/* Search */}
          {/* <div className="w-full md:w-64">
            <input
              type="search"
              aria-label="Search product by name"
              placeholder="Search product by name..."
              className="w-full border px-4 py-2 rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div> */}
        </div>
      </div>

      {/* Trending Now */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Trending Now</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {trendingProducts.map((product, i) => (
            <ProductItem key={product.id} product={product} loading={i < 4 ? 'eager' : undefined} />
          ))}
        </div>
      </section>

      {/* Latest products */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Latest products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {latestProducts.map((product, i) => (
            <ProductItem key={product.id} product={product} loading={i < 4 ? 'eager' : undefined} />
          ))}
        </div>
      </section>

      {/* Collections list -> each collection with a small "See all" and products */}
      <div className="collections-grid space-y-12">
        {categories.map((collection, index) => (
          <section className="collection-section" key={collection.id}>
            {/* Collection Header */}
            <div className="collection-header flex items-center justify-between mb-4">
              <h2 className="collection-title text-lg font-semibold">{collection.title}</h2>

              <Link
                to={`/collections/${collection.handle}`}
                className="view-all-link text-sm text-gray-600"
                prefetch="intent"
              >
                See all →
              </Link>
            </div>

            {/* If this collection is active tab or 'all' show product grid; otherwise show collapsed grid */}
            <div className="products-grid">
              {collection?.products?.nodes?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {collection.products.nodes.map((product, i) => (
                    // If search is active, only show matches
                    (!searchTerm || (product.title || '').toLowerCase().includes(searchTerm.trim().toLowerCase())) && (
                      <ProductItem
                        key={product.id}
                        product={product}
                        loading={i < 4 ? 'eager' : undefined}
                      />
                    )
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No products yet</p>
              )}
            </div>
          </section>
        ))}
      </div>

      {/* If a user selected a specific tab, show the filtered products view as well */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4">{activeHandle === 'all' ? 'All products' : `Showing: ${categories.find(c => c.handle === activeHandle)?.title ?? 'Products'}`}</h2>

        {filteredProductsByActive.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProductsByActive.map((product, i) => (
              <ProductItem key={product.id} product={product} loading={i < 4 ? 'eager' : undefined} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No products match your selection.</p>
        )}
      </section>
    </div>
  );
}

/**
 * Updated query to include products inside each collection
 */
const COLLECTIONS_QUERY = `#graphql
  fragment MoneyAmount on MoneyV2 {
    amount
    currencyCode
  }

  fragment ProductCard on Product {
    id
    handle
    title
    featuredImage {
      id
      url
      altText
      width
      height
    }
    priceRange {
      minVariantPrice {
        ...MoneyAmount
      }
      maxVariantPrice {
        ...MoneyAmount
      }
    }
  }

  fragment Collection on Collection {
    id
    title
    handle
    description
    image {
      id
      url
      altText
      width
      height
    }
    products(first: 8) {
      nodes {
        ...ProductCard
      }
    }
  }

  query StoreCollections(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    collections(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor
    ) {
      nodes {
        ...Collection
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

/** @typedef {import('./+types/collections._index').Route} Route */
/** @typedef {import('storefrontapi.generated').CollectionFragment} CollectionFragment */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
