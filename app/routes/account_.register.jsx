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
 * Action: Handles registration form POST, creates new customer account.
 */
export async function action({ request, context }) {
  const { session, storefront } = context;

  if (request.method !== 'POST') {
    return data({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const form = await request.formData();
    const firstName = String(form.get('firstName') || '');
    const lastName = String(form.get('lastName') || '');
    const email = String(form.get('email') || '');
    const password = String(form.get('password') || '');
    const dob = String(form.get('dob') || '');
    const state = String(form.get('state') || '');
    const gender = String(form.get('gender') || '');
    const phone = String(form.get('phone') || '');

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      throw new Error('Please fill in all required fields.');
    }

    // Create customer
    const { customerCreate } = await storefront.mutate(
      CUSTOMER_CREATE_MUTATION,
      {
        variables: {
          input: {
            firstName,
            lastName,
            email,
            password,
            acceptsMarketing: true,
          },
        },
      },
    );

    if (customerCreate?.customerUserErrors?.length) {
      throw new Error(customerCreate.customerUserErrors[0].message);
    }

    if (!customerCreate?.customer) {
      throw new Error('Registration failed. Please try again.');
    }

    // Log the customer in immediately after registration
    const { customerAccessTokenCreate } = await storefront.mutate(
      CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION,
      {
        variables: { input: { email, password } },
      },
    );

    if (customerAccessTokenCreate?.customerAccessToken) {
      session.set('customerAccessToken', customerAccessTokenCreate.customerAccessToken);
    }

    return redirect('/account');
  } catch (error) {
    return data({ error: error.message }, { status: 400 });
  }
}

const CUSTOMER_CREATE_MUTATION = `#graphql
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
        email
        firstName
        lastName
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

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
 * Registration Form UI (TailwindCSS)
 */
export default function Register() {
  const action = useActionData();

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      {/* MAIN CENTER CONTENT */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* LEFT: Registration Form */}
          <div className="w-full max-w-[430px] mx-auto lg:mx-0">
            <div className="mb-10">
              <h1 className="text-[40px] font-bold leading-[48px] tracking-[-0.4px] mb-4">
                Let's get started
              </h1>
              <p className="text-[15px] text-gray-600">
                This helps us connect you with providers in your area and personalize your care.
              </p>
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-200 mb-10" />

            <Form method="POST" className="space-y-6">
              {/* Full Name */}
              <div className="space-y-2">
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Enter full name"
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 h-[52px] focus:outline-none focus:ring-2 focus:ring-gray-300 text-[15px]"
                />
              </div>

              {/* Email */}
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

              {/* Password */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="new-password"
                  placeholder="Enter password"
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 h-[52px] focus:outline-none focus:ring-2 focus:ring-gray-300 text-[15px]"
                />
              </div>

              {/* Date of Birth */}
              <div className="space-y-2">
                <label htmlFor="dob" className="block text-sm font-medium text-gray-700">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  id="dob"
                  name="dob"
                  type="text"
                  required
                  placeholder="DD/MM/YYYY"
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 h-[52px] focus:outline-none focus:ring-2 focus:ring-gray-300 text-[15px]"
                />
              </div>

              {/* State */}
              <div className="space-y-2">
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                  Where do you currently call home? <span className="text-red-500">*</span>
                </label>
                <select
                  id="state"
                  name="state"
                  required
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 h-[52px] focus:outline-none focus:ring-2 focus:ring-gray-300 text-[15px] text-gray-400"
                  defaultValue=""
                >
                  <option value="" disabled>Select state</option>
                  <option value="AL">Alabama</option>
                  <option value="AK">Alaska</option>
                  <option value="AZ">Arizona</option>
                  <option value="AR">Arkansas</option>
                  <option value="CA">California</option>
                  <option value="CO">Colorado</option>
                  <option value="CT">Connecticut</option>
                  <option value="DE">Delaware</option>
                  <option value="FL">Florida</option>
                  <option value="GA">Georgia</option>
                  <option value="HI">Hawaii</option>
                  <option value="ID">Idaho</option>
                  <option value="IL">Illinois</option>
                  <option value="IN">Indiana</option>
                  <option value="IA">Iowa</option>
                  <option value="KS">Kansas</option>
                  <option value="KY">Kentucky</option>
                  <option value="LA">Louisiana</option>
                  <option value="ME">Maine</option>
                  <option value="MD">Maryland</option>
                  <option value="MA">Massachusetts</option>
                  <option value="MI">Michigan</option>
                  <option value="MN">Minnesota</option>
                  <option value="MS">Mississippi</option>
                  <option value="MO">Missouri</option>
                  <option value="MT">Montana</option>
                  <option value="NE">Nebraska</option>
                  <option value="NV">Nevada</option>
                  <option value="NH">New Hampshire</option>
                  <option value="NJ">New Jersey</option>
                  <option value="NM">New Mexico</option>
                  <option value="NY">New York</option>
                  <option value="NC">North Carolina</option>
                  <option value="ND">North Dakota</option>
                  <option value="OH">Ohio</option>
                  <option value="OK">Oklahoma</option>
                  <option value="OR">Oregon</option>
                  <option value="PA">Pennsylvania</option>
                  <option value="RI">Rhode Island</option>
                  <option value="SC">South Carolina</option>
                  <option value="SD">South Dakota</option>
                  <option value="TN">Tennessee</option>
                  <option value="TX">Texas</option>
                  <option value="UT">Utah</option>
                  <option value="VT">Vermont</option>
                  <option value="VA">Virginia</option>
                  <option value="WA">Washington</option>
                  <option value="WV">West Virginia</option>
                  <option value="WI">Wisconsin</option>
                  <option value="WY">Wyoming</option>
                </select>
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                  What's your gender <span className="text-red-500">*</span>
                </label>
                <select
                  id="gender"
                  name="gender"
                  required
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 h-[52px] focus:outline-none focus:ring-2 focus:ring-gray-300 text-[15px] text-gray-400"
                  defaultValue=""
                >
                  <option value="" disabled>Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="non-binary">Non-binary</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Mobile Phone */}
              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Mobile Phone <span className="text-red-500">*</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  placeholder="(000) 000 0000"
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 h-[52px] focus:outline-none focus:ring-2 focus:ring-gray-300 text-[15px]"
                />
              </div>

              {/* Error Message */}
              {action?.error && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">
                  {action.error}
                </div>
              )}

              {/* Create Account Button */}
              <button
                type="submit"
                className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-full py-4 text-center font-medium text-[15px] transition-colors duration-200 mt-8"
              >
                Create account
              </button>

              <p className="text-center text-[15px] text-gray-600">
                Already have an account?{' '}
                <Link
                  to="/account/login"
                  className="font-medium text-gray-900 hover:underline"
                >
                  Login
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
                  href="/account/register?provider=google"
                  className="flex items-center justify-center gap-3 w-full border border-gray-200 rounded-full px-5 py-3.5 hover:bg-gray-50 transition-colors duration-200"
                >
                  <img src="/icons/google.svg" alt="Google" className="w-5 h-5" />
                  <span className="text-sm font-medium text-gray-800">
                    Sign up with Google
                  </span>
                </a>

                <a
                  href="/account/register?provider=apple"
                  className="flex items-center justify-center gap-3 w-full border border-gray-200 rounded-full px-5 py-3.5 hover:bg-gray-50 transition-colors duration-200"
                >
                  <img src="/icons/apple.svg" alt="Apple" className="w-5 h-5" />
                  <span className="text-sm font-medium text-gray-800">
                    Sign up with Apple
                  </span>
                </a>
              </div>
            </Form>
          </div>

          {/* RIGHT: App Promo with Phone Image */}
          <div className="w-full max-w-[430px] mx-auto lg:mx-0">
            <div className="space-y-8">
              {/* Phone Image */}
              <div className="flex justify-center">
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
                  className="flex items-center justify-center gap-4 border border-gray-200 rounded-lg px-5 py-4 hover:bg-gray-50 transition-colors duration-200 w-full"
                >
                  <img src="/icons/app-store.svg" alt="App Store" className="w-10 h-10" />
                  <div className="text-left">
                    <div className="text-xs text-gray-400">Download it from</div>
                    <div className="text-sm font-semibold text-gray-900">APP STORE</div>
                  </div>
                </a>

                <a
                  href="#"
                  className="flex items-center justify-center gap-4 border border-gray-200 rounded-lg px-5 py-4 hover:bg-gray-50 transition-colors duration-200 w-full"
                >
                  <img src="/icons/play-store.svg" alt="Google Play" className="w-10 h-10" />
                  <div className="text-left">
                    <div className="text-xs text-gray-400">Download it from</div>
                    <div className="text-sm font-semibold text-gray-900">GOOGLE PLAY</div>
                  </div>
                </a>
              </div>

              {/* QR Code Section */}
              <div className="flex items-center gap-6 border-t border-gray-100 pt-8 justify-start">
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