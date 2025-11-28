// src/components/CartLineItem.jsx
import {CartForm, Image} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {Link} from 'react-router';
import {ProductPrice} from './ProductPrice';
import {useAside} from './Aside';

/**
 * A single line item in the cart. All logic preserved exactly as-is.
 * Only styling / layout updated to match PDF (card-style layout).
 *
 * @param {{
 *   layout: CartLayout;
 *   line: CartLine;
 * }}
 */
export function CartLineItem({layout, line}) {
  const {id, merchandise} = line;
  const {product, title, image, selectedOptions} = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);
  const {close} = useAside();

  return (
    <li
      key={id}
      className="
        cart-line 
        flex gap-4 
        border rounded-lg 
        p-4 
        bg-white 
        shadow-sm 
        items-start
      "
    >
      {/* IMAGE */}
      <div className="w-24 h-24 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
        {image ? (
          <Image
            alt={title}
            aspectRatio="1/1"
            data={image}
            height={100}
            loading="lazy"
            width={100}
          />
        ) : (
          <div className="w-full h-full bg-gray-200" />
        )}
      </div>

      {/* RIGHT SIDE: PRODUCT DETAILS */}
      <div className="flex-1 flex flex-col justify-between">
        {/* Title + Price + Options */}
        <div>
          <Link
            prefetch="intent"
            to={lineItemUrl}
            onClick={() => {
              if (layout === 'aside') close();
            }}
          >
            <p className="text-base font-semibold text-black mb-1">
              {product.title}
            </p>
          </Link>

          {/* Product Type (Category) */}
          {product?.productType && (
            <p className="text-sm text-gray-500 mb-1">{product.productType}</p>
          )}

          {/* Price */}
          <div className="text-lg font-semibold text-black mb-2">
            <ProductPrice price={line?.cost?.totalAmount} />
          </div>

          {/* Selected Options */}
          {selectedOptions?.length > 0 && (
            <ul className="text-sm text-gray-600 space-y-0.5 mb-3">
              {selectedOptions.map((option) => (
                <li key={option.name}>
                  <small>
                    {option.name}: {option.value}
                  </small>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Quantity + Remove Row */}
        <div className="mt-auto">
          <CartLineQuantity line={line} />
        </div>
      </div>
    </li>
  );
}

/**
 * Provides the controls to update the quantity of a line item in the cart.
 * Existing logic untouched — only added Tailwind layout to match PDF.
 *
 * @param {{line: CartLine}}
 */
function CartLineQuantity({line}) {
  if (!line || typeof line?.quantity === 'undefined') return null;

  const {id: lineId, quantity, isOptimistic} = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  return (
    <div className="cart-line-quantity flex items-center gap-3 mt-2">
      {/* QUANTITY LABEL */}
      <span className="text-sm text-gray-700">Qty:</span>

      {/* DECREASE BUTTON */}
      <CartLineUpdateButton lines={[{id: lineId, quantity: prevQuantity}]}>
        <button
          aria-label="Decrease quantity"
          disabled={quantity <= 1 || !!isOptimistic}
          className="
            w-8 h-8 
            border rounded-md 
            flex items-center justify-center
            hover:bg-gray-100
          "
        >
          −
        </button>
      </CartLineUpdateButton>

      {/* QUANTITY DISPLAY */}
      <div className="px-3 py-1 border rounded-md text-sm">{quantity}</div>

      {/* INCREASE BUTTON */}
      <CartLineUpdateButton lines={[{id: lineId, quantity: nextQuantity}]}>
        <button
          aria-label="Increase quantity"
          disabled={!!isOptimistic}
          className="
            w-8 h-8 
            border rounded-md 
            flex items-center justify-center
            hover:bg-gray-100
          "
        >
          +
        </button>
      </CartLineUpdateButton>

      {/* REMOVE BUTTON */}
      <CartLineRemoveButton
        lineIds={[lineId]}
        disabled={!!isOptimistic}
      />
    </div>
  );
}

/**
 * Remove button — logic unchanged.
 *
 * @param {{lineIds: string[], disabled: boolean}}
 */
function CartLineRemoveButton({lineIds, disabled}) {
  return (
    <CartForm
      fetcherKey={getUpdateKey(lineIds)}
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{lineIds}}
    >
      <button
        disabled={disabled}
        type="submit"
        className="ml-4 text-sm text-red-600 underline"
      >
        Remove
      </button>
    </CartForm>
  );
}

/**
 * Quantity update button — logic unchanged.
 */
function CartLineUpdateButton({children, lines}) {
  const lineIds = lines.map((line) => line.id);

  return (
    <CartForm
      fetcherKey={getUpdateKey(lineIds)}
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{lines}}
    >
      {children}
    </CartForm>
  );
}

/**
 * Returns a unique key for update actions.
 */
function getUpdateKey(lineIds) {
  return [CartForm.ACTIONS.LinesUpdate, ...lineIds].join('-');
}

/** @typedef {OptimisticCartLine<CartApiQueryFragment>} CartLine */
/** @typedef {import('@shopify/hydrogen/storefront-api-types').CartLineUpdateInput} CartLineUpdateInput */
/** @typedef {import('~/components/CartMain').CartLayout} CartLayout */
/** @typedef {import('@shopify/hydrogen').OptimisticCartLine} OptimisticCartLine */
/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
