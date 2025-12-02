import { Form, Link, useActionData, data, redirect } from 'react-router';

/**
 * Loader: Redirects to /account if already logged in.
 */
export async function loader({ context }) {
  if (await context.session.get('customerAccessToken')) {
    return redirect('/account');
  }
  return {};
}

/**
 * Action: Handles login form POST, calls Storefront API, stores access token in session.
 */
export async function action({ request, context }) {
  const { session, storefront } = context;

  if (request.method !== 'POST') {
    return data({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const form = await request.formData();
    const email = String(form.get('email') || '');
    const password = String(form.get('password') || '');

    if (!email || !password) {
      throw new Error('Please provide both email and password.');
    }

    const { customerAccessTokenCreate } = await storefront.mutate(
      CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION,
      {
        variables: { input: { email, password } },
      },
    );

    if (customerAccessTokenCreate?.customerUserErrors?.length) {
      throw new Error(customerAccessTokenCreate.customerUserErrors[0].message);
    }

    if (!customerAccessTokenCreate?.customerAccessToken) {
      throw new Error('Login failed. Please try again.');
    }

    session.set('customerAccessToken', customerAccessTokenCreate.customerAccessToken);

    return redirect('/account');
  } catch (error) {
    return data({ error: error.message }, { status: 400 });
  }
}

const CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION = `#graphql
  mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

/**
 * Login Form UI (TailwindCSS)
 */
export default function Login() {
  const action = useActionData();

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      {/* MAIN CENTER CONTENT */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* LEFT: Login Form */}
          <div className="w-full max-w-[430px] mx-auto lg:mx-0">
            <h1 className="text-[40px] font-bold leading-[48px] tracking-[-0.4px] mb-10">
              Welcome back,
            </h1>

            <Form method="POST" className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="Enter email"
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 h-[52px] focus:outline-none focus:ring-2 focus:ring-gray-300 text-[15px]"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <Link
                    to="/account/recover"
                    className="text-sm text-gray-500 hover:text-gray-700 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="Enter password"
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 h-[52px] focus:outline-none focus:ring-2 focus:ring-gray-300 text-[15px]"
                />
              </div>

              {action?.error && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">
                  {action.error}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-full py-4 text-center font-medium text-[15px] transition-colors duration-200"
              >
                Login
              </button>

              <p className="text-center text-[15px] text-gray-600">
                Don't have an account?{' '}
                <Link
                  to="/account/register"
                  className="font-medium text-gray-900 hover:underline"
                >
                  Create an account
                </Link>
              </p>

              {/* Divider */}
              <div className="flex items-center gap-4 my-8">
                <span className="flex-1 h-px bg-gray-200" />
                <span className="text-sm text-gray-400">OR</span>
                <span className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Social Buttons */}
              <div className="space-y-4">
                <a
                  href="/account/login?provider=google"
                  className="flex items-center justify-center gap-3 w-full border border-gray-200 rounded-full px-5 py-3.5 hover:bg-gray-50 transition-colors duration-200"
                >
                  <img src="/icons/google.svg" alt="Google" className="w-5 h-5" />
                  <span className="text-sm font-medium text-gray-800">
                    Continue with Google
                  </span>
                </a>

                <a
                  href="/account/login?provider=apple"
                  className="flex items-center justify-center gap-3 w-full border border-gray-200 rounded-full px-5 py-3.5 hover:bg-gray-50 transition-colors duration-200"
                >
                  <img src="/icons/apple.svg" alt="Apple" className="w-5 h-5" />
                  <span className="text-sm font-medium text-gray-800">
                    Continue with Apple
                  </span>
                </a>
              </div>
            </Form>
          </div>

          {/* RIGHT: App Promo with Phone Image */}
          <div className="w-full max-w-[430px] mx-auto lg:mx-0">
            <div className="space-y-8">
              {/* Phone Image */}
              <div className="flex align-center justify-center ">
                <img 
                  src="/images/phone.png" 
                  alt="Phone" 
                  className="w-[180px] h-auto transform rotate-6 drop-shadow-lg"
                />
              </div>

              <div className="text-left lg:text-center">
                <h2 className="text-2xl font-bold tracking-tight mb-2">GET THE APP</h2>
                <p className="text-sm text-gray-500">Download for a faster mobile experience</p>
              </div>

              {/* Download Buttons */}
              <div className="space-y-4">
                <a
                  href="#"
                  className="flex items-center justify-center align-center gap-4 border border-gray-200 rounded-lg px-5 py-4 hover:bg-gray-50 transition-colors duration-200 w-full "
                >
                  <img src="/icons/app-store.svg" alt="App Store" className="w-10 h-10" />
                  <div className="text-left">
                    <div className="text-xs text-gray-400">Download it from</div>
                    <div className="text-sm font-semibold text-gray-900">APP STORE</div>
                  </div>
                </a>

                <a
                  href="#"
                  className="flex items-center justify-center gap-4 border border-gray-200 rounded-lg px-5 py-4 hover:bg-gray-50 transition-colors duration-200 w-full "
                >
                  <img src="/icons/play-store.svg" alt="Google Play" className="w-10 h-10" />
                  <div className="text-left">
                    <div className="text-xs text-gray-400">Download it from</div>
                    <div className="text-sm font-semibold text-gray-900">GOOGLE PLAY</div>
                  </div>
                </a>
              </div>

              {/* QR Code Section */}
              <div className="flex items-center gap-6 border-t border-gray-100 pt-8 justify-start ">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 border border-gray-200 rounded-lg flex items-center justify-center bg-white">
                    {/* Replace with actual QR code image if available */}
                    <div className="text-xs text-gray-400">QR Code</div>
                  </div>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed text-left">
                  Scan to download directly on mobile
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}