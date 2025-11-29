import {useLoaderData, Link} from 'react-router';
import {getPaginationVariables, Image} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import { ProductItem } from '~/components/ProductItem';

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

  return (
    <div className=" max-w-7xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="collections-header">
        <h1>Browse products available without consultation</h1>
      </div>

      {/* Collections Grid */}
      <div className="collections-grid">
        {collections.nodes.map((collection, index) => (
          <CollectionBlock
            key={collection.id}
            collection={collection}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Render each collection with its products
 */
function CollectionBlock({collection, index}) {
  return (
    <section className="collection-section" key={collection.id}>
      
      {/* Collection Header */}
      <div className="collection-header">
        <h2 className="collection-title">{collection.title}</h2>

        <Link 
          to={`/collections/${collection.handle}`}
          className="view-all-link"
          prefetch="intent"
        >
          See all →
        </Link>
      </div>

      {/* Products Grid */}
      {collection?.products?.nodes?.length > 0 && (
        <div className="products-grid">
          {collection.products.nodes.map((product, i) => (
            <ProductItem
              key={product.id}
              product={product}
              loading={i < 4 ? 'eager' : undefined}
            />
          ))}
        </div>
      )}
    </section>
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
