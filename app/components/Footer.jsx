import {Suspense} from 'react';
import {Await, NavLink} from 'react-router';

/**
 * @param {FooterProps}
 */
export function Footer({footer: footerPromise, header, publicStoreDomain}) {
  return (
    <Suspense>
      <Await resolve={footerPromise}>
        {(footer) => (
          <footer className="footer">
            {/* Top CTA Section */}
            <div className="bg-gray-900 text-white py-12 px-6">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-3">
                  Ready to put your health first?
                </h2>
                <p className="text-lg mb-6">No insurance required</p>
                
                {/* Two main buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 mt-4">
                  <button className="bg-transparent border border-white text-white px-8 py-3 rounded font-semibold hover:bg-white hover:text-blue-600 transition-colors rounded-full">
                    Begin Consultation
                  </button>
                 
                </div>
              </div>
            </div>

            {/* Main Footer Links */}
            <div className="bg-gray-900 text-white py-12 px-6">
              <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                {/* Get the free app - First Column */}
                <div>
                  <h3 className="font-bold text-white mb-4 text-sm">Get the free app</h3>
                  <div className="space-y-2">
                   
                    <div className="flex flex-col gap-3">
                     
                      <img src="https://cdn.shopify.com/s/files/1/0942/7891/0261/files/Google_Store_Link.png?v=1764434979" alt="Google Play Badge" className="w-100" />
                     <img src="https://cdn.shopify.com/s/files/1/0942/7891/0261/files/App_Store_Link.png?v=1764434979" alt="Google Play Badge" className="w-100" />
                    </div>
                  </div>
                </div>

                {/* NAVIGATION - Second Column */}
                <div>
                  <h3 className="font-bold text-white mb-4 text-sm">NAVIGATION</h3>
                  <ul className="space-y-2">
                    <li><a href="/" className="text-gray-300 hover:text-white transition-colors">Home</a></li>
                    <li><a href="/shop" className="text-gray-300 hover:text-white transition-colors">Shop</a></li>
                    <li><a href="/blog" className="text-gray-300 hover:text-white transition-colors">Blog</a></li>
                    <li><a href="/about" className="text-gray-300 hover:text-white transition-colors">About Us</a></li>
                    <li><a href="/careers" className="text-gray-300 hover:text-white transition-colors">Careers</a></li>
                    <li><a href="/faq" className="text-gray-300 hover:text-white transition-colors">FAQ</a></li>
                  </ul>
                </div>

                {/* TREATMENTS - Third Column */}
                <div>
                  <h3 className="font-bold text-white mb-4 text-sm">TREATMENTS</h3>
                  <ul className="space-y-2">
                    <li><a href="/weight-loss" className="text-gray-300 hover:text-white transition-colors">Weight Loss & Sculpting</a></li>
                    <li><a href="/sexual-health" className="text-gray-300 hover:text-white transition-colors">Sexual Health</a></li>
                    <li><a href="/mental-health" className="text-gray-300 hover:text-white transition-colors">Mental Health</a></li>
                    <li><a href="/sleep" className="text-gray-300 hover:text-white transition-colors">Sleep & Recovery</a></li>
                    <li><a href="/energy" className="text-gray-300 hover:text-white transition-colors">Energy & Longevity</a></li>
                    <li><a href="/skin-hair" className="text-gray-300 hover:text-white transition-colors">Skin, Hair & Beauty</a></li>
                  </ul>
                </div>

                {/* LEGAL - Fourth Column */}
                <div>
                  <h3 className="font-bold text-white mb-4 text-sm">LEGAL</h3>
                  <ul className="space-y-2">
                    <li><a href="/general-info" className="text-gray-300 hover:text-white transition-colors">General Info</a></li>
                    <li><a href="/privacy-policy" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a></li>
                    <li><a href="/terms-of-service" className="text-gray-300 hover:text-white transition-colors">Terms of Service</a></li>
                    <li><a href="/terms-of-provider" className="text-gray-300 hover:text-white transition-colors">Terms of Provider</a></li>
                    <li><a href="/medical-disclaimer" className="text-gray-300 hover:text-white transition-colors">Medical Disclaimer</a></li>
                    <li><a href="/hippa-compliance" className="text-gray-300 hover:text-white transition-colors">HIPAA Compliance</a></li>
                  </ul>
                </div>

                {/* TALK TO US - Fifth Column */}
                <div>
                  <h3 className="font-bold text-white mb-4 text-sm">TALK TO US</h3>
                  <ul className="space-y-2">
                    <li><a href="mailto:support@email.com" className="text-gray-300 hover:text-white transition-colors">support@email.com</a></li>
                    <li><a href="https://facebook.com" className="text-gray-300 hover:text-white transition-colors">Facebook</a></li>
                    <li><a href="https://linkedin.com" className="text-gray-300 hover:text-white transition-colors">LinkedIn</a></li>
                    <li><a href="https://instagram.com" className="text-gray-300 hover:text-white transition-colors">Instagram</a></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="bg-gray-800 py-4 px-6">
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
                <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 mb-3 md:mb-0">
                  <span className="text-white font-semibold text-center md:text-left">COMPANY LOGO</span>
                  <span className="text-gray-400 text-sm text-center md:text-left">[Company] 2025. All rights reserved.</span>
                </div>
                <div>
                  <a href="https://linkedin.com" className="text-gray-400 hover:text-white transition-colors font-bold text-xl">
                    in
                  </a>
                </div>
              </div>
            </div>

            {/* Keep existing dynamic menu as fallback */}
            {footer?.menu && header.shop.primaryDomain?.url && (
              <div className="hidden">
                <FooterMenu
                  menu={footer.menu}
                  primaryDomainUrl={header.shop.primaryDomain.url}
                  publicStoreDomain={publicStoreDomain}
                />
              </div>
            )}
          </footer>
        )}
      </Await>
    </Suspense>
  );
}

