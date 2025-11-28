// src/components/CartSummary.jsx
import {CartForm, Money} from '@shopify/hydrogen';
import {useEffect, useRef} from 'react';
import {useFetcher} from 'react-router';

/**
 * @param {CartSummaryProps}
 */
export function CartSummary({cart, layout}) {
  const isPage = layout === 'page';

  // PAGE LAYOUT = full card UI like PDF
  // ASIDE LAYOUT = keep compact style
  const containerClass = isPage
    ? "border rounded-lg p-6 bg-white shadow-md sticky top-20 space-y-4"
    : "cart-summary-aside space-y-3";

  return (
    <div aria-labelledby="cart-summary" className={containerClass}>
      
      {/* HEADER */}
      {isPage && (
        <h4 className="text-lg font-semibold mb-2">Order Summary</h4>
      )}

      {/* SUBTOTAL */}
      <dl className="flex justify-between text-sm py-1">
        <dt className="text-gray-600">Subtotal</dt>
        <dd className="font-medium text-gray-900">
          {cart?.cost?.subtotalAmount?.amount ? (
            <Money data={cart?.cost?.subtotalAmount} />
          ) : (
            '-'
          )}
        </dd>
      </dl>

      {/* DISCOUNTS */}
      <CartDiscounts discountCodes={cart?.discountCodes} />

      {/* GIFTCARDS */}
      <CartGiftCard giftCardCodes={cart?.appliedGiftCards} />

      {/* TOTAL (PDF style) */}
      <dl className="flex justify-between text-base font-semibold border-t pt-4 mt-2">
        <dt>Total</dt>
        <dd>
          {cart?.cost?.totalAmount?.amount ? (
            <Money data={cart?.cost?.totalAmount} />
          ) : (
            '-'
          )}
        </dd>
      </dl>

      {/* CHECKOUT BUTTON (PDF style) */}
      <CartCheckoutActions checkoutUrl={cart?.checkoutUrl} layout={layout} />
    </div>
  );
}

/**
 * Checkout Button — upgraded for PDF
 */
function CartCheckoutActions({checkoutUrl, layout}) {
  if (!checkoutUrl) return null;

  const isPage = layout === 'page';

  return (
    <div className="w-full">
      <a
        href={checkoutUrl}
        target="_self"
        className={
          isPage
            ? "block w-full text-center bg-black text-white py-3 rounded-full font-medium mt-3 hover:bg-gray-900 transition"
            : "text-sm underline mt-3 inline-block"
        }
      >
        {isPage ? "Proceed to Checkout" : "Continue to Checkout →"}
      </a>
    </div>
  );
}

/**
 * Discount Codes
 */
function CartDiscounts({discountCodes}) {
  const codes =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];

  return (
    <div className="space-y-2">
      {/* Existing discount(s) */}
      <dl hidden={!codes.length}>
        <div className="flex justify-between items-center text-sm text-green-700">
          <dt>Discount(s)</dt>

          <UpdateDiscountForm>
            <div className="cart-discount flex items-center gap-2">
              <code>{codes?.join(', ')}</code>
              <button className="text-red-600 underline text-xs">
                Remove
              </button>
            </div>
          </UpdateDiscountForm>
        </div>
      </dl>

      {/* Add discount code */}
      <UpdateDiscountForm discountCodes={codes}>
        <div className="flex gap-2">
          <input
            type="text"
            name="discountCode"
            placeholder="Discount code"
            className="border rounded px-2 py-1 flex-1 text-sm"
          />
          <button
            type="submit"
            className="text-sm bg-black text-white px-3 py-1 rounded"
          >
            Apply
          </button>
        </div>
      </UpdateDiscountForm>
    </div>
  );
}

/**
 * @param {{
 *   discountCodes?: string[];
 *   children: React.ReactNode;
 * }}
 */
function UpdateDiscountForm({discountCodes, children}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
    >
      {children}
    </CartForm>
  );
}

/**
 * Gift Card Logic — preserved exactly
 */
function CartGiftCard({giftCardCodes}) {
  const appliedGiftCardCodes = useRef([]);
  const giftCardCodeInput = useRef(null);
  const giftCardAddFetcher = useFetcher({key: 'gift-card-add'});

  useEffect(() => {
    if (giftCardAddFetcher.data) {
      giftCardCodeInput.current.value = '';
    }
  }, [giftCardAddFetcher.data]);

  function saveAppliedCode(code) {
    const formattedCode = code.replace(/\s/g, '');
    if (!appliedGiftCardCodes.current.includes(formattedCode)) {
      appliedGiftCardCodes.current.push(formattedCode);
    }
  }

  return (
    <div className="space-y-2">
      {/* Active Gift Cards */}
      {giftCardCodes && giftCardCodes.length > 0 && (
        <dl className="space-y-1">
          <dt className="text-sm font-medium">Gift Card(s)</dt>

          {giftCardCodes.map((giftCard) => (
            <RemoveGiftCardForm key={giftCard.id} giftCardId={giftCard.id}>
              <div className="cart-discount flex justify-between text-sm">
                <div>
                  <code>***{giftCard.lastCharacters}</code>
                </div>
                <button className="text-red-600 underline text-xs">
                  Remove
                </button>
              </div>
            </RemoveGiftCardForm>
          ))}
        </dl>
      )}

      {/* Add Gift Card */}
      <UpdateGiftCardForm
        giftCardCodes={appliedGiftCardCodes.current}
        saveAppliedCode={saveAppliedCode}
        fetcherKey="gift-card-add"
      >
        <div className="flex gap-2">
          <input
            type="text"
            name="giftCardCode"
            placeholder="Gift card code"
            ref={giftCardCodeInput}
            className="border rounded px-2 py-1 flex-1 text-sm"
          />
          <button
            type="submit"
            disabled={giftCardAddFetcher.state !== 'idle'}
            className="text-sm bg-black text-white px-3 py-1 rounded"
          >
            Apply
          </button>
        </div>
      </UpdateGiftCardForm>
    </div>
  );
}

/**
 * Update Gift Card Form — unchanged logic
 */
function UpdateGiftCardForm({
  giftCardCodes,
  saveAppliedCode,
  fetcherKey,
  children,
}) {
  return (
    <CartForm
      fetcherKey={fetcherKey}
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesUpdate}
      inputs={{
        giftCardCodes: giftCardCodes || [],
      }}
    >
      {(fetcher) => {
        const code = fetcher.formData?.get('giftCardCode');
        if (code && saveAppliedCode) {
          saveAppliedCode(code);
        }
        return children;
      }}
    </CartForm>
  );
}

/**
 * Remove Gift Card Form — unchanged logic
 */
function RemoveGiftCardForm({giftCardId, children}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesRemove}
      inputs={{
        giftCardCodes: [giftCardId],
      }}
    >
      {children}
    </CartForm>
  );
}

/**
 * @typedef {{
 *   cart: OptimisticCart<CartApiQueryFragment | null>;
 *   layout: CartLayout;
 * }} CartSummaryProps
 */

/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
/** @typedef {import('~/components/CartMain').CartLayout} CartLayout */
/** @typedef {import('@shopify/hydrogen').OptimisticCart} OptimisticCart */
/** @typedef {import('react-router').FetcherWithComponents} FetcherWithComponents */
