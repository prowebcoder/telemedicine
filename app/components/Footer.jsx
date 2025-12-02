import { Suspense } from 'react';
import { Await, NavLink } from 'react-router';

/**
 * @param {FooterProps}
 */
export function Footer({ footer: footerPromise, header, publicStoreDomain }) {
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
                <div className="flex space-x-4">
                 <a href="https://facebook.com" className="text-gray-400 hover:text-white transition-colors font-bold text-xl w-4 h-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="white"
                      viewBox="0 0 448 512">

                      <path
                        d="M100.3 448H7.4V148.9h92.9zM53.8 108.1C24.1 108.1 0 83.5 0 53.8a53.8 53.8 0 0 1 107.6 0c0 29.7-24.1 54.3-53.8 54.3zM447.9 448h-92.7V302.4c0-34.7-.7-79.2-48.3-79.2-48.3 0-55.7 37.7-55.7 76.7V448h-92.8V148.9h89.1v40.8h1.3c12.4-23.5 42.7-48.3 87.9-48.3 94 0 111.3 61.9 111.3 142.3V448z" />
                    </svg>
                  </a>
                  <a href="https://facebook.com" className="text-gray-400 hover:text-white transition-colors font-bold text-xl w-3 h-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="white"
                      viewBox="0 0 320 512">

                      <path
                        d="M80 299.3V512H196V299.3h86.5l18-97.8H196V166.9c0-51.7 20.3-71.5 72.7-71.5c16.3 0 29.4 .4 37 1.2V7.9C291.4 4 256.4 0 236.2 0C129.3 0 80 50.5 80 159.4v42.1H14v97.8H80z" />
                    </svg>
                  </a>
                  <a href="https://instagram.com" className="text-gray-400 hover:text-white transition-colors font-bold text-xl w-4 h-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="white"
                      viewBox="0 0 448 512">

                      <path
                        d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
                    </svg>
                  </a>
                 <a href="https://google.com" className="text-gray-400 hover:text-white transition-colors font-bold text-xl w-4 h-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="white"
                      viewBox="0 0 488 512">

                      <path
                        d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
                    </svg>
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
function FooterMenu({ menu, primaryDomainUrl, publicStoreDomain }) {
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
function activeLinkStyle({ isActive, isPending }) {
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