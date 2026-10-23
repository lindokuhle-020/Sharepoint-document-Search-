/**
 * Microsoft Entra ID (formerly Azure AD) configuration.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * HOW TO GO LIVE WITH ENTRA ID AUTHENTICATION
 * ────────────────────────────────────────────────────────────────────────────
 * 1. Install the Microsoft Authentication Library:
 *        npm install @azure/msal-browser @azure/msal-react
 *
 * 2. In the Microsoft Entra admin centre (entra.microsoft.com):
 *      - Go to Identity > Applications > App registrations > New registration
 *      - Name: "SharePoint Document Search"
 *      - Supported account types: "Accounts in this organizational directory only"
 *        (single-tenant — adjust if staff from multiple tenants must sign in)
 *
 * 3. Copy the "Application (client) ID" and "Directory (tenant) ID" from the
 *    overview page and paste them below.
 *
 * 4. Under Authentication > Add a platform > Single-page application (SPA):
 *      - Redirect URI:  http://localhost:3000   (development)
 *                       https://<your-domain>   (production)
 *      - Leave "Allow public client flows" disabled.
 *
 * 5. Under API permissions, add Microsoft Graph delegated permissions:
 *      - User.Read            (basic profile for the account chip)
 *      - Sites.Read.All       (search across SharePoint sites)
 *      - Files.Read           (open / preview documents)
 *    Then grant admin consent.
 *
 * 6. Wire the flow up in src/auth/AuthContext.js — every place that currently
 *    runs in "demo mode" is marked with a TODO(Entra ID) comment.
 * ────────────────────────────────────────────────────────────────────────────
 */

export const msalConfig = {
  auth: {
    // TODO(Entra ID): paste your Application (client) ID here
    clientId: 'YOUR_ENTRA_CLIENT_ID',
    // TODO(Entra ID): paste your Directory (tenant) ID here
    authority: 'https://login.microsoftonline.com/YOUR_TENANT_ID',
    redirectUri: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
    postLogoutRedirectUri: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
    navigateToLoginRequestUrl: true,
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false,
  },
};

/** Scopes requested at sign-in (must match step 5 above). */
export const loginRequest = {
  scopes: ['User.Read', 'Sites.Read.All', 'Files.Read'],
};

/**
 * Placeholder account used while the portal runs in demo mode
 * (i.e. before MSAL is configured). Remove once Entra ID is live.
 */
export const DEMO_ACCOUNT = {
  name: 'Demo User',
  email: 'demo.user@gov.za',
  username: 'demo.user@gov.za',
  roles: ['AllStaff'],
  isDemo: true,
};