/**
 * @param {{
 *   menu: FooterQuery['menu'];
 *   primaryDomainUrl: FooterProps['header']['shop']['primaryDomain']['url'];
 *   publicStoreDomain: string;
 * }}
 */
function FooterMenu({menu, primaryDomainUrl, publicStoreDomain}) {
  return (
    <nav className="footer-menu" role="navigation">
      {(menu || FALLBACK_FOOTER_MENU).items.map((item) => {
        if (!item.url) return null;
        // if the url is internal, we strip the domain
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        const isExternal = !url.startsWith('/');
        return isExternal ? (
          <a href={url} key={item.id} rel="noopener noreferrer" target="_blank">
            {item.title}
          </a>
        ) : (
          <NavLink
            end
            key={item.id}
            prefetch="intent"
            style={activeLinkStyle}
            to={url}
          >
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}

const FALLBACK_FOOTER_MENU = {
  id: 'gid://shopify/Menu/199655620664',
  items: [
    {
      id: 'gid://shopify/MenuItem/461633060920',
      resourceId: 'gid://shopify/ShopPolicy/23358046264',
      tags: [],
      title: 'Privacy Policy',
      type: 'SHOP_POLICY',
      url: '/policies/privacy-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633093688',
      resourceId: 'gid://shopify/ShopPolicy/23358013496',
      tags: [],
      title: 'Refund Policy',
      type: 'SHOP_POLICY',
      url: '/policies/refund-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633126456',
      resourceId: 'gid://shopify/ShopPolicy/23358111800',
      tags: [],
      title: 'Shipping Policy',
      type: 'SHOP_POLICY',
      url: '/policies/shipping-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633159224',
      resourceId: 'gid://shopify/ShopPolicy/23358079032',
      tags: [],
      title: 'Terms of Service',
      type: 'SHOP_POLICY',
      url: '/policies/terms-of-service',
      items: [],
    },
  ],
};

/**
 * @param {{
 *   isActive: boolean;
 *   isPending: boolean;
 * }}
 */
function activeLinkStyle({isActive, isPending}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'white',
  };
}

/**
 * @typedef {Object} FooterProps
 * @property {Promise<FooterQuery|null>} footer
 * @property {HeaderQuery} header
 * @property {string} publicStoreDomain
 */

/** @typedef {import('storefrontapi.generated').FooterQuery} FooterQuery */
/** @typedef {import('storefrontapi.generated').HeaderQuery} HeaderQuery */