// src/routes/collections.all.jsx
import {useLoaderData} from "react-router";
import {getPaginationVariables} from "@shopify/hydrogen";
import {PaginatedResourceSection} from "~/components/PaginatedResourceSection";
import {ProductItem} from "~/components/ProductItem";

/**
 * @type {Route.MetaFunction}
 */
export const meta = () => {
  return [{title: `Hydrogen | Products`}];
};

/**
 * @param {Route.LoaderArgs} args
 */
export async function loader(args) {
  // keep deferred/critical pattern
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context, request}) {
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 24,
  });

  const [{products}] = await Promise.all([
    storefront.query(CATALOG_QUERY, {
      variables: {...paginationVariables},
    }),
  ]);
  return {products};
}

function loadDeferredData({context}) {
  return {};
}

export default function AllProductsPage() {
  const {products} = useLoaderData();

  return (
    <div className="collections-page max-w-7xl mx-auto px-4 py-8">
      <div className="collections-header text-center mb-8">
        <h1 className="text-3xl font-semibold">All Products</h1>

        {/* Search Bar */}
        <div className="mt-4 max-w-xl mx-auto">
          <input
            type="text"
            name="q"
            placeholder="Search product by name..."
            className="w-full border rounded-full px-4 py-3"
          />
        </div>
      </div>

      <PaginatedResourceSection
        connection={products}
        resourcesClassName="products-grid grid gap-6 sm:grid-cols-2 md:grid-cols-3"
      >
        {({node: product, index}) => (
          <ProductItem key={product.id} product={product} loading={index < 6 ? "eager" : undefined} />
        )}
      </PaginatedResourceSection>

      {/* Testimonials */}
      <section className="testimonials-section mt-12">
        <h2 className="text-2xl text-center font-semibold mb-6">What others are saying</h2>
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-4">
          <div className="testimonial-card p-6 border rounded">
            <div className="avatar-circle w-10 h-10 rounded-full bg-gray-200 mb-3" />
            <h3 className="font-semibold">Acne & Skin Clearing Gel</h3>
            <p className="text-sm text-gray-700 mt-2">“I’ve tried everything for my skin, but this clearing gel actually works. My breakouts are finally under control, and my skin feels smoother too.”</p>
            <strong className="block mt-3">— Emily R.</strong>
          </div>

          <div className="testimonial-card p-6 border rounded">
            <div className="avatar-circle w-10 h-10 rounded-full bg-gray-200 mb-3" />
            <h3 className="font-semibold">Immune Boost Multivitamin</h3>
            <p className="text-sm text-gray-700 mt-2">“These gummies are actually amazing. I feel more energized, and I love that there’s no weird aftertaste like others I’ve tried.”</p>
            <strong className="block mt-3">— Jasmine S.</strong>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter-section mt-12 text-center">
        <h2 className="text-xl font-semibold">Healthy newsletter</h2>
        <p className="text-sm text-gray-600">No spam. Just real health stuff.</p>
        <div className="mt-4 max-w-md mx-auto">
          <input placeholder="Enter your email" className="w-full border rounded-full px-4 py-3" />
        </div>
      </section>
    </div>
  );
}

const COLLECTION_ITEM_FRAGMENT = `#graphql
  fragment MoneyCollectionItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment CollectionItem on Product {
    id
    handle
    title
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        ...MoneyCollectionItem
      }
      maxVariantPrice {
        ...MoneyCollectionItem
      }
    }
  }
`;

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/product
const CATALOG_QUERY = `#graphql
  query Catalog(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    products(first: $first, last: $last, before: $startCursor, after: $endCursor) {
      nodes {
        ...CollectionItem
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
  ${COLLECTION_ITEM_FRAGMENT}
`;

/** @typedef {import('./+types/collections.all').Route} Route */
/** @typedef {import('storefrontapi.generated').CollectionItemFragment} CollectionItemFragment */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
