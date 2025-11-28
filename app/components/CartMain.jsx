// src/components/CartMain.jsx
import {useOptimisticCart} from '@shopify/hydrogen';
import {Link} from 'react-router';
import {useAside} from '~/components/Aside';
import {CartLineItem} from '~/components/CartLineItem';
import {CartSummary} from './CartSummary';

/**
 * The main cart component that displays the cart items and summary.
 * It is used by both the /cart route and the cart aside dialog.
 * NOTHING removed — only page layout improved.
 *
 * @param {CartMainProps}
 */
export function CartMain({layout, cart: originalCart}) {
  const cart = useOptimisticCart(originalCart);

  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const withDiscount =
    cart &&
    Boolean(cart?.discountCodes?.filter((code) => code.applicable)?.length);
  const className = `cart-main ${withDiscount ? 'with-discount' : ''}`;
  const cartHasItems = cart?.totalQuantity ? cart.totalQuantity > 0 : false;

  /**
   * IMPORTANT:
   * Layout = "aside" → keep original compact aside layout
   * Layout = "page"  → apply full PDF layout styling
   */
  const isPage = layout === 'page';

  return (
    <div className={className}>
      {/* Empty State */}
      <CartEmpty hidden={linesCount} layout={layout} />

      {/* PAGE LAYOUT */}
      {isPage ? (
        <div className="max-w-[1200px] mx-auto px-6 py-10">
          {cartHasItems && (
            <h1 className="text-2xl font-semibold mb-8">Shopping cart</h1>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* LEFT COLUMN: Cart Items */}
            <div className="lg:col-span-8 space-y-4">
              <ul>
                {(cart?.lines?.nodes ?? []).map((line) => (
                  <CartLineItem key={line.id} line={line} layout={layout} />
                ))}
              </ul>
            </div>

            {/* RIGHT COLUMN: Summary */}
            <div className="lg:col-span-4">
              {cartHasItems && <CartSummary cart={cart} layout={layout} />}
            </div>
          </div>
        </div>
      ) : (
        /* ASIDE LAYOUT — unchanged */
        <div className="cart-details">
          <div aria-labelledby="cart-lines">
            <ul>
              {(cart?.lines?.nodes ?? []).map((line) => (
                <CartLineItem key={line.id} line={line} layout={layout} />
              ))}
            </ul>
          </div>
          {cartHasItems && <CartSummary cart={cart} layout={layout} />}
        </div>
      )}
    </div>
  );
}

/**
 * Cart Empty State — kept 100% unchanged
 */
function CartEmpty({hidden = false}) {
  const {close} = useAside();
  return (
    <div hidden={hidden}>
      <br />
      <p>
        Looks like you haven&rsquo;t added anything yet, let&rsquo;s get you
        started!
      </p>
      <br />
      <Link to="/collections" onClick={close} prefetch="viewport">
        Continue shopping →
      </Link>
    </div>
  );
}

/** @typedef {'page' | 'aside'} CartLayout */
/**
 * @typedef {{
 *   cart: CartApiQueryFragment | null;
 *   layout: CartLayout;
 * }} CartMainProps
 */

/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
