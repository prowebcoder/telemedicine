import {Form, Link, useActionData, data, redirect} from 'react-router';

/**
 * Loader: Redirects to /account if already logged in.
 */
export async function loader({context}) {
  if (await context.session.get('customerAccessToken')) {
    return redirect('/account');
  }
  return {};
}

/**
 * Action: Handles login form POST, calls Storefront API, stores access token in session.
 */
export async function action({request, context}) {
  const {session, storefront} = context;

  if (request.method !== 'POST') {
    return data({error: 'Method not allowed'}, {status: 405});
  }

  try {
    const form = await request.formData();
    const email = String(form.get('email') || '');
    const password = String(form.get('password') || '');

    if (!email || !password) {
      throw new Error('Please provide both email and password.');
    }

    const {customerAccessTokenCreate} = await storefront.mutate(CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION, {
      variables: {input: {email, password}},
    });

    if (customerAccessTokenCreate?.customerUserErrors?.length) {
      throw new Error(customerAccessTokenCreate.customerUserErrors[0].message);
    }

    if (!customerAccessTokenCreate?.customerAccessToken) {
      throw new Error('Login failed. Please try again.');
    }

    session.set('customerAccessToken', customerAccessTokenCreate.customerAccessToken);

    return redirect('/account');
  } catch (error) {
    return data({error: error.message}, {status: 400});
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
 * Login Form UI
 */
export default function Login() {
  const action = useActionData();

  return (
    <div className="account-login">
      <h1>Sign in to your account</h1>
      <Form method="POST">
        <label>
          Email
          <input name="email" type="email" required autoComplete="email" />
        </label>
        <label>
          Password
          <input name="password" type="password" required autoComplete="current-password" />
        </label>
        {action?.error && <p style={{color: 'red'}}>{action.error}</p>}
        <button type="submit">Sign in</button>
      </Form>
      <p>
        <Link to="/account/recover">Forgot password?</Link>
      </p>
      <p>
        <Link to="/account/register">Create account</Link>
      </p>
    </div>
  );
}