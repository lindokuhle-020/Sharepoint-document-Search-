import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import '../styles/SignIn.css';

/** The four-square Microsoft mark, drawn inline (no external asset needed). */
function MicrosoftMark() {
  return (
    <span className="ms-mark" aria-hidden="true">
      <span className="ms-mark__red" />
      <span className="ms-mark__green" />
      <span className="ms-mark__blue" />
      <span className="ms-mark__yellow" />
    </span>
  );
}

/**
 * Sign-in page — Microsoft Entra ID single sign-on.
 * After signing in the user lands on the search page.
 * Runs in demo mode until MSAL is configured (see src/auth/authConfig.js).
 */
function SignIn() {
  const { signIn, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [working, setWorking] = useState(false);

  const redirect = params.get('redirect') || '/search';

  const handleSignIn = async () => {
    setWorking(true);
    await signIn();
    navigate(redirect, { replace: true });
  };

  if (isAuthenticated) {
    return (
      <div className="container page">
        <div className="signin-card card">
          <h1>You are signed in</h1>
          <p>Your session is active. Continue to the search page.</p>
          <button type="button" className="btn btn-primary" onClick={() => navigate('/search')}>
            Go to search
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container page">
      <section className="signin-card card" aria-labelledby="signin-heading">
        <h1 id="signin-heading">Sign in</h1>
        <p className="signin-card__lead">
          Use your government Microsoft account to search the HR Document Library.
          Access is limited to KZN Treasury Human Resources staff, and your
          organisation&rsquo;s multi-factor authentication policies apply.
        </p>

        <button
          type="button"
          className="ms-signin-btn"
          onClick={handleSignIn}
          disabled={working}
        >
          <MicrosoftMark />
          {working ? 'Signing in…' : 'Sign in with Microsoft'}
        </button>

        <p className="signin-card__help">
          No account? Contact your departmental IT administrator to be added to the
          government Microsoft 365 tenant.
        </p>

        <div className="notice signin-card__demo">
          <h3>Demo mode</h3>
          <p>
            Entra ID is not connected yet — signing in uses a placeholder account so
            the signed-in experience can be reviewed. Configure{' '}
            <code>src/auth/authConfig.js</code> to go live.
          </p>
        </div>
      </section>
    </div>
  );
}

export default SignIn;
