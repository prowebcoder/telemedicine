// app/routes/collections.$handle.jsx
import {redirect, useLoaderData} from 'react-router';
import {getPaginationVariables, Analytics} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {ProductItem} from '~/components/ProductItem';

/**
 * @type {Route.MetaFunction}
 */
export const meta = ({data}) => {
  return [{title: `Hydrogen | ${data?.collection.title ?? ''} Collection`}];
};

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
async function loadCriticalData({context, params, request}) {
  const {handle} = params;
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });

  if (!handle) {
    throw redirect('/collections');
  }

  const [{collection}] = await Promise.all([
    storefront.query(COLLECTION_QUERY, {
      variables: {handle, ...paginationVariables},
    }),
  ]);

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }

  redirectIfHandleIsLocalized(request, {handle, data: collection});

  return {collection};
}

/**
 * Deferred load data
 */
function loadDeferredData() {
  return {};
}

export default function Collection() {
  const {collection} = useLoaderData();

  return (
    <div className=" max-w-7xl mx-auto px-4 py-8 mx-auto ">

      {/* PAGE TITLE */}
      <div className="collections-header text-center mb-10">
        <h1 className="text-3xl font-semibold">{collection.title}</h1>

        {collection?.description && (
          <p className="text-gray-600  mx-auto mt-2 text-center">
            {collection.description}
          </p>
        )}

        {/* SEARCH BAR */}
        <div className="mt-6 max-w-xl mx-auto">
          <input
            type="text"
              style={{borderRadius:"50px"}}
            placeholder="Search product by name..."
            className="w-full border rounded-full px-5 py-3"
          />
        </div>
      </div>

      {/* PRODUCT GRID */}
      <PaginatedResourceSection
        connection={collection.products}
        resourcesClassName="products-grid grid gap-6 sm:grid-cols-2 md:grid-cols-3"
      >
        {({node: product, index}) => (
          <ProductItem
            key={product.id}
            product={product}
            loading={index < 8 ? 'eager' : undefined}
          />
        )}
      </PaginatedResourceSection>

      {/* TESTIMONIALS SECTION */}
      <section className="testimonials-section mt-16">
        <h2 className="text-2xl text-center font-semibold mb-8">
          What others are saying
        </h2>

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-6">

          {/* Testimonial 1 */}
          <div className="testimonial-card p-6 border rounded-xl bg-white shadow-sm">
            <div className="avatar-circle w-12 h-12 rounded-full bg-gray-200 mb-3" />
            <h3 className="font-semibold text-lg">Acne & Skin Clearing Gel</h3>
            <p className="text-sm text-gray-700 mt-2 leading-relaxed">
              “I’ve tried everything for my skin, but this clearing gel actually
              works. My breakouts are finally under control, and my skin feels
              smoother too.”
            </p>
            <strong className="block mt-3">— Emily R.</strong>
          </div>

          {/* Testimonial 2 */}
          <div className="testimonial-card p-6 border rounded-xl bg-white shadow-sm">
            <div className="avatar-circle w-12 h-12 rounded-full bg-gray-200 mb-3" />
            <h3 className="font-semibold text-lg">Immune Boost Multivitamin</h3>
            <p className="text-sm text-gray-700 mt-2 leading-relaxed">
              “These gummies are actually amazing. I feel more energized, and I
              love that there’s no weird aftertaste like others I’ve tried.”
            </p>
            <strong className="block mt-3">— Jasmine S.</strong>
          </div>

        </div>
      </section>

      {/* NEWSLETTER SECTION */}
      <section className="newsletter-section mt-16 text-center">
        <h2 className="text-xl font-semibold">Healthy newsletter</h2>
        <p className="text-sm text-gray-600 mt-1">
          No spam. Just real health stuff.
        </p>

        <div className="mt-5 max-w-md mx-auto">
          <input
            placeholder="Enter your email"
            style={{borderRadius:"50px"}}
            className="w-full border rounded-full important px-8 py-3"
          />
        </div>
      </section>

      {/* HYDROGEN ANALYTICS */}
      <Analytics.CollectionView
        data={{
          collection: {
            id: collection.id,
            handle: collection.handle,
          },
        }}
      />
    </div>
  );
}

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }

  fragment ProductItem on Product {
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
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
  }
`;

const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}

  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {

    collection(handle: $handle) {
      id
      handle
      title
      description

      products(
        first: $first
        last: $last
        before: $startCursor
        after: $endCursor
      ) {
        nodes {
          ...ProductItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          startCursor
          endCursor
        }
      }
    }
  }
`;

/** @typedef {import('./+types/collections.$handle').Route} Route */
/** @typedef {import('storefrontapi.generated').ProductItemFragment} ProductItemFragment */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
